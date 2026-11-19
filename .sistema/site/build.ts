/**
 * Gerador do site do vault: lê as notas do Obsidian e gera HTML estático pro GitHub Pages.
 * O site é feito pra ser lido no celular (uma coluna só, sumário em folha de baixo pra cima).
 *
 *   node build.ts [--vault <pasta do vault>] [--out <pasta de saída>] [--detalhes]
 *
 * O que entra no site está em site.config.json (título e pastas publicadas).
 * Suporta: [[links]] (com #seção e |apelido), ![[embeds]] de imagem, callouts (inclusive
 * aninhados e recolhíveis com + / -), comentários %% %%, frontmatter e código colorido.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import hljs from "highlight.js";

// ---------- configuração ----------

/** Cada pasta publicada vira uma "coleção" com cor própria (faixa do topo, números, fichas). */
type PastaConfig = string | { pasta: string; cor?: string };
type Config = { titulo: string; pastas: PastaConfig[] };

const aqui = import.meta.dirname;
const arg = (nome: string) => {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const VAULT = path.resolve(arg("--vault") ?? path.join(aqui, "..", ".."));
const SAIDA = path.resolve(arg("--out") ?? path.join(aqui, "dist"));
const config: Config = JSON.parse(readFileSync(path.join(aqui, "site.config.json"), "utf8"));

/** Cores de reserva (estilo coleções de livro de bolso) pra pasta sem "cor" no config. */
const CORES_RESERVA = ["#1f5c99", "#0f7a55", "#b5501a", "#7a3b8f", "#a8283f", "#2f6f73"];
const COR_VALIDA = /^#[0-9a-f]{6}$/i;
const colecoes = config.pastas.map((c, i) => {
  const pasta = typeof c === "string" ? c : c.pasta;
  const pedida = typeof c === "string" ? undefined : c.cor;
  if (pedida && !COR_VALIDA.test(pedida)) console.warn(`⚠️  Cor "${pedida}" de "${pasta}" não é #rrggbb, usando a de reserva.`);
  return { pasta, cor: pedida && COR_VALIDA.test(pedida) ? pedida : CORES_RESERVA[i % CORES_RESERVA.length] };
});

/** Fontes hospedadas no próprio site (nada de Google Fonts): [pacote npm, arquivo]. */
const FONTES: [string, string][] = [
  ["@fontsource-variable/source-serif-4", "source-serif-4-latin-opsz-normal.woff2"],
  ["@fontsource-variable/source-serif-4", "source-serif-4-latin-ext-opsz-normal.woff2"],
  ["@fontsource-variable/source-serif-4", "source-serif-4-latin-opsz-italic.woff2"],
  ["@fontsource-variable/source-serif-4", "source-serif-4-latin-ext-opsz-italic.woff2"],
  ["@fontsource-variable/source-sans-3", "source-sans-3-latin-wght-normal.woff2"],
  ["@fontsource-variable/source-sans-3", "source-sans-3-latin-ext-wght-normal.woff2"],
  ["@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2"],
  ["@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-ext-wght-normal.woff2"],
];

/** Só scripts e estilos do próprio site; HTML solto numa nota não consegue rodar JavaScript. */
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

// ---------- utilidades ----------

const posix = path.posix;
const IMAGENS = /\.(png|jpe?g|gif|webp|svg|avif)$/i;
const ESQUEMAS_PERMITIDOS = /^(https?|mailto|tel):/i;

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "02 - Fundamentos" -> "02-fundamentos" (sem acento, seguro pra URL). */
const slugSegmento = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "x";

/** Id de título, igual pra "## Agora é com você" e pro link [[Nota#Agora é com você]]. */
const slugAncora = (s: string) =>
  s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");

/** Texto puro de um trecho Markdown inline (pra gerar ids). */
const textoPuro = (s: string) =>
  s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/[`*_~]/g, "");

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

const naturalmente =(a: string, b: string) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" });

const decodificar = (s: string) => {
  try {
    return decodeURI(s);
  } catch {
    return s;
  }
};

/** Caminho relativo de uma página de saída até outra (ou até um arquivo). */
const relativo = (de: string, para: string) => {
  const r = posix.relative(posix.dirname(de), para);
  return r === "" ? posix.basename(para) : r;
};
const raizDe = (saida: string) => {
  const d = posix.dirname(saida);
  return d === "." ? "" : d.split("/").map(() => "..").join("/") + "/";
};
const urlSegura = (p: string) => p.split("/").map(encodeURIComponent).join("/");

function lerFrontmatter(bruto: string): { campos: Record<string, string>; corpo: string } {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(bruto);
  if (!m) return { campos: {}, corpo: bruto };
  const campos: Record<string, string> = {};
  for (const linha of m[1].split("\n")) {
    const c = /^([\w-]+):\s*(.*)$/.exec(linha);
    if (c) campos[c[1]] = c[2].trim().replace(/^["']|["']$/g, "");
  }
  return { campos, corpo: bruto.slice(m[0].length) };
}

// ---------- coleta das notas ----------

type Pagina = {
  rel: string; //   caminho no vault, ex: "Programação/02 - Fundamentos/Funções/Funções.md"
  saida: string; // caminho no site, ex: "programacao/02-fundamentos/funcoes/funcoes.html"
  nome: string; //  nome do arquivo sem .md
  titulo: string;
  campos: Record<string, string>;
  md: string;
};
type Arquivo = { rel: string; saida: string };

const paginas: Pagina[] = [];
const arquivos: Arquivo[] = [];
const saidasUsadas = new Set<string>(["index.html"]);

function saidaUnica(desejada: string) {
  let s = desejada;
  for (let n = 2; saidasUsadas.has(s); n++) s = desejada.replace(/(\.[^./]+)$/, `-${n}$1`);
  saidasUsadas.add(s);
  return s;
}

function lerNota(rel: string) {
  const bruto = readFileSync(path.join(VAULT, rel), "utf8").replace(/\r\n?/g, "\n");
  const { campos, corpo } = lerFrontmatter(bruto);
  const nome = posix.basename(rel).replace(/\.md$/i, "");
  const h1 = /^# (.+)$/m.exec(corpo.replace(/```[\s\S]*?```/g, ""));
  const saida = saidaUnica(rel.replace(/\.md$/i, "").split("/").map(slugSegmento).join("/") + ".html");
  paginas.push({ rel, saida, nome, titulo: h1 ? textoPuro(h1[1]).trim() : nome, campos, md: corpo });
}

function varrer(relPasta: string) {
  for (const e of readdirSync(path.join(VAULT, relPasta), { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const rel = posix.join(relPasta, e.name);
    if (e.isDirectory()) varrer(rel);
    else if (/\.md$/i.test(e.name)) lerNota(rel);
    else {
      const ext = posix.extname(e.name);
      const base = rel.slice(0, rel.length - ext.length).split("/").map(slugSegmento).join("/");
      arquivos.push({ rel, saida: saidaUnica(base + ext.toLowerCase()) });
    }
  }
}

for (const { pasta } of colecoes) {
  if (existsSync(path.join(VAULT, pasta))) varrer(pasta);
  else console.warn(`⚠️  Pasta "${pasta}" não existe no vault, pulando.`);
}

// ---------- resolução de links (igual ao Obsidian: pelo nome mais curto) ----------

const porNome = new Map<string, Pagina[]>();
const porCaminho = new Map<string, Pagina>();
for (const p of paginas) {
  const chave = p.nome.toLowerCase();
  porNome.set(chave, [...(porNome.get(chave) ?? []), p].sort((a, b) => a.rel.length - b.rel.length));
  porCaminho.set(p.rel.replace(/\.md$/i, "").toLowerCase(), p);
}

function acharPagina(alvo: string): Pagina | undefined {
  const t = alvo.trim().replace(/\.md$/i, "").toLowerCase();
  if (!t) return undefined;
  if (porCaminho.has(t)) return porCaminho.get(t);
  const candidatas = porNome.get(posix.basename(t)) ?? [];
  return candidatas.find((p) => p.rel.toLowerCase().replace(/\.md$/i, "").endsWith(t)) ?? (t.includes("/") ? undefined : candidatas[0]);
}

function acharArquivo(alvo: string): Arquivo | undefined {
  const t = alvo.trim().toLowerCase();
  return arquivos.find((a) => a.rel.toLowerCase() === t) ?? arquivos.find((a) => a.rel.toLowerCase().endsWith("/" + t));
}

// ---------- Markdown -> HTML ----------

let atual: { saida: string; rel: string }; // página sendo gerada (os links são relativos a ela)
let idsUsados = new Map<string, number>();
const linksQuebrados = new Map<string, Set<string>>();

function anotarQuebrado(alvo: string) {
  linksQuebrados.set(alvo, (linksQuebrados.get(alvo) ?? new Set()).add(atual.rel));
}

function idUnico(texto: string) {
  const base = slugAncora(texto) || "secao";
  const n = idsUsados.get(base) ?? 0;
  idsUsados.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}

const ROTULOS: Record<string, string> = {
  note: "Nota", abstract: "Resumo", summary: "Resumo", tldr: "Resumo", info: "Info", todo: "A fazer",
  tip: "Dica", hint: "Dica", important: "Importante", success: "Resposta", check: "Resposta", done: "Feito",
  question: "Pergunta", help: "Ajuda", faq: "Pergunta", warning: "Atenção", caution: "Atenção", attention: "Atenção",
  failure: "Falhou", fail: "Falhou", missing: "Faltando", danger: "Perigo", error: "Erro", bug: "Bug",
  example: "Exemplo", quote: "Citação", cite: "Citação",
};

/** Agrupa os tipos de callout em famílias visuais (o CSS estiliza a família, não cada tipo). */
const FAMILIAS: Record<string, string> = {
  question: "pergunta", help: "pergunta", faq: "pergunta",
  success: "resposta", check: "resposta", done: "resposta",
  tip: "dica", hint: "dica", important: "dica",
  warning: "atencao", caution: "atencao", attention: "atencao",
  danger: "perigo", error: "perigo", bug: "perigo", failure: "perigo", fail: "perigo", missing: "perigo",
  abstract: "resumo", summary: "resumo", tldr: "resumo",
};

const md = new Marked({ gfm: true });

md.use({
  extensions: [
    {
      // %% comentário %% em várias linhas, como bloco
      name: "comentarioBloco",
      level: "block",
      start: (src) => src.match(/^%%/m)?.index,
      tokenizer(src) {
        const m = /^%%[\s\S]*?%%[ \t]*(?:\n|$)/.exec(src);
        if (m) return { type: "comentarioBloco", raw: m[0] };
      },
      renderer: () => "",
    },
    {
      name: "comentario",
      level: "inline",
      start: (src) => (src.indexOf("%%") >= 0 ? src.indexOf("%%") : undefined),
      tokenizer(src) {
        const m = /^%%[\s\S]*?%%/.exec(src);
        if (m) return { type: "comentario", raw: m[0] };
      },
      renderer: () => "",
    },
    {
      // [[Nota]], [[Nota|apelido]], [[Nota#Seção]], [[#Seção]], ![[imagem.png]]
      name: "wikilink",
      level: "inline",
      start: (src) => {
        const i = src.search(/!?\[\[/);
        return i >= 0 ? i : undefined;
      },
      tokenizer(src) {
        const m = /^(!?)\[\[([^\[\]\n]*?)\]\]/.exec(src);
        if (m) return { type: "wikilink", raw: m[0], embed: m[1] === "!", miolo: m[2].replace(/\\\|/g, "|") };
      },
      renderer(tok) {
        const [destino, apelido] = (tok.miolo as string).split(/\|(.*)/s);
        const [arquivo, ancora] = destino.split(/#(.*)/s);
        if (!arquivo.trim() && !ancora) return "";

        if (tok.embed && IMAGENS.test(arquivo)) {
          const a = acharArquivo(arquivo);
          if (!a) return (anotarQuebrado(arquivo), `<span class="quebrado">${escapar(arquivo)}</span>`);
          return `<img src="${urlSegura(relativo(atual.saida, a.saida))}" alt="${escapar(apelido ?? "")}" loading="lazy">`;
        }

        const pagina = arquivo.trim() ? acharPagina(arquivo) : undefined;
        const mesma = !arquivo.trim() || pagina?.saida === atual.saida;
        const nomeVisivel = arquivo.trim() ? posix.basename(arquivo.trim()) : "";
        const texto = apelido?.trim() || [nomeVisivel, ancora?.trim()].filter(Boolean).join(" › ");
        if (!pagina && !mesma) return (anotarQuebrado(arquivo.trim()), `<span class="quebrado">${escapar(texto)}</span>`);
        const href = (mesma ? "" : urlSegura(relativo(atual.saida, pagina!.saida))) + (ancora ? "#" + encodeURIComponent(slugAncora(ancora)) : "");
        return `<a class="interno" href="${href}">${escapar(texto)}</a>`;
      },
    },
  ],
  renderer: {
    heading({ text, depth }) {
      return `<h${depth} id="${idUnico(textoPuro(text))}">${md.parseInline(text) as string}</h${depth}>\n`;
    },

    code({ text, lang }) {
      const lingua = (lang ?? "").trim().split(/\s+/)[0].toLowerCase();
      const html = hljs.getLanguage(lingua) ? hljs.highlight(text, { language: lingua, ignoreIllegals: true }).value : escapar(text);
      return `<pre><code class="hljs${lingua ? " language-" + escapar(lingua) : ""}">${html}</code></pre>\n`;
    },

    // Callouts: > [!tipo]+/- Título
    blockquote(token: Tokens.Blockquote) {
      const m = /^\[!([\w-]+)\]([+-]?)[ \t]*(.*)(?:\n|$)/.exec(token.text);
      if (!m) return false; // citação normal
      const tipo = m[1].toLowerCase();
      const corpo = token.text.slice(m[0].length);
      const titulo = `<span class="callout-texto">${m[3].trim() ? (md.parseInline(m[3]) as string) : escapar(ROTULOS[tipo] ?? tipo)}</span>`;
      const miolo = corpo.trim() ? `<div class="callout-corpo">${md.parse(corpo) as string}</div>` : "";
      const atributos = `class="callout" data-callout="${escapar(tipo)}" data-familia="${FAMILIAS[tipo] ?? "nota"}"`;
      if (!m[2]) return `<div ${atributos}><div class="callout-titulo">${titulo}</div>${miolo}</div>\n`;
      return `<details ${atributos}${m[2] === "+" ? " open" : ""}><summary class="callout-titulo">${titulo}</summary>${miolo}</details>\n`;
    },

    link({ href, title, tokens }) {
      const texto = this.parser.parseInline(tokens);
      const t = title ? ` title="${escapar(title)}"` : "";
      if (href.startsWith("#")) return `<a href="${escapar(href)}"${t}>${texto}</a>`;
      if (ESQUEMAS_PERMITIDOS.test(href)) {
        const fora = /^https?:/i.test(href) ? ` target="_blank" rel="noopener noreferrer"` : "";
        return `<a href="${escapar(href)}"${t}${fora}>${texto}</a>`;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return `<span>${texto}</span>`; // javascript:, data:, file:... viram texto
      // link Markdown pra outra nota: [texto](Pasta/Nota.md#seção)
      const [caminho, ancora] = decodificar(href).split(/#(.*)/s);
      const noVault = posix.normalize(posix.join(posix.dirname(atual.rel), caminho));
      const pagina = porCaminho.get(noVault.replace(/\.md$/i, "").toLowerCase()) ?? acharPagina(caminho);
      if (pagina) {
        const destino = urlSegura(relativo(atual.saida, pagina.saida)) + (ancora ? "#" + encodeURIComponent(slugAncora(ancora)) : "");
        return `<a class="interno" href="${destino}"${t}>${texto}</a>`;
      }
      const arquivo = acharArquivo(noVault) ?? acharArquivo(caminho);
      if (arquivo) return `<a href="${urlSegura(relativo(atual.saida, arquivo.saida))}"${t}>${texto}</a>`;
      anotarQuebrado(caminho);
      return `<span class="quebrado">${texto}</span>`;
    },
  },
});

// ---------- árvore (sumário) ----------

type Pasta = { nome: string; pastas: Map<string, Pasta>; paginas: Pagina[] };
const arvore: Pasta = { nome: "", pastas: new Map(), paginas: [] };
for (const p of paginas) {
  let no = arvore;
  for (const parte of p.rel.split("/").slice(0, -1)) {
    if (!no.pastas.has(parte)) no.pastas.set(parte, { nome: parte, pastas: new Map(), paginas: [] });
    no = no.pastas.get(parte)!;
  }
  no.paginas.push(p);
}

/** Pasta "Funções/" que só tem "Funções.md" vira um item só, sem sub-nível. */
const notaDaPasta = (pasta: Pasta) =>
  pasta.pastas.size === 0 && pasta.paginas.length === 1 && pasta.paginas[0].nome === pasta.nome ? pasta.paginas[0] : undefined;

type Item = { nome: string; pagina?: Pagina; pasta?: Pasta };
function itensDe(pasta: Pasta): Item[] {
  const itens: Item[] = pasta.paginas.map((p) => ({ nome: p.nome, pagina: p }));
  for (const sub of pasta.pastas.values()) {
    const unica = notaDaPasta(sub);
    itens.push(unica ? { nome: sub.nome, pagina: unica } : { nome: sub.nome, pasta: sub });
  }
  return itens.sort((a, b) => naturalmente(a.nome, b.nome));
}

/** Todas as notas de um caderno, na ordem do sumário (pra Anterior / Próxima). */
function emOrdem(pasta: Pasta): Pagina[] {
  return itensDe(pasta).flatMap((i) => (i.pagina ? [i.pagina] : emOrdem(i.pasta!)));
}

const cadernos = itensDe(arvore).filter((i) => i.pasta);
const vizinhos = new Map<Pagina, { anterior?: Pagina; proxima?: Pagina }>();
for (const c of cadernos) {
  const lista = emOrdem(c.pasta!);
  lista.forEach((p, i) => vizinhos.set(p, { anterior: lista[i - 1], proxima: lista[i + 1] }));
}

const contem = (pasta: Pasta, alvo?: Pagina): boolean =>
  !!alvo && (pasta.paginas.includes(alvo) || [...pasta.pastas.values()].some((f) => contem(f, alvo)));

function sumario(pasta: Pasta, de: string, alvo?: Pagina): string {
  const lis = itensDe(pasta).map((i) => {
    if (i.pagina) {
      const atualAttr = i.pagina === alvo ? ' aria-current="page"' : "";
      return `<li><a href="${urlSegura(relativo(de, i.pagina.saida))}"${atualAttr}>${escapar(i.nome)}</a></li>`;
    }
    const total = emOrdem(i.pasta!).length;
    const serie = pasta === arvore && colecoes.some((c) => c.pasta === i.nome) ? ` data-serie="${serieDe(i.nome)}"` : "";
    return `<li><details${serie}${contem(i.pasta!, alvo) ? " open" : ""}><summary><span>${escapar(i.nome)}</span><span class="conta">${total}</span></summary>${sumario(i.pasta!, de, alvo)}</details></li>`;
  });
  return `<ul>${lis.join("")}</ul>`;
}

// ---------- moldura das páginas ----------

function trilhaDe(p: Pagina) {
  const partes = p.rel.split("/").slice(0, -1);
  if (partes.at(-1) === p.nome) partes.pop();
  return partes;
}

const icone = {
  sumario: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  fechar: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  seguir: `<svg class="seta" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  voltar: `<svg class="seta" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  buscar: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

/** Coleção (pasta de topo) de uma nota: dá a cor da faixa e o nome no topo. */
const colecaoDe = (p?: Pagina) => (p ? colecoes.find((c) => p.rel.split("/")[0] === c.pasta) : undefined);
const serieDe = (pasta: string) => slugSegmento(pasta);

function moldura(o: { saida: string; titulo: string; classe: string; corpo: string; alvo?: Pagina }) {
  const raiz = raizDe(o.saida);
  const colecao = colecaoDe(o.alvo);
  return `<!doctype html>
<html lang="pt-BR" data-raiz="${raiz}"${o.alvo ? ` data-saida="${escapar(o.alvo.saida)}"` : ""}${colecao ? ` data-serie="${serieDe(colecao.pasta)}"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="${colecao?.cor ?? "#1b1b1b"}">
<title>${escapar(o.titulo)}</title>
<link rel="preload" href="${raiz}assets/fonts/source-serif-4-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${raiz}assets/fonts/source-sans-3-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${raiz}assets/site.css">
<link rel="stylesheet" href="${raiz}assets/colecoes.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📓</text></svg>">
<script src="${raiz}assets/site.js" defer></script>
</head>
<body class="${o.classe}">
<a class="pular" href="#conteudo">Pular para o texto</a>
<header class="topo">
  <a class="marca" href="${raiz}index.html">${escapar(colecao?.pasta ?? config.titulo)}</a>
  <button class="abrir-sumario" type="button" aria-controls="folha" aria-expanded="false">${icone.sumario}<span>Sumário</span></button>
  <div class="progresso" aria-hidden="true"></div>
</header>
<div class="folha" id="folha" role="dialog" aria-modal="true" aria-label="Sumário" hidden>
  <div class="folha-cabeca">
    <div class="folha-topo">
      <h2>Sumário</h2>
      <button class="fechar-sumario" type="button" aria-label="Fechar o sumário">${icone.fechar}</button>
    </div>
    <label class="busca">${icone.buscar}<input type="search" placeholder="Buscar uma nota" aria-label="Buscar uma nota" autocomplete="off" enterkeyhint="go"></label>
  </div>
  <ul class="resultados" hidden></ul>
  <nav class="arvore" aria-label="Todas as notas">${sumario(arvore, o.saida, o.alvo)}</nav>
</div>
<main id="conteudo">
${o.corpo}
</main>
</body>
</html>
`;
}

/** Posição da nota dentro da seção (a pasta logo abaixo do caderno), pra "capítulo 5 de 13". */
function posicaoNaSecao(p: Pagina) {
  const partes = p.rel.split("/");
  let no = arvore;
  for (const parte of partes.slice(0, Math.min(2, partes.length - 1))) no = no.pastas.get(parte) ?? no;
  const lista = emOrdem(no);
  return { n: lista.indexOf(p) + 1, total: lista.length };
}

const minutosDeLeitura = (md: string) =>
  Math.max(1, Math.round(md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length / 200));

function paginaDeNota(p: Pagina, html: string) {
  const { anterior, proxima } = vizinhos.get(p) ?? {};
  const href = (alvo: Pagina) => urlSegura(relativo(p.saida, alvo.saida));
  const trilha = trilhaDe(p).slice(1); // o caderno já aparece na faixa do topo
  const { n, total } = posicaoNaSecao(p);
  const meta = [
    trilha.length ? trilha.map(escapar).join(" › ") : "",
    total > 1 && n > 0 ? `capítulo ${n} de ${total}` : "",
    `${minutosDeLeitura(p.md)} min de leitura`,
  ].filter(Boolean);
  // O primeiro "# Título" da nota vira a capa do capítulo (e sai do corpo pra não repetir).
  // Seção sem nada embaixo (ex.: "Minhas anotações" ainda em branco) vira espaço de escrita discreto.
  const corpoNota = html
    .replace(/^\s*<h1 id="[^"]*">[\s\S]*?<\/h1>\n?/, "")
    .replace(/<h2 (id="[^"]*")>([\s\S]*?)<\/h2>\n?(?=\s*(?:<h[12][ >]|<hr>|$))/g, '<h2 $1 class="vazia">$2</h2>\n');
  const posicaoDe = (alvo: Pagina) => {
    const { n: i, total: t } = posicaoNaSecao(alvo);
    return t > 1 && i > 0 ? `capítulo ${i} de ${t}` : "";
  };
  const corpo = `<header class="capitulo">
  <h1>${escapar(p.titulo)}</h1>
  <p class="meta">${meta.join(`<span aria-hidden="true"> · </span>`)}</p>
</header>
<article class="nota">${corpoNota}</article>
<nav class="vizinhos" aria-label="Notas vizinhas">${
    proxima
      ? `<a class="proxima" href="${href(proxima)}" rel="next" aria-label="Próximo capítulo: ${escapar(proxima.nome)}"><span class="nome">${escapar(proxima.nome)}${icone.seguir}</span><span class="meta">${escapar(posicaoDe(proxima) || trilhaDe(proxima).slice(1).join(" › "))}</span></a>`
      : ""
  }${anterior ? `<a class="anterior" href="${href(anterior)}" rel="prev" aria-label="Capítulo anterior: ${escapar(anterior.nome)}">${icone.voltar}<span class="nome">${escapar(anterior.nome)}</span></a>` : ""}</nav>`;
  return moldura({ saida: p.saida, titulo: `${p.titulo} | ${config.titulo}`, classe: "pagina-nota", corpo, alvo: p });
}

function paginaInicial() {
  const saida = "index.html";
  const trilhas = paginas.filter((p) => p.campos.tipo === "trilha").sort((a, b) => naturalmente(a.nome, b.nome));
  // Cada caderno publicado vira uma "lombada" na cor da coleção, com as notas dele embaixo.
  const capas = colecoes
    .filter((c) => arvore.pastas.has(c.pasta))
    .map((c) => {
      const pasta = arvore.pastas.get(c.pasta)!;
      const id = `col-${serieDe(c.pasta)}`;
      return `<section class="colecao" data-serie="${serieDe(c.pasta)}" aria-labelledby="${id}">
  <h2 class="lombada" id="${id}"><span>${escapar(c.pasta)}</span><span class="conta">${plural(emOrdem(pasta).length, "nota", "notas")}</span></h2>
  <nav class="arvore" aria-label="${escapar(c.pasta)}">${sumario(pasta, saida)}</nav>
</section>`;
    });
  const corpo = `<section class="capa">
  <h1>${escapar(config.titulo)}</h1>
  <p class="resumo">${plural(paginas.length, "nota", "notas")} em ${plural(capas.length, "caderno", "cadernos")}</p>
  <p class="continuar" hidden><a href="#" aria-label="Continuar de onde parou"><span class="nome"></span><span class="meta"></span></a></p>
</section>
${trilhas.length ? `<section class="trilhas" aria-labelledby="comecar">
  <h2 id="comecar">Por onde começar</h2>
  <ul>${trilhas.map((t) => `<li data-serie="${serieDe(t.rel.split("/")[0])}"><a href="${urlSegura(t.saida)}"><span class="nome">${escapar(t.titulo)}</span><span class="caderno">${escapar(t.rel.split("/")[0])}</span></a></li>`).join("")}</ul>
</section>` : ""}
${capas.join("\n")}`;
  return moldura({ saida, titulo: config.titulo, classe: "pagina-inicial", corpo });
}

// ---------- gerar ----------

rmSync(SAIDA, { recursive: true, force: true });
const gravar = (rel: string, conteudo: string) => {
  const destino = path.join(SAIDA, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, conteudo);
};
const copiar = (de: string, para: string) => {
  mkdirSync(path.dirname(para), { recursive: true });
  copyFileSync(de, para);
};

for (const p of paginas) {
  atual = p;
  idsUsados = new Map();
  gravar(p.saida, paginaDeNota(p, md.parse(p.md) as string));
}
atual = { saida: "index.html", rel: "" };
gravar("index.html", paginaInicial());

for (const a of arquivos) copiar(path.join(VAULT, a.rel), path.join(SAIDA, a.saida));
for (const nome of readdirSync(path.join(aqui, "assets"))) copiar(path.join(aqui, "assets", nome), path.join(SAIDA, "assets", nome));
for (const [pacote, arquivo] of FONTES) copiar(path.join(aqui, "node_modules", pacote, "files", arquivo), path.join(SAIDA, "assets", "fonts", arquivo));

gravar(
  "assets/busca.json",
  JSON.stringify(paginas.map((p) => ({ t: p.nome, s: trilhaDe(p).join(" / "), u: p.saida }))),
);
gravar(".nojekyll", "");
// Cor de cada coleção num arquivo próprio (a CSP não deixa estilo inline).
gravar(
  "assets/colecoes.css",
  colecoes.map((c) => `[data-serie="${serieDe(c.pasta)}"] { --serie: ${c.cor}; }`).join("\n") + "\n",
);

console.log(`✅ ${paginas.length} notas e ${arquivos.length} arquivos -> ${SAIDA}`);
if (linksQuebrados.size) {
  console.log(`🔗 ${linksQuebrados.size} links apontam pra notas que ainda não existem (aparecem apagados no site).`);
  if (process.argv.includes("--detalhes"))
    for (const [alvo, onde] of linksQuebrados) console.log(`   [[${alvo}]] em ${[...onde].join(", ")}`);
}

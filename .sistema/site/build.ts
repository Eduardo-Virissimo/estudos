/**
 * Gerador do site do vault: lê as notas do Obsidian e gera HTML estático pro GitHub Pages.
 *
 *   node build.ts [--vault <pasta do vault>] [--out <pasta de saída>]
 *
 * O que entra no site está em site.config.json (título, nota inicial e pastas publicadas).
 * Suporta: [[links]] (com #seção e |apelido), ![[embeds]] de imagem, callouts (inclusive
 * aninhados e recolhíveis com + / -), comentários %% %%, frontmatter e código colorido.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import hljs from "highlight.js";

// ---------- configuração ----------

type Config = { titulo: string; inicio: string; pastas: string[] };

const aqui = import.meta.dirname;
const arg = (nome: string) => {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const VAULT = path.resolve(arg("--vault") ?? path.join(aqui, "..", ".."));
const SAIDA = path.resolve(arg("--out") ?? path.join(aqui, "dist"));
const config: Config = JSON.parse(readFileSync(path.join(aqui, "site.config.json"), "utf8"));

// ---------- utilidades ----------

const posix = path.posix;
const IMAGENS = /\.(png|jpe?g|gif|webp|svg|avif)$/i;

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

const naturalmente = (a: string, b: string) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" });

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

// ---------- coleta das notas ----------

type Pagina = {
  rel: string; //   caminho no vault, ex: "Programação/02 - Fundamentos/Funções/Funções.md"
  saida: string; // caminho no site, ex: "programacao/02-fundamentos/funcoes/funcoes.html"
  nome: string; //  nome do arquivo sem .md
  titulo: string;
  md: string;
};
type Arquivo = { rel: string; saida: string };

const paginas: Pagina[] = [];
const arquivos: Arquivo[] = [];
const saidasUsadas = new Set<string>();

function saidaUnica(desejada: string) {
  let s = desejada;
  for (let n = 2; saidasUsadas.has(s); n++) s = desejada.replace(/(\.[^./]+)$/, `-${n}$1`);
  saidasUsadas.add(s);
  return s;
}

function lerNota(rel: string, saida: string) {
  const bruto = readFileSync(path.join(VAULT, rel), "utf8").replace(/\r\n?/g, "\n");
  const md = bruto.replace(/^---\n[\s\S]*?\n---\n?/, ""); // tira o frontmatter
  const nome = posix.basename(rel).replace(/\.md$/i, "");
  const h1 = /^# (.+)$/m.exec(md.replace(/```[\s\S]*?```/g, ""));
  paginas.push({ rel, saida: saidaUnica(saida), nome, titulo: h1 ? textoPuro(h1[1]).trim() : nome, md });
}

function varrer(relPasta: string) {
  for (const e of readdirSync(path.join(VAULT, relPasta), { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const rel = posix.join(relPasta, e.name);
    if (e.isDirectory()) varrer(rel);
    else if (/\.md$/i.test(e.name)) lerNota(rel, rel.replace(/\.md$/i, "").split("/").map(slugSegmento).join("/") + ".html");
    else {
      const ext = posix.extname(e.name);
      const base = rel.slice(0, rel.length - ext.length).split("/").map(slugSegmento).join("/");
      arquivos.push({ rel, saida: saidaUnica(base + ext.toLowerCase()) });
    }
  }
}

saidasUsadas.add("index.html");
lerNota(config.inicio, "index.html");
paginas[0].saida = "index.html";
for (const pasta of config.pastas) {
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

let atual: Pagina; //                   página sendo gerada (os links são relativos a ela)
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
      start: (src) => src.indexOf("%%") >= 0 ? src.indexOf("%%") : undefined,
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

        const pagina = arquivo.trim() ? acharPagina(arquivo) : atual;
        const nomeVisivel = arquivo.trim() ? posix.basename(arquivo.trim()) : "";
        const texto = apelido?.trim() || [nomeVisivel, ancora?.trim()].filter(Boolean).join(" › ");
        if (!pagina) return (anotarQuebrado(arquivo.trim()), `<span class="quebrado" title="Nota ainda não escrita">${escapar(texto)}</span>`);
        const href = (pagina === atual ? "" : urlSegura(relativo(atual.saida, pagina.saida))) + (ancora ? "#" + encodeURIComponent(slugAncora(ancora)) : "");
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
      const titulo = `<span class="callout-texto">${m[3].trim() ? (md.parseInline(m[3]) as string) : ROTULOS[tipo] ?? tipo}</span>`;
      const miolo = corpo.trim() ? `<div class="callout-corpo">${md.parse(corpo) as string}</div>` : "";
      const atributos = `class="callout" data-callout="${escapar(tipo)}"`;
      if (!m[2]) return `<div ${atributos}><div class="callout-titulo">${titulo}</div>${miolo}</div>\n`;
      return `<details ${atributos}${m[2] === "+" ? " open" : ""}><summary class="callout-titulo">${titulo}</summary>${miolo}</details>\n`;
    },

    link({ href, title, tokens }) {
      const texto = this.parser.parseInline(tokens);
      const t = title ? ` title="${escapar(title)}"` : "";
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) {
        const fora = /^https?:/i.test(href) ? ` target="_blank" rel="noopener"` : "";
        return `<a href="${escapar(href)}"${t}${fora}>${texto}</a>`;
      }
      // link Markdown pra outra nota: [texto](Pasta/Nota.md#seção)
      const [caminho, ancora] = decodeURI(href).split(/#(.*)/s);
      const noVault = posix.normalize(posix.join(posix.dirname(atual.rel), caminho));
      const pagina = porCaminho.get(noVault.replace(/\.md$/i, "").toLowerCase()) ?? acharPagina(caminho);
      if (pagina) {
        const destino = urlSegura(relativo(atual.saida, pagina.saida)) + (ancora ? "#" + encodeURIComponent(slugAncora(ancora)) : "");
        return `<a class="interno" href="${destino}"${t}>${texto}</a>`;
      }
      const arquivo = acharArquivo(noVault) ?? acharArquivo(caminho);
      if (arquivo) return `<a href="${urlSegura(relativo(atual.saida, arquivo.saida))}"${t}>${texto}</a>`;
      anotarQuebrado(caminho);
      return `<span class="quebrado" title="Não publicado no site">${texto}</span>`;
    },
  },
});

// ---------- menu lateral ----------

type Pasta = { nome: string; pastas: Map<string, Pasta>; paginas: Pagina[] };
const arvore: Pasta = { nome: "", pastas: new Map(), paginas: [] };
for (const p of paginas.slice(1)) {
  const partes = p.rel.split("/").slice(0, -1);
  let no = arvore;
  for (const parte of partes) {
    if (!no.pastas.has(parte)) no.pastas.set(parte, { nome: parte, pastas: new Map(), paginas: [] });
    no = no.pastas.get(parte)!;
  }
  no.paginas.push(p);
}

/** Pasta "Funções/" que só tem "Funções.md" vira um item só, sem sub-nível. */
const notaDaPasta = (pasta: Pasta) =>
  pasta.pastas.size === 0 && pasta.paginas.length === 1 && pasta.paginas[0].nome === pasta.nome ? pasta.paginas[0] : undefined;

const contem = (pasta: Pasta, alvo: Pagina): boolean =>
  pasta.paginas.includes(alvo) || [...pasta.pastas.values()].some((f) => contem(f, alvo));

function menu(pasta: Pasta, pagina: Pagina): string {
  type Item = { nome: string; html: string };
  const link = (p: Pagina, nome: string): Item => ({
    nome,
    html: `<li><a href="${urlSegura(relativo(pagina.saida, p.saida))}"${p === pagina ? ' aria-current="page"' : ""}>${escapar(nome)}</a></li>`,
  });
  const itens: Item[] = pasta.paginas.map((p) => link(p, p.nome));
  for (const sub of pasta.pastas.values()) {
    const unica = notaDaPasta(sub);
    if (unica) itens.push(link(unica, sub.nome));
    else itens.push({
      nome: sub.nome,
      html: `<li><details${contem(sub, pagina) ? " open" : ""}><summary>${escapar(sub.nome)}</summary>${menu(sub, pagina)}</details></li>`,
    });
  }
  return `<ul>${itens.sort((a, b) => naturalmente(a.nome, b.nome)).map((i) => i.html).join("")}</ul>`;
}

// ---------- página ----------

function trilhaDe(p: Pagina) {
  const partes = p.rel.split("/").slice(0, -1);
  if (partes.at(-1) === p.nome) partes.pop();
  return partes.map(escapar).join(" <span aria-hidden=\"true\">›</span> ");
}

function html(p: Pagina, corpo: string) {
  const raiz = raizDe(p.saida);
  const inicio = p.saida === "index.html";
  return `<!doctype html>
<html lang="pt-BR" data-raiz="${raiz}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(inicio ? config.titulo : `${p.titulo} · ${config.titulo}`)}</title>
<link rel="stylesheet" href="${raiz}assets/site.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
<script src="${raiz}assets/site.js" defer></script>
</head>
<body>
<header class="topo">
  <button class="botao-menu" type="button" aria-label="Abrir o menu" aria-expanded="false" aria-controls="lateral">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </button>
  <a class="marca" href="${raiz}index.html">${escapar(config.titulo)}</a>
  <div class="busca">
    <input type="search" placeholder="Buscar nota…" aria-label="Buscar nota" autocomplete="off">
    <ul class="resultados" hidden></ul>
  </div>
</header>
<div class="layout">
  <nav class="lateral" id="lateral" aria-label="Notas">
    <a class="inicio${inicio ? " atual" : ""}" href="${raiz}index.html">🏠 Início</a>
    ${menu(arvore, p)}
  </nav>
  <div class="veu" hidden></div>
  <main class="conteudo">
    ${inicio ? "" : `<p class="trilha">${trilhaDe(p)}</p>`}
    <article>${corpo}</article>
  </main>
</div>
</body>
</html>
`;
}

// ---------- gerar ----------

rmSync(SAIDA, { recursive: true, force: true });
const gravar = (rel: string, conteudo: string) => {
  const destino = path.join(SAIDA, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, conteudo);
};

for (const p of paginas) {
  atual = p;
  idsUsados = new Map();
  gravar(p.saida, html(p, md.parse(p.md) as string));
}
for (const a of arquivos) {
  mkdirSync(path.dirname(path.join(SAIDA, a.saida)), { recursive: true });
  copyFileSync(path.join(VAULT, a.rel), path.join(SAIDA, a.saida));
}
for (const nome of readdirSync(path.join(aqui, "assets"))) {
  mkdirSync(path.join(SAIDA, "assets"), { recursive: true });
  copyFileSync(path.join(aqui, "assets", nome), path.join(SAIDA, "assets", nome));
}
gravar("assets/busca.json", JSON.stringify(paginas.slice(1).map((p) => ({ t: p.nome, s: trilhaDe(p).replace(/<[^>]+>/g, ""), u: p.saida }))));
gravar(".nojekyll", "");

console.log(`✅ ${paginas.length} notas e ${arquivos.length} arquivos -> ${SAIDA}`);
if (linksQuebrados.size) {
  console.log(`🔗 ${linksQuebrados.size} links apontam pra notas que ainda não existem (aparecem apagados no site).`);
  if (process.argv.includes("--detalhes"))
    for (const [alvo, onde] of linksQuebrados) console.log(`   [[${alvo}]] em ${[...onde].join(", ")}`);
}

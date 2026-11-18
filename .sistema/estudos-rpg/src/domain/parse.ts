// Leitura do Markdown das notas. Funções puras: recebem texto, devolvem dados.
// O Obsidian não aparece aqui, por isso dá pra testar com `npm test`.

import type { Regiao, Topico } from "./types.ts";

const EMOJI = /\p{Extended_Pictographic}|️|‍|⃣/gu;

/** "# 1️⃣ Ferramentas ⭐" -> "Ferramentas" */
export function limparTitulo(t: string): string {
  return t.replace(/^(?:[0-9#*]️?⃣\s*)+/u, "").replace(EMOJI, "").replace(/\s+/g, " ").trim();
}

const CHECKBOX = /^\s*-\s\[([ xX])\]\s+(.*)$/;
const WIKILINK = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/;

/**
 * Lê uma trilha: títulos `#`/`##` viram regiões, checklists com wikilink viram tópicos.
 * `resolver` transforma o alvo do link no caminho da nota (ou null se não existe).
 */
export function parseTrilha(texto: string, resolver: (alvo: string) => string | null): Regiao[] {
  const regioes: Regiao[] = [];
  let atual: Regiao | null = null;
  let emFrontmatter = false;
  let emCodigo = false;
  let grupo = "";

  texto.split(/\r?\n/).forEach((linha, i) => {
    if (i === 0 && linha === "---") { emFrontmatter = true; return; }
    if (emFrontmatter) { if (linha === "---") emFrontmatter = false; return; }
    if (/^\s*(```|~~~)/.test(linha)) { emCodigo = !emCodigo; return; }
    if (emCodigo) return;

    const h = linha.match(/^(#{1,2})\s+(.*)$/);
    if (h) {
      const nome = limparTitulo(h[2] ?? "");
      const nivelTitulo = (h[1]?.length ?? 1) as 1 | 2;
      if (nivelTitulo === 1) grupo = nome;
      atual = { nome, nivelTitulo, grupo, destaque: /⭐/.test(h[2] ?? ""), desc: "", topicos: [] };
      regioes.push(atual);
      return;
    }
    if (!atual) return;
    const regiao: Regiao = atual;

    const q = linha.match(/^>\s?(.*)$/);
    if (q) { if (!regiao.desc && !regiao.topicos.length) regiao.desc = (q[1] ?? "").trim(); return; }

    const c = linha.match(CHECKBOX);
    if (!c) return;
    const resto = c[2] ?? "";
    const link = resto.match(WIKILINK);
    if (!link) return;
    const alvo = (link[1] ?? "").trim();
    let label = link[2]?.trim() || alvo.split("/").pop() || alvo;
    if (label.toLowerCase() === "readme") { const p = alvo.split("/"); label = p[p.length - 2] ?? label; }
    const depois = resto.slice(resto.indexOf(link[0]) + link[0].length);
    const traco = depois.search(/[—–-]\s/);
    const desc = (traco >= 0 ? depois.slice(traco + 1) : depois).replace(/[`*_]/g, "").trim();

    const topico: Topico = { label, alvo, desc, feito: (c[1] ?? " ").toLowerCase() === "x", linha: i, raw: linha, caminho: resolver(alvo) };
    regiao.topicos.push(topico);
  });

  return regioes.filter((r) => r.topicos.length > 0);
}

export interface PerguntaLida {
  pergunta: string;
  /** Pergunta aberta: a resposta. Múltipla escolha: a explicação (começa com `**b)**`). */
  resposta: string;
  /** Só em múltipla escolha: o texto de cada alternativa, na ordem a, b, c... */
  alternativas?: string[];
  /** Índice da alternativa certa; ausente se a explicação não começar com uma letra válida. */
  correta?: number;
}

const ALTERNATIVA = /^-\s+([a-z])\)\s+(.*)$/;
const juntar = (linhas: string[]) => linhas.join(" ").replace(/\s+/g, " ").trim();

/**
 * Extrai perguntas de callouts `> [!question]- Pergunta` + linhas `> resposta`.
 * Múltipla escolha: linhas `> - a) ...` e a explicação num callout aninhado
 * `> > [!check]- Resposta` / `> > **b)** porque...`.
 * Ignora placeholders do template (`[Pergunta 1...]`).
 */
export function parsePerguntas(texto: string): PerguntaLida[] {
  const out: PerguntaLida[] = [];
  const re = /^> \[!question\][-+]?[ \t]*(.+)\n((?:>.*(?:\n|$))*)/gm;
  const t = texto.replace(/\r\n/g, "\n");
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const pergunta = (m[1] ?? "").trim();
    const corpo = (m[2] ?? "").split("\n").map((l) => l.replace(/^>\s?/, ""));
    const alternativas = corpo.map((l) => l.match(ALTERNATIVA)?.[2]?.trim()).filter((x): x is string => !!x);

    let resposta: string;
    let correta: number | undefined;
    if (alternativas.length) {
      const explicacao = corpo.filter((l) => /^>/.test(l) && !/^>\s?\[!/.test(l)).map((l) => l.replace(/^>\s?/, ""));
      resposta = juntar(explicacao);
      const letra = resposta.match(/^\**([a-z])\)/)?.[1];
      const idx = letra ? letra.charCodeAt(0) - 97 : -1;
      if (idx >= 0 && idx < alternativas.length) correta = idx;
    } else {
      resposta = juntar(corpo);
    }

    if (!pergunta || /^\[.*\]$/.test(pergunta) || !resposta || /^\[.*\]$/.test(resposta)) continue;
    out.push(alternativas.length ? { pergunta, resposta, alternativas, ...(correta !== undefined && { correta }) } : { pergunta, resposta });
  }
  return out;
}

/** Troca `[ ]` por `[x]` (e vice-versa) numa linha. */
export function alternarCheckbox(linha: string): string {
  return /\[[xX]\]/.test(linha) ? linha.replace(/\[[xX]\]/, "[ ]") : linha.replace(/\[ \]/, "[x]");
}

/** Remove a sintaxe de wikilink pra exibir: `[[a|b]]` -> `b`, `[[a]]` -> `a`. */
export function semWikilinks(t: string): string {
  return t.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2");
}

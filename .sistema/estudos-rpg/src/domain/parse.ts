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

/**
 * Extrai perguntas de callouts `> [!question]- Pergunta` + linhas `> resposta`.
 * Ignora placeholders do template (`[Pergunta 1...]`).
 */
export function parsePerguntas(texto: string): { pergunta: string; resposta: string }[] {
  const out: { pergunta: string; resposta: string }[] = [];
  const re = /^> \[!question\][-+]?[ \t]*(.+)\n((?:>.*(?:\n|$))*)/gm;
  const t = texto.replace(/\r\n/g, "\n");
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const pergunta = (m[1] ?? "").trim();
    const resposta = (m[2] ?? "").split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").replace(/\s+/g, " ").trim();
    if (!pergunta || /^\[.*\]$/.test(pergunta) || !resposta || /^\[.*\]$/.test(resposta)) continue;
    out.push({ pergunta, resposta });
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

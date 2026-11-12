// Treino misto: escolhe perguntas de notas DIFERENTES, intercaladas
// (misturar assuntos ajuda a diferenciar conceitos parecidos).

import type { Pergunta } from "./types.ts";

export type Rng = () => number;

export function embaralhar<T>(lista: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

/**
 * Monta `n` perguntas em rodízio entre as notas: uma de cada nota antes de repetir nota.
 * E se houver menos de `n` perguntas? Devolve todas as que existem.
 */
export function montarTreino(perguntas: readonly Pergunta[], n: number, rng: Rng = Math.random): Pergunta[] {
  const porNota = new Map<string, Pergunta[]>();
  for (const p of embaralhar(perguntas, rng)) {
    const lista = porNota.get(p.caminho) ?? [];
    lista.push(p);
    porNota.set(p.caminho, lista);
  }
  const filas = embaralhar([...porNota.values()], rng);
  const out: Pergunta[] = [];
  for (let rodada = 0; out.length < n && filas.some((f) => f.length > rodada); rodada++) {
    for (const fila of filas) {
      const p = fila[rodada];
      if (p && out.length < n) out.push(p);
    }
  }
  return out;
}

/** Pergunta do dia: a mesma o dia todo, muda no dia seguinte. */
export function indiceDoDia(hoje: string, total: number): number {
  if (total <= 0) return -1;
  let h = 0;
  for (const ch of hoje) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % total;
}

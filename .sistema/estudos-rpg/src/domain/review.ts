// Revisão espaçada no estilo Leitner.
// Cada nota tem uma "caixa" (0 = nunca revisada, 1..N). Lembrou: sobe uma caixa
// e o intervalo até a próxima revisão cresce. Esqueceu: volta para a caixa 1.

import { addDias, diffDias } from "./dates.ts";

export interface EstadoRevisao {
  caixa: number;
  revisado: string | null;
}

export interface InfoRevisao extends EstadoRevisao {
  proxima: string | null;
  vencida: boolean;
}

export function caixaMax(intervalos: number[]): number {
  return Math.max(1, intervalos.length - 1);
}

export function normalizarCaixa(v: unknown, intervalos: number[]): number {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.min(caixaMax(intervalos), Math.max(0, n)) : 0;
}

export function infoRevisao(e: EstadoRevisao, hoje: string, intervalos: number[]): InfoRevisao {
  if (!e.revisado) return { ...e, proxima: null, vencida: true };
  const dias = intervalos[Math.max(1, e.caixa)] ?? intervalos[intervalos.length - 1] ?? 1;
  const proxima = addDias(e.revisado, dias);
  return { ...e, proxima, vencida: diffDias(hoje, proxima) <= 0 };
}

export function aposLembrar(e: EstadoRevisao, intervalos: number[]): number {
  // Primeira revisão de uma nota nunca revisada entra na caixa 1.
  if (!e.revisado || e.caixa < 1) return 1;
  return Math.min(caixaMax(intervalos), e.caixa + 1);
}

export function aposEsquecer(): number {
  return 1;
}

/** Ordena: nunca revisadas primeiro, depois as mais atrasadas. */
export function ordenarFila<T extends InfoRevisao>(itens: T[]): T[] {
  return [...itens].sort((a, b) => (a.proxima ?? "") < (b.proxima ?? "") ? -1 : (a.proxima ?? "") > (b.proxima ?? "") ? 1 : 0);
}

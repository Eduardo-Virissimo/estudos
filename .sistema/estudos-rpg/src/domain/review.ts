// Revisão espaçada no estilo Leitner.
// Cada nota tem uma "caixa" (0 = nunca revisada, 1..N). Lembrou: sobe uma caixa
// e o intervalo até a próxima revisão cresce. Esqueceu: volta para a caixa 1.
// Notas novas entram aos poucos (novasPorDia), para a fila não virar uma parede.

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
  // Primeira revisão: lembrar já pula a caixa 1 (que é onde "esqueci" cai).
  // Senão os dois botões dariam o mesmo resultado e a escolha não valeria nada.
  if (!e.revisado || e.caixa < 1) return Math.min(caixaMax(intervalos), 2);
  return Math.min(caixaMax(intervalos), e.caixa + 1);
}

export function aposEsquecer(): number {
  return 1;
}

/**
 * A fila de HOJE: todas as revisões vencidas de notas já estudadas, mais no máximo
 * `novasPorDia` notas nunca revisadas (descontando as novas já feitas hoje).
 * `novasPorDia` = 0 desliga o limite. A ordem de `fila` é mantida.
 */
export function filaDoDia<T extends EstadoRevisao>(fila: T[], novasPorDia: number, novasFeitasHoje: number): { hoje: T[]; adiadas: number } {
  const limite = novasPorDia > 0 ? Math.max(0, novasPorDia - novasFeitasHoje) : Infinity;
  const hoje: T[] = [];
  let novas = 0, adiadas = 0;
  for (const x of fila) {
    const nova = !x.revisado;
    if (nova && novas >= limite) { adiadas++; continue; }
    if (nova) novas++;
    hoje.push(x);
  }
  return { hoje, adiadas };
}

/** Ordena: nunca revisadas primeiro, depois as mais atrasadas. */
export function ordenarFila<T extends InfoRevisao>(itens: T[]): T[] {
  return [...itens].sort((a, b) => (a.proxima ?? "") < (b.proxima ?? "") ? -1 : (a.proxima ?? "") > (b.proxima ?? "") ? 1 : 0);
}

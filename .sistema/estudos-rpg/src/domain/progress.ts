// XP, nível, sequência de dias e conquistas.
// Tudo é calculado a partir do Snapshot: nada é "salvo à parte", então não dessincroniza.

import type { XPConfig } from "../settings.ts";
import { addDias, diaDaSemana } from "./dates.ts";
import type { Snapshot } from "./types.ts";

export interface PartesXP {
  notas: number;
  topicos: number;
  diario: number;
  estudo: number;
  revisao: number;
}

export interface Progresso {
  xp: number;
  partes: PartesXP;
  nivel: number;
  xpNivel: number;   // XP onde o nível atual começa
  xpProximo: number; // XP onde o próximo nível começa
  titulo: string;
  sequencia: number;
  /** Maior sequência da história: conquistas de chama usam esta, então não somem se a chama apagar. */
  maiorSequencia: number;
  estudouHoje: boolean;
  minutosHoje: number;
  /** Minutos estudados de segunda-feira até hoje. */
  minutosSemana: number;
  contagemNivel: Record<"escrito" | "praticado" | "projeto", number>;
  topicosFeitos: number;
  topicosTotal: number;
}

/** Nível n começa em 50·n·(n−1) XP: 0, 100, 300, 600, 1000, 1500... */
export function nivelPara(xp: number): { nivel: number; base: number; proximo: number } {
  let n = 1;
  while (50 * (n + 1) * n <= xp) n++;
  return { nivel: n, base: 50 * n * (n - 1), proximo: 50 * (n + 1) * n };
}

/** Dias seguidos com diário. Se hoje ainda não tem, conta a partir de ontem (ainda dá tempo). */
export function sequencia(dias: Set<string>, hoje: string): number {
  let d = dias.has(hoje) ? hoje : addDias(hoje, -1);
  let n = 0;
  while (dias.has(d)) { n++; d = addDias(d, -1); }
  return n;
}

/** Maior bloco de dias seguidos em toda a história do diário. */
export function maiorSequencia(dias: Set<string>): number {
  let maior = 0;
  for (const d of dias) {
    if (dias.has(addDias(d, -1))) continue; // só começa a contar no primeiro dia de cada bloco
    let n = 1;
    while (dias.has(addDias(d, n))) n++;
    maior = Math.max(maior, n);
  }
  return maior;
}

export function calcularProgresso(s: Snapshot, xp: XPConfig, titulos: string[]): Progresso {
  const contagemNivel = { escrito: 0, praticado: 0, projeto: 0 };
  let caixas = 0;
  for (const n of s.notas) { contagemNivel[n.nivel]++; caixas += n.caixa; }

  let topicosFeitos = 0, topicosTotal = 0;
  for (const t of s.trilhas) for (const r of t.regioes) for (const tp of r.topicos) { topicosTotal++; if (tp.feito) topicosFeitos++; }

  // Cada dia conta seus blocos de 10 min separadamente (um dia de 9 min não vale nada, nem soma com outro).
  let blocos = 0;
  for (const d of s.diario.values()) blocos += Math.floor(d.minutos / 10);

  const partes: PartesXP = {
    notas: contagemNivel.escrito * xp.escrito + contagemNivel.praticado * xp.praticado + contagemNivel.projeto * xp.projeto,
    topicos: topicosFeitos * xp.topico,
    diario: s.diario.size * xp.diario,
    estudo: blocos * xp.dezMinutos,
    revisao: caixas * xp.caixa,
  };
  const total = Object.values(partes).reduce((a, b) => a + b, 0);
  const lv = nivelPara(total);
  const dias = new Set(s.diario.keys());

  const segunda = addDias(s.hoje, -diaDaSemana(s.hoje));
  let minutosSemana = 0;
  for (const d of s.diario.values()) if (d.data >= segunda && d.data <= s.hoje) minutosSemana += d.minutos;

  return {
    xp: total, partes, nivel: lv.nivel, xpNivel: lv.base, xpProximo: lv.proximo,
    titulo: titulos[Math.min(lv.nivel - 1, titulos.length - 1)] ?? "Aventureiro",
    sequencia: sequencia(dias, s.hoje), maiorSequencia: maiorSequencia(dias), estudouHoje: dias.has(s.hoje),
    minutosHoje: s.diario.get(s.hoje)?.minutos ?? 0, minutosSemana,
    contagemNivel, topicosFeitos, topicosTotal,
  };
}

// ---------- Conquistas (declarativas: adicionar uma = adicionar uma linha) ----------

/** Raridade, como nos jogos: define a cor do troféu. */
export type Raridade = "comum" | "raro" | "epico" | "lendario";

export interface Conquista {
  id: string;
  icone: string; // nome de ícone do Obsidian (lucide)
  nome: string;
  desc: string;
  raridade: Raridade;
  ok: boolean;
  /** Quanto falta: `atual` de `meta` (atual nunca passa da meta). */
  atual: number;
  meta: number;
}

/** O que as conquistas podem consultar além do Snapshot e do Progresso. */
export interface ExtrasConquista {
  /** Número da última caixa de revisão (depende dos intervalos configurados). */
  caixaFinal: number;
}

interface DefConquista {
  id: string;
  icone: string;
  nome: string;
  desc: string;
  raridade: Raridade;
  /** Devolve [atual, meta]. Conquistada quando atual >= meta. */
  progresso: (s: Snapshot, p: Progresso, x: ExtrasConquista) => [number, number];
}

/** A região mais adiantada do mapa: [feitos, total]. */
const melhorRegiao = (s: Snapshot): [number, number] => {
  let melhor: [number, number] = [0, 1];
  for (const t of s.trilhas) for (const r of t.regioes) {
    if (!r.topicos.length) continue;
    const feitos = r.topicos.filter((x) => x.feito).length;
    if (feitos / r.topicos.length > melhor[0] / melhor[1]) melhor = [feitos, r.topicos.length];
  }
  return melhor;
};

export const CONQUISTAS: DefConquista[] = [
  { id: "primeira-sessao", icone: "sprout", nome: "Primeira jornada", desc: "Registre um dia de estudo no diário", raridade: "comum", progresso: (s) => [s.diario.size, 1] },
  { id: "chama-3", icone: "flame", nome: "Chama acesa", desc: "3 dias seguidos de estudo", raridade: "comum", progresso: (_, p) => [p.maiorSequencia, 3] },
  { id: "pratica", icone: "hammer", nome: "Mão na forja", desc: "Uma nota no nível praticado", raridade: "comum", progresso: (_, p) => [p.contagemNivel.praticado + p.contagemNivel.projeto, 1] },
  { id: "chama-7", icone: "flame-kindling", nome: "Fogo eterno", desc: "7 dias seguidos de estudo", raridade: "raro", progresso: (_, p) => [p.maiorSequencia, 7] },
  { id: "estudioso", icone: "book-open", nome: "Estudioso", desc: "10 dias de estudo no total", raridade: "raro", progresso: (s) => [s.diario.size, 10] },
  { id: "explorador", icone: "compass", nome: "Explorador", desc: "Avance em 5 regiões do mapa", raridade: "raro", progresso: (s) => [s.trilhas.flatMap((t) => t.regioes).filter((r) => r.topicos.some((x) => x.feito)).length, 5] },
  { id: "maratona", icone: "timer", nome: "Maratona", desc: "2 horas de estudo num dia só", raridade: "raro", progresso: (s) => [Math.max(0, ...[...s.diario.values()].map((d) => d.minutos)), 120] },
  { id: "poliglota", icone: "languages", nome: "Duas frentes", desc: "Avance em 2 trilhas diferentes", raridade: "raro", progresso: (s) => [s.trilhas.filter((t) => t.regioes.some((r) => r.topicos.some((x) => x.feito))).length, 2] },
  { id: "projeto", icone: "castle", nome: "Construtor", desc: "Uma nota usada em projeto", raridade: "epico", progresso: (_, p) => [p.contagemNivel.projeto, 1] },
  { id: "regiao", icone: "flag", nome: "Conquistador", desc: "Conclua uma região inteira do mapa", raridade: "epico", progresso: (s) => melhorRegiao(s) },
  { id: "memoria", icone: "brain", nome: "Memória de dragão", desc: "Uma nota na última caixa de revisão", raridade: "epico", progresso: (s, _, x) => [Math.max(0, ...s.notas.map((n) => n.caixa)), x.caixaFinal] },
  { id: "chama-30", icone: "sun", nome: "Sol invicto", desc: "30 dias seguidos de estudo", raridade: "lendario", progresso: (_, p) => [p.maiorSequencia, 30] },
  { id: "nivel-8", icone: "crown", nome: "Lenda", desc: "Chegue ao nível 8", raridade: "lendario", progresso: (_, p) => [p.nivel, 8] },
];

export function avaliarConquistas(s: Snapshot, p: Progresso, x: ExtrasConquista): Conquista[] {
  return CONQUISTAS.map(({ progresso, ...c }) => {
    const [atual, meta] = progresso(s, p, x);
    const m = Math.max(1, meta);
    return { ...c, ok: atual >= m, atual: Math.min(Math.max(0, atual), m), meta: m };
  });
}

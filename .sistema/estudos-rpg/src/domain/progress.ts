// XP, nível, sequência de dias, habilidades e conquistas.
// Tudo é calculado a partir do Snapshot: nada é "salvo à parte", então não dessincroniza.

import type { XPConfig } from "../settings.ts";
import { addDias } from "./dates.ts";
import type { Snapshot } from "./types.ts";

export interface PartesXP {
  notas: number;
  topicos: number;
  diario: number;
  revisao: number;
  treinos: number;
  missoes: number;
}

export interface Progresso {
  xp: number;
  partes: PartesXP;
  nivel: number;
  xpNivel: number;   // XP onde o nível atual começa
  xpProximo: number; // XP onde o próximo nível começa
  titulo: string;
  sequencia: number;
  estudouHoje: boolean;
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

export function calcularProgresso(s: Snapshot, xp: XPConfig, titulos: string[]): Progresso {
  const contagemNivel = { escrito: 0, praticado: 0, projeto: 0 };
  let caixas = 0;
  for (const n of s.notas) { contagemNivel[n.nivel]++; caixas += n.caixa; }

  let topicosFeitos = 0, topicosTotal = 0;
  for (const t of s.trilhas) for (const r of t.regioes) for (const tp of r.topicos) { topicosTotal++; if (tp.feito) topicosFeitos++; }

  let treinos = 0, acertos = 0;
  for (const d of s.diario.values()) { treinos += d.treinos; acertos += d.acertos; }

  let tarefas = 0;
  for (const m of s.missoes) for (const f of m.fases) for (const t of f.tarefas) if (t.feita) tarefas++;

  const partes: PartesXP = {
    notas: contagemNivel.escrito * xp.escrito + contagemNivel.praticado * xp.praticado + contagemNivel.projeto * xp.projeto,
    topicos: topicosFeitos * xp.topico,
    diario: s.diario.size * xp.diario,
    revisao: caixas * xp.caixa,
    treinos: treinos * xp.treino + acertos * xp.acerto,
    missoes: tarefas * xp.tarefa,
  };
  const total = Object.values(partes).reduce((a, b) => a + b, 0);
  const lv = nivelPara(total);
  const dias = new Set(s.diario.keys());

  return {
    xp: total, partes, nivel: lv.nivel, xpNivel: lv.base, xpProximo: lv.proximo,
    titulo: titulos[Math.min(lv.nivel - 1, titulos.length - 1)] ?? "Aventureiro",
    sequencia: sequencia(dias, s.hoje), estudouHoje: dias.has(s.hoje),
    contagemNivel, topicosFeitos, topicosTotal,
  };
}

// ---------- Habilidades (cada região de cada trilha) ----------

export interface Habilidade {
  nome: string;
  trilha: string;
  feitos: number;
  total: number;
  /** 0 a 5 estrelas. */
  estrelas: number;
}

export function habilidades(s: Snapshot): Habilidade[] {
  const out: Habilidade[] = [];
  for (const t of s.trilhas) for (const r of t.regioes) {
    const feitos = r.topicos.filter((x) => x.feito).length;
    const total = r.topicos.length;
    out.push({ nome: r.nome, trilha: t.nome, feitos, total, estrelas: total ? Math.round((feitos / total) * 5) : 0 });
  }
  return out;
}

// ---------- Conquistas (declarativas: adicionar uma = adicionar uma linha) ----------

export interface Conquista {
  id: string;
  icone: string; // nome de ícone do Obsidian (lucide)
  nome: string;
  desc: string;
  ok: boolean;
}

interface DefConquista {
  id: string;
  icone: string;
  nome: string;
  desc: string;
  teste: (s: Snapshot, p: Progresso) => boolean;
}

const totalPerfeitos = (s: Snapshot) => [...s.diario.values()].reduce((a, d) => a + d.perfeitos, 0);
const faseConcluida = (s: Snapshot, n: number) =>
  s.missoes.some((m) => m.fases.some((f) => f.num === n && f.tarefas.length > 0 && f.tarefas.every((t) => t.feita)));

export const CONQUISTAS: DefConquista[] = [
  { id: "primeira-sessao", icone: "sprout", nome: "Primeira jornada", desc: "Registre um dia no diário", teste: (s) => s.diario.size >= 1 },
  { id: "chama-3", icone: "flame", nome: "Chama acesa", desc: "3 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 3 },
  { id: "chama-7", icone: "flame-kindling", nome: "Fogo eterno", desc: "7 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 7 },
  { id: "chama-30", icone: "sun", nome: "Sol invicto", desc: "30 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 30 },
  { id: "na-mosca", icone: "crosshair", nome: "Olho de águia", desc: "Gabarite um treino misto", teste: (s) => totalPerfeitos(s) >= 1 },
  { id: "pratica", icone: "hammer", nome: "Mão na forja", desc: "Uma nota no nível praticado", teste: (_, p) => p.contagemNivel.praticado + p.contagemNivel.projeto >= 1 },
  { id: "projeto", icone: "castle", nome: "Construtor", desc: "Uma nota usada em projeto", teste: (_, p) => p.contagemNivel.projeto >= 1 },
  { id: "memoria", icone: "brain", nome: "Memória de dragão", desc: "Uma nota na última caixa de revisão", teste: (s) => s.notas.some((n) => n.caixa >= 5) },
  { id: "regiao", icone: "flag", nome: "Conquistador", desc: "Conclua uma região inteira do mapa", teste: (s) => s.trilhas.some((t) => t.regioes.some((r) => r.topicos.every((x) => x.feito))) },
  { id: "explorador", icone: "compass", nome: "Explorador", desc: "Avance em 5 regiões do mapa", teste: (s) => s.trilhas.flatMap((t) => t.regioes).filter((r) => r.topicos.some((x) => x.feito)).length >= 5 },
  { id: "missao-1", icone: "swords", nome: "Primeira missão", desc: "Conclua a Fase 1 de uma missão", teste: (s) => faseConcluida(s, 1) },
  { id: "nivel-8", icone: "crown", nome: "Lenda", desc: "Chegue ao nível 8", teste: (_, p) => p.nivel >= 8 },
];

export function avaliarConquistas(s: Snapshot, p: Progresso): Conquista[] {
  return CONQUISTAS.map(({ teste, ...c }) => ({ ...c, ok: teste(s, p) }));
}

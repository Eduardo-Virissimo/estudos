// Configurações do plugin. Tudo que poderia estar "fixo no código" mora aqui
// e pode ser mudado em Configurações → Estudos RPG.

export interface XPConfig {
  escrito: number;
  praticado: number;
  projeto: number;
  topico: number;
  diario: number;
  /** XP a cada 10 minutos estudados num dia. */
  dezMinutos: number;
  caixa: number;
}

export interface Settings {
  /** Abre a ficha do herói quando o Obsidian inicia. */
  abrirAoIniciar: boolean;
  /** Pasta onde ficam as notas do diário (YYYY-MM-DD.md). */
  pastaDiario: string;
  /** Nota usada como modelo do diário. Aceita {{date}}. */
  templateDiario: string;
  /** Pastas ignoradas (templates, rascunhos). Uma por linha. */
  pastasIgnoradas: string[];
  /** Dias até a próxima revisão para cada caixa (índice = caixa). */
  intervalos: number[];
  semanasNoCalendario: number;
  /** Minutos que separam as cores do calendário (ex.: [25, 50] = <25, <50, 50+). */
  faixasCalendario: number[];
  /** Meta de minutos por semana (0 = sem meta). */
  metaSemanalMin: number;
  /** Sessão esquecida ligada? Conta no máximo isso (minutos). */
  sessaoMaxMin: number;
  xp: XPConfig;
  titulos: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  abrirAoIniciar: true,
  pastaDiario: "estudos/Diário",
  templateDiario: "estudos/Templates/Diário.md",
  pastasIgnoradas: ["estudos/Templates"],
  intervalos: [0, 1, 3, 7, 14, 30, 60],
  semanasNoCalendario: 30,
  faixasCalendario: [25, 50],
  metaSemanalMin: 300,
  sessaoMaxMin: 240,
  xp: { escrito: 20, praticado: 60, projeto: 120, topico: 10, diario: 15, dezMinutos: 5, caixa: 10 },
  titulos: ["Aprendiz", "Escudeiro", "Cavaleiro", "Cavaleiro do Código", "Mago dos Bits", "Arquimago", "Lorde do Terminal", "Lenda do Reino"],
};

/**
 * Junta o que foi salvo com os padrões.
 * E se a config salva for de uma versão antiga? Campos novos ganham o padrão,
 * campos que não existem mais (ex.: do treino removido) são descartados,
 * e valores com tipo errado são ignorados.
 */
export function mergeSettings(saved: unknown): Settings {
  const s = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
  const d = DEFAULT_SETTINGS;
  const xpSalvo = (s.xp && typeof s.xp === "object" ? s.xp : {}) as Record<string, unknown>;
  const xp = { ...d.xp };
  for (const k of Object.keys(xp) as (keyof XPConfig)[]) if (typeof xpSalvo[k] === "number") xp[k] = xpSalvo[k] as number;

  return {
    abrirAoIniciar: typeof s.abrirAoIniciar === "boolean" ? s.abrirAoIniciar : d.abrirAoIniciar,
    pastaDiario: typeof s.pastaDiario === "string" && s.pastaDiario.trim() ? s.pastaDiario : d.pastaDiario,
    templateDiario: typeof s.templateDiario === "string" ? s.templateDiario : d.templateDiario,
    pastasIgnoradas: Array.isArray(s.pastasIgnoradas) ? s.pastasIgnoradas.filter((x): x is string => typeof x === "string") : d.pastasIgnoradas,
    intervalos: listaDe(s.intervalos, (x): x is number => typeof x === "number" && x >= 0, d.intervalos, 2),
    semanasNoCalendario: typeof s.semanasNoCalendario === "number" ? s.semanasNoCalendario : d.semanasNoCalendario,
    faixasCalendario: listaDe(s.faixasCalendario, (x): x is number => typeof x === "number" && x > 0, d.faixasCalendario, 1).sort((a, b) => a - b),
    metaSemanalMin: typeof s.metaSemanalMin === "number" && s.metaSemanalMin >= 0 ? s.metaSemanalMin : d.metaSemanalMin,
    sessaoMaxMin: typeof s.sessaoMaxMin === "number" && s.sessaoMaxMin >= 1 ? s.sessaoMaxMin : d.sessaoMaxMin,
    xp,
    titulos: listaDe(s.titulos, (x): x is string => typeof x === "string" && x.trim() !== "", d.titulos, 1),
  };
}

function listaDe<T>(v: unknown, valido: (x: unknown) => x is T, padrao: T[], minimo: number): T[] {
  if (!Array.isArray(v)) return [...padrao];
  const ok = v.filter(valido);
  return ok.length >= minimo ? ok : [...padrao];
}

// Configurações do plugin. Tudo que poderia estar "fixo no código" mora aqui
// e pode ser mudado em Configurações → Estudos RPG.

export interface XPConfig {
  escrito: number;
  praticado: number;
  projeto: number;
  topico: number;
  diario: number;
  caixa: number;
  treino: number;
  acerto: number;
  tarefa: number;
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
  perguntasPorTreino: number;
  semanasNoCalendario: number;
  xp: XPConfig;
  titulos: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  abrirAoIniciar: true,
  pastaDiario: "estudos/Diário",
  templateDiario: "estudos/Programação/Template/Diário.md",
  pastasIgnoradas: ["estudos/Programação/Template"],
  intervalos: [0, 1, 3, 7, 14, 30, 60],
  perguntasPorTreino: 5,
  semanasNoCalendario: 20,
  xp: { escrito: 20, praticado: 60, projeto: 120, topico: 10, diario: 15, caixa: 10, treino: 20, acerto: 5, tarefa: 25 },
  titulos: ["Aprendiz", "Escudeiro", "Cavaleiro", "Cavaleiro do Código", "Mago dos Bits", "Arquimago", "Lorde do Terminal", "Lenda do Reino"],
};

/** Junta o que foi salvo com os padrões (e se uma versão nova adicionar campos?). */
export function mergeSettings(saved: Partial<Settings> | null | undefined): Settings {
  const s = saved ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    xp: { ...DEFAULT_SETTINGS.xp, ...(s.xp ?? {}) },
    intervalos: validList(s.intervalos, DEFAULT_SETTINGS.intervalos),
    titulos: validList(s.titulos, DEFAULT_SETTINGS.titulos),
    pastasIgnoradas: Array.isArray(s.pastasIgnoradas) ? s.pastasIgnoradas : DEFAULT_SETTINGS.pastasIgnoradas,
  };
}

function validList<T>(v: unknown, fallback: T[]): T[] {
  return Array.isArray(v) && v.length > 0 ? (v as T[]) : fallback;
}

// Tipos do "mundo" do plugin. Nada aqui depende do Obsidian: são só dados.

export type Nivel = "escrito" | "praticado" | "projeto";
export const NIVEIS: readonly Nivel[] = ["escrito", "praticado", "projeto"];

/** Um tópico de uma trilha (uma linha `- [ ] [[Nota]] — descrição`). */
export interface Topico {
  label: string;
  /** Destino do wikilink, como escrito. */
  alvo: string;
  desc: string;
  feito: boolean;
  /** Linha no arquivo da trilha e o texto exato dela (para editar com segurança). */
  linha: number;
  raw: string;
  /** Caminho da nota resolvida, ou null se a nota ainda não existe. */
  caminho: string | null;
}

/** Uma seção de uma trilha (`# 1️⃣ Ferramentas`). No jogo: uma "região" do mapa. */
export interface Regiao {
  nome: string;
  nivelTitulo: 1 | 2;
  destaque: boolean;
  desc: string;
  topicos: Topico[];
}

/** Uma nota com `tipo: trilha` (ex.: Roadmap de Programação, Inglês...). */
export interface Trilha {
  caminho: string;
  nome: string;
  regioes: Regiao[];
}

export interface Tarefa {
  texto: string;
  feita: boolean;
  linha: number;
  raw: string;
}

export interface Fase {
  num: number;
  titulo: string;
  entrega: string;
  tarefas: Tarefa[];
}

/** Uma nota com `tipo: missao` (ex.: Projeto-guia). */
export interface Missao {
  caminho: string;
  nome: string;
  prioridade: number;
  fases: Fase[];
}

/** Uma nota de estudo: qualquer nota com a propriedade `nivel`. */
export interface NotaEstudo {
  caminho: string;
  label: string;
  nivel: Nivel;
  caixa: number;
  revisado: string | null; // YYYY-MM-DD
  /** Região/trilha que aponta para esta nota (se alguma apontar). */
  area: string | null;
}

export interface Pergunta {
  pergunta: string;
  resposta: string;
  caminho: string;
  nota: string;
}

export interface DiaDiario {
  data: string; // YYYY-MM-DD
  caminho: string;
  minutos: number;
}

/** Foto do vault num instante. A interface só lê daqui. */
export interface Snapshot {
  hoje: string;
  trilhas: Trilha[];
  missoes: Missao[];
  notas: NotaEstudo[];
  perguntas: Pergunta[];
  diario: Map<string, DiaDiario>;
}

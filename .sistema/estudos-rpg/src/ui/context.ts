// O que cada seção da ficha recebe para desenhar e agir.

import type { App, Component } from "obsidian";
import type { Conquista, Progresso } from "../domain/progress.ts";
import type { Missao, NotaEstudo, Pergunta, Snapshot, Tarefa, Topico } from "../domain/types.ts";
import type { Settings } from "../settings.ts";

export interface EstadoTreino {
  itens: Pergunta[];
  i: number;
  acertos: number;
  mostrar: boolean;
  fim: boolean;
}

/** Estado da tela (some ao fechar a aba; nada aqui precisa persistir). */
export interface EstadoUI {
  regiaoAberta: string | null; // `${trilha}::${regiao}`
  busca: string;
  perguntaIdx: number | null;
  mostrarResposta: boolean;
  treino: EstadoTreino | null;
}

export interface Acoes {
  abrirNota(caminho: string, novaAba?: boolean): void;
  alternarTopico(trilha: string, t: Topico): Promise<void>;
  alternarTarefa(missao: Missao, t: Tarefa): Promise<void>;
  revisar(nota: NotaEstudo, lembrou: boolean): Promise<void>;
  iniciarDia(): Promise<void>;
  iniciarTreino(): void;
  responderTreino(acertou: boolean): Promise<void>;
  /** Redesenha a ficha com o estado atual (sem reler o vault). */
  redesenhar(): void;
}

export interface Ctx {
  app: App;
  /** Dono dos renderizadores de Markdown (limpos ao redesenhar). */
  comp: Component;
  snap: Snapshot;
  prog: Progresso;
  conquistas: Conquista[];
  settings: Settings;
  estado: EstadoUI;
  acoes: Acoes;
}

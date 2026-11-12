// O que cada seção da ficha recebe para desenhar e agir.

import type { App, Component } from "obsidian";
import type { Conquista, Progresso } from "../domain/progress.ts";
import type { Missao, NotaEstudo, Snapshot, Tarefa, Topico } from "../domain/types.ts";
import type { Settings } from "../settings.ts";

/** Estado da tela (some ao fechar a aba; nada aqui precisa persistir). */
export interface EstadoUI {
  perguntaIdx: number | null;
  mostrarResposta: boolean;
}

export interface Acoes {
  /** Abre numa aba nova do centro; `aoLado` abre dividindo a tela. */
  abrirNota(caminho: string, aoLado?: boolean): void;
  alternarTopico(trilha: string, t: Topico): Promise<void>;
  alternarTarefa(missao: Missao, t: Tarefa): Promise<void>;
  revisar(nota: NotaEstudo, lembrou: boolean): Promise<void>;
  iniciarDia(): Promise<void>;
  /** Abre a janela de tópicos: de uma região, ou de busca (null). */
  abrirTopicos(alvo: { trilha: string; regiao: string } | null): void;
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

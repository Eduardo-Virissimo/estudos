// O que cada seção da ficha recebe para desenhar e agir.

import type { App, Component } from "obsidian";
import type { Conquista, Progresso } from "../domain/progress.ts";
import type { NotaEstudo, Snapshot, Topico } from "../domain/types.ts";
import type { Settings } from "../settings.ts";

/** Estado da tela (some ao fechar a aba; nada aqui precisa persistir). */
export interface EstadoUI {
  /** Nota sendo revisada agora (caminho), ou null para mostrar a fila. */
  revisando: string | null;
  /** Pergunta atual da nota em revisão. */
  perguntaIdx: number;
  mostrarResposta: boolean;
  /** Trilha aberta no painel de trilhas (caminho), ou null = a primeira. */
  trilha: string | null;
}

export interface Acoes {
  /** Abre numa aba nova do centro; `aoLado` abre dividindo a tela. */
  abrirNota(caminho: string, aoLado?: boolean): void;
  alternarTopico(trilha: string, t: Topico): Promise<void>;
  /** Grava a revisão e passa para `proxima` (caminho da próxima nota da fila, ou null). */
  revisar(nota: NotaEstudo, lembrou: boolean, proxima: string | null): Promise<void>;
  /** Entra no modo de revisão de uma nota (null volta para a fila). */
  revisarNota(caminho: string | null): void;
  abrirDiario(): Promise<void>;
  iniciarSessao(): Promise<void>;
  encerrarSessao(): Promise<void>;
  descartarSessao(): Promise<void>;
  /** Início da sessão em andamento (ms), ou null. */
  sessaoInicio(): number | null;
  abrirConquistas(): void;
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

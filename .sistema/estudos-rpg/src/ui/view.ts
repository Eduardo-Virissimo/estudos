// A aba "Ficha do herói". Guarda o estado da tela e liga as seções às ações.

import { Component, ItemView, Notice, type WorkspaceLeaf } from "obsidian";
import { aposEsquecer, aposLembrar } from "../domain/review.ts";
import type { Missao, NotaEstudo, Tarefa, Topico } from "../domain/types.ts";
import type EstudosRPG from "../main.ts";
import type { Acoes, Ctx, EstadoUI } from "./context.ts";
import * as S from "./sections.ts";
import { TopicosModal } from "./topicosModal.ts";

export const VIEW_FICHA = "estudos-rpg-ficha";

export class FichaView extends ItemView {
  private estado: EstadoUI = { perguntaIdx: null, mostrarResposta: false };
  private desinscrever: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, private plugin: EstudosRPG) {
    super(leaf);
  }

  override getViewType() { return VIEW_FICHA; }
  override getDisplayText() { return "Ficha do herói"; }
  override getIcon() { return "shield"; }

  override async onOpen() {
    this.contentEl.addClass("erpg-host");
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenhar());
    this.desenhar();
  }

  override async onClose() {
    this.desinscrever?.();
  }

  /** Monta o contexto que as seções usam (null enquanto o vault não foi lido). */
  criarCtx = (comp: Component): Ctx | null => {
    const dados = this.plugin.dados;
    if (!dados) return null;
    return {
      app: this.app, comp, settings: this.plugin.config, estado: this.estado, acoes: this.acoes,
      snap: dados.snap, prog: dados.prog, conquistas: dados.conquistas,
    };
  };

  /**
   * Redesenha a ficha. Layout de tela única:
   *   [ faixa do topo: nível · XP · status · conquistas · sessão ]
   *   [ Missão / Atividade | Pergunta do dia / Revisar | Trilhas ]
   * Em telas pequenas o CSS empilha as colunas (aí a página rola).
   */
  desenhar() {
    const el = this.contentEl;
    const rolagem = el.scrollTop;

    // Descarrega os renderizadores de Markdown do desenho anterior antes de limpar a tela.
    const comp = this.novoFilho();
    el.empty();

    const ctx = this.criarCtx(comp);
    if (!ctx) {
      el.createDiv({ cls: "erpg-carregando", text: "Carregando…" });
      return;
    }

    const pagina = el.createDiv({ cls: "erpg" });
    S.ficha(pagina, ctx);
    const grade = pagina.createDiv({ cls: "erpg-grade-principal" });
    const colA = grade.createDiv({ cls: "erpg-col is-a" });
    S.missao(colA, ctx);
    S.cronica(colA, ctx);
    const colB = grade.createDiv({ cls: "erpg-col is-b" });
    S.oraculo(colB, ctx);
    S.revisao(colB, ctx);
    S.mapa(grade.createDiv({ cls: "erpg-col is-c" }), ctx);

    el.scrollTop = rolagem;
  }

  /** Dono dos renderizadores de Markdown do desenho atual; trocado a cada desenho. */
  private filho: Component | null = null;

  private novoFilho(): Component {
    if (this.filho) this.removeChild(this.filho);
    this.filho = this.addChild(new Component());
    return this.filho;
  }

  // ------------------------------------------------------------ ações
  private acoes: Acoes = {
    // Notas abrem numa aba nova do centro: a ficha continua aberta na dela.
    // Ctrl/Cmd+clique abre ao lado (divisão), para ler a nota com a ficha visível.
    abrirNota: (caminho, aoLado = false) => {
      void this.app.workspace.openLinkText(caminho, "", aoLado ? "split" : "tab");
    },

    alternarTopico: async (trilha: string, t: Topico) => {
      await this.plugin.writer.alternarLinha(trilha, t.linha, t.raw);
      await this.plugin.atualizarAgora();
    },

    alternarTarefa: async (m: Missao, t: Tarefa) => {
      await this.plugin.writer.alternarLinha(m.caminho, t.linha, t.raw);
      await this.plugin.atualizarAgora();
    },

    revisar: async (n: NotaEstudo, lembrou: boolean) => {
      const { intervalos } = this.plugin.config;
      const caixa = lembrou ? aposLembrar({ caixa: n.caixa, revisado: n.revisado }, intervalos) : aposEsquecer();
      const hoje = this.plugin.hoje();
      await this.plugin.writer.propriedades(n.caminho, { caixa, revisado: hoje });
      new Notice(lembrou ? `${n.label}: caixa ${caixa}, volta em ${intervalos[caixa] ?? "?"} dia(s).` : `${n.label} volta amanhã.`);
      await this.plugin.atualizarAgora();
    },

    iniciarDia: async () => {
      await this.plugin.abrirNoCentro(await this.plugin.writer.diario(this.plugin.hoje()));
    },

    abrirTopicos: (alvo) => new TopicosModal(this.plugin, this.criarCtx, alvo).open(),

    redesenhar: () => this.desenhar(),
  };
}

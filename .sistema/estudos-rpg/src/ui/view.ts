// A aba "Ficha do herói". Guarda o estado da tela e liga as seções às ações.

import { Component, ItemView, Notice, type WorkspaceLeaf } from "obsidian";
import { montarTreino } from "../domain/quiz.ts";
import { aposEsquecer, aposLembrar } from "../domain/review.ts";
import type { Missao, NotaEstudo, Tarefa, Topico } from "../domain/types.ts";
import type EstudosRPG from "../main.ts";
import type { Acoes, Ctx, EstadoUI } from "./context.ts";
import * as S from "./sections.ts";

export const VIEW_FICHA = "estudos-rpg-ficha";

export class FichaView extends ItemView {
  private estado: EstadoUI = { regiaoAberta: null, busca: "", perguntaIdx: null, mostrarResposta: false, treino: null };
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

  /** Redesenha tudo mantendo a rolagem e o foco da busca. */
  desenhar() {
    const el = this.contentEl;
    const rolagem = el.scrollTop;
    const buscaFocada = document.activeElement instanceof HTMLInputElement && el.contains(document.activeElement);

    // Descarrega os renderizadores de Markdown do desenho anterior antes de limpar a tela.
    const comp = this.novoFilho();
    el.empty();

    const dados = this.plugin.dados;
    if (!dados) {
      el.createDiv({ cls: "erpg-carregando", text: "Abrindo o grimório…" });
      return;
    }
    const ctx: Ctx = {
      app: this.app, comp, settings: this.plugin.config, estado: this.estado, acoes: this.acoes,
      snap: dados.snap, prog: dados.prog, conquistas: dados.conquistas,
    };

    const pagina = el.createDiv({ cls: "erpg" });
    S.ficha(pagina, ctx);
    const g1 = pagina.createDiv({ cls: "erpg-grid" });
    S.missao(g1, ctx);
    S.oraculo(g1, ctx);
    const g2 = pagina.createDiv({ cls: "erpg-grid" });
    S.revisao(g2, ctx);
    S.cronica(g2, ctx);
    S.mapa(pagina, ctx);
    S.trofeus(pagina, ctx);

    el.scrollTop = rolagem;
    if (buscaFocada) {
      const input = el.querySelector<HTMLInputElement>(".erpg-busca input");
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    }
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
    abrirNota: (caminho, novaAba = false) => {
      void this.app.workspace.openLinkText(caminho, "", novaAba);
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
      const f = await this.plugin.writer.diario(this.plugin.hoje());
      await this.app.workspace.getLeaf(false).openFile(f);
    },

    iniciarTreino: () => {
      const dados = this.plugin.dados;
      if (!dados?.snap.perguntas.length) return;
      const itens = montarTreino(dados.snap.perguntas, this.plugin.config.perguntasPorTreino);
      this.estado.treino = { itens, i: 0, acertos: 0, mostrar: false, fim: false };
      this.desenhar();
    },

    responderTreino: async (acertou: boolean) => {
      const tr = this.estado.treino;
      const p = tr?.itens[tr.i];
      if (!tr || !p) return;
      if (acertou) tr.acertos++;
      else await this.plugin.writer.propriedades(p.caminho, { caixa: aposEsquecer(), revisado: this.plugin.hoje() });
      tr.i++;
      tr.mostrar = false;
      if (tr.i >= tr.itens.length) {
        tr.fim = true;
        const f = await this.plugin.writer.diario(this.plugin.hoje());
        const fm = (this.app.metadataCache.getFileCache(f)?.frontmatter ?? {}) as Record<string, unknown>;
        const n = (k: string) => Number(fm[k]) || 0;
        await this.plugin.writer.propriedades(f.path, {
          treinos: n("treinos") + 1,
          acertos: n("acertos") + tr.acertos,
          perfeitos: n("perfeitos") + (tr.acertos === tr.itens.length ? 1 : 0),
        });
        await this.plugin.atualizarAgora();
      } else {
        this.desenhar();
      }
    },

    redesenhar: () => this.desenhar(),
  };
}

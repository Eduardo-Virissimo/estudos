// Janela com os tópicos de uma região (ou a busca em todas as trilhas).
// Fica fora da ficha para a ficha caber numa tela sem rolagem.
// Atualiza sozinha quando o vault muda (ex.: depois de marcar um tópico).

import { Component, Modal } from "obsidian";
import type EstudosRPG from "../main.ts";
import type { Ctx } from "./context.ts";
import { icone } from "./dom.ts";
import { listaTopicos } from "./sections.ts";

export class TopicosModal extends Modal {
  private comp = new Component();
  private lista!: HTMLElement;
  private input!: HTMLInputElement;
  private desinscrever: (() => void) | null = null;

  constructor(
    private plugin: EstudosRPG,
    private criarCtx: (comp: Component) => Ctx | null,
    private alvo: { trilha: string; regiao: string } | null,
  ) {
    super(plugin.app);
  }

  override onOpen() {
    this.modalEl.addClass("erpg-modal");
    this.contentEl.addClass("erpg-host");
    this.comp.load();
    this.setTitle(this.alvo ? this.alvo.regiao : "Buscar tópico");

    const busca = this.contentEl.createDiv({ cls: "erpg-busca is-campo" });
    icone(busca, "search");
    this.input = busca.createEl("input", { type: "search", attr: { placeholder: "Buscar em todas as trilhas", "aria-label": "Buscar tópico", spellcheck: "false" } });
    this.input.addEventListener("input", () => this.desenharLista());
    this.lista = this.contentEl.createDiv({ cls: "erpg-modal-lista" });

    this.desinscrever = this.plugin.aoAtualizar(() => this.desenharLista());
    this.desenharLista();
    if (!this.alvo) this.input.focus();
  }

  override onClose() {
    this.desinscrever?.();
    this.comp.unload();
    this.contentEl.empty();
  }

  private desenharLista() {
    // Troca o Component a cada desenho para liberar os renderizadores antigos.
    this.comp.unload();
    this.comp = new Component();
    this.comp.load();
    this.lista.empty();
    const ctx = this.criarCtx(this.comp);
    if (!ctx) return;
    const busca = this.input.value;
    this.setTitle(busca.trim() ? "Buscar tópico" : this.alvo ? this.alvo.regiao : "Buscar tópico");
    if (!busca.trim() && !this.alvo) return;
    listaTopicos(this.lista, ctx, this.alvo, busca);
  }
}

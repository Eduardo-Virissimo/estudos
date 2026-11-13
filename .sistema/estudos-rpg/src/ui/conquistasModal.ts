// Janela com todas as conquistas: o que cada uma pede e quanto falta.
// Atualiza sozinha quando o vault muda.

import { Component, Modal } from "obsidian";
import type EstudosRPG from "../main.ts";
import type { Ctx } from "./context.ts";
import { listaConquistas } from "./sections.ts";

export class ConquistasModal extends Modal {
  private comp = new Component();
  private desinscrever: (() => void) | null = null;

  constructor(private plugin: EstudosRPG, private criarCtx: (comp: Component) => Ctx | null) {
    super(plugin.app);
  }

  override onOpen() {
    this.modalEl.addClass("erpg-modal");
    this.contentEl.addClass("erpg-host");
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenhar());
    this.desenhar();
  }

  override onClose() {
    this.desinscrever?.();
    this.comp.unload();
    this.contentEl.empty();
  }

  private desenhar() {
    this.comp.unload();
    this.comp = new Component();
    this.comp.load();
    this.contentEl.empty();
    const ctx = this.criarCtx(this.comp);
    if (!ctx) return;
    const ok = ctx.conquistas.filter((c) => c.ok).length;
    this.setTitle(`Conquistas · ${ok}/${ctx.conquistas.length}`);
    listaConquistas(this.contentEl.createDiv({ cls: "erpg-modal-lista" }), ctx);
  }
}

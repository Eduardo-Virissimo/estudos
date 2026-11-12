// Pequenos construtores de interface reaproveitados pelas seções.
// Usam a API do Obsidian (createEl/setIcon), nunca innerHTML com texto de nota.

import { setIcon } from "obsidian";

export type Variante = "primario" | "secundario" | "discreto";

export function icone(parent: HTMLElement, nome: string, cls = "erpg-ico"): HTMLElement {
  const span = parent.createSpan({ cls });
  setIcon(span, nome);
  return span;
}

export function botao(
  parent: HTMLElement,
  texto: string,
  onClick: (ev: MouseEvent) => void | Promise<void>,
  opts: { icone?: string; variante?: Variante; titulo?: string; pequeno?: boolean } = {},
): HTMLButtonElement {
  const b = parent.createEl("button", {
    cls: `erpg-btn is-${opts.variante ?? "primario"}${opts.pequeno ? " is-sm" : ""}`,
    attr: opts.titulo ? { "aria-label": opts.titulo } : {},
  });
  if (opts.icone) icone(b, opts.icone);
  b.createSpan({ text: texto });
  b.addEventListener("click", async (ev) => {
    if (b.disabled) return;
    b.disabled = true; // evita clique duplo gravando duas vezes
    try { await onClick(ev); } finally { b.disabled = false; }
  });
  return b;
}

/** Painel com moldura: devolve o corpo onde o conteúdo entra. */
export function painel(parent: HTMLElement, iconeNome: string, titulo: string, sub?: string, cls = ""): HTMLElement {
  const sec = parent.createEl("section", { cls: `erpg-painel ${cls}`.trim() });
  const cab = sec.createDiv({ cls: "erpg-painel-cab" });
  icone(cab, iconeNome, "erpg-ico erpg-selo");
  const tt = cab.createDiv({ cls: "erpg-painel-tt" });
  tt.createEl("h2", { text: titulo });
  if (sub) tt.createDiv({ cls: "erpg-painel-sub", text: sub });
  return sec.createDiv({ cls: "erpg-painel-corpo" });
}

export function barra(parent: HTMLElement, fracao: number, cls = "erpg-barra", rotulo?: string): HTMLElement {
  const pct = Math.max(0, Math.min(1, Number.isFinite(fracao) ? fracao : 0)) * 100;
  const b = parent.createDiv({ cls, attr: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(Math.round(pct)), ...(rotulo ? { "aria-label": rotulo } : {}) } });
  b.createDiv({ cls: "erpg-barra-fill" }).style.width = `${pct.toFixed(1)}%`;
  return b;
}

export function vazio(parent: HTMLElement, texto: string, dica?: string): void {
  const v = parent.createDiv({ cls: "erpg-vazio" });
  v.createEl("p", { text: texto });
  if (dica) v.createEl("p", { cls: "erpg-dica", text: dica });
}

export function ornamento(parent: HTMLElement): void {
  parent.createDiv({ cls: "erpg-ornamento", attr: { "aria-hidden": "true" } }).createSpan({ text: "◆" });
}

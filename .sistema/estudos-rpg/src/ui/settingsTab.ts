// Configurações → Estudos RPG. Tudo aqui é salvo em data.json do plugin
// (e entra no backup do Configs).

import { type App, PluginSettingTab, Setting } from "obsidian";
import type EstudosRPG from "../main.ts";
import { DEFAULT_SETTINGS, type XPConfig } from "../settings.ts";

export class AbaConfig extends PluginSettingTab {
  constructor(app: App, private plugin: EstudosRPG) {
    super(app, plugin);
  }

  override display(): void {
    const { containerEl: el } = this;
    const s = this.plugin.config;
    const salvar = () => this.plugin.salvarConfig();
    el.empty();

    new Setting(el).setName("Geral").setHeading();
    new Setting(el).setName("Abrir a ficha ao iniciar").setDesc("Abre a Ficha do herói quando o Obsidian começa.")
      .addToggle((t) => t.setValue(s.abrirAoIniciar).onChange(async (v) => { s.abrirAoIniciar = v; await salvar(); }));

    new Setting(el).setName("Pasta do diário").setDesc("Onde ficam as notas YYYY-MM-DD.md.")
      .addText((t) => t.setPlaceholder(DEFAULT_SETTINGS.pastaDiario).setValue(s.pastaDiario)
        .onChange(async (v) => { s.pastaDiario = v.trim() || DEFAULT_SETTINGS.pastaDiario; await salvar(); }));

    new Setting(el).setName("Modelo do diário").setDesc("Nota usada para criar o diário do dia. {{date}} vira a data.")
      .addText((t) => t.setPlaceholder(DEFAULT_SETTINGS.templateDiario).setValue(s.templateDiario)
        .onChange(async (v) => { s.templateDiario = v.trim(); await salvar(); }));

    new Setting(el).setName("Pastas ignoradas").setDesc("Uma por linha. Templates e rascunhos não contam XP nem entram na revisão.")
      .addTextArea((t) => t.setValue(s.pastasIgnoradas.join("\n"))
        .onChange(async (v) => { s.pastasIgnoradas = v.split("\n").map((x) => x.trim()).filter(Boolean); await salvar(); }));

    new Setting(el).setName("Revisão e calendário").setHeading();
    new Setting(el).setName("Intervalos de revisão (dias)").setDesc("Um número por caixa, separados por vírgula. O primeiro é a caixa 0 (ignorado).")
      .addText((t) => t.setValue(s.intervalos.join(", ")).onChange(async (v) => {
        const nums = v.split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n >= 0);
        if (nums.length >= 2) { s.intervalos = nums; await salvar(); }
      }));
    this.numero(el, "Semanas no calendário de atividade", s.semanasNoCalendario, 4, 52, async (n) => { s.semanasNoCalendario = n; await salvar(); });
    new Setting(el).setName("Faixas de cor do calendário (minutos)").setDesc("Separadas por vírgula. Ex.: 25, 50 → menos de 25, menos de 50, 50 ou mais.")
      .addText((t) => t.setValue(s.faixasCalendario.join(", ")).onChange(async (v) => {
        const nums = v.split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
        if (nums.length) { s.faixasCalendario = nums; await salvar(); }
      }));

    new Setting(el).setName("Sessão de estudo").setHeading();
    this.numero(el, "Meta semanal (minutos, 0 = sem meta)", s.metaSemanalMin, 0, 10000, async (n) => { s.metaSemanalMin = n; await salvar(); });
    this.numero(el, "Limite de uma sessão (minutos)", s.sessaoMaxMin, 1, 1440, async (n) => { s.sessaoMaxMin = n; await salvar(); });

    new Setting(el).setName("Experiência (XP)").setHeading();
    const rotulos: Record<keyof XPConfig, string> = {
      escrito: "Nota no nível escrito", praticado: "Nota no nível praticado", projeto: "Nota usada em projeto",
      topico: "Tópico marcado numa trilha", diario: "Dia de estudo (com minutos > 0)", dezMinutos: "A cada 10 minutos estudados", caixa: "Cada caixa de revisão alcançada",
    };
    for (const k of Object.keys(rotulos) as (keyof XPConfig)[]) {
      this.numero(el, rotulos[k], s.xp[k], 0, 1000, async (n) => { s.xp[k] = n; await salvar(); });
    }

    new Setting(el).setName("Títulos por nível").setDesc("Um por linha, do nível 1 em diante.")
      .addTextArea((t) => t.setValue(s.titulos.join("\n")).onChange(async (v) => {
        const lista = v.split("\n").map((x) => x.trim()).filter(Boolean);
        if (lista.length) { s.titulos = lista; await salvar(); }
      }));

    new Setting(el).addButton((b) => b.setButtonText("Restaurar padrões").setWarning().onClick(async () => {
      Object.assign(s, structuredClone(DEFAULT_SETTINGS));
      await salvar();
      this.display();
    }));
  }

  private numero(el: HTMLElement, nome: string, valor: number, min: number, max: number, onChange: (n: number) => Promise<void>) {
    new Setting(el).setName(nome).addText((t) => {
      t.inputEl.type = "number";
      t.inputEl.min = String(min);
      t.inputEl.max = String(max);
      t.setValue(String(valor)).onChange(async (v) => {
        const n = Math.round(Number(v));
        if (Number.isFinite(n) && n >= min && n <= max) await onChange(n);
      });
    });
  }
}

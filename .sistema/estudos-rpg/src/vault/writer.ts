// Todas as escritas no vault passam por aqui. Regra de ouro: nunca sobrescrever
// às cegas. Antes de mudar uma linha, confere se ela ainda é a mesma que lemos.

import { type App, Notice, TFile, normalizePath } from "obsidian";
import { alternarCheckbox } from "../domain/parse.ts";
import type { Settings } from "../settings.ts";

export class Writer {
  constructor(private app: App, private getSettings: () => Settings) {}

  /**
   * Marca/desmarca o checkbox da linha `linha`.
   * E se a nota mudou desde a leitura (linha movida/editada)? Procura a linha pelo texto;
   * se não achar, não mexe e avisa.
   */
  async alternarLinha(caminho: string, linha: number, raw: string): Promise<boolean> {
    const f = this.arquivo(caminho);
    if (!f) return false;
    let ok = false;
    await this.app.vault.process(f, (data) => {
      const quebra = data.includes("\r\n") ? "\r\n" : "\n";
      const linhas = data.split(/\r?\n/);
      let i = linhas[linha] === raw ? linha : linhas.indexOf(raw);
      if (i < 0) return data;
      linhas[i] = alternarCheckbox(linhas[i] ?? "");
      ok = true;
      return linhas.join(quebra);
    });
    if (!ok) new Notice("A nota mudou desde a última leitura. Tente de novo.");
    return ok;
  }

  async propriedades(caminho: string, patch: Record<string, unknown>): Promise<void> {
    const f = this.arquivo(caminho);
    if (!f) return;
    await this.app.fileManager.processFrontMatter(f, (fm: Record<string, unknown>) => Object.assign(fm, patch));
  }

  /** Cria (se preciso) e devolve a nota do diário de `data`. */
  async diario(data: string): Promise<TFile> {
    const s = this.getSettings();
    const pasta = normalizePath(s.pastaDiario);
    const caminho = normalizePath(`${pasta}/${data}.md`);
    const existente = this.app.vault.getAbstractFileByPath(caminho);
    if (existente instanceof TFile) return existente;

    if (!this.app.vault.getAbstractFileByPath(pasta)) await this.app.vault.createFolder(pasta);
    const tpl = this.app.vault.getAbstractFileByPath(normalizePath(s.templateDiario));
    // E se o template não existir? Usa um modelo mínimo em vez de quebrar.
    const corpo = tpl instanceof TFile
      ? (await this.app.vault.read(tpl)).replace(/\{\{date(?::[^}]*)?\}\}/g, data)
      : `---\nminutos: 25\n---\n\n# 📜 ${data}\n\n**O que estudei:**\n- \n`;
    return this.app.vault.create(caminho, corpo);
  }

  private arquivo(caminho: string): TFile | null {
    const f = this.app.vault.getAbstractFileByPath(caminho);
    if (f instanceof TFile) return f;
    new Notice(`Não achei a nota ${caminho}.`);
    return null;
  }
}

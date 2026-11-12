// Ponto de entrada do plugin "Estudos RPG".
//
// Fluxo:  vault muda → Indexer monta um Snapshot → progresso/conquistas são calculados
//         → a Ficha (e a barra de status) redesenham. Nada fica "salvo à parte":
//         a verdade está sempre nas suas notas.

import { MarkdownView, Notice, Plugin, TFile, debounce } from "obsidian";
import { hojeISO } from "./domain/dates.ts";
import { avaliarConquistas, calcularProgresso, type Conquista, type Progresso } from "./domain/progress.ts";
import { aposEsquecer, aposLembrar, infoRevisao, normalizarCaixa, ordenarFila } from "./domain/review.ts";
import { NIVEIS, type Nivel, type Snapshot } from "./domain/types.ts";
import { mergeSettings, type Settings } from "./settings.ts";
import { AbaConfig } from "./ui/settingsTab.ts";
import { FichaView, VIEW_FICHA } from "./ui/view.ts";
import { Indexer } from "./vault/indexer.ts";
import { Writer } from "./vault/writer.ts";

export interface Dados {
  snap: Snapshot;
  prog: Progresso;
  conquistas: Conquista[];
}

export default class EstudosRPG extends Plugin {
  config!: Settings;
  writer!: Writer;
  dados: Dados | null = null;

  private indexer!: Indexer;
  private ouvintes = new Set<() => void>();
  private statusEl: HTMLElement | null = null;
  private atualizando: Promise<void> | null = null;
  private pendente = false;

  override async onload() {
    this.config = mergeSettings(await this.loadData());
    this.indexer = new Indexer(this.app, () => this.config);
    this.writer = new Writer(this.app, () => this.config);

    this.registerView(VIEW_FICHA, (leaf) => new FichaView(leaf, this));
    this.addRibbonIcon("shield", "Abrir a ficha do herói", () => this.abrirFicha());
    this.addSettingTab(new AbaConfig(this.app, this));
    this.registrarComandos();

    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("erpg-status");
    this.statusEl.addEventListener("click", () => this.abrirFicha());

    // Qualquer mudança relevante no vault agenda uma atualização (agrupada).
    const agendar = debounce(() => void this.atualizarAgora(), 400, true);
    this.registerEvent(this.app.metadataCache.on("changed", agendar));
    this.registerEvent(this.app.vault.on("create", agendar));
    this.registerEvent(this.app.vault.on("delete", (f) => { this.indexer.esquecer(f.path); agendar(); }));
    this.registerEvent(this.app.vault.on("rename", (_f, antigo) => { this.indexer.esquecer(antigo); agendar(); }));
    // Virou o dia com o Obsidian aberto? Recalcula sequência, revisões e pergunta do dia.
    this.registerInterval(window.setInterval(() => { if (this.dados && this.dados.snap.hoje !== this.hoje()) void this.atualizarAgora(); }, 60_000));

    this.app.workspace.onLayoutReady(async () => {
      await this.atualizarAgora();
      if (this.config.abrirAoIniciar) await this.abrirFicha();
    });
  }

  override onunload() {
    this.ouvintes.clear();
  }

  hoje(): string {
    return hojeISO();
  }

  /** Inscreve um ouvinte de atualização; devolve a função que cancela a inscrição. */
  aoAtualizar(fn: () => void): () => void {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }

  /**
   * Relê o vault agora. E se já estiver relendo? Marca como pendente e roda
   * mais uma vez no fim, em vez de duas leituras ao mesmo tempo.
   */
  async atualizarAgora(): Promise<void> {
    if (this.atualizando) { this.pendente = true; return this.atualizando; }
    this.atualizando = (async () => {
      do {
        this.pendente = false;
        try {
          const snap = await this.indexer.construir(this.hoje());
          const prog = calcularProgresso(snap, this.config.xp, this.config.titulos);
          const conquistas = avaliarConquistas(snap, prog);
          this.anunciar(this.dados, { snap, prog, conquistas });
          this.dados = { snap, prog, conquistas };
          this.atualizarStatus();
          this.ouvintes.forEach((fn) => fn());
        } catch (e) {
          console.error("[estudos-rpg] falha ao ler o vault", e);
          new Notice("Estudos RPG: erro ao ler o vault. Veja o console (Ctrl+Shift+I).");
        }
      } while (this.pendente);
    })().finally(() => { this.atualizando = null; });
    return this.atualizando;
  }

  /** Avisos de XP, nível e conquistas (comparando com a leitura anterior). */
  private anunciar(antes: Dados | null, depois: Dados) {
    if (!antes) return; // primeira leitura: nada a anunciar
    const delta = depois.prog.xp - antes.prog.xp;
    if (delta > 0) new Notice(`✦ +${delta} XP`, 2500);
    if (depois.prog.nivel > antes.prog.nivel) new Notice(`⚜ Subiu de nível! Nível ${depois.prog.nivel} · ${depois.prog.titulo}`, 6000);
    const tinha = new Set(antes.conquistas.filter((c) => c.ok).map((c) => c.id));
    for (const c of depois.conquistas) if (c.ok && !tinha.has(c.id)) new Notice(`🏆 Troféu conquistado: ${c.nome}`, 6000);
  }

  private atualizarStatus() {
    if (!this.statusEl || !this.dados) return;
    const p = this.dados.prog;
    this.statusEl.setText(`⚜ Nv ${p.nivel} · ${p.xp}/${p.xpProximo} XP${p.sequencia ? ` · 🔥${p.sequencia}` : ""}`);
    this.statusEl.setAttr("aria-label", "Abrir a ficha do herói");
  }

  async abrirFicha() {
    const existente = this.app.workspace.getLeavesOfType(VIEW_FICHA)[0];
    const leaf = existente ?? this.app.workspace.getLeaf(false);
    if (!existente) await leaf.setViewState({ type: VIEW_FICHA, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  async salvarConfig() {
    await this.saveData(this.config);
    await this.atualizarAgora();
  }

  // ------------------------------------------------------------ comandos (Ctrl+P)
  private registrarComandos() {
    this.addCommand({ id: "abrir-ficha", name: "Abrir a ficha do herói", callback: () => this.abrirFicha() });

    this.addCommand({
      id: "diario-hoje", name: "Abrir/criar o diário de hoje",
      callback: async () => { const f = await this.writer.diario(this.hoje()); await this.app.workspace.getLeaf(false).openFile(f); },
    });

    this.addCommand({
      id: "proxima-revisao", name: "Abrir a próxima nota para revisar",
      callback: () => {
        const d = this.dados;
        if (!d) return;
        const fila = ordenarFila(d.snap.notas.map((n) => ({ n, ...infoRevisao(n, d.snap.hoje, this.config.intervalos) })).filter((x) => x.vencida));
        const prox = fila[0];
        if (!prox) { new Notice("Nenhuma revisão vencida hoje."); return; }
        void this.app.workspace.openLinkText(prox.n.caminho, "", false);
      },
    });

    // Comandos que agem sobre a nota aberta (só aparecem quando há uma nota de estudo aberta).
    const naNota = (id: string, name: string, acao: (f: TFile, fm: Record<string, unknown>) => Promise<void>) =>
      this.addCommand({
        id, name,
        checkCallback: (checando) => {
          const f = this.app.workspace.getActiveViewOfType(MarkdownView)?.file;
          const fm = f ? (this.app.metadataCache.getFileCache(f)?.frontmatter ?? {}) as Record<string, unknown> : null;
          if (!f || !fm || !NIVEIS.includes(String(fm.nivel ?? "") as Nivel)) return false;
          if (!checando) void acao(f, fm);
          return true;
        },
      });

    naNota("subir-nivel", "Subir o nível da nota atual (escrito → praticado → projeto)", async (f, fm) => {
      const atual = NIVEIS.indexOf(String(fm.nivel) as Nivel);
      const novo = NIVEIS[Math.min(NIVEIS.length - 1, atual + 1)] ?? "projeto";
      if (novo === fm.nivel) { new Notice("Essa nota já está no nível máximo."); return; }
      await this.writer.propriedades(f.path, { nivel: novo });
      new Notice(`Nível da nota: ${novo}`);
    });

    const revisarAtual = (lembrou: boolean) => async (f: TFile, fm: Record<string, unknown>) => {
      const estado = { caixa: normalizarCaixa(fm.caixa, this.config.intervalos), revisado: typeof fm.revisado === "string" ? fm.revisado : null };
      const caixa = lembrou ? aposLembrar(estado, this.config.intervalos) : aposEsquecer();
      await this.writer.propriedades(f.path, { caixa, revisado: this.hoje() });
      new Notice(lembrou ? `Caixa ${caixa}: volta em ${this.config.intervalos[caixa] ?? "?"} dia(s).` : "Volta amanhã.");
    };
    naNota("lembrei", "Revisão: lembrei desta nota", revisarAtual(true));
    naNota("esqueci", "Revisão: esqueci desta nota", revisarAtual(false));
  }
}

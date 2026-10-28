const { Plugin, TFolder } = require("obsidian");

module.exports = class EstudosDashboardPlugin extends Plugin {
  onload() {
    this.instances = new Map();
    this.refreshTimer = null;

    this.registerMarkdownCodeBlockProcessor("estudos-dashboard", async (_source, el, ctx) => {
      this.instances.set(el, ctx.sourcePath);
      el.empty();
      el.addClass("estudos-dashboard-host");
      el.addEventListener("mousedown", (event) => {
        if (!event.target.closest("a")) event.preventDefault();
      });
      await this.renderDashboard(el, ctx.sourcePath);
    });

    ["create", "delete", "rename", "modify"].forEach((eventName) => {
      this.registerEvent(this.app.vault.on(eventName, () => this.scheduleRefresh()));
    });
    this.registerEvent(this.app.metadataCache.on("changed", () => this.scheduleRefresh()));
    this.register(() => window.clearTimeout(this.refreshTimer));
  }

  scheduleRefresh() {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.refreshAll(), 180);
  }

  async refreshAll() {
    for (const [el, sourcePath] of this.instances) {
      if (!el.isConnected) {
        this.instances.delete(el);
        continue;
      }
      await this.renderDashboard(el, sourcePath);
    }
  }

  async getDashboardData() {
    const root = this.app.vault.getAbstractFileByPath("Programação");
    if (!(root instanceof TFolder)) return { folders: [], done: 0, total: 0, notes: 0 };

    const allNotes = this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith("Programação/"));
    let done = 0;
    let total = 0;

    for (const note of allNotes) {
      const text = await this.app.vault.read(note);
      for (const match of text.matchAll(/^\s*-\s+\[([ xX])\]\s+/gm)) {
        total += 1;
        if (match[1].toLowerCase() === "x") done += 1;
      }
    }

    const folders = [];
    for (const folder of root.children.filter((item) => item instanceof TFolder)) {
      const prefix = `${folder.path}/`;
      const notes = allNotes.filter((file) => file.path.startsWith(prefix));
      let folderDone = 0;
      let folderTotal = 0;

      for (const note of notes) {
        const text = await this.app.vault.read(note);
        for (const match of text.matchAll(/^\s*-\s+\[([ xX])\]\s+/gm)) {
          folderTotal += 1;
          if (match[1].toLowerCase() === "x") folderDone += 1;
        }
      }

      const target = notes.find((file) => file.name.toLowerCase() === "readme.md") || notes[0] || null;
      folders.push({
        name: folder.name.replace(/^\d+\s*-\s*/, ""),
        number: (folder.name.match(/^\d+/) || ["--"])[0],
        done: folderDone,
        total: folderTotal,
        notes: notes.length,
        target,
      });
    }

    folders.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
    return { folders, done, total, notes: allNotes.length };
  }

  makeLink(parent, classes, label, target, sourcePath) {
    const link = parent.createEl("a", { cls: classes, text: label });
    if (!target) {
      link.addClass("is-empty");
      link.removeAttribute("href");
      return link;
    }
    link.addClass("internal-link");
    link.href = target.path;
    link.dataset.href = target.path.replace(/\.md$/i, "");
    link.dataset.sourcePath = sourcePath;
    return link;
  }

  async renderDashboard(el, sourcePath) {
    const data = await this.getDashboardData();
    const percent = data.total ? ((data.done / data.total) * 100).toFixed(1).replace(".", ",") : "0,0";
    el.empty();

    const page = el.createDiv({ cls: "estudos-page" });
    const header = page.createEl("header", { cls: "estudos-header" });
    header.createEl("span", { cls: "estudos-brand", text: "[ estudos ]" });
    const meta = header.createDiv({ cls: "estudos-header-meta" });
    meta.createEl("span", { text: "programação" });
    meta.createEl("span", { text: "auto" });

    const main = page.createEl("main", { cls: "estudos-main" });
    const lead = main.createEl("section", { cls: "estudos-lead" });
    const leadCopy = lead.createDiv({ cls: "estudos-lead-copy" });
    leadCopy.createEl("p", { cls: "estudos-kicker", text: "índice automático" });
    leadCopy.createEl("h1", { text: "Programação" });
    leadCopy.createEl("p", {
      cls: "estudos-description",
      text: `${data.folders.length} pastas · ${data.notes} notas · ${data.total} tarefas rastreadas.`,
    });

    const quickLinks = leadCopy.createDiv({ cls: "estudos-lead-links" });
    const roadmap = this.app.vault.getAbstractFileByPath("Programação/00 - Roadmap 🗺️/Roadmap.md");
    const apis = this.app.vault.getAbstractFileByPath("Programação/APIs/README.md");
    this.makeLink(quickLinks, "", "abrir roadmap ↗", roadmap, sourcePath);
    this.makeLink(quickLinks, "", "ver APIs ↗", apis, sourcePath);

    const index = lead.createEl("nav", { cls: "estudos-index", attr: { "aria-label": "Pastas de programação" } });
    index.createEl("p", { cls: "estudos-kicker", text: "pastas" });
    for (const folder of data.folders) {
      const link = this.makeLink(index, "", "", folder.target, sourcePath);
      link.createEl("span", { text: folder.number });
      link.createEl("em", { text: folder.name });
      link.createEl("b", { text: folder.total ? `${folder.done}/${folder.total}` : `${folder.notes} nota${folder.notes === 1 ? "" : "s"}` });
    }

    const roadmapSection = main.createEl("section", { cls: "estudos-roadmap" });
    const roadmapHeader = roadmapSection.createDiv({ cls: "estudos-roadmap-header" });
    const heading = roadmapHeader.createDiv();
    heading.createEl("p", { cls: "estudos-kicker", text: "progresso automático" });
    heading.createEl("h2", { text: "Tarefas do roadmap" });
    const total = roadmapHeader.createDiv({ cls: "estudos-total" });
    total.createEl("strong", { text: String(data.done) });
    total.createEl("span", { text: `/ ${data.total} · ${percent}%` });

    const progress = roadmapSection.createDiv({ cls: "estudos-progress", attr: { "aria-label": `${percent}% concluído` } });
    progress.createEl("i", { attr: { style: `width:${Math.min(100, data.total ? (data.done / data.total) * 100 : 0)}%` } });

    const stages = roadmapSection.createDiv({ cls: "estudos-stages" });
    for (const folder of data.folders) {
      const stage = this.makeLink(stages, "estudos-stage", "", folder.target, sourcePath);
      if (folder.total && folder.done === folder.total) stage.addClass("is-done");
      if (folder.done > 0 && folder.done < folder.total) stage.addClass("is-active");
      stage.createEl("span", { text: folder.number });
      stage.createEl("strong", { text: folder.name });
      stage.createEl("small", { text: folder.total ? `${folder.done} / ${folder.total} tarefas` : `${folder.notes} notas` });
      stage.createEl("b", { text: folder.total ? `${folder.total ? Math.round((folder.done / folder.total) * 100) : 0}%` : "sem tarefas" });
    }
  }
};

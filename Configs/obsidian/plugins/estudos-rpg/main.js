"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => EstudosRPG
});
module.exports = __toCommonJS(main_exports);
var import_obsidian8 = require("obsidian");

// src/domain/dates.ts
function hojeISO(agora = /* @__PURE__ */ new Date()) {
  return toISO(agora);
}
function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function parseISO(v) {
  if (v == null || v === "") return null;
  const s = v instanceof Date ? toISO(v) : String(v).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? s : null;
}
function addDias(iso, dias) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + dias));
}
function diffDias(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}
function relativo(iso, hoje) {
  const n = diffDias(hoje, iso);
  if (n === 0) return "hoje";
  if (n === 1) return "amanh\xE3";
  if (n === -1) return "ontem";
  return n > 0 ? `em ${n} dias` : `h\xE1 ${-n} dias`;
}

// src/domain/progress.ts
function nivelPara(xp) {
  let n = 1;
  while (50 * (n + 1) * n <= xp) n++;
  return { nivel: n, base: 50 * n * (n - 1), proximo: 50 * (n + 1) * n };
}
function sequencia(dias, hoje) {
  let d = dias.has(hoje) ? hoje : addDias(hoje, -1);
  let n = 0;
  while (dias.has(d)) {
    n++;
    d = addDias(d, -1);
  }
  return n;
}
function calcularProgresso(s, xp, titulos) {
  const contagemNivel = { escrito: 0, praticado: 0, projeto: 0 };
  let caixas = 0;
  for (const n of s.notas) {
    contagemNivel[n.nivel]++;
    caixas += n.caixa;
  }
  let topicosFeitos = 0, topicosTotal = 0;
  for (const t of s.trilhas) for (const r of t.regioes) for (const tp of r.topicos) {
    topicosTotal++;
    if (tp.feito) topicosFeitos++;
  }
  let tarefas = 0;
  for (const m of s.missoes) for (const f of m.fases) for (const t of f.tarefas) if (t.feita) tarefas++;
  const partes = {
    notas: contagemNivel.escrito * xp.escrito + contagemNivel.praticado * xp.praticado + contagemNivel.projeto * xp.projeto,
    topicos: topicosFeitos * xp.topico,
    diario: s.diario.size * xp.diario,
    revisao: caixas * xp.caixa,
    missoes: tarefas * xp.tarefa
  };
  const total = Object.values(partes).reduce((a, b) => a + b, 0);
  const lv = nivelPara(total);
  const dias = new Set(s.diario.keys());
  return {
    xp: total,
    partes,
    nivel: lv.nivel,
    xpNivel: lv.base,
    xpProximo: lv.proximo,
    titulo: titulos[Math.min(lv.nivel - 1, titulos.length - 1)] ?? "Aventureiro",
    sequencia: sequencia(dias, s.hoje),
    estudouHoje: dias.has(s.hoje),
    contagemNivel,
    topicosFeitos,
    topicosTotal
  };
}
var faseConcluida = (s, n) => s.missoes.some((m) => m.fases.some((f) => f.num === n && f.tarefas.length > 0 && f.tarefas.every((t) => t.feita)));
var CONQUISTAS = [
  { id: "primeira-sessao", icone: "sprout", nome: "Primeira jornada", desc: "Registre um dia no di\xE1rio", raridade: "comum", teste: (s) => s.diario.size >= 1 },
  { id: "chama-3", icone: "flame", nome: "Chama acesa", desc: "3 dias seguidos de estudo", raridade: "comum", teste: (_, p) => p.sequencia >= 3 },
  { id: "pratica", icone: "hammer", nome: "M\xE3o na forja", desc: "Uma nota no n\xEDvel praticado", raridade: "comum", teste: (_, p) => p.contagemNivel.praticado + p.contagemNivel.projeto >= 1 },
  { id: "chama-7", icone: "flame-kindling", nome: "Fogo eterno", desc: "7 dias seguidos de estudo", raridade: "raro", teste: (_, p) => p.sequencia >= 7 },
  { id: "estudioso", icone: "book-open", nome: "Estudioso", desc: "10 dias de estudo no total", raridade: "raro", teste: (s) => s.diario.size >= 10 },
  { id: "explorador", icone: "compass", nome: "Explorador", desc: "Avance em 5 regi\xF5es do mapa", raridade: "raro", teste: (s) => s.trilhas.flatMap((t) => t.regioes).filter((r) => r.topicos.some((x) => x.feito)).length >= 5 },
  { id: "missao-1", icone: "swords", nome: "Primeira miss\xE3o", desc: "Conclua a Fase 1 de uma miss\xE3o", raridade: "raro", teste: (s) => faseConcluida(s, 1) },
  { id: "projeto", icone: "castle", nome: "Construtor", desc: "Uma nota usada em projeto", raridade: "epico", teste: (_, p) => p.contagemNivel.projeto >= 1 },
  { id: "regiao", icone: "flag", nome: "Conquistador", desc: "Conclua uma regi\xE3o inteira do mapa", raridade: "epico", teste: (s) => s.trilhas.some((t) => t.regioes.some((r) => r.topicos.every((x) => x.feito))) },
  { id: "memoria", icone: "brain", nome: "Mem\xF3ria de drag\xE3o", desc: "Uma nota na \xFAltima caixa de revis\xE3o", raridade: "epico", teste: (s) => s.notas.some((n) => n.caixa >= 5) },
  { id: "chama-30", icone: "sun", nome: "Sol invicto", desc: "30 dias seguidos de estudo", raridade: "lendario", teste: (_, p) => p.sequencia >= 30 },
  { id: "nivel-8", icone: "crown", nome: "Lenda", desc: "Chegue ao n\xEDvel 8", raridade: "lendario", teste: (_, p) => p.nivel >= 8 }
];
function avaliarConquistas(s, p) {
  return CONQUISTAS.map(({ teste, ...c }) => ({ ...c, ok: teste(s, p) }));
}

// src/domain/review.ts
function caixaMax(intervalos) {
  return Math.max(1, intervalos.length - 1);
}
function normalizarCaixa(v, intervalos) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.min(caixaMax(intervalos), Math.max(0, n)) : 0;
}
function infoRevisao(e, hoje, intervalos) {
  if (!e.revisado) return { ...e, proxima: null, vencida: true };
  const dias = intervalos[Math.max(1, e.caixa)] ?? intervalos[intervalos.length - 1] ?? 1;
  const proxima = addDias(e.revisado, dias);
  return { ...e, proxima, vencida: diffDias(hoje, proxima) <= 0 };
}
function aposLembrar(e, intervalos) {
  if (!e.revisado || e.caixa < 1) return 1;
  return Math.min(caixaMax(intervalos), e.caixa + 1);
}
function aposEsquecer() {
  return 1;
}
function ordenarFila(itens) {
  return [...itens].sort((a, b) => (a.proxima ?? "") < (b.proxima ?? "") ? -1 : (a.proxima ?? "") > (b.proxima ?? "") ? 1 : 0);
}

// src/domain/types.ts
var NIVEIS = ["escrito", "praticado", "projeto"];

// src/settings.ts
var DEFAULT_SETTINGS = {
  abrirAoIniciar: true,
  pastaDiario: "estudos/Di\xE1rio",
  templateDiario: "estudos/Programa\xE7\xE3o/Template/Di\xE1rio.md",
  pastasIgnoradas: ["estudos/Programa\xE7\xE3o/Template"],
  intervalos: [0, 1, 3, 7, 14, 30, 60],
  semanasNoCalendario: 30,
  xp: { escrito: 20, praticado: 60, projeto: 120, topico: 10, diario: 15, caixa: 10, tarefa: 25 },
  titulos: ["Aprendiz", "Escudeiro", "Cavaleiro", "Cavaleiro do C\xF3digo", "Mago dos Bits", "Arquimago", "Lorde do Terminal", "Lenda do Reino"]
};
function mergeSettings(saved) {
  const s = saved && typeof saved === "object" ? saved : {};
  const d = DEFAULT_SETTINGS;
  const xpSalvo = s.xp && typeof s.xp === "object" ? s.xp : {};
  const xp = { ...d.xp };
  for (const k of Object.keys(xp)) if (typeof xpSalvo[k] === "number") xp[k] = xpSalvo[k];
  return {
    abrirAoIniciar: typeof s.abrirAoIniciar === "boolean" ? s.abrirAoIniciar : d.abrirAoIniciar,
    pastaDiario: typeof s.pastaDiario === "string" && s.pastaDiario.trim() ? s.pastaDiario : d.pastaDiario,
    templateDiario: typeof s.templateDiario === "string" ? s.templateDiario : d.templateDiario,
    pastasIgnoradas: Array.isArray(s.pastasIgnoradas) ? s.pastasIgnoradas.filter((x) => typeof x === "string") : d.pastasIgnoradas,
    intervalos: listaDe(s.intervalos, (x) => typeof x === "number" && x >= 0, d.intervalos, 2),
    semanasNoCalendario: typeof s.semanasNoCalendario === "number" ? s.semanasNoCalendario : d.semanasNoCalendario,
    xp,
    titulos: listaDe(s.titulos, (x) => typeof x === "string" && x.trim() !== "", d.titulos, 1)
  };
}
function listaDe(v, valido, padrao, minimo) {
  if (!Array.isArray(v)) return [...padrao];
  const ok = v.filter(valido);
  return ok.length >= minimo ? ok : [...padrao];
}

// src/ui/settingsTab.ts
var import_obsidian = require("obsidian");
var AbaConfig = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  plugin;
  display() {
    const { containerEl: el } = this;
    const s = this.plugin.config;
    const salvar = () => this.plugin.salvarConfig();
    el.empty();
    new import_obsidian.Setting(el).setName("Geral").setHeading();
    new import_obsidian.Setting(el).setName("Abrir a ficha ao iniciar").setDesc("Abre a Ficha do her\xF3i quando o Obsidian come\xE7a.").addToggle((t) => t.setValue(s.abrirAoIniciar).onChange(async (v) => {
      s.abrirAoIniciar = v;
      await salvar();
    }));
    new import_obsidian.Setting(el).setName("Pasta do di\xE1rio").setDesc("Onde ficam as notas YYYY-MM-DD.md.").addText((t) => t.setPlaceholder(DEFAULT_SETTINGS.pastaDiario).setValue(s.pastaDiario).onChange(async (v) => {
      s.pastaDiario = v.trim() || DEFAULT_SETTINGS.pastaDiario;
      await salvar();
    }));
    new import_obsidian.Setting(el).setName("Modelo do di\xE1rio").setDesc("Nota usada para criar o di\xE1rio do dia. {{date}} vira a data.").addText((t) => t.setPlaceholder(DEFAULT_SETTINGS.templateDiario).setValue(s.templateDiario).onChange(async (v) => {
      s.templateDiario = v.trim();
      await salvar();
    }));
    new import_obsidian.Setting(el).setName("Pastas ignoradas").setDesc("Uma por linha. Templates e rascunhos n\xE3o contam XP nem entram na revis\xE3o.").addTextArea((t) => t.setValue(s.pastasIgnoradas.join("\n")).onChange(async (v) => {
      s.pastasIgnoradas = v.split("\n").map((x) => x.trim()).filter(Boolean);
      await salvar();
    }));
    new import_obsidian.Setting(el).setName("Revis\xE3o e calend\xE1rio").setHeading();
    new import_obsidian.Setting(el).setName("Intervalos de revis\xE3o (dias)").setDesc("Um n\xFAmero por caixa, separados por v\xEDrgula. O primeiro \xE9 a caixa 0 (ignorado).").addText((t) => t.setValue(s.intervalos.join(", ")).onChange(async (v) => {
      const nums = v.split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n >= 0);
      if (nums.length >= 2) {
        s.intervalos = nums;
        await salvar();
      }
    }));
    this.numero(el, "Semanas no calend\xE1rio de atividade", s.semanasNoCalendario, 4, 52, async (n) => {
      s.semanasNoCalendario = n;
      await salvar();
    });
    new import_obsidian.Setting(el).setName("Experi\xEAncia (XP)").setHeading();
    const rotulos = {
      escrito: "Nota no n\xEDvel escrito",
      praticado: "Nota no n\xEDvel praticado",
      projeto: "Nota usada em projeto",
      topico: "T\xF3pico marcado numa trilha",
      diario: "Dia registrado no di\xE1rio",
      caixa: "Cada caixa de revis\xE3o alcan\xE7ada",
      tarefa: "Tarefa de miss\xE3o conclu\xEDda"
    };
    for (const k of Object.keys(rotulos)) {
      this.numero(el, rotulos[k], s.xp[k], 0, 1e3, async (n) => {
        s.xp[k] = n;
        await salvar();
      });
    }
    new import_obsidian.Setting(el).setName("T\xEDtulos por n\xEDvel").setDesc("Um por linha, do n\xEDvel 1 em diante.").addTextArea((t) => t.setValue(s.titulos.join("\n")).onChange(async (v) => {
      const lista = v.split("\n").map((x) => x.trim()).filter(Boolean);
      if (lista.length) {
        s.titulos = lista;
        await salvar();
      }
    }));
    new import_obsidian.Setting(el).addButton((b) => b.setButtonText("Restaurar padr\xF5es").setWarning().onClick(async () => {
      Object.assign(s, structuredClone(DEFAULT_SETTINGS));
      await salvar();
      this.display();
    }));
  }
  numero(el, nome, valor, min, max, onChange) {
    new import_obsidian.Setting(el).setName(nome).addText((t) => {
      t.inputEl.type = "number";
      t.inputEl.min = String(min);
      t.inputEl.max = String(max);
      t.setValue(String(valor)).onChange(async (v) => {
        const n = Math.round(Number(v));
        if (Number.isFinite(n) && n >= min && n <= max) await onChange(n);
      });
    });
  }
};

// src/ui/view.ts
var import_obsidian5 = require("obsidian");

// src/ui/sections.ts
var import_obsidian3 = require("obsidian");

// src/domain/parse.ts
var EMOJI = /\p{Extended_Pictographic}|️|‍|⃣/gu;
function limparTitulo(t) {
  return t.replace(/^(?:[0-9#*]️?⃣\s*)+/u, "").replace(EMOJI, "").replace(/\s+/g, " ").trim();
}
var CHECKBOX = /^\s*-\s\[([ xX])\]\s+(.*)$/;
var WIKILINK = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/;
function parseTrilha(texto, resolver) {
  const regioes = [];
  let atual = null;
  let emFrontmatter = false;
  let emCodigo = false;
  texto.split(/\r?\n/).forEach((linha, i) => {
    if (i === 0 && linha === "---") {
      emFrontmatter = true;
      return;
    }
    if (emFrontmatter) {
      if (linha === "---") emFrontmatter = false;
      return;
    }
    if (/^\s*(```|~~~)/.test(linha)) {
      emCodigo = !emCodigo;
      return;
    }
    if (emCodigo) return;
    const h = linha.match(/^(#{1,2})\s+(.*)$/);
    if (h) {
      atual = { nome: limparTitulo(h[2] ?? ""), nivelTitulo: h[1]?.length ?? 1, destaque: /⭐/.test(h[2] ?? ""), desc: "", topicos: [] };
      regioes.push(atual);
      return;
    }
    if (!atual) return;
    const regiao = atual;
    const q = linha.match(/^>\s?(.*)$/);
    if (q) {
      if (!regiao.desc && !regiao.topicos.length) regiao.desc = (q[1] ?? "").trim();
      return;
    }
    const c = linha.match(CHECKBOX);
    if (!c) return;
    const resto = c[2] ?? "";
    const link = resto.match(WIKILINK);
    if (!link) return;
    const alvo = (link[1] ?? "").trim();
    let label = link[2]?.trim() || alvo.split("/").pop() || alvo;
    if (label.toLowerCase() === "readme") {
      const p = alvo.split("/");
      label = p[p.length - 2] ?? label;
    }
    const depois = resto.slice(resto.indexOf(link[0]) + link[0].length);
    const traco = depois.search(/[—–-]\s/);
    const desc = (traco >= 0 ? depois.slice(traco + 1) : depois).replace(/[`*_]/g, "").trim();
    const topico2 = { label, alvo, desc, feito: (c[1] ?? " ").toLowerCase() === "x", linha: i, raw: linha, caminho: resolver(alvo) };
    regiao.topicos.push(topico2);
  });
  return regioes.filter((r) => r.topicos.length > 0);
}
function parseMissao(texto) {
  const fases = [];
  let atual = null;
  texto.split(/\r?\n/).forEach((linha, i) => {
    const f = linha.match(/^##\s+Fase\s+(\d+)\s*[:—–-]\s*(.*)$/i);
    if (f) {
      atual = { num: Number(f[1]), titulo: limparTitulo((f[2] ?? "").replace(/\(.*?\)/g, "")), entrega: "", tarefas: [] };
      fases.push(atual);
      return;
    }
    if (/^#{1,2}\s/.test(linha)) {
      atual = null;
      return;
    }
    if (!atual) return;
    const fase = atual;
    const e = linha.match(/^\*\*Entrega:\*\*\s*(.*)$/i);
    if (e) {
      fase.entrega = (e[1] ?? "").trim();
      return;
    }
    const c = linha.match(CHECKBOX);
    if (c) fase.tarefas.push({ texto: (c[2] ?? "").trim(), feita: (c[1] ?? " ").toLowerCase() === "x", linha: i, raw: linha });
  });
  return fases;
}
function parsePerguntas(texto) {
  const out = [];
  const re = /^> \[!question\][-+]?[ \t]*(.+)\n((?:>.*(?:\n|$))*)/gm;
  const t = texto.replace(/\r\n/g, "\n");
  let m;
  while (m = re.exec(t)) {
    const pergunta2 = (m[1] ?? "").trim();
    const resposta = (m[2] ?? "").split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").replace(/\s+/g, " ").trim();
    if (!pergunta2 || /^\[.*\]$/.test(pergunta2) || !resposta || /^\[.*\]$/.test(resposta)) continue;
    out.push({ pergunta: pergunta2, resposta });
  }
  return out;
}
function alternarCheckbox(linha) {
  return /\[[xX]\]/.test(linha) ? linha.replace(/\[[xX]\]/, "[ ]") : linha.replace(/\[ \]/, "[x]");
}
function semWikilinks(t) {
  return t.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2");
}

// src/domain/quiz.ts
function indiceDoDia(hoje, total) {
  if (total <= 0) return -1;
  let h = 0;
  for (const ch of hoje) h = h * 31 + ch.charCodeAt(0) >>> 0;
  return h % total;
}

// src/ui/dom.ts
var import_obsidian2 = require("obsidian");
function icone(parent, nome, cls = "erpg-ico") {
  const span = parent.createSpan({ cls });
  (0, import_obsidian2.setIcon)(span, nome);
  return span;
}
function botao(parent, texto, onClick, opts = {}) {
  const b = parent.createEl("button", {
    cls: `erpg-btn is-${opts.variante ?? "primario"}${opts.pequeno ? " is-sm" : ""}`,
    attr: opts.titulo ? { "aria-label": opts.titulo } : {}
  });
  if (opts.icone) icone(b, opts.icone);
  b.createSpan({ text: texto });
  b.addEventListener("click", async (ev) => {
    if (b.disabled) return;
    b.disabled = true;
    try {
      await onClick(ev);
    } finally {
      b.disabled = false;
    }
  });
  return b;
}
function painel(parent, iconeNome, titulo, sub, cls = "") {
  const sec = parent.createEl("section", { cls: `erpg-painel ${cls}`.trim() });
  const cab = sec.createDiv({ cls: "erpg-painel-cab" });
  icone(cab, iconeNome, "erpg-ico erpg-selo");
  const tt = cab.createDiv({ cls: "erpg-painel-tt" });
  tt.createEl("h2", { text: titulo });
  if (sub) tt.createDiv({ cls: "erpg-painel-sub", text: sub });
  return sec.createDiv({ cls: "erpg-painel-corpo" });
}
function barra(parent, fracao, cls = "erpg-barra", rotulo2) {
  const pct = Math.max(0, Math.min(1, Number.isFinite(fracao) ? fracao : 0)) * 100;
  const b = parent.createDiv({ cls, attr: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(Math.round(pct)), ...rotulo2 ? { "aria-label": rotulo2 } : {} } });
  b.createDiv({ cls: "erpg-barra-fill" }).style.width = `${pct.toFixed(1)}%`;
  return b;
}
function vazio(parent, texto, dica) {
  const v = parent.createDiv({ cls: "erpg-vazio" });
  v.createEl("p", { text: texto });
  if (dica) v.createEl("p", { cls: "erpg-dica", text: dica });
}
function ornamento(parent) {
  parent.createDiv({ cls: "erpg-ornamento", attr: { "aria-hidden": "true" } }).createSpan({ text: "\u25C6" });
}

// src/ui/sections.ts
var NOME_NIVEL = { escrito: "escrito", praticado: "praticado", projeto: "em projeto" };
var RARIDADE = { comum: "Comum", raro: "Raro", epico: "\xC9pico", lendario: "Lend\xE1rio" };
function md(ctx, el, texto, origem) {
  void import_obsidian3.MarkdownRenderer.render(ctx.app, texto, el, origem, ctx.comp);
}
function ficha(root, ctx) {
  const { prog } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });
  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `N\xEDvel ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nv" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });
  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const p = prog.partes;
  const origemXP = `De onde vem o XP \u2014 notas ${p.notas} \xB7 t\xF3picos ${p.topicos} \xB7 di\xE1rio ${p.diario} \xB7 revis\xF5es ${p.revisao} \xB7 miss\xF5es ${p.missoes}`;
  const xp = id.createDiv({ cls: "erpg-xp", attr: { title: origemXP } });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experi\xEAncia at\xE9 o pr\xF3ximo n\xEDvel");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });
  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic, valor, rot, cls = "") => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim(), attr: { title: `${valor} ${rot}` } });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "");
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");
  medalhas(sec, ctx);
  const acao = sec.createDiv({ cls: "erpg-ficha-acao" });
  botao(acao, prog.estudouHoje ? "Di\xE1rio de hoje" : `Come\xE7ar sess\xE3o \xB7 +${ctx.settings.xp.diario} XP`, () => ctx.acoes.iniciarDia(), { icone: prog.estudouHoje ? "book-open" : "play" });
}
function medalhas(parent, ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const box = parent.createDiv({ cls: "erpg-medalhas" });
  box.createDiv({ cls: "erpg-rotulo", text: `Conquistas ${ok}/${ctx.conquistas.length}` });
  const fila = box.createDiv({ cls: "erpg-medalhas-fila" });
  for (const c of ctx.conquistas) {
    const desc = `${c.nome} \xB7 ${RARIDADE[c.raridade]}
${c.desc}${c.ok ? "\n\u2713 Conquistado" : ""}`;
    const m = fila.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}`, attr: { title: desc, "aria-label": desc } });
    icone(m, c.ok ? c.icone : "lock");
  }
}
function missao(root, ctx) {
  const ativa = ctx.snap.missoes.map((m) => ({ m, f: m.fases.find((f) => f.tarefas.some((t) => !t.feita)) })).find((x) => x.f);
  const corpo = painel(root, "swords", "Miss\xE3o", ativa ? `${ativa.m.nome} \xB7 Fase ${ativa.f.num}` : void 0, "is-missao");
  if (!ctx.snap.missoes.length) {
    vazio(corpo, "Nenhuma miss\xE3o.", "Crie uma nota com a propriedade tipo: missao, se\xE7\xF5es \u201C## Fase 1: \u2026\u201D e tarefas \u201C- [ ] \u2026\u201D.");
  } else if (!ativa || !ativa.f) {
    vazio(corpo, "Todas as miss\xF5es conclu\xEDdas.");
  } else {
    const { m, f } = ativa;
    corpo.createDiv({ cls: "erpg-missao-titulo", text: f.titulo || `Fase ${f.num}` });
    if (f.entrega) md(ctx, corpo.createDiv({ cls: "erpg-missao-entrega" }), `**Entrega:** ${f.entrega}`, m.caminho);
    const feitas = f.tarefas.filter((t) => t.feita).length;
    const prog = corpo.createDiv({ cls: "erpg-linha" });
    barra(prog, feitas / f.tarefas.length, "erpg-barra", "Progresso da fase");
    prog.createSpan({ cls: "erpg-num", text: `${feitas}/${f.tarefas.length}` });
    const ul = corpo.createEl("ul", { cls: "erpg-tarefas erpg-rola" });
    for (const t of f.tarefas) {
      const li = ul.createEl("li", { cls: t.feita ? "is-feita" : "" });
      const chk = li.createEl("button", { cls: "erpg-check", attr: { "aria-label": t.feita ? "Desfazer tarefa" : "Concluir tarefa", "aria-pressed": String(t.feita) } });
      icone(chk, "check");
      chk.addEventListener("click", () => ctx.acoes.alternarTarefa(m, t));
      md(ctx, li.createDiv({ cls: "erpg-tarefa-txt" }), semWikilinks(t.texto), m.caminho);
      li.createSpan({ cls: "erpg-num is-ouro", text: `+${ctx.settings.xp.tarefa}` });
    }
    const rodape = corpo.createDiv({ cls: "erpg-acoes" });
    botao(rodape, "Abrir miss\xE3o", (ev) => ctx.acoes.abrirNota(m.caminho, ev.ctrlKey || ev.metaKey), { variante: "secundario", icone: "external-link", pequeno: true });
    const outras = ctx.snap.missoes.filter((x) => x !== m && x.fases.some((ff) => ff.tarefas.some((t) => !t.feita)));
    if (outras.length) rodape.createSpan({ cls: "erpg-dica", text: `Outras: ${outras.map((x) => x.nome).join(", ")}` });
  }
  const prox = proximoTopico(ctx.snap.trilhas);
  if (prox) {
    ornamento(corpo);
    corpo.createDiv({ cls: "erpg-subtitulo", text: "Pr\xF3ximo t\xF3pico" });
    topico(corpo, ctx, prox.trilha, prox.topico, prox.regiao);
  }
}
function proximoTopico(trilhas) {
  for (const t of trilhas) for (const r of t.regioes) {
    if (r.nivelTitulo !== 1) continue;
    const tp = r.topicos.find((x) => !x.feito);
    if (tp) return { trilha: t.caminho, regiao: r.nome, topico: tp };
  }
  return null;
}
function oraculo(root, ctx) {
  const { snap, estado } = ctx;
  const corpo = painel(root, "sparkles", "Pergunta do dia", void 0, "is-oraculo");
  if (!snap.perguntas.length) {
    vazio(corpo, "Nenhuma pergunta ainda.", "Adicione callouts \u201C> [!question]- Pergunta\u201D com a resposta embaixo nas suas notas de estudo.");
    return;
  }
  if (estado.perguntaIdx === null || estado.perguntaIdx >= snap.perguntas.length) estado.perguntaIdx = indiceDoDia(snap.hoje, snap.perguntas.length);
  const p = snap.perguntas[estado.perguntaIdx];
  if (!p) return;
  pergunta(corpo, ctx, p.pergunta, p.resposta, p.caminho, p.nota, estado.mostrarResposta);
  const row = corpo.createDiv({ cls: "erpg-acoes" });
  botao(row, estado.mostrarResposta ? "Esconder" : "Ver resposta", () => {
    estado.mostrarResposta = !estado.mostrarResposta;
    ctx.acoes.redesenhar();
  }, { icone: "eye", pequeno: true });
  if (snap.perguntas.length > 1) botao(row, "Outra", () => {
    let n = estado.perguntaIdx ?? 0;
    while (n === estado.perguntaIdx) n = Math.floor(Math.random() * snap.perguntas.length);
    estado.perguntaIdx = n;
    estado.mostrarResposta = false;
    ctx.acoes.redesenhar();
  }, { variante: "secundario", icone: "shuffle", pequeno: true });
}
function pergunta(corpo, ctx, q, a, caminho, nota, mostrar) {
  const origem = corpo.createEl("button", { cls: "erpg-origem", text: nota, attr: { "aria-label": `Abrir a nota ${nota}` } });
  origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(caminho, ev.ctrlKey || ev.metaKey));
  const area = corpo.createDiv({ cls: "erpg-rola" });
  md(ctx, area.createDiv({ cls: "erpg-pergunta" }), q, caminho);
  if (mostrar) md(ctx, area.createDiv({ cls: "erpg-resposta" }), a, caminho);
}
function revisao(root, ctx) {
  const { snap, settings } = ctx;
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  const corpo = painel(root, "repeat", "Revisar", fila.length ? `${fila.length} na fila` : void 0, "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x) => !!x).sort()[0];
    vazio(corpo, "Nada para revisar hoje.", prox ? `Pr\xF3xima revis\xE3o ${relativo(prox, snap.hoje)}.` : void 0);
    return;
  }
  const lista = corpo.createDiv({ cls: "erpg-revisoes erpg-rola" });
  for (const x of fila) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    info.createDiv({ cls: "erpg-meta", text: x.revisado ? `caixa ${x.caixa} \xB7 ${relativo(x.revisado, snap.hoje)}` : "nunca revisada" });
    const acts = row.createDiv({ cls: "erpg-acoes" });
    botao(acts, "Lembrei", () => ctx.acoes.revisar(x.n, true), { pequeno: true, titulo: "Volta mais tarde (intervalo maior)" });
    botao(acts, "Esqueci", () => ctx.acoes.revisar(x.n, false), { pequeno: true, variante: "secundario", titulo: "Volta amanh\xE3" });
  }
}
function cronica(root, ctx) {
  const { snap, settings } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Atividade", `${snap.diario.size} ${snap.diario.size === 1 ? "dia" : "dias"} de estudo`, "is-cronica");
  const dow = ((/* @__PURE__ */ new Date()).getDay() + 6) % 7;
  const inicio = addDias(snap.hoje, -dow - (semanas - 1) * 7);
  const grade = corpo.createDiv({ cls: "erpg-grade", attr: { style: `--semanas:${semanas}` } });
  for (let k = 0; k < semanas * 7; k++) {
    const dia = addDias(inicio, k);
    const futuro = diffDias(snap.hoje, dia) > 0;
    const d = snap.diario.get(dia);
    const lv = !d ? 0 : d.minutos < 25 ? 1 : d.minutos < 50 ? 2 : 3;
    grade.createSpan({
      cls: `erpg-dia is-n${futuro ? "x" : lv}${dia === snap.hoje ? " is-hoje" : ""}`,
      attr: { title: `${dia}${d ? ` \xB7 ${d.minutos} min` : ""}` }
    });
  }
}
function mapa(root, ctx) {
  const { snap, prog } = ctx;
  const corpo = painel(root, "map", "Trilhas", `${prog.topicosFeitos} de ${prog.topicosTotal} t\xF3picos`, "is-mapa");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, se\xE7\xF5es com \u201C#\u201D e t\xF3picos \u201C- [ ] [[Nota]] \u2014 descri\xE7\xE3o\u201D.");
    return;
  }
  const busca = corpo.createEl("button", { cls: "erpg-busca", attr: { "aria-label": "Buscar t\xF3pico" } });
  icone(busca, "search");
  busca.createSpan({ text: "Buscar t\xF3pico" });
  busca.addEventListener("click", () => ctx.acoes.abrirTopicos(null));
  const area = corpo.createDiv({ cls: "erpg-rola" });
  for (const t of snap.trilhas) {
    if (snap.trilhas.length > 1) area.createDiv({ cls: "erpg-rotulo", text: t.nome });
    const grid = area.createDiv({ cls: "erpg-regioes" });
    for (const r of t.regioes) {
      const feitos = r.topicos.filter((x) => x.feito).length;
      const b = grid.createEl("button", {
        cls: `erpg-regiao${feitos === r.topicos.length ? " is-conquistada" : ""}${r.destaque ? " is-destaque" : ""}`,
        attr: { title: `${r.nome}: ${feitos} de ${r.topicos.length}${r.desc ? `
${r.desc}` : ""}` }
      });
      b.createSpan({ cls: "erpg-regiao-nome", text: r.nome });
      b.createSpan({ cls: "erpg-num", text: `${feitos}/${r.topicos.length}` });
      barra(b, feitos / r.topicos.length, "erpg-barra");
      b.addEventListener("click", () => ctx.acoes.abrirTopicos({ trilha: t.caminho, regiao: r.nome }));
    }
  }
}
function topico(parent, ctx, trilha, tp, contexto) {
  const card = parent.createDiv({ cls: `erpg-topico${tp.feito ? " is-feito" : ""}` });
  const chk = card.createEl("button", { cls: "erpg-check", attr: { "aria-label": tp.feito ? `Desmarcar ${tp.label}` : `Marcar ${tp.label} como praticado`, "aria-pressed": String(tp.feito) } });
  icone(chk, "check");
  chk.addEventListener("click", () => ctx.acoes.alternarTopico(trilha, tp));
  const corpo = card.createEl("button", { cls: "erpg-topico-corpo", attr: { "aria-label": tp.caminho ? `Abrir ${tp.label}` : `Criar a nota ${tp.label}` } });
  if (contexto) corpo.createDiv({ cls: "erpg-meta is-ouro", text: contexto });
  const nome = corpo.createDiv({ cls: "erpg-topico-nome", text: tp.label });
  if (!tp.caminho) nome.createSpan({ cls: "erpg-selo-novo", text: "sem nota" });
  if (tp.desc) corpo.createDiv({ cls: "erpg-topico-desc", text: tp.desc });
  const nota = tp.caminho ? ctx.snap.notas.find((n) => n.caminho === tp.caminho) : void 0;
  if (nota) corpo.createSpan({ cls: `erpg-nivel is-${nota.nivel}`, text: NOME_NIVEL[nota.nivel] });
  corpo.addEventListener("click", (ev) => ctx.acoes.abrirNota(tp.caminho ?? tp.alvo, ev.ctrlKey || ev.metaKey));
}
function listaTopicos(parent, ctx, alvo, busca) {
  const q = normalizar(busca.trim());
  const achados = [];
  for (const t of ctx.snap.trilhas) for (const r of t.regioes) {
    const naRegiao = alvo && t.caminho === alvo.trilha && r.nome === alvo.regiao;
    for (const tp of r.topicos) {
      if (q ? normalizar(`${tp.label} ${tp.desc}`).includes(q) : naRegiao) achados.push({ t, r: r.nome, tp });
    }
  }
  if (!achados.length) {
    vazio(parent, q ? "Nada encontrado." : "Essa regi\xE3o n\xE3o existe mais.");
    return;
  }
  const g = parent.createDiv({ cls: "erpg-topicos" });
  achados.slice(0, 120).forEach((a) => topico(g, ctx, a.t.caminho, a.tp, q ? `${a.t.nome} \xB7 ${a.r}` : void 0));
}
function normalizar(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// src/ui/topicosModal.ts
var import_obsidian4 = require("obsidian");
var TopicosModal = class extends import_obsidian4.Modal {
  constructor(plugin, criarCtx, alvo) {
    super(plugin.app);
    this.plugin = plugin;
    this.criarCtx = criarCtx;
    this.alvo = alvo;
  }
  plugin;
  criarCtx;
  alvo;
  comp = new import_obsidian4.Component();
  lista;
  input;
  desinscrever = null;
  onOpen() {
    this.modalEl.addClass("erpg-modal");
    this.contentEl.addClass("erpg-host");
    this.comp.load();
    this.setTitle(this.alvo ? this.alvo.regiao : "Buscar t\xF3pico");
    const busca = this.contentEl.createDiv({ cls: "erpg-busca is-campo" });
    icone(busca, "search");
    this.input = busca.createEl("input", { type: "search", attr: { placeholder: "Buscar em todas as trilhas", "aria-label": "Buscar t\xF3pico", spellcheck: "false" } });
    this.input.addEventListener("input", () => this.desenharLista());
    this.lista = this.contentEl.createDiv({ cls: "erpg-modal-lista" });
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenharLista());
    this.desenharLista();
    if (!this.alvo) this.input.focus();
  }
  onClose() {
    this.desinscrever?.();
    this.comp.unload();
    this.contentEl.empty();
  }
  desenharLista() {
    this.comp.unload();
    this.comp = new import_obsidian4.Component();
    this.comp.load();
    this.lista.empty();
    const ctx = this.criarCtx(this.comp);
    if (!ctx) return;
    const busca = this.input.value;
    this.setTitle(busca.trim() ? "Buscar t\xF3pico" : this.alvo ? this.alvo.regiao : "Buscar t\xF3pico");
    if (!busca.trim() && !this.alvo) return;
    listaTopicos(this.lista, ctx, this.alvo, busca);
  }
};

// src/ui/view.ts
var VIEW_FICHA = "estudos-rpg-ficha";
var FichaView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  plugin;
  estado = { perguntaIdx: null, mostrarResposta: false };
  desinscrever = null;
  getViewType() {
    return VIEW_FICHA;
  }
  getDisplayText() {
    return "Ficha do her\xF3i";
  }
  getIcon() {
    return "shield";
  }
  async onOpen() {
    this.contentEl.addClass("erpg-host");
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenhar());
    this.desenhar();
  }
  async onClose() {
    this.desinscrever?.();
  }
  /** Monta o contexto que as seções usam (null enquanto o vault não foi lido). */
  criarCtx = (comp) => {
    const dados = this.plugin.dados;
    if (!dados) return null;
    return {
      app: this.app,
      comp,
      settings: this.plugin.config,
      estado: this.estado,
      acoes: this.acoes,
      snap: dados.snap,
      prog: dados.prog,
      conquistas: dados.conquistas
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
    const comp = this.novoFilho();
    el.empty();
    const ctx = this.criarCtx(comp);
    if (!ctx) {
      el.createDiv({ cls: "erpg-carregando", text: "Carregando\u2026" });
      return;
    }
    const pagina = el.createDiv({ cls: "erpg" });
    ficha(pagina, ctx);
    const grade = pagina.createDiv({ cls: "erpg-grade-principal" });
    const colA = grade.createDiv({ cls: "erpg-col is-a" });
    missao(colA, ctx);
    cronica(colA, ctx);
    const colB = grade.createDiv({ cls: "erpg-col is-b" });
    oraculo(colB, ctx);
    revisao(colB, ctx);
    mapa(grade.createDiv({ cls: "erpg-col is-c" }), ctx);
    el.scrollTop = rolagem;
  }
  /** Dono dos renderizadores de Markdown do desenho atual; trocado a cada desenho. */
  filho = null;
  novoFilho() {
    if (this.filho) this.removeChild(this.filho);
    this.filho = this.addChild(new import_obsidian5.Component());
    return this.filho;
  }
  // ------------------------------------------------------------ ações
  acoes = {
    // Notas abrem numa aba nova do centro: a ficha continua aberta na dela.
    // Ctrl/Cmd+clique abre ao lado (divisão), para ler a nota com a ficha visível.
    abrirNota: (caminho, aoLado = false) => {
      void this.app.workspace.openLinkText(caminho, "", aoLado ? "split" : "tab");
    },
    alternarTopico: async (trilha, t) => {
      await this.plugin.writer.alternarLinha(trilha, t.linha, t.raw);
      await this.plugin.atualizarAgora();
    },
    alternarTarefa: async (m, t) => {
      await this.plugin.writer.alternarLinha(m.caminho, t.linha, t.raw);
      await this.plugin.atualizarAgora();
    },
    revisar: async (n, lembrou) => {
      const { intervalos } = this.plugin.config;
      const caixa = lembrou ? aposLembrar({ caixa: n.caixa, revisado: n.revisado }, intervalos) : aposEsquecer();
      const hoje = this.plugin.hoje();
      await this.plugin.writer.propriedades(n.caminho, { caixa, revisado: hoje });
      new import_obsidian5.Notice(lembrou ? `${n.label}: caixa ${caixa}, volta em ${intervalos[caixa] ?? "?"} dia(s).` : `${n.label} volta amanh\xE3.`);
      await this.plugin.atualizarAgora();
    },
    iniciarDia: async () => {
      await this.plugin.abrirNoCentro(await this.plugin.writer.diario(this.plugin.hoje()));
    },
    abrirTopicos: (alvo) => new TopicosModal(this.plugin, this.criarCtx, alvo).open(),
    redesenhar: () => this.desenhar()
  };
};

// src/vault/indexer.ts
var import_obsidian6 = require("obsidian");
var Indexer = class {
  constructor(app, getSettings) {
    this.app = app;
    this.getSettings = getSettings;
  }
  app;
  getSettings;
  /** Cache das perguntas por arquivo: só relê o arquivo se ele mudou. */
  cachePerguntas = /* @__PURE__ */ new Map();
  async construir(hoje) {
    const s = this.getSettings();
    const ignoradas = s.pastasIgnoradas.map((p) => (0, import_obsidian6.normalizePath)(p).toLowerCase()).filter(Boolean);
    const ignorar = (f) => ignoradas.some((p) => f.path.toLowerCase() === p || f.path.toLowerCase().startsWith(p + "/"));
    const arquivos = this.app.vault.getMarkdownFiles().filter((f) => !ignorar(f));
    const trilhas = [];
    const missoes = [];
    const candidatasEstudo = [];
    const diario = /* @__PURE__ */ new Map();
    const pastaDiario = (0, import_obsidian6.normalizePath)(s.pastaDiario);
    for (const f of arquivos) {
      const fm = this.fm(f);
      const tipo = String(fm.tipo ?? "").toLowerCase().trim();
      if (f.parent?.path === pastaDiario) {
        const data = parseISO(f.basename);
        if (data) diario.set(data, {
          data,
          caminho: f.path,
          minutos: num(fm.minutos, 25)
        });
        continue;
      }
      if (tipo === "trilha") {
        const texto = await this.app.vault.cachedRead(f);
        trilhas.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), regioes: parseTrilha(texto, (alvo) => this.resolver(alvo, f.path)) });
      } else if (tipo === "missao" || tipo === "miss\xE3o") {
        if (fm.ativa === false) continue;
        const texto = await this.app.vault.cachedRead(f);
        missoes.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), prioridade: num(fm.prioridade, 100), fases: parseMissao(texto) });
      }
      const nivel = String(fm.nivel ?? "").toLowerCase().trim();
      if (NIVEIS.includes(nivel)) candidatasEstudo.push({ f, fm, nivel });
    }
    const areaPorCaminho = /* @__PURE__ */ new Map();
    for (const t of trilhas) for (const r of t.regioes) for (const tp of r.topicos) if (tp.caminho) areaPorCaminho.set(tp.caminho, r.nome);
    const notas = candidatasEstudo.map(({ f, fm, nivel }) => ({
      caminho: f.path,
      label: rotulo(f),
      nivel,
      caixa: normalizarCaixa(fm.caixa, s.intervalos),
      revisado: parseISO(fm.revisado),
      area: areaPorCaminho.get(f.path) ?? null
    }));
    const perguntas = [];
    for (const { f } of candidatasEstudo) perguntas.push(...await this.perguntasDe(f));
    trilhas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    missoes.sort((a, b) => a.prioridade - b.prioridade || a.nome.localeCompare(b.nome, "pt-BR"));
    notas.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    return { hoje, trilhas, missoes, notas, perguntas, diario };
  }
  /** Esquece arquivos apagados/renomeados do cache. */
  esquecer(caminho) {
    this.cachePerguntas.delete(caminho);
  }
  async perguntasDe(f) {
    const c = this.cachePerguntas.get(f.path);
    if (c && c.mtime === f.stat.mtime) return c.itens;
    const texto = await this.app.vault.cachedRead(f);
    const itens = parsePerguntas(texto).map((p) => ({ ...p, caminho: f.path, nota: rotulo(f) }));
    this.cachePerguntas.set(f.path, { mtime: f.stat.mtime, itens });
    return itens;
  }
  fm(f) {
    return this.app.metadataCache.getFileCache(f)?.frontmatter ?? {};
  }
  /** Resolve `[[Alvo]]` como o Obsidian resolve; se não achar, tenta uma pasta `Alvo/README.md`. */
  resolver(alvo, origem) {
    const direto = this.app.metadataCache.getFirstLinkpathDest(alvo, origem);
    if (direto) return direto.path;
    const chave = normalizar2(alvo);
    const readme = this.app.vault.getMarkdownFiles().find((f) => f.basename.toLowerCase() === "readme" && f.parent && normalizar2(f.parent.name) === chave);
    return readme?.path ?? null;
  }
};
function rotulo(f) {
  return f.basename.toLowerCase() === "readme" && f.parent ? f.parent.name : f.basename;
}
function num(v, padrao = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}
function normalizar2(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^\s*\d+\s*-\s*/, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

// src/vault/writer.ts
var import_obsidian7 = require("obsidian");
var Writer = class {
  constructor(app, getSettings) {
    this.app = app;
    this.getSettings = getSettings;
  }
  app;
  getSettings;
  /**
   * Marca/desmarca o checkbox da linha `linha`.
   * E se a nota mudou desde a leitura (linha movida/editada)? Procura a linha pelo texto;
   * se não achar, não mexe e avisa.
   */
  async alternarLinha(caminho, linha, raw) {
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
    if (!ok) new import_obsidian7.Notice("A nota mudou desde a \xFAltima leitura. Tente de novo.");
    return ok;
  }
  async propriedades(caminho, patch) {
    const f = this.arquivo(caminho);
    if (!f) return;
    await this.app.fileManager.processFrontMatter(f, (fm) => Object.assign(fm, patch));
  }
  /** Cria (se preciso) e devolve a nota do diário de `data`. */
  async diario(data) {
    const s = this.getSettings();
    const pasta = (0, import_obsidian7.normalizePath)(s.pastaDiario);
    const caminho = (0, import_obsidian7.normalizePath)(`${pasta}/${data}.md`);
    const existente = this.app.vault.getAbstractFileByPath(caminho);
    if (existente instanceof import_obsidian7.TFile) return existente;
    if (!this.app.vault.getAbstractFileByPath(pasta)) await this.app.vault.createFolder(pasta);
    const tpl = this.app.vault.getAbstractFileByPath((0, import_obsidian7.normalizePath)(s.templateDiario));
    const corpo = tpl instanceof import_obsidian7.TFile ? (await this.app.vault.read(tpl)).replace(/\{\{date(?::[^}]*)?\}\}/g, data) : `---
minutos: 25
---

# \u{1F4DC} ${data}

**O que estudei:**
- 
`;
    return this.app.vault.create(caminho, corpo);
  }
  arquivo(caminho) {
    const f = this.app.vault.getAbstractFileByPath(caminho);
    if (f instanceof import_obsidian7.TFile) return f;
    new import_obsidian7.Notice(`N\xE3o achei a nota ${caminho}.`);
    return null;
  }
};

// src/main.ts
var EstudosRPG = class extends import_obsidian8.Plugin {
  config;
  writer;
  dados = null;
  indexer;
  ouvintes = /* @__PURE__ */ new Set();
  statusEl = null;
  atualizando = null;
  pendente = false;
  async onload() {
    this.config = mergeSettings(await this.loadData());
    this.indexer = new Indexer(this.app, () => this.config);
    this.writer = new Writer(this.app, () => this.config);
    this.registerView(VIEW_FICHA, (leaf) => new FichaView(leaf, this));
    this.addRibbonIcon("shield", "Abrir a ficha do her\xF3i", () => this.abrirFicha());
    this.addSettingTab(new AbaConfig(this.app, this));
    this.registrarComandos();
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("erpg-status");
    this.statusEl.addEventListener("click", () => this.abrirFicha());
    const agendar = (0, import_obsidian8.debounce)(() => void this.atualizarAgora(), 400, true);
    this.registerEvent(this.app.metadataCache.on("changed", agendar));
    this.registerEvent(this.app.vault.on("create", agendar));
    this.registerEvent(this.app.vault.on("delete", (f) => {
      this.indexer.esquecer(f.path);
      agendar();
    }));
    this.registerEvent(this.app.vault.on("rename", (_f, antigo) => {
      this.indexer.esquecer(antigo);
      agendar();
    }));
    this.registerInterval(window.setInterval(() => {
      if (this.dados && this.dados.snap.hoje !== this.hoje()) void this.atualizarAgora();
    }, 6e4));
    this.app.workspace.onLayoutReady(async () => {
      await this.atualizarAgora();
      if (this.config.abrirAoIniciar) await this.abrirFicha();
    });
  }
  onunload() {
    this.ouvintes.clear();
  }
  hoje() {
    return hojeISO();
  }
  /** Inscreve um ouvinte de atualização; devolve a função que cancela a inscrição. */
  aoAtualizar(fn) {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }
  /**
   * Relê o vault agora. E se já estiver relendo? Marca como pendente e roda
   * mais uma vez no fim, em vez de duas leituras ao mesmo tempo.
   */
  async atualizarAgora() {
    if (this.atualizando) {
      this.pendente = true;
      return this.atualizando;
    }
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
          new import_obsidian8.Notice("Estudos RPG: erro ao ler o vault. Veja o console (Ctrl+Shift+I).");
        }
      } while (this.pendente);
    })().finally(() => {
      this.atualizando = null;
    });
    return this.atualizando;
  }
  /** Avisos de XP, nível e conquistas (comparando com a leitura anterior). */
  anunciar(antes, depois) {
    if (!antes) return;
    const delta = depois.prog.xp - antes.prog.xp;
    if (delta > 0) new import_obsidian8.Notice(`\u2726 +${delta} XP`, 2500);
    if (depois.prog.nivel > antes.prog.nivel) new import_obsidian8.Notice(`\u269C Subiu de n\xEDvel! N\xEDvel ${depois.prog.nivel} \xB7 ${depois.prog.titulo}`, 6e3);
    const tinha = new Set(antes.conquistas.filter((c) => c.ok).map((c) => c.id));
    for (const c of depois.conquistas) if (c.ok && !tinha.has(c.id)) new import_obsidian8.Notice(`\u{1F3C6} Trof\xE9u conquistado: ${c.nome}`, 6e3);
  }
  atualizarStatus() {
    if (!this.statusEl || !this.dados) return;
    const p = this.dados.prog;
    this.statusEl.setText(`\u269C Nv ${p.nivel} \xB7 ${p.xp}/${p.xpProximo} XP${p.sequencia ? ` \xB7 \u{1F525}${p.sequencia}` : ""}`);
    this.statusEl.setAttr("aria-label", "Abrir a ficha do her\xF3i");
  }
  /**
   * Abre a ficha SEMPRE na área principal (nunca nas barras laterais).
   * E se uma ficha ficou presa numa barra lateral (ex.: abriu quando o painel do Git
   * era a aba ativa, e o Obsidian lembrou o lugar)? Ela é fechada e reaberta no centro.
   */
  async abrirFicha() {
    const ws = this.app.workspace;
    const fichas = ws.getLeavesOfType(VIEW_FICHA);
    let leaf = fichas.find((l) => l.getRoot() === ws.rootSplit) ?? null;
    for (const l of fichas) if (l !== leaf) l.detach();
    if (!leaf) {
      const recente = ws.getMostRecentLeaf(ws.rootSplit);
      leaf = recente && recente.view.getViewType() === "empty" ? recente : ws.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_FICHA, active: true });
    }
    await ws.revealLeaf(leaf);
  }
  /** Abre um arquivo numa aba da área principal (a ficha continua aberta na dela). */
  async abrirNoCentro(f) {
    await this.app.workspace.getLeaf("tab").openFile(f);
  }
  async salvarConfig() {
    await this.saveData(this.config);
    await this.atualizarAgora();
  }
  // ------------------------------------------------------------ comandos (Ctrl+P)
  registrarComandos() {
    this.addCommand({ id: "abrir-ficha", name: "Abrir a ficha do her\xF3i", callback: () => this.abrirFicha() });
    this.addCommand({
      id: "diario-hoje",
      name: "Abrir/criar o di\xE1rio de hoje",
      callback: async () => this.abrirNoCentro(await this.writer.diario(this.hoje()))
    });
    this.addCommand({
      id: "proxima-revisao",
      name: "Abrir a pr\xF3xima nota para revisar",
      callback: () => {
        const d = this.dados;
        if (!d) return;
        const fila = ordenarFila(d.snap.notas.map((n) => ({ n, ...infoRevisao(n, d.snap.hoje, this.config.intervalos) })).filter((x) => x.vencida));
        const prox = fila[0];
        if (!prox) {
          new import_obsidian8.Notice("Nenhuma revis\xE3o vencida hoje.");
          return;
        }
        void this.app.workspace.openLinkText(prox.n.caminho, "", "tab");
      }
    });
    const naNota = (id, name, acao) => this.addCommand({
      id,
      name,
      checkCallback: (checando) => {
        const f = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView)?.file;
        const fm = f ? this.app.metadataCache.getFileCache(f)?.frontmatter ?? {} : null;
        if (!f || !fm || !NIVEIS.includes(String(fm.nivel ?? ""))) return false;
        if (!checando) void acao(f, fm);
        return true;
      }
    });
    naNota("subir-nivel", "Subir o n\xEDvel da nota atual (escrito \u2192 praticado \u2192 projeto)", async (f, fm) => {
      const atual = NIVEIS.indexOf(String(fm.nivel));
      const novo = NIVEIS[Math.min(NIVEIS.length - 1, atual + 1)] ?? "projeto";
      if (novo === fm.nivel) {
        new import_obsidian8.Notice("Essa nota j\xE1 est\xE1 no n\xEDvel m\xE1ximo.");
        return;
      }
      await this.writer.propriedades(f.path, { nivel: novo });
      new import_obsidian8.Notice(`N\xEDvel da nota: ${novo}`);
    });
    const revisarAtual = (lembrou) => async (f, fm) => {
      const estado = { caixa: normalizarCaixa(fm.caixa, this.config.intervalos), revisado: typeof fm.revisado === "string" ? fm.revisado : null };
      const caixa = lembrou ? aposLembrar(estado, this.config.intervalos) : aposEsquecer();
      await this.writer.propriedades(f.path, { caixa, revisado: this.hoje() });
      new import_obsidian8.Notice(lembrou ? `Caixa ${caixa}: volta em ${this.config.intervalos[caixa] ?? "?"} dia(s).` : "Volta amanh\xE3.");
    };
    naNota("lembrei", "Revis\xE3o: lembrei desta nota", revisarAtual(true));
    naNota("esqueci", "Revis\xE3o: esqueci desta nota", revisarAtual(false));
  }
};

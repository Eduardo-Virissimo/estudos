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
var import_obsidian7 = require("obsidian");

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
  let treinos = 0, acertos = 0;
  for (const d of s.diario.values()) {
    treinos += d.treinos;
    acertos += d.acertos;
  }
  let tarefas = 0;
  for (const m of s.missoes) for (const f of m.fases) for (const t of f.tarefas) if (t.feita) tarefas++;
  const partes = {
    notas: contagemNivel.escrito * xp.escrito + contagemNivel.praticado * xp.praticado + contagemNivel.projeto * xp.projeto,
    topicos: topicosFeitos * xp.topico,
    diario: s.diario.size * xp.diario,
    revisao: caixas * xp.caixa,
    treinos: treinos * xp.treino + acertos * xp.acerto,
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
function habilidades(s) {
  const out = [];
  for (const t of s.trilhas) for (const r of t.regioes) {
    const feitos = r.topicos.filter((x) => x.feito).length;
    const total = r.topicos.length;
    out.push({ nome: r.nome, trilha: t.nome, feitos, total, estrelas: total ? Math.round(feitos / total * 5) : 0 });
  }
  return out;
}
var totalPerfeitos = (s) => [...s.diario.values()].reduce((a, d) => a + d.perfeitos, 0);
var faseConcluida = (s, n) => s.missoes.some((m) => m.fases.some((f) => f.num === n && f.tarefas.length > 0 && f.tarefas.every((t) => t.feita)));
var CONQUISTAS = [
  { id: "primeira-sessao", icone: "sprout", nome: "Primeira jornada", desc: "Registre um dia no di\xE1rio", teste: (s) => s.diario.size >= 1 },
  { id: "chama-3", icone: "flame", nome: "Chama acesa", desc: "3 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 3 },
  { id: "chama-7", icone: "flame-kindling", nome: "Fogo eterno", desc: "7 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 7 },
  { id: "chama-30", icone: "sun", nome: "Sol invicto", desc: "30 dias seguidos de estudo", teste: (_, p) => p.sequencia >= 30 },
  { id: "na-mosca", icone: "crosshair", nome: "Olho de \xE1guia", desc: "Gabarite um treino misto", teste: (s) => totalPerfeitos(s) >= 1 },
  { id: "pratica", icone: "hammer", nome: "M\xE3o na forja", desc: "Uma nota no n\xEDvel praticado", teste: (_, p) => p.contagemNivel.praticado + p.contagemNivel.projeto >= 1 },
  { id: "projeto", icone: "castle", nome: "Construtor", desc: "Uma nota usada em projeto", teste: (_, p) => p.contagemNivel.projeto >= 1 },
  { id: "memoria", icone: "brain", nome: "Mem\xF3ria de drag\xE3o", desc: "Uma nota na \xFAltima caixa de revis\xE3o", teste: (s) => s.notas.some((n) => n.caixa >= 5) },
  { id: "regiao", icone: "flag", nome: "Conquistador", desc: "Conclua uma regi\xE3o inteira do mapa", teste: (s) => s.trilhas.some((t) => t.regioes.some((r) => r.topicos.every((x) => x.feito))) },
  { id: "explorador", icone: "compass", nome: "Explorador", desc: "Avance em 5 regi\xF5es do mapa", teste: (s) => s.trilhas.flatMap((t) => t.regioes).filter((r) => r.topicos.some((x) => x.feito)).length >= 5 },
  { id: "missao-1", icone: "swords", nome: "Primeira miss\xE3o", desc: "Conclua a Fase 1 de uma miss\xE3o", teste: (s) => faseConcluida(s, 1) },
  { id: "nivel-8", icone: "crown", nome: "Lenda", desc: "Chegue ao n\xEDvel 8", teste: (_, p) => p.nivel >= 8 }
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
  perguntasPorTreino: 5,
  semanasNoCalendario: 20,
  xp: { escrito: 20, praticado: 60, projeto: 120, topico: 10, diario: 15, caixa: 10, treino: 20, acerto: 5, tarefa: 25 },
  titulos: ["Aprendiz", "Escudeiro", "Cavaleiro", "Cavaleiro do C\xF3digo", "Mago dos Bits", "Arquimago", "Lorde do Terminal", "Lenda do Reino"]
};
function mergeSettings(saved) {
  const s = saved ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    xp: { ...DEFAULT_SETTINGS.xp, ...s.xp ?? {} },
    intervalos: validList(s.intervalos, DEFAULT_SETTINGS.intervalos),
    titulos: validList(s.titulos, DEFAULT_SETTINGS.titulos),
    pastasIgnoradas: Array.isArray(s.pastasIgnoradas) ? s.pastasIgnoradas : DEFAULT_SETTINGS.pastasIgnoradas
  };
}
function validList(v, fallback) {
  return Array.isArray(v) && v.length > 0 ? v : fallback;
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
    new import_obsidian.Setting(el).setName("Revis\xE3o e treino").setHeading();
    new import_obsidian.Setting(el).setName("Intervalos de revis\xE3o (dias)").setDesc("Um n\xFAmero por caixa, separados por v\xEDrgula. O primeiro \xE9 a caixa 0 (ignorado).").addText((t) => t.setValue(s.intervalos.join(", ")).onChange(async (v) => {
      const nums = v.split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n >= 0);
      if (nums.length >= 2) {
        s.intervalos = nums;
        await salvar();
      }
    }));
    this.numero(el, "Perguntas por treino misto", s.perguntasPorTreino, 1, 30, async (n) => {
      s.perguntasPorTreino = n;
      await salvar();
    });
    this.numero(el, "Semanas na cr\xF4nica (calend\xE1rio)", s.semanasNoCalendario, 4, 52, async (n) => {
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
      treino: "Treino misto conclu\xEDdo",
      acerto: "Acerto no treino",
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
var import_obsidian4 = require("obsidian");

// src/domain/quiz.ts
function embaralhar(lista, rng = Math.random) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function montarTreino(perguntas, n, rng = Math.random) {
  const porNota = /* @__PURE__ */ new Map();
  for (const p of embaralhar(perguntas, rng)) {
    const lista = porNota.get(p.caminho) ?? [];
    lista.push(p);
    porNota.set(p.caminho, lista);
  }
  const filas = embaralhar([...porNota.values()], rng);
  const out = [];
  for (let rodada = 0; out.length < n && filas.some((f) => f.length > rodada); rodada++) {
    for (const fila of filas) {
      const p = fila[rodada];
      if (p && out.length < n) out.push(p);
    }
  }
  return out;
}
function indiceDoDia(hoje, total) {
  if (total <= 0) return -1;
  let h = 0;
  for (const ch of hoje) h = h * 31 + ch.charCodeAt(0) >>> 0;
  return h % total;
}

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
  parent.createDiv({ cls: "erpg-ornamento", attr: { "aria-hidden": "true" } }).createSpan({ text: "\u269C" });
}

// src/ui/sections.ts
var NOME_NIVEL = { escrito: "escrito", praticado: "praticado", projeto: "em projeto" };
function md(ctx, el, texto, origem) {
  void import_obsidian3.MarkdownRenderer.render(ctx.app, texto, el, origem, ctx.comp);
}
function ficha(root, ctx) {
  const { prog } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });
  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `N\xEDvel ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "N\xEDvel" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });
  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createDiv({ cls: "erpg-sobretitulo", text: "Ficha do her\xF3i" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const xp = id.createDiv({ cls: "erpg-xp" });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experi\xEAncia at\xE9 o pr\xF3ximo n\xEDvel");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });
  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic, valor, rot, cls = "") => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim() });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "");
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");
  atributo("trophy", `${ctx.conquistas.filter((c) => c.ok).length}/${ctx.conquistas.length}`, "trof\xE9us");
  const acao = sec.createDiv({ cls: "erpg-ficha-acao" });
  botao(acao, prog.estudouHoje ? "Abrir o di\xE1rio de hoje" : "Come\xE7ar a jornada de hoje", () => ctx.acoes.iniciarDia(), { icone: prog.estudouHoje ? "book-open" : "play" });
  acao.createDiv({ cls: "erpg-dica", text: prog.estudouHoje ? "Sess\xE3o de hoje registrada." : `Registrar o dia vale +${ctx.settings.xp.diario} XP e mant\xE9m a chama acesa.` });
}
function missao(root, ctx) {
  const ativa = ctx.snap.missoes.map((m2) => ({ m: m2, f: m2.fases.find((f2) => f2.tarefas.some((t) => !t.feita)) })).find((x) => x.f);
  const corpo = painel(root, "swords", "Miss\xE3o principal", ativa ? `${ativa.m.nome} \xB7 Fase ${ativa.f.num}` : void 0, "is-missao");
  if (!ctx.snap.missoes.length) {
    vazio(corpo, "Nenhuma miss\xE3o no seu di\xE1rio de miss\xF5es.", "Crie uma nota com a propriedade tipo: missao, se\xE7\xF5es \u201C## Fase 1: \u2026\u201D e tarefas \u201C- [ ] \u2026\u201D.");
    return;
  }
  if (!ativa || !ativa.f) {
    vazio(corpo, "Todas as miss\xF5es foram cumpridas. Hora de escrever uma nova!");
    return;
  }
  const { m, f } = ativa;
  corpo.createDiv({ cls: "erpg-missao-titulo", text: f.titulo || `Fase ${f.num}` });
  if (f.entrega) md(ctx, corpo.createDiv({ cls: "erpg-missao-entrega" }), `**Entrega:** ${f.entrega}`, m.caminho);
  const feitas = f.tarefas.filter((t) => t.feita).length;
  const prog = corpo.createDiv({ cls: "erpg-linha" });
  barra(prog, feitas / f.tarefas.length, "erpg-barra", "Progresso da fase");
  prog.createSpan({ cls: "erpg-num", text: `${feitas}/${f.tarefas.length}` });
  const ul = corpo.createEl("ul", { cls: "erpg-tarefas" });
  for (const t of f.tarefas) {
    const li = ul.createEl("li", { cls: t.feita ? "is-feita" : "" });
    const chk = li.createEl("button", { cls: "erpg-check", attr: { "aria-label": t.feita ? "Desfazer tarefa" : "Concluir tarefa", "aria-pressed": String(t.feita) } });
    icone(chk, "check");
    chk.addEventListener("click", () => ctx.acoes.alternarTarefa(m, t));
    md(ctx, li.createDiv({ cls: "erpg-tarefa-txt" }), semWikilinks(t.texto), m.caminho);
    li.createSpan({ cls: "erpg-num is-ouro", text: `+${ctx.settings.xp.tarefa}` });
  }
  botao(corpo, "Abrir o pergaminho da miss\xE3o", (ev) => ctx.acoes.abrirNota(m.caminho, ev.ctrlKey || ev.metaKey), { variante: "secundario", icone: "scroll" });
  const outras = ctx.snap.missoes.filter((x) => x !== m && x.fases.some((ff) => ff.tarefas.some((t) => !t.feita)));
  if (outras.length) corpo.createDiv({ cls: "erpg-dica", text: `Miss\xF5es secund\xE1rias: ${outras.map((x) => x.nome).join(", ")}` });
  const prox = proximoTopico(ctx.snap.trilhas);
  if (prox) {
    ornamento(corpo);
    corpo.createDiv({ cls: "erpg-subtitulo", text: "Pr\xF3ximo t\xF3pico do mapa" });
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
  const { snap, estado, settings } = ctx;
  const tr = estado.treino;
  const corpo = painel(root, "sparkles", "Desafio do or\xE1culo", tr ? `Treino misto \xB7 ${tr.itens.length} perguntas de notas diferentes` : "Responda de cabe\xE7a antes de revelar", "is-oraculo");
  if (!snap.perguntas.length) {
    vazio(corpo, "O or\xE1culo ainda n\xE3o tem perguntas.", "Adicione callouts \u201C> [!question]- Pergunta\u201D com a resposta embaixo nas suas notas de estudo.");
    return;
  }
  if (tr) {
    if (tr.fim) {
      const fim = corpo.createDiv({ cls: "erpg-placar" });
      fim.createSpan({ cls: "erpg-placar-num", text: `${tr.acertos}` });
      fim.createSpan({ cls: "erpg-placar-de", text: `/ ${tr.itens.length}` });
      corpo.createEl("p", { cls: "erpg-texto", text: tr.acertos === tr.itens.length ? "Gabaritou! O or\xE1culo se curva diante de voc\xEA." : "As notas que voc\xEA errou voltam amanh\xE3 na revis\xE3o." });
      const row3 = corpo.createDiv({ cls: "erpg-acoes" });
      botao(row3, "Treinar de novo", () => ctx.acoes.iniciarTreino(), { icone: "repeat" });
      botao(row3, "Voltar", () => {
        estado.treino = null;
        ctx.acoes.redesenhar();
      }, { variante: "secundario" });
      return;
    }
    const p2 = tr.itens[tr.i];
    if (!p2) return;
    const topo = corpo.createDiv({ cls: "erpg-linha" });
    topo.createSpan({ cls: "erpg-num", text: `Pergunta ${tr.i + 1} de ${tr.itens.length}` });
    const pontos = topo.createDiv({ cls: "erpg-pontos" });
    tr.itens.forEach((_, k) => pontos.createSpan({ cls: k < tr.i ? "is-passada" : k === tr.i ? "is-atual" : "" }));
    pergunta(corpo, ctx, p2.pergunta, p2.resposta, p2.caminho, p2.nota, tr.mostrar);
    const row2 = corpo.createDiv({ cls: "erpg-acoes" });
    if (!tr.mostrar) {
      botao(row2, "Revelar resposta", () => {
        tr.mostrar = true;
        ctx.acoes.redesenhar();
      }, { icone: "eye" });
      botao(row2, "Abandonar treino", () => {
        estado.treino = null;
        ctx.acoes.redesenhar();
      }, { variante: "discreto" });
    } else {
      botao(row2, "Acertei", () => ctx.acoes.responderTreino(true), { icone: "check" });
      botao(row2, "Errei", () => ctx.acoes.responderTreino(false), { variante: "secundario", icone: "x" });
    }
    return;
  }
  if (estado.perguntaIdx === null || estado.perguntaIdx >= snap.perguntas.length) estado.perguntaIdx = indiceDoDia(snap.hoje, snap.perguntas.length);
  const p = snap.perguntas[estado.perguntaIdx];
  if (!p) return;
  pergunta(corpo, ctx, p.pergunta, p.resposta, p.caminho, p.nota, estado.mostrarResposta);
  const row = corpo.createDiv({ cls: "erpg-acoes" });
  botao(row, estado.mostrarResposta ? "Esconder resposta" : "Revelar resposta", () => {
    estado.mostrarResposta = !estado.mostrarResposta;
    ctx.acoes.redesenhar();
  }, { icone: "eye" });
  if (snap.perguntas.length > 1) botao(row, "Outra pergunta", () => {
    let n = estado.perguntaIdx ?? 0;
    while (n === estado.perguntaIdx) n = Math.floor(Math.random() * snap.perguntas.length);
    estado.perguntaIdx = n;
    estado.mostrarResposta = false;
    ctx.acoes.redesenhar();
  }, { variante: "secundario", icone: "shuffle" });
  botao(row, `Treino misto (${Math.min(settings.perguntasPorTreino, snap.perguntas.length)})`, () => ctx.acoes.iniciarTreino(), { variante: "secundario", icone: "swords" });
}
function pergunta(corpo, ctx, q, a, caminho, nota, mostrar) {
  const origem = corpo.createEl("button", { cls: "erpg-origem", text: nota, attr: { "aria-label": `Abrir a nota ${nota}` } });
  origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(caminho, ev.ctrlKey || ev.metaKey));
  md(ctx, corpo.createDiv({ cls: "erpg-pergunta" }), q, caminho);
  if (mostrar) md(ctx, corpo.createDiv({ cls: "erpg-resposta" }), a, caminho);
}
function revisao(root, ctx) {
  const { snap, settings } = ctx;
  const corpo = painel(root, "scroll-text", "Pergaminhos para revisar", "Lembrou \u2192 volta mais tarde \xB7 Esqueceu \u2192 volta amanh\xE3", "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x) => !!x).sort()[0];
    vazio(corpo, "Nenhum pergaminho vencido hoje. Descanse, her\xF3i.", prox ? `Pr\xF3xima revis\xE3o ${relativo(prox, snap.hoje)}.` : void 0);
    return;
  }
  const lista = corpo.createDiv({ cls: "erpg-revisoes" });
  for (const x of fila.slice(0, 6)) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    const meta = [x.n.area, x.revisado ? `caixa ${x.caixa} \xB7 revisada ${relativo(x.revisado, snap.hoje)}` : "nunca revisada"].filter(Boolean).join(" \xB7 ");
    info.createDiv({ cls: "erpg-meta", text: meta });
    const acts = row.createDiv({ cls: "erpg-acoes" });
    botao(acts, "Lembrei", () => ctx.acoes.revisar(x.n, true), { pequeno: true, icone: "check" });
    botao(acts, "Esqueci", () => ctx.acoes.revisar(x.n, false), { pequeno: true, variante: "secundario" });
  }
  if (fila.length > 6) corpo.createDiv({ cls: "erpg-dica", text: `Mais ${fila.length - 6} na fila.` });
  corpo.createDiv({ cls: "erpg-dica", text: "Abra a nota, responda o \u201CMe teste\u201D sem olhar e s\xF3 ent\xE3o escolha." });
}
function cronica(root, ctx) {
  const { snap, settings, prog } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Cr\xF4nica da jornada", `\xDAltimas ${semanas} semanas`, "is-cronica");
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
      attr: { "aria-label": `${dia}${d ? ` \xB7 ${d.minutos} min` : ""}` }
    });
  }
  const leg = corpo.createDiv({ cls: "erpg-legenda" });
  leg.createSpan({ text: `${snap.diario.size} dias de estudo \xB7 sequ\xEAncia atual: ${prog.sequencia}` });
  const esc = leg.createSpan({ cls: "erpg-escala" });
  esc.createSpan({ text: "menos" });
  for (let i = 0; i < 4; i++) esc.createSpan({ cls: `erpg-dia is-n${i}` });
  esc.createSpan({ text: "mais" });
}
function mapa(root, ctx) {
  const { snap, estado, prog } = ctx;
  const corpo = painel(root, "map", "Mapa dos reinos", `${prog.topicosFeitos} de ${prog.topicosTotal} t\xF3picos conquistados`, "is-mapa");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhum reino descoberto.", "Crie uma nota com a propriedade tipo: trilha, se\xE7\xF5es com \u201C#\u201D e t\xF3picos \u201C- [ ] [[Nota]] \u2014 descri\xE7\xE3o\u201D.");
    return;
  }
  const busca = corpo.createDiv({ cls: "erpg-busca" });
  icone(busca, "search");
  const input = busca.createEl("input", { type: "search", attr: { placeholder: "Buscar t\xF3pico em todos os reinos", "aria-label": "Buscar t\xF3pico", spellcheck: "false" } });
  input.value = estado.busca;
  const resultado = corpo.createDiv();
  const desenharBusca = () => {
    resultado.empty();
    const q = normalizar(estado.busca);
    if (q) {
      const achados = [];
      for (const t of snap.trilhas) for (const r of t.regioes) for (const tp of r.topicos)
        if (normalizar(tp.label).includes(q) || normalizar(tp.desc).includes(q)) achados.push({ t, r: r.nome, tp });
      resultado.createDiv({ cls: "erpg-meta", text: `${achados.length} resultado(s)` });
      const g = resultado.createDiv({ cls: "erpg-topicos" });
      achados.slice(0, 60).forEach((a) => topico(g, ctx, a.t.caminho, a.tp, `${a.t.nome} \xB7 ${a.r}`));
      return;
    }
    for (const t of snap.trilhas) reino(resultado, ctx, t);
  };
  input.addEventListener("input", () => {
    estado.busca = input.value.trim();
    desenharBusca();
  });
  desenharBusca();
}
function reino(parent, ctx, t) {
  const { estado } = ctx;
  const feitos = t.regioes.reduce((a, r) => a + r.topicos.filter((x) => x.feito).length, 0);
  const total = t.regioes.reduce((a, r) => a + r.topicos.length, 0);
  const cab = parent.createDiv({ cls: "erpg-reino-cab" });
  cab.createEl("h3", { text: t.nome });
  cab.createSpan({ cls: "erpg-num", text: `${feitos}/${total}` });
  const skills = new Map(habilidades(ctx.snap).filter((h) => h.trilha === t.nome).map((h) => [h.nome, h]));
  const grid = parent.createDiv({ cls: "erpg-regioes" });
  for (const r of t.regioes) {
    const chave = `${t.caminho}::${r.nome}`;
    const h = skills.get(r.nome);
    const aberta = estado.regiaoAberta === chave;
    const feitosR = r.topicos.filter((x) => x.feito).length;
    const b = grid.createEl("button", {
      cls: `erpg-regiao${aberta ? " is-aberta" : ""}${feitosR === r.topicos.length ? " is-conquistada" : ""}`,
      attr: { "aria-expanded": String(aberta) }
    });
    const nome = b.createDiv({ cls: "erpg-regiao-nome" });
    if (r.destaque) icone(nome, "star");
    nome.createSpan({ text: r.nome });
    const est = b.createDiv({ cls: "erpg-estrelas", attr: { "aria-label": `${h?.estrelas ?? 0} de 5 estrelas` } });
    for (let i = 0; i < 5; i++) est.createSpan({ cls: i < (h?.estrelas ?? 0) ? "is-cheia" : "" });
    b.createSpan({ cls: "erpg-num", text: `${feitosR}/${r.topicos.length}` });
    b.addEventListener("click", () => {
      estado.regiaoAberta = aberta ? null : chave;
      ctx.acoes.redesenhar();
    });
    if (aberta) {
      const det = parent.createDiv({ cls: "erpg-regiao-det" });
      if (r.desc) det.createEl("p", { cls: "erpg-texto", text: r.desc });
      const g = det.createDiv({ cls: "erpg-topicos" });
      r.topicos.forEach((tp) => topico(g, ctx, t.caminho, tp));
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
function trofeus(root, ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const corpo = painel(root, "trophy", "Sal\xE3o de trof\xE9us", `${ok} de ${ctx.conquistas.length} conquistados`, "is-trofeus");
  const grid = corpo.createDiv({ cls: "erpg-trofeus" });
  for (const c of ctx.conquistas) {
    const t = grid.createDiv({ cls: `erpg-trofeu${c.ok ? " is-ok" : ""}` });
    icone(t.createDiv({ cls: "erpg-medalha" }), c.ok ? c.icone : "lock");
    t.createDiv({ cls: "erpg-trofeu-nome", text: c.nome });
    t.createDiv({ cls: "erpg-trofeu-desc", text: c.desc });
  }
  const p = ctx.prog.partes;
  const linhas = [["notas", p.notas], ["t\xF3picos", p.topicos], ["di\xE1rio", p.diario], ["revis\xF5es", p.revisao], ["treinos", p.treinos], ["miss\xF5es", p.missoes]];
  corpo.createDiv({ cls: "erpg-meta", text: "De onde vem seu XP: " + linhas.map(([k, v]) => `${k} ${v}`).join(" \xB7 ") });
}
function normalizar(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// src/ui/view.ts
var VIEW_FICHA = "estudos-rpg-ficha";
var FichaView = class extends import_obsidian4.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  plugin;
  estado = { regiaoAberta: null, busca: "", perguntaIdx: null, mostrarResposta: false, treino: null };
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
  /** Redesenha tudo mantendo a rolagem e o foco da busca. */
  desenhar() {
    const el = this.contentEl;
    const rolagem = el.scrollTop;
    const buscaFocada = document.activeElement instanceof HTMLInputElement && el.contains(document.activeElement);
    const comp = this.novoFilho();
    el.empty();
    const dados = this.plugin.dados;
    if (!dados) {
      el.createDiv({ cls: "erpg-carregando", text: "Abrindo o grim\xF3rio\u2026" });
      return;
    }
    const ctx = {
      app: this.app,
      comp,
      settings: this.plugin.config,
      estado: this.estado,
      acoes: this.acoes,
      snap: dados.snap,
      prog: dados.prog,
      conquistas: dados.conquistas
    };
    const pagina = el.createDiv({ cls: "erpg" });
    ficha(pagina, ctx);
    const g1 = pagina.createDiv({ cls: "erpg-grid" });
    missao(g1, ctx);
    oraculo(g1, ctx);
    const g2 = pagina.createDiv({ cls: "erpg-grid" });
    revisao(g2, ctx);
    cronica(g2, ctx);
    mapa(pagina, ctx);
    trofeus(pagina, ctx);
    el.scrollTop = rolagem;
    if (buscaFocada) {
      const input = el.querySelector(".erpg-busca input");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }
  /** Dono dos renderizadores de Markdown do desenho atual; trocado a cada desenho. */
  filho = null;
  novoFilho() {
    if (this.filho) this.removeChild(this.filho);
    this.filho = this.addChild(new import_obsidian4.Component());
    return this.filho;
  }
  // ------------------------------------------------------------ ações
  acoes = {
    abrirNota: (caminho, novaAba = false) => {
      void this.app.workspace.openLinkText(caminho, "", novaAba);
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
      new import_obsidian4.Notice(lembrou ? `${n.label}: caixa ${caixa}, volta em ${intervalos[caixa] ?? "?"} dia(s).` : `${n.label} volta amanh\xE3.`);
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
    responderTreino: async (acertou) => {
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
        const fm = this.app.metadataCache.getFileCache(f)?.frontmatter ?? {};
        const n = (k) => Number(fm[k]) || 0;
        await this.plugin.writer.propriedades(f.path, {
          treinos: n("treinos") + 1,
          acertos: n("acertos") + tr.acertos,
          perfeitos: n("perfeitos") + (tr.acertos === tr.itens.length ? 1 : 0)
        });
        await this.plugin.atualizarAgora();
      } else {
        this.desenhar();
      }
    },
    redesenhar: () => this.desenhar()
  };
};

// src/vault/indexer.ts
var import_obsidian5 = require("obsidian");
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
    const ignoradas = s.pastasIgnoradas.map((p) => (0, import_obsidian5.normalizePath)(p).toLowerCase()).filter(Boolean);
    const ignorar = (f) => ignoradas.some((p) => f.path.toLowerCase() === p || f.path.toLowerCase().startsWith(p + "/"));
    const arquivos = this.app.vault.getMarkdownFiles().filter((f) => !ignorar(f));
    const trilhas = [];
    const missoes = [];
    const candidatasEstudo = [];
    const diario = /* @__PURE__ */ new Map();
    const pastaDiario = (0, import_obsidian5.normalizePath)(s.pastaDiario);
    for (const f of arquivos) {
      const fm = this.fm(f);
      const tipo = String(fm.tipo ?? "").toLowerCase().trim();
      if (f.parent?.path === pastaDiario) {
        const data = parseISO(f.basename);
        if (data) diario.set(data, {
          data,
          caminho: f.path,
          minutos: num(fm.minutos, 25),
          treinos: num(fm.treinos),
          acertos: num(fm.acertos),
          perfeitos: num(fm.perfeitos)
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
var import_obsidian6 = require("obsidian");
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
    if (!ok) new import_obsidian6.Notice("A nota mudou desde a \xFAltima leitura. Tente de novo.");
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
    const pasta = (0, import_obsidian6.normalizePath)(s.pastaDiario);
    const caminho = (0, import_obsidian6.normalizePath)(`${pasta}/${data}.md`);
    const existente = this.app.vault.getAbstractFileByPath(caminho);
    if (existente instanceof import_obsidian6.TFile) return existente;
    if (!this.app.vault.getAbstractFileByPath(pasta)) await this.app.vault.createFolder(pasta);
    const tpl = this.app.vault.getAbstractFileByPath((0, import_obsidian6.normalizePath)(s.templateDiario));
    const corpo = tpl instanceof import_obsidian6.TFile ? (await this.app.vault.read(tpl)).replace(/\{\{date(?::[^}]*)?\}\}/g, data) : `---
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
    if (f instanceof import_obsidian6.TFile) return f;
    new import_obsidian6.Notice(`N\xE3o achei a nota ${caminho}.`);
    return null;
  }
};

// src/main.ts
var EstudosRPG = class extends import_obsidian7.Plugin {
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
    const agendar = (0, import_obsidian7.debounce)(() => void this.atualizarAgora(), 400, true);
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
          new import_obsidian7.Notice("Estudos RPG: erro ao ler o vault. Veja o console (Ctrl+Shift+I).");
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
    if (delta > 0) new import_obsidian7.Notice(`\u2726 +${delta} XP`, 2500);
    if (depois.prog.nivel > antes.prog.nivel) new import_obsidian7.Notice(`\u269C Subiu de n\xEDvel! N\xEDvel ${depois.prog.nivel} \xB7 ${depois.prog.titulo}`, 6e3);
    const tinha = new Set(antes.conquistas.filter((c) => c.ok).map((c) => c.id));
    for (const c of depois.conquistas) if (c.ok && !tinha.has(c.id)) new import_obsidian7.Notice(`\u{1F3C6} Trof\xE9u conquistado: ${c.nome}`, 6e3);
  }
  atualizarStatus() {
    if (!this.statusEl || !this.dados) return;
    const p = this.dados.prog;
    this.statusEl.setText(`\u269C Nv ${p.nivel} \xB7 ${p.xp}/${p.xpProximo} XP${p.sequencia ? ` \xB7 \u{1F525}${p.sequencia}` : ""}`);
    this.statusEl.setAttr("aria-label", "Abrir a ficha do her\xF3i");
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
  registrarComandos() {
    this.addCommand({ id: "abrir-ficha", name: "Abrir a ficha do her\xF3i", callback: () => this.abrirFicha() });
    this.addCommand({
      id: "diario-hoje",
      name: "Abrir/criar o di\xE1rio de hoje",
      callback: async () => {
        const f = await this.writer.diario(this.hoje());
        await this.app.workspace.getLeaf(false).openFile(f);
      }
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
          new import_obsidian7.Notice("Nenhuma revis\xE3o vencida hoje.");
          return;
        }
        void this.app.workspace.openLinkText(prox.n.caminho, "", false);
      }
    });
    const naNota = (id, name, acao) => this.addCommand({
      id,
      name,
      checkCallback: (checando) => {
        const f = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView)?.file;
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
        new import_obsidian7.Notice("Essa nota j\xE1 est\xE1 no n\xEDvel m\xE1ximo.");
        return;
      }
      await this.writer.propriedades(f.path, { nivel: novo });
      new import_obsidian7.Notice(`N\xEDvel da nota: ${novo}`);
    });
    const revisarAtual = (lembrou) => async (f, fm) => {
      const estado = { caixa: normalizarCaixa(fm.caixa, this.config.intervalos), revisado: typeof fm.revisado === "string" ? fm.revisado : null };
      const caixa = lembrou ? aposLembrar(estado, this.config.intervalos) : aposEsquecer();
      await this.writer.propriedades(f.path, { caixa, revisado: this.hoje() });
      new import_obsidian7.Notice(lembrou ? `Caixa ${caixa}: volta em ${this.config.intervalos[caixa] ?? "?"} dia(s).` : "Volta amanh\xE3.");
    };
    naNota("lembrei", "Revis\xE3o: lembrei desta nota", revisarAtual(true));
    naNota("esqueci", "Revis\xE3o: esqueci desta nota", revisarAtual(false));
  }
};

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
var import_obsidian9 = require("obsidian");

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
function diaDaSemana(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return (new Date(y, m - 1, d).getDay() + 6) % 7;
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
function maiorSequencia(dias) {
  let maior = 0;
  for (const d of dias) {
    if (dias.has(addDias(d, -1))) continue;
    let n = 1;
    while (dias.has(addDias(d, n))) n++;
    maior = Math.max(maior, n);
  }
  return maior;
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
  let blocos = 0;
  for (const d of s.diario.values()) blocos += Math.floor(d.minutos / 10);
  const partes = {
    notas: contagemNivel.escrito * xp.escrito + contagemNivel.praticado * xp.praticado + contagemNivel.projeto * xp.projeto,
    topicos: topicosFeitos * xp.topico,
    diario: s.diario.size * xp.diario,
    estudo: blocos * xp.dezMinutos,
    revisao: caixas * xp.caixa
  };
  const total = Object.values(partes).reduce((a, b) => a + b, 0);
  const lv = nivelPara(total);
  const dias = new Set(s.diario.keys());
  const segunda = addDias(s.hoje, -diaDaSemana(s.hoje));
  let minutosSemana = 0;
  for (const d of s.diario.values()) if (d.data >= segunda && d.data <= s.hoje) minutosSemana += d.minutos;
  return {
    xp: total,
    partes,
    nivel: lv.nivel,
    xpNivel: lv.base,
    xpProximo: lv.proximo,
    titulo: titulos[Math.min(lv.nivel - 1, titulos.length - 1)] ?? "Aventureiro",
    sequencia: sequencia(dias, s.hoje),
    maiorSequencia: maiorSequencia(dias),
    estudouHoje: dias.has(s.hoje),
    minutosHoje: s.diario.get(s.hoje)?.minutos ?? 0,
    minutosSemana,
    contagemNivel,
    topicosFeitos,
    topicosTotal
  };
}
var melhorRegiao = (s) => {
  let melhor = [0, 1];
  for (const t of s.trilhas) for (const r of t.regioes) {
    if (!r.topicos.length) continue;
    const feitos = r.topicos.filter((x) => x.feito).length;
    if (feitos / r.topicos.length > melhor[0] / melhor[1]) melhor = [feitos, r.topicos.length];
  }
  return melhor;
};
var CONQUISTAS = [
  { id: "primeira-sessao", icone: "sprout", nome: "Primeira jornada", desc: "Registre um dia de estudo no di\xE1rio", raridade: "comum", progresso: (s) => [s.diario.size, 1] },
  { id: "chama-3", icone: "flame", nome: "Chama acesa", desc: "3 dias seguidos de estudo", raridade: "comum", progresso: (_, p) => [p.maiorSequencia, 3] },
  { id: "pratica", icone: "hammer", nome: "M\xE3o na forja", desc: "Uma nota no n\xEDvel praticado", raridade: "comum", progresso: (_, p) => [p.contagemNivel.praticado + p.contagemNivel.projeto, 1] },
  { id: "chama-7", icone: "flame-kindling", nome: "Fogo eterno", desc: "7 dias seguidos de estudo", raridade: "raro", progresso: (_, p) => [p.maiorSequencia, 7] },
  { id: "estudioso", icone: "book-open", nome: "Estudioso", desc: "10 dias de estudo no total", raridade: "raro", progresso: (s) => [s.diario.size, 10] },
  { id: "explorador", icone: "compass", nome: "Explorador", desc: "Avance em 5 regi\xF5es do mapa", raridade: "raro", progresso: (s) => [s.trilhas.flatMap((t) => t.regioes).filter((r) => r.topicos.some((x) => x.feito)).length, 5] },
  { id: "maratona", icone: "timer", nome: "Maratona", desc: "2 horas de estudo num dia s\xF3", raridade: "raro", progresso: (s) => [Math.max(0, ...[...s.diario.values()].map((d) => d.minutos)), 120] },
  { id: "poliglota", icone: "languages", nome: "Duas frentes", desc: "Avance em 2 trilhas diferentes", raridade: "raro", progresso: (s) => [s.trilhas.filter((t) => t.regioes.some((r) => r.topicos.some((x) => x.feito))).length, 2] },
  { id: "projeto", icone: "castle", nome: "Construtor", desc: "Uma nota usada em projeto", raridade: "epico", progresso: (_, p) => [p.contagemNivel.projeto, 1] },
  { id: "regiao", icone: "flag", nome: "Conquistador", desc: "Conclua uma regi\xE3o inteira do mapa", raridade: "epico", progresso: (s) => melhorRegiao(s) },
  { id: "memoria", icone: "brain", nome: "Mem\xF3ria de drag\xE3o", desc: "Uma nota na \xFAltima caixa de revis\xE3o", raridade: "epico", progresso: (s, _, x) => [Math.max(0, ...s.notas.map((n) => n.caixa)), x.caixaFinal] },
  { id: "chama-30", icone: "sun", nome: "Sol invicto", desc: "30 dias seguidos de estudo", raridade: "lendario", progresso: (_, p) => [p.maiorSequencia, 30] },
  { id: "nivel-8", icone: "crown", nome: "Lenda", desc: "Chegue ao n\xEDvel 8", raridade: "lendario", progresso: (_, p) => [p.nivel, 8] }
];
function avaliarConquistas(s, p, x) {
  return CONQUISTAS.map(({ progresso, ...c }) => {
    const [atual, meta] = progresso(s, p, x);
    const m = Math.max(1, meta);
    return { ...c, ok: atual >= m, atual: Math.min(Math.max(0, atual), m), meta: m };
  });
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
  templateDiario: "estudos/Templates/Di\xE1rio.md",
  pastasIgnoradas: ["estudos/Templates"],
  intervalos: [0, 1, 3, 7, 14, 30, 60],
  semanasNoCalendario: 30,
  faixasCalendario: [25, 50],
  metaSemanalMin: 300,
  sessaoMaxMin: 240,
  xp: { escrito: 20, praticado: 60, projeto: 120, topico: 10, diario: 15, dezMinutos: 5, caixa: 10 },
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
    faixasCalendario: listaDe(s.faixasCalendario, (x) => typeof x === "number" && x > 0, d.faixasCalendario, 1).sort((a, b) => a - b),
    metaSemanalMin: typeof s.metaSemanalMin === "number" && s.metaSemanalMin >= 0 ? s.metaSemanalMin : d.metaSemanalMin,
    sessaoMaxMin: typeof s.sessaoMaxMin === "number" && s.sessaoMaxMin >= 1 ? s.sessaoMaxMin : d.sessaoMaxMin,
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
    new import_obsidian.Setting(el).setName("Faixas de cor do calend\xE1rio (minutos)").setDesc("Separadas por v\xEDrgula. Ex.: 25, 50 \u2192 menos de 25, menos de 50, 50 ou mais.").addText((t) => t.setValue(s.faixasCalendario.join(", ")).onChange(async (v) => {
      const nums = v.split(",").map((x) => Number(x.trim())).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
      if (nums.length) {
        s.faixasCalendario = nums;
        await salvar();
      }
    }));
    new import_obsidian.Setting(el).setName("Sess\xE3o de estudo").setHeading();
    this.numero(el, "Meta semanal (minutos, 0 = sem meta)", s.metaSemanalMin, 0, 1e4, async (n) => {
      s.metaSemanalMin = n;
      await salvar();
    });
    this.numero(el, "Limite de uma sess\xE3o (minutos)", s.sessaoMaxMin, 1, 1440, async (n) => {
      s.sessaoMaxMin = n;
      await salvar();
    });
    new import_obsidian.Setting(el).setName("Experi\xEAncia (XP)").setHeading();
    const rotulos = {
      escrito: "Nota no n\xEDvel escrito",
      praticado: "Nota no n\xEDvel praticado",
      projeto: "Nota usada em projeto",
      topico: "T\xF3pico marcado numa trilha",
      diario: "Dia de estudo (com minutos > 0)",
      dezMinutos: "A cada 10 minutos estudados",
      caixa: "Cada caixa de revis\xE3o alcan\xE7ada"
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
var import_obsidian6 = require("obsidian");

// src/ui/sections.ts
var import_obsidian3 = require("obsidian");

// src/ui/dom.ts
var import_obsidian2 = require("obsidian");

// src/ui/pixel.ts
var N = 9;
var PIXEL = {
  flame: [
    "....#....",
    "....##...",
    "...###...",
    "..####.#.",
    "..######.",
    ".###.###.",
    ".##...##.",
    ".##...##.",
    "..#####.."
  ],
  "flame-kindling": [
    "....#....",
    "...##....",
    "...###...",
    "..#####..",
    "..##.##..",
    "...###...",
    ".........",
    "##.....##",
    "..#####.."
  ],
  sprout: [
    ".........",
    ".##...##.",
    ".###.###.",
    "..##.##..",
    "....#....",
    "....#....",
    "....#....",
    "..#####..",
    ".#######."
  ],
  hammer: [
    "..#####..",
    ".#######.",
    "..#####..",
    "....#....",
    "....#....",
    "....#....",
    "....#....",
    "...###...",
    "........."
  ],
  "book-open": [
    ".#######.",
    "##.....#.",
    "##.###.#.",
    "##.....#.",
    "##.###.#.",
    "##.....#.",
    "##.....#.",
    "#########",
    ".#######."
  ],
  compass: [
    "..#####..",
    ".#.....#.",
    "#...#...#",
    "#..###..#",
    "#.#####.#",
    "#..###..#",
    "#...#...#",
    ".#.....#.",
    "..#####.."
  ],
  timer: [
    "...###...",
    "....#....",
    "..#####..",
    ".#..#..#.",
    "#...#...#",
    "#...##..#",
    "#.......#",
    ".#.....#.",
    "..#####.."
  ],
  clock: [
    "..#####..",
    ".#.....#.",
    "#...#...#",
    "#...#...#",
    "#...###.#",
    "#.......#",
    "#.......#",
    ".#.....#.",
    "..#####.."
  ],
  languages: [
    ".........",
    ".#######.",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    ".#######.",
    "..##.....",
    "..#......",
    "........."
  ],
  castle: [
    ".........",
    "#.#.#.#.#",
    "#########",
    ".#######.",
    ".#######.",
    ".###.###.",
    ".##...##.",
    ".##...##.",
    "........."
  ],
  flag: [
    ".#.......",
    ".######..",
    ".#######.",
    ".######..",
    ".#.......",
    ".#.......",
    ".#.......",
    ".#.......",
    "###......"
  ],
  brain: [
    "....#....",
    "....#....",
    "...###...",
    "#########",
    ".#######.",
    "..#####..",
    "..##.##..",
    ".##...##.",
    ".#.....#."
  ],
  sun: [
    "....#....",
    ".#.....#.",
    "...###...",
    "..#####..",
    "#.#####.#",
    "..#####..",
    "...###...",
    ".#.....#.",
    "....#...."
  ],
  crown: [
    ".........",
    "#...#...#",
    "##.###.##",
    "#########",
    "#########",
    "#########",
    ".........",
    "#########",
    "........."
  ],
  lock: [
    "...###...",
    "..#...#..",
    "..#...#..",
    ".#######.",
    ".#######.",
    ".###.###.",
    ".###.###.",
    ".#######.",
    "........."
  ],
  search: [
    ".####....",
    "#....#...",
    "#....#...",
    "#....#...",
    "#....#...",
    ".####....",
    ".....##..",
    "......##.",
    ".......##"
  ],
  square: [
    ".........",
    ".........",
    "..#####..",
    "..#####..",
    "..#####..",
    "..#####..",
    "..#####..",
    ".........",
    "........."
  ],
  x: [
    ".........",
    ".##...##.",
    ".###.###.",
    "..#####..",
    "...###...",
    "..#####..",
    ".###.###.",
    ".##...##.",
    "........."
  ],
  check: [
    ".........",
    ".......##",
    "......###",
    ".....###.",
    "##..###..",
    "###.##...",
    ".#####...",
    "..###....",
    "...#....."
  ],
  eye: [
    ".........",
    ".........",
    "..#####..",
    ".#.....#.",
    "#..###..#",
    "#..###..#",
    ".#.....#.",
    "..#####..",
    "........."
  ],
  "arrow-right": [
    ".........",
    ".....#...",
    ".....##..",
    "########.",
    "#########",
    "########.",
    ".....##..",
    ".....#...",
    "........."
  ],
  "external-link": [
    "....#####",
    ".......##",
    ".###..#.#",
    ".#...#..#",
    ".#..#....",
    ".#.......",
    ".#.....#.",
    ".#######.",
    "........."
  ],
  "rotate-ccw": [
    "...#####.",
    "#.#.....#",
    "##......#",
    "###.....#",
    "........#",
    "#.......#",
    ".#.....#.",
    "..#####..",
    "........."
  ],
  list: [
    ".........",
    "#.######.",
    ".........",
    "#.######.",
    ".........",
    "#.######.",
    ".........",
    "#.######.",
    "........."
  ],
  play: [
    ".........",
    ".##......",
    ".####....",
    ".######..",
    ".#######.",
    ".######..",
    ".####....",
    ".##......",
    "........."
  ],
  repeat: [
    "......#..",
    ".#######.",
    "#.....#..",
    "#........",
    "#.......#",
    "........#",
    "..#.....#",
    ".#######.",
    "..#......"
  ],
  "calendar-days": [
    ".#.....#.",
    "#########",
    "#########",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    "#########"
  ],
  map: [
    "#########",
    "#.......#",
    "#.##..#.#",
    "#...#.#.#",
    "#....#..#",
    "#.##....#",
    "#...#.###",
    "#.......#",
    "#########"
  ],
  "scroll-text": [
    ".#######.",
    "#.#.....#",
    "##......#",
    ".#.####.#",
    ".#......#",
    ".#.####.#",
    ".#......#",
    ".#.....##",
    "..#######"
  ]
};
var SVG = "http://www.w3.org/2000/svg";
function desenharPixel(el, nome) {
  const mapa2 = PIXEL[nome];
  if (!mapa2) return false;
  let d = "";
  mapa2.forEach((linha, y) => {
    for (let x = 0; x < N; x++) if (linha[x] === "#") d += `M${x} ${y}h1v1h-1z`;
  });
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${N} ${N}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("erpg-px");
  const path = document.createElementNS(SVG, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  el.appendChild(svg);
  return true;
}

// src/ui/dom.ts
function icone(parent, nome, cls = "erpg-ico") {
  const span = parent.createSpan({ cls });
  if (!desenharPixel(span, nome)) (0, import_obsidian2.setIcon)(span, nome);
  return span;
}
function botao(parent, texto, onClick, opts = {}) {
  const b = parent.createEl("button", {
    cls: `erpg-btn is-${opts.variante ?? "primario"}${opts.pequeno ? " is-sm" : ""}`,
    attr: opts.titulo ? { "aria-label": opts.titulo, title: opts.titulo } : {}
  });
  if (opts.icone) icone(b, opts.icone);
  if (texto) b.createSpan({ text: texto });
  else b.addClass("is-icone");
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
function relogio(ms) {
  const t = Math.max(0, Math.floor(ms / 1e3));
  const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  const dois = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${dois(m)}:${dois(s)}` : `${dois(m)}:${dois(s)}`;
}
function tique(root, inicio) {
  if (!inicio) return;
  const txt = relogio(Date.now() - inicio);
  root.querySelectorAll("[data-erpg-timer]").forEach((el) => {
    if (el.textContent !== txt) el.textContent = txt;
  });
}
function ficha(root, ctx) {
  const { prog, settings } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });
  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `N\xEDvel ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nv" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });
  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const p = prog.partes;
  const origemXP = `De onde vem o XP \u2014 notas ${p.notas} \xB7 t\xF3picos ${p.topicos} \xB7 dias ${p.diario} \xB7 tempo ${p.estudo} \xB7 revis\xF5es ${p.revisao}`;
  const xp = id.createDiv({ cls: "erpg-xp", attr: { title: origemXP } });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experi\xEAncia at\xE9 o pr\xF3ximo n\xEDvel");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });
  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic, valor, rot, cls = "", dica = `${valor} ${rot}`) => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim(), attr: { title: dica } });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
    return a;
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "", `Sequ\xEAncia atual: ${prog.sequencia} \xB7 recorde: ${prog.maiorSequencia}`);
  if (settings.metaSemanalMin > 0) {
    const ok = prog.minutosSemana >= settings.metaSemanalMin;
    const a = atributo("clock", `${prog.minutosSemana}/${settings.metaSemanalMin}`, "min na semana", `is-meta${ok ? " is-ok" : ""}`, `Meta semanal: ${prog.minutosSemana} de ${settings.metaSemanalMin} min \xB7 hoje ${prog.minutosHoje} min`);
    barra(a, prog.minutosSemana / settings.metaSemanalMin, "erpg-barra is-meta", "Meta semanal de minutos");
  }
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");
  medalhas(sec, ctx);
  sessao(sec.createDiv({ cls: "erpg-ficha-acao" }), ctx);
}
function sessao(acao, ctx) {
  const inicio = ctx.acoes.sessaoInicio();
  const { xp } = ctx.settings;
  if (inicio) {
    acao.addClass("is-rodando");
    const b = botao(acao, "Encerrar", () => ctx.acoes.encerrarSessao(), { icone: "square", titulo: `Encerrar e somar os minutos no di\xE1rio (+${xp.dezMinutos} XP a cada 10 min)` });
    b.createSpan({ cls: "erpg-timer", attr: { "data-erpg-timer": "" }, text: relogio(Date.now() - inicio) });
    botao(acao, "", () => {
      if (Date.now() - inicio >= 6e4 && !window.confirm("Descartar a sess\xE3o? Os minutos n\xE3o v\xE3o contar.")) return;
      return ctx.acoes.descartarSessao();
    }, { icone: "x", variante: "discreto", pequeno: true, titulo: "Descartar a sess\xE3o (n\xE3o conta)" });
  } else {
    botao(acao, "Iniciar sess\xE3o", () => ctx.acoes.iniciarSessao(), { icone: "timer", titulo: `Cronometra o estudo \xB7 +${xp.dezMinutos} XP a cada 10 min${ctx.prog.estudouHoje ? "" : ` e +${xp.diario} XP pelo dia`}` });
  }
  botao(acao, "", () => ctx.acoes.abrirDiario(), { icone: "book-open", variante: "secundario", pequeno: true, titulo: "Abrir o di\xE1rio de hoje" });
}
function descConquista(c) {
  return `${c.nome} \xB7 ${RARIDADE[c.raridade]}
${c.desc}
${c.ok ? "\u2713 Conquistado" : `Progresso: ${c.atual}/${c.meta}`}`;
}
function medalhas(parent, ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const box = parent.createEl("button", { cls: "erpg-medalhas", attr: { "aria-label": `Conquistas: ${ok} de ${ctx.conquistas.length}. Abrir a lista.` } });
  box.addEventListener("click", () => ctx.acoes.abrirConquistas());
  box.createDiv({ cls: "erpg-rotulo", text: `Conquistas ${ok}/${ctx.conquistas.length}` });
  const fila = box.createDiv({ cls: "erpg-medalhas-fila" });
  for (const c of ctx.conquistas) {
    const m = fila.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}`, attr: { title: descConquista(c) } });
    m.style.setProperty("--p", `${Math.round(c.atual / c.meta * 100)}%`);
    icone(m, c.ok ? c.icone : "lock");
  }
}
function listaConquistas(parent, ctx) {
  const ordem = ["comum", "raro", "epico", "lendario"];
  const grade = parent.createDiv({ cls: "erpg-conquistas" });
  for (const r of ordem) {
    for (const c of ctx.conquistas.filter((x) => x.raridade === r)) {
      const card = grade.createDiv({ cls: `erpg-conquista is-${c.raridade}${c.ok ? " is-ok" : ""}` });
      const m = card.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}` });
      m.style.setProperty("--p", `${Math.round(c.atual / c.meta * 100)}%`);
      icone(m, c.icone);
      const info = card.createDiv({ cls: "erpg-conquista-info" });
      const topo = info.createDiv({ cls: "erpg-conquista-topo" });
      topo.createSpan({ cls: "erpg-conquista-nome", text: c.nome });
      topo.createSpan({ cls: "erpg-meta is-ouro", text: RARIDADE[c.raridade] });
      info.createDiv({ cls: "erpg-meta", text: c.desc });
      const linha = info.createDiv({ cls: "erpg-linha" });
      barra(linha, c.atual / c.meta, "erpg-barra", `Progresso de ${c.nome}`);
      linha.createSpan({ cls: `erpg-num${c.ok ? " is-ouro" : ""}`, text: c.ok ? "\u2713" : `${c.atual}/${c.meta}` });
    }
  }
}
function proximos(root, ctx) {
  const { snap } = ctx;
  const corpo = painel(root, "compass", "Pr\xF3ximos passos", void 0, "is-proximos");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, se\xE7\xF5es com \u201C#\u201D e t\xF3picos \u201C- [ ] [[Nota]] \u2014 descri\xE7\xE3o\u201D.");
    return;
  }
  const area = corpo.createDiv({ cls: "erpg-rola erpg-proximos" });
  for (const t of snap.trilhas) {
    const todos = t.regioes.flatMap((r) => r.topicos);
    const feitos = todos.filter((x) => x.feito).length;
    const bloco = area.createDiv({ cls: "erpg-proximo" });
    const cab = bloco.createDiv({ cls: "erpg-linha" });
    const nome = cab.createEl("button", { cls: "erpg-origem", text: t.nome, attr: { "aria-label": `Ver a trilha ${t.nome} no mapa` } });
    nome.addEventListener("click", () => {
      ctx.estado.trilha = t.caminho;
      ctx.acoes.redesenhar();
    });
    barra(cab, todos.length ? feitos / todos.length : 0, "erpg-barra", `Progresso em ${t.nome}`);
    cab.createSpan({ cls: "erpg-num", text: `${feitos}/${todos.length}` });
    const prox = proximoTopico(t);
    if (prox) topico(bloco, ctx, t.caminho, prox.topico, prox.regiao);
    else vazio(bloco, "Trilha completa! \u{1F3C6}");
  }
}
function proximoTopico(t) {
  for (const r of t.regioes) {
    const tp = r.topicos.find((x) => !x.feito);
    if (tp) return { regiao: r.nome, topico: tp };
  }
  return null;
}
function revisao(root, ctx) {
  const { snap, settings, estado } = ctx;
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  const qtdPerguntas = (caminho) => snap.perguntas.filter((p) => p.caminho === caminho).length;
  const pos = estado.revisando ? fila.findIndex((x) => x.n.caminho === estado.revisando) : -1;
  if (estado.revisando && pos < 0) estado.revisando = null;
  const sub = !fila.length ? void 0 : pos >= 0 ? `${pos + 1} de ${fila.length} na fila` : `${fila.length} na fila`;
  const corpo = painel(root, "repeat", "Revisar", sub, "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x) => !!x).sort()[0];
    vazio(corpo, "Nada para revisar hoje.", prox ? `Pr\xF3xima revis\xE3o ${relativo(prox, snap.hoje)}.` : void 0);
    return;
  }
  const atual = pos >= 0 ? fila[pos] : void 0;
  if (atual) {
    const n = atual.n;
    const proxima = fila[pos + 1]?.n.caminho ?? null;
    const perguntas = snap.perguntas.filter((p) => p.caminho === n.caminho);
    const origem = corpo.createEl("button", { cls: "erpg-origem", text: n.label, attr: { "aria-label": `Abrir a nota ${n.label}` } });
    origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(n.caminho, ev.ctrlKey || ev.metaKey));
    corpo.createDiv({ cls: "erpg-meta", text: atual.revisado ? `caixa ${atual.caixa} \xB7 revisada ${relativo(atual.revisado, snap.hoje)}` : "primeira revis\xE3o" });
    if (perguntas.length) {
      const i = Math.min(estado.perguntaIdx, perguntas.length - 1);
      const p = perguntas[i];
      const area = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      area.createDiv({ cls: "erpg-subtitulo", text: `Pergunta ${i + 1} de ${perguntas.length}` });
      md(ctx, area.createDiv({ cls: "erpg-pergunta" }), p.pergunta, n.caminho);
      if (estado.mostrarResposta) md(ctx, area.createDiv({ cls: "erpg-resposta" }), p.resposta, n.caminho);
      const row = corpo.createDiv({ cls: "erpg-acoes" });
      botao(row, estado.mostrarResposta ? "Esconder" : "Ver resposta", () => {
        estado.mostrarResposta = !estado.mostrarResposta;
        ctx.acoes.redesenhar();
      }, { icone: "eye", pequeno: true, variante: "secundario" });
      if (i < perguntas.length - 1) botao(row, "Pr\xF3xima pergunta", () => {
        estado.perguntaIdx = i + 1;
        estado.mostrarResposta = false;
        ctx.acoes.redesenhar();
      }, { icone: "arrow-right", pequeno: true, variante: "secundario" });
    } else {
      const v = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      vazio(v, "Essa nota n\xE3o tem perguntas.", "Abra, releia e diga se lembrou. Para se testar aqui, adicione na nota callouts \u201C> [!question]- Pergunta\u201D com a resposta embaixo.");
      botao(corpo.createDiv({ cls: "erpg-acoes" }), "Abrir nota", (ev) => ctx.acoes.abrirNota(n.caminho, ev.ctrlKey || ev.metaKey), { icone: "external-link", pequeno: true, variante: "secundario" });
    }
    ornamento(corpo);
    const caixaSeLembrar = aposLembrar({ caixa: n.caixa, revisado: n.revisado }, settings.intervalos);
    const dias = settings.intervalos[caixaSeLembrar] ?? "?";
    const fim = corpo.createDiv({ cls: "erpg-acoes erpg-veredito" });
    botao(fim, `Lembrei \xB7 ${dias}d`, () => ctx.acoes.revisar(n, true, proxima), { icone: "check", titulo: `Sobe para a caixa ${caixaSeLembrar}: volta em ${dias} dia(s)` });
    botao(fim, "Esqueci \xB7 1d", () => ctx.acoes.revisar(n, false, proxima), { icone: "rotate-ccw", variante: "secundario", titulo: "Volta para a caixa 1: revisa amanh\xE3" });
    if (proxima) botao(fim, "Pular", () => ctx.acoes.revisarNota(proxima), { variante: "discreto", pequeno: true, titulo: "Deixa esta para depois (continua na fila)" });
    botao(fim, "Fila", () => ctx.acoes.revisarNota(null), { icone: "list", variante: "discreto", pequeno: true, titulo: "Voltar para a lista" });
    return;
  }
  const topo = corpo.createDiv({ cls: "erpg-acoes" });
  const total = fila.reduce((a, x) => a + qtdPerguntas(x.n.caminho), 0);
  botao(topo, "Come\xE7ar revis\xE3o", () => ctx.acoes.revisarNota(fila[0].n.caminho), { icone: "play" });
  if (total) topo.createSpan({ cls: "erpg-dica", text: `${total} ${total === 1 ? "pergunta" : "perguntas"} pra se testar` });
  const lista = corpo.createDiv({ cls: "erpg-revisoes erpg-rola" });
  for (const x of fila) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    const q = qtdPerguntas(x.n.caminho);
    const quando = x.revisado ? `caixa ${x.caixa} \xB7 ${relativo(x.revisado, snap.hoje)}` : "nunca revisada";
    info.createDiv({ cls: "erpg-meta", text: q ? `${quando} \xB7 ${q} ${q === 1 ? "pergunta" : "perguntas"}` : quando });
    botao(row.createDiv({ cls: "erpg-acoes" }), "Revisar", () => ctx.acoes.revisarNota(x.n.caminho), { pequeno: true, variante: "secundario" });
  }
}
function cronica(root, ctx) {
  const { snap, settings } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Atividade", `${snap.diario.size} ${snap.diario.size === 1 ? "dia" : "dias"} de estudo`, "is-cronica");
  const inicio = addDias(snap.hoje, -diaDaSemana(snap.hoje) - (semanas - 1) * 7);
  const grade = corpo.createDiv({ cls: "erpg-grade", attr: { style: `--semanas:${semanas}` } });
  for (let k = 0; k < semanas * 7; k++) {
    const dia = addDias(inicio, k);
    const futuro = diffDias(snap.hoje, dia) > 0;
    const d = snap.diario.get(dia);
    const lv = !d ? 0 : Math.min(3, 1 + settings.faixasCalendario.filter((f) => d.minutos >= f).length);
    grade.createSpan({
      cls: `erpg-dia is-n${futuro ? "x" : lv}${dia === snap.hoje ? " is-hoje" : ""}`,
      attr: { title: `${dia}${d ? ` \xB7 ${d.minutos} min` : ""}` }
    });
  }
}
function mapa(root, ctx) {
  const { snap, estado } = ctx;
  const ativa = snap.trilhas.find((t) => t.caminho === estado.trilha) ?? snap.trilhas[0];
  const conta = (t) => {
    const x = t.regioes.flatMap((r) => r.topicos);
    return [x.filter((y) => y.feito).length, x.length];
  };
  const [f, n] = ativa ? conta(ativa) : [0, 0];
  const corpo = painel(root, "map", "Trilhas", ativa ? `${f} de ${n} t\xF3picos` : void 0, "is-mapa");
  if (!ativa) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, se\xE7\xF5es com \u201C#\u201D e t\xF3picos \u201C- [ ] [[Nota]] \u2014 descri\xE7\xE3o\u201D.");
    return;
  }
  if (snap.trilhas.length > 1) {
    const abas = corpo.createDiv({ cls: "erpg-abas", attr: { role: "tablist" } });
    for (const t of snap.trilhas) {
      const [tf, tn] = conta(t);
      const sel = t === ativa;
      const aba = abas.createEl("button", { cls: `erpg-aba${sel ? " is-ativa" : ""}`, attr: { role: "tab", "aria-selected": String(sel) } });
      aba.createSpan({ text: t.nome });
      aba.createSpan({ cls: "erpg-num", text: `${tn ? Math.round(tf / tn * 100) : 0}%` });
      aba.addEventListener("click", () => {
        estado.trilha = t.caminho;
        ctx.acoes.redesenhar();
      });
    }
  }
  const ferramentas = corpo.createDiv({ cls: "erpg-acoes" });
  const busca = ferramentas.createEl("button", { cls: "erpg-busca", attr: { "aria-label": "Buscar t\xF3pico" } });
  icone(busca, "search");
  busca.createSpan({ text: "Buscar t\xF3pico" });
  busca.addEventListener("click", () => ctx.acoes.abrirTopicos(null));
  botao(ferramentas, "", (ev) => ctx.acoes.abrirNota(ativa.caminho, ev.ctrlKey || ev.metaKey), { icone: "external-link", variante: "secundario", pequeno: true, titulo: `Abrir a nota da trilha ${ativa.nome}` });
  const rola = corpo.createDiv({ cls: "erpg-rola" });
  let grid = null;
  let grupoAtual = null;
  for (const r of ativa.regioes) {
    const g = r.nivelTitulo === 2 ? r.grupo : "";
    if (!grid || g !== grupoAtual) {
      grupoAtual = g;
      if (g) rola.createDiv({ cls: "erpg-rotulo", text: g });
      grid = rola.createDiv({ cls: "erpg-regioes" });
    }
    const feitos = r.topicos.filter((x) => x.feito).length;
    const b = grid.createEl("button", {
      cls: `erpg-regiao${feitos === r.topicos.length ? " is-conquistada" : ""}${r.destaque ? " is-destaque" : ""}`,
      attr: { title: `${r.nome}: ${feitos} de ${r.topicos.length}${r.desc ? `
${r.desc}` : ""}` }
    });
    b.createSpan({ cls: "erpg-regiao-nome", text: r.nome });
    b.createSpan({ cls: "erpg-num", text: `${feitos}/${r.topicos.length}` });
    barra(b, feitos / r.topicos.length, "erpg-barra");
    b.addEventListener("click", () => ctx.acoes.abrirTopicos({ trilha: ativa.caminho, regiao: r.nome }));
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

// src/ui/conquistasModal.ts
var import_obsidian4 = require("obsidian");
var ConquistasModal = class extends import_obsidian4.Modal {
  constructor(plugin, criarCtx) {
    super(plugin.app);
    this.plugin = plugin;
    this.criarCtx = criarCtx;
  }
  plugin;
  criarCtx;
  comp = new import_obsidian4.Component();
  desinscrever = null;
  onOpen() {
    this.modalEl.addClass("erpg-modal");
    this.contentEl.addClass("erpg-host");
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenhar());
    this.desenhar();
  }
  onClose() {
    this.desinscrever?.();
    this.comp.unload();
    this.contentEl.empty();
  }
  desenhar() {
    this.comp.unload();
    this.comp = new import_obsidian4.Component();
    this.comp.load();
    this.contentEl.empty();
    const ctx = this.criarCtx(this.comp);
    if (!ctx) return;
    const ok = ctx.conquistas.filter((c) => c.ok).length;
    this.setTitle(`Conquistas \xB7 ${ok}/${ctx.conquistas.length}`);
    listaConquistas(this.contentEl.createDiv({ cls: "erpg-modal-lista" }), ctx);
  }
};

// src/ui/topicosModal.ts
var import_obsidian5 = require("obsidian");
var TopicosModal = class extends import_obsidian5.Modal {
  constructor(plugin, criarCtx, alvo) {
    super(plugin.app);
    this.plugin = plugin;
    this.criarCtx = criarCtx;
    this.alvo = alvo;
  }
  plugin;
  criarCtx;
  alvo;
  comp = new import_obsidian5.Component();
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
    this.comp = new import_obsidian5.Component();
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
var FichaView = class extends import_obsidian6.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  plugin;
  estado = { revisando: null, perguntaIdx: 0, mostrarResposta: false, trilha: null };
  /** A animação de entrada só roda no primeiro desenho (não a cada clique). */
  jaDesenhou = false;
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
    this.registerInterval(window.setInterval(() => tique(this.contentEl, this.plugin.sessaoInicio), 1e3));
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
   *   [ Próximos passos / Atividade | Revisar | Trilhas ]
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
    const pagina = el.createDiv({ cls: this.jaDesenhou ? "erpg" : "erpg is-entrada" });
    this.jaDesenhou = true;
    ficha(pagina, ctx);
    const grade = pagina.createDiv({ cls: "erpg-grade-principal" });
    const colA = grade.createDiv({ cls: "erpg-col is-a" });
    proximos(colA, ctx);
    cronica(colA, ctx);
    const colB = grade.createDiv({ cls: "erpg-col is-b" });
    revisao(colB, ctx);
    mapa(grade.createDiv({ cls: "erpg-col is-c" }), ctx);
    el.scrollTop = rolagem;
    tique(el, this.plugin.sessaoInicio);
  }
  /** Dono dos renderizadores de Markdown do desenho atual; trocado a cada desenho. */
  filho = null;
  novoFilho() {
    if (this.filho) this.removeChild(this.filho);
    this.filho = this.addChild(new import_obsidian6.Component());
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
    revisar: async (n, lembrou, proxima) => {
      const { intervalos } = this.plugin.config;
      const caixa = lembrou ? aposLembrar({ caixa: n.caixa, revisado: n.revisado }, intervalos) : aposEsquecer();
      const hoje = this.plugin.hoje();
      await this.plugin.writer.propriedades(n.caminho, { caixa, revisado: hoje });
      new import_obsidian6.Notice(lembrou ? `${n.label}: caixa ${caixa}, volta em ${intervalos[caixa] ?? "?"} dia(s).` : `${n.label} volta amanh\xE3.`);
      Object.assign(this.estado, { revisando: proxima, perguntaIdx: 0, mostrarResposta: false });
      await this.plugin.atualizarAgora();
    },
    revisarNota: (caminho) => {
      Object.assign(this.estado, { revisando: caminho, perguntaIdx: 0, mostrarResposta: false });
      this.desenhar();
    },
    abrirDiario: async () => {
      await this.plugin.abrirNoCentro(await this.plugin.writer.diario(this.plugin.hoje()));
    },
    iniciarSessao: () => this.plugin.iniciarSessao(),
    encerrarSessao: () => this.plugin.encerrarSessao(),
    descartarSessao: () => this.plugin.descartarSessao(),
    sessaoInicio: () => this.plugin.sessaoInicio,
    abrirConquistas: () => new ConquistasModal(this.plugin, this.criarCtx).open(),
    abrirTopicos: (alvo) => new TopicosModal(this.plugin, this.criarCtx, alvo).open(),
    redesenhar: () => this.desenhar()
  };
};

// src/vault/indexer.ts
var import_obsidian7 = require("obsidian");

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
  let grupo = "";
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
      const nome = limparTitulo(h[2] ?? "");
      const nivelTitulo = h[1]?.length ?? 1;
      if (nivelTitulo === 1) grupo = nome;
      atual = { nome, nivelTitulo, grupo, destaque: /⭐/.test(h[2] ?? ""), desc: "", topicos: [] };
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
function parsePerguntas(texto) {
  const out = [];
  const re = /^> \[!question\][-+]?[ \t]*(.+)\n((?:>.*(?:\n|$))*)/gm;
  const t = texto.replace(/\r\n/g, "\n");
  let m;
  while (m = re.exec(t)) {
    const pergunta = (m[1] ?? "").trim();
    const resposta = (m[2] ?? "").split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").replace(/\s+/g, " ").trim();
    if (!pergunta || /^\[.*\]$/.test(pergunta) || !resposta || /^\[.*\]$/.test(resposta)) continue;
    out.push({ pergunta, resposta });
  }
  return out;
}
function alternarCheckbox(linha) {
  return /\[[xX]\]/.test(linha) ? linha.replace(/\[[xX]\]/, "[ ]") : linha.replace(/\[ \]/, "[x]");
}

// src/vault/indexer.ts
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
    const ignoradas = s.pastasIgnoradas.map((p) => (0, import_obsidian7.normalizePath)(p).toLowerCase()).filter(Boolean);
    const ignorar = (f) => ignoradas.some((p) => f.path.toLowerCase() === p || f.path.toLowerCase().startsWith(p + "/"));
    const arquivos = this.app.vault.getMarkdownFiles().filter((f) => !ignorar(f));
    const trilhas = [];
    const candidatasEstudo = [];
    const diario = /* @__PURE__ */ new Map();
    const pastaDiario = (0, import_obsidian7.normalizePath)(s.pastaDiario);
    for (const f of arquivos) {
      const fm = this.fm(f);
      const tipo = String(fm.tipo ?? "").toLowerCase().trim();
      if (f.parent?.path === pastaDiario) {
        const data = parseISO(f.basename);
        const minutos = num(fm.minutos, 0);
        if (data && minutos > 0) diario.set(data, { data, caminho: f.path, minutos });
        continue;
      }
      if (tipo === "trilha") {
        const texto = await this.app.vault.cachedRead(f);
        trilhas.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), regioes: parseTrilha(texto, (alvo) => this.resolver(alvo, f.path)) });
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
    notas.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    return { hoje, trilhas, notas, perguntas, diario };
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
var import_obsidian8 = require("obsidian");
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
    if (!ok) new import_obsidian8.Notice("A nota mudou desde a \xFAltima leitura. Tente de novo.");
    return ok;
  }
  async propriedades(caminho, patch) {
    const f = this.arquivo(caminho);
    if (!f) return;
    await this.app.fileManager.processFrontMatter(f, (fm) => Object.assign(fm, patch));
  }
  /** Soma minutos estudados no diário de `data` (cria o diário se preciso). Devolve o total do dia. */
  async somarMinutos(data, minutos) {
    const f = await this.diario(data);
    let total = minutos;
    await this.app.fileManager.processFrontMatter(f, (fm) => {
      const antes = Number(fm.minutos);
      total = (Number.isFinite(antes) && antes > 0 ? antes : 0) + minutos;
      fm.minutos = total;
    });
    return total;
  }
  /** Cria (se preciso) e devolve a nota do diário de `data`. */
  async diario(data) {
    const s = this.getSettings();
    const pasta = (0, import_obsidian8.normalizePath)(s.pastaDiario);
    const caminho = (0, import_obsidian8.normalizePath)(`${pasta}/${data}.md`);
    const existente = this.app.vault.getAbstractFileByPath(caminho);
    if (existente instanceof import_obsidian8.TFile) return existente;
    if (!this.app.vault.getAbstractFileByPath(pasta)) await this.app.vault.createFolder(pasta);
    const tpl = this.app.vault.getAbstractFileByPath((0, import_obsidian8.normalizePath)(s.templateDiario));
    const corpo = tpl instanceof import_obsidian8.TFile ? (await this.app.vault.read(tpl)).replace(/\{\{date(?::[^}]*)?\}\}/g, data) : `---
minutos: 0
---

# \u{1F4DC} ${data}

**O que estudei:**
- 
`;
    return this.app.vault.create(caminho, corpo);
  }
  arquivo(caminho) {
    const f = this.app.vault.getAbstractFileByPath(caminho);
    if (f instanceof import_obsidian8.TFile) return f;
    new import_obsidian8.Notice(`N\xE3o achei a nota ${caminho}.`);
    return null;
  }
};

// src/main.ts
var EstudosRPG = class extends import_obsidian9.Plugin {
  config;
  writer;
  dados = null;
  /** Início da sessão de estudo em andamento (ms), ou null. Salvo no data.json: sobrevive a um reload. */
  sessaoInicio = null;
  indexer;
  ouvintes = /* @__PURE__ */ new Set();
  statusEl = null;
  atualizando = null;
  pendente = false;
  async onload() {
    const salvo = await this.loadData();
    this.config = mergeSettings(salvo);
    const ini = salvo?.sessaoInicio;
    this.sessaoInicio = typeof ini === "number" && Number.isFinite(ini) && ini <= Date.now() ? ini : null;
    this.indexer = new Indexer(this.app, () => this.config);
    this.writer = new Writer(this.app, () => this.config);
    this.registerView(VIEW_FICHA, (leaf) => new FichaView(leaf, this));
    this.addRibbonIcon("shield", "Abrir a ficha do her\xF3i", () => this.abrirFicha());
    this.addSettingTab(new AbaConfig(this.app, this));
    this.registrarComandos();
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("erpg-status");
    this.statusEl.addEventListener("click", () => this.abrirFicha());
    const agendar = (0, import_obsidian9.debounce)(() => void this.atualizarAgora(), 400, true);
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
    this.registerInterval(window.setInterval(() => {
      if (this.sessaoInicio) this.atualizarStatus();
    }, 15e3));
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
          const conquistas = avaliarConquistas(snap, prog, { caixaFinal: caixaMax(this.config.intervalos) });
          this.anunciar(this.dados, { snap, prog, conquistas });
          this.dados = { snap, prog, conquistas };
          this.atualizarStatus();
          this.ouvintes.forEach((fn) => fn());
        } catch (e) {
          console.error("[estudos-rpg] falha ao ler o vault", e);
          new import_obsidian9.Notice("Estudos RPG: erro ao ler o vault. Veja o console (Ctrl+Shift+I).");
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
    if (delta > 0) {
      const nomes = { notas: "nota", topicos: "t\xF3pico", diario: "dia de estudo", estudo: "tempo de estudo", revisao: "revis\xE3o" };
      const fontes = Object.keys(nomes).filter((k) => depois.prog.partes[k] > antes.prog.partes[k]).map((k) => nomes[k]);
      new import_obsidian9.Notice(`\u2726 +${delta} XP${fontes.length ? ` \xB7 ${fontes.join(", ")}` : ""}`, 3e3);
    }
    if (depois.prog.nivel > antes.prog.nivel) new import_obsidian9.Notice(`\u269C Subiu de n\xEDvel! N\xEDvel ${depois.prog.nivel} \xB7 ${depois.prog.titulo}`, 6e3);
    const tinha = new Set(antes.conquistas.filter((c) => c.ok).map((c) => c.id));
    for (const c of depois.conquistas) if (c.ok && !tinha.has(c.id)) new import_obsidian9.Notice(`\u{1F3C6} Trof\xE9u conquistado: ${c.nome}`, 6e3);
  }
  atualizarStatus() {
    if (!this.statusEl || !this.dados) return;
    const p = this.dados.prog;
    const sessao2 = this.sessaoInicio ? ` \xB7 \u23F1 ${this.minutosSessao()} min` : "";
    this.statusEl.setText(`\u269C Nv ${p.nivel} \xB7 ${p.xp}/${p.xpProximo} XP${p.sequencia ? ` \xB7 \u{1F525}${p.sequencia}` : ""}${sessao2}`);
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
    await this.persistir();
    await this.atualizarAgora();
  }
  async persistir() {
    await this.saveData({ ...this.config, sessaoInicio: this.sessaoInicio });
  }
  // ------------------------------------------------------------ sessão de estudo (cronômetro)
  /** Minutos inteiros da sessão atual (0 se não há sessão). */
  minutosSessao(agora = Date.now()) {
    return this.sessaoInicio ? Math.max(0, Math.floor((agora - this.sessaoInicio) / 6e4)) : 0;
  }
  /** Começa a cronometrar e abre o diário de hoje (pra anotar o que está estudando). */
  async iniciarSessao() {
    if (this.sessaoInicio) return;
    this.sessaoInicio = Date.now();
    await this.persistir();
    this.atualizarStatus();
    this.ouvintes.forEach((fn) => fn());
    await this.abrirNoCentro(await this.writer.diario(this.hoje()));
  }
  /**
   * Para o cronômetro e soma os minutos no diário do dia em que a sessão COMEÇOU.
   * E se a sessão ficou ligada esquecida? Conta no máximo `sessaoMaxMin`.
   */
  async encerrarSessao() {
    const inicio = this.sessaoInicio;
    if (!inicio) return;
    let min = this.minutosSessao();
    this.sessaoInicio = null;
    await this.persistir();
    if (min < 1) {
      new import_obsidian9.Notice("Sess\xE3o com menos de 1 minuto: n\xE3o contou.");
    } else {
      if (min > this.config.sessaoMaxMin) {
        new import_obsidian9.Notice(`Sess\xE3o de ${min} min passou do limite: contei ${this.config.sessaoMaxMin} min. Ajuste no di\xE1rio se precisar.`, 8e3);
        min = this.config.sessaoMaxMin;
      }
      const total = await this.writer.somarMinutos(toISO(new Date(inicio)), min);
      new import_obsidian9.Notice(`\u23F1 +${min} min de estudo (${total} min no dia)`, 4e3);
    }
    await this.atualizarAgora();
  }
  /** Para o cronômetro sem contar nada. */
  async descartarSessao() {
    if (!this.sessaoInicio) return;
    this.sessaoInicio = null;
    await this.persistir();
    new import_obsidian9.Notice("Sess\xE3o descartada.");
    this.atualizarStatus();
    this.ouvintes.forEach((fn) => fn());
  }
  // ------------------------------------------------------------ comandos (Ctrl+P)
  registrarComandos() {
    this.addCommand({ id: "abrir-ficha", name: "Abrir a ficha do her\xF3i", callback: () => this.abrirFicha() });
    this.addCommand({
      id: "sessao",
      name: "Iniciar/encerrar a sess\xE3o de estudo",
      callback: () => this.sessaoInicio ? this.encerrarSessao() : this.iniciarSessao()
    });
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
          new import_obsidian9.Notice("Nenhuma revis\xE3o vencida hoje.");
          return;
        }
        void this.app.workspace.openLinkText(prox.n.caminho, "", "tab");
      }
    });
    const naNota = (id, name, acao) => this.addCommand({
      id,
      name,
      checkCallback: (checando) => {
        const f = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView)?.file;
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
        new import_obsidian9.Notice("Essa nota j\xE1 est\xE1 no n\xEDvel m\xE1ximo.");
        return;
      }
      await this.writer.propriedades(f.path, { nivel: novo });
      new import_obsidian9.Notice(`N\xEDvel da nota: ${novo}`);
    });
    const revisarAtual = (lembrou) => async (f, fm) => {
      const estado = { caixa: normalizarCaixa(fm.caixa, this.config.intervalos), revisado: typeof fm.revisado === "string" ? fm.revisado : null };
      const caixa = lembrou ? aposLembrar(estado, this.config.intervalos) : aposEsquecer();
      await this.writer.propriedades(f.path, { caixa, revisado: this.hoje() });
      new import_obsidian9.Notice(lembrou ? `Caixa ${caixa}: volta em ${this.config.intervalos[caixa] ?? "?"} dia(s).` : "Volta amanh\xE3.");
    };
    naNota("lembrei", "Revis\xE3o: lembrei desta nota", revisarAtual(true));
    naNota("esqueci", "Revis\xE3o: esqueci desta nota", revisarAtual(false));
  }
};

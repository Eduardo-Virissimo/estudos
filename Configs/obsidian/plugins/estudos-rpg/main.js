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
  { id: "maratona", icone: "clock", nome: "Maratona", desc: "2 horas de estudo num dia s\xF3", raridade: "raro", progresso: (s) => [Math.max(0, ...[...s.diario.values()].map((d) => d.minutos)), 120] },
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
  if (!e.revisado || e.caixa < 1) return Math.min(caixaMax(intervalos), 2);
  return Math.min(caixaMax(intervalos), e.caixa + 1);
}
function aposEsquecer() {
  return 1;
}
function filaDoDia(fila, novasPorDia, novasFeitasHoje) {
  const limite = novasPorDia > 0 ? Math.max(0, novasPorDia - novasFeitasHoje) : Infinity;
  const hoje = [];
  let novas = 0, adiadas = 0;
  for (const x of fila) {
    const nova = !x.revisado;
    if (nova && novas >= limite) {
      adiadas++;
      continue;
    }
    if (nova) novas++;
    hoje.push(x);
  }
  return { hoje, adiadas };
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
  novasPorDia: 10,
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
    novasPorDia: typeof s.novasPorDia === "number" && s.novasPorDia >= 0 ? Math.floor(s.novasPorDia) : d.novasPorDia,
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

// src/ui/nitidez.ts
function pixelDoIcone(dpr) {
  if (!Number.isFinite(dpr) || dpr <= 0) return 1;
  const pixelsDaTela = Math.max(1, Math.round(dpr));
  return pixelsDaTela / dpr;
}

// src/ui/svgPath.ts
var FORMA = /<(path|polygon|rect)\b([^>]*?)\/?>/g;
function attr(atributos, nome) {
  return new RegExp(`\\s${nome}="([^"]*)"`).exec(atributos)?.[1];
}
function svgParaCaminhos(svg) {
  const ds = [];
  for (const [, tag, a = ""] of svg.matchAll(FORMA)) {
    if (attr(a, "fill") === "none") continue;
    if (tag === "path") {
      const d = attr(a, "d");
      if (d) ds.push(d);
    } else if (tag === "polygon") {
      const n = (attr(a, "points") ?? "").trim().split(/[\s,]+/).filter(Boolean);
      if (n.length < 6 || n.length % 2) continue;
      let d = `M${n[0]} ${n[1]}`;
      for (let i = 2; i < n.length; i += 2) d += `L${n[i]} ${n[i + 1]}`;
      ds.push(`${d}Z`);
    } else {
      const x = Number(attr(a, "x") ?? 0), y = Number(attr(a, "y") ?? 0);
      const w = Number(attr(a, "width")), h = Number(attr(a, "height"));
      if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) continue;
      ds.push(`M${x} ${y}h${w}v${h}h${-w}Z`);
    }
  }
  return ds;
}

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/arrow-right-solid.svg
var arrow_right_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Arrow_Right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 21 14 21 15 20 15 20 16 19 16 19 17 18 17 18 18 17 18 17 19 16 19 16 20 15 20 15 21 14 21 14 22 13 22 13 23 12 23 12 22 11 22 11 21 10 21 10 20 11 20 11 19 12 19 12 18 13 18 13 17 14 17 14 16 15 16 15 15 16 15 16 14 1 14 1 10 16 10 16 9 15 9 15 8 14 8 14 7 13 7 13 6 12 6 12 5 11 5 11 4 10 4 10 3 11 3 11 2 12 2 12 1 13 1 13 2 14 2 14 3 15 3 15 4 16 4 16 5 17 5 17 6 18 6 18 7 19 7 19 8 20 8 20 9 21 9 21 10 22 10 22 11 23 11"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/bolt-solid.svg
var bolt_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Bolt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="21 10 21 11 20 11 20 12 19 12 19 13 18 13 18 14 17 14 17 15 16 15 16 16 15 16 15 17 14 17 14 18 13 18 13 19 12 19 12 20 11 20 11 21 10 21 10 22 9 22 9 23 8 23 8 21 9 21 9 18 10 18 10 14 3 14 3 13 4 13 4 12 5 12 5 11 6 11 6 10 7 10 7 9 8 9 8 8 9 8 9 7 10 7 10 6 11 6 11 5 12 5 12 4 13 4 13 3 14 3 14 2 15 2 15 1 16 1 16 3 15 3 15 6 14 6 14 10 21 10"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/book-solid.svg
var book_solid_default = '<svg id="Book_Solid" data-name="Book Solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,2V1H4V2H3V3H2V21H3v1H4v1H21V22h1V21H21V20H20V17h1V16h1V2ZM18,21H5V20H4V18H5V17H18Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/bullet-list-solid.svg
var bullet_list_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Bullet_List" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="5" width="3" height="3"/><rect x="2" y="17" width="3" height="3"/><rect x="2" y="11" width="3" height="3"/><polygon points="23 6 23 7 22 7 22 8 10 8 10 7 9 7 9 6 10 6 10 5 22 5 22 6 23 6"/><polygon points="22 12 23 12 23 13 22 13 22 14 10 14 10 13 9 13 9 12 10 12 10 11 22 11 22 12"/><polygon points="22 18 23 18 23 19 22 19 22 20 10 20 10 19 9 19 9 18 10 18 10 17 22 17 22 18"/><g id="BG_copy_133"><rect width="24" height="24" fill="none"/></g></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/calender-solid.svg
var calender_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Calender" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="6" y="1" width="2" height="1"/><rect x="16" y="1" width="2" height="1"/><path d="m22,5v-1h-3v-2h-1v5h-2V2h-1v2h-6v-2h-1v5h-2V2h-1v2h-3v1h-1v17h1v1h20v-1h1V5h-1Zm-1,3v3h-3v-3h3Zm0,8h-3v-3h3v3Zm0,5h-3v-3h3v3Zm-18-3h3v3h-3v-3Zm0-5h3v3h-3v-3Zm13,3h-3v-3h3v3Zm-5,0h-3v-3h3v3Zm-3,2h3v3h-3v-3Zm5,0h3v3h-3v-3Zm3-7h-3v-3h3v3Zm-5-3v3h-3v-3h3Zm-5,3h-3v-3h3v3Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg
var check_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 5 23 6 22 6 22 7 21 7 21 8 20 8 20 9 19 9 19 10 18 10 18 11 17 11 17 12 16 12 16 13 15 13 15 14 14 14 14 15 13 15 13 16 12 16 12 17 11 17 11 18 10 18 10 19 8 19 8 18 7 18 7 17 6 17 6 16 5 16 5 15 4 15 4 14 3 14 3 13 2 13 2 12 1 12 1 11 2 11 2 10 3 10 3 9 4 9 4 10 5 10 5 11 6 11 6 12 7 12 7 13 8 13 8 14 10 14 10 13 11 13 11 12 12 12 12 11 13 11 13 10 14 10 14 9 15 9 15 8 16 8 16 7 17 7 17 6 18 6 18 5 19 5 19 4 20 4 20 3 21 3 21 4 22 4 22 5 23 5"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/clock-solid.svg
var clock_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Clock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-9,7v-1h-1v-1h-1V5h2v8h1v1h1v1h1v1h-1v1h-1v-1h-1Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/crown-solid.svg
var crown_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 7 23 9 22 9 22 10 21 10 21 14 20 14 20 17 19 17 19 19 18 19 18 21 6 21 6 19 5 19 5 17 4 17 4 14 3 14 3 10 2 10 2 9 1 9 1 7 2 7 2 6 4 6 4 7 5 7 5 9 4 9 4 10 5 10 5 11 6 11 6 12 8 12 8 11 9 11 9 9 10 9 10 7 11 7 11 6 10 6 10 4 11 4 11 3 13 3 13 4 14 4 14 6 13 6 13 7 14 7 14 9 15 9 15 11 16 11 16 12 18 12 18 11 19 11 19 10 20 10 20 9 19 9 19 7 20 7 20 6 22 6 22 7 23 7"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/external-link-solid.svg
var external_link_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="External_Link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 1 23 9 21 9 21 8 20 8 20 7 19 7 19 8 18 8 18 9 17 9 17 10 16 10 16 11 15 11 15 12 14 12 14 13 13 13 13 14 12 14 12 15 11 15 11 16 10 16 10 17 9 17 9 18 8 18 8 17 7 17 7 16 6 16 6 15 7 15 7 14 8 14 8 13 9 13 9 12 10 12 10 11 11 11 11 10 12 10 12 9 13 9 13 8 14 8 14 7 15 7 15 6 16 6 16 5 17 5 17 4 16 4 16 3 15 3 15 1 23 1"/><polygon points="20 15 20 22 19 22 19 23 2 23 2 22 1 22 1 5 2 5 2 4 11 4 11 7 4 7 4 20 17 20 17 15 20 15"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/eye-solid.svg
var eye_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="16 11 16 13 15 13 15 14 14 14 14 15 13 15 13 16 11 16 11 15 10 15 10 14 9 14 9 13 8 13 8 11 10 11 10 10 11 10 11 8 13 8 13 9 14 9 14 10 15 10 15 11 16 11"/><path d="m22,11v-2h-1v-1h-1v-1h-1v-1h-2v-1H7v1h-2v1h-1v1h-1v1h-1v2h-1v2h1v2h1v1h1v1h1v1h2v1h10v-1h2v-1h1v-1h1v-1h1v-2h1v-2h-1Zm-4,2h-1v2h-1v1h-1v1h-2v1h-2v-1h-2v-1h-1v-1h-1v-2h-1v-2h1v-2h1v-1h1v-1h2v-1h2v1h2v1h1v1h1v2h1v2Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/fire-solid.svg
var fire_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Fire" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m19,13v-3h-1v-1h-1v-3h-1v-2h-1v-1h-1v-1h-1v-1h-2v1h1v2h-1v2h-1v1h-1v1h-1v1h-1v1h-1v3h1v2h-1v-1h-1v-2h-1v2h-1v3h1v2h1v1h1v1h1v1h1v1h8v-1h1v-1h1v-1h1v-2h1v-5h-1Zm-2,7h-1v1h-2v1h-4v-1h-1v-4h1v-1h1v-1h1v-1h1v-3h-1v-1h-1v-1h1v1h2v2h1v5h-1v2h1v-1h1v-1h1v3Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/flag-checkered-solid.svg
var flag_checkered_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Flag_Checkered" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="22 4 22 16 21 16 21 17 19 17 19 18 13 18 13 17 6 17 6 16 12 16 12 12 6 12 6 13 5 13 5 17 6 17 6 18 5 18 5 22 3 22 3 5 2 5 2 3 3 3 3 2 5 2 5 3 6 3 6 5 5 5 5 6 6 6 6 5 13 5 13 6 19 6 19 7 14 7 14 11 19 11 19 10 21 10 21 6 19 6 19 5 21 5 21 4 22 4"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/laptop-code-solid.svg
var laptop_code_solid_default = '<svg id="Laptop_Code_Solid" data-name="Laptop Code Solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="3 14 3 5 4 5 4 4 20 4 20 5 21 5 21 14 19 14 19 6 5 6 5 14 3 14"/><polygon points="10 11 11 11 11 13 9 13 9 12 8 12 8 11 7 11 7 9 8 9 8 8 9 8 9 7 11 7 11 9 10 9 10 11"/><polygon points="14 9 13 9 13 7 15 7 15 8 16 8 16 9 17 9 17 11 16 11 16 12 15 12 15 13 13 13 13 11 14 11 14 9"/><polygon points="23 15 23 18 22 18 22 19 21 19 21 20 3 20 3 19 2 19 2 18 1 18 1 15 23 15"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/lightbulb-solid.svg
var lightbulb_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Lightbulb_On" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="1" width="1" height="1"/><rect x="3" y="2" width="1" height="1"/><rect x="4" y="3" width="1" height="1"/><rect x="1" y="16" width="1" height="1"/><rect x="2" y="15" width="1" height="1"/><rect x="3" y="14" width="1" height="1"/><rect x="22" y="16" width="1" height="1"/><rect x="21" y="15" width="1" height="1"/><rect x="20" y="14" width="1" height="1"/><rect x="21" y="1" width="1" height="1"/><rect x="20" y="2" width="1" height="1"/><rect x="19" y="3" width="1" height="1"/><rect x="1" y="8" width="2" height="1"/><polygon points="15 18 15 21 14 21 14 22 13 22 13 23 11 23 11 22 10 22 10 21 9 21 9 18 15 18"/><path d="m19,5h-1v-1h-1v-1h-1v-1h-2v-1h-4v1h-2v1h-1v1h-1v1h-1v2h-1v4h1v2h1v1h1v1h1v1h1v1h6v-1h1v-1h1v-1h1v-1h1v-2h1v-4h-1v-2Zm-12,2h1v-1h1v-1h1v-1h3v1h-3v1h-1v1h-1v2h-1v-2Z"/><rect x="21" y="8" width="2" height="1"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/location-pin-solid.svg
var location_pin_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Location_Pin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m19,6v-2h-1v-1h-1v-1h-2v-1h-6v1h-2v1h-1v1h-1v2h-1v6h1v2h1v1h1v2h1v1h1v2h1v1h1v2h2v-2h1v-1h1v-2h1v-1h1v-2h1v-1h1v-2h1v-6h-1Zm-5,5h-1v1h-2v-1h-1v-1h-1v-2h1v-1h1v-1h2v1h1v1h1v2h-1v1Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/lock-solid.svg
var lock_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Lock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m21,12v-1h-3v-6h-1v-2h-1v-1h-2v-1h-4v1h-2v1h-1v2h-1v6h-3v1h-1v10h1v1h18v-1h1v-10h-1Zm-6-1h-6v-6h1v-1h4v1h1v6Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/pen-nib-solid.svg
var pen_nib_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Pen_Nib" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 4 23 7 22 7 22 8 21 8 21 9 20 9 20 10 19 10 19 9 18 9 18 8 17 8 17 7 16 7 16 6 15 6 15 5 14 5 14 4 15 4 15 3 16 3 16 2 17 2 17 1 20 1 20 2 21 2 21 3 22 3 22 4 23 4"/><polygon points="18 11 19 11 19 12 18 12 18 15 17 15 17 18 16 18 16 19 14 19 14 20 11 20 11 21 8 21 8 22 5 22 5 23 3 23 3 22 4 22 4 21 5 21 5 20 6 20 6 19 7 19 7 18 8 18 8 17 9 17 9 16 12 16 12 13 11 13 11 12 8 12 8 15 7 15 7 16 6 16 6 17 5 17 5 18 4 18 4 19 3 19 3 20 2 20 2 21 1 21 1 19 2 19 2 16 3 16 3 13 4 13 4 10 5 10 5 8 6 8 6 7 9 7 9 6 12 6 12 5 13 5 13 6 14 6 14 7 15 7 15 8 16 8 16 9 17 9 17 10 18 10 18 11"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/pencil-ruler-solid.svg
var pencil_ruler_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="_24px_Grid_copy_56" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="2 7 1 7 1 5 2 5 2 4 3 4 3 3 4 3 4 2 5 2 5 1 7 1 7 2 8 2 8 4 7 4 7 5 6 5 6 6 7 6 7 7 8 7 8 6 9 6 9 5 11 5 11 6 10 6 10 7 9 7 9 8 8 8 8 9 7 9 7 10 6 10 6 11 5 11 5 10 4 10 4 9 3 9 3 8 2 8 2 7"/><polygon points="13 17 12 17 12 18 11 18 11 19 10 19 10 20 9 20 9 21 8 21 8 22 7 22 7 23 1 23 1 17 2 17 2 16 3 16 3 15 4 15 4 14 5 14 5 13 6 13 6 12 7 12 7 11 8 11 8 10 9 10 9 9 10 9 10 8 11 8 11 7 12 7 12 6 14 6 14 7 15 7 15 8 16 8 16 9 17 9 17 10 18 10 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17"/><polygon points="23 4 23 7 22 7 22 8 21 8 21 9 19 9 19 8 18 8 18 7 17 7 17 6 16 6 16 5 15 5 15 3 16 3 16 2 17 2 17 1 20 1 20 2 21 2 21 3 22 3 22 4 23 4"/><polygon points="22 17 23 17 23 19 22 19 22 20 21 20 21 21 20 21 20 22 19 22 19 23 17 23 17 22 16 22 16 21 15 21 15 20 14 20 14 19 13 19 13 18 14 18 14 17 15 17 15 16 16 16 16 15 17 15 17 14 18 14 18 13 19 13 19 15 18 15 18 16 17 16 17 17 18 17 18 18 19 18 19 17 20 17 20 16 22 16 22 17"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/play-solid.svg
var play_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="PLay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="22 11 22 13 21 13 21 14 20 14 20 15 18 15 18 16 16 16 16 17 15 17 15 18 13 18 13 19 11 19 11 20 10 20 10 21 8 21 8 22 6 22 6 23 3 23 3 22 2 22 2 2 3 2 3 1 6 1 6 2 8 2 8 3 10 3 10 4 11 4 11 5 13 5 13 6 15 6 15 7 16 7 16 8 18 8 18 9 20 9 20 10 21 10 21 11 22 11"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/question-circle-solid.svg
var question_circle_solid_default = '<svg id="Question-Circle_Solid" data-name="Question-Circle Solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,9V7H21V5H20V4H19V3H17V2H15V1H9V2H7V3H5V4H4V5H3V7H2V9H1v6H2v2H3v2H4v1H5v1H7v1H9v1h6V22h2V21h2V20h1V19h1V17h1V15h1V9ZM13,19H11V17h2Zm3-8H15v1H14v1H13v2H11V12h1V11h1V10h1V8H13V7H11V8H10V9H8V7H9V6h1V5h4V6h1V7h1Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/refresh-solid.svg
var refresh_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Refresh" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 14 23 15 22 15 22 17 21 17 21 19 20 19 20 20 19 20 19 21 17 21 17 22 15 22 15 23 9 23 9 22 7 22 7 21 5 21 5 20 3 20 3 21 2 21 2 22 1 22 1 14 9 14 9 15 8 15 8 16 7 16 7 18 8 18 8 19 10 19 10 20 14 20 14 19 16 19 16 18 17 18 17 17 18 17 18 15 19 15 19 14 23 14"/><polygon points="23 2 23 10 15 10 15 9 16 9 16 8 17 8 17 6 16 6 16 5 14 5 14 4 10 4 10 5 8 5 8 6 7 6 7 7 6 7 6 9 5 9 5 10 1 10 1 9 2 9 2 7 3 7 3 5 4 5 4 4 5 4 5 3 7 3 7 2 9 2 9 1 15 1 15 2 17 2 17 3 19 3 19 4 21 4 21 3 22 3 22 2 23 2"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/save-solid.svg
var save_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Save" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m22,7v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H2v1h-1v20h1v1h20v-1h1V7h-1Zm-13,12v-4h1v-1h4v1h1v4h-1v1h-4v-1h-1Zm7-9H4v-6h12v6Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/search-solid.svg
var search_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="16 17 15 17 15 18 13 18 13 19 7 19 7 18 5 18 5 17 4 17 4 16 3 16 3 15 2 15 2 13 1 13 1 7 2 7 2 5 3 5 3 4 4 4 4 3 5 3 5 2 7 2 7 1 13 1 13 2 15 2 15 3 16 3 16 4 17 4 17 5 18 5 18 7 19 7 19 13 18 13 18 15 17 15 17 16 16 16 16 17"/><polygon points="23 20 23 22 22 22 22 23 20 23 20 22 19 22 19 21 18 21 18 20 17 20 17 19 16 19 16 18 17 18 17 17 18 17 18 16 19 16 19 17 20 17 20 18 21 18 21 19 22 19 22 20 23 20"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/seedlings-solid.svg
var seedlings_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Seedlings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 11 13 11 13 22 11 22 11 15 7 15 7 14 5 14 5 13 4 13 4 12 3 12 3 10 2 10 2 8 1 8 1 5 6 5 6 6 8 6 8 7 10 7 10 8 11 8 11 9 12 9 12 11"/><polygon points="23 2 23 6 22 6 22 8 21 8 21 9 20 9 20 10 18 10 18 11 16 11 16 12 14 12 14 10 13 10 13 8 12 8 12 6 13 6 13 5 14 5 14 4 16 4 16 3 18 3 18 2 23 2"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/sitemap-solid.svg
var sitemap_solid_default = '<svg id="Sitemap_Solid" data-name="Sitemap Solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 17 23 21 22 21 22 22 18 22 18 21 17 21 17 17 18 17 18 16 19 16 19 13 13 13 13 16 14 16 14 17 15 17 15 21 14 21 14 22 10 22 10 21 9 21 9 17 10 17 10 16 11 16 11 13 5 13 5 16 6 16 6 17 7 17 7 21 6 21 6 22 2 22 2 21 1 21 1 17 2 17 2 16 3 16 3 12 4 12 4 11 11 11 11 8 9 8 9 2 15 2 15 8 13 8 13 11 20 11 20 12 21 12 21 16 22 16 22 17 23 17"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/sun-solid.svg
var sun_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="17 10 17 14 16 14 16 15 15 15 15 16 14 16 14 17 10 17 10 16 9 16 9 15 8 15 8 14 7 14 7 10 8 10 8 9 9 9 9 8 10 8 10 7 14 7 14 8 15 8 15 9 16 9 16 10 17 10"/><path d="m21,11v-1h1v-1h1v-2h-3v-1h-2v-2h-1V1h-2v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-2v3h-1v2h-2v1H1v2h1v1h1v1h1v2h-1v1h-1v1h-1v2h3v1h2v2h1v3h2v-1h1v-1h1v-1h2v1h1v1h1v1h2v-3h1v-2h2v-1h3v-2h-1v-1h-1v-1h-1v-2h1Zm-3,4h-1v1h-1v1h-1v1h-6v-1h-1v-1h-1v-1h-1v-6h1v-1h1v-1h1v-1h6v1h1v1h1v1h1v6Z"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/times-solid.svg
var times_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Times" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="15 13 16 13 16 14 17 14 17 15 18 15 18 16 19 16 19 17 20 17 20 18 21 18 21 19 22 19 22 20 21 20 21 21 20 21 20 22 19 22 19 21 18 21 18 20 17 20 17 19 16 19 16 18 15 18 15 17 14 17 14 16 13 16 13 15 11 15 11 16 10 16 10 17 9 17 9 18 8 18 8 19 7 19 7 20 6 20 6 21 5 21 5 22 4 22 4 21 3 21 3 20 2 20 2 19 3 19 3 18 4 18 4 17 5 17 5 16 6 16 6 15 7 15 7 14 8 14 8 13 9 13 9 11 8 11 8 10 7 10 7 9 6 9 6 8 5 8 5 7 4 7 4 6 3 6 3 5 2 5 2 4 3 4 3 3 4 3 4 2 5 2 5 3 6 3 6 4 7 4 7 5 8 5 8 6 9 6 9 7 10 7 10 8 11 8 11 9 13 9 13 8 14 8 14 7 15 7 15 6 16 6 16 5 17 5 17 4 18 4 18 3 19 3 19 2 20 2 20 3 21 3 21 4 22 4 22 5 21 5 21 6 20 6 20 7 19 7 19 8 18 8 18 9 17 9 17 10 16 10 16 11 15 11 15 13"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/translate-solid.svg
var translate_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Translate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="19 16 19 17 14 17 14 16 15 16 15 14 18 14 18 16 19 16"/><polygon points="22 5 22 6 21 6 21 7 20 7 20 8 18 8 18 7 17 7 17 6 16 6 16 5 18 5 18 4 17 4 17 3 16 3 16 2 19 2 19 3 20 3 20 5 22 5"/><path d="m22,10v-1h-11v1h-1v12h1v1h11v-1h1v-12h-1Zm-1,11h-2v-3h-5v3h-2v-5h1v-2h1v-1h1v-1h1v-1h1v1h1v1h1v1h1v2h1v5Z"/><polygon points="7 7 7 8 6 8 6 9 4 9 4 7 7 7"/><polygon points="14 2 14 8 12 8 12 6 11 6 11 5 9 5 9 6 8 6 8 4 12 4 12 3 3 3 3 4 7 4 7 6 6 6 6 5 4 5 4 6 3 6 3 10 4 10 4 11 6 11 6 10 7 10 7 13 8 13 8 8 9 8 9 7 11 7 11 8 10 8 10 9 9 9 9 15 2 15 2 14 1 14 1 2 2 2 2 1 13 1 13 2 14 2"/><polygon points="6 19 6 20 7 20 7 21 8 21 8 22 5 22 5 21 4 21 4 19 2 19 2 18 3 18 3 17 4 17 4 16 6 16 6 17 7 17 7 18 8 18 8 19 6 19"/></svg>';

// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid/trophy-solid.svg
var trophy_solid_default = '<?xml version="1.0" encoding="UTF-8"?><svg id="Trophy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m18,4v-2H6v2H1v5h1v2h1v1h1v1h1v1h1v1h3v1h2v3h-4v3h10v-3h-4v-3h2v-1h3v-1h1v-1h1v-1h1v-1h1v-2h1v-5h-5ZM5,12v-1h-1v-2h-1v-3h2v1h1v2h1v3h1v1h-2v-1h-1Zm16-3h-1v2h-1v1h-1v1h-2v-1h1v-2h1v-3h1v-1h2v3Z"/></svg>';

// src/ui/pixel.ts
var GRADE = 24;
var ICONES = {
  // conquistas
  sprout: seedlings_solid_default,
  flame: fire_solid_default,
  "flame-kindling": bolt_solid_default,
  hammer: pencil_ruler_solid_default,
  "book-open": book_solid_default,
  compass: location_pin_solid_default,
  clock: clock_solid_default,
  languages: translate_solid_default,
  castle: laptop_code_solid_default,
  flag: flag_checkered_solid_default,
  brain: lightbulb_solid_default,
  sun: sun_solid_default,
  crown: crown_solid_default,
  lock: lock_solid_default,
  // atributos e painéis
  "scroll-text": pen_nib_solid_default,
  repeat: question_circle_solid_default,
  "calendar-days": calender_solid_default,
  map: sitemap_solid_default,
  trophy: trophy_solid_default,
  // barra lateral e aba da ficha
  // botões
  play: play_solid_default,
  save: save_solid_default,
  x: times_solid_default,
  check: check_solid_default,
  eye: eye_solid_default,
  "arrow-right": arrow_right_solid_default,
  "external-link": external_link_solid_default,
  "rotate-ccw": refresh_solid_default,
  list: bullet_list_solid_default,
  search: search_solid_default
};
var cache = /* @__PURE__ */ new Map();
function caminhos(nome) {
  const svg = ICONES[nome];
  if (svg === void 0) return void 0;
  let ds = cache.get(nome);
  if (!ds) cache.set(nome, ds = svgParaCaminhos(svg));
  return ds;
}
function svgParaObsidian(nome) {
  const ds = caminhos(nome);
  if (!ds) return void 0;
  const escala = 100 / GRADE;
  return `<g transform="scale(${escala})" fill="currentColor" stroke="none" shape-rendering="crispEdges">${ds.map((d) => `<path d="${d}"/>`).join("")}</g>`;
}
var SVG = "http://www.w3.org/2000/svg";
function desenharPixel(el, nome) {
  const ds = caminhos(nome);
  if (!ds) return false;
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${GRADE} ${GRADE}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("erpg-px");
  for (const d of ds) {
    const path = document.createElementNS(SVG, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
  }
  el.appendChild(svg);
  return true;
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
    this.numero(el, "Notas novas por dia na revis\xE3o (0 = sem limite)", s.novasPorDia, 0, 500, async (n) => {
      s.novasPorDia = n;
      await salvar();
    });
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
var TECLAS = {
  espaco: { rotulo: "Espa\xE7o", aria: "Space" },
  seta: { rotulo: "\u2192", aria: "ArrowRight" },
  "1": { rotulo: "1", aria: "1" },
  "2": { rotulo: "2", aria: "2" },
  a: { rotulo: "A", aria: "A" },
  b: { rotulo: "B", aria: "B" },
  c: { rotulo: "C", aria: "C" },
  d: { rotulo: "D", aria: "D" },
  e: { rotulo: "E", aria: "E" }
};
function icone(parent, nome, cls = "erpg-ico") {
  const span = parent.createSpan({ cls });
  if (!desenharPixel(span, nome)) (0, import_obsidian2.setIcon)(span, nome);
  return span;
}
function botao(parent, texto, onClick, opts = {}) {
  const attr2 = opts.titulo ? { "aria-label": opts.titulo, title: opts.titulo } : {};
  if (opts.atalho) Object.assign(attr2, { "data-atalho": opts.atalho, "aria-keyshortcuts": TECLAS[opts.atalho].aria });
  const b = parent.createEl("button", { cls: `erpg-btn is-${opts.variante ?? "primario"}${opts.pequeno ? " is-sm" : ""}`, attr: attr2 });
  if (opts.icone) icone(b, opts.icone);
  if (texto) b.createSpan({ text: texto });
  else b.addClass("is-icone");
  if (opts.atalho) b.createSpan({ cls: "erpg-tecla", text: TECLAS[opts.atalho].rotulo, attr: { "aria-hidden": "true" } });
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
  const moldura = sec.createDiv({ cls: "erpg-brasao-moldura" });
  const brasao = moldura.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `N\xEDvel ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nv" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });
  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  const nome = id.createDiv({ cls: "erpg-titulo-linha" });
  nome.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const proxTitulo = settings.titulos[Math.min(prog.nivel, settings.titulos.length - 1)];
  if (proxTitulo && proxTitulo !== prog.titulo) nome.createSpan({ cls: "erpg-titulo-prox", text: `pr\xF3ximo: ${proxTitulo}` });
  const p = prog.partes;
  const origemXP = `De onde vem o XP \u2014 notas ${p.notas} \xB7 t\xF3picos ${p.topicos} \xB7 dias ${p.diario} \xB7 tempo ${p.estudo} \xB7 revis\xF5es ${p.revisao}`;
  const xp = id.createDiv({ cls: "erpg-xp", attr: { title: origemXP } });
  const xpCab = xp.createDiv({ cls: "erpg-xp-cab" });
  xpCab.createSpan({ cls: "erpg-xp-rot", text: "XP" });
  xpCab.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo}` });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experi\xEAncia at\xE9 o pr\xF3ximo n\xEDvel");
  xp.createDiv({ cls: "erpg-xp-falta", text: `faltam ${Math.max(0, prog.xpProximo - prog.xp)} XP para o n\xEDvel ${prog.nivel + 1}` });
  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic, valor, rot, cor, zero, dica = `${valor} ${rot}`) => {
    const a = st.createDiv({ cls: `erpg-atributo is-${cor}${zero ? " is-zero" : ""}`, attr: { title: dica } });
    icone(a, ic, "erpg-ico erpg-atributo-ico");
    const t = a.createDiv({ cls: "erpg-atributo-txt" });
    t.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    t.createSpan({ cls: "erpg-atributo-rot", text: rot });
    return a;
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", "chama", !prog.sequencia, `Sequ\xEAncia atual: ${prog.sequencia} \xB7 recorde: ${prog.maiorSequencia}`);
  if (settings.metaSemanalMin > 0) {
    const ok = prog.minutosSemana >= settings.metaSemanalMin;
    const a = atributo("clock", `${prog.minutosSemana}/${settings.metaSemanalMin}`, "min na semana", ok ? "ok" : "meta", !prog.minutosSemana, `Meta semanal: ${prog.minutosSemana} de ${settings.metaSemanalMin} min \xB7 hoje ${prog.minutosHoje} min`);
    barra(a, prog.minutosSemana / settings.metaSemanalMin, "erpg-barra is-meta", "Meta semanal de minutos");
  }
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas", "escrito", !prog.contagemNivel.escrito);
  atributo("hammer", prog.contagemNivel.praticado, "praticadas", "praticado", !prog.contagemNivel.praticado);
  atributo("castle", prog.contagemNivel.projeto, "em projeto", "projeto", !prog.contagemNivel.projeto);
  medalhas(sec, ctx);
  sessao(sec.createDiv({ cls: "erpg-ficha-acao" }), ctx);
}
function sessao(acao, ctx) {
  const inicio = ctx.acoes.sessaoInicio();
  const { xp } = ctx.settings;
  if (inicio) {
    acao.addClass("is-rodando");
    const b = botao(acao, "Encerrar", () => ctx.acoes.encerrarSessao(), { icone: "save", titulo: `Encerrar e somar os minutos no di\xE1rio (+${xp.dezMinutos} XP a cada 10 min)` });
    b.createSpan({ cls: "erpg-timer", attr: { "data-erpg-timer": "" }, text: relogio(Date.now() - inicio) });
    botao(acao, "", () => {
      if (Date.now() - inicio >= 6e4 && !window.confirm("Descartar a sess\xE3o? Os minutos n\xE3o v\xE3o contar.")) return;
      return ctx.acoes.descartarSessao();
    }, { icone: "x", variante: "discreto", pequeno: true, titulo: "Descartar a sess\xE3o (n\xE3o conta)" });
  } else {
    botao(acao, "Iniciar sess\xE3o", () => ctx.acoes.iniciarSessao(), { icone: "play", titulo: `Cronometra o estudo \xB7 +${xp.dezMinutos} XP a cada 10 min${ctx.prog.estudouHoje ? "" : ` e +${xp.diario} XP pelo dia`}` });
  }
  botao(acao, "", () => ctx.acoes.abrirDiario(), { icone: "book-open", variante: "secundario", pequeno: true, titulo: "Abrir o di\xE1rio de hoje" });
}
function descConquista(c) {
  return `${c.nome} \xB7 ${RARIDADE[c.raridade]}
${c.desc}
${c.ok ? "\u2713 Conquistado" : `Progresso: ${c.atual}/${c.meta}`}`;
}
function medalhas(parent, ctx) {
  const total = ctx.conquistas.length;
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const prox = proximaConquista(ctx.conquistas);
  const rotulo2 = `Conquistas: ${ok} de ${total}${prox ? `. Pr\xF3xima: ${prox.nome}, ${prox.atual} de ${prox.meta}` : ""}. Abrir a lista.`;
  const box = parent.createEl("button", { cls: "erpg-medalhas", attr: { "aria-label": rotulo2, title: prox ? descConquista(prox) : "Todas as conquistas!" } });
  box.addEventListener("click", () => ctx.acoes.abrirConquistas());
  const m = box.createDiv({ cls: `erpg-medalha is-${prox?.raridade ?? "lendario"}${prox ? "" : " is-ok"}` });
  m.style.setProperty("--p", `${prox ? Math.round(prox.atual / prox.meta * 100) : 100}%`);
  icone(m, prox?.icone ?? "crown");
  const info = box.createDiv({ cls: "erpg-medalhas-info" });
  info.createDiv({ cls: "erpg-rotulo", text: `Conquistas ${ok}/${total}` });
  if (prox) {
    const linha = info.createDiv({ cls: "erpg-linha" });
    linha.createSpan({ cls: "erpg-medalhas-nome", text: prox.nome });
    barra(linha, prox.atual / prox.meta, "erpg-barra", `Progresso de ${prox.nome}`);
    linha.createSpan({ cls: "erpg-num", text: `${prox.atual}/${prox.meta}` });
  } else info.createDiv({ cls: "erpg-medalhas-nome", text: "Todas conquistadas!" });
}
function proximaConquista(cs) {
  const ordem = ["comum", "raro", "epico", "lendario"];
  return cs.filter((c) => !c.ok).sort((a, b) => b.atual / b.meta - a.atual / a.meta || ordem.indexOf(a.raridade) - ordem.indexOf(b.raridade))[0];
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
function dicaCaixa(caixa, intervalos) {
  return `Caixa ${caixa} da revis\xE3o espa\xE7ada: quanto maior a caixa, mais longe a pr\xF3xima revis\xE3o (esta volta a cada ${intervalos[caixa] ?? "?"} dia(s)).`;
}
var LETRAS_ATALHO = ["a", "b", "c", "d", "e"];
function alternativas(parent, ctx, alts, correta, origem) {
  const { estado } = ctx;
  const respondida = estado.escolha !== null;
  const lista = parent.createDiv({ cls: "erpg-alternativas", attr: { role: "group", "aria-label": "Alternativas" } });
  alts.forEach((alt, k) => {
    const letra = String.fromCharCode(97 + k);
    let cls = "erpg-alt";
    if (respondida && k === correta) cls += " is-certa";
    else if (respondida && k === estado.escolha) cls += " is-errada";
    const atalho = LETRAS_ATALHO[k];
    const attr2 = { "aria-label": `Alternativa ${letra}` };
    if (atalho && !respondida) Object.assign(attr2, { "data-atalho": atalho, "aria-keyshortcuts": atalho.toUpperCase() });
    const b = lista.createEl("button", { cls, attr: attr2 });
    b.disabled = respondida;
    b.createSpan({ cls: "erpg-alt-letra", text: letra.toUpperCase() });
    md(ctx, b.createSpan({ cls: "erpg-alt-texto" }), alt, origem);
    b.addEventListener("click", () => {
      estado.escolha = k;
      estado.mostrarResposta = true;
      ctx.acoes.redesenhar();
    });
  });
}
function revisao(root, ctx) {
  const { snap, settings, estado } = ctx;
  const { hoje: fila, adiadas } = ctx.fila;
  const qtdPerguntas = (caminho) => snap.perguntas.filter((p) => p.caminho === caminho).length;
  const pos = estado.revisando ? fila.findIndex((x) => x.n.caminho === estado.revisando) : -1;
  if (estado.revisando && pos < 0) estado.revisando = null;
  const depois = adiadas ? ` \xB7 +${adiadas} depois` : "";
  const sub = !fila.length ? void 0 : pos >= 0 ? `${pos + 1} de ${fila.length} hoje` : `Hoje: ${fila.length}${depois}`;
  const corpo = painel(root, "repeat", "Revisar", sub, "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  if (!fila.length) {
    if (adiadas) {
      vazio(corpo, "Revis\xF5es de hoje feitas!", `Mais ${adiadas} ${adiadas === 1 ? "nota nova entra" : "notas novas entram"} nos pr\xF3ximos dias (${settings.novasPorDia} por dia, em Configura\xE7\xF5es).`);
      return;
    }
    const prox = snap.notas.map((n) => infoRevisao(n, snap.hoje, settings.intervalos).proxima).filter((x) => !!x).sort()[0];
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
    corpo.createDiv(atual.revisado ? { cls: "erpg-meta", text: `caixa ${atual.caixa} \xB7 revisada ${relativo(atual.revisado, snap.hoje)}`, attr: { title: dicaCaixa(atual.caixa, settings.intervalos) } } : { cls: "erpg-meta", text: "primeira revis\xE3o" });
    if (perguntas.length) {
      const i = Math.min(estado.perguntaIdx, perguntas.length - 1);
      const p = perguntas[i];
      const area = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      area.createDiv({ cls: "erpg-subtitulo", text: `Pergunta ${i + 1} de ${perguntas.length}` });
      md(ctx, area.createDiv({ cls: "erpg-pergunta" }), p.pergunta, n.caminho);
      if (p.alternativas?.length) alternativas(area, ctx, p.alternativas, p.correta, n.caminho);
      if (estado.mostrarResposta) {
        const resp = area.createDiv({ cls: "erpg-resposta" });
        const { escolha } = estado;
        if (escolha !== null && p.correta !== void 0) {
          const acertou = escolha === p.correta;
          resp.createDiv({ cls: `erpg-veredito-alt ${acertou ? "is-certa" : "is-errada"}`, text: acertou ? "Acertou!" : `Errou. A certa \xE9 a ${String.fromCharCode(97 + p.correta)})` });
        }
        md(ctx, resp.createDiv(), p.resposta, n.caminho);
      }
      const row = corpo.createDiv({ cls: "erpg-acoes" });
      botao(row, estado.mostrarResposta ? "Esconder" : "Ver resposta", () => {
        estado.mostrarResposta = !estado.mostrarResposta;
        ctx.acoes.redesenhar();
      }, { icone: "eye", pequeno: true, variante: "secundario", atalho: "espaco" });
      if (i < perguntas.length - 1) botao(row, "Pr\xF3xima pergunta", () => {
        estado.perguntaIdx = i + 1;
        estado.mostrarResposta = false;
        estado.escolha = null;
        ctx.acoes.redesenhar();
      }, { icone: "arrow-right", pequeno: true, variante: "secundario", atalho: "seta" });
    } else {
      const v = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      vazio(v, "Essa nota n\xE3o tem perguntas.", "Abra, releia e diga se lembrou. Para se testar aqui, adicione na nota callouts \u201C> [!question]- Pergunta\u201D com a resposta embaixo.");
      botao(corpo.createDiv({ cls: "erpg-acoes" }), "Abrir nota", (ev) => ctx.acoes.abrirNota(n.caminho, ev.ctrlKey || ev.metaKey), { icone: "external-link", pequeno: true, variante: "secundario" });
    }
    ornamento(corpo);
    const caixaSeLembrar = aposLembrar({ caixa: n.caixa, revisado: n.revisado }, settings.intervalos);
    const dias = settings.intervalos[caixaSeLembrar] ?? "?";
    const fim = corpo.createDiv({ cls: "erpg-acoes erpg-veredito" });
    botao(fim, `Lembrei \xB7 ${dias}d`, () => ctx.acoes.revisar(n, true, proxima), { icone: "check", titulo: `Sobe para a caixa ${caixaSeLembrar}: volta em ${dias} dia(s)`, atalho: "1" });
    botao(fim, "Esqueci \xB7 1d", () => ctx.acoes.revisar(n, false, proxima), { icone: "rotate-ccw", variante: "secundario", titulo: "Volta para a caixa 1: revisa amanh\xE3", atalho: "2" });
    const nav = fim.createDiv({ cls: "erpg-veredito-nav" });
    if (proxima) botao(nav, "Pular", () => ctx.acoes.revisarNota(proxima), { variante: "discreto", pequeno: true, titulo: "Deixa esta para depois (continua na fila)" });
    botao(nav, "Fila", () => ctx.acoes.revisarNota(null), { icone: "list", variante: "discreto", pequeno: true, titulo: "Voltar para a lista" });
    return;
  }
  const topo = corpo.createDiv({ cls: "erpg-acoes" });
  const total = fila.reduce((a, x) => a + qtdPerguntas(x.n.caminho), 0);
  botao(topo, "Come\xE7ar revis\xE3o", () => ctx.acoes.revisarNota(fila[0].n.caminho), { icone: "play" });
  if (total) topo.createSpan({ cls: "erpg-dica", text: `${total} ${total === 1 ? "pergunta" : "perguntas"} pra se testar` });
  const lista = corpo.createDiv({ cls: "erpg-revisoes erpg-rola" });
  for (const x of fila) {
    const q = qtdPerguntas(x.n.caminho);
    const quando = x.revisado ? `caixa ${x.caixa} \xB7 ${relativo(x.revisado, snap.hoje)}` : "nova";
    const meta = q ? `${quando} \xB7 ${q} ${q === 1 ? "pergunta" : "perguntas"}` : quando;
    const attr2 = { "aria-label": `Revisar ${x.n.label} (${meta})` };
    if (x.revisado) attr2.title = dicaCaixa(x.caixa, settings.intervalos);
    const row = lista.createEl("button", { cls: "erpg-revisao", attr: attr2 });
    row.addEventListener("click", () => ctx.acoes.revisarNota(x.n.caminho));
    row.createSpan({ cls: "erpg-revisao-nome", text: x.n.label });
    row.createSpan({ cls: "erpg-meta", text: meta });
  }
  if (adiadas) lista.createDiv({ cls: "erpg-dica erpg-revisoes-fim", text: `+${adiadas} ${adiadas === 1 ? "nota nova entra" : "notas novas entram"} nos pr\xF3ximos dias (${settings.novasPorDia} por dia).` });
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
  if (nota) {
    const pe = corpo.createDiv({ cls: "erpg-topico-pe" });
    pe.createSpan({ cls: `erpg-nivel is-${nota.nivel}`, text: NOME_NIVEL[nota.nivel] });
    if (nota.tempo) pe.createSpan({ cls: "erpg-tempo", text: `\u23F1\uFE0F ${nota.tempo}`, attr: { title: `Estudar ${nota.label} do zero: ${nota.tempo}` } });
    if (nota.tempoRever) pe.createSpan({ cls: "erpg-tempo is-rever", text: `\u{1F501} rever ${nota.tempoRever}`, attr: { title: `J\xE1 estudou ${nota.label}? Pra rever: ${nota.tempoRever}` } });
  }
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
var ICONE_FICHA = "estudos-rpg-icone";
var FichaView = class _FichaView extends import_obsidian6.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  plugin;
  estado = { revisando: null, perguntaIdx: 0, mostrarResposta: false, escolha: null, trilha: null };
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
    return ICONE_FICHA;
  }
  async onOpen() {
    this.contentEl.addClass("erpg-host");
    this.desinscrever = this.plugin.aoAtualizar(() => this.desenhar());
    this.desenhar();
    this.registerInterval(window.setInterval(() => tique(this.contentEl, this.plugin.sessaoInicio), 1e3));
    this.registerDomEvent(document, "keydown", (ev) => this.atalho(ev));
  }
  /**
   * Atalhos da revisão (Espaço, →, 1, 2, A-E nas alternativas). Cada botão que aceita atalho tem `data-atalho`;
   * aqui só "clicamos" nele, então a regra fica num lugar só (sections.ts).
   * E se o foco estiver num campo, num botão ou numa janela? Não rouba a tecla.
   */
  atalho(ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
    if (this.app.workspace.getActiveViewOfType(_FichaView) !== this) return;
    if (document.body.querySelector(".modal-container")) return;
    const alvo = ev.target instanceof Element ? ev.target : null;
    if (alvo?.closest("input, textarea, select, [contenteditable=true]")) return;
    const tecla = ev.key === " " ? "espaco" : ev.key === "ArrowRight" ? "seta" : ev.key.toLowerCase();
    if (tecla === "espaco" && alvo?.closest("button, a")) return;
    const botao2 = this.contentEl.querySelector(`[data-atalho="${tecla}"]`);
    if (!botao2 || botao2.disabled) return;
    ev.preventDefault();
    botao2.click();
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
      conquistas: dados.conquistas,
      fila: this.plugin.filaHoje()
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
      await this.plugin.contarRevisao(!n.revisado);
      new import_obsidian6.Notice(lembrou ? `${n.label}: caixa ${caixa}, volta em ${intervalos[caixa] ?? "?"} dia(s).` : `${n.label} volta amanh\xE3.`);
      Object.assign(this.estado, { revisando: proxima, perguntaIdx: 0, mostrarResposta: false, escolha: null });
      await this.plugin.atualizarAgora();
    },
    revisarNota: (caminho) => {
      Object.assign(this.estado, { revisando: caminho, perguntaIdx: 0, mostrarResposta: false, escolha: null });
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
var ALTERNATIVA = /^-\s+([a-z])\)\s+(.*)$/;
var juntar = (linhas) => linhas.join(" ").replace(/\s+/g, " ").trim();
function parsePerguntas(texto) {
  const out = [];
  const re = /^> \[!question\][-+]?[ \t]*(.+)\n((?:>.*(?:\n|$))*)/gm;
  const t = texto.replace(/\r\n/g, "\n");
  let m;
  while (m = re.exec(t)) {
    const pergunta = (m[1] ?? "").trim();
    const corpo = (m[2] ?? "").split("\n").map((l) => l.replace(/^>\s?/, ""));
    const alternativas2 = corpo.map((l) => l.match(ALTERNATIVA)?.[2]?.trim()).filter((x) => !!x);
    let resposta;
    let correta;
    if (alternativas2.length) {
      const explicacao = corpo.filter((l) => /^>/.test(l) && !/^>\s?\[!/.test(l)).map((l) => l.replace(/^>\s?/, ""));
      resposta = juntar(explicacao);
      const letra = resposta.match(/^\**([a-z])\)/)?.[1];
      const idx = letra ? letra.charCodeAt(0) - 97 : -1;
      if (idx >= 0 && idx < alternativas2.length) correta = idx;
    } else {
      resposta = juntar(corpo);
    }
    if (!pergunta || /^\[.*\]$/.test(pergunta) || !resposta || /^\[.*\]$/.test(resposta)) continue;
    out.push(alternativas2.length ? { pergunta, resposta, alternativas: alternativas2, ...correta !== void 0 && { correta } } : { pergunta, resposta });
  }
  return out;
}
function parseTempo(texto) {
  return valorEmNegrito(texto, /^\*\*(?:⏱️?\s*)?Quanto tempo:\s*([^*\n]+?)\s*\*\*/mu);
}
function parseTempoRever(texto) {
  return valorEmNegrito(texto, /^\*\*(?:🔁\s*)?Pra rever:\s*([^*\n]+?)\s*\*\*/mu);
}
function valorEmNegrito(texto, re) {
  const t = (texto.match(re)?.[1] ?? "").replace(/^cerca de\s+/i, "").replace(/\.$/, "").trim();
  return t || null;
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
  /** Cache do que vem do corpo da nota (perguntas e tempo): só relê o arquivo se ele mudou. */
  cacheCorpo = /* @__PURE__ */ new Map();
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
    const notas = [];
    const perguntas = [];
    for (const { f, fm, nivel } of candidatasEstudo) {
      const lido = await this.lerCorpo(f);
      perguntas.push(...lido.perguntas);
      notas.push({
        caminho: f.path,
        label: rotulo(f),
        nivel,
        caixa: normalizarCaixa(fm.caixa, s.intervalos),
        revisado: parseISO(fm.revisado),
        area: areaPorCaminho.get(f.path) ?? null,
        tempo: lido.tempo,
        tempoRever: lido.tempoRever
      });
    }
    trilhas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    notas.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    return { hoje, trilhas, notas, perguntas, diario };
  }
  /** Esquece arquivos apagados/renomeados do cache. */
  esquecer(caminho) {
    this.cacheCorpo.delete(caminho);
  }
  /** Perguntas e tempo de estudo do corpo da nota. Só relê o arquivo se ele mudou. */
  async lerCorpo(f) {
    const c = this.cacheCorpo.get(f.path);
    if (c && c.mtime === f.stat.mtime) return c;
    const texto = await this.app.vault.cachedRead(f);
    const lido = {
      mtime: f.stat.mtime,
      perguntas: parsePerguntas(texto).map((p) => ({ ...p, caminho: f.path, nota: rotulo(f) })),
      tempo: parseTempo(texto),
      tempoRever: parseTempoRever(texto)
    };
    this.cacheCorpo.set(f.path, lido);
    return lido;
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
  /** Quantas notas NOVAS (nunca revisadas) já foram revisadas no dia `dia`. Salvo no data.json. */
  novas = { dia: "", qtd: 0 };
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
    const nv = salvo?.novasHoje;
    if (nv && typeof nv.dia === "string" && typeof nv.qtd === "number" && nv.qtd >= 0) this.novas = { dia: nv.dia, qtd: Math.floor(nv.qtd) };
    this.indexer = new Indexer(this.app, () => this.config);
    this.writer = new Writer(this.app, () => this.config);
    this.registerView(VIEW_FICHA, (leaf) => new FichaView(leaf, this));
    (0, import_obsidian9.addIcon)(ICONE_FICHA, svgParaObsidian("trophy") ?? "");
    this.addRibbonIcon(ICONE_FICHA, "Abrir a ficha do her\xF3i", () => this.abrirFicha());
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
    const ajustarPixel = () => document.body.style.setProperty("--erpg-px", `${pixelDoIcone(window.devicePixelRatio)}px`);
    ajustarPixel();
    this.registerDomEvent(window, "resize", ajustarPixel);
    this.app.workspace.onLayoutReady(async () => {
      await this.atualizarAgora();
      if (this.config.abrirAoIniciar) await this.abrirFicha();
    });
  }
  onunload() {
    document.body.style.removeProperty("--erpg-px");
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
    await this.saveData({ ...this.config, sessaoInicio: this.sessaoInicio, novasHoje: this.novas });
  }
  // ------------------------------------------------------------ revisão: limite de notas novas por dia
  /** Notas novas já revisadas hoje (vira 0 sozinho quando o dia muda). */
  novasFeitasHoje() {
    return this.novas.dia === this.hoje() ? this.novas.qtd : 0;
  }
  /** Chamado depois de gravar uma revisão: se a nota era nova, conta no limite do dia. */
  async contarRevisao(eraNova) {
    if (!eraNova) return;
    this.novas = { dia: this.hoje(), qtd: this.novasFeitasHoje() + 1 };
    await this.persistir();
  }
  /** A fila de hoje (vencidas + novas até o limite), na ordem de revisão. */
  filaHoje() {
    const d = this.dados;
    if (!d) return { hoje: [], adiadas: 0 };
    const vencidas = ordenarFila(d.snap.notas.map((n) => ({ n, ...infoRevisao(n, d.snap.hoje, this.config.intervalos) })).filter((x) => x.vencida));
    return filaDoDia(vencidas, this.config.novasPorDia, this.novasFeitasHoje());
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
        const prox = this.filaHoje().hoje[0];
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
      await this.contarRevisao(!estado.revisado);
      new import_obsidian9.Notice(lembrou ? `Caixa ${caixa}: volta em ${this.config.intervalos[caixa] ?? "?"} dia(s).` : "Volta amanh\xE3.");
    };
    naNota("lembrei", "Revis\xE3o: lembrei desta nota", revisarAtual(true));
    naNota("esqueci", "Revis\xE3o: esqueci desta nota", revisarAtual(false));
  }
};

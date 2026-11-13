// Testes das regras do jogo (sem Obsidian). Rodar: npm test
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDias, diaDaSemana, diffDias, parseISO, relativo } from "../src/domain/dates.ts";
import { parsePerguntas, parseTrilha, alternarCheckbox, limparTitulo } from "../src/domain/parse.ts";
import { CONQUISTAS, calcularProgresso, maiorSequencia, nivelPara, sequencia, avaliarConquistas } from "../src/domain/progress.ts";
import { aposLembrar, infoRevisao, normalizarCaixa } from "../src/domain/review.ts";
import type { Snapshot } from "../src/domain/types.ts";
import { DEFAULT_SETTINGS, mergeSettings } from "../src/settings.ts";

const INT = [0, 1, 3, 7, 14, 30, 60];

describe("datas", () => {
  it("valida e normaliza", () => {
    assert.equal(parseISO("2026-11-11"), "2026-11-11");
    assert.equal(parseISO("2026-11-11T10:00"), "2026-11-11");
    assert.equal(parseISO("2026-02-30"), null);
    assert.equal(parseISO("ontem"), null);
    assert.equal(parseISO(undefined), null);
  });
  it("soma dias atravessando mês e ano", () => {
    assert.equal(addDias("2026-12-31", 1), "2027-01-01");
    assert.equal(diffDias("2026-11-01", "2026-11-11"), 10);
    assert.equal(relativo("2026-11-12", "2026-11-11"), "amanhã");
    assert.equal(diaDaSemana("2026-11-09"), 0); // segunda
    assert.equal(diaDaSemana("2026-11-15"), 6); // domingo
  });
});

describe("parse", () => {
  const trilha = [
    "---", "tipo: trilha", "---",
    "# 🗺️ Roadmap", "> intro",
    "# 1️⃣ Ferramentas ⭐", "> O ferramental.",
    "- [x] [[VS Code]] — editor.",
    "- [ ] [[pasta/Bash/README|Bash]] — shell.",
    "- [ ] sem link nenhum",
    "```", "- [ ] [[Dentro de código]]", "```",
    "## 🔸 Inglês", "- [ ] [[Phrasal Verbs]]",
  ].join("\n");

  it("lê regiões e tópicos, ignora código e linhas sem link", () => {
    const r = parseTrilha(trilha, (a) => (a === "VS Code" ? "VsCode/README.md" : null));
    assert.deepEqual(r.map((x) => x.nome), ["Ferramentas", "Inglês"]);
    assert.equal(r[0]?.destaque, true);
    assert.equal(r[0]?.desc, "O ferramental.");
    assert.equal(r[0]?.topicos.length, 2);
    assert.equal(r[0]?.topicos[0]?.caminho, "VsCode/README.md");
    assert.equal(r[0]?.topicos[1]?.label, "Bash");
    assert.equal(r[1]?.nivelTitulo, 2);
    assert.equal(r[1]?.grupo, "Ferramentas"); // a região ## herda o último #
  });

  it("estágios (#) agrupam módulos (##) e somem do mapa se não tiverem tópicos próprios", () => {
    const r = parseTrilha(["# 🌱 Estágio 1 · Base", "> 🎯 Objetivo", "## Git", "- [ ] [[Git Básico]]", "## Fundamentos", "- [ ] [[Funções]]"].join("\n"), () => null);
    assert.deepEqual(r.map((x) => [x.nome, x.grupo]), [["Git", "Estágio 1 · Base"], ["Fundamentos", "Estágio 1 · Base"]]);
  });

  it("lê perguntas e ignora placeholders do template", () => {
    const p = parsePerguntas(["> [!question]- O que é `ls`?", "> lista arquivos", "", "> [!question]- [Pergunta 1]", "> [Resposta]"].join("\n"));
    assert.deepEqual(p, [{ pergunta: "O que é `ls`?", resposta: "lista arquivos" }]);
  });

  it("alterna checkbox e limpa títulos", () => {
    assert.equal(alternarCheckbox("- [ ] a"), "- [x] a");
    assert.equal(alternarCheckbox("- [X] a"), "- [ ] a");
    assert.equal(limparTitulo("2️⃣9️⃣ IA no Desenvolvimento ⭐🧭"), "IA no Desenvolvimento");
  });
});

describe("revisão", () => {
  it("nunca revisada está vencida", () => {
    assert.equal(infoRevisao({ caixa: 0, revisado: null }, "2026-11-11", INT).vencida, true);
  });
  it("caixa 2 revisada há 3 dias vence hoje; há 2, não", () => {
    assert.equal(infoRevisao({ caixa: 2, revisado: "2026-11-08" }, "2026-11-11", INT).vencida, true);
    assert.equal(infoRevisao({ caixa: 2, revisado: "2026-11-09" }, "2026-11-11", INT).vencida, false);
  });
  it("lembrar sobe até o limite; primeira revisão entra na caixa 1", () => {
    assert.equal(aposLembrar({ caixa: 0, revisado: null }, INT), 1);
    assert.equal(aposLembrar({ caixa: 3, revisado: "2026-11-01" }, INT), 4);
    assert.equal(aposLembrar({ caixa: 6, revisado: "2026-11-01" }, INT), 6);
  });
  it("caixa inválida vira 0 e caixa enorme é limitada", () => {
    assert.equal(normalizarCaixa("abc", INT), 0);
    assert.equal(normalizarCaixa(99, INT), 6);
  });
});


describe("progresso", () => {
  it("curva de nível", () => {
    assert.deepEqual(nivelPara(0), { nivel: 1, base: 0, proximo: 100 });
    assert.deepEqual(nivelPara(380), { nivel: 3, base: 300, proximo: 600 });
  });
  it("sequência conta até ontem se hoje ainda não estudou", () => {
    const dias = new Set(["2026-11-09", "2026-11-10"]);
    assert.equal(sequencia(dias, "2026-11-11"), 2);
    dias.add("2026-11-11");
    assert.equal(sequencia(dias, "2026-11-11"), 3);
    assert.equal(sequencia(new Set(["2026-11-05"]), "2026-11-11"), 0);
  });
  it("vault vazio não quebra", () => {
    const vazio: Snapshot = { hoje: "2026-11-11", trilhas: [], notas: [], perguntas: [], diario: new Map() };
    const p = calcularProgresso(vazio, DEFAULT_SETTINGS.xp, DEFAULT_SETTINGS.titulos);
    assert.equal(p.xp, 0);
    assert.equal(p.titulo, "Aprendiz");
    assert.ok(avaliarConquistas(vazio, p, { caixaFinal: 6 }).every((c) => !c.ok));
  });
  it("maior sequência da história", () => {
    assert.equal(maiorSequencia(new Set()), 0);
    assert.equal(maiorSequencia(new Set(["2026-10-01", "2026-10-02", "2026-10-03", "2026-11-10"])), 3);
  });
  it("XP de tempo conta blocos de 10 min por dia; minutos da semana começam na segunda", () => {
    const dia = (data: string, minutos: number) => [data, { data, caminho: data + ".md", minutos }] as const;
    const s: Snapshot = { hoje: "2026-11-12", trilhas: [], notas: [], perguntas: [], diario: new Map([dia("2026-11-08", 60), dia("2026-11-09", 25), dia("2026-11-12", 9)]) };
    const p = calcularProgresso(s, DEFAULT_SETTINGS.xp, DEFAULT_SETTINGS.titulos);
    assert.equal(p.partes.estudo, (6 + 2 + 0) * DEFAULT_SETTINGS.xp.dezMinutos);
    assert.equal(p.minutosSemana, 25 + 9);
    assert.equal(p.minutosHoje, 9);
  });
});

describe("conquistas", () => {
  it("de sequência não somem quando a chama apaga", () => {
    const dias = ["2026-10-01", "2026-10-02", "2026-10-03"].map((d) => [d, { data: d, caminho: d, minutos: 30 }] as const);
    const s: Snapshot = { hoje: "2026-11-12", trilhas: [], notas: [], perguntas: [], diario: new Map(dias) };
    const p = calcularProgresso(s, DEFAULT_SETTINGS.xp, DEFAULT_SETTINGS.titulos);
    assert.equal(p.sequencia, 0);
    const c = avaliarConquistas(s, p, { caixaFinal: 6 });
    assert.equal(c.find((x) => x.id === "chama-3")?.ok, true);
    assert.deepEqual([c.find((x) => x.id === "chama-7")?.atual, c.find((x) => x.id === "chama-7")?.meta], [3, 7]);
  });
  it("ids únicos e raridade válida em todas", () => {
    const ids = CONQUISTAS.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const c of CONQUISTAS) assert.ok(["comum", "raro", "epico", "lendario"].includes(c.raridade), c.id);
  });
});

describe("configurações", () => {
  it("campos novos ganham padrão quando a config salva é antiga", () => {
    const s = mergeSettings({ xp: { escrito: 1 } as never, intervalos: [] });
    assert.equal(s.xp.escrito, 1);
    assert.equal(s.xp.caixa, DEFAULT_SETTINGS.xp.caixa);
    assert.deepEqual(s.intervalos, DEFAULT_SETTINGS.intervalos);
  });
  it("campos que não existem mais (do treino removido) e tipos errados são descartados", () => {
    const antiga = { perguntasPorTreino: 5, xp: { treino: 20, acerto: 5, diario: "x" }, abrirAoIniciar: "sim", titulos: [] };
    const s = mergeSettings(antiga) as unknown as Record<string, unknown> & { xp: Record<string, unknown> };
    assert.equal("perguntasPorTreino" in s, false);
    assert.equal("treino" in s.xp, false);
    assert.equal(s.xp.diario, DEFAULT_SETTINGS.xp.diario);
    assert.equal(s.abrirAoIniciar, DEFAULT_SETTINGS.abrirAoIniciar);
    assert.deepEqual(s.titulos, DEFAULT_SETTINGS.titulos);
    assert.doesNotThrow(() => mergeSettings(null));
    assert.doesNotThrow(() => mergeSettings("lixo"));
  });
});

// Testes das regras do jogo (sem Obsidian). Rodar: npm test
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDias, diaDaSemana, diffDias, parseISO, relativo } from "../src/domain/dates.ts";
import { parsePerguntas, parseTempo, parseTempoRever, parseTrilha, alternarCheckbox, limparTitulo } from "../src/domain/parse.ts";
import { CONQUISTAS, calcularProgresso, maiorSequencia, nivelPara, sequencia, avaliarConquistas } from "../src/domain/progress.ts";
import { aposEsquecer, aposLembrar, filaDoDia, infoRevisao, normalizarCaixa } from "../src/domain/review.ts";
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

  it("lê pergunta de múltipla escolha: alternativas, letra certa e explicação", () => {
    const p = parsePerguntas([
      "> [!question]+ Qual retorna `undefined`?",
      "> - a) `n => n * 2`",
      "> - b) `n => { n * 2 }`",
      "> - c) `(n) => (n * 2)`",
      ">",
      "> > [!check]- Resposta",
      "> > **b)** Com chaves precisa de `return`.",
      "",
      "> [!question]- Aberta?",
      "> sim",
    ].join("\n"));
    assert.deepEqual(p, [
      { pergunta: "Qual retorna `undefined`?", resposta: "**b)** Com chaves precisa de `return`.", alternativas: ["`n => n * 2`", "`n => { n * 2 }`", "`(n) => (n * 2)`"], correta: 1 },
      { pergunta: "Aberta?", resposta: "sim" },
    ]);
  });

  it("múltipla escolha sem letra certa válida vira pergunta sem correção automática", () => {
    const p = parsePerguntas(["> [!question]+ X?", "> - a) um", "> - b) dois", "> > [!check]- Resposta", "> > **z)** nada"].join("\n"));
    assert.equal(p[0]?.correta, undefined);
    assert.deepEqual(p[0]?.alternativas, ["um", "dois"]);
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
  it("lembrar sobe até o limite; na primeira revisão pula a caixa 1", () => {
    assert.equal(aposLembrar({ caixa: 0, revisado: null }, INT), 2);
    assert.notEqual(aposLembrar({ caixa: 0, revisado: null }, INT), aposEsquecer(), "lembrei e esqueci não podem dar o mesmo");
    assert.equal(aposLembrar({ caixa: 0, revisado: null }, [0, 1]), 1, "com uma caixa só, não passa do limite");
    assert.equal(aposLembrar({ caixa: 3, revisado: "2026-11-01" }, INT), 4);
    assert.equal(aposLembrar({ caixa: 6, revisado: "2026-11-01" }, INT), 6);
  });
  it("fila do dia: vencidas todas, novas até o limite (descontando as feitas hoje)", () => {
    const nova = { caixa: 0, revisado: null };
    const velha = { caixa: 2, revisado: "2026-11-01" };
    const fila = [nova, nova, nova, velha, nova];
    assert.deepEqual(filaDoDia(fila, 2, 0), { hoje: [nova, nova, velha], adiadas: 2 });
    assert.deepEqual(filaDoDia(fila, 2, 1), { hoje: [nova, velha], adiadas: 3 });
    assert.deepEqual(filaDoDia(fila, 2, 5), { hoje: [velha], adiadas: 4 }, "limite estourado não fica negativo");
    assert.deepEqual(filaDoDia(fila, 0, 9), { hoje: fila, adiadas: 0 }, "0 = sem limite");
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
    assert.equal(s.novasPorDia, DEFAULT_SETTINGS.novasPorDia);
    assert.equal(mergeSettings({ novasPorDia: -3 }).novasPorDia, DEFAULT_SETTINGS.novasPorDia, "negativo é ignorado");
    assert.equal(mergeSettings({ novasPorDia: 0 }).novasPorDia, 0, "0 (sem limite) é válido");
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

describe("tempo de estudo da nota", () => {
  it("lê o total em negrito da linha ⏱️ Quanto tempo", () => {
    assert.equal(parseTempo("**Quanto focar: 🔥 essencial.** x\n\n**⏱️ Quanto tempo: cerca de 1h30.** Uns 25 min de leitura."), "1h30");
    assert.equal(parseTempo("**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min..."), "45 min");
  });
  it("desafio de vários dias vem inteiro", () => {
    assert.equal(parseTempo("**⏱️ Quanto tempo: cerca de 30 min no primeiro dia, depois 7 dias de uns 30 a 60 min.** No primeiro dia: ..."), "30 min no primeiro dia, depois 7 dias de uns 30 a 60 min");
  });
  it("aceita a linha escrita à mão sem ⏱️ e sem 'cerca de'; sem a linha dá null", () => {
    assert.equal(parseTempo("**Quanto tempo: 2h.** leitura e desafio"), "2h");
    assert.equal(parseTempo("# Nota\n\nTexto sem tempo nenhum."), null);
    assert.equal(parseTempo("Falei do **Quanto tempo:** no meio da frase"), null, "só vale no começo da linha, com o valor no negrito");
  });
});

describe("tempo pra rever", () => {
  const nota = "**⏱️ Quanto tempo: cerca de 1h30.** Uns 25 min...\n\n**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro...";
  it("lê o rever separado do estudar", () => {
    assert.equal(parseTempoRever(nota), "15 min");
    assert.equal(parseTempo(nota), "1h30", "a linha de rever não atrapalha a de estudar");
  });
  it("sem a linha dá null; escrita à mão sem 🔁 também vale", () => {
    assert.equal(parseTempoRever("**⏱️ Quanto tempo: cerca de 1h.** Uns..."), null);
    assert.equal(parseTempoRever("**Pra rever: 10 min.** Me teste."), "10 min");
  });
});

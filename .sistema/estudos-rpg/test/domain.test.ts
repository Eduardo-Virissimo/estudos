// Testes das regras do jogo (sem Obsidian). Rodar: npm test
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDias, diffDias, parseISO, relativo } from "../src/domain/dates.ts";
import { parseMissao, parsePerguntas, parseTrilha, alternarCheckbox, limparTitulo } from "../src/domain/parse.ts";
import { CONQUISTAS, calcularProgresso, nivelPara, sequencia, avaliarConquistas } from "../src/domain/progress.ts";
import { indiceDoDia } from "../src/domain/quiz.ts";
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
  });

  it("lê fases de missão e ignora checkboxes fora de fase", () => {
    const f = parseMissao(["## Fase 0: Preparar ✅ (quase)", "**Entrega:** repo", "- [x] a", "- [ ] b", "---", "## Depois", "- [ ] não conta"].join("\n"));
    assert.equal(f.length, 1);
    assert.equal(f[0]?.titulo, "Preparar");
    assert.equal(f[0]?.entrega, "repo");
    assert.deepEqual(f[0]?.tarefas.map((t) => t.feita), [true, false]);
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

describe("pergunta do dia", () => {
  it("é estável no mesmo dia e não quebra sem perguntas", () => {
    assert.equal(indiceDoDia("2026-11-11", 10), indiceDoDia("2026-11-11", 10));
    assert.equal(indiceDoDia("2026-11-11", 0), -1);
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
    const vazio: Snapshot = { hoje: "2026-11-11", trilhas: [], missoes: [], notas: [], perguntas: [], diario: new Map() };
    const p = calcularProgresso(vazio, DEFAULT_SETTINGS.xp, DEFAULT_SETTINGS.titulos);
    assert.equal(p.xp, 0);
    assert.equal(p.titulo, "Aprendiz");
    assert.ok(avaliarConquistas(vazio, p).every((c) => !c.ok));
  });
});

describe("conquistas", () => {
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
    assert.equal(s.xp.tarefa, DEFAULT_SETTINGS.xp.tarefa);
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

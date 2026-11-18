# Template novo das notas — plano

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar o template engessado por um modelo com resumo, texto explicativo com prioridade 🔴🟡⚪ e seções opcionais; documentar no README; reescrever Funções como nota de referência.

**Architecture:** Só Markdown do vault. A Ficha do herói (plugin `estudos-rpg`) lê apenas `nivel`/`revisado` e callouts `[!question]`; o resto da estrutura é livre.

**Tech Stack:** Markdown do Obsidian (callouts, comentários `%% %%`), parser `parsePerguntas` do plugin pra verificação.

**Spec:** `.sistema/specs/2026-11-17-template-notas-design.md`

## Global Constraints

- Propriedades `nivel: escrito` e `revisado:` continuam no topo de toda nota.
- Selos nos títulos `##` de conteúdo: `🔴` tem que saber, `🟡` bom saber, `⚪` só conhecer.
- Fixos: Resumo, texto com selos, `## 🧠 Me teste`. Opcionais: `🔨 Pratique`, `🚀 Projeto` (com `**📍 Onde fazer:**`), `📋 Consulta rápida`, `📚 Pra ir além`, `📓 Diário`.
- Saem: Objetivos, avisos "Como estudar"/"Nível", "Exemplo meu", "Onde isso se encaixa", seção Pegadinhas separada.
- Instruções de escrita no template só em `%% ... %%`. Legenda e jeito de estudar só no README.
- Me teste: perguntas abertas + 1 ou 2 de múltipla escolha no formato `[!check]` aninhado.
- Recomendações só com link verificado (abrir a página); na dúvida, fora.
- Português do Brasil, tom de explicação pra estudante iniciante, sem jargão sem explicar.

## Review Focus

- Placeholders do template não podem virar perguntas na Ficha: `parsePerguntas` do template deve devolver `[]`.
- Links internos `[[#...]]` da nota reescrita apontam pra títulos que existem (os títulos mudaram de nome).
- Funções reescrita mantém o conteúdo técnico das 8 seções antigas (nada some, só muda de peso).
- Desafio/projeto de Funções mantém o vínculo com o gerenciador de tarefas (README e *Configurando um Projeto TypeScript* citam isso).
- Notas antigas continuam funcionando na Ficha (nenhuma mudança no plugin).

---

### Task 1: Template novo

**Files:**
- Modify: `Templates/Template.md` (reescrita inteira)

- [ ] **Step 1:** Escrever o template na ordem: propriedades → `# [NOME]` → callout `> [!abstract] Resumo` (texto + "**Tem que saber:**" com links `[[#🔴 ...]]`) + linha opcional "Antes, ajuda saber" → exemplos de `## 🔴`, `## 🟡`, `## ⚪` com `%%` explicando o que cada um leva (🔴 inclui `> [!warning] Pegadinha`) → `## 🔨 Pratique` → `## 🚀 Projeto` → `## 🧠 Me teste` (3 abertas + 1 múltipla escolha, placeholders entre `[ ]`) → `## 📋 Consulta rápida` → `## 📚 Pra ir além` (🎥 📖 🌐 🎮 com "por que vale") → `## 📓 Diário` (2 linhas) → "Próximo passo". Cada opcional começa com `%% Opcional: ... apague se ... %%`.
- [ ] **Step 2: Verificar** que os placeholders não viram perguntas:
  Run: `node -e` importando `parsePerguntas` de `file:///.../src/domain/parse.ts` sobre `Templates/Template.md`
  Expected: `[]`
- [ ] **Step 3: Verificar** que nenhuma seção removida sobrou:
  Run: `grep -nE "Objetivos|Como estudar|📊 Nível|Exemplo meu|Onde isso se encaixa|## 🔧 Pegadinhas" Templates/Template.md`
  Expected: nenhuma linha

### Task 2: README do vault

**Files:**
- Modify: `README.md` (seções de como estudar e tabela de convenções)

- [ ] **Step 1:** Adicionar a legenda 🔴🟡⚪ com uma linha de "como usar" cada (🔴 domina antes de seguir; 🟡 lê e volta quando precisar; ⚪ só saiba que existe).
- [ ] **Step 2:** Atualizar os passos de estudo (resumo → 🔴 → pratique → Me teste → diário) e as linhas da tabela que citam seções que saíram.
- [ ] **Step 3: Verificar:** `grep -n "Objetivos\|Exemplo meu\|Cola rápida" README.md` → nenhuma referência ao modelo antigo.

### Task 3: Funções como nota de referência

**Files:**
- Modify: `Programação/02 - Fundamentos/Funções/Funções.md` (reescrita, mantendo `nivel`/`revisado` atuais)

- [ ] **Step 1:** Reescrever com os pesos: 🔴 o que é função/parâmetro×argumento, 🔴 `return` × `console.log`, 🔴 arrow function (e a pegadinha das chaves), 🔴 pura × efeito colateral, 🟡 opcionais e padrão, 🟡 objeto como parâmetro, 🟡 callback, ⚪ retornar vários valores. Texto explicando o porquê, com analogia e exemplo; pegadinhas dentro dos tópicos.
- [ ] **Step 2:** Manter o Desafio e o Projeto atuais (adaptados para `🔨 Pratique`/`🚀 Projeto`, com `📍 Onde fazer`), o Me teste atual (6 abertas + 2 múltipla escolha) e o Diário, se tiver algo escrito pelo usuário.
- [ ] **Step 3:** `📚 Pra ir além` com 3-5 recursos, cada link aberto e conferido antes de entrar.
- [ ] **Step 4: Verificar** perguntas: `parsePerguntas` na nota → 8 perguntas, 2 com `correta` definida.
- [ ] **Step 5: Verificar** links internos: cada `[[#X]]` da nota tem um título `X` correspondente (script `grep -o "\[\[#[^]|]*" | sort -u` comparado com os `##`).

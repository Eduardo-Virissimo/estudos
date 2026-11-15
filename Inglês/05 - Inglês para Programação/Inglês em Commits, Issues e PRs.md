---
nivel: escrito
revisado:
---

# Inglês em Commits, Issues e PRs

> *"Seu GitHub é o primeiro texto em inglês que um recrutador lê de você."*

> [!tip] ⚡ Em 30 segundos
> Escrever em inglês no Git é mais fácil do que parece: frases **curtas**, sempre no mesmo formato e com os mesmos verbos. Commit no **imperativo** (*Add*, *Fix*, *Remove*: "Fix login bug", nunca "Fixed" nem "Fixing"); issue com **passos pra reproduzir, esperado e o que aconteceu**; PR com **o quê, por quê e como testar**; e comentários de review **educados e diretos**. É o inglês que você vai usar todo dia no trabalho, e dá pra praticar já, nos seus projetos.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever mensagens de commit em inglês no imperativo, no padrão Conventional Commits
- Abrir uma issue de bug em inglês que outra pessoa consegue reproduzir
- Escrever a descrição de um PR e comentários de review educados em inglês

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Imperativo]] · [[Vocabulário Técnico]] · [[Conventional Commits]] · [[GitHub e Pull Requests]]
- **Depois:** [[Inglês em Reuniões e Daily]] · [[Code Review]]
- **Trilhas:** [[Inglês]] · [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Commits: imperativo, curto, sem ponto

Teste: a frase completa **"If applied, this commit will \_\_\_"**.

| ❌ | ✅ |
|---|---|
| `Fixed the bug` | `fix: handle empty task title` |
| `Adding filter` | `feat: add priority filter to list command` |
| `changes` | `refactor: extract JSON storage into its own module` |
| `update readme` | `docs: add usage examples to README` |
| `Removed unused stuff` | `chore: remove unused dependencies` |

**Verbos que resolvem 90% dos commits:**

| Verbo | Pra quê |
|---|---|
| *Add* | algo novo |
| *Fix* | corrigir |
| *Remove* / *Drop* | tirar |
| *Update* / *Bump* | atualizar / subir versão |
| *Rename* / *Move* | renomear / mover |
| *Extract* / *Split* | separar em partes |
| *Improve* / *Simplify* | melhorar / simplificar |
| *Handle* | tratar (um caso, um erro) |
| *Prevent* / *Allow* | impedir / permitir |
| *Replace X with Y* | trocar X por Y |

### 2. Issue de bug

```markdown
**Title:** `list` crashes when tasks.json is empty

### Steps to reproduce
1. Create an empty `tasks.json`
2. Run `tasks list`

### Expected behavior
An empty list message: "No tasks yet".

### Actual behavior
The app crashes with `SyntaxError: Unexpected end of JSON input`.

### Environment
- Node 24.1, Windows 11
- tasks v1.1.0
```

Título = o **sintoma**, no presente. Frases curtas. Sempre a mensagem de erro **exata**.

### 3. Issue de funcionalidade

```markdown
**Title:** Add due dates to tasks

### Problem
I can't tell which tasks are urgent.

### Proposal
Add a `--due YYYY-MM-DD` option to `add`, and show overdue tasks in red on `list`.

### Alternatives considered
Using priority only, but it doesn't capture deadlines.
```

### 4. Descrição de PR

```markdown
## What
Adds a `--priority` option to `add` and `list`.

## Why
With 30+ tasks it's hard to find the urgent ones. Closes #12.

## How to test
1. `npm run dev -- add "Test" --priority high`
2. `npm run dev -- list --priority high` → only the new task shows up

## Notes
Old tasks without priority default to `medium`.
```

### 5. Comentários de review (educados e diretos)

| Intenção | Frase |
|---|---|
| sugerir | *What do you think about extracting this into a function?* |
| perguntar | *What happens if the list is empty here?* |
| detalhe pequeno | *nit: typo in "recieve" → "receive"* |
| bloquear com motivo | *This would break existing JSON files. Could we add a migration?* |
| elogiar | *Nice catch!* / *This is much cleaner, thanks!* |
| aprovar | *LGTM 👍* |

E respondendo ao revisor:

| Situação | Frase |
|---|---|
| concordou e corrigiu | *Good point, fixed in a1b2c3d.* |
| discorda com educação | *I considered that, but it would require X. Happy to change if you feel strongly.* |
| vai fazer depois | *Agreed. I'll handle it in a follow-up PR.* |
| não entendeu | *Could you clarify what you mean by...?* |

### 6. Expressões que aparecem toda hora

| Expressão | Significa |
|---|---|
| *as expected* | como esperado |
| *out of scope* | fora do escopo deste PR |
| *follow-up* | continuação (num PR/issue seguinte) |
| *edge case* | caso de borda |
| *breaking change* | mudança que quebra compatibilidade |
| *works on my machine* | (piada) funciona aqui, mas não sei por quê aí não |
| *blocked by #12* | depende da issue 12 |

---

## 🔧 Pegadinhas

- **Passado no commit.** `Fixed`, `Added`. A convenção do Git é imperativo: `Fix`, `Add`.
- **Traduzir palavra por palavra.** "Arrumei o bug do login" → ~~"Arranged the login bug"~~ → `fix: login fails with valid password`.
- **Comentário seco que soa rude.** "Wrong." ofende; "I think this might not handle X, what do you think?" convida. Em inglês, perguntas suavizam.
- **"Please" demais ou "sorry" demais.** Um "could you" basta. Não peça desculpas por fazer uma revisão.
- **Inventar palavra.** Na dúvida, copie a construção de um PR de um projeto grande: é inglês revisado por centenas de pessoas.

---

## 🔨 Desafio prático

**Objetivo:** reescrever o seu próprio histórico em inglês.

1. Pegue as últimas 10 mensagens de commit de um projeto seu.
2. Reescreva em inglês, no imperativo e no padrão [[Conventional Commits]] (só no papel; não precisa reescrever o histórico).
3. Escreva em inglês uma issue de bug de algo real seu, com passos, esperado e atual.
4. Peça pra uma IA corrigir os textos com o prompt de [[Output com Correção]] e anote os erros que se repetiram.

**Pronto quando:** as 10 mensagens passam no teste "If applied, this commit will..." e a issue tem as 4 partes.

---

## 🚀 Projeto

> [!example] Um projeto seu 100% em inglês
> Publicar um projeto com tudo em inglês: README, commits, issues e PRs. É portfólio e treino ao mesmo tempo.
>
> **Tempo:** acompanha o projeto (o [[Gerenciador de Tarefas no Terminal]] é um ótimo candidato)

**O mínimo:**
- [ ] README em inglês: what it is, how to install, how to use, com exemplos
- [ ] Todos os commits em inglês, no imperativo
- [ ] 3 issues em inglês (pelo menos 1 bug e 1 feature) e cada funcionalidade nova entrando por PR com What / Why / How to test
- [ ] Revisar o próprio PR deixando 1 comentário em inglês e respondendo

**Se quiser ir além:**
- Contribuir com uma correção de documentação (typo) num projeto open source em inglês
- Configurar o commitlint ([[Git Hooks]]) pra validar o formato

**Pronto quando:** alguém que não fala português entende o projeto inteiro só pelo GitHub.

> Terminou? Mude `nivel` para `projeto` e conte no 📓 Diário de bordo onde travou.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Em que tempo verbal se escreve uma mensagem de commit em inglês?
> No imperativo: *Add*, *Fix*, *Remove* (completa a frase "If applied, this commit will...").

> [!question]- Quais são as partes de uma boa issue de bug?
> Passos pra reproduzir, comportamento esperado, comportamento atual (com o erro exato) e ambiente.

> [!question]- O que vai na descrição de um PR?
> *What* (o que muda), *Why* (por quê) e *How to test* (como testar).

> [!question]- Como sugerir uma mudança num review sem soar rude?
> Em forma de pergunta ou sugestão: "What do you think about...?", "Could we...?".

> [!question]- Como responder a um revisor depois de corrigir o que ele pediu?
> "Good point, fixed in <hash>."

> [!question]- O que significa *out of scope*?
> Fora do escopo: algo que não pertence a este PR/tarefa.

---

## 📋 Cola rápida

| Onde | Fórmula |
|---|---|
| Commit | `tipo: verbo no imperativo + o quê` |
| Issue de bug | Steps to reproduce · Expected · Actual · Environment |
| Issue de feature | Problem · Proposal · Alternatives |
| PR | What · Why · How to test |
| Sugerir | *What do you think about...?* |
| Corrigiu | *Good point, fixed in abc123.* |
| Aprovar | *LGTM* |

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar.

**Um commit, uma issue ou um comentário que eu escrevi em inglês:**
- 

**Erros que se repetiram:**
- 

---

## 📚 Recursos

- [How to Write a Git Commit Message (Chris Beams)](https://cbea.ms/git-commit/)
- [Conventional Comments](https://conventionalcomments.org/): rótulos pra comentários de review
- [GitHub Docs · Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue)

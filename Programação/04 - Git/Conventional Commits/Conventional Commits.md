---
nivel: escrito
revisado:
---

# Conventional Commits

> *"Mensagem de commit é uma carta pro você do futuro. Escreva como se ele estivesse com pressa e de mau humor."*

> [!tip] ⚡ Em 30 segundos
> **Conventional Commits** é um padrão de mensagem: `tipo(escopo): descrição`, como `feat(cli): adiciona filtro por prioridade` ou `fix: recusa título vazio`. O **tipo** diz a natureza da mudança (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`...), e um `!` ou `BREAKING CHANGE:` avisa que quebra compatibilidade. O histórico fica legível de relance, e ferramentas conseguem gerar changelog e decidir a próxima versão do [[Tags e Versionamento Semântico|SemVer]] sozinhas.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever mensagens no formato `tipo(escopo): descrição` com o tipo certo
- Marcar mudanças que quebram compatibilidade e explicar a relação com o SemVer
- Escrever um corpo de commit útil (o porquê) quando a mudança pede

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Git Básico]] · [[Tags e Versionamento Semântico]]
- **Depois:** [[Git Hooks]] (validar a mensagem) · [[Inglês em Commits, Issues e PRs]] · [[GitHub Actions]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O formato

```text
tipo(escopo opcional): descrição curta no imperativo

Corpo opcional: o PORQUÊ da mudança, o que não é óbvio no diff.
Quebre linhas em ~72 caracteres.

Rodapé opcional: BREAKING CHANGE: ..., Closes #12
```

### 2. Os tipos

| Tipo | Quando | Efeito no SemVer |
|---|---|---|
| `feat` | funcionalidade nova pro usuário | **MINOR** |
| `fix` | correção de bug | **PATCH** |
| `docs` | só documentação (README, comentários) | – |
| `style` | formatação, sem mudar lógica (espaço, ponto e vírgula) | – |
| `refactor` | muda estrutura, sem mudar comportamento | – |
| `perf` | melhora de desempenho | PATCH |
| `test` | adiciona/corrige testes | – |
| `build` | dependências, build, `package.json` | – |
| `ci` | pipelines (GitHub Actions) | – |
| `chore` | tarefas que não encaixam acima | – |
| `revert` | desfaz um commit anterior | – |
| qualquer um com `!` ou `BREAKING CHANGE:` | quebra compatibilidade | **MAJOR** |

### 3. Exemplos bons

```text
feat(cli): adiciona opção --prioridade ao comando add
fix: impede tarefa com título só de espaços
docs(readme): explica como instalar com npm
refactor(storage): extrai leitura do JSON para função própria
test: cobre conclusão de tarefa inexistente
build: atualiza typescript para 5.6
feat!: troca formato do tarefas.json para objeto com versão
```

### 4. Descrição: as regras que importam

- **Imperativo**, como uma ordem: "adiciona", "corrige", "remove" (em inglês: "add", "fix", "remove").
- **Diz o que o commit faz**, não o que você fez: ~~"mexi no filtro"~~ → "corrige filtro que ignorava acentos".
- **Curta**: até ~50–72 caracteres. Detalhe vai no corpo.
- **Minúscula, sem ponto final** (convenção mais comum).
- **Escopo** = a parte do projeto: `cli`, `storage`, `api`, `ui`. Opcional, mas ajuda em projetos maiores.

### 5. O corpo: o porquê

```text
fix(storage): grava tarefas com escrita atômica

Se o processo era interrompido no meio do writeFile, o tarefas.json
ficava pela metade e o programa não abria mais. Agora grava num
arquivo .tmp e renomeia, que é instantâneo.

Closes #18
```

O diff mostra **o quê**. Só a mensagem pode contar **o porquê**.

### 6. Breaking change

```text
feat(storage)!: salva tarefas em objeto com campo versao

BREAKING CHANGE: arquivos tarefas.json do formato antigo (array puro)
não são mais lidos. Rode `tarefas migrar` para converter.
```

### 7. Português ou inglês?

Projetos públicos e times internacionais: **inglês** (`feat: add priority filter`). Neste vault e em projetos pessoais, português serve. O importante é ser **consistente** dentro do repositório. Pra praticar inglês junto: [[Inglês em Commits, Issues e PRs]].

### 8. O que isso destrava

- `git log --oneline --grep "^feat"`: tudo que foi adicionado.
- Changelog e próxima versão automáticos (ferramentas como **release-please** e **semantic-release**).
- Validação automática da mensagem num [[Git Hooks|hook]] (`commitlint`).

---

## 🛠️ Exemplo guiado

Reescrevendo um histórico ruim:

| Antes | Depois |
|---|---|
| `ajustes` | `fix(cli): mostra ajuda quando nenhum comando é passado` |
| `wip` | (juntado com o commit seguinte via [[Rebase e Cherry Pick\|rebase -i]]) |
| `agora vai!!!` | `fix(storage): cria pasta dados se não existir` |
| `update readme` | `docs(readme): adiciona exemplos de uso` |
| `mudei tudo` | 3 commits: `refactor: separa regras em tarefas.ts`, `refactor: separa leitura em storage.ts`, `test: adiciona testes das regras` |

Repare no último: "mudei tudo" não tinha tipo porque eram **várias** mudanças. Se você não consegue escolher um tipo, o commit está grande demais.

---

## 🔧 Pegadinhas

- **Tipo errado pra "parecer mais".** Refatoração não é `feat`; isso faria subir o MINOR à toa.
- **`fix` pra coisa que nunca funcionou.** Se a funcionalidade não existia, é `feat`.
- **`chore` pra tudo.** Vira gaveta de bagunça. Use os tipos específicos.
- **Descrição que só repete o tipo.** `fix: fix bug` não diz nada. Qual bug?
- **Commit grande com tipo único.** Um commit = um tipo. Se precisa de dois, são dois commits.

---

## 🔨 Desafio prático

**Objetivo:** treinar até ficar automático.

1. Abra o `git log --oneline` de um projeto seu e reescreva (no papel) as últimas 10 mensagens no padrão.
2. Nos próximos 10 commits reais, use o padrão, com escopo quando fizer sentido.
3. Escreva pelo menos 1 commit com corpo explicando o porquê.
4. Rode `git log --oneline --grep "^feat"` e `--grep "^fix"` e veja o resumo do projeto.

**Pronto quando:** seus últimos 10 commits seguem o padrão e cada um tem um tipo só.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual o formato de um Conventional Commit?
> `tipo(escopo opcional): descrição`, com corpo e rodapé opcionais.

> [!question]- Qual a diferença entre `feat` e `fix`?
> `feat` adiciona uma funcionalidade nova (sobe o MINOR); `fix` corrige um bug (sobe o PATCH).

> [!question]- Como marcar uma mudança que quebra compatibilidade?
> Com `!` depois do tipo (`feat!:`) ou `BREAKING CHANGE:` no rodapé. Sobe o MAJOR.

> [!question]- Uma refatoração sem mudar comportamento usa qual tipo?
> `refactor`.

> [!question]- O que vai no corpo do commit?
> O porquê da mudança e o contexto que o diff não mostra.

> [!question]- Por que a descrição vai no imperativo?
> Porque descreve o que o commit faz quando aplicado ("adiciona filtro"), lendo como uma ordem; é a convenção do próprio Git.

---

## 📋 Cola rápida

| Tipo | Uso |
|---|---|
| `feat:` | novidade (MINOR) |
| `fix:` | correção (PATCH) |
| `docs:` | documentação |
| `refactor:` | estrutura sem mudar comportamento |
| `test:` | testes |
| `build:` / `ci:` | dependências / pipeline |
| `chore:` | manutenção |
| `tipo!:` | quebra compatibilidade (MAJOR) |
| `Closes #12` | fecha issue no merge |

---

## 🛠️ Exemplo meu

```text

```

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
- 

**O que me confundiu / onde eu errei:**
- 

**Onde eu usei de verdade:**
- 

---

## 📚 Recursos

- [conventionalcommits.org (em português)](https://www.conventionalcommits.org/pt-br/v1.0.0/)
- [How to Write a Git Commit Message (Chris Beams)](https://cbea.ms/git-commit/): as 7 regras de uma boa mensagem
- [commitlint](https://commitlint.js.org/): valida a mensagem automaticamente

---
nivel: escrito
revisado:
---

# Tags e Versionamento Semântico

> *"O número da versão é uma promessa pra quem usa o seu código."*

> [!tip] ⚡ Em 30 segundos
> Uma **tag** é um nome fixo pra um commit específico, normalmente uma versão: `v1.2.0`. Ao contrário de uma branch, ela não anda. O **Versionamento Semântico** (SemVer) dá significado ao número `MAJOR.MINOR.PATCH`: **PATCH** corrige bug sem mudar nada pra quem usa, **MINOR** adiciona algo compatível, **MAJOR** quebra compatibilidade. É assim que o `npm` decide o que pode atualizar sozinho.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Criar, listar, enviar e apagar tags anotadas
- Decidir o próximo número de versão de acordo com o SemVer
- Ler os intervalos de versão do `package.json` (`^1.2.3`, `~1.2.3`)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Git Básico]] · [[Desfazendo Mudanças (Reset e Revert)]]
- **Depois:** [[Conventional Commits]] · [[Gerenciador de Pacotes]] · [[Versionamento de API]] · [[Deploy]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Tags

```bash
git tag -a v1.0.0 -m "Primeira versão estável"  # tag anotada (com autor, data, mensagem)
git tag v1.0.0-teste                             # tag leve (só o nome); evite pra releases
git tag                                          # lista
git tag -l "v1.*"                                # filtra
git show v1.0.0                                  # detalhes e o commit
git tag -a v0.9.0 a1b2c3d -m "..."               # tag num commit antigo
```

**Tags não vão no `git push` normal:**

```bash
git push origin v1.0.0     # uma
git push --follow-tags     # todas as anotadas ligadas aos commits enviados
```

Apagar (raro, só se ninguém usou ainda):

```bash
git tag -d v1.0.0
git push origin --delete v1.0.0
```

Voltar pra ver uma versão antiga:

```bash
git switch --detach v1.0.0   # "detached HEAD": só olhar; pra mudar, crie uma branch
```

### 2. SemVer: `MAJOR.MINOR.PATCH`

| Mudou o quê | Sobe | Exemplo |
|---|---|---|
| Correção de bug, sem mudar como se usa | **PATCH** | `1.4.2` → `1.4.3` |
| Funcionalidade nova, compatível | **MINOR** (zera o patch) | `1.4.3` → `1.5.0` |
| Mudança que quebra quem usa | **MAJOR** (zera os outros) | `1.5.0` → `2.0.0` |

"Quebra quem usa" = remover/renomear função ou opção, mudar formato de resposta, mudar comportamento esperado.

- `0.x.y`: fase inicial, **qualquer coisa pode mudar**. A promessa de compatibilidade começa no `1.0.0`.
- Pré-lançamento: `2.0.0-beta.1`, `2.0.0-rc.1` (vêm **antes** do `2.0.0`).

### 3. SemVer no `package.json`

```json
"dependencies": {
  "zod": "^3.23.8",
  "dayjs": "~1.11.10",
  "left-pad": "1.3.0"
}
```

| Escrito | Aceita | Por quê |
|---|---|---|
| `^3.23.8` | `>=3.23.8 <4.0.0` | minor e patch: compatíveis pela promessa do SemVer (**padrão do npm**) |
| `~1.11.10` | `>=1.11.10 <1.12.0` | só patch |
| `1.3.0` | exatamente essa | trava |

O `package-lock.json` trava a versão **exata** instalada; os intervalos dizem pra onde pode subir com `npm update`. Mais em [[Gerenciador de Pacotes]].

### 4. Subindo a versão do seu projeto

```bash
npm version patch   # 1.0.0 → 1.0.1: altera o package.json, faz commit e cria a tag v1.0.1
npm version minor   # → 1.1.0
npm version major   # → 2.0.0
git push --follow-tags
```

### 5. Releases no GitHub

Uma tag pode virar uma **Release** no GitHub, com notas do que mudou e arquivos pra baixar:

```bash
gh release create v1.1.0 --generate-notes   # notas montadas a partir dos PRs
```

Com [[Conventional Commits]], dá pra até automatizar a escolha do número e o changelog.

### 6. `CHANGELOG.md`

Arquivo com o que mudou em cada versão, pra humanos. Formato comum ([Keep a Changelog](https://keepachangelog.com/pt-BR/)):

```markdown
## [1.1.0] - 2026-11-15
### Adicionado
- Filtro por prioridade no comando `list`.
### Corrigido
- Título só com espaços era aceito.
```

---

## 🛠️ Exemplo guiado

Decidindo versões do gerenciador de tarefas:

| Mudança | Versão |
|---|---|
| Primeira versão usável | `1.0.0` |
| Corrige bug: título só com espaços | `1.0.1` |
| Adiciona `--prioridade` (opcional) | `1.1.0` |
| Adiciona comando `stats` | `1.2.0` |
| Muda o formato do `tarefas.json` (versões antigas não leem mais) | `2.0.0` |
| Corrige erro de digitação na ajuda | `2.0.1` |

```bash
npm version minor -m "release: %s"   # %s vira o número
git push --follow-tags
gh release create v1.1.0 --generate-notes
```

---

## 🔧 Pegadinhas

- **Esquecer de enviar a tag.** `git push` sozinho não leva. Use `--follow-tags`.
- **Mudar uma tag já publicada.** Quem baixou fica com outra versão. Errou? Lance a próxima (`v1.0.1`).
- **Quebrar compatibilidade num minor.** "É só uma mudancinha" no formato quebra quem confia no `^`. Na dúvida, é major.
- **Ficar no `0.x` pra sempre** pra "não prometer nada". Se outras pessoas usam, chegue no `1.0.0`.
- **Tag leve pra release.** Não tem autor nem data. Use `-a`.

---

## 🔨 Desafio prático

**Objetivo:** lançar 3 versões de um projeto seu.

1. Num projeto com `package.json`, comece em `1.0.0` e crie a tag `v1.0.0` com `npm version` (ou `git tag -a`).
2. Faça uma correção → `patch`; uma funcionalidade → `minor`.
3. Escreva um `CHANGELOG.md` com as 3 versões.
4. Envie as tags e crie a Release `v1.1.0` no GitHub.
5. Pra cada dependência do `package.json`, diga até que versão o `npm update` pode subir.

**Pronto quando:** `git tag` lista 3 versões, elas aparecem no GitHub e o changelog bate com os commits.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre tag e branch?
> A branch anda a cada commit novo; a tag aponta sempre pro mesmo commit (marca uma versão).

> [!question]- O que significa cada parte de `MAJOR.MINOR.PATCH`?
> MAJOR: mudança que quebra compatibilidade; MINOR: funcionalidade nova compatível; PATCH: correção compatível.

> [!question]- Que versões `^2.3.1` aceita?
> De 2.3.1 até antes de 3.0.0 (qualquer minor e patch da versão 2).

> [!question]- Mudou o formato de um arquivo e versões antigas não leem mais. Que número sobe?
> O MAJOR, porque quebra compatibilidade.

> [!question]- Por que `git push` não enviou a tag?
> Porque tags não são enviadas por padrão; é preciso `git push origin v1.0.0` ou `git push --follow-tags`.

> [!question]- O que significa estar na versão `0.x.y`?
> Fase inicial de desenvolvimento: a API pode mudar a qualquer momento, sem promessa de compatibilidade.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git tag -a v1.0.0 -m "msg"` | criar tag anotada |
| `git tag` / `git show v1.0.0` | listar / ver |
| `git push --follow-tags` | enviar tags |
| `git tag -d v1` + `git push origin --delete v1` | apagar |
| `npm version patch\|minor\|major` | subir versão + commit + tag |
| `gh release create v1.1.0 --generate-notes` | release no GitHub |
| `^1.2.3` / `~1.2.3` | até <2.0.0 / até <1.3.0 |

---

## 🛠️ Exemplo meu

```bash

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

- [semver.org (em português)](https://semver.org/lang/pt-BR/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
- [npm semver calculator](https://semver.npmjs.com/): teste o que cada intervalo aceita

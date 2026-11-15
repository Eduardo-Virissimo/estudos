---
nivel: escrito
revisado:
---

# Git Hooks

> *"Se uma regra depende de alguém lembrar, ela vai ser esquecida. Automatize."*

> [!tip] ⚡ Em 30 segundos
> **Git hooks** são scripts que o Git roda sozinho em certos momentos: antes do commit (`pre-commit`), ao escrever a mensagem (`commit-msg`), antes do push (`pre-push`). Se o script terminar com erro, o Git **cancela** a operação. Uso clássico: rodar [[Linter]], [[Formatter]] e checagem de tipos antes de cada commit, e validar o padrão do [[Conventional Commits]]. Num projeto Node, o **Husky** + **lint-staged** configura isso pra todo o time.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Explicar o que é um hook e quando cada um roda
- Escrever um hook simples à mão em `.git/hooks`
- Configurar Husky + lint-staged num projeto TypeScript e validar mensagens com commitlint

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Conventional Commits]] · [[Linter]] · [[Formatter]] · [[Bash]] · [[Entrada e Saída]] (código de saída)
- **Depois:** [[CI/CD]] · [[GitHub Actions]] · [[Hooks de Agentes]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Os hooks mais usados

| Hook | Quando roda | Uso típico |
|---|---|---|
| `pre-commit` | antes de criar o commit | lint, formatação, checar tipos |
| `commit-msg` | depois de escrever a mensagem | validar o formato da mensagem |
| `pre-push` | antes de enviar | rodar os testes |
| `post-merge` | depois de um merge/pull | `npm install` se o `package-lock` mudou |

Regra: **código de saída diferente de 0 cancela** a operação (`pre-*` e `commit-msg`).

### 2. Hook na mão

Todo repositório tem exemplos em `.git/hooks/*.sample`. Pra ativar um, crie o arquivo sem `.sample`:

```bash
# .git/hooks/pre-commit
#!/usr/bin/env bash
if git diff --cached | grep -q "console.log"; then
  echo "❌ Tem console.log no commit. Remova ou use --no-verify se for de propósito."
  exit 1
fi
```

```bash
chmod +x .git/hooks/pre-commit   # no Git Bash do Windows também
```

Limitação: a pasta `.git` **não vai pro repositório**. Cada pessoa teria que criar à mão. Por isso existe o Husky.

### 3. Husky: hooks versionados

```bash
npm install -D husky
npx husky init            # cria a pasta .husky/ e o script "prepare" no package.json
```

O `prepare` roda a cada `npm install`, então **todo mundo que clona já ganha os hooks**. O arquivo `.husky/pre-commit` é um script comum:

```bash
# .husky/pre-commit
npm run check
```

### 4. lint-staged: só os arquivos do commit

Rodar o linter no projeto inteiro a cada commit é lento. O lint-staged roda **só nos arquivos staged**:

```bash
npm install -D lint-staged
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": "prettier --write"
}
```

```bash
# .husky/pre-commit
npx lint-staged
npm run check        # tipos: precisa do projeto todo, mas é rápido
```

### 5. commitlint: validar a mensagem

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo 'export default { extends: ["@commitlint/config-conventional"] };' > commitlint.config.js
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

```bash
git commit -m "ajustes"
# ✖ subject may not be empty  ✖ type may not be empty
git commit -m "fix: corrige filtro com acento"   # ✅
```

### 6. Pulando um hook (com consciência)

```bash
git commit --no-verify -m "..."   # ignora pre-commit e commit-msg
```

Pra emergência ou commit de WIP local. Se você vive pulando, o hook está lento ou chato demais: conserte o hook.

### 7. Hook local × CI

O hook é a **primeira linha** (feedback rápido no seu PC), mas dá pra pular. A garantia de verdade é o **CI** ([[GitHub Actions]]) rodando as mesmas checagens no PR, e a `main` protegida exigindo que passem ([[Git Flow]]).

---

## 🛠️ Exemplo guiado

Configuração completa num projeto TypeScript:

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

```json
// package.json (trechos)
"scripts": {
  "check": "tsc --noEmit",
  "lint": "eslint .",
  "test": "node --test",
  "prepare": "husky"
},
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

```bash
# .husky/pre-commit
npx lint-staged
npm run check
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

```bash
# .husky/pre-push
npm test
```

Agora: código mal formatado é corrigido sozinho, erro de tipo bloqueia o commit, mensagem fora do padrão é recusada e teste quebrado não sobe.

---

## 🔧 Pegadinhas

- **Hook lento.** Se o `pre-commit` leva 1 minuto, todo mundo passa a usar `--no-verify`. Mantenha em segundos (lint-staged ajuda); testes pesados vão no `pre-push` ou no CI.
- **Hook sem permissão de execução** (hook manual). Não roda e não avisa. `chmod +x`.
- **Esquecer o `prepare`.** Sem ele, quem clona não instala os hooks.
- **Achar que o hook protege a `main`.** Qualquer um pula com `--no-verify`. A proteção real é CI + regra de branch.
- **Hook que altera arquivos sem re-adicionar.** Com lint-staged isso é tratado; em hook manual que formata, os arquivos corrigidos precisam de `git add` de novo.

---

## 🔨 Desafio prático

**Objetivo:** blindar o projeto modelo.

1. No projeto de [[Configurando um Projeto TypeScript]], escreva primeiro um hook **manual** que bloqueia commit com `console.log` e teste.
2. Apague e configure Husky + lint-staged + commitlint como no exemplo.
3. Teste 3 bloqueios: erro de tipo, mensagem `"ajustes"` e (se tiver testes) teste quebrado no push.
4. Clone o repositório em outra pasta, rode `npm install` e confirme que os hooks vieram junto.

**Pronto quando:** os 3 bloqueios funcionam e o clone novo já tem os hooks sem configurar nada.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que é um Git hook?
> Um script que o Git executa automaticamente em certos eventos (antes do commit, ao escrever a mensagem, antes do push...).

> [!question]- Como um hook `pre-commit` cancela o commit?
> Terminando com código de saída diferente de 0.

> [!question]- Por que usar Husky em vez de escrever em `.git/hooks`?
> Porque `.git/hooks` não é versionado; o Husky guarda os hooks no repositório e instala pra todos via `npm install`.

> [!question]- O que o lint-staged faz?
> Roda as ferramentas (lint, formatação) só nos arquivos que estão no commit, deixando o hook rápido.

> [!question]- Hooks garantem que a `main` sempre tenha código checado?
> Não: dá pra pular com `--no-verify`. A garantia vem do CI e da proteção da branch.

> [!question]- Qual hook usar pra validar a mensagem de commit?
> `commit-msg` (com commitlint, por exemplo).

---

## 📋 Cola rápida

| Item | O que faz |
|---|---|
| `.git/hooks/pre-commit` | hook manual (não versionado) |
| `npx husky init` | cria `.husky/` e o `prepare` |
| `.husky/pre-commit` | roda antes do commit |
| `.husky/commit-msg` | valida a mensagem |
| `.husky/pre-push` | roda antes do push |
| `npx lint-staged` | lint só nos arquivos staged |
| `commitlint --edit "$1"` | valida Conventional Commits |
| `git commit --no-verify` | pula hooks |

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

- [Pro Git · Git Hooks](https://git-scm.com/book/pt-br/v2/Customizando-o-Git-Hooks-do-Git)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [commitlint](https://commitlint.js.org/)

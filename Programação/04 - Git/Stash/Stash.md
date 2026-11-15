---
nivel: escrito
revisado:
---

# Stash

> *"Stash é a gaveta onde você enfia o trabalho pela metade quando alguém grita 'produção caiu!'."*

> [!tip] ⚡ Em 30 segundos
> `git stash` **guarda** as mudanças que você ainda não commitou e deixa a pasta limpa, como no último commit. Aí você troca de branch, corrige o bug urgente, volta e roda `git stash pop` pra trazer o trabalho de volta. É uma pilha: dá pra guardar vários, listar e escolher qual aplicar. Use pra interrupções rápidas, não como lugar de guardar código por semanas.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Guardar e recuperar mudanças com `stash push` e `stash pop`
- Listar, nomear, inspecionar e apagar stashes
- Incluir arquivos novos no stash e resolver conflito ao aplicar

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Branches, Merge e Conflitos]] · [[Git Básico]]
- **Depois:** [[Desfazendo Mudanças (Reset e Revert)]] · [[Git Worktrees]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O cenário

```bash
git switch feat/filtro
# ...metade do filtro feito, nada commitado...
# "Urgente: o add está quebrado na main!"
git switch main
# error: Your local changes would be overwritten by checkout. Please commit or stash them.
```

### 2. Guardar e trazer de volta

```bash
git stash push -m "filtro pela metade"   # guarda (com nome) e limpa a pasta
git switch main
# ...corrige, commita, push...
git switch feat/filtro
git stash pop                            # traz de volta e remove da pilha
```

`git stash` sozinho também funciona (sem mensagem). Dê nome: com 3 stashes, "WIP on feat" não diz nada.

### 3. A pilha

```bash
git stash list
# stash@{0}: On feat/filtro: filtro pela metade
# stash@{1}: On main: teste de cor

git stash show -p stash@{1}    # ver o conteúdo
git stash apply stash@{1}      # aplica e MANTÉM na pilha
git stash pop stash@{1}        # aplica e REMOVE
git stash drop stash@{1}       # apaga sem aplicar
git stash clear                # apaga todos (⚠️ sem volta)
```

### 4. Arquivos novos (untracked)

Por padrão o stash só guarda arquivos que o Git **já conhece**. Arquivo novo fica pra trás:

```bash
git stash push -u -m "com arquivos novos"   # -u = --include-untracked
```

### 5. Guardar só alguns arquivos

```bash
git stash push -m "só o css" src/estilo.css
git stash push -p          # escolhe trecho por trecho (interativo)
```

### 6. Conflito ao aplicar

Se o código mudou desde o stash, o `pop` pode conflitar. Resolva igual a merge ([[Branches, Merge e Conflitos]]). Com conflito, o `pop` **não remove** o stash da pilha: depois de resolver, `git stash drop`.

### 7. Stash vira branch

Guardou há tempo e o código andou muito?

```bash
git stash branch feat/retomada stash@{0}   # cria branch no commit de origem e aplica lá
```

---

## 🛠️ Exemplo guiado

```bash
git init stash-lab && cd stash-lab
echo "v1" > app.txt && git add . && git commit -m "v1"

echo "mudança pela metade" >> app.txt
echo "novo" > novo.txt
git status                        # app.txt modificado, novo.txt untracked

git stash push -u -m "experimento"
git status                        # limpo!
cat app.txt                       # só "v1"

git stash list                    # stash@{0}: On main: experimento
git stash pop
git status                        # tudo de volta, inclusive novo.txt
```

---

## 🔧 Pegadinhas

- **Esquecer o `-u`.** Arquivo novo não vai pro stash e continua na pasta (ou some da sua cabeça).
- **Stash como arquivo morto.** Depois de uma semana ninguém lembra o que é `stash@{3}`. Se é trabalho que importa, faça um commit numa branch.
- **`stash clear` / `drop` sem olhar.** Apaga de vez. (Dá pra caçar no `git fsck`, mas é sofrimento.)
- **`pop` na branch errada.** Aplica as mudanças onde você está. Confira a branch antes.
- **Alternativa melhor pra interrupções longas:** [[Git Worktrees]] (outra pasta, outra branch, sem guardar nada).

---

## 🔨 Desafio prático

**Objetivo:** simular a interrupção urgente.

1. Num repositório, crie a branch `feat/x` e faça mudanças sem commitar, incluindo 1 arquivo novo.
2. Guarde tudo com nome (lembre do `-u`).
3. Vá pra `main`, faça um commit de "hotfix" e volte.
4. Recupere com `pop` e confirme que nada se perdeu.
5. Faça 2 stashes, liste, inspecione o mais antigo com `show -p`, aplique ele e apague o outro.

**Pronto quando:** o trabalho voltou inteiro (inclusive o arquivo novo) e `git stash list` está vazio no fim.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Pra que serve o `git stash`?
> Guardar temporariamente mudanças não commitadas e deixar a pasta limpa, pra trocar de branch ou fazer outra coisa, e recuperar depois.

> [!question]- Qual a diferença entre `stash pop` e `stash apply`?
> `pop` aplica e remove o stash da pilha; `apply` aplica e mantém.

> [!question]- Por que um arquivo novo não foi pro stash?
> Porque, por padrão, o stash só guarda arquivos rastreados. Use `git stash push -u`.

> [!question]- O que acontece com o stash se o `pop` der conflito?
> Ele continua na pilha; depois de resolver o conflito, é preciso apagar com `git stash drop`.

> [!question]- Quando é melhor um commit (ou worktree) em vez de stash?
> Quando o trabalho vai ficar parado por mais que alguns minutos/horas: stash é pra interrupções curtas.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git stash push -m "nome"` | guardar |
| `git stash push -u` | guardar incluindo arquivos novos |
| `git stash list` | listar |
| `git stash show -p stash@{n}` | ver conteúdo |
| `git stash pop` | aplicar e remover |
| `git stash apply stash@{n}` | aplicar e manter |
| `git stash drop stash@{n}` | apagar um |
| `git stash branch nome` | virar branch |

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

- [Pro Git · Stashing and Cleaning](https://git-scm.com/book/pt-br/v2/Ferramentas-do-Git-Stashing-and-Cleaning)
- [Documentação · git stash](https://git-scm.com/docs/git-stash)

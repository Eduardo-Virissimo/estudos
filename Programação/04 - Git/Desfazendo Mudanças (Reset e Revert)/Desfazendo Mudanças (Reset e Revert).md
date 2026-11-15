---
nivel: escrito
revisado:
---

# Desfazendo Mudanças (Reset e Revert)

> *"No Git, quase nada se perde de verdade. Desde que você tenha commitado."*

> [!tip] ⚡ Em 30 segundos
> Pra cada tipo de "ops" há um comando. Mudança **não commitada**: `git restore`. Último commit errado e **só seu**: `git commit --amend` ou `git reset`. Commit que **já foi pro GitHub**: `git revert`, que cria um commit novo desfazendo o antigo, sem reescrever o histórico. E quando tudo der errado, o `git reflog` lembra por onde você passou e deixa voltar.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escolher o comando certo pra cada situação (restore, amend, reset, revert)
- Explicar os três modos do `reset` (`--soft`, `--mixed`, `--hard`)
- Recuperar commits "perdidos" com `git reflog`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Git Básico]] · [[Branches, Merge e Conflitos]] · [[Rebase e Cherry Pick]]
- **Depois:** [[Tags e Versionamento Semântico]] · [[Rollback]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Tabela de decisão

| O que aconteceu | Comando |
|---|---|
| Mexi num arquivo e quero descartar | `git restore arquivo` |
| Dei `add` sem querer | `git restore --staged arquivo` |
| Mensagem do último commit errada (sem push) | `git commit --amend -m "nova"` |
| Esqueci um arquivo no último commit (sem push) | `git add arquivo` + `git commit --amend --no-edit` |
| Quero desfazer os últimos commits, **mantendo** as mudanças (sem push) | `git reset --soft HEAD~1` |
| Quero jogar fora os últimos commits **e** as mudanças (sem push) | `git reset --hard HEAD~1` ⚠️ |
| Commit **já enviado** precisa ser desfeito | `git revert <hash>` |
| Fiz besteira e perdi commits | `git reflog` + `git reset --hard <hash>` |

A grande pergunta: **o commit já foi pro remoto (outras pessoas podem ter)?** Se sim, `revert`. Se não, pode reescrever.

### 2. `git reset`: mover a branch pra trás

`HEAD~1` = "um commit antes do atual". `HEAD~3` = três antes.

```text
antes:   A ── B ── C   ← main
git reset HEAD~1
depois:  A ── B        ← main   (C "sai" do histórico)
```

O que acontece com as mudanças de `C` depende do modo:

| Modo | Histórico | Staging | Arquivos na pasta |
|---|---|---|---|
| `--soft` | volta | mudanças de C ficam **staged** | mantidos |
| `--mixed` (padrão) | volta | limpo | mudanças de C ficam **na pasta** |
| `--hard` | volta | limpo | **apagados** ⚠️ |

```bash
git reset --soft HEAD~3    # "desfaz" 3 commits, mantém tudo staged: ótimo pra refazer como 1 commit
git reset HEAD~1           # desfaz o commit, mudanças voltam pra pasta
git reset --hard origin/main  # joga fora tudo local e fica igual ao remoto ⚠️
```

### 3. `git revert`: o desfazer seguro

```bash
git revert a1b2c3d         # cria um commit NOVO que faz o contrário de a1b2c3d
git push                   # push normal, sem forçar nada
```

```text
A ── B ── C ── C̄   ← main   (C̄ = "Revert C")
```

O histórico conta a verdade: "fizemos C, depois desfizemos". Ninguém precisa de `--force`. É o jeito certo em `main` compartilhada e o que um [[Rollback]] de produção costuma fazer.

Reverter um merge: `git revert -m 1 <hash-do-merge>` (o `-m 1` diz qual lado manter).

### 4. `git reflog`: o salva-vidas

O reflog registra **cada** posição em que o `HEAD` esteve, mesmo de commits que não aparecem mais no `log`:

```bash
git reset --hard HEAD~3    # ops, não era pra ter feito isso
git reflog
# 9f8e7d6 HEAD@{0}: reset: moving to HEAD~3
# 3c4d5e6 HEAD@{1}: commit: feat: adiciona filtro   ← era aqui!
git reset --hard 3c4d5e6   # de volta, tudo recuperado
```

Funciona por ~90 dias e **só pra coisas commitadas**. Mudança nunca commitada e descartada com `restore` ou `reset --hard` não volta.

### 5. `git clean`: arquivos novos

```bash
git clean -n     # mostra o que SERIA apagado (dry run)
git clean -fd    # apaga arquivos e pastas não rastreados ⚠️
```

---

## 🛠️ Exemplo guiado

Reescrevendo 3 commits bagunçados como 1 (antes do push):

```bash
git log --oneline
# c3 agora vai
# c2 typo
# c1 começa filtro
# b0 versão estável

git reset --soft HEAD~3        # volta pro b0, mudanças de c1..c3 ficam staged
git commit -m "feat: adiciona filtro por prioridade"
git log --oneline
# n1 feat: adiciona filtro por prioridade
# b0 versão estável
```

E desfazendo algo que já está no GitHub:

```bash
git log --oneline
# x9 feat: muda cálculo de XP   ← quebrou produção, já está no remoto

git revert x9
git push
```

---

## 🔧 Pegadinhas

- **`reset --hard` com trabalho não commitado.** Apaga sem volta. Na dúvida, `git stash` antes ([[Stash]]).
- **`reset` em commit já enviado.** Força push, quebra o histórico dos colegas. Use `revert`.
- **Confundir `reset` e `revert`.** `reset` apaga commits do histórico (reescreve); `revert` adiciona um commit que desfaz (preserva).
- **`amend` depois do push.** Mesmo problema do reset: muda o hash. Só em commit local.
- **`git clean -fd` sem `-n` antes.** Apaga `.env` e arquivos que você ainda não adicionou.
- **`git checkout arquivo` em tutoriais antigos.** É o antigo `git restore arquivo`.

---

## 🔨 Desafio prático

**Objetivo:** errar de propósito e consertar.

1. Faça 4 commits num repositório de teste.
2. Junte os 2 últimos em 1 com `reset --soft`.
3. Faça um `reset --hard HEAD~2` "sem querer" e recupere tudo com `reflog`.
4. Faça um commit, finja que ele já foi enviado e desfaça com `revert`.
5. Crie arquivos lixo e limpe com `clean` (primeiro `-n`).

**Pronto quando:** você recuperou os commits "perdidos" do passo 3 e o log mostra o commit de revert do passo 4.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `git reset` e `git revert`?
> `reset` move a branch pra trás e tira commits do histórico (reescreve); `revert` cria um commit novo que desfaz um antigo (preserva o histórico).

> [!question]- Qual usar num commit que já foi enviado pro GitHub?
> `git revert`, porque não reescreve o histórico e não exige push forçado.

> [!question]- Qual a diferença entre `reset --soft`, `--mixed` e `--hard`?
> Todos voltam o histórico. `--soft` mantém as mudanças staged; `--mixed` mantém na pasta mas fora do staging; `--hard` apaga as mudanças.

> [!question]- Como recuperar commits depois de um `reset --hard` errado?
> Achando o hash no `git reflog` e fazendo `git reset --hard <hash>`.

> [!question]- O reflog recupera mudanças que nunca foram commitadas?
> Não. Ele só registra posições de commits; trabalho nunca commitado e descartado se perde.

> [!question]- O que `HEAD~2` significa?
> Dois commits antes do commit atual.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git restore arquivo` | descarta mudança na pasta |
| `git restore --staged arquivo` | tira do staging |
| `git commit --amend` | refaz o último commit (sem push) |
| `git reset --soft HEAD~n` | volta n commits, mantém staged |
| `git reset HEAD~n` | volta n commits, mudanças na pasta |
| `git reset --hard HEAD~n` | volta e apaga ⚠️ |
| `git revert hash` | commit que desfaz (seguro) |
| `git reflog` | histórico do HEAD |
| `git clean -n` / `-fd` | ver / apagar não rastreados |

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

- [Oh Shit, Git!?!](https://ohshitgit.com/pt_BR): receitas pra cada enrascada
- [Pro Git · Desfazendo coisas](https://git-scm.com/book/pt-br/v2/Fundamentos-de-Git-Desfazendo-coisas)
- [Pro Git · Reset desmistificado](https://git-scm.com/book/pt-br/v2/Ferramentas-do-Git-Reset-Desmistificado)

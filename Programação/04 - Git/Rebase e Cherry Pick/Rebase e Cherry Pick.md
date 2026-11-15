---
nivel: escrito
revisado:
---

# Rebase e Cherry Pick

> *"Nunca reescreva o histórico que outra pessoa já baixou."* (a regra de ouro do rebase)

> [!tip] ⚡ Em 30 segundos
> **Rebase** pega os commits da sua branch e os **reaplica em cima** de outra base, como se você tivesse começado a partir da `main` mais nova: histórico **linear**, sem commits de merge. **Rebase interativo** (`-i`) deixa juntar, renomear, reordenar ou apagar commits antes de abrir o PR. **Cherry-pick** copia **um commit específico** de outra branch pra atual. Os dois **reescrevem** commits (geram hashes novos): use só em commits que ninguém mais tem.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Atualizar uma branch com `git rebase main` e explicar a diferença pro merge
- Limpar commits com rebase interativo (squash, reword, drop)
- Trazer um commit específico com `cherry-pick`, e saber quando **não** usar nada disso

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Branches, Merge e Conflitos]]
- **Depois:** [[Desfazendo Mudanças (Reset e Revert)]] · [[Git Flow]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Merge × rebase

A `main` andou (commit `E`) enquanto você fazia `C` e `D`:

```text
          C ── D   ← feat
         /
A ── B ── E        ← main
```

**`git merge main`** (na feat): cria um commit de merge `M`. Preserva a história real, mas o grafo fica trançado.

```text
          C ── D ── M   ← feat
         /         /
A ── B ── E ───────
```

**`git rebase main`** (na feat): "tira" `C` e `D`, coloca a feat em cima de `E` e reaplica como `C'` e `D'` (commits **novos**, hash diferente).

```text
A ── B ── E ── C' ── D'   ← feat
```

Linha reta, como se você tivesse começado agora.

### 2. Fazendo rebase

```bash
git switch feat/filtro
git fetch origin
git rebase origin/main
```

Com conflito, ele para **em cada commit** que conflitar:

```bash
# resolve os arquivos (igual a merge), depois:
git add arquivo.ts
git rebase --continue     # vai pro próximo commit
git rebase --abort        # ou desiste e volta tudo ao que era
```

### 3. Depois do rebase: push com força (com cuidado)

Os commits mudaram de hash; o remoto recusa o push normal. Na **sua** branch:

```bash
git push --force-with-lease   # força, MAS falha se alguém tiver enviado algo que você não viu
```

Nunca `--force` na `main` ou em branch compartilhada.

### 4. Rebase interativo: arrumar antes do PR

```bash
git rebase -i HEAD~4     # mexer nos últimos 4 commits
```

Abre um arquivo:

```text
pick a1b2c3d feat: adiciona filtro
pick d4e5f6a wip
pick 7a8b9c0 corrige typo
pick 1d2e3f4 feat: adiciona testes do filtro
```

Troque `pick` por:

| Comando | O que faz |
|---|---|
| `pick` | mantém |
| `reword` (`r`) | mantém, mas muda a mensagem |
| `squash` (`s`) | junta com o commit de cima, combinando mensagens |
| `fixup` (`f`) | junta com o de cima, descartando a mensagem |
| `drop` (`d`) | apaga o commit |
| (mudar a ordem das linhas) | reordena |

```text
pick a1b2c3d feat: adiciona filtro
fixup d4e5f6a wip
fixup 7a8b9c0 corrige typo
pick 1d2e3f4 feat: adiciona testes do filtro
```

Resultado: 2 commits limpos em vez de 4.

> Atalho do dia a dia: commit de correção com `git commit --fixup=a1b2c3d` e depois `git rebase -i --autosquash main`: o Git já posiciona os fixups.

### 5. Cherry-pick: um commit só

Corrigiu um bug na sua branch e a `main` precisa da correção **agora**, sem o resto?

```bash
git switch main
git cherry-pick 7a8b9c0        # copia esse commit pra cá (com hash novo)
git cherry-pick a1b2 d4e5      # vários
git cherry-pick --abort        # se der conflito e quiser desistir
```

Usos típicos: levar um hotfix pra uma branch de release; resgatar um commit de uma branch abandonada.

### 6. Quando usar o quê

| Situação | Use |
|---|---|
| Atualizar **sua** branch local com a `main` | `rebase` (ou merge, se o time preferir) |
| Limpar commits antes de abrir/atualizar o PR | `rebase -i` |
| Juntar o PR na `main` | o botão do GitHub (merge, squash ou rebase, conforme a regra do time) |
| Branch que outras pessoas usam | **merge**, nunca rebase |
| Levar 1 correção pra outra branch | `cherry-pick` |

---

## 🛠️ Exemplo guiado

```bash
git init rebase-lab && cd rebase-lab
echo a > a.txt && git add . && git commit -m "A"
git switch -c feat
echo c > c.txt && git add . && git commit -m "C"
echo d > d.txt && git add . && git commit -m "D"
git switch main
echo e > e.txt && git add . && git commit -m "E"

git switch feat
git log --oneline --graph --all   # trançado
git rebase main
git log --oneline --graph --all   # linha reta: A - E - C' - D'
```

Compare os hashes de C e D antes e depois: mudaram. É isso que "reescrever o histórico" quer dizer.

---

## 🔧 Pegadinhas

- **Rebase em branch compartilhada.** Os colegas ficam com commits "fantasmas" que não existem mais. Só rebase no que é **só seu**.
- **`--force` em vez de `--force-with-lease`.** Pode apagar o push de outra pessoa sem aviso.
- **Entrar em pânico no meio do rebase.** `git status` diz onde você está; `git rebase --abort` volta ao início.
- **Perdeu commits num rebase errado?** `git reflog` lista tudo por onde o `HEAD` passou; `git reset --hard <hash do reflog>` volta. Veja [[Desfazendo Mudanças (Reset e Revert)]].
- **Cherry-pick demais.** Copiar commits entre branches toda hora gera duplicatas e conflitos depois. É ferramenta de exceção.

---

## 🔨 Desafio prático

**Objetivo:** limpar e atualizar uma branch.

1. Faça o exemplo guiado.
2. Na `feat`, faça 3 commits bagunçados ("wip", "typo", "agora vai").
3. Com `rebase -i`, transforme em 1 commit com mensagem boa.
4. Crie outra branch com um commit de correção e traga **só ele** pra `main` com `cherry-pick`.
5. Provoque um conflito durante um rebase e resolva com `--continue`.

**Pronto quando:** `git log --oneline --graph --all` mostra um histórico linear e limpo, e você sabe dizer por que os hashes mudaram.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre merge e rebase?
> Merge junta as duas linhas criando um commit de merge (preserva a história real); rebase reaplica seus commits em cima da outra base, criando commits novos e um histórico linear.

> [!question]- Qual a regra de ouro do rebase?
> Não fazer rebase de commits que outras pessoas já têm (branch compartilhada ou já enviada pra outros).

> [!question]- Por que depois de um rebase o push normal é recusado?
> Porque os commits foram recriados com hashes novos; o remoto vê históricos diferentes. Na sua branch, usa-se `git push --force-with-lease`.

> [!question]- Qual a diferença entre `squash` e `fixup` no rebase interativo?
> Os dois juntam o commit com o anterior; `squash` combina as mensagens, `fixup` descarta a mensagem do commit juntado.

> [!question]- Pra que serve o cherry-pick?
> Copiar um commit específico de outra branch pra branch atual, sem trazer o resto.

> [!question]- Por que `--force-with-lease` é melhor que `--force`?
> Porque recusa o envio se o remoto tiver commits que você ainda não viu, evitando apagar o trabalho de outra pessoa.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git rebase main` | reaplica a branch atual em cima da main |
| `git rebase --continue` / `--abort` | seguir / desistir |
| `git rebase -i HEAD~3` | editar os últimos 3 commits |
| `git commit --fixup=hash` + `rebase -i --autosquash` | correção automática |
| `git push --force-with-lease` | push depois de rebase (só branch sua) |
| `git cherry-pick hash` | copiar um commit |
| `git reflog` | onde o HEAD já esteve (salva-vidas) |

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

- [Pro Git · Rebase](https://git-scm.com/book/pt-br/v2/Branches-no-Git-Rebase)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR): níveis de rebase e cherry-pick
- [Atlassian · Merging vs. Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

---
nivel: escrito
revisado:
---

# Branches, Merge e Conflitos

> *"Conflito não é erro. É o Git sendo honesto: 'duas pessoas mexeram aqui, decida você'."*

> [!tip] ⚡ Em 30 segundos
> Uma **branch** é uma linha de trabalho paralela: você testa uma ideia sem mexer na `main`. Criar é instantâneo (`git switch -c nome`). Quando termina, **merge** junta a branch de volta. Se as duas linhas mudaram **as mesmas linhas** do mesmo arquivo, dá **conflito**: o Git marca o trecho com `<<<<<<<`, você escolhe o que fica, salva, `add` e `commit`. Assusta na primeira vez; vira rotina na décima.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Criar, trocar, listar e apagar branches
- Fazer merge e explicar a diferença entre fast-forward e merge commit
- Resolver um conflito sem perder trabalho

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Git Básico]] · [[GitHub e Pull Requests]]
- **Depois:** [[Rebase e Cherry Pick]] · [[Stash]] · [[Git Flow]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O que é uma branch, de verdade

Uma branch é só um **ponteiro** pra um commit, que anda sozinho quando você commita. `HEAD` aponta pra branch em que você está.

```text
          C ── D   ← feat/filtro (HEAD)
         /
A ── B ── E        ← main
```

Por isso criar branch é instantâneo: não copia arquivo nenhum.

### 2. Comandos

```bash
git branch                     # lista (a atual tem *)
git switch -c feat/filtro      # cria e troca (forma moderna)
git switch main                # troca
git branch -d feat/filtro      # apaga (só se já foi juntada)
git branch -D feat/filtro      # apaga à força (perde commits não juntados!)
git branch -a                  # inclui as remotas
```

> Tutoriais antigos usam `git checkout -b`. Faz o mesmo que `git switch -c`.

**Nomes:** `feat/filtro-prioridade`, `fix/titulo-vazio`, `docs/readme`. Curtos, em minúsculas, com o tipo na frente.

### 3. Merge

```bash
git switch main
git merge feat/filtro
```

Dois resultados possíveis:

**Fast-forward:** a `main` não andou desde que a branch saiu. O Git só move o ponteiro, sem commit novo.

```text
A ── B ── C ── D   ← main, feat/filtro
```

**Merge commit:** as duas andaram. O Git cria um commit que junta as duas pontas.

```text
          C ── D
         /      \
A ── B ── E ──── M   ← main
```

### 4. Conflito: anatomia

Você e a `main` mudaram a mesma linha:

```text
CONFLICT (content): Merge conflict in src/tarefas.ts
Automatic merge failed; fix conflicts and then commit the result.
```

O arquivo fica assim:

```ts
<<<<<<< HEAD
const LIMITE = 50;
=======
const LIMITE_TAREFAS = 100;
>>>>>>> feat/filtro
```

- Entre `<<<<<<< HEAD` e `=======`: o que está na branch onde você está (a `main`).
- Entre `=======` e `>>>>>>>`: o que vem da branch que você está juntando.

### 5. Resolvendo

1. `git status` lista os arquivos em conflito ("both modified").
2. Abra cada um. Decida: fica um, fica o outro, ou **uma combinação** (`const LIMITE_TAREFAS = 50;`).
3. **Apague os marcadores** `<<<<<<<`, `=======`, `>>>>>>>`.
4. Rode o programa/testes: compila? funciona?
5. `git add src/tarefas.ts` (marca como resolvido) e `git commit` (a mensagem de merge já vem pronta).

No [[VS Code]], aparecem botões em cima do conflito: **Accept Current**, **Accept Incoming**, **Accept Both** e o **Merge Editor** de 3 painéis.

Desistiu no meio? `git merge --abort` volta tudo como estava antes do merge.

### 6. Atualizando sua branch com a `main`

A `main` andou enquanto você trabalhava? Traga as mudanças pra **sua** branch e resolva conflitos lá, não na `main`:

```bash
git switch feat/filtro
git merge main            # ou: git rebase main (veja Rebase e Cherry Pick)
```

### 7. Evitando conflitos

- Branches **curtas** (horas ou poucos dias), PRs pequenos.
- `git pull` / atualizar a branch com frequência.
- Não reformatar o arquivo inteiro junto com uma mudança de lógica (o [[Formatter]] no projeto todo resolve isso de vez).

---

## 🛠️ Exemplo guiado

Provocando um conflito de propósito:

```bash
git init conflito && cd conflito
echo "cor = azul" > config.txt
git add . && git commit -m "config inicial"

git switch -c tema-escuro
echo "cor = preto" > config.txt
git commit -am "muda cor pra preto"

git switch main
echo "cor = verde" > config.txt
git commit -am "muda cor pra verde"

git merge tema-escuro        # CONFLICT
cat config.txt
# <<<<<<< HEAD
# cor = verde
# =======
# cor = preto
# >>>>>>> tema-escuro

echo "cor = preto" > config.txt   # decidiu: fica preto
git add config.txt
git commit -m "Merge tema-escuro: mantém cor preta"
git log --oneline --graph
```

---

## 🔧 Pegadinhas

- **Commitar os marcadores.** `<<<<<<<` no código quebra tudo. Busque por `<<<<<<<` antes de commitar.
- **Aceitar um lado sem ler.** "Accept Incoming" em tudo pode apagar a correção de outra pessoa. Leia os dois lados.
- **Resolver e não testar.** Os dois lados compilavam sozinhos; a combinação pode não compilar.
- **Trocar de branch com mudanças não commitadas.** O Git leva as mudanças junto ou se recusa a trocar. Commite ou use [[Stash]].
- **Branch de semanas.** Quanto mais tempo separada, mais conflito. Junte cedo.
- **`-D` sem pensar.** Apaga commits que não estão em lugar nenhum (dá pra recuperar com `git reflog`, por um tempo).

---

## 🔨 Desafio prático

**Objetivo:** resolver 3 tipos de conflito.

1. Reproduza o exemplo guiado e resolva escolhendo **um** lado.
2. Faça outro conflito e resolva **combinando** os dois (ex: uma branch muda o nome, outra muda o valor).
3. Faça um conflito em **2 arquivos** e resolva pelo Merge Editor do VS Code.
4. Comece um merge com conflito e desista com `git merge --abort`.

**Pronto quando:** `git log --graph` mostra os merges, nenhum arquivo tem marcador e você consegue explicar o que era `HEAD` e o que era o outro lado em cada caso.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que é uma branch no Git?
> Um ponteiro móvel pra um commit; anda sozinho a cada commit novo. Por isso criar uma é instantâneo.

> [!question]- Qual a diferença entre merge fast-forward e merge commit?
> Fast-forward só move o ponteiro (a branch de destino não tinha andado); merge commit cria um commit novo juntando as duas linhas.

> [!question]- Quando acontece um conflito?
> Quando as duas branches mudaram as mesmas linhas de um arquivo (ou uma apagou o que a outra mudou) e o Git não sabe qual manter.

> [!question]- O que fica entre `<<<<<<< HEAD` e `=======`?
> A versão da branch em que você está; entre `=======` e `>>>>>>>` fica a versão da branch que está sendo juntada.

> [!question]- Quais são os passos pra resolver um conflito?
> Editar o arquivo escolhendo/combinando, apagar os marcadores, testar, `git add` no arquivo e `git commit`.

> [!question]- Como desistir de um merge com conflito?
> `git merge --abort`.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git switch -c nome` | criar e trocar |
| `git switch nome` | trocar |
| `git branch` / `-a` | listar |
| `git branch -d nome` | apagar (já juntada) |
| `git merge nome` | juntar na atual |
| `git merge --abort` | desistir do merge |
| `git log --oneline --graph --all` | ver o desenho |
| `git diff --name-only --diff-filter=U` | arquivos em conflito |

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

- [Pro Git · Branches](https://git-scm.com/book/pt-br/v2/Branches-no-Git-Branches-em-poucas-palavras)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR): níveis "Introdução" e "Rampa acima"
- [VS Code · Merge conflicts](https://code.visualstudio.com/docs/sourcecontrol/overview#_merge-conflicts)

---
nivel: escrito
foco: importante
revisado:
---

# Stash

**Quanto focar: 📌 importante.** É um quebra-galho do dia a dia, simples de aprender. Meia hora resolve.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 5 min no Me teste e 20 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você está no meio do filtro de prioridade. Metade feito, nada commitado, três arquivos abertos. E chega a mensagem: "urgente, o comando `add` está quebrado na `main`!". Você precisa ir pra `main` agora. Mas commitar trabalho pela metade, com o código nem compilando, deixaria um commit quebrado no histórico. E se você tentar trocar de branch assim mesmo, o Git recusa.

O `git stash` existe pra esse momento. Ele **guarda** as suas mudanças numa espécie de gaveta, e deixa a pasta limpa, como se você não tivesse mexido em nada. Você troca de branch, corrige o bug, volta, e roda `git stash pop` pra tirar tudo da gaveta e continuar de onde parou.

É uma ferramenta pequena e muito útil, com um limite claro: ela é pra **interrupções rápidas**, não pra guardar código por semanas. E tem um detalhe que pega quase todo mundo na primeira vez, sobre arquivos novos, que esta nota faz questão de explicar. Ajuda ter passado por [[Branches, Merge e Conflitos]] e pelo [[Git Básico]].

## Guardar e trazer de volta

O cenário clássico, do jeito que acontece:

```bash
git switch feat/filtro
# ...metade do filtro feito, nada commitado...
# "Urgente: o comando add está quebrado na main!"
git switch main
# error: Your local changes would be overwritten by checkout. Please commit or stash them.
```

O Git não está sendo chato: está protegendo o seu trabalho. Se ele trocasse de branch com essas mudanças no caminho, elas iam se misturar com a `main`, ou se perder. E a própria mensagem de erro já sugere a solução, *stash them*:

```bash
git stash push -m "filtro pela metade"  # guarda e limpa a pasta
git switch main
# ...corrige, commita, push...
git switch feat/filtro
git stash pop                           # traz de volta e tira da gaveta
```

Pense numa mesa de trabalho. O stash é uma gaveta onde você joga tudo o que está espalhado em cima da mesa, pra liberar espaço pra uma tarefa urgente. Quando termina, abre a gaveta, coloca tudo de volta na mesa, e continua exatamente de onde parou.

Um `git stash` sozinho, sem mensagem, também funciona. Mas dê um nome. Com três coisas guardadas, um "WIP on feat" não diz nada, e você não vai lembrar qual é qual.

E um cuidado na volta: o `pop` aplica as mudanças **onde você está agora**. Se você esquecer de voltar pra `feat/filtro` antes, o filtro pela metade vai parar dentro da `main`. Confira a branch antes de dar o `pop`.

## O arquivo novo que ficou pra trás

Agora o detalhe que pega quase todo mundo. Por padrão, o stash só guarda os arquivos que o Git **já conhece**, os que já foram commitados alguma vez. Um arquivo que você **acabou de criar** fica pra trás, na pasta, sem aviso nenhum.

Veja acontecer:

```bash
git init stash-lab && cd stash-lab
echo "v1" > app.txt && git add . && git commit -m "v1"

echo "mudança pela metade" >> app.txt
echo "novo" > novo.txt
git status                        # app.txt modificado, novo.txt untracked

git stash push -u -m "experimento"
git status                        # limpo!

git stash pop
git status                        # tudo de volta, inclusive novo.txt
```

O segredo está no `-u` (de *untracked*, "não rastreado"): ele faz o stash levar também os arquivos novos. Sem ele, o `novo.txt` continuaria na pasta, e iria junto com você pra outra branch, misturando o trabalho pela metade com a correção urgente. Então, na dúvida, use sempre `git stash push -u`.

## A pilha de stashes

Dá pra guardar mais de uma coisa. Os stashes ficam numa pilha, com o mais recente no topo:

```bash
git stash list
# stash@{0}: On feat/filtro: filtro pela metade
# stash@{1}: On main: teste de cor

git stash show -p stash@{1}   # ver o conteúdo
git stash apply stash@{1}     # aplica e MANTÉM na pilha
git stash pop stash@{1}       # aplica e TIRA da pilha
git stash drop stash@{1}      # apaga sem aplicar
git stash clear               # apaga todos ⚠️
```

A diferença entre o `apply` e o `pop` é pequena e útil. O `pop` tira da gaveta: aplica e apaga. O `apply` aplica, mas deixa uma cópia lá, o que serve quando você quer aplicar a mesma coisa em duas branches.

E aqui está o limite de que a nota falava no começo. É muito fácil transformar o stash num arquivo morto: você guarda uma coisa, guarda outra, e depois de uma semana ninguém lembra o que é o `stash@{3}`, nem se ele ainda importa. Se é um trabalho que vale a pena guardar por mais do que algumas horas, faça um commit numa branch. E lembre que o `drop` e o `clear` apagam **de vez**.

## Quando o pop dá conflito

Se o código mudou desde que você guardou as coisas, o `pop` pode dar conflito, do mesmo jeito que um merge. Resolva igual a um merge ([[Branches, Merge e Conflitos]]). Só tem um detalhe: quando dá conflito, o `pop` **não tira** o stash da pilha, por segurança. Depois de resolver, apague você mesmo, com `git stash drop`.

E se faz muito tempo que você guardou, e o código andou demais, existe um caminho mais tranquilo: transformar o stash numa branch nova.

```bash
git stash branch feat/retomada stash@{0}  # cria uma branch no ponto de origem e aplica lá
```

Ele cria a branch exatamente no commit onde você estava quando guardou, e aplica o stash lá, onde ele não conflita com nada.

Pra fechar, dois truques. Dá pra guardar só **uma parte** das mudanças:

```bash
git stash push -m "só o css" src/estilo.css   # só este arquivo
git stash push -p                              # escolhe trecho por trecho
```

E pra interrupções longas, existe uma alternativa melhor que o stash: as [[Git Worktrees]], que abrem outra branch em outra pasta, sem você precisar guardar nada.

## O essencial

1. `git stash push -m "nome"` guarda as mudanças e limpa a pasta; `git stash pop` traz de volta.
2. Arquivos novos não vão por padrão: use `-u`.
3. O `pop` aplica onde você está: confira a branch antes.
4. `pop` tira da pilha; `apply` mantém uma cópia.
5. Stash é pra interrupção curta. Trabalho que importa vira commit numa branch.

## Agora é com você

Simule a interrupção urgente. Num repositório, crie a branch `feat/x` e faça algumas mudanças sem commitar, incluindo um arquivo novo. Guarde tudo com um nome (e lembre do `-u`). Vá pra `main`, faça um commit de "hotfix", e volte. Recupere com `pop`, e confirme que nada se perdeu, inclusive o arquivo novo. Depois, faça dois stashes, liste, inspecione o mais antigo com `show -p`, aplique ele, e apague o outro. Você terminou quando o trabalho tiver voltado inteiro e o `git stash list` estiver vazio no fim.

Daqui, siga pro [[Desfazendo Mudanças (Reset e Revert)]] e pras [[Git Worktrees]].

---

## 🧠 Me teste

> [!question]- Pra que serve o `git stash`?
> Guardar temporariamente mudanças não commitadas e deixar a pasta limpa, pra trocar de branch ou fazer outra coisa, e recuperar depois.

> [!question]- Qual a diferença entre `stash pop` e `stash apply`?
> `pop` aplica e remove o stash da pilha; `apply` aplica e mantém.

> [!question]- Por que um arquivo novo não foi pro stash?
> Porque, por padrão, o stash só guarda arquivos rastreados. Use `git stash push -u`.

> [!question]- O que acontece com o stash se o `pop` der conflito?
> Ele continua na pilha; depois de resolver o conflito, é preciso apagar com `git stash drop`.

> [!question]- Por que conferir a branch antes do `pop`?
> Porque ele aplica as mudanças onde você está; na branch errada, o trabalho pela metade vai parar lá.

> [!question]- Quando é melhor um commit (ou worktree) em vez de stash?
> Quando o trabalho vai ficar parado por mais que alguns minutos/horas: stash é pra interrupções curtas.

> [!question]+ Você criou `novo.ts` (nunca adicionado) e rodou `git stash`. O que aconteceu com ele?
> - a) Foi pro stash junto com o resto
> - b) Ficou na pasta: stash ignora arquivo não rastreado por padrão
> - c) Foi apagado
> - d) Foi commitado
>
> > [!check]- Resposta
> > **b)** Por padrão o stash só guarda arquivos rastreados. Pra incluir os novos, use `git stash -u`.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git stash push -m "nome"` | Guardar |
| `git stash push -u` | Guardar incluindo arquivos novos |
| `git stash list` | Listar |
| `git stash show -p stash@{n}` | Ver o conteúdo |
| `git stash pop` | Aplicar e remover |
| `git stash apply stash@{n}` | Aplicar e manter |
| `git stash drop stash@{n}` | Apagar um |
| `git stash branch nome` | Virar uma branch |

**Pra ler:** o capítulo [Stashing and Cleaning do Pro Git](https://git-scm.com/book/pt-br/v2/Ferramentas-do-Git-Stashing-and-Cleaning) cobre o stash e o `git clean` com exemplos. E a [documentação do git stash](https://git-scm.com/docs/git-stash) lista todas as opções, pra quando você precisar de algo específico.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

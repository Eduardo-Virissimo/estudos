---
nivel: escrito
foco: importante
revisado:
---

# Rebase e Cherry Pick

**Quanto focar: 📌 importante.** Muitos times usam rebase no fluxo diário. Entenda o que fazem e quando é perigoso; pratique em um repo de teste.

**Quanto tempo:** cerca de 1h15: 20 min de leitura, 5 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você passou dois dias numa branch, e o histórico dela está assim: "começa filtro", "wip", "corrige typo", "agora vai", "agora vai mesmo". Enquanto isso, a `main` andou, e você precisa trazer as mudanças dela. Se fizer um merge, ganha mais um commit no meio da bagunça, e o desenho do histórico vira uma trança. Na hora de abrir o pull request, quem for revisar vai ter que ler o seu processo inteiro de tentativa e erro.

Existe um jeito de arrumar tudo isso antes de mostrar pra alguém. O **rebase** pega os commits da sua branch e os **reaplica em cima** de outra base, como se você tivesse começado a partir da `main` mais nova. O resultado é um histórico em linha reta, sem commits de merge. O **rebase interativo** (`-i`) vai além: junta, renomeia, reordena ou apaga commits. E o **cherry-pick** copia **um commit específico** de uma branch pra outra.

São ferramentas poderosas, e por isso mesmo elas têm **uma regra** que você não pode esquecer nunca: elas **reescrevem** commits. Então só se usa em commits que ninguém mais tem. Essa regra é o centro da nota. Ajuda ter passado por [[Branches, Merge e Conflitos]].

## Trançado ou em linha reta

O cenário: a `main` andou (com o commit `E`) enquanto você fazia o `C` e o `D` na sua branch.

```text
          C ── D   ← feat
         /
A ── B ── E        ← main
```

Você quer trazer o `E` pra sua branch. Existem dois jeitos, e eles deixam o histórico com caras bem diferentes.

O **`git merge main`** cria um commit de merge, o `M`, que junta as duas linhas. Ele preserva a história exatamente como aconteceu, mas o desenho fica trançado:

```text
          C ── D ── M   ← feat
         /         /
A ── B ── E ───────
```

Já o **`git rebase main`** faz uma coisa curiosa. Ele "tira" os seus commits do caminho, move a branch pra cima do `E`, e reaplica os seus commits, um por um, em cima dele:

```text
A ── B ── E ── C' ── D'   ← feat
```

Linha reta, como se você tivesse começado o trabalho agora, a partir da `main` mais nova. Mas repare nos apóstrofos: `C'` e `D'`. Eles **não são** os mesmos `C` e `D`. São commits **novos**, com o mesmo conteúdo, mas com identificadores (hashes) diferentes. Guarde esse detalhe, porque a regra de ouro inteira sai dele.

```bash
git switch feat/filtro
git fetch origin
git rebase origin/main
```

E se der conflito? O rebase para **em cada commit** que conflitar, um de cada vez:

```bash
# resolve os arquivos (igual a um merge) e depois:
git add arquivo.ts
git rebase --continue   # segue pro próximo commit
git rebase --abort      # ou desiste e volta tudo como era
```

Um rebase parado no meio de um conflito assusta, porque você fica "entre dois lugares". Mas duas coisas te mantêm seguro: o `git status` sempre diz onde você está e o que falta, e o `git rebase --abort` volta tudo pro início, como se nada tivesse acontecido.

## A regra de ouro

**Nunca faça rebase de commits que outras pessoas já têm.**

Por quê? Lembra que o rebase cria commits **novos**? Imagine que um colega já baixou os seus `C` e `D`. Aí você faz um rebase e cria o `C'` e o `D'`. Agora ele tem os antigos, e você tem os novos. Pro Git, são commits completamente diferentes, que só por acaso têm o mesmo conteúdo. Quando vocês dois tentarem juntar o trabalho, aparecem commits duplicados e conflitos que não fazem sentido nenhum.

Então a regra prática é: **na sua branch, que só você usa, rebase à vontade. Na `main` ou numa branch compartilhada, use merge.**

E tem uma consequência. Depois de um rebase numa branch que você já tinha enviado pro GitHub, o push normal é recusado, porque os commits mudaram e o GitHub vê dois históricos diferentes. Na **sua** branch, você força o envio:

```bash
git push --force-with-lease
```

O `--force-with-lease` força, mas com uma proteção: ele **falha** se alguém tiver enviado alguma coisa pra essa branch que você ainda não viu. É a versão segura do `--force`. O `--force` puro apaga sem aviso o que outra pessoa tiver enviado. E, nunca é demais repetir, **nunca force na `main`**.

Se algum dia você perder commits num rebase que deu errado, não entre em pânico: o `git reflog` lista todos os lugares por onde você passou, e um `git reset --hard <hash>` te leva de volta. A nota [[Desfazendo Mudanças (Reset e Revert)]] mostra como.

## Arrumando a casa antes da visita

Agora a parte mais útil do dia a dia. Enquanto você trabalha, é completamente normal fazer commits como "wip" e "corrige typo". É assim que todo mundo trabalha. Mas antes de abrir o PR, dá pra arrumar a casa, com o **rebase interativo**:

```bash
git rebase -i HEAD~4   # mexer nos últimos 4 commits
```

Isso abre um arquivo com a lista dos commits:

```text
pick a1b2c3d feat: adiciona filtro
pick d4e5f6a wip
pick 7a8b9c0 corrige typo
pick 1d2e3f4 feat: adiciona testes do filtro
```

E você troca o `pick` de cada linha pelo que quer fazer com aquele commit:

| Comando | O que faz |
|---|---|
| `pick` | mantém como está |
| `reword` (`r`) | mantém, mas muda a mensagem |
| `squash` (`s`) | junta com o commit de cima, combinando as mensagens |
| `fixup` (`f`) | junta com o de cima, descartando a mensagem |
| `drop` (`d`) | apaga o commit |
| (mudar a ordem das linhas) | reordena |

Por exemplo:

```text
pick a1b2c3d feat: adiciona filtro
fixup d4e5f6a wip
fixup 7a8b9c0 corrige typo
pick 1d2e3f4 feat: adiciona testes do filtro
```

O "wip" e o "corrige typo" se fundem no commit do filtro, e as mensagens deles somem. O resultado: dois commits limpos, em vez de quatro. Quem revisar o PR vê uma história clara, e não o seu processo de tentativa e erro.

E um atalho que você vai acabar usando: quando fizer um commit que corrige outro, use `git commit --fixup=a1b2c3d`. Depois, um `git rebase -i --autosquash main` já coloca o fixup no lugar certo sozinho, sem você precisar editar a lista.

## Cherry-pick: um commit só

Às vezes você quer **um commit específico** de outra branch, e não a branch inteira. O caso clássico: você corrigiu um bug na sua branch de funcionalidade, e a `main` precisa dessa correção **agora**, mas sem o resto da funcionalidade, que ainda não está pronta.

```bash
git switch main
git cherry-pick 7a8b9c0     # copia esse commit pra cá (com hash novo)
git cherry-pick a1b2 d4e5   # vários de uma vez
git cherry-pick --abort     # se der conflito e quiser desistir
```

O nome vem de "colher cerejas": você escolhe só as que quer. Os usos típicos são levar um hotfix pra uma branch de release, ou resgatar um commit de uma branch abandonada.

Mas o cherry-pick é ferramenta de exceção. Copiar commits entre branches com frequência gera duplicatas (o mesmo conteúdo em dois commits diferentes), e essas duplicatas viram conflito depois.

Pra resumir quando usar cada uma dessas ferramentas:

| Situação | Use |
|---|---|
| Atualizar **sua** branch com a `main` | `rebase` (ou merge, se o time preferir) |
| Limpar commits antes de abrir ou atualizar o PR | `rebase -i` |
| Juntar o PR na `main` | o botão do GitHub (merge, squash ou rebase, conforme a regra do time) |
| Branch que outras pessoas usam | **merge**, nunca rebase |
| Levar uma correção pra outra branch | `cherry-pick` |

## Vendo os hashes mudarem

Pra tornar a regra de ouro concreta, faça este experimento e olhe os hashes:

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

Compare os hashes do C e do D antes e depois do rebase. Mudaram. É exatamente isso que "reescrever o histórico" quer dizer, e é por isso que reescrever o histórico de outra pessoa causa problemas.

## O essencial

1. Merge junta com um commit de merge (trançado); rebase reaplica os seus commits em cima da base (linha reta).
2. Rebase cria commits novos, com hashes novos.
3. A regra de ouro: nunca faça rebase de commits que outras pessoas já têm.
4. Depois de rebase na sua branch: `git push --force-with-lease`. Nunca force na `main`.
5. `rebase -i` arruma os commits antes do PR; `cherry-pick` copia um commit só.

## Agora é com você

Limpe e atualize uma branch. Faça o experimento da seção anterior. Depois, na `feat`, faça três commits bagunçados ("wip", "typo", "agora vai"), e use o `rebase -i` pra transformar os três num só, com uma mensagem boa. Crie outra branch com um commit de correção, e traga **só ele** pra `main` com `cherry-pick`. Por fim, provoque um conflito durante um rebase e resolva com `--continue`. Você terminou quando o `git log --oneline --graph --all` mostrar um histórico linear e limpo, e você souber explicar por que os hashes mudaram.

Daqui, siga pro [[Desfazendo Mudanças (Reset e Revert)]] e pro [[Git Flow]].

---

## 🧠 Me teste

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

> [!question]+ Qual a regra de ouro do rebase?
> - a) Nunca fazer rebase da `main`
> - b) Não fazer rebase de commits que outras pessoas já puxaram
> - c) Sempre usar `--force` depois
> - d) Só fazer rebase com um commit
>
> > [!check]- Resposta
> > **b)** Rebase **reescreve** commits (novos hashes). Na branch compartilhada, isso diverge do histórico dos outros. Na sua branch local, à vontade.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git rebase main` | Reaplica a branch atual em cima da main |
| `git rebase --continue` / `--abort` | Seguir / desistir |
| `git rebase -i HEAD~3` | Editar os últimos 3 commits |
| `git commit --fixup=hash` + `rebase -i --autosquash` | Correção automática |
| `git push --force-with-lease` | Push depois do rebase (só na sua branch) |
| `git cherry-pick hash` | Copiar um commit |
| `git reflog` | Onde o HEAD já esteve (salva-vidas) |

**Pra ler e treinar:** o [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR) tem níveis inteiros de rebase e cherry-pick, e ver os commits "pulando" de lugar na tela é a melhor forma de entender. O capítulo de [Rebase do Pro Git](https://git-scm.com/book/pt-br/v2/Branches-no-Git-Rebase), em português, tem uma seção chamada "Os perigos do rebase" que explica a regra de ouro com um exemplo. E o artigo [Merging vs. Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing), da Atlassian, compara os dois com diagramas.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

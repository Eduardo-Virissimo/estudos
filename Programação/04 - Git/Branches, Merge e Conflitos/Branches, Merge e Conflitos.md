---
nivel: escrito
foco: essencial
revisado:
---

# Branches, Merge e Conflitos

**Quanto focar: 🔥 essencial.** Você vai trabalhar em branch e resolver conflito toda semana num time. Domine, principalmente o conflito, que é onde o iniciante trava.

O seu projeto funciona. Está limpo, testado, bonito. E aí você tem uma ideia arriscada: reescrever o jeito como as tarefas são filtradas. Pode ficar ótimo, ou pode quebrar tudo. Sem nenhuma proteção, você mexeria direto no código que funciona, e se a ideia der errado, teria que desfazer tudo na mão, lembrando de cada linha que mudou.

O Git tem uma resposta pra isso, e ela é uma das coisas mais úteis que ele faz. Uma **branch** é uma linha de trabalho paralela: você testa a ideia, ou desenvolve uma funcionalidade nova, sem encostar na `main`, que continua funcionando. Quando termina, o **merge** junta a branch de volta. Deu errado? Você apaga a branch, e é como se nada tivesse acontecido.

Só que às vezes, na hora de juntar, as duas linhas mudaram **as mesmas linhas** do mesmo arquivo. O Git não tem como saber qual delas está certa, e aí ele dá um **conflito**: marca o trecho e pede pra você decidir o que fica. Conflito assusta na primeira vez. Na décima, vira rotina. Esta nota quer te levar da primeira à décima. Ajuda já conhecer o [[Git Básico]] e o [[GitHub e Pull Requests]].

## Uma linha paralela

Pense numa branch como uma estrada que sai da principal, segue paralela por um tempo, e mais adiante pode voltar a se juntar a ela:

```text
          C ── D   ← feat/filtro (você está aqui)
         /
A ── B ── E        ← main
```

E aqui vem uma surpresa sobre como isso funciona por dentro. Uma branch **não é uma cópia** do projeto. É só um **ponteiro**: um nome que aponta pra um commit, e que anda sozinho pra frente a cada commit novo que você faz. Por isso criar uma branch é instantâneo, mesmo num projeto gigante: nenhum arquivo é copiado. E o `HEAD` é o nome do lugar onde você está agora.

```bash
git branch                  # lista (a atual tem *)
git switch -c feat/filtro   # cria e já troca pra ela
git switch main             # troca de branch
git branch -d feat/filtro   # apaga (só se já foi juntada)
git branch -a               # inclui as branches do GitHub
```

Em tutoriais mais antigos, você vai ver `git checkout -b nome`, que faz o mesmo que o `git switch -c nome`. E sobre os nomes: curtos, em minúsculas, com o tipo na frente, como `feat/filtro-prioridade`, `fix/titulo-vazio` ou `docs/readme`.

Duas armadilhas. A primeira: se você trocar de branch com mudanças que ainda não foram commitadas, o Git leva essas mudanças junto pra outra branch, ou se recusa a trocar, se elas conflitarem com o que tem lá. Commite antes, ou guarde temporariamente com o [[Stash]]. A segunda: o `git branch -D`, com D **maiúsculo**, apaga à força, mesmo uma branch com commits que nunca foram juntados em lugar nenhum. Dá pra recuperar com o `git reflog` por um tempo, mas é melhor não precisar.

## Juntando de volta

Quando a branch está pronta, você volta pra branch que vai **receber** as mudanças e traz a outra:

```bash
git switch main          # vai pra branch que vai RECEBER
git merge feat/filtro    # traz as mudanças da outra
```

O que acontece depende de uma coisa só: se a `main` andou ou não enquanto você trabalhava.

Se a `main` **ficou parada** desde que a sua branch saiu, o Git faz um **fast-forward** ("avanço rápido"). Ele simplesmente move o ponteiro da `main` pra frente, até onde a sua branch chegou, sem criar nenhum commit novo:

```text
A ── B ── C ── D   ← main, feat/filtro
```

Se as **duas andaram**, o Git cria um **merge commit**: um commit especial, que junta as duas pontas numa só:

```text
          C ── D
         /      \
A ── B ── E ──── M   ← main
```

Uma boa prática: se a `main` andou enquanto você trabalhava, traga as mudanças dela pra **sua** branch primeiro, e resolva os conflitos lá, não na `main`. Assim a `main` só recebe coisa que já foi resolvida e testada:

```bash
git switch feat/filtro
git merge main            # ou git rebase main (veja Rebase e Cherry Pick)
```

E um conselho que evita a maioria dos conflitos antes deles existirem: **branches curtas.** Quanto mais tempo uma branch fica separada, mais a `main` muda nesse meio tempo, e mais conflito aparece na volta. Uma branch de horas ou de poucos dias, com um pull request pequeno, quase nunca dá problema. Uma de três semanas quase sempre dá.

## O conflito, sem pânico

Esta é a parte que mais assusta, então vamos com calma. Você mudou uma linha na sua branch. Enquanto isso, alguém mudou **a mesma linha** na `main`. Na hora do merge, o Git não tem como saber qual das duas está certa, então ele para e te pergunta:

```text
CONFLICT (content): Merge conflict in src/tarefas.ts
Automatic merge failed; fix conflicts and then commit the result.
```

E o arquivo fica assim:

```ts
<<<<<<< HEAD
const LIMITE = 50;
=======
const LIMITE_TAREFAS = 100;
>>>>>>> feat/filtro
```

Esses símbolos estranhos são marcadores que o Git colocou no seu arquivo, e eles se leem assim. Entre o `<<<<<<< HEAD` e o `=======` está a versão da branch **onde você está**, a que está recebendo o merge. Entre o `=======` e o `>>>>>>> feat/filtro` está a versão que **está chegando**.

Repare que nenhuma das duas está "errada": cada pessoa fez uma mudança que fazia sentido. O seu trabalho é decidir o que o código deve ser **depois** de juntar as duas. Os passos:

1. Rode `git status`, que lista os arquivos em conflito como "both modified".
2. Abra cada um e decida: fica um dos lados, o outro, ou **uma combinação dos dois**. Neste exemplo, talvez o certo seja `const LIMITE_TAREFAS = 50;`, o nome novo com o valor antigo.
3. **Apague os marcadores**: os `<<<<<<<`, `=======` e `>>>>>>>`.
4. Rode o programa e os testes. Compila? Funciona?
5. `git add src/tarefas.ts`, que marca o arquivo como resolvido, e `git commit`. A mensagem de merge já vem pronta.

No [[VS Code]], aparecem botões em cima de cada conflito: **Accept Current** (fica o seu), **Accept Incoming** (fica o que chega), **Accept Both** (os dois), e o **Merge Editor**, que mostra três painéis lado a lado. E se você se perder no meio, desistir é fácil: `git merge --abort` volta tudo como estava antes do merge, como se nada tivesse acontecido.

Três erros acontecem na hora de resolver. O primeiro é **commitar os marcadores**: um `<<<<<<<` esquecido no meio do código quebra tudo. Antes de commitar, busque por `<<<<<<<` no projeto inteiro. O segundo é **aceitar um lado sem ler**: clicar em "Accept Incoming" em tudo pode apagar a correção que outra pessoa fez. Leia os dois lados. E o terceiro é **resolver e não testar**: cada lado compilava sozinho, mas a combinação dos dois pode não compilar. Teste antes de commitar.

## Provocando um de propósito

O melhor jeito de perder o medo de conflito é causar um, num lugar onde nada importa. Siga estes comandos:

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

git merge tema-escuro         # CONFLICT
cat config.txt                # veja os marcadores

echo "cor = preto" > config.txt   # decidiu: fica preto
git add config.txt
git commit -m "Merge tema-escuro: mantém cor preta"
git log --oneline --graph
```

As duas branches mudaram a mesma linha, cada uma pra uma cor. O `git log --graph` no fim mostra o desenho das duas linhas se juntando.

E pra evitar conflitos no dia a dia, além das branches curtas: atualize a sua branch com a `main` com frequência, e nunca reformate um arquivo inteiro junto com uma mudança de lógica. Uma reformatação mexe em todas as linhas, e aí qualquer outra mudança no arquivo vira conflito. Um [[Formatter]] aplicado no projeto inteiro, num commit separado, resolve isso de vez.

## O essencial

1. Uma branch é um ponteiro pra um commit, não uma cópia. Criar é instantâneo.
2. `git switch -c nome` cria; `git merge nome` traz a outra branch pra onde você está.
3. Fast-forward só move o ponteiro; merge commit junta duas linhas que andaram.
4. Conflito: entre `<<<<<<< HEAD` e `=======` é o seu lado; depois, o que chega. Decida, apague os marcadores, teste, `git add`, `git commit`.
5. `git merge --abort` desiste. Branches curtas evitam a maioria dos conflitos.

## Agora é com você

Resolva três tipos de conflito. Primeiro, reproduza o exemplo da seção anterior e resolva escolhendo **um** dos lados. Depois, crie outro conflito e resolva **combinando** os dois (por exemplo: uma branch muda o nome de uma variável, a outra muda o valor dela). Em seguida, provoque um conflito em **dois arquivos** ao mesmo tempo e resolva pelo Merge Editor do VS Code. Por fim, comece um merge com conflito e desista dele com `git merge --abort`. Você terminou quando o `git log --graph` mostrar os merges, nenhum arquivo tiver marcador esquecido, e você conseguir explicar, em cada caso, o que era o `HEAD` e o que era o outro lado.

Daqui, siga pro [[Rebase e Cherry Pick]], pro [[Stash]] e pro [[Git Flow]].

---

## 🧠 Me teste

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

> [!question]- Por que branches de semanas dão mais conflito?
> Porque a `main` muda muito nesse tempo, e quanto mais as duas linhas divergem, mais trechos coincidem na volta.

> [!question]+ Num conflito, o que fica entre `<<<<<<< HEAD` e `=======`?
> - a) A versão da branch que você está trazendo
> - b) A versão da sua branch atual
> - c) A versão do último commit da `main`
> - d) O trecho que o Git já resolveu sozinho
>
> > [!check]- Resposta
> > **b)** `HEAD` é onde você está agora. Entre `=======` e `>>>>>>> outra-branch` vem a versão que está chegando no merge.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git switch -c nome` | Cria e troca |
| `git switch nome` | Troca |
| `git branch` / `-a` | Lista |
| `git branch -d nome` | Apaga (já juntada) |
| `git merge nome` | Junta na atual |
| `git merge --abort` | Desiste do merge |
| `git log --oneline --graph --all` | Mostra o desenho |
| `git diff --name-only --diff-filter=U` | Lista os arquivos em conflito |

**Pra ler e treinar:** o [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR) é um jogo, em português, que mostra as branches se desenhando enquanto você digita os comandos. Os níveis "Introdução" e "Rampa acima" cobrem esta nota inteira, e é a melhor forma de enxergar o que está acontecendo. O capítulo de [Branches do Pro Git](https://git-scm.com/book/pt-br/v2/Branches-no-Git-Branches-em-poucas-palavras), também em português, explica o "ponteiro" com desenhos. E a [documentação do VS Code sobre conflitos](https://code.visualstudio.com/docs/sourcecontrol/overview#_merge-conflicts) mostra o Merge Editor.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

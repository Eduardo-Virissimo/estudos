---
nivel: escrito
foco: bom saber
revisado:
---

# Árvores Balanceadas (AVL e Rubro-Negra)

**Quanto focar: 💤 bom saber.** Você não vai implementar no trabalho. Saiba que existem e por que um índice de banco não degrada; o resto pode esperar.

A nota da [[Árvore Binária de Busca (BST)]] terminou com um problema sério: insira dados que já chegam em ordem, e a árvore vira uma linha, com busca em O(n). E dados em ordem são o caso **comum**, não a exceção. Então como os bancos de dados e as bibliotecas garantem O(log n) sempre?

A resposta é uma árvore que **se arruma sozinha**. Toda vez que uma inserção ou remoção deixa um lado muito mais alto que o outro, ela faz um pequeno giro de nós, uma **rotação**, que abaixa o lado alto sem quebrar a regra da BST. As duas versões mais famosas são a **AVL** e a **rubro-negra**.

Uma palavra honesta antes de começar: esta nota é aprofundamento, e pode ser pulada no caminho pra primeira vaga. Você dificilmente vai implementar uma dessas na vida (elas vêm prontas). O que vale levar é a ideia: **rotação conserta o equilíbrio em O(1), e por isso a árvore nunca fica alta.** Se entender a rotação, já valeu a nota.

## A rotação

Pegue o caso mais simples de degeneração: inseriu 10, 20, 30, e a árvore ficou torta pra direita.

```text
  10                         20
    \                       /  \
     20      rotação →    10    30
       \     à esquerda
        30
```

A rotação à esquerda sobe o 20 pra raiz e desce o 10 pra esquerda dele. Confira a regra da BST: 10 < 20 < 30, tudo continua no lugar certo. Só mudaram duas ou três setas, então a rotação custa O(1).

No código, é uma troca de ponteiros como as de [[Listas Ligadas]]:

```ts
function rotacaoEsquerda(x: No): No {
  const y = x.direita!;   // o filho da direita vai subir
  x.direita = y.esquerda; // o que estava à esquerda de y passa pra direita de x
  y.esquerda = x;         // x desce pra esquerda de y
  return y;               // y é a nova raiz desta subárvore
}
```

A linha do meio é a sutil. Se o `y` tinha um filho esquerdo, ele é maior que `x` (está à direita de `x`) e menor que `y` (está à esquerda de `y`), então o lugar dele agora é à direita de `x`. A rotação à direita é o espelho exato.

Às vezes uma rotação só não basta. Se a árvore torta faz um "zigue-zague" (10, 30, 20: o 30 à direita do 10 e o 20 à esquerda do 30), você primeiro gira o 30 pra direita, endireitando o zigue-zague numa linha, e depois gira o 10 pra esquerda. Isso se chama **rotação dupla**.

## AVL: a mais rígida

A AVL (das iniciais dos inventores, Adelson-Velsky e Landis, em 1962, a primeira árvore balanceada da história) guarda em cada nó a **altura** da subárvore. A regra é: em todo nó, a diferença de altura entre a esquerda e a direita (o **fator de balanceamento**) é no máximo 1.

Depois de cada inserção, ela volta pelo caminho até a raiz recalculando as alturas. Se algum nó ficou com diferença 2, faz a rotação certa (simples ou dupla) ali mesmo. Como o caminho tem altura log n e cada rotação é O(1), inserir continua O(log n).

Por ser tão rígida, a AVL é a mais **baixa** possível, e por isso a mais rápida pra **buscar**. O preço é girar bastante nas inserções e remoções.

## Rubro-negra: a mais usada

A rubro-negra pinta cada nó de vermelho ou preto e mantém umas poucas regras sobre as cores. As principais são: um nó vermelho não pode ter filho vermelho, e todo caminho da raiz até um `null` passa pelo **mesmo número de nós pretos**. Não precisa decorar as regras. A consequência é que importa: o caminho mais longo nunca é mais que o **dobro** do mais curto. Ela é menos equilibrada que a AVL (um pouco mais alta), mas gira bem menos pra se manter.

Esse equilíbrio "bom o suficiente, com pouca manutenção" fez dela a árvore padrão das bibliotecas: o `TreeMap` do Java, o `std::map` do C++ e o escalonador de processos do Linux usam rubro-negras.

| | AVL | Rubro-negra |
|---|---|---|
| Regra | alturas diferem no máximo 1 | regras de cor; caminho mais longo ≤ 2× o mais curto |
| Altura | a menor possível (~1,44 log n no pior caso) | um pouco maior (≤ 2 log n) |
| Melhor pra | muitas buscas, poucas mudanças | muitas inserções e remoções |
| Onde está | alguns bancos em memória | `TreeMap` (Java), `std::map` (C++), kernel do Linux |
| Custo | O(log n) em tudo | O(log n) em tudo |

## E no JavaScript?

Aqui vem uma surpresa: o JavaScript **não tem** árvore balanceada pronta. O `Map` e o `Set` são hash tables, sem ordem de valor. Quando você precisa de dados ordenados com inserções frequentes (um ranking que muda o tempo todo, uma agenda de eventos por horário), as opções são: manter um array ordenado e inserir com [[Busca Binária]] (ótimo até alguns milhares de itens, porque o `splice` é O(n) mas muito rápido na prática), usar um [[Heap (Estrutura de Dados)|heap]] se só importa o menor ou o maior, ou usar uma biblioteca.

E os bancos de dados? Eles usam a **B-tree**, uma prima destas: em vez de dois filhos por nó, centenas. Com isso a árvore fica baixíssima (uns 3 ou 4 andares pra milhões de linhas), e cada andar é uma leitura de disco. Quando você criar um índice no Postgres, no Estágio 4, é uma B-tree que você está criando.

## O essencial

1. Árvores balanceadas evitam a degeneração da BST se reorganizando a cada inserção e remoção.
2. A rotação sobe um filho e desce o pai sem quebrar a regra da BST, em O(1).
3. AVL: diferença de altura no máximo 1; mais baixa, melhor pra buscas.
4. Rubro-negra: regras de cor; equilíbrio mais frouxo, menos rotações; é a das bibliotecas.
5. Tudo O(log n) garantido. No JS não há uma pronta; bancos usam B-tree.

## Agora é com você

Sem implementar a árvore inteira: abra a [visualização de AVL da USFCA](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html), insira 10, 20, 30, 40, 50, 25 e, antes de cada inserção, desenhe no papel como acha que a árvore vai ficar e qual rotação vai acontecer. Depois compare. Em seguida, faça o mesmo na [rubro-negra](https://www.cs.usfca.edu/~galles/visualization/RedBlack.html) com os mesmos números e anote qual das duas terminou mais baixa. Se quiser ir além, escreva `rotacaoEsquerda` e `rotacaoDireita` na sua `ArvoreBusca` de 📦 `estruturas-do-zero` e teste que a em-ordem não muda depois de girar.

Daqui, siga pra [[Heap (Estrutura de Dados)]].

---

## 🧠 Me teste

> [!question]- Que problema as árvores balanceadas resolvem?
> A degeneração da BST: com inserções em ordem, a BST simples vira uma lista e as operações ficam O(n). As balanceadas garantem altura O(log n).

> [!question]- O que uma rotação faz, e por que ela não quebra a BST?
> Sobe um filho pro lugar do pai e desce o pai pro lado oposto, reposicionando uma subárvore do meio. Os valores continuam respeitando menor à esquerda, maior à direita.

> [!question]- Qual a regra de equilíbrio da AVL?
> Em todo nó, a altura das subárvores esquerda e direita difere em no máximo 1.

> [!question]- Por que as bibliotecas preferem a rubro-negra à AVL?
> Porque ela precisa de menos rotações pra se manter equilibrada nas inserções e remoções, e o equilíbrio dela (caminho mais longo até o dobro do mais curto) já garante O(log n).

> [!question]+ Qual estrutura está por trás do `Map` do JavaScript?
> - a) Uma árvore rubro-negra
> - b) Uma hash table
> - c) Uma árvore AVL
> - d) Uma B-tree
>
> > [!check]- Resposta
> > **b)** O `Map` é uma hash table: O(1) em média, sem ordem de valor (só a ordem de inserção). Rubro-negra é o `TreeMap` do Java e o `std::map` do C++. O JavaScript não tem árvore balanceada pronta.

---

## Pra consultar depois

| Termo | Significado |
|---|---|
| Rotação | troca pai e filho de lugar, O(1), mantém a ordem |
| Rotação dupla | duas rotações pra desfazer um zigue-zague |
| Fator de balanceamento | altura(esq) − altura(dir); na AVL, entre −1 e 1 |
| B-tree | árvore com muitos filhos por nó, usada em índices de banco |

**Pra ver:** as visualizações da USFCA de [AVL](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html) e [rubro-negra](https://www.cs.usfca.edu/~galles/visualization/RedBlack.html) animam cada rotação; são as que o desafio usa. O capítulo de AVL do [Hello Algo](https://www.hello-algo.com/en/chapter_tree/avl_tree/) desenha os quatro casos de rotação com código.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

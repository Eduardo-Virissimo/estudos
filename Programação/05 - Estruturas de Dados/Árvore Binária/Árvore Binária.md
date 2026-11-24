---
nivel: escrito
foco: importante
revisado:
---

# Árvore Binária

**Quanto focar: 📌 importante.** É a base de BST, heap e de muito exercício de entrevista. Entenda bem e pratique os percursos.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

O chaveamento de um campeonato de futebol: na base, 16 times; acima, as oitavas, depois as quartas, a semifinal e, no topo, a final. Cada jogo junta dois times de baixo e manda um pra cima. Desenhe isso de cabeça pra baixo e você tem uma **árvore**: um ponto no topo (a final) que se divide em dois, que se dividem em dois, até as pontas.

Até aqui, toda estrutura do estágio era uma **linha**: array, lista, pilha, fila, cada item com no máximo um vizinho de cada lado. A árvore é a primeira que **se ramifica**. E isso muda o jogo, porque uma árvore com 1 milhão de itens bem distribuídos tem só uns 20 andares. É por isso que árvores estão por baixo de bancos de dados, do sistema de arquivos, do HTML da página que você está vendo (o DOM é uma árvore) e de vários algoritmos de busca e compressão.

Uma **árvore binária** é o caso mais simples: cada nó tem **no máximo dois filhos**, o da esquerda e o da direita. Esta nota é sobre o vocabulário, as quatro formas de percorrer, e a ferramenta que resolve quase todo problema de árvore: [[Recursão]]. Se a recursão ainda está fraca, volte lá antes; aqui ela é usada o tempo todo.

## Raiz, filhos e folhas

Um nó de árvore binária é um nó de [[Listas Ligadas|lista ligada]] com duas setas em vez de uma:

```ts
class NoArvore<T> {
  constructor(
    public valor: T,
    public esquerda: NoArvore<T> | null = null,
    public direita: NoArvore<T> | null = null,
  ) {}
}

//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
const raiz = new NoArvore(1,
  new NoArvore(2, new NoArvore(4), new NoArvore(5)),
  new NoArvore(3, null, new NoArvore(6)),
);
```

O vocabulário, de uma vez: a **raiz** é o nó do topo (o 1), o único sem pai. Os **filhos** de um nó são os que saem dele (2 e 3 são filhos de 1). Uma **folha** é um nó sem filhos (4, 5 e 6). A **profundidade** de um nó é quantos passos ele está da raiz, e a **altura** da árvore é a maior profundidade (aqui, 2). E toda árvore tem uma propriedade que faz a recursão funcionar: **cada filho é a raiz de uma árvore menor**, uma subárvore.

## Pensar em subárvores

Essa última frase é a mais importante da nota. Quase todo problema de árvore se resolve com o raciocínio: "se eu já soubesse a resposta pra subárvore da esquerda e pra da direita, como juntaria as duas?". É a pergunta de ouro da [[Recursão]], aplicada a árvores.

Quantos nós a árvore tem? Os da esquerda, mais os da direita, mais eu:

```ts
function contar<T>(no: NoArvore<T> | null): number {
  if (no === null) return 0;                        // árvore vazia: zero
  return 1 + contar(no.esquerda) + contar(no.direita);
}
```

Qual a altura? A da subárvore mais alta, mais um andar:

```ts
function altura<T>(no: NoArvore<T> | null): number {
  if (no === null) return -1;                       // vazia tem altura -1, folha tem 0
  return 1 + Math.max(altura(no.esquerda), altura(no.direita));
}
```

Repare que o caso base é sempre o **nó nulo**, e não a folha. Isso é intencional e evita metade dos bugs: se você tratar a folha como caso base, precisa de `if`s pra quando só um dos filhos existe (como o 3, que só tem o filho da direita). Tratando o `null`, a recursão cuida de tudo sozinha.

As duas funções visitam cada nó uma vez: O(n). E usam memória proporcional à altura, porque é o tamanho máximo que a pilha de chamadas atinge.

## As quatro formas de percorrer

Visitar todos os nós de uma árvore é chamado de **travessia**, e existem quatro ordens clássicas. As três primeiras são recursivas e só mudam **quando** você olha o nó atual em relação aos filhos:

```ts
function preOrdem(no: NoArvore<number> | null, saida: number[] = []) {
  if (!no) return saida;
  saida.push(no.valor);             // eu primeiro
  preOrdem(no.esquerda, saida);
  preOrdem(no.direita, saida);
  return saida;
}
// em-ordem: esquerda, EU, direita
// pós-ordem: esquerda, direita, EU
```

Na árvore do exemplo:

| Travessia | Ordem | Resultado | Pra que serve |
|---|---|---|---|
| Pré-ordem | eu, esq, dir | 1 2 4 5 3 6 | copiar a árvore, imprimir estrutura de pastas |
| Em-ordem | esq, eu, dir | 4 2 5 1 3 6 | numa [[Árvore Binária de Busca (BST)\|BST]], dá os valores **ordenados** |
| Pós-ordem | esq, dir, eu | 4 5 2 6 3 1 | apagar ou calcular de baixo pra cima (tamanho de pastas) |
| Por nível | andar por andar | 1 2 3 4 5 6 | a menor profundidade, imprimir por níveis |

O jeito de não confundir é olhar o nome: o prefixo diz onde fica o **eu**. *Pré* = antes dos filhos, *em* = no meio, *pós* = depois.

A quarta, **por nível**, não é recursiva. Ela usa uma [[Filas|fila]]: põe a raiz, e a cada passo tira um nó, visita e põe os filhos dele no fim. Como a fila sai na ordem em que entrou, os nós saem andar por andar. Essa é a [[BFS (Busca em Largura)]] aplicada a árvores, e as três recursivas são formas de [[DFS (Busca em Profundidade)]].

```ts
function porNivel<T>(raiz: NoArvore<T> | null): T[] {
  const saida: T[] = [];
  const fila: NoArvore<T>[] = raiz ? [raiz] : [];
  let i = 0;                        // índice de início: sem shift (lembra de Filas?)
  while (i < fila.length) {
    const no = fila[i++];
    saida.push(no.valor);
    if (no.esquerda) fila.push(no.esquerda);
    if (no.direita) fila.push(no.direita);
  }
  return saida;
}
```

## Árvore cheia, árvore torta

Aquela promessa do começo, "1 milhão de itens em 20 andares", só vale se a árvore estiver **bem distribuída**: cada andar cheio antes de começar o próximo. Uma árvore assim, com altura em torno de log₂ n, se chama **balanceada**.

Mas nada obriga uma árvore binária a ser balanceada. Se cada nó só tiver o filho da direita, a "árvore" é uma linha de n andares, e você está de volta numa lista ligada, com todo o custo O(n) dela. Guarde essa imagem, porque ela é o grande problema da próxima nota, a [[Árvore Binária de Busca (BST)]], e o motivo de existirem as [[Árvores Balanceadas (AVL e Rubro-Negra)]].

## O essencial

1. Árvore binária: cada nó tem até dois filhos; a raiz é o topo, as folhas não têm filhos.
2. Cada filho é a raiz de uma subárvore: pergunte "se eu soubesse a resposta da esquerda e da direita, como juntaria?".
3. Use o nó `null` como caso base, não a folha.
4. Pré, em e pós-ordem dizem onde o "eu" fica em relação aos filhos; por nível usa uma fila.
5. Balanceada tem altura ~log n; torta vira lista e custa O(n).

## Agora é com você

Em 📦 `estruturas-do-zero/src/arvore.ts` ([[Estruturas de Dados do Zero]]), escreva cinco funções recursivas sobre a `NoArvore`, cada uma com o caso base no `null`: `somar` (soma dos valores), `contarFolhas`, `espelhar` (troca esquerda e direita em todos os nós, a questão famosa que o criador do Homebrew não resolveu numa entrevista do Google), `iguais(a, b)` (mesma forma e mesmos valores) e `caminhos` (lista todos os caminhos da raiz até cada folha: `["1→2→4", "1→2→5", "1→3→6"]`). Antes de cada uma, escreva em português a frase "a resposta de um nó é...". Terminou quando as cinco funcionam na árvore do exemplo e na árvore vazia.

Daqui, siga pra [[Árvore Binária de Busca (BST)]].

---

## 🧠 Me teste

> [!question]- O que é a altura de uma árvore, e por que ela importa?
> A maior distância da raiz até uma folha. Ela determina o custo de descer na árvore: balanceada tem altura ~log n, torta pode ter altura n.

> [!question]- Por que é melhor usar o nó `null` como caso base em vez da folha?
> Porque com o `null` a recursão trata sozinha nós com um filho só. Com a folha como caso base, seria preciso checar cada filho antes de chamar.

> [!question]- Qual a diferença entre pré-ordem, em-ordem e pós-ordem?
> Só quando o nó atual é visitado: antes dos filhos (pré), entre a esquerda e a direita (em), ou depois dos dois (pós).

> [!question]- Qual estrutura a travessia por nível usa, e por quê?
> Uma fila: os filhos de cada nó entram no fim e saem na ordem em que foram descobertos, o que processa a árvore andar por andar.

> [!question]+ Na árvore com raiz 1, filhos 2 (com filhos 4 e 5) e 3 (com filho direito 6), qual é a pós-ordem?
> - a) 1 2 4 5 3 6
> - b) 4 2 5 1 3 6
> - c) 4 5 2 6 3 1
> - d) 1 2 3 4 5 6
>
> > [!check]- Resposta
> > **c)** Pós-ordem visita esquerda, direita e só então o nó. A a) é pré-ordem, a b) é em-ordem e a d) é por nível. Repare que na pós-ordem a raiz é sempre a última.

---

## Pra consultar depois

| Termo | Significado |
|---|---|
| Raiz | nó do topo, sem pai |
| Folha | nó sem filhos |
| Profundidade | distância de um nó até a raiz |
| Altura | maior profundidade da árvore |
| Subárvore | um nó e todos os seus descendentes |
| Balanceada | altura ~log₂ n |

**Pra ler e ver:** o capítulo de árvores binárias do [Hello Algo](https://www.hello-algo.com/en/chapter_tree/binary_tree/) desenha o vocabulário e as travessias, com o código em TypeScript ao lado. O [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) do LeetCode é o `espelhar` do desafio.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

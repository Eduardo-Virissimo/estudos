---
nivel: escrito
revisado:
---

# Heap Sort

Se você fez o desafio do [[Heap (Estrutura de Dados)|heap]], já escreveu um heap sort sem perceber: inseriu mil números num min-heap, extraiu um por um, e eles saíram em ordem. Isso é ordenar com um heap. Funciona, é O(n log n), e tem um defeito: usa um heap separado, com memória extra do tamanho da lista.

O **heap sort** de verdade faz o mesmo truque **dentro do próprio array**, sem memória extra nenhuma. Ele transforma o array num max-heap (o maior no topo), troca o topo com o último elemento (o maior foi pro fim, no lugar certo), "conserta" o heap no que sobrou, e repete. A cada rodada, o maior que restava vai pro fim, e o array vai ficando ordenado da direita pra esquerda.

Ele é o único dos rápidos que junta as duas garantias que os outros dividem: **O(n log n) no pior caso**, como o [[Merge Sort]], e **sem memória extra**, como o [[Quick Sort]]. Na prática é mais lento que os dois (pula muito pela memória) e não é estável, então você raramente vai escolhê-lo. Mas ele é a melhor prova de que o heap é uma estrutura poderosa, e a nota é curta.

## A peça: descer um elemento

Tudo no heap sort usa uma operação só, a mesma "descida" do `extrair` do heap: um elemento desce trocando com o **maior** dos filhos (agora é max-heap) até ficar maior que os dois. A diferença é que ela recebe até onde o heap vai, porque o fim do array vai sendo ocupado pelos já ordenados:

```ts
function descer(a: number[], i: number, tamanho: number): void {
  while (true) {
    const esq = 2 * i + 1;
    const dir = 2 * i + 2;
    let maior = i;
    if (esq < tamanho && a[esq] > a[maior]) maior = esq;
    if (dir < tamanho && a[dir] > a[maior]) maior = dir;
    if (maior === i) return;
    [a[i], a[maior]] = [a[maior], a[i]];
    i = maior;
  }
}
```

## As duas fases

**Fase 1: transformar o array num heap.** Você poderia inserir um por um, mas existe um jeito mais rápido: começar do último nó que tem filhos e ir até a raiz, chamando `descer` em cada um. As folhas (a metade final do array) já são heaps de um elemento, então não precisam de nada.

**Fase 2: tirar o maior, repetidamente.** O maior está em `a[0]`. Troque com o último do heap, encolha o heap em um, e desça o novo topo.

```ts
function heapSort(a: number[]): number[] {
  const n = a.length;
  // fase 1: do último pai até a raiz
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) descer(a, i, n);

  // fase 2: o maior vai pro fim, o heap encolhe
  for (let fim = n - 1; fim > 0; fim--) {
    [a[0], a[fim]] = [a[fim], a[0]];
    descer(a, 0, fim);
  }
  return a;
}
```

```text
[5, 2, 4, 6, 1, 3]
fase 1 →  [6, 5, 4, 2, 1, 3]        max-heap: 6 no topo
troca  →  [3, 5, 4, 2, 1 | 6]       o 6 foi pro lugar dele
desce  →  [5, 3, 4, 2, 1 | 6]
troca  →  [1, 3, 4, 2 | 5, 6]
  ...
          [1, 2, 3, 4, 5, 6]
```

A barra `|` separa o heap (à esquerda, encolhendo) da parte já ordenada (à direita, crescendo). É o mesmo desenho do [[Ordenações Simples (Bubble, Selection, Insertion)|selection sort]] (escolher o maior e mandar pro fim), só que o heap acha o maior em O(log n) em vez de O(n). Pode-se dizer que o heap sort é um selection sort com a estrutura certa.

## Por que n log n, e uma surpresa

A fase 2 faz n descidas, cada uma O(log n): O(n log n). A fase 1 parece também O(n log n) (n/2 descidas), mas tem uma surpresa: ela é **O(n)**. A maioria dos nós está perto das folhas e desce pouquíssimo; só a raiz desce log n andares. Somando tudo, dá no máximo uns 2n trocas. Você não precisa saber provar, mas vale saber que montar um heap a partir de um array é linear, porque isso aparece em entrevista.

| | Heap Sort |
|---|---|
| Tempo (todos os casos) | O(n log n) |
| Montar o heap | O(n) |
| Memória extra | O(1) |
| Estável | não |
| Na prática | mais lento que quick e merge |

Por que ele não é estável? A troca do topo com o último joga elementos de um lado pro outro do array sem respeitar a ordem dos iguais. E por que é mais lento na prática? Porque `2i + 1` pula pra posições distantes da memória a cada nível, e o processador não consegue antecipar. É uma boa lembrança de que o Big-O não é tudo.

Onde ele aparece de verdade é como **plano B**: o *introsort* (o `std::sort` do C++) começa com quick sort e, se perceber que a recursão está ficando funda demais (sinal de pivôs ruins), troca pro heap sort, que garante O(n log n).

## O essencial

1. Heap sort: monte um max-heap no próprio array e, repetidamente, troque o topo com o fim e desça.
2. Montar o heap de baixo pra cima é O(n); as n extrações são O(n log n).
3. Único rápido que junta O(n log n) garantido com O(1) de memória extra.
4. Não é estável e é mais lento na prática que quick e merge sort.
5. É um selection sort com heap: achar o maior custa O(log n) em vez de O(n).

## Agora é com você

Escreva o `heapSort` em 📦 `estruturas-do-zero/src/ordenacoes.ts` ([[Estruturas de Dados do Zero]]) e complete a tabela de comparações do README com ele: agora você tem seis ordenações, três entradas e números de verdade pra todas. Embaixo da tabela, escreva um parágrafo com as suas palavras: qual você escolheria pra cada situação (dados quase ordenados, memória curta, precisa ser estável, pior caso garantido) e por quê. Esse parágrafo é a prova de que você entendeu ordenação, mais do que qualquer código.

Daqui, siga pra [[Ordenações sem Comparação (Counting, Radix)]], ou pule direto pra [[DFS (Busca em Profundidade)]].

---

## 🧠 Me teste

> [!question]- Quais são as duas fases do heap sort?
> Primeiro transformar o array num max-heap; depois, repetidamente, trocar o topo (o maior) com o último elemento do heap, encolher o heap e descer o novo topo.

> [!question]- Por que montar o heap de baixo pra cima é O(n), e não O(n log n)?
> Porque a maioria dos nós está perto das folhas e desce muito pouco; só os poucos nós do topo descem muitos níveis. A soma total é linear.

> [!question]- Qual a vantagem do heap sort sobre o merge sort e sobre o quick sort?
> Sobre o merge sort: não usa memória extra. Sobre o quick sort: é O(n log n) garantido, sem pior caso O(n²).

> [!question]- Por que o heap sort costuma ser mais lento na prática?
> Porque o acesso aos filhos (`2i + 1`, `2i + 2`) salta pra posições distantes da memória, o que atrapalha o cache do processador.

> [!question]+ Qual das ordenações é O(n log n) no pior caso **e** usa O(1) de memória extra?
> - a) Merge sort
> - b) Quick sort
> - c) Insertion sort
> - d) Heap sort
>
> > [!check]- Resposta
> > **d)** O merge sort é O(n log n) garantido, mas usa O(n) de memória. O quick sort ordena no lugar, mas tem pior caso O(n²). O insertion sort usa O(1), mas é O(n²). Só o heap sort junta as duas garantias.

---

## Pra consultar depois

| | Bubble/Sel./Ins. | Merge | Quick | Heap |
|---|---|---|---|---|
| Médio | O(n²) | O(n log n) | O(n log n) | O(n log n) |
| Pior | O(n²) | O(n log n) | O(n²) | O(n log n) |
| Memória | O(1) | O(n) | O(log n) | O(1) |
| Estável | B e I sim | sim | não | não |

**Pra ver:** o capítulo de heap sort do [Hello Algo](https://www.hello-algo.com/en/chapter_sorting/heap_sort/) desenha cada troca e descida, com a árvore e o array lado a lado.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

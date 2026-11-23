---
nivel: escrito
foco: importante
revisado:
---

# Heap (Estrutura de Dados)

**Quanto focar: 📌 importante.** É a fila de prioridade, que aparece em vários problemas médios de entrevista. Entenda a ideia e implemente uma vez.

No pronto-socorro, ninguém é atendido por ordem de chegada. Quem chegou com o braço quebrado espera; quem chegou infartando passa na frente de todo mundo, mesmo tendo chegado por último. E a cada paciente novo, a pergunta da recepção é sempre a mesma: **quem é o mais urgente agora?**

Uma [[Filas|fila]] comum não serve, porque ela respeita a ordem de chegada. Um array ordenado serve, mas cada paciente novo obriga a encaixá-lo no lugar certo, empurrando os outros: O(n). O que o pronto-socorro precisa é de uma **fila de prioridade**: inserir qualquer coisa e tirar sempre a mais urgente, as duas coisas rápidas. A estrutura que faz isso é o **heap**, e ela é engenhosa: uma árvore que mora dentro de um array, sem ponteiro nenhum.

O heap aparece em lugares importantes: o algoritmo de [[Dijkstra]] (o GPS), o [[Heap Sort]], agendadores de tarefas, e na família de problemas "os K maiores" que cai muito em entrevista. Ajuda ter passado por [[Árvore Binária]].

## Só o topo importa

Um **min-heap** é uma árvore binária com uma regra: **todo pai é menor ou igual aos filhos**. (O max-heap é o contrário.) Consequência: o menor de todos está sempre na raiz.

```text
          1
        /   \
       3     2
      / \   /
     7   4  5
```

Repare no que a regra **não** diz. Ela não diz que a esquerda é menor que a direita, nem que a árvore está ordenada. O 3 está à esquerda e o 2 à direita, e o 7 e o 4 (filhos do 3) não têm relação nenhuma com o 5 (filho do 2). O heap só garante uma coisa: **o topo é o menor**. Ele é "meio ordenado", e é justamente por ser só meio ordenado que ele é tão barato de manter. Essa é a confusão número um: heap não é uma [[Árvore Binária de Busca (BST)|BST]], e uma travessia dele não sai em ordem.

A segunda regra é de forma: o heap é uma árvore **completa**, preenchida andar por andar, da esquerda pra direita, sem buracos. Isso garante que a altura é sempre log n, e permite o truque da próxima seção.

## A árvore que mora num array

Como a árvore é completa, dá pra guardá-la num array, andar por andar, e calcular onde estão pai e filhos com contas:

```text
índice:  0  1  2  3  4  5
valor:  [1, 3, 2, 7, 4, 5]

filhos do nó i:  2i + 1  e  2i + 2
pai do nó i:     Math.floor((i - 1) / 2)
```

O nó 1 (valor 3) tem filhos nos índices 3 e 4 (valores 7 e 4). O pai do índice 5 (valor 5) é o índice 2 (valor 2). Confira no desenho. Nenhum ponteiro, nenhum objeto por nó: só um array e três contas.

## Inserir: sobe até achar o lugar

Pra inserir, você põe o valor novo **no fim do array** (o próximo lugar livre da árvore completa) e deixa ele **subir**: enquanto for menor que o pai, troca com o pai.

```ts
class MinHeap {
  private a: number[] = [];

  get tamanho() { return this.a.length; }
  topo(): number | undefined { return this.a[0]; }

  inserir(x: number): void {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {
      const pai = Math.floor((i - 1) / 2);
      if (this.a[pai] <= this.a[i]) break;          // pai já é menor: chegou
      [this.a[pai], this.a[i]] = [this.a[i], this.a[pai]];
      i = pai;
    }
  }
```

No máximo ele sobe até a raiz, uma troca por andar: O(log n).

## Tirar o topo: desce até achar o lugar

Tirar o menor é o movimento esperto. Você não pode simplesmente apagar a raiz (abriria um buraco no topo). Então pega o **último** elemento, coloca no lugar da raiz, e deixa ele **descer**: enquanto for maior que algum filho, troca com o **menor** dos filhos.

```ts
  extrair(): number | undefined {
    if (this.a.length === 0) return undefined;
    const menor = this.a[0];
    const ultimo = this.a.pop()!;
    if (this.a.length > 0) {
      this.a[0] = ultimo;
      let i = 0;
      while (true) {
        const esq = 2 * i + 1;
        const dir = 2 * i + 2;
        let alvo = i;
        if (esq < this.a.length && this.a[esq] < this.a[alvo]) alvo = esq;
        if (dir < this.a.length && this.a[dir] < this.a[alvo]) alvo = dir;
        if (alvo === i) break;                       // menor que os dois filhos: chegou
        [this.a[i], this.a[alvo]] = [this.a[alvo], this.a[i]];
        i = alvo;
      }
    }
    return menor;
  }
}
```

O detalhe que todo mundo erra na primeira vez: trocar com o **menor** dos filhos, não com qualquer um. Se trocar com o maior, ele vira pai do menor, e a regra quebra. Também O(log n).

| Operação | Heap | Array ordenado | Array comum |
|---|---|---|---|
| Ver o menor | O(1) | O(1) | O(n) |
| Inserir | O(log n) | O(n) | O(1) |
| Tirar o menor | O(log n) | O(1)* | O(n) |

\* Tirando do lado certo. O heap é o único que é bom nas duas operações que a fila de prioridade precisa.

## Pra que serve: prioridade e os K maiores

Com prioridades de verdade, o heap guarda objetos e compara um campo. Basta trocar `number` por um tipo genérico e passar uma função de comparação, como o `sort` faz (`(a, b) => a.urgencia - b.urgencia`).

E aí vem a família de problemas mais famosa: **os K maiores**. Você tem 10 milhões de vendas e quer as 10 maiores. Ordenar tudo é O(n log n). Com um min-heap de tamanho 10: percorra as vendas, insira cada uma e, se o heap passou de 10, extraia o menor. No fim, sobram exatamente as 10 maiores. Custo: O(n log k), e com k = 10, isso é praticamente O(n). Parece contraintuitivo usar um heap de **mínimo** pra achar os **maiores**, mas pense: o topo é sempre o "pior dos melhores", o primeiro a ser expulso quando chega alguém melhor.

O JavaScript, curiosamente, não tem heap pronto. Por isso vale ter o seu, e é o que o desafio pede.

## O essencial

1. Heap: todo pai ≤ filhos (min-heap); o menor está sempre no topo.
2. Ele é só "meio ordenado": não é BST, e percorrer não dá a ordem.
3. Mora num array: filhos em `2i+1` e `2i+2`, pai em `floor((i-1)/2)`.
4. Inserir sobe, extrair desce (trocando com o **menor** filho); os dois O(log n).
5. Fila de prioridade e "os K maiores" (min-heap de tamanho K) são os usos clássicos.

## Agora é com você

Transforme o `MinHeap` da nota num `Heap<T>` genérico que recebe a função de comparação no construtor, em 📦 `estruturas-do-zero/src/heap.ts` ([[Estruturas de Dados do Zero]]). Escreva um teste que insere mil números aleatórios e extrai todos, conferindo que saem em ordem crescente (isso já é o [[Heap Sort]]). Depois use o heap pra resolver o [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) com o truque do min-heap de tamanho K, e simule o pronto-socorro: pacientes com nome e urgência de 1 a 5, chegando em ordem aleatória, atendidos do mais urgente pro menos. Terminou quando o teste dos mil passa e você explica por que o K-ésimo maior é O(n log k).

Daqui, siga pra [[Trie]], e depois use o heap no [[Dijkstra]].

---

## 🧠 Me teste

> [!question]- Qual é a regra de um min-heap, e o que ela garante?
> Todo pai é menor ou igual aos filhos. Isso garante que o menor elemento está sempre na raiz, acessível em O(1).

> [!question]- Como se acha o pai e os filhos de um nó num heap guardado em array?
> Filhos do índice i em `2i + 1` e `2i + 2`; pai em `Math.floor((i - 1) / 2)`.

> [!question]- Como funciona extrair o topo?
> Guarda a raiz, coloca o último elemento no lugar dela e faz ele descer trocando com o menor dos filhos até não ser maior que nenhum deles.

> [!question]- Por que se usa um min-heap de tamanho K pra achar os K maiores?
> Porque o topo é o menor dos K melhores até agora; cada elemento novo maior que ele entra e expulsa o topo. No fim sobram os K maiores, em O(n log k).

> [!question]+ Um min-heap guarda `[1, 3, 2, 7, 4, 5]`. O que a travessia em-ordem da árvore devolve?
> - a) `[1, 2, 3, 4, 5, 7]`, ordenado
> - b) `[7, 4, 5, 3, 2, 1]`, decrescente
> - c) Uma ordem que não é crescente: o heap só garante que o topo é o menor
> - d) Dá erro, heap não pode ser percorrido
>
> > [!check]- Resposta
> > **c)** A em-ordem dá `[7, 3, 4, 1, 5, 2]`. Quem espera a ordenada está confundindo heap com BST. O heap só garante pai ≤ filhos; pra tirar tudo em ordem, é preciso extrair o topo repetidamente.

---

## Pra consultar depois

| Conta | Fórmula |
|---|---|
| Filho esquerdo | `2 * i + 1` |
| Filho direito | `2 * i + 2` |
| Pai | `Math.floor((i - 1) / 2)` |

| Operação | Custo |
|---|---|
| Ver topo | O(1) |
| Inserir (sobe) | O(log n) |
| Extrair (desce) | O(log n) |
| Montar de um array | O(n) |

**Pra ler e ver:** o [VisuAlgo, em heap](https://visualgo.net/en/heap), mostra a árvore e o array lado a lado enquanto os valores sobem e descem. O capítulo de heap do [Hello Algo](https://www.hello-algo.com/en/chapter_heap/heap/) tem o código em TypeScript e o problema dos K maiores explicado.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

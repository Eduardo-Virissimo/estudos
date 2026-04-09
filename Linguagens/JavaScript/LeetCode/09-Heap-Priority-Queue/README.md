# Heap / Priority Queue

Boa escolha. Heap e a estrutura certa quando voce precisa sempre do maior ou menor rapidamente.

## O que e Heap?

Heap e uma arvore especial usada para manter prioridade.

- Min-heap: menor no topo
- Max-heap: maior no topo

## Ideia principal

Em vez de ordenar tudo, voce mantem so o que importa no topo.

## Exemplo conceitual em JavaScript

~~~js
// minHeap aqui e uma implementacao pronta.
function topK(nums, k, minHeap) {
  for (const n of nums) {
    minHeap.push(n);
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }

  return minHeap;
}
~~~

## Complexidade rapida

- inserir/remover no heap: O(log n)
- ver topo: O(1)

## Problemas para praticar (ordem sugerida)

1. Kth Largest Element in an Array - #215
2. Top K Frequent Elements - #347
3. Find Median from Data Stream - #295

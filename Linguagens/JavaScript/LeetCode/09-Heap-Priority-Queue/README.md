# Heap / Priority Queue

## Visao geral

Heap permite acessar rapidamente o menor ou maior elemento.
Priority Queue e a forma de usar essa estrutura em problemas praticos.

## Como funciona

Tipos:

- Min-heap: menor no topo
- Max-heap: maior no topo

Operacoes:

- insert/push
- extract (remove topo)
- peek (consulta topo)

## Complexidade tipica

- inserir: O(log n)
- remover topo: O(log n)
- consultar topo: O(1)

## Quando usar

- Top K
- mediana em stream
- processar sempre o item mais prioritario

## Erros comuns

- comparador invertido
- ordenar tudo quando so precisa do topo
- esquecer que JS nao tem heap nativo na base da linguagem

## Exemplo em JavaScript

```js
// Exemplo conceitual: manter os k maiores com min-heap de tamanho k.
// Em pratica, use implementacao de heap ou biblioteca confiavel.
function keepTopK(nums, k, minHeap) {
  for (const n of nums) {
    minHeap.push(n);
    if (minHeap.size() > k) minHeap.pop();
  }
  return minHeap;
}
```

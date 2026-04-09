# Binary Search

Boa escolha. Busca binaria e essencial para arrays ordenados e respostas monotonicas.

## O que e Binary Search?

E uma busca que corta o espaco pela metade a cada passo.

## Regra de ouro

So use quando houver ordem clara ou condicao monotona.

## Exemplo em JavaScript

~~~js
function buscaBinaria(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
~~~

## Complexidade rapida

- Tempo: O(log n)
- Espaco: O(1)

## Problemas para praticar (ordem sugerida)

1. Binary Search - #704
2. Search Insert Position - #35
3. Koko Eating Bananas - #875

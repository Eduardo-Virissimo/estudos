# Binary Search

## Visao geral

Binary Search divide o espaco de busca ao meio a cada passo.
Funciona quando existe ordem ou condicao monotona.

## Como funciona

- Defina intervalo [left, right]
- Calcule mid
- Decida qual metade descartar
- Repita ate encontrar ou esgotar

## Complexidade tipica

- Tempo: O(log n)
- Espaco: O(1)

## Quando usar

- buscar valor em array ordenado
- primeira/ultima ocorrencia
- binary search na resposta (menor valor valido)

## Erros comuns

- atualizar limites de forma errada e criar loop infinito
- misturar regras de lower bound e upper bound
- aplicar sem monotonicidade

## Exemplo em JavaScript

```js
function binarySearch(nums, target) {
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
```

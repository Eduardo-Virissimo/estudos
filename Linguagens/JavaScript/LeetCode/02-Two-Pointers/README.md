# Two Pointers

## Visao geral

Two Pointers usa dois indices para percorrer dados de forma coordenada.
A ideia e evitar loop duplo completo e reduzir custo de O(n^2) para O(n) em muitos casos.

## Como funciona

Ha dois formatos principais:

- ponteiros opostos: um no inicio e outro no fim
- ponteiros na mesma direcao: um define inicio e outro expande

## Complexidade tipica

- Tempo: O(n) na maioria dos casos
- Espaco: O(1)

## Quando usar

- array ordenado com busca de pares
- comparacao de extremos (palindromo, soma alvo)
- remocao/compressao in-place

## Erros comuns

- mover o ponteiro errado
- esquecer condicao de parada
- aplicar em array nao ordenado sem tratar isso

## Exemplo em JavaScript

```js
function twoSumSorted(nums, target) {
  let l = 0;
  let r = nums.length - 1;

  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;
    else r--;
  }

  return [-1, -1];
}
```

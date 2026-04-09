# Sliding Window

## Visao geral

Sliding Window processa subarrays/substrings sem recalcular tudo do zero.
A janela desliza mantendo estado incremental.

## Como funciona

- Janela fixa: tamanho k constante.
- Janela variavel: expande e contrai conforme restricao.

Estado comum: soma, frequencia, quantidade de unicos e limites left/right.

## Complexidade tipica

- Tempo: O(n), porque cada indice entra e sai no maximo uma vez
- Espaco: O(1) ou O(k), dependendo do estado

## Quando usar

- maior/menor substring com condicao
- soma maxima em subarray de tamanho k
- contagem por janela

## Erros comuns

- nao remover efeito do elemento que saiu
- contrair janela no momento errado
- atualizar resposta antes da janela estar valida

## Exemplo em JavaScript

```js
function maxSumSubarrayK(nums, k) {
  if (nums.length < k) return null;

  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];

  let best = sum;
  for (let r = k; r < nums.length; r++) {
    sum += nums[r] - nums[r - k];
    if (sum > best) best = sum;
  }

  return best;
}
```

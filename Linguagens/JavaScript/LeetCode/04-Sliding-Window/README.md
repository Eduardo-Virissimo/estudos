# Sliding Window

Boa escolha. Sliding Window e o jeito padrao para subarray e substring continuos.

## O que e Sliding Window?

Voce mantem uma janela de elementos e move essa janela para frente.
Assim evita recalcular tudo do zero.

## Intuicao

Quando a janela anda 1 passo:

- um elemento sai
- outro entra

Entao voce atualiza so a diferenca.

## Exemplo em JavaScript

~~~js
function maiorSomaSubarray(nums, k) {
  if (nums.length < k) return null;

  let soma = 0;
  for (let i = 0; i < k; i++) soma += nums[i];

  let melhor = soma;

  for (let r = k; r < nums.length; r++) {
    soma += nums[r] - nums[r - k];
    melhor = Math.max(melhor, soma);
  }

  return melhor;
}
~~~

## Complexidade rapida

- Tempo: O(n)
- Espaco: O(1) ou O(k)

## Problemas para praticar (ordem sugerida)

1. Best Time to Buy and Sell Stock - #121
2. Longest Substring Without Repeating Characters - #3
3. Minimum Window Substring - #76

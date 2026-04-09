# Two Pointers

Boa escolha. Two Pointers faz voce sair de O(n^2) para O(n) em muitos problemas.

## O que e Two Pointers?

E usar dois indices no mesmo array para guiar a busca.
Normalmente:

- um ponteiro comeca na esquerda
- outro comeca na direita

## Como pensar

Se o array estiver ordenado e voce busca soma alvo:

- soma pequena -> move esquerda para aumentar
- soma grande -> move direita para diminuir

## Exemplo em JavaScript

~~~js
function twoSumOrdenado(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const soma = nums[left] + nums[right];

    if (soma === target) return [left, right];
    if (soma < target) left++;
    else right--;
  }

  return [-1, -1];
}
~~~

## Complexidade rapida

- Tempo: O(n)
- Espaco: O(1)

## Problemas para praticar (ordem sugerida)

1. Valid Palindrome - #125
2. Two Sum II - #167
3. 3Sum - #15

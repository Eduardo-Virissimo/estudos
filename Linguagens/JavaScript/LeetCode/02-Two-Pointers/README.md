# Two Pointers

## O que e

Two Pointers e usar dois indices ao mesmo tempo para guiar a busca.
Isso evita loop duplo em varios problemas.

## Intuicao

Imagine duas pessoas andando em um corredor:

- uma na esquerda
- uma na direita

Com base no que voce quer, voce move uma delas.

## Passo a passo classico

1. left no inicio.
2. right no fim.
3. avalia regra (ex: soma).
4. move left ou right.
5. para quando cruzar ou achar resposta.

## Complexidade sem misterio

- tempo: O(n)
- espaco: O(1)

## Exemplo explicado

`js
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}
`

## Erros comuns

- aplicar em array nao ordenado sem tratar
- mover os dois ponteiros sem criterio
- esquecer condicao de parada

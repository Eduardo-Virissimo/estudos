# Binary Search

## O que e

Binary Search e busca por corte ao meio.
A cada passo, metade do espaco e descartada.

## Intuicao

Pense em adivinhar numero entre 1 e 100:

- pergunta 50
- se for maior, ignora metade de baixo
- se for menor, ignora metade de cima

Isso acelera muito.

## Quando usar

- Array ordenado.
- Qualquer problema com resposta monotona (regiao invalida e valida).

## Passo a passo

1. Defina left e right.
2. Calcule mid.
3. Compare com alvo/condicao.
4. Jogue fora metade inutil.
5. Repita.

## Complexidade sem misterio

- O(log n): cada passo corta metade.
- Espaco O(1) na versao iterativa.

## Exemplo explicado

`js
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
`

## Erros comuns de iniciante

- Atualizar limite errado e criar loop infinito.
- Usar em dados nao ordenados.
- Confundir variantes (primeira ocorrencia, ultima ocorrencia, lower bound).

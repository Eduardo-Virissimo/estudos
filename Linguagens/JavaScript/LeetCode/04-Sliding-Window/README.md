# Sliding Window

## O que e

Sliding Window e uma forma de analisar partes continuas de um array/string sem recalcular tudo.
Voce mantem uma "janela" e vai deslizando.

## Intuicao

Imagine uma moldura de foto andando por cima de uma linha de numeros.
Em vez de somar tudo de novo a cada passo, voce:

- tira o que saiu da moldura
- adiciona o que entrou

## Tipos

- Janela fixa: tamanho sempre igual (ex: k).
- Janela variavel: aumenta e diminui conforme condicao.

## Passo a passo (janela fixa)

1. Monte a primeira janela.
2. Guarde o estado (ex: soma).
3. Ao avancar 1 posicao: remove esquerda, adiciona direita.
4. Atualize resposta.

## Complexidade sem misterio

- Cada elemento entra e sai uma vez: O(n).
- Espaco depende do estado que voce guarda: O(1) ou O(k).

## Exemplo explicado

`js
function maxSumSubarrayK(nums, k) {
  if (nums.length < k) return null;

  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];

  let best = sum;

  for (let right = k; right < nums.length; right++) {
    sum += nums[right];
    sum -= nums[right - k];
    if (sum > best) best = sum;
  }

  return best;
}
`

## Erros comuns de iniciante

- Esquecer de remover o elemento que saiu.
- Atualizar resposta em momento errado.
- Confundir janela fixa com variavel.

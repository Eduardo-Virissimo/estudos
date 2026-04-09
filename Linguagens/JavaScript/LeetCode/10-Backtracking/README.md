# Backtracking

## O que e

Backtracking e tentar caminhos e voltar quando um caminho nao serve.

## Intuicao

Imagine um labirinto:

- escolhe um caminho
- se travar, volta
- tenta outro

Em codigo, isso vira recursao + desfazer estado.

## Estrutura mental padrao

1. escolher
2. explorar
3. desfazer

Esse "desfazer" e o coracao do backtracking.

## Complexidade sem misterio

Pode crescer muito rapido (geralmente exponencial),
porque voce testa muitas combinacoes.

Por isso, poda e importante:

- se ja esta invalido, para cedo

## Exemplo explicado

`js
function subsets(nums) {
  const result = [];
  const path = [];

  function dfs(i) {
    if (i === nums.length) {
      result.push([...path]);
      return;
    }

    // opcao 1: nao pegar nums[i]
    dfs(i + 1);

    // opcao 2: pegar nums[i]
    path.push(nums[i]);
    dfs(i + 1);
    path.pop(); // desfaz para voltar
  }

  dfs(0);
  return result;
}
`

## Erros comuns de iniciante

- Nao desfazer estado (esquecer pop).
- Misturar estado de um ramo com outro.
- Nao cortar ramo invalido cedo.

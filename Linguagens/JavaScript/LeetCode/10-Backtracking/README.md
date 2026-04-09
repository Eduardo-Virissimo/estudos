# Backtracking

Boa escolha. Backtracking e a base para combinacoes, permutacoes e busca completa.

## O que e Backtracking?

E tentar uma escolha, continuar, e voltar quando nao funciona.

Padrao mental:

1. escolhe
2. explora
3. desfaz

## Exemplo em JavaScript

~~~js
function subsets(nums) {
  const ans = [];
  const path = [];

  function dfs(i) {
    if (i === nums.length) {
      ans.push([...path]);
      return;
    }

    dfs(i + 1); // nao escolhe

    path.push(nums[i]);
    dfs(i + 1); // escolhe
    path.pop(); // desfaz
  }

  dfs(0);
  return ans;
}
~~~

## Complexidade rapida

- Geralmente exponencial, porque testa muitas possibilidades
- Poda ajuda a reduzir busca inutil

## Problemas para praticar (ordem sugerida)

1. Subsets - #78
2. Combination Sum - #39
3. Permutations - #46

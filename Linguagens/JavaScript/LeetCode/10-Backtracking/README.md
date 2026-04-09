# Backtracking

## Visao geral

Backtracking explora escolhas passo a passo e volta quando um caminho nao serve.
E uma busca em arvore de estados com tentativa e erro controlado.

## Como funciona

Estrutura comum:

1. escolher uma opcao
2. avancar com recursao
3. desfazer escolha (backtrack)

## Complexidade tipica

Geralmente exponencial, dependendo da quantidade de escolhas por nivel.
Poda e essencial para reduzir busca desnecessaria.

## Quando usar

- combinacoes e permutacoes
- problemas de tabuleiro (n-queens, sudoku)
- cenarios de "todas as respostas validas"

## Erros comuns

- esquecer de desfazer estado
- copiar estrutura grande sem necessidade
- nao interromper caminho invalido cedo

## Exemplo em JavaScript

```js
function subsets(nums) {
  const ans = [];
  const path = [];

  function dfs(i) {
    if (i === nums.length) {
      ans.push([...path]);
      return;
    }

    dfs(i + 1); // nao escolhe nums[i]
    path.push(nums[i]);
    dfs(i + 1); // escolhe nums[i]
    path.pop();
  }

  dfs(0);
  return ans;
}
```

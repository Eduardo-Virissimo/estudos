# Stack

## Visao geral

Stack (pilha) segue LIFO: o ultimo que entra e o primeiro que sai.
E excelente para validacao de estrutura, desfazer passos e simulacao de recursao.

## Como funciona

Operacoes basicas:

- push: empilha
- pop: desempilha
- peek/top: consulta topo

Em JavaScript, arrays funcionam bem como stack com push/pop.

## Complexidade tipica

- push/pop/peek: O(1)
- Espaco: O(n)

## Quando usar

- parenteses validos
- avaliacao de expressoes
- monotonic stack (next greater element)

## Erros comuns

- acessar topo de stack vazia
- nao tratar ordem de abertura/fechamento
- confundir stack normal com monotonic stack

## Exemplo em JavaScript

```js
function isValidParentheses(s) {
  const stack = [];
  const pair = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pair[ch]) return false;
    }
  }

  return stack.length === 0;
}
```

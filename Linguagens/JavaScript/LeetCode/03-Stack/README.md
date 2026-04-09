# Stack

## O que e

Stack (pilha) segue LIFO:

- Last In, First Out
- ultimo que entra, primeiro que sai

## Intuicao

Serve para problemas onde voce precisa voltar ao ultimo contexto aberto.
Exemplos: parenteses, tags, desfazer.

## Operacoes basicas

- push: coloca no topo
- pop: remove do topo
- peek: olha topo sem remover

## Complexidade sem misterio

- push/pop/peek: O(1)
- espaco: O(n)

## Exemplo explicado

`js
function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
      continue;
    }

    const top = stack.pop();
    if (top !== pairs[ch]) return false;
  }

  return stack.length === 0;
}
`

## Erros comuns

- pop em stack vazia
- esquecer de validar stack vazia no final
- confundir par de fechamento

# Stack

Boa escolha. Stack aparece muito em validacao e parsing.

## O que e Stack?

Stack (pilha) segue a regra LIFO:
ultimo que entra, primeiro que sai.

Operacoes:

- push: entra
- pop: sai
- top/peek: olha o topo

## Exemplo em JavaScript

~~~js
function parentesesValidos(s) {
  const pilha = [];
  const pares = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      pilha.push(ch);
    } else {
      if (pilha.pop() !== pares[ch]) return false;
    }
  }

  return pilha.length === 0;
}
~~~

## Complexidade rapida

- push/pop: O(1)
- Espaco: O(n)

## Problemas para praticar (ordem sugerida)

1. Valid Parentheses - #20
2. Min Stack - #155
3. Daily Temperatures - #739

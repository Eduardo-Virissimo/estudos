# Linked List

Boa escolha. Linked List ensina ponteiros e manipular referencias com seguranca.

## O que e Linked List?

E uma cadeia de nos.
Cada no tem:

- valor
- ponteiro para o proximo

## Diferenca para array

- Array: acesso por indice e direto
- Linked List: precisa caminhar no a no

## Exemplo em JavaScript

~~~js
function inverterLista(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}
~~~

## Complexidade rapida

- Buscar posicao: O(n)
- Inserir/remover com referencia correta: O(1)

## Problemas para praticar (ordem sugerida)

1. Reverse Linked List - #206
2. Linked List Cycle - #141
3. Merge Two Sorted Lists - #21

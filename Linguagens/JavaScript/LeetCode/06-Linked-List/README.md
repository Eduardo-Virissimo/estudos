# Linked List

## Visao geral

Linked List e uma sequencia de nos onde cada no aponta para o proximo.
Nao ha acesso direto por indice em O(1), como em array.

## Como funciona

Cada no costuma ter:

- valor
- next

Padroes classicos:

- dummy node para simplificar insercao/remocao
- slow/fast pointers para ciclo e meio da lista
- reversao com prev/curr/next

## Complexidade tipica

- Acesso por posicao: O(n)
- Insercao/remocao com referencia correta: O(1)
- Espaco extra iterativo: O(1)

## Quando usar

- reverter lista
- detectar ciclo
- mesclar listas ordenadas

## Erros comuns

- perder referencia do proximo no
- nao tratar lista vazia
- esquecer que a cabeca pode mudar

## Exemplo em JavaScript

```js
function reverseList(head) {
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
```

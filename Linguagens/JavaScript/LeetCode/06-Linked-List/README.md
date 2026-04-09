# Linked List

## O que e

Linked List e uma cadeia de nos.
Cada no guarda:

- um valor
- referencia para o proximo no

Diferenca para array:

- array: acesso por indice e rapido
- linked list: inserir no meio pode ser facil, mas achar posicao custa caminhada

## Intuicao

Pense em vagoes de trem conectados.
Para chegar no quinto vagao, voce passa pelos anteriores.

## Padroes mais usados

- Reversao de lista (prev, curr, next).
- Slow/Fast pointers (meio, ciclo).
- Dummy node para simplificar bordas.

## Complexidade sem misterio

- Achar posicao: O(n)
- Inserir/remover com ponteiro certo: O(1)
- Espaco extra iterativo: O(1)

## Exemplo explicado

`js
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next; // guarda resto da lista
    curr.next = prev;       // vira ponteiro para tras
    prev = curr;            // avanca prev
    curr = next;            // avanca curr
  }

  return prev;
}
`

## Erros comuns de iniciante

- Perder o next antes de inverter.
- Esquecer casos vazios.
- Nao retornar nova cabeca apos operacao.

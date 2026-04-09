# Arrays & Hashing

## O que e

- Array e uma lista em ordem: voce acessa direto por indice.
- Hashing e guardar informacao por chave, como dicionario: chave -> valor.

Pense assim:

- Array: gavetas numeradas.
- Hash map: armario por etiqueta.

## Intuicao

Perguntas que pedem hashing:

- "ja vi esse valor antes?"
- "quantas vezes esse valor aparece?"
- "existe um complemento para formar tal soma?"

## Como funciona na pratica

1. Percorra o array uma vez.
2. Guarde o que precisa no Map ou Set.
3. Consulte em O(1) medio, em vez de procurar tudo de novo.

## Complexidade sem misterio

- indice de array: O(1)
- busca em Map/Set: O(1) medio
- uma passada completa: O(n)

## Exemplo explicado

`js
function containsDuplicate(nums) {
  const seen = new Set();

  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }

  return false;
}
`

## Erros comuns

- usar objeto simples quando Map/Set seria mais claro
- ignorar custo de memoria
- ordenar sem necessidade quando Set resolve

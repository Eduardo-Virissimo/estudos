# Arrays & Hashing

## Visao geral

Arrays guardam elementos em sequencia e permitem acesso por indice em O(1).
Hashing usa estrutura de chave -> valor (Map/Set/objeto) para buscar informacao rapidamente.
A combinacao dos dois resolve muitos problemas de contagem, frequencia e deduplicacao.

## Como funciona

- Array: ideal para percorrer, ordenar, comparar posicoes e usar prefix sum.
- Hash map: salva dados por chave para consultas em O(1) medio.
- Hash set: salva apenas existencia de valor (bom para "ja vi este numero?").

## Complexidade tipica

- Acesso por indice em array: O(1)
- Insercao/busca em hash map ou set: O(1) medio
- Percurso completo: O(n)

## Quando usar

Use quando o problema envolve:

- contar frequencia
- encontrar duplicados
- verificar pares/complementos
- agrupar por chave

## Erros comuns

- usar objeto simples sem considerar comportamento de chaves especiais
- ignorar custo de memoria
- criar estrutura hash quando uma varredura simples ja resolve

## Exemplo em JavaScript

```js
function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
```

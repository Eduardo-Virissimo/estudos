# Arrays & Hashing

Boa escolha para comecar. Esse e um dos blocos mais importantes do LeetCode.

## O que e Array?

Array e uma lista ordenada de valores.
Voce acessa cada posicao por indice.

```js
let numeros = [3, 1, 4, 1, 5];

numeros[0]; // 3
numeros.length; // 5
numeros.push(9); // adiciona no final
numeros.pop(); // remove do final
```

## O que e Hashing?

Hashing e usar uma estrutura de chave -> valor para buscar rapido.
Na pratica, em JS voce usa Map, Set ou objeto.

```js
// Objeto comum
let contagem = {};
contagem["a"] = 1;
contagem["b"] = 2;

// Map (mais seguro para entrevistas)
let map = new Map();
map.set("a", 1);
map.get("a"); // 1
map.has("a"); // true

// Set (quando so importa existencia)
let set = new Set([1, 2, 3]);
set.has(2); // true
set.add(4);
```

## Padrao mais comum

Contar frequencia de elementos.

```js
function contarFrequencia(arr) {
  const map = new Map();

  for (const n of arr) {
    map.set(n, (map.get(n) || 0) + 1);
  }

  return map;
}

contarFrequencia([1, 2, 2, 3, 3, 3]);
// Map { 1 => 1, 2 => 2, 3 => 3 }
```

## Complexidade rapida

- Buscar em Map/Set: O(1) medio
- Percorrer array de n elementos: O(n)

## Problemas para praticar (ordem sugerida)

1. Contains Duplicate - #217
2. Valid Anagram - #242
3. Two Sum - #1

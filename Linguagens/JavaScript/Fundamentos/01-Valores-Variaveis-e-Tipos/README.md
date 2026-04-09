# Valores, Variaveis e Tipos

## Ideia central

Valores sao os dados. Variaveis sao nomes usados para guardar e reutilizar esses dados.

```js
const nome = "Ana";
let idade = 25;
```

## Formas de declarar

### `const`

Use quando a referencia nao deve ser trocada.

```js
const pi = 3.14;
```

### `let`

Use quando o valor pode mudar.

```js
let pontos = 10;
pontos = 20;
```

### `var`

Existe por compatibilidade, mas deve ser evitado em codigo moderno.

## Tipos primitivos

- `string`: texto
- `number`: numero inteiro ou decimal
- `boolean`: `true` ou `false`
- `undefined`: valor ainda nao definido
- `null`: ausencia intencional de valor
- `bigint`: numeros inteiros muito grandes
- `symbol`: identificador unico

## Tipos estruturais

- `object`: objeto com pares chave e valor
- `array`: lista ordenada de valores
- `function`: funcao tambem e um valor

## `typeof`

Serve para descobrir o tipo de um valor.

```js
console.log(typeof "oi"); // string
console.log(typeof 10); // number
console.log(typeof true); // boolean
```

## Cuidado importante

`typeof null` retorna `object`. Isso e uma peculiaridade antiga da linguagem.

## Mutacao x reatribuicao

```js
const usuario = { nome: "Ana" };
usuario.nome = "Bia"; // pode

// usuario = {} -> nao pode, porque trocaria a referencia
```

## Erros comuns

- usar `var` sem necessidade
- achar que `const` torna o objeto totalmente imutavel
- confundir `null` com `undefined`

## Checklist de revisao

- sei quando usar `const` e `let`
- conheco os tipos primitivos
- entendo a diferenca entre objeto e array
- consigo usar `typeof`


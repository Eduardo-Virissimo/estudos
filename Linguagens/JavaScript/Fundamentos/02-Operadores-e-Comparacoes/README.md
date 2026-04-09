# Operadores e Comparacoes

## Operadores aritmeticos

- `+` soma
- `-` subtracao
- `*` multiplicacao
- `/` divisao
- `%` resto da divisao
- `**` potencia

```js
const total = 10 + 5;
const resto = 10 % 3;
```

## Operadores de atribuicao

```js
let saldo = 100;
saldo += 50;
saldo -= 20;
```

## Operadores de comparacao

- `===` igual em valor e tipo
- `!==` diferente em valor ou tipo
- `>` maior que
- `<` menor que
- `>=` maior ou igual
- `<=` menor ou igual

```js
console.log(10 === "10"); // false
console.log(10 == "10"); // true
```

## Regra importante

Prefira `===` e `!==`. Elas evitam comparacoes com conversao automatica inesperada.

## Operadores logicos

- `&&` e
- `||` ou
- `!` negacao

```js
const podeEntrar = idade >= 18 && temIngresso;
```

## Truthy e falsy

Em JavaScript, alguns valores viram `false` em contexto logico:

- `false`
- `0`
- `""`
- `null`
- `undefined`
- `NaN`

Quase todo o resto vira `true`.

## Curto-circuito

```js
const nomeExibido = nome || "Visitante";
const resposta = usuario && usuario.email;
```

## Erros comuns

- usar `==` e criar bugs silenciosos
- esquecer que string vazia e falsy
- misturar comparacao com atribuicao

## Checklist de revisao

- sei diferenciar `===` de `==`
- entendo `&&`, `||` e `!`
- sei identificar valores falsy


# Strings, Numeros e Metodos

## Strings

Strings representam textos.

```js
const nome = "Eduardo";
```

## Operacoes comuns com string

```js
console.log(nome.length);
console.log(nome.toUpperCase());
console.log(nome.includes("ard"));
console.log(nome.slice(0, 3));
```

## Template strings

Use crase para interpolar valores.

```js
const idade = 30;
const frase = `Meu nome e ${nome} e tenho ${idade} anos.`;
```

## Numeros

Todos os numeros comuns entram no tipo `number`.

```js
const preco = 19.9;
```

## Operacoes uteis com numero

```js
console.log(Number("42"));
console.log((19.9).toFixed(2));
console.log(Math.round(4.6));
console.log(Math.max(2, 10, 7));
```

## `NaN`

Significa "Not a Number". Aparece quando uma operacao numerica falha.

```js
console.log(Number("abc")); // NaN
```

## Conversao de tipos

```js
console.log(String(123)); // "123"
console.log(Number("123")); // 123
console.log(Boolean(1)); // true
```

## Erros comuns

- somar string com numero sem perceber
- confiar demais em conversao automatica
- esquecer que `toFixed()` devolve string

## Checklist de revisao

- sei usar metodos basicos de string
- sei converter string para numero
- sei reconhecer `NaN`


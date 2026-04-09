# Funcoes

## O que sao

Funcoes agrupam instrucoes reutilizaveis. Elas ajudam a dividir o problema em partes menores.

## Declaracao de funcao

```js
function somar(a, b) {
  return a + b;
}
```

## Expressao de funcao

```js
const multiplicar = function (a, b) {
  return a * b;
};
```

## Arrow function

```js
const dobrar = (numero) => numero * 2;
```

## Parametros e retorno

- parametros sao entradas
- `return` e a saida da funcao

```js
function saudar(nome = "visitante") {
  return `Ola, ${nome}`;
}
```

## Escopo

Variaveis criadas dentro da funcao existem apenas ali.

```js
function teste() {
  const mensagem = "interna";
  console.log(mensagem);
}
```

## Funcoes puras

Recebem dados, devolvem dados e evitam efeitos colaterais. Sao mais faceis de testar.

## Hoisting

Declaracoes de funcao podem ser chamadas antes da definicao no arquivo. Isso nao vale da mesma forma para `const` com arrow function.

## Erros comuns

- esquecer `return`
- criar funcoes gigantes
- usar nomes vagos como `fazerCoisa`

## Checklist de revisao

- sei declarar funcao de 3 formas
- entendo parametro, argumento e retorno
- sei a diferenca entre funcao declarada e arrow function


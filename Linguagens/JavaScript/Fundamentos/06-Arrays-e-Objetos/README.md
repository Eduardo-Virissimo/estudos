# Arrays e Objetos

## Arrays

Arrays guardam listas em ordem.

```js
const frutas = ["maca", "banana", "uva"];
console.log(frutas[0]); // maca
```

## Metodos comuns de array

- `push()`: adiciona no fim
- `pop()`: remove do fim
- `shift()`: remove do inicio
- `unshift()`: adiciona no inicio
- `includes()`: verifica existencia
- `map()`: transforma itens
- `filter()`: filtra itens
- `find()`: encontra um item

```js
const numeros = [1, 2, 3];
const dobrados = numeros.map((n) => n * 2);
```

## Objetos

Objetos guardam pares chave e valor.

```js
const usuario = {
  nome: "Ana",
  idade: 25,
};
```

## Acesso a propriedades

```js
console.log(usuario.nome);
console.log(usuario["idade"]);
```

## Adicionar e remover propriedades

```js
usuario.email = "ana@email.com";
delete usuario.idade;
```

## Desestruturacao

Ajuda a extrair valores de forma clara.

```js
const { nome, email } = usuario;
```

## Spread

Muito usado para copiar e combinar dados.

```js
const pessoa = { nome: "Ana" };
const pessoaCompleta = { ...pessoa, idade: 25 };
```

## Quando usar cada um

- array: colecao em ordem
- objeto: entidade com propriedades nomeadas

## Erros comuns

- tratar array como objeto comum
- esquecer que copiar objeto com spread e copia rasa
- acessar propriedade sem verificar existencia

## Checklist de revisao

- sei criar e percorrer arrays
- conheco metodos essenciais de array
- sei criar, ler e atualizar objetos
- entendo desestruturacao e spread


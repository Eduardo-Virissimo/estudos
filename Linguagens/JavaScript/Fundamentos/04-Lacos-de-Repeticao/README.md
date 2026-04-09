# Lacos de Repeticao

## `for`

Ideal quando voce sabe quantas repeticoes quer fazer.

```js
for (let i = 0; i < 5; i += 1) {
  console.log(i);
}
```

## `while`

Ideal quando a repeticao depende de uma condicao.

```js
let contador = 0;

while (contador < 3) {
  console.log(contador);
  contador += 1;
}
```

## `for...of`

Percorre valores de iteraveis como arrays e strings.

```js
const nomes = ["Ana", "Bia", "Caio"];

for (const nome of nomes) {
  console.log(nome);
}
```

## `for...in`

Percorre chaves de objetos. Use com cuidado.

```js
const usuario = { nome: "Ana", idade: 25 };

for (const chave in usuario) {
  console.log(chave, usuario[chave]);
}
```

## `break` e `continue`

- `break`: interrompe o laco
- `continue`: pula para a proxima iteracao

## Boas praticas

- evite lacos infinitos
- prefira nomes claros para indices
- use metodos de array quando a intencao ficar mais legivel

## Erros comuns

- esquecer de atualizar a variavel no `while`
- acessar posicoes inexistentes no array
- usar `for...in` em array sem entender o impacto

## Checklist de revisao

- sei usar `for`, `while` e `for...of`
- entendo `break` e `continue`
- sei evitar laco infinito


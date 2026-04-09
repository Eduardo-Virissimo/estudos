# JSON e Storage

## JSON

JSON e um formato de texto usado para troca de dados.

```json
{
  "nome": "Ana",
  "idade": 25
}
```

## Converter objeto para JSON

```js
const usuario = { nome: "Ana", idade: 25 };
const json = JSON.stringify(usuario);
```

## Converter JSON para objeto

```js
const texto = '{"nome":"Ana","idade":25}';
const objeto = JSON.parse(texto);
```

## `localStorage`

Permite salvar dados simples no navegador.

```js
localStorage.setItem("tema", "escuro");
const tema = localStorage.getItem("tema");
localStorage.removeItem("tema");
```

## Salvando objetos

Como storage guarda texto, usamos JSON.

```js
const carrinho = [{ id: 1, nome: "Livro" }];
localStorage.setItem("carrinho", JSON.stringify(carrinho));

const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];
```

## Cuidados

- nao guarde dados sensiveis no `localStorage`
- trate erros ao usar `JSON.parse()`
- lembre que storage e sincronico e simples

## Checklist de revisao

- sei o que e JSON
- sei usar `JSON.stringify()` e `JSON.parse()`
- sei salvar e recuperar dados no `localStorage`


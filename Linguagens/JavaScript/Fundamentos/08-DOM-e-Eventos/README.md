# DOM e Eventos

## O que e DOM

DOM e a representacao da pagina em forma de objetos que o JavaScript pode ler e alterar.

## Selecionando elementos

```js
const titulo = document.querySelector("h1");
const botao = document.querySelector("#salvar");
```

## Alterando conteudo e estilo

```js
titulo.textContent = "Novo titulo";
titulo.style.color = "blue";
```

## Classes

```js
botao.classList.add("ativo");
botao.classList.remove("oculto");
botao.classList.toggle("selecionado");
```

## Eventos

Eventos sao acontecimentos da pagina, como clique, envio de formulario ou digitacao.

```js
botao.addEventListener("click", () => {
  console.log("Botao clicado");
});
```

## Formularios

```js
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Formulario interceptado");
});
```

## Boas praticas

- selecione elementos uma vez quando possivel
- use `textContent` em vez de `innerHTML` quando nao precisar de HTML
- separe logica de interface da logica de dados

## Erros comuns

- tentar acessar elemento que ainda nao existe
- esquecer `event.preventDefault()` em formulario
- abusar de `innerHTML`

## Checklist de revisao

- sei selecionar elementos
- sei alterar texto, classes e estilo
- sei ouvir eventos com `addEventListener`


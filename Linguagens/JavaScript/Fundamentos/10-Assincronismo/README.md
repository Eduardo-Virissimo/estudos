# Assincronismo

## Ideia central

JavaScript executa muitas tarefas em sequencia, mas algumas operacoes demoram e precisam ser tratadas de forma assincrona, como requisicoes HTTP, timers e leitura de arquivos.

## `setTimeout`

```js
console.log("Inicio");

setTimeout(() => {
  console.log("Executou depois");
}, 1000);

console.log("Fim");
```

## Promises

Uma Promise representa um valor que ainda vai chegar.

```js
const promessa = fetch("https://api.exemplo.com/usuarios");
```

Estados de uma Promise:

- `pending`
- `fulfilled`
- `rejected`

## `.then()` e `.catch()`

```js
fetch("https://api.exemplo.com/usuarios")
  .then((resposta) => resposta.json())
  .then((dados) => console.log(dados))
  .catch((erro) => console.error(erro));
```

## `async` e `await`

Deixam o codigo assincrono com cara de sequencial.

```js
async function carregarUsuarios() {
  try {
    const resposta = await fetch("https://api.exemplo.com/usuarios");
    const dados = await resposta.json();
    console.log(dados);
  } catch (erro) {
    console.error(erro);
  }
}
```

## Quando isso e fundamental

- consumir APIs
- esperar resposta do servidor
- lidar com tempo de execucao variavel

## Erros comuns

- esquecer `await`
- nao tratar erro com `catch` ou `try/catch`
- achar que o resultado ja existe antes da Promise resolver

## Checklist de revisao

- entendo a ordem de execucao com `setTimeout`
- sei o que e uma Promise
- sei usar `async/await`
- sei tratar erros assincronos


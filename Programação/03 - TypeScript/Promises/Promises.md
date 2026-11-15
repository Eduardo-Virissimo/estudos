---
nivel: escrito
revisado:
---

# Promises

> *"Uma Promise é um recibo: 'ainda não tenho o seu pedido, mas vou te avisar quando ficar pronto (ou se der errado)'."*

> [!tip] ⚡ Em 30 segundos
> Ler um arquivo, chamar uma API ou esperar um timer **demora**, e o JavaScript não fica parado esperando. Essas operações devolvem uma **Promise**: um objeto que representa um valor **futuro**. Ela começa **pendente** e termina **resolvida** (com o valor) ou **rejeitada** (com um erro). Você reage com `.then()` e `.catch()`, ou, do jeito moderno, com [[Async e Await]]. `Promise.all` roda várias ao mesmo tempo.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Explicar os três estados de uma Promise e por que o código não "espera" sozinho
- Encadear `.then()`, tratar erro com `.catch()` e limpar com `.finally()`
- Rodar várias operações em paralelo com `Promise.all` e `Promise.allSettled`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] (callbacks) · [[Classes no TypeScript]]
- **Depois:** [[Async e Await]] · [[Ler e Escrever Arquivos]] · [[Fetch API]] · [[Event Loop]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O problema

```ts
import { readFile } from "node:fs/promises";

const conteudo = readFile("tarefas.json", "utf-8");
console.log(conteudo); // Promise { <pending> } 😱 não é o texto!
```

`readFile` devolve **na hora** uma Promise; o texto chega depois. O programa segue rodando enquanto o disco trabalha.

### 2. Os três estados

```text
            ┌──► resolvida (fulfilled) → tem o valor
pendente ───┤
            └──► rejeitada (rejected)  → tem o erro
```

Uma vez resolvida ou rejeitada, não muda mais.

### 3. `.then`, `.catch`, `.finally`

```ts
readFile("tarefas.json", "utf-8")
  .then((texto) => JSON.parse(texto))     // recebe o valor, retorna outro
  .then((dados) => console.log(dados))    // recebe o que o anterior retornou
  .catch((erro) => console.error("Falhou:", erro.message)) // qualquer erro da cadeia
  .finally(() => console.log("Fim"));     // sempre roda
```

Cada `.then` devolve **uma nova Promise**, por isso dá pra encadear. Um único `.catch` no fim pega erro de qualquer etapa.

### 4. A ordem de execução

```ts
console.log("1");
setTimeout(() => console.log("3 (timer)"), 0);
Promise.resolve().then(() => console.log("2 (promise)"));
console.log("1b");
// 1, 1b, 2 (promise), 3 (timer)
```

Código síncrono roda **todo** primeiro; depois as Promises; depois os timers. O porquê está em [[Event Loop]].

### 5. Criando uma Promise

Raramente você cria (as bibliotecas já devolvem), mas ajuda a entender:

```ts
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sortear(): Promise<number> {
  return new Promise((resolve, reject) => {
    const n = Math.random();
    if (n < 0.2) reject(new Error("Azar!"));
    else resolve(n);
  });
}

esperar(1000).then(() => console.log("1 segundo depois"));
```

O tipo é `Promise<T>`: `T` é o que vem quando resolve.

### 6. Várias ao mesmo tempo

```ts
const [tarefas, config] = await Promise.all([
  readFile("tarefas.json", "utf-8"),
  readFile("config.json", "utf-8"),
]);
```

| Função | Resolve quando | Rejeita quando |
|---|---|---|
| `Promise.all` | **todas** resolverem | **qualquer uma** falhar |
| `Promise.allSettled` | todas terminarem (sucesso ou erro) | nunca |
| `Promise.race` | a primeira terminar | a primeira terminar com erro |
| `Promise.any` | a primeira **resolver** | todas falharem |

```ts
const resultados = await Promise.allSettled(urls.map((u) => fetch(u)));
for (const r of resultados) {
  if (r.status === "fulfilled") console.log("ok", r.value.status);
  else console.error("falhou", r.reason);
}
```

> O `await` acima é de [[Async e Await]], a próxima nota. É assim que se usa no dia a dia.

### 7. Callback → Promise: de onde viemos

```ts
// antigo: "callback hell"
lerArquivo("a.txt", (erro, a) => {
  if (erro) return tratar(erro);
  lerArquivo("b.txt", (erro, b) => {
    if (erro) return tratar(erro);
    salvar(a + b, (erro) => { /* ... */ });
  });
});
```

Promises achataram essa pirâmide numa cadeia; `async`/`await` deixou com cara de código normal.

---

## 🛠️ Exemplo guiado

Simulando chamadas lentas e comparando sequencial × paralelo:

```ts
const esperar = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function buscarUsuario(id: number) {
  await esperar(500);                 // finge ser uma chamada de rede
  return { id, nome: `usuario${id}` };
}

console.time("sequencial");
const a = await buscarUsuario(1);
const b = await buscarUsuario(2);
const c = await buscarUsuario(3);
console.timeEnd("sequencial");        // ~1500 ms

console.time("paralelo");
const todos = await Promise.all([1, 2, 3].map(buscarUsuario));
console.timeEnd("paralelo");          // ~500 ms
```

Se uma operação não depende da outra, rode junto.

---

## 🔧 Pegadinhas

- **Usar o valor antes de chegar.** `const x = readFile(...)` é uma Promise, não o conteúdo. Use `.then` ou `await`.
- **Esquecer de retornar dentro do `.then`.** `.then(t => { JSON.parse(t) })` passa `undefined` adiante. Retorne.
- **Promise sem `.catch`.** Vira `UnhandledPromiseRejection` e, no Node, derruba o programa. Toda cadeia termina tratando o erro.
- **`Promise.all` quando uma falha não deveria derrubar as outras.** Use `allSettled`.
- **Paralelizar sem limite.** `Promise.all` com 10 mil requisições sobrecarrega o servidor (e você leva [[Rate Limiting]]). Processe em lotes.

---

## 🔨 Desafio prático

**Objetivo:** dominar a ordem e o paralelismo.

1. Antes de rodar, escreva a ordem que você acha que aparece:
   ```ts
   console.log("A");
   setTimeout(() => console.log("B"), 0);
   Promise.resolve().then(() => console.log("C"));
   new Promise<void>((r) => { console.log("D"); r(); }).then(() => console.log("E"));
   console.log("F");
   ```
2. Crie `tentar(): Promise<string>` que, depois de 300 ms, resolve com `"ok"` ou rejeita com 30% de chance.
3. Rode 10 com `Promise.allSettled` e conte sucessos e falhas.
4. Rode com `Promise.all` e veja o que acontece quando uma falha.

**Pronto quando:** você acertou a ordem (A, D, F, C, E, B) e sabe explicar por que o `D` sai antes do `F`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quais são os três estados de uma Promise?
> Pendente, resolvida (fulfilled, com valor) e rejeitada (rejected, com erro).

> [!question]- Por que `console.log(readFile(...))` mostra `Promise { <pending> }`?
> Porque `readFile` devolve na hora uma Promise; o conteúdo só chega depois. É preciso `await` ou `.then`.

> [!question]- Qual a diferença entre `Promise.all` e `Promise.allSettled`?
> `all` rejeita se qualquer uma falhar; `allSettled` espera todas e devolve o resultado de cada uma (sucesso ou erro).

> [!question]- O que acontece com uma Promise rejeitada sem `.catch`?
> Gera uma rejeição não tratada; no Node, isso encerra o programa com erro.

> [!question]- Por que dá pra encadear `.then().then()`?
> Porque cada `.then` devolve uma nova Promise, que resolve com o valor retornado pela função dele.

> [!question]- Quando rodar operações em paralelo em vez de uma depois da outra?
> Quando uma não depende do resultado da outra: o tempo total vira o da mais lenta, não a soma.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `Promise<T>` | tipo: valor futuro do tipo T |
| `p.then(v => ...)` | reage ao valor |
| `p.catch(e => ...)` | trata o erro |
| `p.finally(() => ...)` | sempre roda |
| `new Promise((resolve, reject) => ...)` | criar |
| `Promise.all([...])` | todas, falha se uma falhar |
| `Promise.allSettled([...])` | todas, com o status de cada |
| `Promise.race([...])` | a primeira que terminar |

---

## 🛠️ Exemplo meu

```ts

```

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
- 

**O que me confundiu / onde eu errei:**
- 

**Onde eu usei de verdade:**
- 

---

## 📚 Recursos

- [javascript.info · Promises, async/await](https://javascript.info/async) (capítulo inteiro, o melhor material sobre o tema)
- [MDN · Usando promises](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises)
- [Loupe](http://latentflip.com/loupe/): visualize a pilha, a fila e o event loop rodando

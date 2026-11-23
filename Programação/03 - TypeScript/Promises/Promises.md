---
nivel: escrito
foco: essencial
revisado:
---

# Promises

**Quanto focar: 🔥 essencial.** Tudo que fala com rede, banco ou arquivo é assíncrono. Domine, junto com Async e Await.

Olhe este código, que parece perfeitamente certo:

```ts
import { readFile } from "node:fs/promises";

const conteudo = readFile("tarefas.json", "utf-8");
console.log(conteudo); // Promise { <pending> } 😱 não é o texto!
```

Você pediu o conteúdo do arquivo, e recebeu uma coisa chamada `Promise { <pending> }`. Não é erro: o programa rodou. Mas também não é o texto que você queria. O que aconteceu?

Aconteceu que ler do disco **demora** (em tempo de computador, uma eternidade), e o JavaScript **não fica parado esperando**. Ele segue rodando o resto do programa. Então, em vez do texto, o `readFile` devolveu **na hora** uma **Promise**: um objeto que representa um valor que **vai chegar depois**. Ela começa **pendente**, e termina **resolvida** (com o valor) ou **rejeitada** (com um erro).

Entender Promises é entender como o JavaScript lida com tudo o que demora: arquivos, internet, timers. E tem um bônus que vale muito: o `Promise.all` roda várias operações ao mesmo tempo, o que pode deixar um programa várias vezes mais rápido. Ajuda ter passado pelos callbacks em [[Funções]].

## A senha da lanchonete

Pense numa lanchonete. Você faz o pedido, e o atendente te entrega uma **senha**. A senha não é o lanche, mas é a promessa de que ele vai chegar. E enquanto o lanche não fica pronto, você não fica parado na frente do balcão: senta, conversa, mexe no celular. Quando o lanche fica pronto, chamam a sua senha.

A Promise é a senha. E por que o JavaScript funciona assim, em vez de simplesmente esperar? Porque se ele parasse esperando cada leitura de disco ou cada chamada de internet, um servidor conseguiria atender uma pessoa por vez. Com a senha, ele atende todo mundo, e cada um recebe o seu lanche quando fica pronto.

Pra pegar o valor quando ele chegar, você diz o que fazer com ele, usando o `.then` (ou o `await`, na próxima nota):

```ts
readFile("tarefas.json", "utf-8")
  .then((texto) => console.log(texto)); // roda quando o texto chegar
```

Então, quando aparecer `Promise { <pending> }` onde você esperava um valor, a explicação é sempre a mesma: você guardou a senha, não o lanche. Faltou um `.then` ou um `await`.

## Os três estados

Toda Promise passa por estes estados:

```text
            ┌──► resolvida (fulfilled) → tem o valor
pendente ───┤
            └──► rejeitada (rejected)  → tem o erro
```

Ela nasce pendente e termina de um dos dois jeitos. E depois que resolve ou rejeita, não muda mais. Você reage a cada caso:

```ts
readFile("tarefas.json", "utf-8")
  .then((texto) => JSON.parse(texto))     // recebe o valor e devolve outro
  .then((dados) => console.log(dados))    // recebe o que o anterior devolveu
  .catch((erro) => console.error("Falhou:", erro.message)) // erro de qualquer etapa
  .finally(() => console.log("Fim"));     // roda sempre, deu certo ou não
```

Repare que dá pra encadear vários `.then`. Isso funciona porque cada `.then` devolve **uma nova Promise**: o valor que um devolve vira a entrada do próximo. E um único `.catch` no fim pega o erro de **qualquer** etapa da cadeia.

Duas armadilhas moram aqui. A primeira é esquecer o `return` dentro do `.then`: um `.then(t => { JSON.parse(t) })`, com chaves e sem `return`, passa `undefined` pra próxima etapa (é a mesma armadilha das arrow functions em [[Funções]]).

A segunda é mais grave: **uma Promise rejeitada que ninguém trata.** Ela vira um `UnhandledPromiseRejection` e, no Node, **derruba o programa inteiro**. Por isso toda cadeia de Promises precisa terminar tratando o erro, com um `.catch`.

## Várias ao mesmo tempo

Esta é a parte que mais compensa entender. Se você precisa de três coisas que não dependem uma da outra, não faz sentido esperar uma terminar pra só então começar a próxima. Compare:

```ts
const esperar = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function buscarUsuario(id: number) {
  await esperar(500); // finge ser uma chamada de rede
  return { id, nome: `usuario${id}` };
}

// uma depois da outra: ~1500 ms
const a = await buscarUsuario(1);
const b = await buscarUsuario(2);
const c = await buscarUsuario(3);

// todas juntas: ~500 ms
const todos = await Promise.all([1, 2, 3].map(buscarUsuario));
```

O `Promise.all` dispara todas de uma vez e espera **todas** terminarem. Três vezes mais rápido, só mudando a forma de chamar. Voltando à lanchonete: é a diferença entre pedir um lanche, esperar, pedir o segundo, esperar, pedir o terceiro; ou pedir os três de uma vez. (O `await` que aparece aí é o assunto da próxima nota, [[Async e Await]], e é como se usa no dia a dia.)

Existem algumas variações, pra situações diferentes:

| Função | Resolve quando | Rejeita quando |
|---|---|---|
| `Promise.all` | **todas** resolverem | **qualquer uma** falhar |
| `Promise.allSettled` | todas terminarem (sucesso ou erro) | nunca |
| `Promise.race` | a primeira terminar | a primeira terminar com erro |
| `Promise.any` | a primeira **resolver** | todas falharem |

A diferença que mais importa é entre as duas primeiras. Com o `Promise.all`, se uma de dez falhar, você perde o resultado das outras nove, mesmo as que deram certo. Quando isso não pode acontecer, use o `allSettled`, que espera todas e conta o que aconteceu com cada uma:

```ts
const resultados = await Promise.allSettled(urls.map((u) => fetch(u)));
for (const r of resultados) {
  if (r.status === "fulfilled") console.log("ok", r.value.status);
  else console.error("falhou", r.reason);
}
```

E um cuidado: paralelizar sem limite também é um problema. Um `Promise.all` com dez mil requisições de uma vez sobrecarrega o servidor do outro lado, e você leva um bloqueio por [[Rate Limiting]]. Pra muitas operações, processe em lotes.

## Em que ordem as coisas acontecem

Olhe este código e tente prever a ordem:

```ts
console.log("1");
setTimeout(() => console.log("3 (timer)"), 0);
Promise.resolve().then(() => console.log("2 (promise)"));
console.log("1b");
// 1, 1b, 2 (promise), 3 (timer)
```

Mesmo com tempo **zero**, o timer roda por último. A regra é: todo o código normal roda primeiro; depois, as Promises que já estão prontas; e só depois, os timers. O porquê disso, com o mecanismo inteiro, está na nota [[Event Loop]].

## Criando uma Promise

Na maioria das vezes você só **usa** Promises que as bibliotecas devolvem. Mas criar uma, ao menos uma vez, ajuda muito a entender como elas funcionam:

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
```

Quando você cria uma Promise, recebe duas funções: o `resolve`, que você chama com o valor quando der certo, e o `reject`, que você chama com o erro quando falhar. E o tipo `Promise<number>` diz o que vem quando ela resolve.

Uma curiosidade histórica: antes das Promises, código assíncrono era feito com callbacks aninhados, uns dentro dos outros, a famosa "pirâmide do mal":

```ts
lerArquivo("a.txt", (erro, a) => {
  if (erro) return tratar(erro);
  lerArquivo("b.txt", (erro, b) => {
    if (erro) return tratar(erro);
    salvar(a + b, (erro) => { /* ... */ });
  });
});
```

As Promises achataram essa pirâmide numa cadeia de `.then`, e o `async`/`await` depois deixou tudo com cara de código normal. Você ainda vai encontrar esse estilo antigo em código mais velho.

## O essencial

1. Uma Promise é a senha da lanchonete: o valor chega depois. `Promise { <pending> }` quer dizer que faltou `.then` ou `await`.
2. Pendente, depois resolvida (com valor) ou rejeitada (com erro).
3. Cada `.then` devolve uma Promise nova, por isso encadeia. Um `.catch` no fim pega tudo.
4. Promise rejeitada sem tratamento derruba o programa no Node.
5. Operações independentes: `Promise.all`. Se não pode perder as que deram certo: `allSettled`.

## Agora é com você

Primeiro, um teste de previsão. Antes de rodar, escreva a ordem em que você acha que as letras aparecem:

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
new Promise<void>((r) => { console.log("D"); r(); }).then(() => console.log("E"));
console.log("F");
```

Depois, crie uma função `tentar(): Promise<string>` que, depois de 300 ms, resolve com `"ok"` ou rejeita, com 30% de chance. Rode dez delas com `Promise.allSettled` e conte quantas deram certo e quantas falharam. Depois rode com `Promise.all`, e veja o que acontece quando uma falha. Você terminou quando acertar a ordem (A, D, F, C, E, B) e souber explicar por que o `D` sai antes do `F`. (Uma dica: a função que você passa pro `new Promise` roda na hora.)

Daqui, siga pro [[Async e Await]], e depois pra [[Ler e Escrever Arquivos]], [[Fetch API]] e [[Event Loop]].

---

## 🧠 Me teste

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

> [!question]+ Você precisa de 3 requisições e quer o resultado de todas, mesmo que alguma falhe. Qual usar?
> - a) `Promise.all`
> - b) `Promise.allSettled`
> - c) `Promise.race`
> - d) Três `await` seguidos
>
> > [!check]- Resposta
> > **b)** `Promise.all` rejeita na primeira falha e você perde as outras. `allSettled` espera todas e diz qual deu certo e qual falhou.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `Promise<T>` | Tipo: um valor futuro do tipo T |
| `p.then(v => ...)` | Reage ao valor |
| `p.catch(e => ...)` | Trata o erro |
| `p.finally(() => ...)` | Sempre roda |
| `new Promise((resolve, reject) => ...)` | Criar uma |
| `Promise.all([...])` | Todas; falha se uma falhar |
| `Promise.allSettled([...])` | Todas, com o status de cada |
| `Promise.race([...])` | A primeira que terminar |

**Pra ler e ver:** o capítulo [Promises, async/await](https://javascript.info/async) do javascript.info é, de longe, o melhor material sobre o assunto, e vale ler inteiro. O guia [Usando promises do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises) está em português. E o [Loupe](http://latentflip.com/loupe/) mostra, animado, a pilha, a fila e o event loop rodando: cole o exercício de ordem lá e veja acontecer.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
revisado:
---

# Async e Await

> *"`await` não faz o computador esperar. Faz só a sua função esperar."*

> [!tip] ⚡ Em 30 segundos
> `async`/`await` é o jeito moderno de usar [[Promises]] com cara de código normal, de cima pra baixo. Uma função `async` **sempre devolve uma Promise**; dentro dela, `await promessa` pausa **só aquela função** até o valor chegar, enquanto o resto do programa continua. Erros viram exceções comuns, tratadas com `try/catch`. Cuidado com o `await` em sequência quando as operações poderiam rodar juntas.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever funções `async` e usar `await` em vez de `.then`
- Tratar erros assíncronos com `try/catch/finally`
- Evitar os erros clássicos: `await` esquecido, `await` em sequência desnecessário e `await` dentro de `forEach`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Promises]]
- **Depois:** [[Ler e Escrever Arquivos]] · [[Fetch API]] · [[Servidor HTTP com Node.js]] · [[Event Loop]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. De `.then` pra `await`

```ts
import { readFile } from "node:fs/promises";

// com .then
function carregar() {
  return readFile("tarefas.json", "utf-8")
    .then((texto) => JSON.parse(texto))
    .catch(() => []);
}

// com async/await: mesma coisa
async function carregar2() {
  try {
    const texto = await readFile("tarefas.json", "utf-8");
    return JSON.parse(texto);
  } catch {
    return [];
  }
}
```

### 2. As regras

1. `await` só funciona **dentro de função `async`** (ou no topo de um módulo ES).
2. Função `async` **sempre** devolve `Promise`: `async function f(): Promise<number> { return 1 }`.
3. `await` em algo que não é Promise só devolve o valor (não quebra, mas não faz sentido).
4. Quem chama uma função `async` **também** precisa de `await` pra pegar o valor.

```ts
async function dobro(n: number): Promise<number> {
  return n * 2;
}
const x = dobro(5);        // Promise<number> 😱
const y = await dobro(5);  // 10 ✅
```

### 3. Erros com `try/catch`

```ts
async function salvarSeguro(dados: unknown) {
  try {
    await writeFile("tarefas.json", JSON.stringify(dados, null, 2));
    console.log("Salvo!");
  } catch (erro) {
    // erro é unknown: confira antes de usar
    const msg = erro instanceof Error ? erro.message : String(erro);
    console.error(`Não consegui salvar: ${msg}`);
  } finally {
    console.log("Tentativa terminada");
  }
}
```

`reject` de uma Promise vira um `throw` na linha do `await`.

### 4. Top-level `await`

Em módulos ES (`"type": "module"`), dá pra usar `await` direto no arquivo, fora de função:

```ts
// src/main.ts
const config = JSON.parse(await readFile("config.json", "utf-8"));
```

Em scripts CommonJS ou ambientes antigos, use o padrão `async function main() { ... } main();`.

### 5. Sequencial × paralelo

```ts
// ❌ 3 segundos: espera um pra começar o outro (sem necessidade)
const a = await buscar("a");
const b = await buscar("b");
const c = await buscar("c");

// ✅ 1 segundo: começa os três, espera todos
const [a2, b2, c2] = await Promise.all([buscar("a"), buscar("b"), buscar("c")]);
```

Use sequencial **só quando** o próximo depende do anterior (`const user = await ...; const pedidos = await buscarPedidos(user.id)`).

### 6. Laços

```ts
// ❌ forEach não espera: dispara tudo e segue em frente
arquivos.forEach(async (f) => { await processar(f); });
console.log("fim"); // aparece ANTES de processar

// ✅ um de cada vez (quando a ordem importa ou é pesado)
for (const f of arquivos) {
  await processar(f);
}

// ✅ todos juntos
await Promise.all(arquivos.map((f) => processar(f)));
```

### 7. Timeout simples

```ts
const esperar = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Node e navegadores modernos:
const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) }); // desiste em 5s
```

---

## 🛠️ Exemplo guiado

Um `main` assíncrono completo, com tratamento de erro e código de saída:

```ts
import { readFile, writeFile } from "node:fs/promises";

interface Tarefa { id: number; titulo: string; concluida: boolean }
const ARQUIVO = "tarefas.json";

async function carregar(): Promise<Tarefa[]> {
  try {
    return JSON.parse(await readFile(ARQUIVO, "utf-8")) as Tarefa[];
  } catch (erro) {
    if (erro instanceof Error && "code" in erro && erro.code === "ENOENT") return []; // primeiro uso
    throw erro; // outro erro: deixa subir
  }
}

async function salvar(tarefas: Tarefa[]): Promise<void> {
  await writeFile(ARQUIVO, JSON.stringify(tarefas, null, 2));
}

async function main() {
  const tarefas = await carregar();
  tarefas.push({ id: tarefas.length + 1, titulo: process.argv[2] ?? "Sem título", concluida: false });
  await salvar(tarefas);
  console.log(`${tarefas.length} tarefa(s) salvas`);
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
```

Repare no `carregar`: arquivo inexistente é **esperado** (vira lista vazia); qualquer outro erro **sobe**. Engolir todos os erros esconderia um JSON corrompido.

---

## 🔧 Pegadinhas

- **Esquecer o `await`.** O código segue com uma `Promise` no lugar do valor; `if (await existe())` vs `if (existe())` (sempre true!). Ligue a regra `no-floating-promises` do [[Linter]] (typescript-eslint).
- **`await` dentro de `forEach`.** Não espera. Use `for...of` ou `Promise.all` + `map`.
- **`await` em série sem precisar.** Deixa tudo lento. Se não dependem um do outro, `Promise.all`.
- **`catch` que engole tudo.** `catch {}` vazio esconde bugs. Trate o erro esperado e relance o resto.
- **`return await` dentro de `try`.** Dentro de `try/catch`, `return await x` é necessário pra o `catch` pegar o erro; sem `try`, é redundante.
- **Misturar `.then` e `await` no mesmo trecho.** Funciona, mas confunde. Escolha um.

---

## 🔨 Desafio prático

**Objetivo:** um "verificador de sites" no terminal.

1. Receba URLs por argumento: `npx tsx verificar.ts https://github.com https://naoexiste.tld`.
2. Pra cada uma, faça `fetch` com timeout de 5 s e meça o tempo (`performance.now()`).
3. Rode **todas em paralelo** com `Promise.allSettled`.
4. Mostre uma tabela (`console.table`) com URL, status (ou erro) e tempo em ms.
5. Termine com código de saída `1` se alguma falhou.

**Pronto quando:** com 3 URLs, o tempo total é próximo do da mais lenta (não a soma), e a URL inválida aparece como erro sem derrubar as outras.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que uma função `async` sempre devolve?
> Uma Promise, mesmo que você retorne um valor comum.

> [!question]- O `await` trava o programa inteiro?
> Não. Pausa só a função `async` onde está; o resto do programa (outros eventos, outras Promises) continua rodando.

> [!question]- Como tratar erro de um `await`?
> Com `try/catch` em volta: uma Promise rejeitada vira um `throw` na linha do `await`.

> [!question]- Por que `lista.forEach(async x => await f(x))` não espera?
> Porque o `forEach` ignora as Promises que a função devolve. Use `for...of` com `await` ou `Promise.all(lista.map(f))`.

> [!question]- Quando é errado fazer vários `await` em sequência?
> Quando as operações não dependem uma da outra: o tempo vira a soma. Nesse caso, `Promise.all`.

> [!question]- O que é top-level await?
> Poder usar `await` direto no topo de um arquivo de módulo ES, fora de qualquer função.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `async function f(): Promise<T>` | função assíncrona |
| `const v = await p` | espera o valor |
| `try { await p } catch (e) { }` | trata erro |
| `await Promise.all([a(), b()])` | em paralelo |
| `for (const x of xs) await f(x)` | em sequência |
| `main().catch(...)` | erro do topo |
| `AbortSignal.timeout(5000)` | desistir depois de 5 s |

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

- [javascript.info · Async/await](https://javascript.info/async-await)
- [MDN · async function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)
- [typescript-eslint · no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/)

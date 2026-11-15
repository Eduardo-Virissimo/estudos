---
nivel: escrito
revisado:
---

# Estruturas de Repetição

> *"Computador é bom em uma coisa: fazer a mesma coisa um milhão de vezes sem reclamar."*

> [!tip] ⚡ Em 30 segundos
> Laços (*loops*) repetem um bloco de código. `for` clássico quando você sabe quantas vezes, `for...of` pra percorrer os itens de uma lista, `while` quando a repetição depende de uma condição que muda. `break` sai do laço, `continue` pula pra próxima volta. O erro clássico é o **laço infinito**: a condição nunca fica falsa.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escolher entre `for`, `for...of` e `while` pra cada situação
- Usar `break` e `continue` e evitar laço infinito
- Acumular resultados num laço (soma, contagem, maior valor, nova lista)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Estruturas Condicionais]]
- **Depois:** [[Funções]] · [[Objetos e Arrays no JavaScript]] (métodos `map`, `filter`, `reduce`)
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. `for` clássico: contador

```ts
for (let i = 1; i <= 5; i++) {
  console.log(`Volta ${i}`);
}
//   início     condição   passo
```

### 2. `for...of`: cada item de uma lista

```ts
const tarefas = ["estudar", "treinar", "dormir"];
for (const tarefa of tarefas) {
  console.log(tarefa);
}
```

Precisa do índice também? `for (const [i, tarefa] of tarefas.entries())`.

> ⚠️ `for...in` percorre as **chaves** de um objeto, não os valores de um array. Pra arrays, use `for...of`.

### 3. `while`: enquanto a condição valer

```ts
let vida = 100;
while (vida > 0) {
  vida -= 30;
  console.log(`Vida: ${vida}`);
}
```

`do...while` executa **pelo menos uma vez** antes de testar (útil pra menus: "mostra, depois pergunta se continua").

### 4. `break` e `continue`

```ts
for (const n of [3, 8, -1, 5]) {
  if (n < 0) break;        // para tudo
  if (n % 2 === 0) continue; // pula os pares
  console.log(n);           // 3
}
```

### 5. Os 4 padrões de acumulador

Quase todo laço é um destes:

```ts
const xps = [120, 80, 200, 50];

let soma = 0;                 // 1. somar
for (const xp of xps) soma += xp;

let acima100 = 0;             // 2. contar
for (const xp of xps) if (xp > 100) acima100++;

let maior = -Infinity;        // 3. maior/menor
for (const xp of xps) if (xp > maior) maior = xp;

const dobrados: number[] = []; // 4. nova lista
for (const xp of xps) dobrados.push(xp * 2);
```

Mais tarde você troca esses padrões por `reduce`, `filter` e `map` ([[Objetos e Arrays no JavaScript]]). Mas entenda o laço primeiro: é o que eles fazem por dentro.

### 6. Laço dentro de laço

```ts
for (let linha = 1; linha <= 3; linha++) {
  let texto = "";
  for (let col = 1; col <= 3; col++) texto += `${linha * col}\t`;
  console.log(texto);
}
```

Cuidado com o custo: 1.000 × 1.000 = 1 milhão de voltas ([[Big O]]).

---

## 🛠️ Exemplo guiado

Menu que repete até o usuário sair:

```ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const rl = readline.createInterface({ input, output });
  const tarefas: string[] = [];

  while (true) {
    const op = (await rl.question("[a]dicionar, [l]istar, [s]air: ")).trim();
    if (op === "s") break;
    if (op === "a") tarefas.push(await rl.question("Tarefa: "));
    else if (op === "l") {
      for (const [i, t] of tarefas.entries()) console.log(`${i + 1}. ${t}`);
    } else console.error("Opção inválida");
  }

  rl.close();
}

main();
```

`while (true)` + `break` é aceitável **quando a saída é clara** e está no topo do laço.

---

## 🔧 Pegadinhas

- **Laço infinito.** A variável da condição nunca muda (`while (i < 10)` sem `i++`). Se travar, `Ctrl + C` no [[Terminal]].
- **Erro de um a mais/a menos (*off-by-one*).** Arrays começam no índice 0: o último é `lista.length - 1`. `i <= lista.length` passa do fim.
- **Mudar a lista enquanto percorre.** Remover itens dentro do `for...of` pula elementos. Crie uma lista nova.
- **`for...in` em array.** Dá os índices como texto (`"0"`, `"1"`). Use `for...of`.
- **Começar o "maior" em 0.** Se todos forem negativos, dá errado. Comece em `-Infinity` ou no primeiro item.

---

## 🔨 Desafio prático

**Objetivo:** o jogo "adivinhe o número".

1. Sorteie um número de 1 a 100: `Math.floor(Math.random() * 100) + 1`.
2. Num `while`, peça um palpite e responda "maior", "menor" ou "acertou".
3. Conte as tentativas e mostre no fim.
4. Se o usuário digitar algo que não é número, avise e **não** conte como tentativa (`continue`).

**Pronto quando:** dá pra jogar até acertar, entrada inválida não quebra nada e o total de tentativas está certo.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quando usar `for`, `for...of` e `while`?
> `for` quando sabe quantas vezes (contador); `for...of` pra percorrer os itens de uma lista; `while` quando depende de uma condição que muda durante a execução.

> [!question]- Qual a diferença entre `break` e `continue`?
> `break` sai do laço inteiro; `continue` pula o resto da volta atual e vai pra próxima.

> [!question]- Qual a diferença entre `for...of` e `for...in`?
> `for...of` dá os valores (use em arrays); `for...in` dá as chaves de um objeto.

> [!question]- O que causa um laço infinito?
> Uma condição que nunca fica falsa, normalmente porque a variável testada não muda dentro do laço.

> [!question]- Qual o índice do último elemento de um array?
> `lista.length - 1`, porque os índices começam em 0.

> [!question]- Quando usar `do...while`?
> Quando o bloco precisa rodar pelo menos uma vez antes do teste (ex: mostrar um menu antes de perguntar se continua).

---

## 📋 Cola rápida

| Sintaxe | Quando |
|---|---|
| `for (let i = 0; i < n; i++)` | n vezes |
| `for (const x of lista)` | cada item |
| `for (const [i, x] of lista.entries())` | item + índice |
| `for (const chave in objeto)` | chaves de objeto |
| `while (cond)` | enquanto valer |
| `do { } while (cond)` | pelo menos uma vez |
| `break` / `continue` | sair / pular volta |

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

- [MDN · Laços e iterações](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Loops_and_iteration)
- [javascript.info · Loops: while and for](https://javascript.info/while-for)

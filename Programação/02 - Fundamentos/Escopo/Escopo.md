---
nivel: escrito
revisado:
---

# Escopo

> *"Variável global é como deixar a chave de casa embaixo do tapete: funciona até alguém achar."*

> [!tip] ⚡ Em 30 segundos
> **Escopo** é a região do código onde uma variável existe e pode ser usada. Em JavaScript moderno, `let` e `const` vivem no **bloco** `{ }` onde foram criados; o código de dentro enxerga o de fora, mas o de fora não enxerga o de dentro. Quanto menor o escopo de uma variável, menos lugares podem quebrá-la.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Prever onde uma variável pode ser acessada (global, de função, de bloco)
- Explicar *shadowing* (sombreamento) e por que evitar
- Explicar o que é uma closure com um exemplo de contador

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Variáveis e Tipos de Dados]]
- **Depois:** [[Recursão]] · [[Modularização]] · [[Closures]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Os três níveis

```ts
const app = "Estudos RPG";          // global (no módulo): visível no arquivo todo

function mostrar() {
  const nivel = 3;                  // de função: só dentro de mostrar()
  if (nivel > 2) {
    const titulo = "Veterano";      // de bloco: só dentro deste if
    console.log(app, nivel, titulo); // ✅ dentro enxerga fora
  }
  // console.log(titulo);           // ❌ titulo is not defined
}
// console.log(nivel);              // ❌ nivel is not defined
```

**Regra:** de dentro pra fora, sim. De fora pra dentro, nunca.

### 2. Bloco é qualquer `{ }`

`if`, `for`, `while` e `{ }` soltos criam escopo pra `let`/`const`:

```ts
for (let i = 0; i < 3; i++) { /* i existe aqui */ }
// i não existe aqui
```

### 3. `var` ignora blocos (mais um motivo pra não usar)

```ts
if (true) { var x = 1; }
console.log(x); // 1 😬 vazou do bloco
```

### 4. Shadowing: o mesmo nome em níveis diferentes

```ts
const nome = "global";
function f() {
  const nome = "local"; // "sombreia" o de fora
  console.log(nome);    // "local"
}
```

Funciona, mas confunde quem lê. Dê nomes diferentes.

### 5. Closure: a função lembra de onde nasceu

```ts
function criarContador() {
  let total = 0;                 // vive no escopo de criarContador
  return () => ++total;          // a função de dentro continua acessando total
}

const contar = criarContador();
contar(); // 1
contar(); // 2
// ninguém de fora consegue mexer em total direto: ele está "protegido"
```

A função interna carrega o escopo onde foi criada, mesmo depois que `criarContador` terminou. É assim que JS guarda estado privado. Aprofundamento em [[Closures]].

### 6. Global é o último recurso

Variável global pode ser alterada por qualquer função, de qualquer lugar. Quando dá bug, você não sabe quem mudou. Prefira **passar por parâmetro e receber pelo retorno** ([[Funções]]).

---

## 🛠️ Exemplo guiado

O bug clássico de escopo com `var` dentro de laço:

```ts
const acoes: (() => void)[] = [];

for (var i = 0; i < 3; i++) {
  acoes.push(() => console.log(i));
}
acoes.forEach((a) => a()); // 3, 3, 3 😱 — todas compartilham o mesmo i

const acoes2: (() => void)[] = [];
for (let j = 0; j < 3; j++) {
  acoes2.push(() => console.log(j));
}
acoes2.forEach((a) => a()); // 0, 1, 2 ✅ — let cria um j novo por volta
```

---

## 🔧 Pegadinhas

- **"X is not defined".** Você está usando a variável fora do bloco onde ela nasceu. Declare no nível de fora, se precisar dela lá.
- **Acessar antes de declarar.** `console.log(x); let x = 1;` dá `Cannot access 'x' before initialization` (a "zona morta temporal").
- **Esquecer `const`/`let`.** Em código fora de módulo, `x = 5` sem declarar cria uma global sem querer. O TypeScript e o modo estrito bloqueiam.
- **Shadowing acidental.** Um parâmetro com o mesmo nome de uma variável de fora esconde a de fora.

---

## 🔨 Desafio prático

**Objetivo:** prever, depois rodar.

1. Escreva no papel o que cada `console.log` mostra (ou se dá erro):
   ```ts
   let a = 1;
   function f() { let a = 2; { let a = 3; console.log(a); } console.log(a); }
   f(); console.log(a);
   ```
2. Crie `criarCofre(senha: string)` que retorna `{ abrir(tentativa) }`: devolve `true` só com a senha certa, e depois de 3 erros sempre devolve `false`. A senha e o contador de erros não podem ser acessíveis de fora.

**Pronto quando:** você acertou a previsão (3, 2, 1) e o cofre bloqueia depois de 3 erros, sem nenhuma variável global.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que é escopo?
> A região do código onde uma variável existe e pode ser acessada.

> [!question]- Código de dentro de um bloco enxerga variáveis de fora? E o contrário?
> De dentro enxerga as de fora; de fora não enxerga as de dentro.

> [!question]- Por que `var` causa bugs de escopo?
> Porque ignora blocos (`if`, `for`): a variável vaza pra função inteira. `let` e `const` respeitam o bloco.

> [!question]- O que é uma closure?
> Uma função que continua acessando as variáveis do escopo onde foi criada, mesmo depois que esse escopo terminou.

> [!question]- O que é shadowing?
> Declarar uma variável com o mesmo nome de outra de um escopo externo, escondendo a de fora dentro daquele bloco.

> [!question]- Por que evitar variáveis globais?
> Porque qualquer parte do código pode alterá-las; quando dá bug, é difícil descobrir quem mudou.

---

## 📋 Cola rápida

| Situação | Resultado |
|---|---|
| `let`/`const` dentro de `{ }` | só existe no bloco |
| `var` dentro de `if` | vaza pra função (não use) |
| dentro → fora | ✅ enxerga |
| fora → dentro | ❌ `is not defined` |
| usar antes do `let` | ❌ `before initialization` |
| função que retorna função | closure: lembra das variáveis |

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

- [MDN · Escopo](https://developer.mozilla.org/pt-BR/docs/Glossary/Scope)
- [javascript.info · Variable scope, closure](https://javascript.info/closure)

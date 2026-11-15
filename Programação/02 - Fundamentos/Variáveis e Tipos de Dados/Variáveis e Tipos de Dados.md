---
nivel: escrito
revisado:
---

# Variáveis e Tipos de Dados

> *"Dê nome às coisas e você começa a controlá-las."*

> [!tip] ⚡ Em 30 segundos
> Uma **variável** é um nome que aponta pra um valor guardado na memória. O **tipo** diz que espécie de valor é (número, texto, verdadeiro/falso) e, portanto, o que dá pra fazer com ele. Em TypeScript: `const` pra valor que não muda, `let` pra valor que muda, e **nunca** `var`. Converter tipo (`"10"` → `10`) é uma das fontes de bug mais comuns de JavaScript.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escolher entre `const` e `let` e explicar por que `var` não se usa mais
- Dizer o tipo de um valor com `typeof` e citar os tipos primitivos do JavaScript
- Converter texto em número (e vice-versa) e tratar quando a conversão falha (`NaN`)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Lógica de Programação]]
- **Depois:** [[Operadores e Expressões]] · [[Tipos Básicos do TypeScript]]
- **Trilha:** [[Roadmap]]

> [!note] Como rodar os exemplos
> Instale o [Node.js](https://nodejs.org/) (versão LTS), crie um arquivo `teste.ts` e rode `npx tsx teste.ts` no [[Terminal]]. O setup completo vem em [[Configurando um Projeto TypeScript]].

---

## 🧱 O mínimo pra usar

### 1. `const`, `let` (e por que não `var`)

```ts
const nome = "Ana";   // não pode ser reatribuída
let pontos = 0;       // pode mudar
pontos = pontos + 10; // ok
// nome = "Bia";      // ❌ erro: Cannot assign to 'nome' because it is a constant
```

**Regra:** comece sempre com `const`. Troque pra `let` só quando precisar reatribuir. `var` é do JavaScript antigo e tem regras de [[Escopo]] confusas: não use.

### 2. Os tipos primitivos

| Tipo | Exemplo | Pra quê |
|---|---|---|
| `string` | `"olá"`, `'olá'`, `` `olá ${nome}` `` | texto |
| `number` | `42`, `3.14`, `-1` | qualquer número (inteiro ou decimal) |
| `boolean` | `true`, `false` | sim/não |
| `undefined` | `undefined` | "ainda não tem valor" |
| `null` | `null` | "propositalmente vazio" |
| `bigint` | `10n` | inteiros gigantes (raro) |
| `symbol` | `Symbol("id")` | identificadores únicos (raro) |

Tudo que não é primitivo é **objeto** (arrays, funções, datas...). Veja [[Objetos e Arrays no JavaScript]].

### 3. Descobrindo o tipo

```ts
typeof "oi";      // "string"
typeof 42;        // "number"
typeof true;      // "boolean"
typeof undefined; // "undefined"
typeof null;      // "object"  ← bug histórico do JS, decore
typeof [1, 2];    // "object"  ← use Array.isArray() pra arrays
```

### 4. Template strings

```ts
const nivel = 3;
console.log(`Você está no nível ${nivel}!`); // crase + ${}
```

### 5. Conversão de tipos

```ts
Number("10");       // 10
Number("10abc");    // NaN  (Not a Number)
Number("");         // 0    ← cuidado!
parseInt("10px");   // 10   (lê até onde der)
parseFloat("3.5");  // 3.5
String(42);         // "42"
(42).toFixed(2);    // "42.00"
Boolean("");        // false
Boolean("0");       // true ← texto não vazio é sempre true
```

Sempre cheque se a conversão deu certo:

```ts
const idade = Number(entrada);
if (Number.isNaN(idade)) {
  console.log("Isso não é um número");
}
```

---

## 🛠️ Exemplo guiado

Calcular o XP total a partir de valores que chegaram como texto (como chegam do teclado ou de um formulário):

```ts
const entradas = ["120", "80", "abc", "50"];
let total = 0;

for (const e of entradas) {
  const xp = Number(e);
  if (Number.isNaN(xp)) {
    console.log(`Ignorando valor inválido: "${e}"`);
    continue;
  }
  total += xp;
}

console.log(`XP total: ${total}`); // XP total: 250
```

Sem o `Number(...)`, `"120" + "80"` daria `"12080"`: o `+` com texto **concatena**.

---

## 🔧 Pegadinhas

- **`"5" + 3` é `"53"`, mas `"5" - 3` é `2`.** O `+` junta texto; os outros operadores convertem pra número. Converta explicitamente com `Number()`.
- **`Number("")` é `0`, não `NaN`.** Campo vazio vira zero sem avisar. Cheque string vazia antes.
- **`0.1 + 0.2 !== 0.3`.** Números decimais no computador são aproximados ([[Ponto Flutuante]]). Pra dinheiro, trabalhe em centavos (inteiros).
- **`NaN === NaN` é `false`.** Use `Number.isNaN(x)`.
- **`const` com objeto ainda deixa mudar o conteúdo.** `const lista = []; lista.push(1)` funciona: o que é constante é a *variável*, não o valor dentro.

---

## 🔨 Desafio prático

**Objetivo:** um conversor de temperatura que não quebra com entrada ruim.

1. Crie `temperatura.ts` com uma variável `const entrada = "36.5"` (finja que veio do usuário).
2. Converta pra número e calcule Fahrenheit: `F = C × 9/5 + 32`.
3. Mostre com template string e 1 casa decimal: `36.5°C = 97.7°F`.
4. Teste com `"abc"`, `""` e `"-40"` e trate cada caso.

**Pronto quando:** `"abc"` e `""` mostram uma mensagem de erro clara, e `"-40"` mostra `-40.0°C = -40.0°F`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quando usar `const` e quando usar `let`?
> `const` por padrão; `let` só quando a variável precisa ser reatribuída. `var` não se usa.

> [!question]- Quais são os tipos primitivos mais usados do JavaScript?
> `string`, `number`, `boolean`, `undefined` e `null` (e os raros `bigint` e `symbol`).

> [!question]- Quanto é `"5" + 3` e `"5" - 3`?
> `"53"` (o `+` concatena texto) e `2` (o `-` converte pra número).

> [!question]- O que é `NaN` e como checar?
> "Not a Number", resultado de uma conversão numérica que falhou. Checa com `Number.isNaN(x)`, porque `NaN === NaN` é `false`.

> [!question]- O que `typeof null` retorna?
> `"object"`, um bug antigo do JavaScript mantido por compatibilidade.

> [!question]- `const lista = []` e depois `lista.push(1)`: dá erro?
> Não. `const` impede reatribuir a variável (`lista = ...`), não mudar o conteúdo do array.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `const x = 1` | variável que não pode ser reatribuída |
| `let x = 1` | variável que pode mudar |
| `typeof x` | tipo do valor, em texto |
| `` `Olá ${nome}` `` | template string |
| `Number("10")` | texto → número (`NaN` se falhar) |
| `String(10)` / `n.toFixed(2)` | número → texto |
| `Number.isNaN(x)` | checa conversão falha |

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

- [MDN · Tipos e estruturas de dados](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures)
- [javascript.info · Variáveis](https://javascript.info/variables) e [Tipos de dados](https://javascript.info/types)

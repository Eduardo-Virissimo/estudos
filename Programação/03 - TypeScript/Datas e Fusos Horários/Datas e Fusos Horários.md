---
nivel: escrito
revisado:
---

# Datas e Fusos Horários

> *"Todo programador acha que entende datas. Até o horário de verão acabar."*

> [!tip] ⚡ Em 30 segundos
> Um instante no tempo é um só no mundo inteiro; o que muda é como cada fuso **mostra** esse instante. Por isso a regra de ouro: **guarde e calcule em UTC** (formato ISO 8601, `2026-11-15T14:30:00Z`) e **converta pro fuso do usuário só na hora de mostrar**, com `Intl.DateTimeFormat`. O `Date` do JavaScript tem armadilhas famosas: mês começa em 0 e `toISOString()` muda o dia depois das 21h no Brasil.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Criar, comparar e somar datas com `Date` sem cair nas armadilhas clássicas
- Explicar UTC, fuso horário e o formato ISO 8601
- Formatar datas em português com `Intl.DateTimeFormat` e `Intl.RelativeTimeFormat`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Objetos e Arrays no JavaScript]] · [[Variáveis e Tipos de Dados]]
- **Depois:** [[JSON]] · [[PostgreSQL]] (colunas `timestamptz`) · [[Ler e Escrever Arquivos]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O que é um `Date` por dentro

Um `Date` guarda **um número**: milissegundos desde 1º de janeiro de 1970, 00:00 **UTC** (o *timestamp*). O fuso só entra quando você mostra.

```ts
const agora = new Date();
agora.getTime();     // 1794763800000 (o número)
Date.now();          // o mesmo número, sem criar objeto
agora.toISOString(); // "2026-11-15T17:30:00.000Z"  ← UTC (o Z = "Zulu" = UTC)
```

### 2. ISO 8601: o formato pra guardar e trocar

```text
2026-11-15                       só a data
2026-11-15T14:30:00Z             instante em UTC
2026-11-15T14:30:00-03:00        o mesmo instante dito no horário de Brasília (= 17:30Z)
```

Ordena como texto, é entendido por qualquer linguagem e banco. **É o que vai pro JSON e pro banco.**

### 3. Criando datas (cuidado!)

```ts
new Date("2026-11-15T14:30:00Z");   // ✅ instante exato em UTC
new Date("2026-11-15T14:30:00-03:00"); // ✅ com fuso explícito
new Date(2026, 10, 15);              // 15 de NOVEMBRO 😱 mês começa em 0 (0 = jan)
new Date("2026-11-15");              // meia-noite UTC = 21h do dia 14 no Brasil 😱
```

Texto sem fuso é ambíguo. Sempre inclua `Z` ou o deslocamento.

### 4. Comparar e calcular

```ts
const inicio = new Date("2026-11-15T10:00:00Z");
const fim = new Date("2026-11-15T12:30:00Z");

fim > inicio;                                   // true (compara os números)
const minutos = (fim.getTime() - inicio.getTime()) / 60_000; // 150

const UM_DIA_MS = 24 * 60 * 60 * 1000;
const amanha = new Date(inicio.getTime() + UM_DIA_MS);

inicio.getTime() === new Date(inicio).getTime(); // ✅ igualdade: compare os números
inicio === new Date(inicio);                     // ❌ false: objetos diferentes
```

### 5. Mostrando pro usuário: `Intl`

```ts
const data = new Date("2026-11-15T17:30:00Z");

new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
}).format(data);
// "15 de novembro de 2026 às 14:30"

data.toLocaleDateString("pt-BR"); // "15/11/2026" (atalho, usa o fuso do sistema)

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
rtf.format(-1, "day");   // "ontem"
rtf.format(3, "hour");   // "em 3 horas"
```

Nunca monte data na mão com `getDate() + "/" + getMonth()`: além de feio, erra o mês.

### 6. "Hoje" local (o bug do `toISOString`)

```ts
// Às 22h do dia 15 no Brasil, em UTC já é dia 16:
new Date().toISOString().slice(0, 10); // "2026-11-16" 😱

// Data local em AAAA-MM-DD:
function hojeLocal(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// ou: new Intl.DateTimeFormat("sv-SE").format(d) → "2026-11-15" (sueco usa o formato ISO)
```

É o tipo de bug que faz um diário de estudos gravar a sessão no dia errado.

### 7. Bibliotecas

Pra cálculos sérios (somar meses, fusos, recorrência), use **date-fns** ou **Luxon**. O futuro nativo é a API **`Temporal`**, que resolve os problemas do `Date`; confira se o seu Node já tem antes de usar.

---

## 🛠️ Exemplo guiado

"Faltam quantos dias pra revisão?", com fuso certo:

```ts
const UM_DIA_MS = 86_400_000;

function diasAte(dataISO: string, agora = new Date()): number {
  const alvo = new Date(dataISO);
  return Math.ceil((alvo.getTime() - agora.getTime()) / UM_DIA_MS);
}

function descrever(dataISO: string): string {
  const dias = diasAte(dataISO);
  return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(dias, "day");
}

console.log(descrever("2026-11-18T12:00:00-03:00")); // "em 3 dias" (se hoje for 15)
```

A data entra em ISO com fuso, o cálculo é em milissegundos e só a saída é "humana".

---

## 🔧 Pegadinhas

- **Mês começa em 0.** `new Date(2026, 0, 1)` é janeiro. `getMonth()` de novembro é `10`.
- **`new Date("2026-11-15")` é UTC**, mas `new Date("2026-11-15T10:00")` (sem `Z`) é horário **local**. Inconsistente: sempre ponha o fuso.
- **`toISOString()` pra "data de hoje".** Muda o dia à noite no Brasil.
- **Somar 24h ≠ somar 1 dia** em lugares com horário de verão. Pra "mesmo horário amanhã", use biblioteca.
- **Comparar `Date` com `===`.** Compara objetos. Use `.getTime()`.
- **Guardar data formatada (`"15/11/2026"`).** Não ordena, não calcula e é ambígua: `05/11/2026` é 5 de novembro aqui e 11 de maio nos EUA. Guarde ISO.

---

## 🔨 Desafio prático

**Objetivo:** uma calculadora de prazos no terminal.

1. Receba uma data ISO por argumento (`npx tsx prazo.ts 2026-12-25T00:00:00-03:00`).
2. Mostre: a data formatada por extenso em português, quantos dias faltam e o "relativo" (`em 40 dias` / `há 2 dias`).
3. Valide: data inválida (`new Date("abc").getTime()` é `NaN`) mostra erro.
4. Mostre também o mesmo instante em Tóquio (`timeZone: "Asia/Tokyo"`).

**Pronto quando:** funciona com data futura, passada e inválida, e o horário em Tóquio sai 12 horas à frente de Brasília.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a regra de ouro pra guardar datas?
> Guardar e calcular em UTC (formato ISO 8601) e converter pro fuso do usuário só na hora de mostrar.

> [!question]- O que um `Date` guarda por dentro?
> Um número: os milissegundos desde 1/1/1970 00:00 UTC. O fuso só é aplicado na exibição.

> [!question]- Por que `new Date().toISOString().slice(0, 10)` pode dar o dia errado?
> Porque converte pra UTC: depois das 21h no Brasil (UTC-3), em UTC já é o dia seguinte.

> [!question]- Que mês é `new Date(2026, 10, 15)`?
> Novembro. Os meses do `Date` começam em 0.

> [!question]- Como comparar se duas datas são o mesmo instante?
> Comparando os números: `a.getTime() === b.getTime()`. `===` direto compara os objetos.

> [!question]- Como mostrar uma data em português com fuso de São Paulo?
> `new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(data)`.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `Date.now()` | timestamp atual (ms) |
| `new Date(isoComFuso)` | criar a partir de ISO |
| `d.toISOString()` | ISO em UTC (pra guardar) |
| `d.getTime()` | número pra comparar/calcular |
| `(b - a) / 60_000` | diferença em minutos |
| `new Intl.DateTimeFormat("pt-BR", {...}).format(d)` | mostrar |
| `new Intl.RelativeTimeFormat("pt-BR").format(-1, "day")` | "há 1 dia" |
| `Number.isNaN(d.getTime())` | data inválida? |

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

- [javascript.info · Date and time](https://javascript.info/date)
- [MDN · Intl.DateTimeFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [date-fns](https://date-fns.org/): biblioteca de funções de data, com locale `pt-BR`

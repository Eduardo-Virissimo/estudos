---
nivel: escrito
foco: essencial
revisado:
---

# Variáveis e Tipos de Dados

**Quanto focar: 🔥 essencial.** Você usa em toda linha de código. Domine, principalmente a conversão de tipos, que é fonte de muito bug.

**Quanto tempo:** cerca de 1h: 15 min de leitura, 10 min no Me teste e 30 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você pede ao usuário duas notas, `8` e `7`, e soma pra calcular a média. O programa responde que a soma é `87`. Não é um erro de matemática do computador. É que o que chegou do teclado não eram os números 8 e 7, eram os **textos** `"8"` e `"7"`, e somar textos é colar um no outro.

Esse bug resume a nota inteira. Uma **variável** é um nome que aponta pra um valor guardado na memória, como uma etiqueta colada numa caixa. E o **tipo** diz que espécie de valor está dentro da caixa (um número, um texto, um verdadeiro ou falso), e por isso diz o que dá pra fazer com ele: números se somam, textos se juntam. Quando o tipo não é o que você pensa, o programa faz uma coisa diferente da que você queria, e muitas vezes sem dar erro nenhum.

Duas regras práticas pra levar daqui desde já: em TypeScript, **`const` pra valor que não muda, `let` pra valor que muda, e nunca `var`**. E **`"10"` (texto) não é `10` (número)**: a conversão de tipos é a fonte de bug número um de quem começa em JavaScript. Ajuda ter passado pela [[Lógica de Programação]].

> [!note] Como rodar os exemplos
> Esta é a primeira nota com código pra rodar. Instale o [Node.js](https://nodejs.org/) (versão LTS), crie um arquivo `teste.ts` e rode `npx tsx teste.ts` no [[Terminal]]. O setup completo de um projeto vem em [[Configurando um Projeto TypeScript]].

## A etiqueta e a caixa

Pense numa variável como uma etiqueta colada numa caixa. A etiqueta é o nome; dentro da caixa está o valor. E existem dois tipos de etiqueta:

```ts
const nome = "Ana";   // etiqueta presa: não pode trocar de caixa
let pontos = 0;       // etiqueta que pode ser trocada
pontos = pontos + 10; // ok: agora pontos vale 10
// nome = "Bia";      // ❌ Cannot assign to 'nome' because it is a constant
```

A regra é: **comece sempre com `const`**, e troque pra `let` só quando você realmente precisar mudar o valor depois, como num contador ou num total que vai somando. Por que essa preferência? Porque quando você lê `const`, sabe na hora que aquele valor nunca muda, e é uma coisa a menos pra acompanhar de cabeça enquanto lê o código. E na prática, a maioria das variáveis de um programa nunca muda.

E o `var`? É o jeito antigo do JavaScript, com regras de [[Escopo]] confusas que causam bugs difíceis de achar. Em código novo, não se usa.

Agora, um detalhe da metáfora que confunde muita gente:

```ts
const lista = [];
lista.push(1);   // funciona!
```

Como assim, se é `const`? É que o `const` prende **a etiqueta na caixa**, mas não tranca a caixa. Dá pra mexer no que está dentro dela. O que você não pode é trocar a caixa: `lista = [outra coisa]` dá erro.

## Que tipo de coisa está na caixa

Todo valor tem um tipo. Os que você vai usar o tempo todo são três:

| Tipo | Exemplo | Pra quê |
|---|---|---|
| `string` | `"olá"`, `'olá'`, `` `olá ${nome}` `` | texto |
| `number` | `42`, `3.14`, `-1` | qualquer número, inteiro ou decimal |
| `boolean` | `true`, `false` | sim ou não |

E dois que representam "nada", que você vai ver o tempo todo:

| Tipo | Quer dizer |
|---|---|
| `undefined` | "ainda não tem valor" (variável criada e nunca preenchida) |
| `null` | "vazio de propósito" (alguém decidiu que não tem valor) |

A diferença entre esses dois "nadas" tem uma nota só pra ela, [[null e undefined]]. E tudo o que não é um desses tipos simples (os **primitivos**) é um **objeto**: listas, funções, datas. Isso fica pra [[Objetos e Arrays no JavaScript]].

Pra juntar texto com valores, a forma mais confortável é a **template string**, escrita com crase e `${}`:

```ts
const nivel = 3;
console.log(`Você está no nível ${nivel}!`);
```

## O "8" que vira "87"

Agora o bug do começo, com calma. Olhe estas duas linhas:

```ts
"5" + 3   // "53"  ← juntou como texto!
"5" - 3   // 2     ← converteu pra número
```

O que está acontecendo? O `+` serve pra duas coisas no JavaScript: somar números **e juntar textos**. Se um dos lados é texto, ele junta. Já os outros operadores (`-`, `*`, `/`) só fazem sentido com números, então o JavaScript converte o texto sozinho. O resultado é um comportamento inconsistente, que confunde todo mundo.

A solução é não depender disso: **converta você mesmo, explicitamente.**

```ts
Number("10");       // 10
Number("10abc");    // NaN  (Not a Number: não deu pra converter)
parseInt("10px");   // 10   (lê o número até onde der)
parseFloat("3.5");  // 3.5
String(42);         // "42"
(42).toFixed(2);    // "42.00"
```

Quando isso importa? **Sempre que o valor vem de fora**: do teclado, de um formulário, de um arquivo. Tudo isso chega como texto, sem exceção. Olhe um exemplo somando XP a partir de valores que chegaram como texto, inclusive um inválido:

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

Sem o `Number(...)`, `"120" + "80"` daria `"12080"`, o mesmo bug das notas.

Dois detalhes dessa conversão que pegam muita gente. O primeiro: **`Number("")` dá zero**, e não `NaN`. Então um campo deixado em branco vira `0` e passa na validação sem ninguém perceber. Cheque o texto vazio antes de converter. O segundo: o `NaN` é o único valor do JavaScript que **não é igual a si mesmo**. `NaN === NaN` dá `false`. Por isso, pra saber se uma conversão falhou, use `Number.isNaN(x)`.

## Descobrindo o tipo

Quando estiver em dúvida sobre o que está na caixa, o `typeof` responde:

```ts
typeof "oi";      // "string"
typeof 42;        // "number"
typeof true;      // "boolean"
typeof undefined; // "undefined"
typeof null;      // "object"  ← um erro antigo do JavaScript
typeof [1, 2];    // "object"  ← pra listas, use Array.isArray()
```

Repare no `typeof null` dando `"object"`. Não faz sentido nenhum, e não é você que entendeu errado: é um erro da primeira versão do JavaScript, de 1995, que nunca foi corrigido porque consertar quebraria sites antigos. É só decorar.

E o `Boolean(valor)` mostra como um valor se comporta num `if`. `Boolean("")` dá `false`, mas `Boolean("0")` dá `true`, porque qualquer texto não vazio é verdadeiro. Os detalhes disso estão em [[Operadores e Expressões]], na parte de truthy e falsy.

Duas curiosidades pra fechar. A primeira: `0.1 + 0.2` dá `0.30000000000000004`. O computador guarda números decimais de um jeito que nem sempre é exato ([[Ponto Flutuante]] explica por quê). Pra dinheiro, trabalhe em **centavos**, com números inteiros. A segunda: existem mais dois tipos primitivos que você quase não vai usar, o `bigint` (`10n`, pra inteiros gigantescos) e o `symbol` (identificadores únicos, usados por bibliotecas).

## O essencial

1. `const` por padrão, `let` quando precisar mudar, `var` nunca. O `const` não impede mexer dentro de uma lista.
2. Os tipos do dia a dia: `string`, `number`, `boolean`, e os "nadas" `undefined` e `null`.
3. Tudo o que vem de fora é texto. `"5" + 3` dá `"53"`: converta com `Number()`.
4. Conversão que falha dá `NaN`; cheque com `Number.isNaN`. E `Number("")` dá `0`.

## Agora é com você

Faça um **conversor de temperatura que não quebra com entrada ruim**. Crie um `temperatura.ts` com uma variável `const entrada = "36.5"` (finja que veio do usuário). Converta pra número, calcule Fahrenheit (`F = C × 9/5 + 32`) e mostre com template string e uma casa decimal: `36.5°C = 97.7°F`. Depois teste com `"abc"`, `""` e `"-40"`, e trate cada caso. Você terminou quando `"abc"` e `""` mostrarem uma mensagem de erro clara, e `"-40"` mostrar `-40.0°C = -40.0°F` (sim, -40 é igual nas duas escalas).

Daqui, siga pros [[Operadores e Expressões]] e pros [[Tipos Básicos do TypeScript]].

---

## 🧠 Me teste

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

> [!question]- Por que `Number("")` é perigoso numa validação?
> Porque dá `0`, não `NaN`: um campo em branco passa como se fosse um número válido.

> [!question]+ Quanto valem `"5" + 3` e `"5" - 3`?
> - a) `8` e `2`
> - b) `"53"` e `2`
> - c) `"53"` e `"5-3"`
> - d) `8` e `"2"`
>
> > [!check]- Resposta
> > **b)** Com string, `+` **concatena**. `-` só existe pra números, então o JS converte `"5"` em 5.

> [!question]+ `const lista = []; lista.push(1);` O que acontece?
> - a) Erro: não pode alterar `const`
> - b) Funciona: `const` impede trocar a variável, não mexer no conteúdo
> - c) Funciona só se trocar por `let`
> - d) Cria uma lista nova
>
> > [!check]- Resposta
> > **b)** `const` trava a **referência** (não dá pra fazer `lista = [...]`), mas o array em si continua mutável.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `const x = 1` | Variável que não pode ser reatribuída |
| `let x = 1` | Variável que pode mudar |
| `typeof x` | O tipo do valor, em texto |
| `` `Olá ${nome}` `` | Template string |
| `Number("10")` | Texto → número (`NaN` se falhar) |
| `String(10)` / `n.toFixed(2)` | Número → texto |
| `Number.isNaN(x)` | Checa uma conversão que falhou |

**Pra ler:** os capítulos do javascript.info sobre [variáveis](https://javascript.info/variables) e [tipos de dados](https://javascript.info/types) são curtos, claros e têm exercícios. O [MDN sobre tipos e estruturas de dados](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures) é a referência completa, em português.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

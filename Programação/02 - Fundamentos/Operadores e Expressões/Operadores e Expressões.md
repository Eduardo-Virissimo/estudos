---
nivel: escrito
revisado:
---

# Operadores e Expressões

> *"Use `===`. Sempre. A exceção você vai descobrir sozinho, e vai ser rara."*

> [!tip] ⚡ Em 30 segundos
> **Operadores** são os símbolos que fazem conta e comparação (`+`, `>`, `===`, `&&`). Uma **expressão** é qualquer pedaço de código que **resulta em um valor**: `2 + 3`, `idade >= 18`, `nome || "anônimo"`. Saber o que cada operador devolve (principalmente `&&`, `||` e `??`) é o que faz `if` e cálculos saírem certos.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Usar operadores aritméticos, incluindo `%` (resto) e `**` (potência)
- Explicar a diferença entre `==` e `===` e usar sempre o `===`
- Prever o resultado de `&&`, `||` e `??` com valores que não são booleanos

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Variáveis e Tipos de Dados]]
- **Depois:** [[Estruturas Condicionais]] · [[Lógica Booleana]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Aritméticos

| Operador | Exemplo | Resultado |
|---|---|---|
| `+ - * /` | `7 / 2` | `3.5` (não arredonda) |
| `%` resto | `7 % 2` | `1` → par/ímpar, "a cada N" |
| `**` potência | `2 ** 10` | `1024` |
| `++` / `--` | `i++` | soma/subtrai 1 |

Divisão inteira: `Math.floor(7 / 2)` → `3`. Arredondar: `Math.round(2.5)` → `3`.

### 2. Atribuição composta

```ts
let xp = 100;
xp += 50;  // xp = xp + 50 → 150
xp *= 2;   // 300
xp -= 10;  // 290
```

### 3. Comparação: sempre `===`

```ts
5 === 5      // true
5 === "5"    // false (tipos diferentes)
5 == "5"     // true  ← converte antes de comparar: fonte de bug
0 == ""      // true  ← 😱
null == undefined // true
5 !== 3      // true (diferente)
```

`===` e `!==` comparam **valor e tipo**. Esqueça que `==` existe.

### 4. Lógicos e "truthy/falsy"

```ts
true && false  // false (E: os dois precisam ser verdadeiros)
true || false  // true  (OU: basta um)
!true          // false (NÃO)
```

Em JavaScript, qualquer valor vira verdadeiro ou falso num `if`. Os **falsy** são só estes: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Todo o resto é **truthy** (inclusive `"0"`, `[]` e `{}`).

### 5. `&&` e `||` devolvem um dos valores, não `true`/`false`

```ts
"Ana" || "anônimo"   // "Ana"     (primeiro truthy)
"" || "anônimo"      // "anônimo"
0 || 10              // 10        ← cuidado se 0 era válido!
usuario && usuario.nome  // só acessa .nome se usuario existir
```

### 6. `??` (nullish coalescing): o padrão certo

`??` só troca quando o valor é `null` ou `undefined`, não quando é `0` ou `""`:

```ts
const volume = 0;
volume || 50   // 50  ❌ perdeu o 0 que o usuário escolheu
volume ?? 50   // 0   ✅
```

Use `??` pra valor padrão. Mais em [[null e undefined]].

### 7. Ternário

```ts
const status = media >= 7 ? "aprovado" : "reprovado";
```

Bom pra escolher entre **dois valores**. Pra lógica maior, use `if`.

### 8. Precedência

`*` e `/` antes de `+` e `-`; `&&` antes de `||`. Na dúvida, **use parênteses**: ninguém decora a tabela inteira.

```ts
2 + 3 * 4       // 14
(2 + 3) * 4     // 20
```

---

## 🛠️ Exemplo guiado

Regras de um jogo, tudo com expressões:

```ts
const nivel = 7;
const xp = 0;
const apelido = "";

const ehPar = nivel % 2 === 0;                  // false
const ganhaBonus = nivel >= 5 && xp < 100;      // true
const nomeExibido = apelido || "Herói sem nome"; // "Herói sem nome"
const xpExibido = xp ?? "sem dados";             // 0 (?? mantém o zero)
const titulo = nivel >= 10 ? "Veterano" : "Aprendiz";

console.log({ ehPar, ganhaBonus, nomeExibido, xpExibido, titulo });
```

---

## 🔧 Pegadinhas

- **`==` em vez de `===`.** `0 == ""` e `"1" == 1` são `true`. Configure o [[Linter]] com a regra `eqeqeq` pra ele te avisar.
- **`||` pra valor padrão apagando o zero.** `quantidade || 1` transforma 0 em 1. Use `??`.
- **`if (lista)` com array vazio.** `[]` é truthy. Pra checar se tem itens: `if (lista.length > 0)`.
- **`=` dentro do `if`.** `if (x = 5)` atribui, não compara. Sempre `===`.
- **Precedência de `!`.** `!a === b` é `(!a) === b`. Use `a !== b`.

---

## 🔨 Desafio prático

**Objetivo:** prever antes de rodar.

1. Escreva num papel o resultado que você **acha** de cada linha:
   ```ts
   10 % 3; 2 ** 3; "3" + 4 + 5; 3 + 4 + "5"; 0 || "x"; 0 ?? "x";
   "" && "y"; null ?? undefined ?? "z"; [] ? "sim" : "não"; 1 < 2 < 3; 3 > 2 > 1;
   ```
2. Rode tudo num `console.log` e compare.
3. Pra cada erro seu, escreva em 1 linha por que deu aquele resultado.

**Pronto quando:** você acerta pelo menos 9 de 11 e consegue explicar os dois últimos (dica: `true` vira `1`).

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `==` e `===`?
> `===` compara valor e tipo; `==` converte os tipos antes e gera resultados como `0 == ""` ser `true`. Use sempre `===`.

> [!question]- Quais valores são falsy em JavaScript?
> `false`, `0`, `""`, `null`, `undefined` e `NaN`. Todo o resto é truthy, inclusive `[]` e `"0"`.

> [!question]- Qual a diferença entre `||` e `??` pra valor padrão?
> `||` troca qualquer falsy (inclusive `0` e `""`); `??` troca só `null` e `undefined`.

> [!question]- Pra que serve o operador `%`?
> Dá o resto da divisão. Usado pra par/ímpar (`n % 2 === 0`) e "a cada N vezes".

> [!question]- O que `"Ana" && "Bia"` devolve?
> `"Bia"`. O `&&` devolve o primeiro falsy ou, se todos forem truthy, o último valor.

> [!question]- Quando usar o ternário?
> Pra escolher entre dois valores numa expressão curta (`x ? a : b`). Lógica com vários passos fica melhor em `if`.

---

## 📋 Cola rápida

| Operador | O que faz |
|---|---|
| `%` | resto da divisão |
| `**` | potência |
| `+=` `-=` `*=` | atribuição composta |
| `===` `!==` | igual / diferente (valor e tipo) |
| `&&` `\|\|` `!` | E / OU / NÃO |
| `??` | padrão só pra `null`/`undefined` |
| `?.` | acessa só se existir ([[null e undefined]]) |
| `c ? a : b` | ternário |

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

- [MDN · Expressões e operadores](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Expressions_and_operators)
- [javascript.info · Operadores lógicos](https://javascript.info/logical-operators) e [Nullish coalescing](https://javascript.info/nullish-coalescing-operator)

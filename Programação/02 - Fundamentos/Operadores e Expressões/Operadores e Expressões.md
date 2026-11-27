---
nivel: escrito
foco: essencial
revisado:
---

# Operadores e Expressões

**Quanto focar: 🔥 essencial.** Estão em todo `if` e em todo cálculo. Domine, com atenção ao `===` e à precedência, que são pegadinhas clássicas.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 10 min no Me teste e 20 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

O seu app tem uma configuração de volume, de 0 a 100, e um valor padrão de 50 pra quem nunca mexeu nela. Você escreve `const volume = configuracao.volume || 50`, testa, funciona. Até que alguém reclama: "eu coloquei o volume no zero e ele volta sozinho pra 50!". Você olha o código, ele parece certo, e não tem erro nenhum no console.

O culpado é um operador. Os **operadores** são os símbolos que fazem conta e comparação: `+`, `>`, `===`, `&&`, `||`. E uma **expressão** é qualquer pedaço de código que **resulta num valor**: `2 + 3`, `idade >= 18`, `nome || "anônimo"`. A maior parte deles é intuitiva, igualzinha à matemática da escola. Mas o JavaScript tem algumas armadilhas famosas (o `==`, os valores "falsy" e esse `||` que apaga o zero) que causam bugs silenciosos, do tipo que não dá erro, só dá o resultado errado.

O que esta nota quer te ensinar é a pensar no que cada operador **devolve**. É isso que faz os seus `if` e os seus cálculos saírem certos. Ela parte do que você viu em [[Variáveis e Tipos de Dados]].

## Três iguais, sempre

O JavaScript tem dois jeitos de comparar se duas coisas são iguais, e um deles é uma armadilha:

```ts
5 === 5            // true
5 === "5"          // false: tipos diferentes (número × texto)
5 == "5"           // true  ← converte antes de comparar
0 == ""            // true  ← 😱
null == undefined  // true
5 !== 3            // true (diferente)
```

O `==`, com dois iguais, tenta "ajudar": converte os dois lados pro mesmo tipo e só depois compara. O resultado são comparações que ninguém espera, como `0 == ""` dar verdadeiro. Já o `===`, com três, compara **valor e tipo**, sem converter nada: o que você vê é o que acontece.

A regra é das mais simples que existem: **sempre `===` e `!==`.** Faça de conta que o `==` não existe. E fique de olho no erro irmão desse: `if (x = 5)`, com um igual só, não compara nada, **guarda** 5 em `x`, e o `if` entra sempre. A regra `eqeqeq` do [[Linter]] avisa as duas coisas.

## Verdadeiro sem ser true

Num `if`, qualquer valor vira verdadeiro ou falso, mesmo que não seja um booleano. Isso é prático (`if (nome)` checa se o nome foi preenchido), mas exige saber exatamente quais valores viram falso. São só estes seis, chamados de **falsy**:

`false` · `0` · `""` (texto vazio) · `null` · `undefined` · `NaN`

**Todo o resto é verdadeiro** (*truthy*), e aqui mora a surpresa: inclusive coisas que parecem "vazias", como `"0"`, `" "` (um espaço), `[]` (uma lista vazia) e `{}` (um objeto vazio).

```ts
if ("0") console.log("entra!");   // entra: "0" é um texto não vazio
if ([]) console.log("entra!");    // entra: lista vazia é truthy
```

O bug clássico que sai disso: `if (tarefas)` pra checar se a lista tem itens. Ele entra **mesmo com a lista vazia**, porque `[]` é truthy. Pra saber se tem itens, pergunte o que você quer saber de verdade: `if (tarefas.length > 0)`.

## O mistério do volume zero

Agora dá pra resolver o bug do começo. Você conhece os operadores lógicos das condições: `&&` (E), `||` (OU) e `!` (NÃO).

```ts
true && false  // false: os dois precisam ser verdadeiros
true || false  // true: basta um
!true          // false
```

Mas tem um detalhe que quase ninguém conta: o `&&` e o `||` **não devolvem `true` ou `false`**. Eles devolvem **um dos dois valores**. O `||` devolve o primeiro valor truthy que encontrar:

```ts
"Ana" || "anônimo"   // "Ana"
"" || "anônimo"      // "anônimo"
```

Por isso tanta gente usa o `||` pra dar valor padrão. E funciona, até o dia em que `0` ou `""` são valores **válidos**:

```ts
const volume = 0;      // o usuário escolheu volume zero
volume || 50           // 50  ❌ o || achou que 0 era "vazio"
volume ?? 50           // 0   ✅
```

Mistério resolvido. Como `0` é falsy, o `||` achou que não tinha volume nenhum e trocou por 50. A solução é o `??` (*nullish coalescing*), que só troca o valor quando ele é `null` ou `undefined`, ou seja, quando ele realmente **não existe**. Zero e texto vazio passam intactos. **Pra valor padrão, use `??`.** A nota [[null e undefined]] aprofunda.

O `&&` também tem um uso comum por causa disso: seguir só se a primeira coisa existir.

```ts
usuario && usuario.nome  // só lê .nome se usuario existir
```

## O resto da divisão

Os operadores de conta são os de sempre, `+ - * /`, mais dois que você vai usar mais do que imagina:

| Operador | Exemplo | Resultado |
|---|---|---|
| `/` divisão | `7 / 2` | `3.5` (não arredonda) |
| `%` resto | `7 % 2` | `1` |
| `**` potência | `2 ** 10` | `1024` |

O `%`, o resto da divisão, parece coisa de prova de matemática, mas resolve vários problemas do dia a dia. Pra saber se um número é **par**: `n % 2 === 0`. Pra fazer algo **"a cada N"** num laço: `i % 3 === 0` é verdadeiro a cada 3 voltas. E pra **dar a volta** num ciclo, como as horas do relógio: `(hora + 5) % 24` faz 22h mais 5 horas virar 3h.

Repare que a divisão não arredonda. Pra divisão inteira, use `Math.floor(7 / 2)`, que dá `3`; pra arredondar, `Math.round(2.5)`, que dá `3`.

## Atalhos e escolhas rápidas

Existe um atalho pra "pegar o valor atual, fazer uma conta e guardar de volta", que você vai ver o tempo todo:

```ts
let xp = 100;
xp += 50;  // o mesmo que xp = xp + 50 → 150
xp *= 2;   // 300
xp -= 10;  // 290
xp++;      // soma 1 → 291
```

E o **ternário**, pra escolher entre dois valores numa linha só:

```ts
const status = media >= 7 ? "aprovado" : "reprovado";
// condição ? valor se verdadeiro : valor se falso
```

Ele é ótimo pra coisas curtas. Se você se pegar colocando um ternário dentro de outro, pare e troque por um `if`: ninguém consegue ler aquilo.

Por fim, a ordem das operações. Como na matemática, alguns operadores são feitos antes dos outros: `*` e `/` antes de `+` e `-`; `&&` antes de `||`.

```ts
2 + 3 * 4       // 14
(2 + 3) * 4     // 20
```

Ninguém decora a tabela inteira de precedência do JavaScript, nem quem programa há vinte anos. Na dúvida, **use parênteses**: além de garantir o resultado, deixa a intenção clara pra quem lê. Um caso que engana: `!a === b` é lido como `(!a) === b`, e não como "a diferente de b". Pra isso existe o `a !== b`.

## O essencial

1. Sempre `===` e `!==`. O `==` converte os tipos e engana.
2. Falsy são só seis: `false`, `0`, `""`, `null`, `undefined`, `NaN`. `[]` e `"0"` são truthy.
3. `||` e `&&` devolvem um dos valores, não um booleano.
4. Valor padrão com `??`, que não apaga o `0` nem o `""`.
5. `%` é o resto: par, "a cada N" e dar a volta.

## Agora é com você

Um exercício de previsão. Antes de rodar, escreva num papel o resultado que você **acha** de cada uma destas linhas:

```ts
10 % 3; 2 ** 3; "3" + 4 + 5; 3 + 4 + "5"; 0 || "x"; 0 ?? "x";
"" && "y"; null ?? undefined ?? "z"; [] ? "sim" : "não"; 1 < 2 < 3; 3 > 2 > 1;
```

Depois rode cada uma num `console.log` e compare. Pra cada uma que você errou, escreva em uma linha por que deu aquele resultado. Você terminou quando acertar pelo menos 9 das 11 e conseguir explicar as duas últimas (uma dica: `true`, numa conta, vira `1`).

Daqui, siga pras [[Estruturas Condicionais]], onde esses operadores viram decisões, e pra [[Lógica Booleana]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `==` e `===`?
> `===` compara valor e tipo; `==` converte os tipos antes e gera resultados como `0 == ""` ser `true`. Use sempre `===`.

> [!question]- Quais valores são falsy em JavaScript?
> `false`, `0`, `""`, `null`, `undefined` e `NaN`. Todo o resto é truthy, inclusive `[]` e `"0"`.

> [!question]- Por que `if (tarefas)` não serve pra checar se a lista tem itens?
> Porque `[]` é truthy: entra mesmo vazia. Use `tarefas.length > 0`.

> [!question]- Qual a diferença entre `||` e `??` pra valor padrão?
> `||` troca qualquer falsy (inclusive `0` e `""`); `??` troca só `null` e `undefined`.

> [!question]- Pra que serve o operador `%`?
> Dá o resto da divisão. Usado pra par/ímpar (`n % 2 === 0`) e "a cada N vezes".

> [!question]- O que `"Ana" && "Bia"` devolve?
> `"Bia"`. O `&&` devolve o primeiro falsy ou, se todos forem truthy, o último valor.

> [!question]- Quando usar o ternário?
> Pra escolher entre dois valores numa expressão curta (`x ? a : b`). Lógica com vários passos fica melhor em `if`.

> [!question]+ `const qtd = 0;` Quanto vale `qtd || 10` e `qtd ?? 10`?
> - a) `10` e `10`
> - b) `0` e `0`
> - c) `10` e `0`
> - d) `0` e `10`
>
> > [!check]- Resposta
> > **c)** `||` troca qualquer **falsy** (e `0` é falsy). `??` só troca `null` e `undefined`. Pra valor padrão onde `0` é válido, use `??`.

> [!question]+ Qual destes valores é **truthy**?
> - a) `""`
> - b) `0`
> - c) `"0"`
> - d) `NaN`
>
> > [!check]- Resposta
> > **c)** `"0"` é uma string não vazia, então é truthy. Falsy são: `false`, `0`, `""`, `null`, `undefined` e `NaN`.

---

## Pra consultar depois

| Operador | O que faz |
|---|---|
| `%` | Resto da divisão |
| `**` | Potência |
| `+=` `-=` `*=` `++` | Atribuição composta, incremento |
| `===` `!==` | Igual / diferente (valor e tipo) |
| `&&` `\|\|` `!` | E / OU / NÃO |
| `??` | Padrão só pra `null`/`undefined` |
| `?.` | Acessa só se existir ([[null e undefined]]) |
| `c ? a : b` | Ternário |

**Pra ler:** os capítulos do javascript.info sobre [operadores lógicos](https://javascript.info/logical-operators) e sobre o [`??`](https://javascript.info/nullish-coalescing-operator) explicam com calma o "devolve um dos valores", e têm exercícios de previsão no fim. O [guia de expressões e operadores do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Expressions_and_operators) é a referência completa, em português.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

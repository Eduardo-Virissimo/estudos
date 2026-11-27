---
nivel: escrito
foco: bom saber
revisado:
---

# Manipulação de Bits

**Quanto focar: 💤 bom saber.** Aparece pouco em web. Conheça os operadores; o resto pode esperar.

**Quanto tempo:** cerca de 1h15: 15 min de leitura, 5 min no Me teste e 50 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Lembra do `chmod 755` da nota de [[Bash]]? Aquele número não é aleatório. Cada dígito é a soma de três permissões: ler vale 4, escrever vale 2, executar vale 1. O 7 é 4 + 2 + 1 (tudo), o 5 é 4 + 1 (ler e executar). Por que 4, 2 e 1, e não 1, 2 e 3? Porque 4, 2 e 1 são, em binário, `100`, `010` e `001`: cada permissão é **um bit** de um número. Um número só guarda três "sim ou não" ao mesmo tempo, e dá pra somar, conferir e tirar cada um com uma operação.

Isso é **manipulação de bits**: tratar um número como uma fileira de interruptores ligados (1) e desligados (0), e mexer neles diretamente com operadores especiais. No dia a dia do JavaScript, você vai usar isso pouco: em **flags** (permissões, opções combinadas), em algumas otimizações e em código que lida com arquivos binários, cores ou rede. Em entrevista, aparece em alguns truques famosos. A nota é sobre os operadores e os três ou quatro padrões que valem a pena, e não sobre decorar truques.

## Binário em dois minutos

Um número em binário é escrito com potências de 2, da direita pra esquerda: 1, 2, 4, 8, 16...

```text
13 = 8 + 4 + 0 + 1  →  1101
      8   4   2   1
      1   1   0   1
```

No JavaScript você converte e lê assim:

```ts
(13).toString(2);      // "1101"
parseInt("1101", 2);   // 13
0b1101;                // 13: literal binário direto no código
```

## Os seis operadores

Eles trabalham **bit a bit**, comparando a mesma posição dos dois números:

| Operador | Nome | Bit resultado é 1 quando... | Exemplo |
|---|---|---|---|
| `a & b` | E (AND) | os **dois** são 1 | `0b1100 & 0b1010` = `0b1000` |
| `a \| b` | OU (OR) | **algum** é 1 | `0b1100 \| 0b1010` = `0b1110` |
| `a ^ b` | OU exclusivo (XOR) | são **diferentes** | `0b1100 ^ 0b1010` = `0b0110` |
| `~a` | NÃO (NOT) | inverte todos | `~0` = `-1` |
| `a << n` | desloca à esquerda | anda n casas (× 2ⁿ) | `1 << 3` = `8` |
| `a >> n` | desloca à direita | anda n casas (÷ 2ⁿ, arredonda pra baixo) | `13 >> 1` = `6` |

Cuidado pra não confundir com os lógicos: `&` não é `&&`, e `|` não é `||`. O `&&` trabalha com verdadeiro e falso; o `&` trabalha com bits de números. Trocar um pelo outro muitas vezes nem dá erro, só dá resultado errado.

## Flags: vários sim ou não num número só

Este é o uso prático número um. Cada opção ganha uma potência de 2, ou seja, um bit:

```ts
const LER = 1 << 2;      // 4  → 100
const ESCREVER = 1 << 1; // 2  → 010
const EXECUTAR = 1 << 0; // 1  → 001

let perm = LER | EXECUTAR;          // 5: liga os dois bits

const podeLer = (perm & LER) !== 0; // true: confere um bit
perm |= ESCREVER;                    // liga o ESCREVER: agora 7
perm &= ~EXECUTAR;                   // desliga o EXECUTAR: agora 6
perm ^= LER;                         // inverte o LER: agora 2
```

Quatro padrões, e vale ler cada um devagar:

- **Ligar:** `x | BIT` (o OU com 1 liga, com 0 não mexe).
- **Conferir:** `(x & BIT) !== 0` (o E só deixa passar o bit que interessa).
- **Desligar:** `x & ~BIT` (o `~BIT` tem todos os bits ligados menos aquele; o E apaga só ele).
- **Inverter:** `x ^ BIT`.

E os parênteses em `(perm & LER) !== 0` não são opcionais. O `!==` tem prioridade **maior** que o `&`, então `perm & LER !== 0` é lido como `perm & (LER !== 0)`, que é `perm & true`, que dá outra coisa. É uma das pegadinhas mais sutis da linguagem.

Você encontra esse padrão em permissões de arquivo, nas opções do `fs.open`, em sistemas de permissão de usuário (um campo `permissoes` no banco em vez de dez colunas booleanas) e no React por dentro.

## Os truques que aparecem em entrevista

**Par ou ímpar:** o último bit de um número ímpar é sempre 1. `n & 1` dá 1 se ímpar, 0 se par. É o mesmo que `n % 2`, só que mais "esperto".

**O número que aparece uma vez só.** Numa lista em que todo número aparece duas vezes, menos um, ache o solitário. A propriedade mágica do XOR: `x ^ x = 0` e `x ^ 0 = x`, e a ordem não importa. Então fazer o XOR de todos cancela os pares e sobra o solitário, em O(n) e O(1) de memória:

```ts
function solitario(nums: number[]): number {
  return nums.reduce((acc, n) => acc ^ n, 0);
}
solitario([4, 1, 2, 1, 2]); // 4
```

**É potência de 2?** Uma potência de 2 tem um bit ligado só (`1000`), e ela menos um tem todos os de baixo ligados (`0111`). O E dos dois dá zero: `n > 0 && (n & (n - 1)) === 0`.

**Contar os bits ligados:** `n & (n - 1)` apaga o bit ligado mais à direita. Repita até zerar, contando as voltas.

## A pegadinha dos 32 bits

No JavaScript, os números são de 64 bits com casas decimais, mas os operadores de bit **convertem tudo pra inteiro de 32 bits com sinal** antes de operar. Isso tem duas consequências que pegam todo mundo uma vez:

```ts
2 ** 31 | 0;     // -2147483648: passou do limite de 32 bits e virou negativo
(2 ** 32 + 5) | 0; // 5: os bits de cima foram simplesmente cortados
~~3.7;           // 3: corta a parte decimal (um truque antigo, prefira Math.trunc)
-8 >> 1;         // -4: o >> mantém o sinal
-8 >>> 1;        // 2147483644: o >>> trata como número sem sinal
```

Na prática: com números até uns 2 bilhões, tudo funciona. Acima disso, bits somem sem aviso. Se precisar de mais, o `BigInt` (`10n`, `1n << 40n`) tem os mesmos operadores sem esse limite. E o `>>> 0`, que apareceu na função de hash da [[Hash Table]], serve justamente pra forçar o resultado a ser um inteiro sem sinal.

## O essencial

1. Um número é uma fileira de bits; cada bit pode ser um "sim ou não" (flag).
2. Ligar `x | B`, conferir `(x & B) !== 0`, desligar `x & ~B`, inverter `x ^ B`.
3. Parênteses sempre: `===` e `!==` têm prioridade maior que `&`, `|` e `^`.
4. XOR: `x ^ x = 0`; o XOR de todos cancela os pares.
5. No JS, operadores de bit trabalham com 32 bits com sinal; pra mais, use `BigInt`.

## Agora é com você

Faça um mini sistema de permissões em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]): um `enum` (ou constantes) com cinco permissões (ver, criar, editar, apagar, administrar), funções `conceder`, `revogar`, `tem` e `listar` (que devolve os nomes das permissões ligadas), e um teste que concede, revoga e confere cada uma. Depois resolva no LeetCode [Single Number](https://leetcode.com/problems/single-number/), [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) e [Counting Bits](https://leetcode.com/problems/counting-bits/), este último com programação dinâmica (dica: `bits[i] = bits[i >> 1] + (i & 1)`). Terminou quando o teste de permissões passa e você explica, sem olhar, por que `x & ~B` desliga só um bit.

Daqui, siga pra seção de Complexidade, começando pelo [[Big O]].

---

## 🧠 Me teste

> [!question]- Como conferir se a flag `ESCREVER` está ligada em `perm`?
> `(perm & ESCREVER) !== 0`, com os parênteses, porque o `!==` tem prioridade maior que o `&`.

> [!question]- Por que o XOR de todos os elementos acha o número que aparece uma vez só?
> Porque `x ^ x = 0`, `x ^ 0 = x` e o XOR é comutativo; todos os pares se cancelam e sobra só o solitário.

> [!question]- Como desligar um bit B de um número x?
> `x & ~B`: o `~B` tem todos os bits ligados menos o de B, e o E com ele apaga só aquele bit.

> [!question]- Por que `2 ** 31 | 0` dá um número negativo no JavaScript?
> Porque os operadores de bit convertem o número pra inteiro de 32 bits com sinal; 2³¹ passa do maior positivo representável e o bit mais alto vira o sinal.

> [!question]+ Qual expressão diz corretamente se `n` é par usando bits?
> - a) `n & 1 === 0`
> - b) `(n & 1) === 0`
> - c) `n && 1`
> - d) `n | 1 === n`
>
> > [!check]- Resposta
> > **b)** O último bit de um par é 0, e `n & 1` isola esse bit. Sem parênteses (a), o JavaScript calcula `1 === 0` primeiro (dá `false`) e depois `n & false`, que é sempre `0`: todo número pareceria ímpar. A c) usa o `&&` lógico, que não olha bits.

---

## Pra consultar depois

| Quero | Código |
|---|---|
| Ligar o bit | `x \| B` |
| Conferir | `(x & B) !== 0` |
| Desligar | `x & ~B` |
| Inverter | `x ^ B` |
| Bit i | `1 << i` |
| É ímpar? | `(n & 1) === 1` |
| Potência de 2? | `n > 0 && (n & (n - 1)) === 0` |
| Ver em binário | `n.toString(2)` |

**Pra ler:** a [página do MDN sobre o AND bit a bit](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Bitwise_AND) explica a conversão pra 32 bits e tem links pros outros operadores no menu lateral. A [tabela de precedência de operadores do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Operator_precedence) mostra por que os parênteses são obrigatórios.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

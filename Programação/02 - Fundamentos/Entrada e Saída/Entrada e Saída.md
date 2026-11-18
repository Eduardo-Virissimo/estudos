---
nivel: escrito
revisado:
---

# Entrada e Saída

Você escreveu uma calculadora de IMC. O peso e a altura estão fixos no código, `const peso = 70`, e toda vez que quer calcular pra outra pessoa, abre o arquivo, muda o número, salva e roda de novo. Funciona, mas não é um programa de verdade: é um cálculo que só você consegue usar.

Um programa útil **conversa com o mundo**. Ele **recebe** dados de fora (a entrada) e **mostra** um resultado (a saída). No Node.js, isso se faz com três ferramentas: `console.log` pra mostrar, `process.argv` pra receber o que foi digitado junto com o comando, e `readline` pra fazer perguntas e esperar a resposta.

Mas antes das ferramentas, a ideia que mais evita bugs nesta nota inteira: **tudo o que chega de fora é texto, e pode vir errado.** Converter e validar é trabalho seu, não do usuário. Se você só levar uma coisa daqui, leve essa. Pra acompanhar, ajuda já conhecer [[Variáveis e Tipos de Dados]] e o [[Terminal]].

## Dois canais de saída

`console.log` você já conhece: mostra algo no terminal. O que quase ninguém sabe no começo é que um programa tem **dois canais de saída separados**:

```ts
console.log("Olá", 42, { nivel: 3 }); // saída normal (stdout)
console.error("Deu ruim");             // saída de erro (stderr)
console.table([{ nome: "Ana", xp: 120 }, { nome: "Bia", xp: 80 }]); // uma tabela bonita
```

No terminal os dois aparecem igualzinho, então pra que separar? Porque quem usa o seu programa pode querer tratar cada um de um jeito. Imagine que você salva um relatório num arquivo com `npx tsx relatorio.ts > saida.txt`. O `>` pega **só o stdout**: o resultado vai pro arquivo, e as mensagens de erro continuam aparecendo na tela, sem sujar o relatório. Se você tivesse usado `console.log` pro erro, a mensagem "arquivo não encontrado" iria parar no meio do relatório, e ninguém ia perceber.

A regra é fácil: **resultado vai no `console.log`, problema vai no `console.error`.** (No [[Bash]], o `2>` redireciona só os erros.)

## Toda entrada chega como texto

Não importa se o usuário digitou `10` no teclado ou passou `10` junto com o comando: o programa recebe a **string** `"10"`, nunca o número. E isso causa um dos bugs mais clássicos de quem está começando:

```ts
const a = "10";
const b = "5";
console.log(a + b);                  // "105"  ← juntou os textos
console.log(Number(a) + Number(b));  // 15     ← agora sim
```

Com strings, o `+` não soma, **junta**. Então, toda vez que algo vem de fora, você faz duas coisas: **converte** (`Number(...)`) e **valida**. Porque o usuário pode digitar "abc", deixar em branco, ou escrever `1,75` com vírgula, do jeito brasileiro.

```ts
const resposta = "  1,75 ";
const altura = Number(resposta.trim().replace(",", ".")); // 1.75

if (Number.isNaN(altura) || altura <= 0) {
  console.error("Altura inválida");
}
```

O `.trim()` tira os espaços das pontas, e o `.replace(",", ".")` aceita a vírgula. E o `Number("abc")` não dá erro: ele devolve `NaN` (*Not a Number*), um valor especial que quer dizer "isso não é um número". Por isso a checagem com `Number.isNaN`.

"Ninguém vai digitar letra num campo de idade" é a frase que vem antes de todo bug de entrada. Sempre pense em três casos: o **vazio**, o **não numérico**, e o **fora do intervalo** (uma idade negativa, uma altura de 175 metros).

## Argumentos: dados junto com o comando

Quando você roda `git commit -m "mensagem"`, o `-m` e a `"mensagem"` são **argumentos**: informações passadas junto com o comando. Os seus programas também podem receber argumentos, e eles chegam no `process.argv`:

```ts
// rodando: npx tsx somar.ts 10 5
console.log(process.argv);
// [ "C:\\...\\node.exe", "C:\\...\\somar.ts", "10", "5" ]
```

Repare que vieram quatro coisas, não duas. As duas primeiras posições são **sempre** o caminho do Node e o caminho do seu arquivo. Os argumentos de verdade começam na terceira posição. Por isso, o jeito de pegar eles é cortar as duas primeiras com `.slice(2)`:

```ts
const [a, b] = process.argv.slice(2).map(Number);
console.log(a + b); // 15
```

Se você esquecer o `slice(2)`, o seu "primeiro argumento" vira o caminho do `node.exe`, e `Number(...)` disso dá `NaN`. É um erro que confunde muito na primeira vez.

Argumentos são ótimos pra ferramentas que você roda de uma vez, sem conversa: `npx tsx converter.ts 30 C` e pronto, o resultado aparece.

## Perguntar e esperar a resposta

Às vezes o programa precisa **conversar**: fazer uma pergunta, esperar você responder, e continuar. Pra isso existe o `readline`:

```ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const rl = readline.createInterface({ input, output });
  const nome = await rl.question("Qual seu nome? ");
  console.log(`Bem-vindo, ${nome.trim()}!`);
  rl.close(); // sem isso o programa não termina
}

main();
```

O `createInterface` liga o programa ao teclado (`input`) e à tela (`output`). O `rl.question` mostra a pergunta e **espera** você apertar Enter. E o `await` é o que faz o programa ficar parado esperando a resposta, em vez de seguir em frente. Você vai entender o `await` a fundo em [[Async e Await]]. Por enquanto, copie a estrutura: perguntas sempre com `await rl.question(...)`, dentro de uma função `async`.

E repare no `rl.close()` no final. Se você esquecer, o programa mostra a mensagem de boas-vindas e... fica ali, pendurado no terminal, sem terminar. Enquanto o `readline` está aberto, o Node acha que ainda pode chegar mais coisa do teclado e fica esperando. Fechou as perguntas, feche o `readline`.

## Voltando à calculadora

Agora dá pra transformar aquela calculadora de IMC num programa de verdade. Um padrão muito usado: aceitar os dados por argumento (rápido, pra quem já sabe usar) e, se eles não vierem, **perguntar**.

```ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function lerNumero(rl: readline.Interface, pergunta: string): Promise<number> {
  while (true) {
    const n = Number((await rl.question(pergunta)).replace(",", "."));
    if (!Number.isNaN(n) && n > 0) return n;
    console.error("Digite um número maior que zero.");
  }
}

async function main() {
  let [peso, altura] = process.argv.slice(2).map(Number);
  if (!peso || !altura) {
    const rl = readline.createInterface({ input, output });
    peso = await lerNumero(rl, "Peso (kg): ");
    altura = await lerNumero(rl, "Altura (m): ");
    rl.close();
  }
  console.log(`IMC: ${(peso / altura ** 2).toFixed(1)}`);
}

main();
```

Olhe com carinho o `lerNumero`. Quando a resposta é inválida, ele não quebra o programa: avisa no `console.error` e **pergunta de novo**, até vir algo que faça sentido. E aceita `1,75` com vírgula. É pensar em quem vai usar.

## O número que todo programa devolve

Tem uma última saída, que você não vê, mas que outros programas leem. Todo programa, quando termina, devolve um número pro sistema, o **código de saída**. **`0` quer dizer que deu certo**; qualquer outro número quer dizer erro. Scripts, [[Git Hooks]] e a CI usam esse número pra decidir se continuam ou se param.

```ts
if (!entradaValida) {
  console.error("Entrada inválida");
  process.exitCode = 1; // termina sinalizando erro
}
```

No Bash, `echo $?` logo depois de rodar um comando mostra o código de saída dele.

## O essencial

1. Tudo o que vem de fora é string: converta com `Number()` e valide (vazio, `NaN`, fora do intervalo).
2. Resultado no `console.log`, erro no `console.error`.
3. Argumentos: `process.argv.slice(2)`.
4. Perguntas: `await rl.question(...)`, e `rl.close()` no fim.

## Agora é com você

Faça um **quiz de 3 perguntas** no terminal: a capital do Brasil, quanto é 7 × 8, e o ano atual. Pergunte com `readline` e compare cada resposta ignorando maiúsculas e espaços (`.trim().toLowerCase()`). No fim, mostre a pontuação e uma tabela com `console.table` (a pergunta, a sua resposta, se acertou). Se acertar menos de 2, termine com `process.exitCode = 1`. Você terminou quando responder `" BRASÍLIA "` contar como certo e, no [[Bash]], `npx tsx quiz.ts; echo $?` mostrar `1` quando você for mal de propósito.

Daqui, siga pras [[Estruturas Condicionais]], que vão deixar o programa tomar decisões com essas respostas, ou pra [[Ler e Escrever Arquivos]], a outra grande forma de entrada e saída.

---

## 🧠 Me teste

> [!question]- Por que usar `process.argv.slice(2)`?
> Porque as duas primeiras posições do `process.argv` são o caminho do Node e do arquivo; os argumentos do usuário começam na terceira.

> [!question]- Qual o tipo de qualquer dado que chega pelo teclado ou argumento?
> Sempre `string`. É preciso converter (ex: `Number()`) e validar.

> [!question]- Qual a diferença entre `console.log` e `console.error`?
> `log` escreve no stdout (saída normal); `error` no stderr (saída de erro). Dá pra redirecionar cada um separado.

> [!question]- O que acontece se esquecer o `rl.close()`?
> O programa não termina: fica esperando mais entrada.

> [!question]- O que significa o código de saída 0?
> Que o programa terminou com sucesso. Qualquer outro número indica erro.

> [!question]+ Você roda `node soma.js 2 3` e o código faz `process.argv[2] + process.argv[3]`. O que aparece?
> - a) `5`
> - b) `"23"`
> - c) `NaN`
> - d) `undefined`
>
> > [!check]- Resposta
> > **b)** Tudo que chega por argumento ou teclado é **string**. `"2" + "3"` concatena. Converta antes com `Number(...)` e valide se deu `NaN`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `console.log(x)` | Mostra na saída normal |
| `console.error(x)` | Mostra na saída de erro |
| `console.table(lista)` | Mostra uma tabela |
| `process.argv.slice(2)` | Os argumentos do terminal |
| `await rl.question("?")` | Pergunta e espera a resposta |
| `rl.close()` | Encerra a leitura |
| `process.exitCode = 1` | Termina indicando erro |

**Pra ler:** a documentação do Node tem a parte de [readline com promises](https://nodejs.org/api/readline.html#promises-api) e a de [process.argv](https://nodejs.org/api/process.html#processargv), curtas e com exemplos. O [MDN sobre console](https://developer.mozilla.org/pt-BR/docs/Web/API/console) mostra métodos que você nem imaginava, como `console.group` e `console.time`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

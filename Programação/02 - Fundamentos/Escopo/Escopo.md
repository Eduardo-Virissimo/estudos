---
nivel: escrito
revisado:
---

# Escopo

Você criou uma variável dentro de um `if`, e duas linhas depois, fora dele, tenta usar. O programa explode: `titulo is not defined`. Mas você acabou de criar o `titulo`, está ali, dá pra ver na tela! O que aconteceu?

Aconteceu **escopo**: a regra que diz **em que região do código uma variável existe**. Em JavaScript moderno, uma variável criada com `let` ou `const` só vive dentro do bloco `{ }` onde nasceu. Saiu do bloco, ela some.

Na primeira vez parece uma regra chata, feita pra atrapalhar. Mas ela é uma proteção, e talvez a mais útil que a linguagem te dá: **quanto menor o escopo de uma variável, menos lugares do programa podem mexer nela, e menos lugares podem ter o bug.** Esta nota parte do que você viu em [[Funções]] e [[Variáveis e Tipos de Dados]].

## Dentro enxerga fora, fora não enxerga dentro

Pense numa casa. Quem está no quarto consegue ver o que está no corredor, é só olhar pela porta. Mas quem está no corredor não vê o que está guardado dentro do armário do quarto. Com variáveis é igualzinho:

```ts
const app = "Estudos RPG";          // do módulo: visível no arquivo todo

function mostrar() {
  const nivel = 3;                  // da função: só existe dentro de mostrar()
  if (nivel > 2) {
    const titulo = "Veterano";      // do bloco: só existe dentro deste if
    console.log(app, nivel, titulo); // ✅ de dentro, enxerga tudo o que está fora
  }
  // console.log(titulo);           // ❌ titulo is not defined
}
// console.log(nivel);              // ❌ nivel is not defined
```

São três níveis, um dentro do outro, como cômodos dentro da casa: o **módulo** (o arquivo inteiro), a **função**, e o **bloco**. Uma variável é visível no nível onde nasceu e em todos os níveis de dentro dele. Nunca nos de fora. E ela deixa de existir assim que o código sai do bloco onde nasceu: o `titulo` some quando o `if` termina.

Então, quando aparecer "X is not defined" e você tiver certeza que criou o X, a explicação quase sempre é essa: você está usando a variável fora do bloco onde ela foi criada. A solução é declarar no nível de fora, onde você precisa dela, e só **atribuir** o valor dentro do bloco:

```ts
let titulo = "Novato";
if (nivel > 2) {
  titulo = "Veterano";
}
console.log(titulo); // ✅
```

## Todo par de chaves é um bloco

Qualquer `{ }` cria um escopo novo: o de um `if`, de um `for`, de um `while`, e até chaves soltas no meio do código.

```ts
for (let i = 0; i < 3; i++) {
  // i existe aqui
}
// i não existe mais aqui
```

Isso é bom. O `i` é um detalhe do laço e não tem por que vazar pro resto da função, onde alguém poderia usar ele sem querer.

Agora, uma história de fantasma. Antes do `let` e do `const`, o JavaScript só tinha o `var`. E o `var` **ignora blocos**: ele só respeita funções.

```ts
if (true) {
  var x = 1;
}
console.log(x); // 1 😬 vazou do bloco
```

Parece inofensivo, mas olhe este bug clássico, que já fez muita gente perder uma tarde:

```ts
const acoes: (() => void)[] = [];
for (var i = 0; i < 3; i++) {
  acoes.push(() => console.log(i));
}
acoes.forEach((a) => a()); // 3, 3, 3 😱
```

Você esperava `0, 1, 2`. Mas como o `var` não tem escopo de bloco, existe **um** `i` só, compartilhado por todas as voltas do laço. Quando as funções finalmente rodam, o laço já terminou, e esse único `i` vale 3. Troque `var` por `let` e cada volta ganha o seu próprio `i`: o resultado vira `0, 1, 2`. É por isso que, em código novo, **nunca se usa `var`**.

Tem mais um detalhe que pega: `console.log(x); let x = 1;` dá `Cannot access 'x' before initialization`. A variável, tecnicamente, já existe no bloco inteiro, mas só pode ser usada **depois** da linha que a declara. O trecho antes da declaração tem um nome dramático: **zona morta temporal**.

## O perigo das globais

Se escopo pequeno protege, escopo enorme é o contrário. Uma variável **global** pode ser lida e alterada por qualquer função, de qualquer lugar do arquivo. Parece prático, até o dia em que ela aparece com um valor errado e você não faz ideia de **quem** mudou. Pode ter sido qualquer uma das 30 funções.

```ts
// ❌ todo mundo mexe em total
let total = 0;
function adicionar(x: number) { total += x; }

// ✅ a função recebe o que precisa e devolve o resultado
function adicionar2(total: number, x: number): number {
  return total + x;
}
```

Na segunda versão, tudo o que a função usa está à vista na assinatura dela, e ela não mexe em nada que não seja dela. A regra prática, que você já viu em [[Funções]]: **passe por parâmetro e receba pelo retorno.**

Um aviso sobre código antigo: em JavaScript sem módulos e sem modo estrito, escrever `x = 5` sem declarar **cria uma variável global** sem você perceber. O TypeScript e o modo estrito bloqueiam isso, o que é mais um motivo pra sempre declarar com `let` ou `const`.

## O mesmo nome em dois lugares

E se você criar, dentro de uma função, uma variável com o mesmo nome de uma de fora? Não dá erro. A de dentro "faz sombra" sobre a de fora: dentro daquele bloco, só a nova é visível. Isso se chama **shadowing**.

```ts
const nome = "global";
function f() {
  const nome = "local";
  console.log(nome); // "local"
}
console.log(nome);   // "global" — a de fora não mudou
```

Funciona, mas confunde quem lê: você olha `nome` e precisa descobrir de qual das duas se trata. Acontece muito sem querer, quando um parâmetro tem o mesmo nome de uma variável de fora. Prefira nomes diferentes.

## A função que lembra de onde nasceu

Agora a parte em que o escopo deixa de ser uma regra e vira uma ferramenta. Uma função criada dentro de outra **leva junto** o escopo onde nasceu, e continua enxergando as variáveis de lá mesmo depois que a função de fora já terminou:

```ts
function criarContador() {
  let total = 0;          // vive no escopo de criarContador
  return () => ++total;   // a função de dentro continua enxergando total
}

const contar = criarContador();
contar(); // 1
contar(); // 2
```

`criarContador` já terminou faz tempo, mas a função que ela devolveu ainda acessa o `total`, e lembra do valor entre uma chamada e outra. E tem mais: ninguém de fora consegue mexer no `total` diretamente. Ele está protegido dentro dessa "memória". Isso se chama **closure**, e é o jeito que o JavaScript tem de guardar um estado privado. A nota [[Closures]] vai a fundo nisso.

## O essencial

1. `let` e `const` vivem só no bloco `{ }` onde nasceram.
2. De dentro, você enxerga o que está fora; de fora, não enxerga o que está dentro.
3. "X is not defined": a variável está sendo usada fora do bloco dela. Declare no nível de fora.
4. Nunca use `var`. Evite globais: passe por parâmetro, receba pelo retorno.

## Agora é com você

Primeiro, um teste de previsão. Antes de rodar, escreva no papel o que cada `console.log` mostra:

```ts
let a = 1;
function f() { let a = 2; { let a = 3; console.log(a); } console.log(a); }
f(); console.log(a);
```

Depois rode e confira. Em seguida, use closure pra construir um **cofre**: uma função `criarCofre(senha: string)` que retorna um objeto `{ abrir(tentativa) }`. O `abrir` devolve `true` só com a senha certa, e depois de 3 tentativas erradas passa a devolver `false` pra sempre. A senha e o contador de erros não podem ser acessíveis de fora. Você terminou quando acertar a previsão (3, 2, 1) e o cofre bloquear depois de 3 erros, sem nenhuma variável global.

Daqui, siga pra [[Recursão]], [[Modularização]] ou direto pras [[Closures]].

---

## 🧠 Me teste

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

> [!question]+ O que este código imprime? `let x = 1; { let x = 2; } console.log(x);`
> - a) `1`
> - b) `2`
> - c) Erro: `x` já foi declarado
> - d) `undefined`
>
> > [!check]- Resposta
> > **a)** O `x` de dentro das chaves é **outra** variável, que só existe naquele bloco (shadowing). Fora dele, vale o `x` de fora.

> [!question]+ O que imprime `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));`?
> - a) `0 1 2`
> - b) `3 3 3`
> - c) `0 0 0`
> - d) `undefined` três vezes
>
> > [!check]- Resposta
> > **b)** `var` não tem escopo de bloco: é **um** `i` só, que já vale 3 quando os callbacks rodam. Com `let`, cada volta ganha o seu `i` e imprime `0 1 2`.

---

## Pra consultar depois

| Situação | Resultado |
|---|---|
| `let`/`const` dentro de `{ }` | Só existe no bloco |
| `var` dentro de `if` | Vaza pra função (não use) |
| De dentro → fora | ✅ Enxerga |
| De fora → dentro | ❌ `is not defined` |
| Usar antes do `let` | ❌ `before initialization` |
| Função que retorna função | Closure: lembra das variáveis |

**Pra ler:** o capítulo [Variable scope, closure](https://javascript.info/closure) do javascript.info explica com desenhos como o JavaScript guarda os escopos, e é a melhor leitura pra entender closures de verdade. O [verbete Escopo do MDN](https://developer.mozilla.org/pt-BR/docs/Glossary/Scope) é a definição curta.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
revisado:
---

# Funções

Imagine uma receita de bolo. Você não reescreve a receita inteira toda vez que vai fazer um bolo. Ela está escrita num lugar, num caderno, e você só diz: "faz aquela receita, com estes ingredientes". Se um dia descobrir que fica melhor com menos açúcar, você corrige o caderno uma vez, e todos os bolos seguintes saem certos.

Uma **função** é exatamente isso: um pedaço de código com nome, que você escreve uma vez e usa quantas vezes quiser. Ela recebe dados (os **parâmetros**), faz um trabalho, e **devolve** um resultado.

É a ferramenta mais básica pra organizar um programa. Sem funções, o mesmo cálculo aparece copiado em cinco lugares; um dia ele muda, você esquece de mudar em um, e esse é o bug. Com funções, você tem várias peças pequenas, cada uma com uma tarefa e um nome que diz qual é. E em TypeScript, você ainda declara o que entra e o que sai, e o editor avisa quando alguém usa a função errado.

Esta nota pressupõe que você já viu [[Estruturas Condicionais]] e [[Estruturas de Repetição]].

## Definir e chamar

```ts
function somar(a: number, b: number): number {
  return a + b;
}

const total = somar(2, 3);   // 5
const outro = somar(10, 20); // 30
```

Leia a primeira linha por partes. `function somar` dá o nome. `(a: number, b: number)` são os **parâmetros**: os "buracos" que a função espera receber, cada um com o seu tipo. O `: number` depois do parêntese é o **tipo do retorno**, o que a função promete devolver. E `return a + b` entrega o resultado pra quem chamou.

Na chamada `somar(2, 3)`, o `2` e o `3` são os **argumentos**: os valores de verdade que entram nos buracos. Parâmetro é o nome na definição; argumento é o valor na chamada. Parece um detalhe de vocabulário, mas aparece o tempo todo em mensagens de erro, como "Expected 2 arguments, but got 1".

E tem um erro que confunde na primeira vez: escrever `const x = somar`, sem parênteses. Isso não chama a função. Isso guarda **a própria função** dentro de `x`. Quem chama são os parênteses. Se um dia aparecer `[Function: somar]` no console onde você esperava um número, foi isso.

## Devolver não é mostrar

Se tem um conceito nesta nota que vale ler duas vezes, é este. Ele é o erro mais comum de quem está começando. Compare:

```ts
function media(a: number, b: number) {
  console.log((a + b) / 2); // ❌ só mostra na tela
}

function media2(a: number, b: number): number {
  return (a + b) / 2;       // ✅ devolve o valor
}

const m1 = media(4, 6);   // aparece 5 na tela, mas m1 é undefined
const m2 = media2(4, 6);  // m2 é 5, e você faz o que quiser com ele
```

O `console.log` **mostra** um valor, pra você ver. Mas a função em si não devolve nada: pra quem chamou, o resultado é `undefined`. Já o `return` **entrega** o valor pra quem chamou, que pode guardar, somar, comparar, mostrar ou mandar pra outra função.

Pense numa calculadora. O `console.log` é o visor: você vê o número, mas não consegue fazer conta com o visor. O `return` é o número em si, que você pode continuar usando.

Daí sai uma regra que vai te acompanhar sempre: **a função calcula e devolve; quem chamou decide se mostra.** Assim a mesma `media2` serve pra mostrar na tela, salvar num arquivo, ou usar dentro de outra conta.

Dois detalhes sobre o `return`. Primeiro, ele **encerra** a função na hora: o que vem depois dele não roda (é isso que faz o retorno antecipado das [[Estruturas Condicionais]] funcionar). Segundo, se você esquecer o `return`, a função devolve `undefined`, e o erro só aparece longe dali, num "Cannot read properties of undefined" que não diz nada sobre a causa. A proteção é declarar o tipo do retorno (`: number`): aí o TypeScript reclama na hora se você esquecer.

## A forma curta: arrow function

Existe um jeito mais curto de escrever funções, muito usado em JavaScript e TypeScript: a **arrow function** (função flecha, por causa do `=>`).

```ts
// as duas fazem a mesma coisa
function dobrar(n: number): number {
  return n * 2;
}
const dobrar2 = (n: number): number => n * 2;
```

Na versão de uma linha, o que vem depois da `=>` **já é** o retorno, sem escrever `return`. Isso se chama retorno implícito. Quando a função precisa de mais de uma linha, você abre chaves, e aí volta a precisar do `return`:

```ts
const saudacao = (nome: string) => {
  const texto = `Olá, ${nome}`;
  return texto;
};
```

E é exatamente aqui que mora um erro silencioso: `n => { n * 2 }` devolve `undefined`. Com chaves, o corpo virou um bloco normal, e bloco precisa de `return`. Nada quebra, nenhum erro aparece, só um `undefined` onde você esperava o dobro.

Quando usar cada forma? `function` pras funções "principais" do programa, com nome e algumas linhas. Arrow pras funções curtinhas, principalmente as que você passa pra outras funções, como em `lista.map(n => n * 2)`, que aparece mais adiante.

## Funções puras e efeitos colaterais

Toda função cai em um de dois grupos, e aprender a separar os dois muda a qualidade do seu código.

Uma função **pura** só olha pro que recebeu e só devolve um resultado. Pra mesma entrada, dá sempre a mesma saída, e não mexe em nada fora dela. `somar(2, 3)` é sempre 5: hoje, amanhã, em qualquer computador.

Uma função com **efeito colateral** faz alguma coisa no mundo além de devolver um valor: mostra na tela, escreve um arquivo, chama uma API, altera uma variável de fora, lê a hora atual.

```ts
// pura: só calcula
function calcularDesconto(preco: number, porcentagem: number): number {
  return preco * (1 - porcentagem / 100);
}

// efeito colateral: mexe no mundo
function salvarPedido(pedido: Pedido) {
  fs.writeFileSync("pedido.json", JSON.stringify(pedido));
}
```

Um programa sem efeito nenhum não serve pra nada: em algum momento você precisa mostrar um resultado ou salvar alguma coisa. A ideia não é eliminar os efeitos. É **separar**. Deixe os cálculos e as regras em funções puras, e os efeitos nas bordas do programa: num `main` que lê a entrada, chama as funções puras, e mostra a saída.

Por que vale o esforço? Função pura é fácil de **testar** (chama com um valor e confere o resultado, sem precisar de arquivo, internet ou tela) e fácil de **entender** (tudo o que ela usa está nos parâmetros). Quando aparece um bug, você sabe que ele está na conta ou na borda, e não espalhado no meio.

Existe um efeito colateral que se esconde muito bem. Se a função recebe um objeto ou uma lista e faz `opcoes.nome = "x"` ou `lista.push(item)`, ela está alterando o objeto **de quem chamou**. Quem chamou não tem a menor ideia de que a lista dele mudou. Pra manter a função pura, devolva uma cópia nova: `{ ...opcoes, nome: "x" }` ou `[...lista, item]`.

## Parâmetros que podem faltar

Nem todo parâmetro precisa ser passado sempre. Dá pra dar um **valor padrão**, usado quando ninguém passa nada, ou marcar como **opcional** com `?`:

```ts
function cumprimentar(nome: string, saudacao = "Olá", emoji?: string): string {
  return `${saudacao}, ${nome}${emoji ?? ""}`;
}

cumprimentar("Ana");              // "Olá, Ana"
cumprimentar("Ana", "Oi", "👋");  // "Oi, Ana👋"
```

O `saudacao = "Olá"` usa "Olá" se você não passar nada. O `emoji?: string` pode simplesmente não vir, e aí ele vale `undefined` (por isso o `?? ""`, que troca o `undefined` por um texto vazio). Os opcionais ficam sempre **no fim** da lista, porque não dá pra pular o do meio.

E quando os parâmetros começam a se acumular, tente adivinhar o que esta chamada faz:

```ts
criarUsuario("Ana", 20, true, false); // true o quê? false o quê?
```

Não dá. Agora compare com a versão que recebe um objeto:

```ts
function criarUsuario(opcoes: { nome: string; idade: number; admin?: boolean; ativo?: boolean }) {
  // ...
}

criarUsuario({ nome: "Ana", idade: 20, admin: true, ativo: false });
```

Cada valor vem com o nome do lado, a ordem deixa de importar, e os opcionais podem ficar de fora. A regra prática: **mais de 3 parâmetros, ou algum booleano solto, vira objeto.**

## Uma função, uma tarefa

Um sinal claro de que uma função está fazendo coisa demais é o nome precisar de um "e": `lerEValidarESalvar`. Divida em três. Olhe um exemplo de duas funções pequenas trabalhando juntas:

```ts
function calcularXp(minutos: number, dificuldade: "fácil" | "média" | "difícil"): number {
  const multiplicador = { fácil: 1, média: 1.5, difícil: 2 }[dificuldade];
  return Math.round(minutos * multiplicador);
}

function formatarXp(xp: number): string {
  return `${xp.toLocaleString("pt-BR")} XP`;
}

console.log(formatarXp(calcularXp(90, "difícil"))); // "180 XP"
```

Uma calcula, a outra formata. Dá pra testar cada uma sozinha. E se amanhã o XP precisar aparecer de outro jeito, só a `formatarXp` muda.

## Funções que recebem funções

Aqui o JavaScript tem um poder que nem toda linguagem tem: uma função é um **valor** como qualquer outro. Dá pra guardar numa variável, e dá pra **passar pra outra função**. A função que você passa se chama **callback** ("chamar de volta"): você entrega, e a outra função chama quando precisar.

```ts
function repetir(vezes: number, acao: (i: number) => void) {
  for (let i = 0; i < vezes; i++) acao(i);
}

repetir(3, (i) => console.log(`volta ${i}`));
// volta 0, volta 1, volta 2
```

A `repetir` sabe **quantas vezes** fazer; você diz **o quê** fazer. E você já usa isso sem perceber: em `lista.map(n => n * 2)`, a arrow `n => n * 2` é um callback que o `map` chama pra cada item. É a base do `map`, do `filter`, dos eventos de clique e das [[Promises]]. A nota [[Higher Order Functions]] aprofunda.

Por fim, um truque pra quando você quer devolver mais de uma coisa. Uma função só tem um `return`, mas ele pode devolver um objeto com várias coisas dentro, e quem chamou "desmonta" com desestruturação:

```ts
function estatisticas(numeros: number[]) {
  const soma = numeros.reduce((acc, n) => acc + n, 0);
  return { soma, media: soma / numeros.length };
}

const { soma, media } = estatisticas([1, 2, 3]); // soma = 6, media = 2
```

## O essencial

1. Parâmetro é o nome na definição; argumento é o valor na chamada. Sem parênteses, não chama.
2. `return` devolve; `console.log` só mostra. A função calcula e devolve, quem chamou decide se mostra.
3. Arrow com chaves precisa de `return`; sem chaves, o retorno é implícito.
4. Deixe as regras em funções puras e os efeitos (tela, arquivo, rede) nas bordas.
5. Mais de 3 parâmetros ou booleano solto: use um objeto.

## Agora é com você

Monte uma pequena biblioteca de funções de texto em 📁 `Programação/Práticas/Funções/`, sem usar os métodos prontos equivalentes. Escreva `contarVogais(texto)`, `inverter(texto)` (com laço, sem `.reverse()`), `ehPalindromo(texto)` (reusando `inverter`, ignorando maiúsculas e espaços), e por fim `resumo(texto)`, que devolve `{ letras, vogais, palindromo }` usando as três (as `letras` não contam espaços). Você terminou quando `resumo("Ame a ema")` devolver `{ letras: 7, vogais: 5, palindromo: true }`, nenhuma função tiver `console.log` dentro, e todas tiverem o tipo do retorno declarado.

Depois, comece o projeto do Estágio 1, o [[Gerenciador de Tarefas no Terminal]], pelo coração dele: **as regras do programa como funções puras**, sem terminal nem arquivo ainda. É o tópico "pura × efeito colateral" na prática. Em 📁 `Programação/Práticas/Funções/tarefas/` (que depois vira o repositório 📦 `tarefas`, em [[Configurando um Projeto TypeScript]]), crie um tipo `Tarefa` com `id`, `titulo` e `concluida`. Escreva `adicionar(tarefas, titulo)`, que **devolve uma lista nova** sem alterar a original, e da mesma forma `concluir(tarefas, id)` e `remover(tarefas, id)`. Escreva um `formatar(tarefas)` que devolve o texto pronto pra mostrar (`[x] 1. Estudar`). E um `main` que chama tudo, sendo o único lugar com `console.log`. Você terminou quando o `main` adicionar 3 tarefas, concluir uma, remover outra e mostrar a lista certa. Se quiser ir além, faça o `adicionar` recusar título vazio ou repetido, e crie um `estatisticas(tarefas)` com total, concluídas e porcentagem.

Daqui, o próximo passo é o [[Escopo]], e depois [[Recursão]], [[Modularização]] e [[Funções Puras]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre parâmetro e argumento?
> Parâmetro é o nome na definição da função (`a` em `function f(a)`); argumento é o valor passado na chamada (`5` em `f(5)`).

> [!question]- Qual a diferença entre `return` e `console.log` dentro de uma função?
> `return` devolve o valor pra quem chamou (dá pra reusar); `console.log` só mostra na tela e a função devolve `undefined`.

> [!question]- Por que `n => { n * 2 }` retorna `undefined`?
> Com chaves, a arrow function precisa de `return` explícito. Sem chaves (`n => n * 2`) o retorno é implícito.

> [!question]- Quando trocar vários parâmetros por um objeto?
> Quando são mais de 3 ou quando há booleanos soltos: `f({ nome, admin: true })` diz o que cada valor significa.

> [!question]- O que é uma função pura?
> Uma função que, pra mesma entrada, sempre dá a mesma saída e não altera nada fora dela.

> [!question]- Por que `lista.push(item)` dentro de uma função é um efeito colateral escondido?
> Porque altera a lista de quem chamou. Pra manter a função pura, devolva `[...lista, item]`.

> [!question]- O que é um callback?
> Uma função passada como argumento pra outra função, que a chama depois (ex: a função dentro de `lista.map(...)`).

> [!question]+ Qual destas arrow functions retorna `undefined` em vez do dobro?
> - a) `n => n * 2`
> - b) `(n) => (n * 2)`
> - c) `n => { n * 2 }`
> - d) `n => { return n * 2 }`
>
> > [!check]- Resposta
> > **c)** Com chaves, o corpo é um bloco e precisa de `return` explícito. Sem chaves (ou com parênteses), o retorno é implícito.

> [!question]+ Qual destas funções é **pura**?
> - a) `const soma = (a, b) => a + b`
> - b) `const agora = () => Date.now()`
> - c) `const add = (lista, x) => { lista.push(x); return lista }`
> - d) `const log = (m) => console.log(m)`
>
> > [!check]- Resposta
> > **a)** Mesma entrada, mesma saída, sem mexer em nada fora. `Date.now()` muda a cada chamada, `push` altera a lista de quem chamou e `console.log` mexe na tela.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `function f(a: T): R { return x }` | Declaração |
| `const f = (a: T): R => x` | Arrow, retorno implícito |
| `(a = 10)` | Valor padrão |
| `(a?: T)` | Parâmetro opcional |
| `return { x, y }` | Devolver vários valores |
| `const { x, y } = f()` | Desestruturar o retorno |
| `(cb: (n: number) => void)` | Parâmetro que é uma função |

**Pra ler:** o [capítulo 3 do Eloquent JavaScript](https://eloquentjavascript.net/03_functions.html), gratuito, explica funções com calma, do básico até escopo, pilha de chamadas e recursão, e termina com exercícios. É a melhor leitura depois desta nota. O vídeo [Higher-order functions, do Fun Fun Function](https://www.youtube.com/watch?v=BMUiFMZr7vk), é curto e divertido sobre passar função pra função. Pra consultar detalhes, o [guia de funções do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions) em português, e a parte de [funções do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html), pra tipar callbacks e parâmetros opcionais.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

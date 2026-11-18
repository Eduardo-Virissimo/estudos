---
nivel: escrito
revisado:
---

# Paradigmas de Programação

Peça um café de dois jeitos. No primeiro, você explica tudo: "pegue a xícara, coloque 15 gramas de pó, esquente a água a 92 graus, despeje devagar, em círculos...". No segundo, você só diz: "um café, por favor", e deixa quem sabe resolver. Os dois jeitos funcionam e chegam no mesmo café. Mas são **formas diferentes de pensar** o pedido.

Na programação, essas formas de pensar têm nome: **paradigmas**. Um paradigma é um estilo de organizar o código, um jeito de pensar a solução. Você vai ouvir falar de quatro: o **imperativo**, em que você diz passo a passo como fazer; o **declarativo**, em que você diz o que quer e alguém resolve o como; o **orientado a objetos**, que junta os dados e o comportamento em objetos; e o **funcional**, feito de funções puras que transformam dados sem alterar nada.

O TypeScript é **multiparadigma**: no dia a dia você mistura todos. E a ideia mais importante desta nota é justamente essa, então vale dizer logo: **nenhum é o certo.** O que importa é saber qual deles deixa cada trecho mais claro. Ajuda ter passado por [[Funções]] e [[Estruturas de Repetição]].

Pra comparar de verdade, vamos resolver o mesmo problema em cada estilo: **somar o XP das tarefas concluídas**.

```ts
const tarefas = [
  { titulo: "Estudar", xp: 50, concluida: true },
  { titulo: "Treinar", xp: 30, concluida: false },
  { titulo: "Ler", xp: 20, concluida: true },
];
```

## Como fazer, ou o que você quer

Esta é a distinção que você mais vai usar, a do café. No estilo **imperativo**, você controla cada passo e cada variável que muda:

```ts
let total = 0;
for (const t of tarefas) {
  if (t.concluida) {
    total += t.xp;
  }
}
```

No estilo **declarativo**, você descreve o resultado que quer:

```ts
const total = tarefas
  .filter((t) => t.concluida)              // só as concluídas
  .reduce((soma, t) => soma + t.xp, 0);    // somadas
```

O segundo se lê quase como uma frase: "das tarefas, as concluídas, somadas". Você não vê o laço nem a variável mudando, porque o `filter` e o `reduce` cuidam disso por baixo.

Qual é melhor? Depende. O imperativo é como o computador realmente funciona, e brilha quando a lógica tem muitos detalhes, passos e casos especiais. O declarativo é mais curto e mais claro pra transformações simples.

E você já usa coisas declarativas sem perceber. O **SQL** (`SELECT * FROM tarefas WHERE concluida`) é declarativo: você diz quais dados quer, e o banco decide como buscar. O **HTML** e o **CSS** também: você descreve a página, e o navegador desenha. Até os arquivos **YAML** do Docker.

Mais um exemplo, pra fixar: "os nomes das tarefas pendentes, em maiúsculas".

```ts
// imperativo
const pendentes: string[] = [];
for (const t of tarefas) {
  if (!t.concluida) pendentes.push(t.titulo.toUpperCase());
}

// declarativo / funcional
const pendentes2 = tarefas
  .filter((t) => !t.concluida)
  .map((t) => t.titulo.toUpperCase());
```

Os dois dão `["TREINAR"]`.

## Objetos que cuidam de si mesmos

A ideia da **orientação a objetos** é juntar os **dados** e as **ações** sobre esses dados num mesmo lugar: um objeto que "sabe se cuidar".

```ts
class ListaDeTarefas {
  private tarefas: { titulo: string; xp: number; concluida: boolean }[] = [];

  adicionar(titulo: string, xp: number) {
    this.tarefas.push({ titulo, xp, concluida: false });
  }

  concluir(titulo: string) {
    const t = this.tarefas.find((t) => t.titulo === titulo);
    if (t) t.concluida = true;
  }

  xpTotal(): number {
    return this.tarefas.filter((t) => t.concluida).reduce((s, t) => s + t.xp, 0);
  }
}
```

A lista (`tarefas`) e o que se faz com ela (`adicionar`, `concluir`, `xpTotal`) moram juntos. E repare no `private`: ele impede que alguém de fora bagunce a lista diretamente. A única forma de mexer nela é pelos métodos, e são os métodos que garantem as regras. É um estilo ótimo pra modelar "coisas" que têm regras próprias, e você vai estudar a fundo em [[Classes]] e [[Encapsulamento]].

Um mal-entendido comum: achar que orientação a objetos é "usar classe". Uma classe com tudo público e só uns `get` e `set` não é orientação a objetos, é um objeto com burocracia. O ponto central é o objeto **proteger** as próprias regras.

## Funções que não mexem em nada

O estilo **funcional** é um tipo de declarativo com regras extras. As funções são **puras**: mesma entrada, mesma saída, sem efeito colateral (você viu isso em [[Funções]]). **Nada é alterado**: em vez de mudar uma lista, você cria uma lista nova. E as **funções são valores**: você passa função pra função, como no `map`, no `filter` e nos callbacks.

Esse estilo está por toda parte no JavaScript moderno: nos métodos `map`, `filter` e `reduce`, no React, e em boa parte das bibliotecas atuais.

## Nenhum é o certo

Paradigma não é time de futebol, e ninguém precisa escolher um lado. Um código bom em TypeScript costuma misturar: **funções puras pras regras** (funcional), **classes quando existe um estado com regras próprias** (orientado a objetos), e **laços imperativos quando a lógica é cheia de passos e exceções**.

A pergunta certa nunca é "qual paradigma eu sigo?". É "qual jeito deixa **este trecho** mais claro?".

E cuidado com a moda. Quando você aprende `map`, `filter` e `reduce`, dá vontade de usar em tudo, e o estilo funcional vira sinônimo de "código moderno". Mas encadear seis `map`, `filter` e `reduce` com lógica complicada dentro fica ilegível, e um `for` claro vence fácil. Pior ainda é misturar sem querer: um `map` que também altera uma variável de fora (um `total += ...` lá dentro) pega o pior dos dois mundos.

Pra ter uma visão geral dos quatro lado a lado:

| Paradigma | Ideia central | Você vê em |
|---|---|---|
| Imperativo | passos e variáveis que mudam | laços `for`, scripts |
| Declarativo | descrever o resultado | SQL, HTML, CSS, `filter` |
| Orientado a objetos | objetos com estado e métodos | classes, Java, C# |
| Funcional | funções puras, dados imutáveis | `map`/`reduce`, React |

Numa entrevista ou no trabalho, vale muito mais mostrar o mesmo problema resolvido em dois estilos, e saber dizer por que escolheu um, do que recitar essas definições.

## O essencial

1. Imperativo diz como fazer; declarativo diz o que você quer.
2. Orientação a objetos junta dados e ações, e o objeto protege as próprias regras.
3. Funcional: funções puras, nada é alterado, funções como valor.
4. Nenhum é o certo. Escolha o que deixa cada trecho mais claro.

## Agora é com você

Um problema, três estilos. Dada uma lista de alunos `{ nome, nota }`, gere os nomes dos aprovados (nota ≥ 7) em ordem alfabética. Resolva primeiro com `for` (imperativo), depois com `filter`, `map` e `sort` (funcional), e por fim com uma classe `Turma` com um método `aprovados()` (orientado a objetos). No fim, escreva em duas linhas qual achou mais fácil de ler, e por quê. Você terminou quando as três versões derem o mesmo resultado e você conseguir explicar a diferença pra alguém.

Daqui, cada paradigma tem a sua continuação: [[Classes]] (orientação a objetos, no Estágio 3), [[Funções Puras]] (funcional, no Estágio 6) e [[SQL]] (declarativo).

---

## 🧠 Me teste

> [!question]- Qual a diferença entre imperativo e declarativo?
> Imperativo diz como fazer, passo a passo; declarativo diz o que você quer e deixa o como pra linguagem ou ferramenta.

> [!question]- Cite dois exemplos de linguagem ou código declarativo.
> SQL, HTML, CSS, YAML, e em JS o uso de `filter`/`map`.

> [!question]- Qual a ideia central da orientação a objetos?
> Juntar dados e o comportamento que mexe neles num objeto, escondendo os detalhes internos.

> [!question]- O que caracteriza o paradigma funcional?
> Funções puras, dados que não são alterados (cria-se novos) e funções tratadas como valores.

> [!question]- TypeScript é de qual paradigma?
> Multiparadigma: dá pra programar de forma imperativa, funcional e orientada a objetos, e no dia a dia se mistura.

> [!question]+ Qual destes trechos é **declarativo**?
> - a) `for (let i = 0; i < l.length; i++) if (l[i] > 0) r.push(l[i])`
> - b) `l.filter(x => x > 0)`
> - c) `let i = 0; while (i < l.length) { ...; i++ }`
> - d) `r[r.length] = l[i]`
>
> > [!check]- Resposta
> > **b)** Declarativo diz **o que** quer ("os positivos") e não **como** percorrer. Os laços com índice descrevem passo a passo: imperativo.

---

## Pra consultar depois

| Estilo | A cara do código |
|---|---|
| Imperativo | `for` + `if` + `total += x` |
| Funcional | `.filter().map().reduce()` |
| Orientado a objetos | `class X { private dados; metodo() {} }` |
| Declarativo | `SELECT ... WHERE ...` |

**Pra ler:** o capítulo [Array methods](https://javascript.info/array-methods) do javascript.info é a porta de entrada do estilo funcional: `map`, `filter`, `reduce` e `sort`, com exercícios. E o [verbete de programação funcional do MDN](https://developer.mozilla.org/en-US/docs/Glossary/Functional_programming) dá a definição curta e os conceitos relacionados.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

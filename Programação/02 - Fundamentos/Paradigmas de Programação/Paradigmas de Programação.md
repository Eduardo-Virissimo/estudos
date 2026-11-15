---
nivel: escrito
revisado:
---

# Paradigmas de Programação

> *"Uma linguagem que não muda o jeito como você pensa sobre programação não vale a pena aprender."* (Alan Perlis)

> [!tip] ⚡ Em 30 segundos
> Paradigma é um **estilo de organizar o código**. **Imperativo:** você diz passo a passo como fazer. **Declarativo:** você diz o que quer e alguém resolve o como (SQL, HTML). **Orientado a objetos:** dados e comportamento juntos em objetos. **Funcional:** funções puras que transformam dados sem alterá-los. TypeScript é **multiparadigma**: no dia a dia você mistura os quatro.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Explicar a diferença entre imperativo e declarativo com um exemplo
- Reconhecer código orientado a objetos e código funcional
- Escrever o mesmo problema em dois paradigmas e dizer qual ficou mais claro

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Estruturas de Repetição]]
- **Depois:** [[Classes]] (OO, Estágio 3) · [[Funções Puras]] (funcional, Estágio 6) · [[SQL]] (declarativo)
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

O mesmo problema em cada estilo: **somar o XP das tarefas concluídas.**

```ts
const tarefas = [
  { titulo: "Estudar", xp: 50, concluida: true },
  { titulo: "Treinar", xp: 30, concluida: false },
  { titulo: "Ler", xp: 20, concluida: true },
];
```

### 1. Imperativo: o passo a passo

```ts
let total = 0;
for (const t of tarefas) {
  if (t.concluida) {
    total += t.xp;
  }
}
```

Você controla cada passo e cada variável que muda. É como o computador realmente funciona. Bom pra lógica com muitos detalhes; fica verboso pra transformações simples.

### 2. Declarativo / Funcional: o que você quer

```ts
const total = tarefas
  .filter((t) => t.concluida)   // só as concluídas
  .reduce((soma, t) => soma + t.xp, 0); // somadas
```

Você descreve **o resultado**, não o laço. **Funcional** acrescenta: funções puras, nada é alterado (cria-se dados novos), funções passadas como valor. Aparece em `map`/`filter`/`reduce`, React e muito do JavaScript moderno.

Outros exemplos declarativos que você vai usar: **SQL** (`SELECT * FROM tarefas WHERE concluida`), **HTML**, **CSS**, arquivos **YAML** do Docker.

### 3. Orientado a objetos: objetos que sabem se cuidar

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

Dados (`tarefas`) e comportamento (`adicionar`, `xpTotal`) moram juntos, e o `private` impede que alguém de fora bagunce a lista. Bom pra modelar "coisas" com regras próprias. Estudado a fundo em [[Classes]] e [[Encapsulamento]].

### 4. Resumo

| Paradigma | Ideia central | Você vê em |
|---|---|---|
| Imperativo | passos e variáveis que mudam | laços `for`, scripts |
| Declarativo | descrever o resultado | SQL, HTML, CSS, `filter` |
| Orientado a objetos | objetos com estado e métodos | classes, Java, C# |
| Funcional | funções puras, dados imutáveis | `map`/`reduce`, React |

### 5. Não é time de futebol

Nenhum é "o certo". Código bom em TypeScript costuma usar **funções puras pras regras**, **objetos/classes quando há estado com regras** e **imperativo quando a lógica é cheia de passos**. Escolha o que deixa cada trecho mais claro.

---

## 🛠️ Exemplo guiado

Mesmo problema, "nomes das tarefas pendentes em maiúsculas":

```ts
// imperativo
const pendentes: string[] = [];
for (const t of tarefas) {
  if (!t.concluida) pendentes.push(t.titulo.toUpperCase());
}

// funcional
const pendentes2 = tarefas
  .filter((t) => !t.concluida)
  .map((t) => t.titulo.toUpperCase());
```

Os dois dão `["TREINAR"]`. O funcional lê como uma frase: "das tarefas, filtre as não concluídas e mapeie pro título em maiúsculas".

---

## 🔧 Pegadinhas

- **Achar que funcional é sempre melhor.** Encadear 6 `map`/`filter`/`reduce` com lógica complexa fica ilegível. Um `for` claro vence.
- **Achar que OO é "usar classe".** Classe com tudo público e só getters/setters não é orientação a objetos; é um objeto com burocracia.
- **Misturar no mesmo trecho.** Um `map` que também altera variáveis de fora (`total += ...` dentro do `map`) pega o pior dos dois mundos.
- **Decorar definição.** Na entrevista e no trabalho, vale mais mostrar o mesmo problema nos dois estilos do que recitar conceitos.

---

## 🔨 Desafio prático

**Objetivo:** um problema, três estilos.

1. Dada uma lista de alunos `{ nome, nota }`, gere os nomes dos aprovados (nota ≥ 7) em ordem alfabética.
2. Resolva com `for` (imperativo), com `filter`/`map`/`sort` (funcional) e com uma classe `Turma` com método `aprovados()` (OO).
3. Escreva em 2 linhas qual achou mais fácil de ler e por quê.

**Pronto quando:** as três versões dão o mesmo resultado e você consegue explicar a diferença pra alguém.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Estilo | Cara do código |
|---|---|
| Imperativo | `for` + `if` + `total += x` |
| Funcional | `.filter().map().reduce()` |
| OO | `class X { private dados; metodo() {} }` |
| Declarativo | `SELECT ... WHERE ...` |

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

- [MDN · Programação funcional (glossário)](https://developer.mozilla.org/en-US/docs/Glossary/Functional_programming)
- [javascript.info · Array methods](https://javascript.info/array-methods): `map`, `filter`, `reduce` e `sort`, a porta de entrada do estilo funcional

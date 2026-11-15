---
nivel: escrito
revisado:
---

# Objetos e Arrays no JavaScript

> *"Metade do seu código vai ser transformar uma lista de objetos em outra lista de objetos."*

> [!tip] ⚡ Em 30 segundos
> **Objetos** agrupam dados com nome (`{ titulo: "Estudar", xp: 50 }`); **arrays** são listas ordenadas. O dia a dia é: **desestruturar** (`const { titulo } = tarefa`), **copiar com spread** (`{ ...tarefa, xp: 60 }`) e transformar listas com **`map`, `filter`, `find`, `some`, `reduce` e `sort`**. Detalhe que derruba todo iniciante: objetos e arrays são passados por **referência**, então "copiar" com `=` não copia.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Criar, ler, atualizar e copiar objetos com desestruturação e spread
- Transformar listas com `map`, `filter`, `find`, `some`/`every`, `reduce` e `sort`
- Explicar a diferença entre copiar a referência e copiar o valor

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Tipos Básicos do TypeScript]] · [[Estruturas de Repetição]] · [[Funções]]
- **Depois:** [[Map e Set no JavaScript]] · [[Interfaces e Type Aliases]] · [[Arrays]] · [[JSON]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Objetos

```ts
const tarefa = { id: 1, titulo: "Estudar", xp: 50, tags: ["ts"] };

tarefa.titulo;          // "Estudar"
tarefa["xp"];           // 50 (útil quando a chave vem de variável)
tarefa.xp = 60;         // alterar
Object.keys(tarefa);    // ["id", "titulo", "xp", "tags"]
Object.entries(tarefa); // [["id", 1], ["titulo", "Estudar"], ...]
"xp" in tarefa;         // true
```

Atalho quando a variável tem o mesmo nome da chave:

```ts
const titulo = "Treinar";
const nova = { titulo, xp: 30 }; // { titulo: "Treinar", xp: 30 }
```

### 2. Desestruturação

```ts
const { titulo, xp } = tarefa;              // pega duas propriedades
const { titulo: nome } = tarefa;            // renomeia
const { prazo = "sem prazo" } = tarefa as { prazo?: string }; // valor padrão

const [primeira, segunda, ...resto] = [10, 20, 30, 40]; // resto = [30, 40]

function mostrar({ titulo, xp }: { titulo: string; xp: number }) { } // nos parâmetros
```

### 3. Spread (`...`): copiar e juntar

```ts
const atualizada = { ...tarefa, xp: 80 };   // cópia com xp trocado (a original não muda)
const juntos = [...listaA, ...listaB];
const comNova = [...tarefas, novaTarefa];   // "push" sem alterar a original
```

### 4. Referência × valor

```ts
const a = { xp: 10 };
const b = a;        // b aponta pro MESMO objeto
b.xp = 99;
console.log(a.xp);  // 99 😱

const c = { ...a }; // cópia rasa: objeto novo
c.xp = 1;
console.log(a.xp);  // 99 ✅ não mudou
```

O spread copia só o **primeiro nível**. `tags` dentro de `c` ainda é o mesmo array de `a`. Pra cópia profunda: `structuredClone(a)`.

### 5. Os métodos de array do dia a dia

```ts
const tarefas = [
  { id: 1, titulo: "Estudar", xp: 50, feita: true },
  { id: 2, titulo: "Treinar", xp: 30, feita: false },
  { id: 3, titulo: "Ler", xp: 20, feita: true },
];
```

| Método | Pra quê | Exemplo | Resultado |
|---|---|---|---|
| `map` | transformar cada item | `tarefas.map(t => t.titulo)` | `["Estudar","Treinar","Ler"]` |
| `filter` | ficar com alguns | `tarefas.filter(t => t.feita)` | 2 tarefas |
| `find` | achar o primeiro | `tarefas.find(t => t.id === 2)` | a tarefa 2 (ou `undefined`) |
| `findIndex` | achar a posição | `tarefas.findIndex(t => t.id === 2)` | `1` (ou `-1`) |
| `some` / `every` | algum? todos? | `tarefas.some(t => !t.feita)` | `true` |
| `includes` | contém o valor? | `["a","b"].includes("a")` | `true` |
| `reduce` | juntar num valor | `tarefas.reduce((s, t) => s + t.xp, 0)` | `100` |
| `sort` | ordenar | ver abaixo | – |
| `join` | virar texto | `["a","b"].join(", ")` | `"a, b"` |

Encadeando:

```ts
const xpFeito = tarefas.filter((t) => t.feita).reduce((soma, t) => soma + t.xp, 0); // 70
```

### 6. `sort` tem duas armadilhas

```ts
[10, 9, 1].sort();                  // [1, 10, 9] 😱 ordena como TEXTO
[10, 9, 1].sort((a, b) => a - b);   // [1, 9, 10] ✅ crescente

tarefas.sort((a, b) => b.xp - a.xp);                       // maior xp primeiro
tarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));  // alfabética com acento certo
```

E `sort` **altera** o array original. Pra não alterar: `tarefas.toSorted(...)` (ou `[...tarefas].sort(...)`).

### 7. Alteram × não alteram

| Alteram o original | Devolvem um novo |
|---|---|
| `push`, `pop`, `shift`, `splice`, `sort`, `reverse` | `map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, spread |

Em código moderno (React, funções puras), prefira a coluna da direita.

---

## 🛠️ Exemplo guiado

Operações de um gerenciador de tarefas, sem alterar a lista original:

```ts
type Tarefa = { id: number; titulo: string; feita: boolean };

const adicionar = (lista: Tarefa[], titulo: string): Tarefa[] => [
  ...lista,
  { id: Math.max(0, ...lista.map((t) => t.id)) + 1, titulo, feita: false },
];

const concluir = (lista: Tarefa[], id: number): Tarefa[] =>
  lista.map((t) => (t.id === id ? { ...t, feita: true } : t));

const remover = (lista: Tarefa[], id: number): Tarefa[] => lista.filter((t) => t.id !== id);

let tarefas: Tarefa[] = [];
tarefas = adicionar(tarefas, "Estudar");
tarefas = adicionar(tarefas, "Treinar");
tarefas = concluir(tarefas, 1);
tarefas = remover(tarefas, 2);
console.log(tarefas); // [{ id: 1, titulo: "Estudar", feita: true }]
```

O padrão `map` + `{ ...t, campo: novo }` é **o** jeito de atualizar um item numa lista.

---

## 🔧 Pegadinhas

- **`const b = a` achando que copiou.** Copiou a referência. Use `{ ...a }`, `[...a]` ou `structuredClone(a)`.
- **`sort()` sem função de comparação em números.** Ordena como texto. Sempre `(a, b) => a - b`.
- **`find` retorna `undefined`.** Trate antes de usar: `tarefas.find(...)?.titulo`.
- **`map` sem `return` nas chaves.** `lista.map(t => { t.titulo })` dá `[undefined, ...]`.
- **`forEach` pra transformar.** `forEach` não retorna nada; pra criar lista nova, `map`/`filter`.
- **`reduce` sem valor inicial.** Em lista vazia dá erro. Sempre passe o segundo argumento (`, 0`).

---

## 🔨 Desafio prático

**Objetivo:** responder perguntas sobre uma lista só com métodos de array (sem `for`).

Dados: `const filmes = [{ titulo, ano, nota, generos: string[] }, ...]` com pelo menos 6 filmes seus.

1. Títulos dos filmes com nota ≥ 8, em ordem alfabética.
2. Média das notas.
3. O filme mais antigo.
4. Algum filme de terror? Todos depois de 2000?
5. Lista de gêneros **sem repetição** (dica: `new Set(...)`, veja [[Map e Set no JavaScript]]).
6. Um novo array com a nota de um filme alterada, sem alterar o original (confira o original depois).

**Pronto quando:** as 6 respostas saem certas, sem nenhum `for` e sem alterar `filmes`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `map` e `filter`?
> `map` transforma cada item e devolve uma lista do mesmo tamanho; `filter` devolve só os itens que passam na condição.

> [!question]- Por que `const b = a` não copia um objeto?
> Porque objetos são guardados por referência: `b` passa a apontar pro mesmo objeto. Mudou um, mudou o outro.

> [!question]- Como atualizar um item numa lista sem alterar a original?
> `lista.map(t => t.id === id ? { ...t, campo: novo } : t)`.

> [!question]- Por que `[10, 9, 1].sort()` dá `[1, 10, 9]`?
> Porque o `sort` sem função compara como texto. Pra números: `sort((a, b) => a - b)`.

> [!question]- Qual a diferença entre `find` e `filter`?
> `find` devolve o primeiro item que passa (ou `undefined`); `filter` devolve um array com todos que passam.

> [!question]- O que o spread copia num objeto com arrays dentro?
> Só o primeiro nível: os arrays internos continuam compartilhados. Pra cópia profunda, `structuredClone`.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `const { a, b } = obj` | desestruturar |
| `{ ...obj, a: 1 }` | cópia com alteração |
| `[...lista, item]` | adicionar sem alterar |
| `lista.map(fn)` | transformar |
| `lista.filter(fn)` | filtrar |
| `lista.find(fn)` | achar um |
| `lista.reduce((acc, x) => ..., inicial)` | juntar |
| `lista.toSorted((a, b) => a - b)` | ordenar sem alterar |
| `structuredClone(obj)` | cópia profunda |

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

- [javascript.info · Objects](https://javascript.info/object) e [Array methods](https://javascript.info/array-methods)
- [MDN · Array](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array): todos os métodos com exemplos
- [Does it mutate?](https://doesitmutate.xyz/): quais métodos alteram o array original

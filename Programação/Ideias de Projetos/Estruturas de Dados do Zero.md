# Estruturas de Dados do Zero

O projeto do **Estágio 2** do [[Roadmap]]. Um repositório em TypeScript onde você mesmo escreve, sem biblioteca nenhuma, as estruturas que todo programa usa por baixo dos panos (pilha, fila, hash table, árvore de busca e as outras que o estágio apresenta), e ao lado delas um caderno de 30 exercícios resolvidos, cada um com o Big-O anotado.

Ninguém vai te pedir pra escrever uma hash table no trabalho. O motivo de fazer isso é outro: depois de escrever uma, você nunca mais usa um `Map` sem saber quanto ele custa. E é exatamente isso que as entrevistas técnicas e o dia a dia cobram, saber escolher.

```text
estruturas-do-zero/
  src/
    pilha.ts          → class Pilha<T>
    fila.ts           → class Fila<T>        (sem usar shift!)
    hash-table.ts     → class TabelaHash<V>
    bst.ts            → class ArvoreBusca
    lista-ligada.ts   → (bônus)
    heap.ts           → (bônus) class MinHeap
    trie.ts           → (bônus)
    grafo.ts          → (bônus) lista de adjacência + BFS/DFS
  testes/
    pilha.test.ts     → node:test + node:assert
    ...
  exercicios/
    001-two-sum.ts
    002-valid-parentheses.ts
    ...
  README.md           → a tabela dos 30 exercícios com o Big-O de cada um
```

## Por que este projeto

- Prova o critério do estágio: resolver exercícios fáceis e médios **e explicar o Big-O** da sua solução ([[Big O]]).
- Cada nota do estágio tem um "Agora é com você" que constrói uma peça daqui. Quando terminar as notas, o repositório está quase pronto.
- Usa o Estágio 1 inteiro: [[Classes no TypeScript]], [[Generics]], [[Módulos ES (import e export)]], [[Git Básico|Git]] e GitHub.

## Funcionalidades

**O mínimo (o que prova o ✅):**
- [ ] `Pilha<T>`: `push`, `pop`, `peek`, `tamanho`, `vazia` ([[Pilhas]])
- [ ] `Fila<T>`: `enfileirar`, `desenfileirar`, `frente`, `tamanho`, tudo em O(1) ([[Filas]])
- [ ] `TabelaHash<V>`: `set`, `get`, `has`, `delete`, com tratamento de colisão e redimensionamento ([[Hash Table]])
- [ ] `ArvoreBusca`: `inserir`, `contem`, `remover`, `emOrdem`, `altura` ([[Árvore Binária de Busca (BST)]])
- [ ] Um teste pra cada operação, incluindo os casos de borda (estrutura vazia, um elemento só, chave repetida)
- [ ] 30 exercícios em `exercicios/`, cada um com um comentário no topo: link do problema, a ideia em uma frase, Big-O de tempo e de espaço

**Depois (bônus):**
- [ ] `ListaLigada<T>` com `inverter()` ([[Listas Ligadas]])
- [ ] `MinHeap` e uma fila de prioridade em cima dele ([[Heap (Estrutura de Dados)]])
- [ ] `Trie` com `comPrefixo("pro")` ([[Trie]])
- [ ] `Grafo` com BFS, DFS e Dijkstra ([[Grafos]] · [[BFS (Busca em Largura)]] · [[DFS (Busca em Profundidade)]] · [[Dijkstra]])
- [ ] Um `benchmark.ts` que mede `Fila` contra `array.shift()` com 100 mil itens, e o resultado no README

## Requisitos técnicos

- **TypeScript com `strict: true`**, sem `any`. As estruturas são genéricas (`Pilha<T>`), não presas a `number`.
- **Nada de atalho**: a `Fila` não pode usar `shift`, a `TabelaHash` não pode usar `Map` nem objeto por dentro (use um array de baldes), a árvore é feita de nós com `esquerda` e `direita`.
- **Testes com o que vem no Node**, sem instalar nada: `node:test` e `node:assert`, rodando com `npx tsx --test testes/`. O Vitest chega no Estágio 3.

```ts
// testes/pilha.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { Pilha } from "../src/pilha.js"; // .js mesmo, como em Módulos ES

test("pop devolve o último que entrou", () => {
  const p = new Pilha<number>();
  p.push(1);
  p.push(2);
  assert.equal(p.pop(), 2);
  assert.equal(p.tamanho, 1);
});

test("pop numa pilha vazia devolve undefined", () => {
  assert.equal(new Pilha<number>().pop(), undefined);
});
```

## Os 30 exercícios

Escolha no [LeetCode](https://leetcode.com/problemset/) (filtro *Easy* e *Medium*) ou no [Beecrowd](https://judge.beecrowd.com/). Uma distribuição que cobre o estágio: 6 de arrays e strings, 4 de hash/set, 4 de pilha e fila, 4 de árvore, 4 de grafo (BFS/DFS), 4 de busca binária e two pointers/sliding window, 4 de programação dinâmica e greedy. A lista da [NeetCode](https://neetcode.io/roadmap) já vem agrupada desse jeito e é um bom cardápio.

O README termina com uma tabela assim:

| # | Problema | Ideia | Tempo | Espaço |
|---|---|---|---|---|
| 1 | Two Sum | `Map` de "valor que falta → índice" | O(n) | O(n) |
| 2 | Valid Parentheses | pilha de aberturas | O(n) | O(n) |

Você terminou o estágio quando a tabela tem 30 linhas e você consegue explicar, sem olhar, por que cada Big-O é o que é.

## Onde fazer

📦 Repositório próprio no GitHub: `estruturas-do-zero`. Um commit por estrutura e um por exercício ([[Conventional Commits]]: `feat: pilha`, `exercicio: two-sum`).

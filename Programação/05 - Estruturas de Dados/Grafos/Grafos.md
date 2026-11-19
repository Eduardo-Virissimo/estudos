---
nivel: escrito
revisado:
---

# Grafos

O mapa do metrô de São Paulo. Estações são bolinhas, os trilhos entre elas são linhas. Algumas estações se ligam a duas outras, as de baldeação se ligam a quatro ou cinco. Agora pense em perguntas que alguém faz olhando esse mapa: dá pra ir da Sé até o Butantã? Qual o caminho com menos estações? Se a estação Paraíso fechar, alguma parte da cidade fica isolada?

Isso é um **grafo**: um conjunto de **vértices** (as bolinhas) ligados por **arestas** (as linhas). E a grande sacada é que quase tudo é um grafo, se você olhar do jeito certo. Pessoas e amizades numa rede social. Páginas e links na web. Cidades e estradas no GPS. Tarefas e "esta depende daquela" num projeto. Pacotes e dependências no `package.json`. Até o mapa de um joguinho, a grade de [[Matrizes]], é um grafo em que cada casa se liga às vizinhas.

Todas as estruturas do estágio até aqui (lista, árvore) são casos particulares de grafo, com regras a mais. O grafo é o caso geral, sem regras: qualquer um liga com qualquer um, pode ter ciclo, pode ter pedaços soltos. Esta nota é sobre **como representar** um grafo no código, que é a decisão que vem antes de qualquer algoritmo. Os algoritmos ([[BFS (Busca em Largura)|BFS]], [[DFS (Busca em Profundidade)|DFS]], [[Dijkstra]]) têm notas próprias.

## O vocabulário mínimo

Quatro distinções aparecem em todo problema de grafo, e vale reconhecê-las de cara.

**Dirigido ou não.** No metrô, se dá pra ir da Sé pra Liberdade, dá pra voltar: a aresta vale nos dois sentidos (**não dirigido**). No Instagram, você seguir alguém não faz essa pessoa te seguir: a aresta tem direção (**dirigido**), e se desenha com seta.

**Com peso ou sem.** Se só importa "está ligado ou não", o grafo é **sem peso**. Se cada estrada tem uma distância, ou cada voo um preço, as arestas têm **peso**, e "o caminho mais curto" passa a ser o de menor soma, não o de menos passos.

**Com ciclo ou sem.** Um **ciclo** é um caminho que volta pro começo. Uma árvore é exatamente um grafo conectado e sem ciclos. Um grafo dirigido sem ciclos (o famoso **DAG**) é o formato das dependências: se A depende de B e B depende de A, ninguém consegue instalar nada.

**Conectado ou não.** Se dá pra chegar de qualquer vértice a qualquer outro, é conectado. Senão, ele tem **componentes**, as "ilhas" isoladas.

E uma palavra a mais: o **grau** de um vértice é quantas arestas saem dele. A estação de baldeação tem grau alto.

## Lista de adjacência: o jeito padrão

Pra guardar um grafo, a forma mais usada é a **lista de adjacência**: pra cada vértice, a lista dos vizinhos. No TypeScript, um `Map` de vértice pra array:

```ts
type Grafo = Map<string, string[]>;

function criarGrafo(arestas: [string, string][], dirigido = false): Grafo {
  const g: Grafo = new Map();
  for (const [a, b] of arestas) {
    if (!g.has(a)) g.set(a, []);
    if (!g.has(b)) g.set(b, []);
    g.get(a)!.push(b);
    if (!dirigido) g.get(b)!.push(a); // não dirigido: liga nos dois sentidos
  }
  return g;
}

const metro = criarGrafo([
  ["Sé", "Liberdade"],
  ["Sé", "São Bento"],
  ["Sé", "Anhangabaú"],
  ["Sé", "Pedro II"],
  ["Anhangabaú", "República"],
  ["São Bento", "Luz"],
  ["República", "Luz"],
]);

metro.get("Sé"); // ["Liberdade", "São Bento", "Anhangabaú", "Pedro II"]
```

O bug que mais aparece está na linha comentada. Num grafo não dirigido, esquecer de registrar a aresta **nos dois sentidos** faz a Liberdade "não conhecer" a Sé, e uma busca que começa na Liberdade não chega em lugar nenhum. O outro bug é o vértice sem aresta nenhuma, que não aparece no `Map` porque só se cria vértice ao ver uma aresta. Se o problema dá a lista de vértices separada, crie todos antes.

Com peso, cada vizinho vira um par:

```ts
type GrafoPeso = Map<string, { para: string; peso: number }[]>;
```

## Matriz de adjacência: quando vale

O outro jeito é uma [[Matrizes|matriz]] n×n em que `m[i][j]` é 1 (ou o peso) se existe aresta de i pra j, e 0 se não.

```ts
//        A  B  C
const m = [
  [0, 1, 1], // A liga com B e C
  [1, 0, 0], // B liga com A
  [1, 0, 0], // C liga com A
];
m[0][2] === 1; // A e C estão ligados? O(1)
```

A vantagem é perguntar "i e j estão ligados?" em O(1). A desvantagem é a memória: ela ocupa n² sempre, mesmo que quase não haja arestas. Uma rede com 1 milhão de pessoas teria uma matriz de 1 trilhão de casas, quase todas zero. E listar os vizinhos de alguém custa O(n), percorrendo a linha toda.

A maioria dos grafos do mundo real é **esparsa** (cada vértice tem poucos vizinhos comparado ao total), e por isso a lista de adjacência é o padrão. A matriz vale pra grafos pequenos e **densos**, ou quando a pergunta "estão ligados?" é a mais frequente, como no [[Bellman-Ford e Floyd-Warshall|Floyd-Warshall]].

| | Lista de adjacência | Matriz de adjacência |
|---|---|---|
| Memória | O(V + E) | O(V²) |
| "i e j estão ligados?" | O(grau de i) | O(1) |
| Listar vizinhos de i | O(grau de i) | O(V) |
| Melhor pra | grafos esparsos (quase todos) | grafos pequenos e densos |

(V é o número de vértices, E o de arestas. Essa é a notação que você vai ver em todo lugar: a BFS custa O(V + E), por exemplo.)

## O grafo escondido no problema

A parte mais difícil de grafos não é a estrutura, é **perceber** que o problema é um grafo. O enunciado quase nunca diz "grafo". Ele diz:

- "Dada uma grade com terra e água, conte as ilhas" → cada casa é um vértice, vizinhos são arestas; ilhas são componentes.
- "Dada a lista de matérias e pré-requisitos, dá pra se formar?" → grafo dirigido; a pergunta é "tem ciclo?".
- "Transforme a palavra 'gato' em 'rato' trocando uma letra por vez" → cada palavra é um vértice; duas se ligam se diferem em uma letra; a pergunta é o caminho mais curto.

Quando um problema fala de **coisas** e **relações entre elas**, e pergunta sobre alcançar, conectar, caminhos ou dependências, pense em grafo. Aí a receita é sempre a mesma: decida quem são os vértices, quem são as arestas, monte a lista de adjacência e escolha o algoritmo.

## O essencial

1. Grafo = vértices ligados por arestas; listas e árvores são casos particulares.
2. Pergunte sempre: dirigido? com peso? pode ter ciclo? conectado?
3. Lista de adjacência (`Map<vértice, vizinhos[]>`) é o padrão: O(V + E) de memória.
4. Não dirigido: registre a aresta nos dois sentidos.
5. O difícil é enxergar o grafo no enunciado: coisas + relações + "alcançar/caminho/dependência".

## Agora é com você

Em 📦 `estruturas-do-zero/src/grafo.ts` ([[Estruturas de Dados do Zero]]), escreva uma classe `Grafo` com `adicionarVertice`, `adicionarAresta(a, b)` (com opção de dirigido), `vizinhos(v)`, `grau(v)` e `removerAresta(a, b)`. Depois monte o grafo das dependências de um projeto seu de verdade: abra o `package-lock.json` do projeto do Estágio 1 e, pra cada pacote, ligue-o às dependências dele (grafo dirigido). Imprima os 5 pacotes com mais dependentes (grau de entrada). Você vai ver de perto que o `node_modules` é um grafo, e esse grafo vai ser a entrada dos exercícios de [[DFS (Busca em Profundidade)]].

Daqui, siga pros algoritmos: [[Busca Linear]] e [[Busca Binária]], e depois [[DFS (Busca em Profundidade)]] e [[BFS (Busca em Largura)]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre grafo dirigido e não dirigido? Dê um exemplo de cada.
> No dirigido, a aresta tem sentido (seguir alguém no Instagram); no não dirigido, vale pros dois lados (amizade no Facebook, trilho de metrô).

> [!question]- O que é um DAG e onde ele aparece?
> Um grafo dirigido sem ciclos. Aparece em dependências: pacotes, pré-requisitos de matérias, etapas de um build.

> [!question]- Quando usar matriz de adjacência em vez de lista?
> Em grafos pequenos e densos, ou quando a operação principal é perguntar se dois vértices estão ligados (O(1) na matriz). Pra grafos grandes e esparsos, a matriz desperdiça O(V²) de memória.

> [!question]- Como perceber que um problema é de grafo, se o enunciado não fala em grafo?
> Quando ele fala de coisas e relações entre elas e pergunta sobre alcançar, conectar, caminhos ou dependências. Grades, palavras que viram outras, pré-requisitos.

> [!question]+ Num grafo não dirigido montado com `g.get(a)!.push(b)` pra cada aresta, uma BFS que começa em `b` não chega a lugar nenhum. Qual o bug?
> - a) A BFS precisa de pesos nas arestas
> - b) Faltou registrar a aresta no sentido contrário: `g.get(b)!.push(a)`
> - c) O `Map` não serve pra guardar grafos
> - d) `b` precisa ser o primeiro vértice inserido
>
> > [!check]- Resposta
> > **b)** Num grafo não dirigido a aresta vale nos dois sentidos, então cada uma precisa entrar na lista dos dois vértices. Do jeito que está, `b` não tem vizinho nenhum registrado.

---

## Pra consultar depois

| Termo | Significado |
|---|---|
| V, E | número de vértices, número de arestas |
| Dirigido | aresta com sentido (seta) |
| Peso | valor da aresta (distância, custo) |
| Grau | quantas arestas saem de um vértice |
| Ciclo | caminho que volta ao início |
| DAG | dirigido e sem ciclos |
| Componente | pedaço conectado do grafo |

**Pra ler e ver:** o [VisuAlgo, em estruturas de grafo](https://visualgo.net/en/graphds), deixa você desenhar um grafo e ver a lista e a matriz de adjacência se formando ao lado. O capítulo de grafos do [Hello Algo](https://www.hello-algo.com/en/chapter_graph/graph/) compara as duas representações com código em TypeScript.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

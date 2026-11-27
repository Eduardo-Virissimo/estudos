---
nivel: escrito
foco: bom saber
revisado:
---

# Árvore Geradora Mínima (Kruskal e Prim)

**Quanto focar: 💤 bom saber.** Aparece pouco fora da faculdade. Pode deixar pra depois da primeira vaga.

**Quanto tempo:** cerca de 1h30: 15 min de leitura, 5 min no Me teste e 1h15 no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

A prefeitura quer levar internet de fibra a seis bairros. Ela tem o orçamento de cada trecho possível de cabo: do Centro à Vila, R$ 40 mil; da Vila ao Jardim, R$ 25 mil; e assim por diante. Não precisa ligar todo mundo com todo mundo. Basta que **todos os bairros fiquem conectados**, direta ou indiretamente, gastando o **mínimo** possível.

Repare que isso é diferente do caminho mais curto do [[Dijkstra]]. O Dijkstra pergunta "qual o jeito mais barato de ir de A até B?". Aqui a pergunta é "qual o conjunto mais barato de cabos que conecta **todo mundo**?". A resposta é uma **árvore geradora mínima** (MST, *minimum spanning tree*): "árvore" porque não tem ciclos (um ciclo teria um cabo sobrando, que daria pra tirar), "geradora" porque alcança todos os vértices, e "mínima" porque a soma dos pesos é a menor possível.

Esta nota é aprofundamento e pode ser pulada no caminho pra primeira vaga. Os dois algoritmos clássicos, Kruskal e Prim, são lindos exemplos de algoritmo [[Greedy|guloso]] que **funciona**: escolher sempre o mais barato, sem olhar pra frente, dá a resposta ótima. Ajuda ter passado por [[Grafos]] e [[Union-Find (Disjoint Set)]].

## Kruskal: o cabo mais barato que não fecha ciclo

A ideia de Kruskal é a mais direta possível: **ordene todos os cabos do mais barato pro mais caro e vá pegando cada um, desde que ele não feche um ciclo**. Se os dois bairros já estão conectados (por outros cabos já escolhidos), esse cabo seria redundante: pule.

"Os dois já estão conectados?" é a pergunta que o [[Union-Find (Disjoint Set)]] responde em tempo praticamente constante. Por isso os dois andam sempre juntos.

```ts
type Aresta = { a: number; b: number; custo: number };

function kruskal(n: number, arestas: Aresta[]): { custo: number; escolhidas: Aresta[] } {
  const uf = new UnionFind(n);                       // da nota de Union-Find
  const escolhidas: Aresta[] = [];
  let custo = 0;

  for (const e of [...arestas].sort((x, y) => x.custo - y.custo)) {
    if (uf.unir(e.a, e.b)) {                         // false = já estavam juntos: fecharia ciclo
      escolhidas.push(e);
      custo += e.custo;
      if (escolhidas.length === n - 1) break;        // uma árvore com n vértices tem n − 1 arestas
    }
  }
  if (escolhidas.length < n - 1) throw new Error("o grafo não é conectado");
  return { custo, escolhidas };
}
```

O custo é dominado pela ordenação: **O(E log E)**. O `break` com n − 1 é um detalhe útil (toda árvore com n vértices tem exatamente n − 1 arestas, então ao chegar nisso, acabou). E o `throw` no fim cobre o caso de bairros que não têm cabo possível nenhum: não existe árvore geradora, só uma "floresta".

## Prim: crescer a partir de um ponto

Prim pensa de outro jeito, mais parecido com o Dijkstra. Comece num bairro qualquer. A cada passo, **pegue o cabo mais barato que liga a parte já conectada a um bairro ainda de fora**. A árvore vai crescendo como uma mancha, um bairro por vez.

"O cabo mais barato que sai da mancha" é trabalho pra um min-heap ([[Heap (Estrutura de Dados)]]):

```ts
type GrafoCusto = Map<number, { para: number; custo: number }[]>;

function prim(g: GrafoCusto, inicio: number): number {
  const dentro = new Set<number>();
  const heap = new Heap<[number, number]>((x, y) => x[0] - y[0]); // [custo, bairro]
  heap.inserir([0, inicio]);
  let total = 0;

  while (heap.tamanho > 0) {
    const [custo, v] = heap.extrair()!;
    if (dentro.has(v)) continue;            // já conectado por um cabo mais barato
    dentro.add(v);
    total += custo;
    for (const { para, custo: c } of g.get(v) ?? []) {
      if (!dentro.has(para)) heap.inserir([c, para]);
    }
  }
  return total;
}
```

Compare com o Dijkstra: é quase o mesmo código. A diferença está numa linha só. No Dijkstra, a prioridade é a **distância total desde a origem** (`d + peso`). No Prim, é **só o custo do cabo** (`c`), porque o que importa é o preço de ligar aquele bairro à mancha, não a distância até o ponto de partida. Confundir os dois é um erro clássico, e agora você sabe onde olhar.

O custo é O(E log V), como o Dijkstra com heap.

## Por que escolher o mais barato funciona

Algoritmos gulosos costumam falhar (a nota de [[Greedy]] tem exemplos). Por que estes dois funcionam? A razão tem um nome, a **propriedade do corte**: divida os bairros em dois grupos quaisquer. O cabo mais barato que cruza de um grupo pro outro **sempre** pode fazer parte de uma árvore mínima. Se uma árvore não o usasse, você poderia trocá-lo por algum outro cabo que cruza a mesma divisão (e é mais caro ou igual), e a árvore ficaria mais barata ou igual. Kruskal e Prim só escolhem cabos assim. Não precisa saber provar; vale saber que existe uma prova, e que é ela que separa um guloso que funciona de um que só parece funcionar.

| | Kruskal | Prim |
|---|---|---|
| Ideia | cabos do mais barato ao mais caro, sem fechar ciclo | cresce uma mancha a partir de um ponto |
| Estrutura | ordenação + Union-Find | heap |
| Custo | O(E log E) | O(E log V) |
| Melhor pra | grafos esparsos, arestas já numa lista | grafos densos, lista de adjacência |

Onde isso aparece de verdade: projeto de redes (cabos, tubulação, estradas), agrupamento de dados (rode o Kruskal e pare antes do fim: os grupos que sobram são *clusters*) e como peça de algoritmos aproximados pra problemas difíceis, como o do caixeiro-viajante.

## O essencial

1. Árvore geradora mínima: conecta todos os vértices, sem ciclos, com a menor soma de pesos.
2. Não é caminho mais curto: Dijkstra liga dois pontos, a MST liga todo mundo.
3. Kruskal: ordena as arestas e pega cada uma que não fecha ciclo (Union-Find).
4. Prim: cresce a partir de um vértice pegando a aresta mais barata que sai da mancha (heap); a prioridade é o custo da aresta, não a distância total.
5. Uma árvore com n vértices tem n − 1 arestas.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva o [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) (conectar pontos de um plano pela distância de Manhattan) duas vezes: com Kruskal e com Prim. Antes, desenhe 5 pontos no papel e ache a árvore mínima à mão com Kruskal. Depois compare as duas soluções: qual foi mais simples de escrever? Neste problema todo ponto se liga a todo ponto (grafo denso, n² arestas), e uma delas deve ser mais rápida: anote qual e por quê.

Daqui, siga pra [[Divide and Conquer]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre árvore geradora mínima e caminho mais curto?
> O caminho mais curto liga dois vértices com o menor custo; a árvore geradora mínima conecta todos os vértices com a menor soma total de arestas, sem se importar com a distância entre dois pontos específicos.

> [!question]- Por que uma árvore geradora não pode ter ciclos?
> Porque num ciclo sempre há uma aresta que pode ser removida sem desconectar ninguém; tirá-la deixa o custo menor ou igual.

> [!question]- Qual o papel do Union-Find no Kruskal?
> Responder rápido se os dois vértices de uma aresta já estão conectados; se estiverem, a aresta fecharia um ciclo e é descartada.

> [!question]- Quantas arestas tem uma árvore geradora de um grafo com n vértices?
> Exatamente n − 1.

> [!question]+ Qual a diferença, no código, entre o Prim e o Dijkstra com heap?
> - a) O Prim usa pilha, o Dijkstra usa heap
> - b) No Prim a prioridade é o custo da aresta; no Dijkstra é a distância total desde a origem
> - c) O Prim só funciona em grafos dirigidos
> - d) Não há diferença, são o mesmo algoritmo
>
> > [!check]- Resposta
> > **b)** Os dois crescem a partir de um vértice com um min-heap, mas o Dijkstra soma a distância acumulada (`d + peso`) e o Prim usa só o peso da aresta que liga o vértice novo à árvore. Essa linha muda completamente o que é calculado.

---

## Pra consultar depois

| Algoritmo | Receita em uma linha |
|---|---|
| Kruskal | ordena arestas; pega se `uf.unir(a, b)` der `true` |
| Prim | heap de `[custo da aresta, vértice]`; pula quem já está dentro |
| Fim antecipado | parou ao chegar em n − 1 arestas |

**Pra ler e ver:** o [VisuAlgo, em árvore geradora mínima](https://visualgo.net/en/mst), roda Kruskal e Prim no mesmo grafo, colorindo as arestas escolhidas. O artigo do [cp-algorithms sobre Kruskal](https://cp-algorithms.com/graph/mst_kruskal.html) traz a prova da propriedade do corte.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

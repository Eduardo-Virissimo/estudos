---
nivel: escrito
foco: bom saber
revisado:
---

# Bellman-Ford e Floyd-Warshall

**Quanto focar: 💤 bom saber.** São casos específicos de caminho mínimo. Pode deixar pra depois da primeira vaga.

O [[Dijkstra]] tem duas limitações. Ele não aceita pesos negativos, e ele responde "de **um** lugar até todos os outros". Às vezes você precisa do que ele não faz.

Pesos negativos parecem estranhos num mapa (estrada de −3 km?), mas aparecem em outros grafos. Num jogo, uma passagem que **devolve** energia. Em finanças, trocar reais por dólares, dólares por euros e euros de volta por reais: se em algum momento você terminar com mais reais do que começou, achou uma **arbitragem**, e ela aparece como um ciclo negativo num grafo de câmbio. E "de todos pra todos" aparece sempre que você precisa de uma tabela de distâncias completa, como aquelas tabelas de quilometragem entre capitais no fim dos mapas rodoviários.

Esta nota é aprofundamento e pode ser pulada no caminho pra primeira vaga. Os dois algoritmos são curtos (o Floyd-Warshall cabe em quatro linhas) e mais lentos que o Dijkstra, e esse é o preço da generalidade. Ajuda ter passado por [[Dijkstra]].

## Bellman-Ford: relaxe tudo, várias vezes

O Dijkstra é esperto: relaxa as arestas na ordem certa (sempre a partir do mais próximo) e por isso olha cada uma uma vez. O Bellman-Ford é teimoso: **relaxa todas as arestas, de novo e de novo**, até não melhorar mais nada.

Quantas vezes? Um caminho mais curto sem ciclos passa por no máximo V − 1 arestas. Na primeira rodada, ficam certas as distâncias de quem está a uma aresta da origem; na segunda, a duas; e assim por diante. Depois de V − 1 rodadas, tudo que podia ficar certo ficou.

```ts
type Aresta = { de: string; para: string; peso: number };

function bellmanFord(vertices: string[], arestas: Aresta[], origem: string) {
  const dist = new Map(vertices.map((v) => [v, Infinity]));
  dist.set(origem, 0);

  for (let rodada = 1; rodada < vertices.length; rodada++) {
    let mudou = false;
    for (const { de, para, peso } of arestas) {
      if (dist.get(de)! + peso < dist.get(para)!) {
        dist.set(para, dist.get(de)! + peso);
        mudou = true;
      }
    }
    if (!mudou) break; // rodada sem melhora: já acabou
  }

  // uma rodada a mais: se ainda melhora, há um ciclo negativo
  for (const { de, para, peso } of arestas) {
    if (dist.get(de)! + peso < dist.get(para)!) throw new Error("ciclo negativo");
  }
  return dist;
}
```

O custo é **O(V × E)**, bem mais que o Dijkstra. Em troca, ele aceita pesos negativos e faz uma coisa que o Dijkstra não faz: **detecta ciclos negativos**. Se depois das V − 1 rodadas alguma aresta ainda melhora uma distância, é porque existe um ciclo que, a cada volta, deixa tudo mais barato. Nesse caso "o caminho mais curto" nem existe (dá pra dar voltas infinitas e chegar a menos infinito), e o algoritmo avisa. É esse aviso que acha a arbitragem.

Ele também tem uma vantagem prática: limitar as rodadas a K dá o caminho mais barato **com no máximo K arestas**, que é o problema do voo mais barato com até K escalas ([Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)). Um cuidado nessa variação: em cada rodada, calcule as novas distâncias a partir de uma **cópia** da rodada anterior, senão uma rodada usa arestas demais.

## Floyd-Warshall: todos contra todos

Agora você quer a tabela completa, a distância de cada vértice pra cada vértice. Dá pra rodar o Dijkstra a partir de cada um. Ou dá pra usar uma das ideias mais elegantes da computação.

Numere os vértices de 0 a n − 1 e guarde as distâncias numa [[Matrizes|matriz]] n × n (com `Infinity` onde não há aresta e 0 na diagonal). A pergunta do algoritmo é: **"e se eu puder passar pelo vértice k no meio do caminho?"**. Pra cada k, e pra cada par (i, j), ir de i a j passando por k (`d[i][k] + d[k][j]`) é melhor do que o que eu conhecia?

```ts
function floydWarshall(d: number[][]): number[][] {
  const n = d.length;
  for (let k = 0; k < n; k++)          // k DO LADO DE FORA: "agora posso passar por k"
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
```

Três laços, **O(V³)**. Depois da rodada k = 0, a matriz tem os melhores caminhos que podem usar o vértice 0 como escala. Depois de k = 1, os que podem usar 0 e 1. No fim, os que podem usar qualquer um.

A pegadinha do Floyd-Warshall é a **ordem dos laços**. O `k` precisa ser o de fora. Se você colocar o `i` ou o `j` por fora, o algoritmo roda, não dá erro e devolve distâncias erradas, porque usa caminhos por k antes de eles estarem prontos. É o tipo de bug silencioso que só um teste pega.

E ciclos negativos? Se, no fim, algum `d[i][i]` ficar negativo, o vértice i está num ciclo negativo.

Esse algoritmo é, na verdade, [[Programação Dinâmica]]: a tabela da rodada k é construída a partir da tabela da rodada k − 1. Quando chegar naquela nota, volte aqui e veja.

## Qual usar

| Situação | Algoritmo | Custo |
|---|---|---|
| Uma origem, pesos ≥ 0 | [[Dijkstra]] | O((V + E) log V) |
| Uma origem, pesos negativos, ou detectar ciclo negativo | Bellman-Ford | O(V × E) |
| Caminho com no máximo K arestas | Bellman-Ford com K rodadas | O(K × E) |
| Todos os pares, grafo pequeno (até ~400 vértices) | Floyd-Warshall | O(V³) |
| Todos os pares, grafo grande e esparso | Dijkstra de cada vértice | O(V × (V + E) log V) |
| Sem pesos | [[BFS (Busca em Largura)\|BFS]] | O(V + E) |

## O essencial

1. Bellman-Ford relaxa todas as arestas V − 1 vezes; aceita pesos negativos; O(V × E).
2. Se uma rodada extra ainda melhora algo, existe ciclo negativo (e o caminho mais curto não existe).
3. Floyd-Warshall calcula todos os pares numa matriz: "e se eu passar por k?"; O(V³).
4. No Floyd-Warshall, o laço do `k` precisa ser o de fora.
5. Pesos ≥ 0 e uma origem: Dijkstra sempre ganha.

## Agora é com você

Monte um grafo de câmbio com quatro moedas (real, dólar, euro, libra) e taxas inventadas, em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]). O truque pra transformar "multiplicar taxas" em "somar pesos" é usar `peso = -Math.log(taxa)`: um ciclo cujo produto das taxas é maior que 1 vira um ciclo de soma negativa. Ajuste as taxas até criar uma arbitragem e veja o Bellman-Ford avisar. Depois use o Floyd-Warshall pra montar a tabela de distâncias entre 5 cidades e imprima como as tabelas dos mapas rodoviários. Bônus: troque a ordem dos laços do Floyd-Warshall e veja um resultado errado aparecer.

Daqui, siga pra [[Árvore Geradora Mínima (Kruskal e Prim)]] ou pra [[Divide and Conquer]].

---

## 🧠 Me teste

> [!question]- Por que o Bellman-Ford faz V − 1 rodadas?
> Porque um caminho mais curto sem ciclos tem no máximo V − 1 arestas, e cada rodada garante que as distâncias com uma aresta a mais fiquem corretas.

> [!question]- Como o Bellman-Ford detecta um ciclo negativo?
> Fazendo mais uma rodada depois das V − 1: se alguma aresta ainda diminui uma distância, existe um ciclo de soma negativa.

> [!question]- Qual a pergunta que o Floyd-Warshall faz pra cada k?
> "Ir de i até j passando por k é mais curto do que o melhor caminho que eu conheço?", pra todos os pares (i, j).

> [!question]- Quando o Floyd-Warshall é uma boa escolha?
> Quando se precisa da distância entre todos os pares e o grafo é pequeno (algumas centenas de vértices), já que o custo é O(V³).

> [!question]+ No Floyd-Warshall, você escreveu os laços na ordem `i`, `j`, `k` (com o `k` por dentro). O que acontece?
> - a) Dá erro de índice
> - b) Funciona igual, a ordem dos laços não importa
> - c) Fica mais rápido
> - d) Roda sem erro, mas pode devolver distâncias erradas
>
> > [!check]- Resposta
> > **d)** O algoritmo depende de, na rodada k, todos os caminhos que usam os vértices de 0 a k − 1 já estarem prontos. Com o `k` por dentro, isso não vale, e algumas distâncias ficam maiores do que deviam, sem erro nenhum.

---

## Pra consultar depois

| | Bellman-Ford | Floyd-Warshall |
|---|---|---|
| Responde | uma origem → todos | todos → todos |
| Pesos negativos | sim | sim |
| Detecta ciclo negativo | rodada extra | `d[i][i] < 0` |
| Custo | O(V × E) | O(V³) |

**Pra ler e ver:** o [VisuAlgo, em caminho mínimo](https://visualgo.net/en/sssp), roda o Bellman-Ford rodada por rodada. Os artigos do cp-algorithms sobre [Bellman-Ford](https://cp-algorithms.com/graph/bellman_ford.html) e [Floyd-Warshall](https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html) têm as provas e as variações, pra quem quiser ir fundo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

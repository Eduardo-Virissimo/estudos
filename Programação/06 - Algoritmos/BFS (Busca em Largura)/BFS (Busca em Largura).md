---
nivel: escrito
foco: importante
revisado:
---

# BFS (Busca em Largura)

**Quanto focar: 📌 importante.** É o jeito de achar o menor caminho sem peso e cai bastante em entrevista. Entenda e pratique.

Jogue uma pedra num lago parado. A onda sai em círculo: primeiro atinge tudo que está a um palmo, depois tudo a dois palmos, depois a três. Ela nunca chega a algo distante antes de passar por tudo que está mais perto. Agora a pergunta: qual o caminho **mais curto** da pedra até uma folha boiando? É o caminho que a primeira onda a tocar a folha percorreu.

Isso é a **BFS** (*breadth-first search*, busca em largura): explore um [[Grafos|grafo]] em camadas, primeiro todos os vizinhos do início, depois os vizinhos dos vizinhos, e assim por diante. A [[DFS (Busca em Profundidade)|DFS]] mergulha fundo num caminho; a BFS se espalha por igual. E essa diferença dá a ela um poder que a DFS não tem: **a primeira vez que a BFS chega num vértice, ela chegou pelo caminho com menos passos.** Menor número de estações de metrô, menor número de movimentos num labirinto, os "seis graus de separação" entre duas pessoas: tudo isso é BFS.

Se você leu a nota da DFS, já sabe quase tudo. A BFS é o mesmo algoritmo com uma [[Filas|fila]] no lugar da pilha.

## Uma fila e um Set

```ts
type Grafo = Map<string, string[]>;

function bfs(g: Grafo, inicio: string): Map<string, number> {
  const distancia = new Map<string, number>([[inicio, 0]]); // também serve de "visitados"
  const fila = [inicio];
  let i = 0;                                  // índice de início: nada de shift

  while (i < fila.length) {
    const v = fila[i++];
    for (const viz of g.get(v) ?? []) {
      if (!distancia.has(viz)) {              // primeira vez que alguém chega nele
        distancia.set(viz, distancia.get(v)! + 1);
        fila.push(viz);
      }
    }
  }
  return distancia;
}
```

Três detalhes, e cada um evita um bug clássico.

O `Map` de **distância** faz dois papéis: guarda a resposta (quantos passos até cada vértice) e serve de "visitados" (se já tem distância, já foi descoberto). Uma estrutura a menos.

A marcação acontece **na hora de pôr na fila**, não na hora de tirar. Se você marcar só ao tirar, o mesmo vértice pode entrar na fila várias vezes (descoberto por vários vizinhos antes de ser processado), e num grafo denso a fila explode. Essa é a pegadinha número um da BFS: **marque ao enfileirar**.

E o `let i = 0` com `fila[i++]`, em vez de `fila.shift()`. Você já sabe por quê ([[Filas]]): `shift` é O(n), e uma BFS num grafo grande com `shift` fica O(V²).

O custo, como na DFS, é **O(V + E)**.

## Por que a primeira chegada é a mais curta

Pense na fila como camadas. Primeiro saem todos os vértices a distância 0 (só o início). Eles colocam na fila todos os de distância 1. Esses saem e colocam os de distância 2. A fila **nunca** processa um vértice de distância 3 antes de terminar todos os de distância 2, porque eles entraram depois. Então, quando um vértice é descoberto pela primeira vez, não existe caminho mais curto até ele: se existisse, ele teria sido descoberto numa camada anterior.

Isso só vale se todas as arestas "custam" o mesmo (um passo). Se cada aresta tem um peso diferente (quilômetros, minutos), menos passos não significa menor distância, e aí você precisa do [[Dijkstra]].

## O caminho, não só a distância

Saber que o Butantã está a 9 estações da Sé é bom; saber **quais** são as estações é melhor. Pra reconstruir o caminho, guarde de onde cada vértice foi descoberto, o "pai" dele. No fim, volte do destino até o início seguindo os pais:

```ts
function caminhoMaisCurto(g: Grafo, de: string, para: string): string[] | null {
  const pai = new Map<string, string | null>([[de, null]]);
  const fila = [de];
  let i = 0;
  while (i < fila.length) {
    const v = fila[i++];
    if (v === para) break;                       // chegou: pode parar cedo
    for (const viz of g.get(v) ?? []) {
      if (!pai.has(viz)) { pai.set(viz, v); fila.push(viz); }
    }
  }
  if (!pai.has(para)) return null;               // inalcançável

  const caminho: string[] = [];
  for (let v: string | null = para; v !== null; v = pai.get(v)!) caminho.push(v);
  return caminho.reverse();                      // montou de trás pra frente
}
```

Esse "mapa de pais" é uma técnica que volta no Dijkstra e em qualquer algoritmo de caminho. Guarde o formato.

## O labirinto: BFS na grade

Num labirinto de [[Matrizes|grade]], cada casa livre é um vértice e as vizinhas são as arestas. Não precisa nem montar o grafo: a função de vizinhos faz o papel da lista de adjacência.

```ts
function passosNoLabirinto(mapa: string[][], inicio: [number, number], fim: [number, number]): number {
  const L = mapa.length, C = mapa[0].length;
  const dist = Array.from({ length: L }, () => Array(C).fill(-1)); // -1 = não visitado
  const fila: [number, number][] = [inicio];
  dist[inicio[0]][inicio[1]] = 0;
  let i = 0;
  while (i < fila.length) {
    const [l, c] = fila[i++];
    if (l === fim[0] && c === fim[1]) return dist[l][c];
    for (const [dl, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nl = l + dl, nc = c + dc;
      if (nl >= 0 && nl < L && nc >= 0 && nc < C && mapa[nl][nc] === "." && dist[nl][nc] === -1) {
        dist[nl][nc] = dist[l][c] + 1;
        fila.push([nl, nc]);
      }
    }
  }
  return -1; // sem saída
}
```

É assim que inimigos de jogo acham o caminho até você (em jogos maiores, com o A*, que é uma BFS com "faro" pra direção do alvo). E um truque útil: **BFS com várias origens**. Se você puser **várias** casas na fila no começo, todas com distância 0, a BFS calcula a distância de cada casa até a origem mais próxima. "Quanto tempo até o fogo chegar em cada sala, se começou em três lugares?" é uma BFS só.

## DFS ou BFS?

| Pergunta | Use |
|---|---|
| Menor número de passos | **BFS** |
| Alcança ou não? Contar componentes | qualquer uma (DFS costuma ser mais curta de escrever) |
| Tem ciclo? Ordem topológica | **DFS** |
| Explorar todas as combinações | DFS ([[Backtracking]]) |
| Grafo muito largo (muitos vizinhos por vértice) | DFS gasta menos memória |
| Grafo muito fundo | BFS não estoura a pilha |

## O essencial

1. BFS explora em camadas, com uma fila: primeiro os vizinhos, depois os vizinhos dos vizinhos.
2. Num grafo sem pesos, a primeira chegada a um vértice é pelo caminho com menos passos.
3. Marque como visitado **ao enfileirar**, não ao tirar; e não use `shift`.
4. Guarde o pai de cada vértice pra reconstruir o caminho de trás pra frente.
5. Com pesos diferentes nas arestas, BFS não serve: use Dijkstra.

## Agora é com você

Adicione `bfs` e `caminhoMaisCurto` à sua classe `Grafo` em 📦 `estruturas-do-zero/src/grafo.ts` ([[Estruturas de Dados do Zero]]), e monte uma parte do metrô de São Paulo (umas 20 estações, de pelo menos duas linhas) pra descobrir o caminho com menos estações entre duas delas. Depois resolva o [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/), que é a BFS com várias origens, e o [Word Ladder](https://leetcode.com/problems/word-ladder/), em que o grafo está escondido (cada palavra é um vértice, ligado às que diferem em uma letra). No Word Ladder, escreva antes de codar quem são os vértices e as arestas. Terminou quando os dois passam e cada um tem o Big-O no topo.

Daqui, siga pra [[Dijkstra]].

---

## 🧠 Me teste

> [!question]- Qual a diferença essencial entre BFS e DFS no código?
> A estrutura que guarda os vértices a visitar: BFS usa fila (o primeiro descoberto sai primeiro), DFS usa pilha ou recursão (o último descoberto sai primeiro).

> [!question]- Por que a BFS acha o caminho com menos passos?
> Porque processa os vértices em camadas de distância crescente; quando um vértice é descoberto pela primeira vez, todos os de distância menor já foram processados, então não existe caminho mais curto até ele.

> [!question]- Por que marcar como visitado ao enfileirar, e não ao desenfileirar?
> Porque, se marcar só ao tirar, o mesmo vértice pode ser posto na fila várias vezes por vizinhos diferentes antes de ser processado, desperdiçando tempo e memória.

> [!question]- Como reconstruir o caminho mais curto, e não só a distância?
> Guardando, pra cada vértice, de qual vértice ele foi descoberto (o pai). No fim, segue os pais do destino até a origem e inverte a lista.

> [!question]+ Num mapa de estradas com distâncias em km, a BFS devolve o caminho com menos estradas. Esse é o caminho mais curto em km?
> - a) Não necessariamente: com pesos, menos arestas não significa menor soma; é caso de Dijkstra
> - b) Sim, BFS sempre acha o caminho mais curto
> - c) Sim, desde que o grafo não tenha ciclos
> - d) Só se o grafo for dirigido
>
> > [!check]- Resposta
> > **a)** A BFS minimiza o número de arestas, não a soma dos pesos. Duas estradas de 10 km são mais curtas que uma de 50 km, mas a BFS escolheria a de 50. Quem respondeu b) esqueceu que a garantia da BFS é só pra grafos sem pesos (ou com todos os pesos iguais).

---

## Pra consultar depois

```ts
const dist = new Map([[inicio, 0]]);
const fila = [inicio];
for (let i = 0; i < fila.length; i++) {
  const v = fila[i];
  for (const viz of g.get(v) ?? []) {
    if (!dist.has(viz)) { dist.set(viz, dist.get(v)! + 1); fila.push(viz); }
  }
}
```

**Pra ler e ver:** a [introdução a busca em grafos da Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) mostra a "onda" da BFS se espalhando numa grade, com o mapa de pais desenhado em setas, e depois evolui pro Dijkstra e o A*: é leitura obrigatória. O [VisuAlgo, em DFS e BFS](https://visualgo.net/en/dfsbfs), anima a fila passo a passo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

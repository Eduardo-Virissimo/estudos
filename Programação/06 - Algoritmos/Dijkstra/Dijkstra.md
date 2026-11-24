---
nivel: escrito
foco: bom saber
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Dijkstra

**Quanto focar: 💤 bom saber.** Importante na teoria, mas raro no dia a dia de web e em entrevista de júnior. Entenda a ideia; implementar pode esperar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Você abre o GPS pra ir de casa até a faculdade. Existe a rota pela avenida, com 3 trechos longos, e a rota pelo bairro, com 7 trechos curtinhos. A [[BFS (Busca em Largura)|BFS]] escolheria a avenida, porque tem menos trechos. Mas o GPS quer a de **menor distância total**, e talvez os 7 trechos curtos somem menos que os 3 longos. Quando cada aresta tem um **peso** (quilômetros, minutos, reais), "menos passos" deixa de ser "mais perto", e a BFS não serve mais.

O algoritmo que resolve isso foi inventado por Edsger Dijkstra em 1956, em vinte minutos, sentado num café em Amsterdã, sem papel. Ele acha o caminho de menor custo de um ponto até todos os outros, num grafo em que os pesos não são negativos. É a base de GPS, roteamento de pacotes na internet e IA de jogos. E a ideia é tão natural quanto a da BFS: **sempre expanda o lugar mais próximo que você ainda não fechou**.

Ajuda ter passado por [[Grafos]], [[BFS (Busca em Largura)]] e [[Heap (Estrutura de Dados)]].

## A ideia: fechar o mais próximo

Imagine as cidades e as estradas com as distâncias:

```text
        4
   A ───────── B
   │ \         │
 1 │   \ 2     │ 1
   │     \     │
   C ───── D ──┘
       5
```

Saindo de A. No começo, você só sabe que A está a 0, e o resto está a "infinito" (ainda não sabe chegar). Agora repita:

1. Pegue a cidade **ainda não fechada** com a menor distância conhecida. Essa distância é **definitiva**: feche ela.
2. Pra cada vizinha dela, veja se passar por ela dá um caminho mais curto do que o que você conhecia. Se der, atualize (isso se chama **relaxar** a aresta).

```text
fecha A (0):   B = 4,  C = 1,  D = 2
fecha C (1):   D via C = 1 + 5 = 6, mas já tinha 2: não muda
fecha D (2):   B via D = 2 + 1 = 3, melhor que 4: B = 3
fecha B (3):   fim
```

Repare no B: a primeira estimativa foi 4 (a estrada direta), mas depois apareceu um caminho melhor por D, com 3. Por isso só se **fecha** uma cidade quando ela é a menor de todas as abertas: nesse momento, não existe jeito de chegar nela mais barato, porque qualquer outro caminho passaria por uma cidade aberta que já está mais longe.

E é aqui que entra a única restrição do Dijkstra. Esse argumento só funciona se **nenhum peso for negativo**. Com uma aresta negativa, um caminho longo poderia "descontar" distância e terminar mais barato que uma cidade já fechada. Pra isso existe o [[Bellman-Ford e Floyd-Warshall|Bellman-Ford]].

## O código com uma fila de prioridade

"Pegue a não fechada com a menor distância" é exatamente o que um min-heap faz bem ([[Heap (Estrutura de Dados)]]). Cada vez que uma distância melhora, você põe o par (distância, cidade) no heap. Ao tirar, se a cidade já foi fechada, é uma entrada velha: ignore.

```ts
type GrafoPeso = Map<string, { para: string; peso: number }[]>;

function dijkstra(g: GrafoPeso, origem: string) {
  const dist = new Map<string, number>([[origem, 0]]);
  const pai = new Map<string, string>();
  const fechados = new Set<string>();
  const heap = new Heap<[number, string]>((a, b) => a[0] - b[0]); // o seu Heap genérico

  heap.inserir([0, origem]);
  while (heap.tamanho > 0) {
    const [d, v] = heap.extrair()!;
    if (fechados.has(v)) continue;            // entrada velha: já fechei com distância menor
    fechados.add(v);

    for (const { para, peso } of g.get(v) ?? []) {
      const nova = d + peso;
      if (nova < (dist.get(para) ?? Infinity)) { // relaxar: achei um caminho melhor
        dist.set(para, nova);
        pai.set(para, v);
        heap.inserir([nova, para]);
      }
    }
  }
  return { dist, pai };
}
```

O `pai` funciona igual ao da BFS: pra montar a rota, volte do destino até a origem seguindo os pais e inverta.

O `if (fechados.has(v)) continue` é a linha que todo mundo esquece. Como a mesma cidade pode entrar no heap várias vezes (cada vez que a distância dela melhora), sem esse `if` você processaria cidades já fechadas de novo. O resultado continua certo, mas o algoritmo fica bem mais lento.

O custo, com heap, é **O((V + E) log V)**: cada aresta pode gerar uma inserção no heap, e cada operação de heap custa log.

## Sem heap, pra grafos pequenos

O JavaScript não tem heap pronto. Se você ainda não fez o seu, ou o grafo é pequeno (umas centenas de vértices), dá pra achar a menor distância aberta com um laço comum. Fica O(V²), mas é mais curto e perfeitamente bom pra exercício:

```ts
// em vez do heap: a cada volta, procura a menor aberta
let v: string | null = null;
for (const [cidade, d] of dist) {
  if (!fechados.has(cidade) && (v === null || d < dist.get(v)!)) v = cidade;
}
if (v === null) break; // nenhuma aberta alcançável: acabou
```

## Onde o Dijkstra aparece disfarçado

Como na BFS, o difícil é reconhecer. Sinais de Dijkstra: o problema tem **lugares**, **ligações com custo** (tempo, dinheiro, esforço), e pergunta o **menor custo total**. Alguns disfarces comuns:

- "Quanto tempo até o sinal chegar em todos os computadores da rede?" ([Network Delay Time](https://leetcode.com/problems/network-delay-time/)): a resposta é a maior das menores distâncias.
- "Numa grade em que cada casa tem um custo de atravessar, qual o caminho mais barato?": cada casa é um vértice, o peso é o custo da casa de destino.
- "Qual o voo mais barato com até K escalas?": um Dijkstra (ou Bellman-Ford) em que o estado é (cidade, escalas usadas).

E quando o GPS precisa ser ainda mais rápido, entra o **A\***, que é um Dijkstra que prefere expandir as cidades que estão na direção do destino, usando uma estimativa (a distância em linha reta). A [Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) mostra os três lado a lado.

## O essencial

1. Dijkstra acha o caminho de menor custo total quando as arestas têm pesos não negativos.
2. Sempre feche a cidade aberta mais próxima; a distância dela é definitiva.
3. Relaxar: se `dist[v] + peso < dist[vizinho]`, atualize e guarde o pai.
4. Com min-heap, O((V + E) log V); ignore entradas velhas com o Set de fechados.
5. Pesos negativos quebram o Dijkstra: use Bellman-Ford.

## Agora é com você

Use o seu `Heap<T>` genérico da nota de [[Heap (Estrutura de Dados)]] pra adicionar `dijkstra` à classe `Grafo` em 📦 `estruturas-do-zero/src/grafo.ts` ([[Estruturas de Dados do Zero]]), com uma função `rota(de, para)` que devolve o caminho e o custo total. Teste com o grafo das quatro cidades desta nota (de A até B tem que dar 3, passando por D) e depois monte um mapa de 8 a 10 lugares da sua cidade com os tempos de deslocamento em minutos. Em seguida, resolva o [Network Delay Time](https://leetcode.com/problems/network-delay-time/) e anote o Big-O. Terminou quando o seu teste prova que o Dijkstra escolhe o caminho mais longo em trechos e mais curto em minutos.

Daqui, siga pra [[Bellman-Ford e Floyd-Warshall]] (aprofundamento) ou direto pra [[Divide and Conquer]].

---

## 🧠 Me teste

> [!question]- Por que a BFS não serve pra caminhos em grafos com pesos?
> Porque a BFS minimiza o número de arestas, não a soma dos pesos; um caminho com mais arestas pode ser mais barato.

> [!question]- O que significa "relaxar" uma aresta?
> Verificar se chegar ao vizinho passando pelo vértice atual é mais barato do que a melhor distância conhecida até ele; se for, atualizar a distância e o pai.

> [!question]- Por que, ao tirar uma cidade do heap, é preciso conferir se ela já foi fechada?
> Porque a mesma cidade pode ser inserida várias vezes no heap, uma pra cada vez que a distância dela melhorou; as entradas antigas, com distâncias maiores, devem ser ignoradas.

> [!question]- Por que a distância de uma cidade é definitiva quando ela é a menor das abertas?
> Porque qualquer outro caminho até ela passaria por alguma cidade aberta, que já está a uma distância maior ou igual; com pesos não negativos, esse caminho não pode ficar mais barato.

> [!question]+ Em que situação o Dijkstra pode dar uma resposta errada?
> - a) Quando o grafo tem ciclos
> - b) Quando o grafo é dirigido
> - c) Quando há arestas com peso negativo
> - d) Quando há mais de um caminho com o mesmo custo
>
> > [!check]- Resposta
> > **c)** Com peso negativo, um caminho que passa por uma aresta negativa pode ficar mais barato depois que uma cidade já foi fechada, e o Dijkstra nunca a revisita. Ciclos, grafos dirigidos e empates não são problema.

---

## Pra consultar depois

| Versão | Custo | Use quando |
|---|---|---|
| Com min-heap | O((V + E) log V) | grafos grandes e esparsos |
| Com laço (sem heap) | O(V²) | grafos pequenos ou densos |
| A* | depende da estimativa | sabe a direção do destino (mapas, jogos) |

**Pra ler e ver:** a [introdução ao A* da Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) mostra BFS, Dijkstra e A* lado a lado numa grade com custos, e é a melhor explicação visual que existe. O [VisuAlgo, em caminho mínimo](https://visualgo.net/en/sssp), roda o Dijkstra passo a passo, inclusive num grafo com aresta negativa pra você ver ele errar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

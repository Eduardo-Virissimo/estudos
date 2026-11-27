---
nivel: escrito
foco: importante
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# DFS (Busca em Profundidade)

**Quanto focar: 📌 importante.** Aparece em árvores, grafos e backtracking, e cai bastante em entrevista. Entenda e pratique.

**Quanto tempo:** cerca de 1h45: 20 min de leitura, 5 min no Me teste e 1h15 no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Existe um truque antigo pra sair de qualquer labirinto: encoste a mão direita na parede e nunca solte. Você vai entrar em corredores sem saída, mas sempre volta e tenta o próximo. Uma versão mais esperta desse truque, com giz pra marcar por onde já passou, é exatamente o algoritmo desta nota: **vá o mais fundo que conseguir por um caminho; quando não der mais, volte até a última bifurcação e tente o caminho seguinte**.

Isso é a **DFS** (*depth-first search*, busca em profundidade). Ela é uma das duas formas fundamentais de andar por um [[Grafos|grafo]] (a outra é a [[BFS (Busca em Largura)|BFS]]), e responde perguntas como: dá pra chegar de A até B? Quantas "ilhas" separadas existem? Este grafo tem ciclo? Em que ordem instalar estas dependências? Você já usou a DFS sem esse nome: as travessias pré, em e pós-ordem da [[Árvore Binária]], e o `contarArquivos` das pastas na [[Recursão]], são DFS em árvores.

A diferença agora é que grafos podem ter **ciclos**, e é aí que entra o giz.

## O giz: o Set de visitados

Numa árvore, descer pelos filhos sempre termina, porque não tem como voltar pra cima. Num grafo, A pode ligar com B, que liga com C, que liga de volta com A. Uma DFS sem memória andaria A → B → C → A → B → ... até estourar a pilha.

O giz é um [[Set]] de visitados. Antes de entrar num vértice, você confere se já passou por ele:

```ts
type Grafo = Map<string, string[]>;

function dfs(g: Grafo, inicio: string, visitados = new Set<string>()): Set<string> {
  if (visitados.has(inicio)) return visitados; // já marquei com giz: não entro
  visitados.add(inicio);
  for (const vizinho of g.get(inicio) ?? []) {
    dfs(g, vizinho, visitados);                // vai fundo por este caminho
  }
  return visitados;                            // a volta acontece sozinha, quando o for acaba
}
```

O `for` dentro da recursão é o que faz ela ser "em profundidade": antes de olhar o segundo vizinho de `inicio`, ela vai até o fim do caminho que começa no primeiro. E a "volta até a última bifurcação" é só a recursão retornando.

O custo: cada vértice é visitado uma vez (graças ao Set) e cada aresta é olhada uma vez (ou duas, se o grafo não é dirigido). Total: **O(V + E)**. Esse é o custo de qualquer coisa que precisa "olhar o grafo inteiro", e é o melhor possível.

## Versão com pilha, sem recursão

Como toda recursão, a DFS pode ser escrita com uma [[Pilhas|pilha]] explícita. Isso importa num grafo muito fundo (uma corrente de 100 mil vértices estoura a call stack):

```ts
function dfsIterativa(g: Grafo, inicio: string): string[] {
  const ordem: string[] = [];
  const visitados = new Set<string>();
  const pilha = [inicio];
  while (pilha.length > 0) {
    const v = pilha.pop()!;
    if (visitados.has(v)) continue;
    visitados.add(v);
    ordem.push(v);
    for (const viz of g.get(v) ?? []) {
      if (!visitados.has(viz)) pilha.push(viz);
    }
  }
  return ordem;
}
```

A ordem de visita pode sair um pouco diferente da recursiva (a pilha tira o **último** vizinho primeiro), mas continua sendo profundidade primeiro. E repare: se trocar a pilha por uma [[Filas|fila]], esse mesmo código vira uma BFS. Essa é a diferença inteira entre as duas.

## Contar ilhas: a DFS na grade

O exercício mais clássico de DFS, e talvez o mais cobrado em entrevista. Uma grade de `"1"` (terra) e `"0"` (água): quantas ilhas existem? Cada ilha é um grupo de terras ligadas na horizontal ou vertical.

A ideia: percorra a grade. Quando achar uma terra que ainda não foi visitada, você achou uma ilha nova; conte e rode uma DFS a partir dali que "afunda" (marca como visitada) a ilha inteira, pra não contá-la de novo.

```ts
function contarIlhas(grade: string[][]): number {
  const L = grade.length, C = grade[0]?.length ?? 0;
  let ilhas = 0;

  function afundar(l: number, c: number): void {
    if (l < 0 || l >= L || c < 0 || c >= C) return; // fora do mapa
    if (grade[l][c] !== "1") return;                // água ou já afundada
    grade[l][c] = "0";                              // marca: o giz é a própria grade
    afundar(l + 1, c); afundar(l - 1, c);
    afundar(l, c + 1); afundar(l, c - 1);
  }

  for (let l = 0; l < L; l++) {
    for (let c = 0; c < C; c++) {
      if (grade[l][c] === "1") { ilhas++; afundar(l, c); }
    }
  }
  return ilhas;
}
```

Aqui o "Set de visitados" é a própria grade: trocar `"1"` por `"0"` marca a casa. É um truque comum, mas ele **altera a entrada**, então deixe isso claro, ou copie a grade antes. E repare na conferência da borda **antes** de ler a casa, como em [[Matrizes]].

Esse padrão (percorra tudo; ao achar algo não visitado, conte e rode uma busca que marca o grupo inteiro) conta **componentes** em qualquer grafo: grupos de amigos, redes isoladas, regiões de uma imagem (o "balde de tinta" do Paint é isso).

## Ciclos e a ordem das dependências

Duas aplicações em grafos dirigidos aparecem muito em sistemas de verdade.

**Tem ciclo?** As matérias da faculdade: Cálculo 2 exige Cálculo 1, que exige... Cálculo 2? Então ninguém se forma. Pra detectar isso, a DFS usa **três estados** em vez de dois: não visitado, **em andamento** (está na pilha de chamadas agora) e concluído. Se, descendo, você encontra um vértice **em andamento**, voltou pra alguém que ainda está esperando por você: é um ciclo.

**Em que ordem fazer?** Se não há ciclo, existe uma ordem em que cada coisa vem depois das suas dependências: a **ordenação topológica**. Ela sai de graça da DFS: quando um vértice **termina** (todos os seus dependentes foram processados), adicione-o a uma lista. A lista invertida é a ordem. É assim que o `npm` decide a ordem de instalação, que ferramentas de build decidem o que compilar primeiro, e que planilhas decidem a ordem de recalcular as células.

```ts
function ordemTopologica(g: Grafo): string[] {
  const estado = new Map<string, "andamento" | "feito">();
  const ordem: string[] = [];

  function visitar(v: string): void {
    if (estado.get(v) === "feito") return;
    if (estado.get(v) === "andamento") throw new Error(`ciclo passando por ${v}`);
    estado.set(v, "andamento");
    for (const dep of g.get(v) ?? []) visitar(dep);
    estado.set(v, "feito");
    ordem.push(v);                    // só entra depois de todas as dependências
  }

  for (const v of g.keys()) visitar(v);
  return ordem;                        // aresta v → dep: dependências primeiro
}
```

Com as arestas no sentido "v depende de dep", a lista já sai na ordem de execução, dependências primeiro.

## O essencial

1. DFS vai o mais fundo possível por um caminho e volta quando não dá mais.
2. Em grafos, sempre um Set de visitados; sem ele, ciclos viram laço infinito.
3. Custo O(V + E); recursiva, ou iterativa com pilha (pra grafos muito fundos).
4. Contar componentes: ao achar algo não visitado, conte e rode uma DFS que marca o grupo todo.
5. Com três estados, detecta ciclo; a ordem em que os vértices terminam dá a ordenação topológica.

## Agora é com você

Adicione `dfs` e `ordemTopologica` à sua classe `Grafo` em 📦 `estruturas-do-zero/src/grafo.ts` ([[Estruturas de Dados do Zero]]). Use o grafo de dependências do `package-lock.json` que você montou na nota de [[Grafos]] e imprima uma ordem válida de instalação (as dependências antes de quem depende delas). Depois resolva no LeetCode o [Number of Islands](https://leetcode.com/problems/number-of-islands/) e o [Course Schedule](https://leetcode.com/problems/course-schedule/) (dá pra fazer todas as matérias?), cada um com o Big-O no topo. Terminou quando o Course Schedule detecta o ciclo de um exemplo que você inventou.

Daqui, siga pra [[BFS (Busca em Largura)]].

---

## 🧠 Me teste

> [!question]- Por que a DFS num grafo precisa de um conjunto de visitados, e numa árvore não?
> Porque grafos podem ter ciclos; sem marcar os visitados, a busca volta a vértices já vistos e roda pra sempre. Numa árvore, descer pelos filhos nunca volta ao início.

> [!question]- Qual o custo da DFS e por quê?
> O(V + E): cada vértice é visitado uma vez e cada aresta é examinada uma vez (duas em grafos não dirigidos).

> [!question]- Como contar componentes (ilhas) com DFS?
> Percorrer todos os vértices; ao encontrar um ainda não visitado, somar 1 e rodar uma DFS a partir dele que marca todo o componente como visitado.

> [!question]- Como a DFS detecta um ciclo num grafo dirigido?
> Com três estados (não visitado, em andamento, concluído): encontrar um vértice "em andamento" durante a descida significa voltar a quem ainda está na pilha, ou seja, um ciclo.

> [!question]+ Você escreveu a DFS iterativa com uma pilha, e trocou a pilha por uma fila. O que o algoritmo passa a ser?
> - a) Continua sendo DFS
> - b) Passa a ser BFS, explorando por níveis
> - c) Passa a ser Dijkstra
> - d) Para de funcionar, porque DFS exige pilha
>
> > [!check]- Resposta
> > **b)** A estrutura que guarda "o que falta visitar" define a ordem: pilha (o último descoberto primeiro) dá profundidade; fila (o primeiro descoberto primeiro) dá largura. O Dijkstra usaria uma fila de prioridade, que é um heap.

---

## Pra consultar depois

| Uso | Ideia |
|---|---|
| Alcançável? | DFS a partir de A; B está nos visitados? |
| Componentes / ilhas | pra cada não visitado: conta++ e DFS |
| Ciclo (dirigido) | três estados; achou "em andamento" = ciclo |
| Ordem topológica | adiciona o vértice quando ele termina |
| Grafo muito fundo | versão iterativa com pilha |

**Pra ler e ver:** o [VisuAlgo, em DFS e BFS](https://visualgo.net/en/dfsbfs), roda a DFS num grafo que você desenha, mostrando a pilha e os estados de cada vértice. A [introdução a busca em grafos da Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) é uma das explicações interativas mais bonitas sobre busca em grafos e grades; ela foca na BFS, mas é a melhor ponte entre as duas notas.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

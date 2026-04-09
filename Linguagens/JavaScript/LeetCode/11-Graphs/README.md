# Graphs

## O que e

Grafo e um conjunto de:

- vertices (nos)
- arestas (conexoes)

Pode ser:

- direcionado (A -> B)
- nao direcionado (A <-> B)

## Intuicao

Rede social e um grafo:

- pessoa = vertice
- amizade = aresta

## Representacao mais usada

Lista de adjacencia:

- para cada no, guardamos vizinhos

## Dois jeitos de percorrer

- BFS (fila): visita por camadas
- DFS (recursao/pilha): vai fundo e volta

## Complexidade sem misterio

Com V vertices e E arestas:

- BFS/DFS: O(V + E)
- Espaco: O(V)

## Exemplo explicado

`js
function countComponents(n, edges) {
  const graph = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const seen = new Set();
  let components = 0;

  function dfs(node) {
    seen.add(node);

    for (const nei of graph[node]) {
      if (!seen.has(nei)) dfs(nei);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!seen.has(i)) {
      components++;
      dfs(i);
    }
  }

  return components;
}
`

Ideia principal:

- cada DFS marca uma componente inteira
- toda vez que achar no nao visitado, comeca nova componente

## Erros comuns de iniciante

- Esquecer estrutura de visitados.
- Marcar visitado tarde e repetir trabalho.
- Confundir regra de grafo direcionado e nao direcionado.

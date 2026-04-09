# Graphs

Boa escolha. Graphs e um dos temas mais cobrados em entrevistas.

## O que e Grafo?

Grafo tem:

- vertices (nos)
- arestas (conexoes)

Pode ser direcionado ou nao direcionado.

## Como pensar

Quase tudo em grafos vira DFS ou BFS.

- DFS: vai fundo no caminho
- BFS: anda por camadas

## Exemplo em JavaScript

~~~js
function countComponents(n, edges) {
  const g = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }

  const seen = new Set();
  let comp = 0;

  function dfs(u) {
    seen.add(u);
    for (const v of g[u]) {
      if (!seen.has(v)) dfs(v);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!seen.has(i)) {
      comp++;
      dfs(i);
    }
  }

  return comp;
}
~~~

## Complexidade rapida

- DFS/BFS: O(V + E)
- Espaco: O(V)

## Problemas para praticar (ordem sugerida)

1. Number of Islands - #200
2. Clone Graph - #133
3. Course Schedule - #207

# Graphs

## Visao geral

Grafo modela relacoes entre entidades: vertices e arestas.
Pode ser direcionado ou nao direcionado, ponderado ou nao.

## Como funciona

Representacao mais comum em entrevistas: lista de adjacencia.

Travessias principais:

- BFS: explora por camadas (fila)
- DFS: aprofunda caminho (recursao ou pilha)

## Complexidade tipica

Com V vertices e E arestas:

- BFS/DFS: O(V + E)
- Espaco: O(V)

## Quando usar

- componentes conectados
- deteccao de ciclo
- caminho minimo em grafo nao ponderado
- matriz/grade tratada como grafo implicito

## Erros comuns

- esquecer conjunto de visitados
- marcar visitado tarde demais
- misturar regras de grafo direcionado e nao direcionado

## Exemplo em JavaScript

```js
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
```

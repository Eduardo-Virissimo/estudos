# Trees

## O que e

Tree (arvore) e uma estrutura hierarquica de nos.
Em Binary Tree, cada no pode ter ate 2 filhos: left e right.

## Intuicao

Uma arvore grande e varias subarvores menores.
Por isso recursao combina muito com tree.

## Formas de percorrer

- DFS Preorder: raiz -> esquerda -> direita
- DFS Inorder: esquerda -> raiz -> direita
- DFS Postorder: esquerda -> direita -> raiz
- BFS: por niveis com fila

## Complexidade sem misterio

- Visitar tudo: O(n)
- Espaco: depende da altura (pilha de recursao/fila)

## Exemplo explicado

`js
function maxDepth(root) {
  if (!root) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return 1 + Math.max(leftDepth, rightDepth);
}
`

Leitura mental:

- se no nao existe, profundidade 0
- profundidade atual = 1 + maior profundidade dos filhos

## Erros comuns de iniciante

- Esquecer caso base null.
- Confundir DFS com BFS.
- Nao desenhar arvore no papel antes de codar.

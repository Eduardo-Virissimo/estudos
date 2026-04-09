# Trees

## Visao geral

Arvore conecta nos em hierarquia sem ciclos (na forma classica de Binary Tree).
Cada no pode ter filhos, e traversal define a ordem da visita.

## Como funciona

Travessias comuns:

- DFS Preorder: raiz -> esquerda -> direita
- DFS Inorder: esquerda -> raiz -> direita
- DFS Postorder: esquerda -> direita -> raiz
- BFS Level Order: por niveis com fila

## Complexidade tipica

- Visitar todos os nos: O(n)
- Espaco: O(h) em recursao, O(n) no pior caso

## Quando usar

- profundidade/altura
- validacao de BST
- busca por niveis

## Erros comuns

- esquecer caso base null
- confundir ordem de traversal
- estourar pilha em arvore muito profunda

## Exemplo em JavaScript

```js
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

# Trees

Boa escolha. Trees aparece em muitas entrevistas e melhora muito sua recursao.

## O que e Tree?

E uma estrutura hierarquica de nos.
No caso de Binary Tree, cada no pode ter ate dois filhos:

- left
- right

## Jeitos principais de percorrer

- DFS: vai fundo e volta
- BFS: visita por niveis

## Exemplo em JavaScript

~~~js
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
~~~

## Complexidade rapida

- Visitar todos os nos: O(n)
- Espaco: O(h), onde h e altura da arvore

## Problemas para praticar (ordem sugerida)

1. Maximum Depth of Binary Tree - #104
2. Same Tree - #100
3. Binary Tree Level Order Traversal - #102

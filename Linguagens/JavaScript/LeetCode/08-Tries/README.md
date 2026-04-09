# Tries

Boa escolha. Trie e perfeito para problemas com palavras e prefixo.

## O que e Trie?

Trie e uma arvore de caracteres.
Cada caminho representa uma palavra.

## Quando usar

- buscar palavra rapidamente
- verificar prefixo
- autocomplete

## Exemplo em JavaScript

~~~js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.end = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
    }
    node.end = true;
  }
}
~~~

## Complexidade rapida

Se L for tamanho da palavra:

- inserir: O(L)
- buscar: O(L)

## Problemas para praticar (ordem sugerida)

1. Implement Trie (Prefix Tree) - #208
2. Design Add and Search Words Data Structure - #211
3. Word Search II - #212

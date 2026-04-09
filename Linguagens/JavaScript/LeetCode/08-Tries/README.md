# Tries

## O que e

Trie e uma arvore de prefixos para palavras.
Cada nivel representa um caractere.

## Intuicao

Se muitas palavras compartilham comeco, Trie reaproveita esse caminho.
Exemplo: "car", "carta", "carro" compartilham "car".

## Como funciona

Cada no guarda:

- filhos (caractere -> no)
- marcador de fim de palavra

Operacoes comuns:

- insert("casa")
- search("casa")
- startsWith("cas")

## Complexidade sem misterio

Se L e tamanho da palavra:

- inserir: O(L)
- buscar: O(L)
- prefixo: O(L)

## Exemplo explicado

`js
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
`

## Erros comuns de iniciante

- Esquecer de marcar fim de palavra.
- Tratar prefixo como palavra completa sem validar end.
- Usar Trie quando um Set simples resolve melhor.

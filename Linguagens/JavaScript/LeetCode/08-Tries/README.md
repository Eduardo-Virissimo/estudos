# Tries

## Visao geral

Trie (prefix tree) armazena strings por caracteres em uma arvore de prefixos.
Isso deixa busca por prefixo muito eficiente.

## Como funciona

Cada no guarda:

- filhos (mapa de caractere -> no)
- marcador de fim de palavra

Operacoes principais:

- insert(word)
- search(word)
- startsWith(prefix)

## Complexidade tipica

Se L e tamanho da palavra/prefixo:

- inserir: O(L)
- buscar palavra: O(L)
- buscar prefixo: O(L)

## Quando usar

- autocomplete
- dicionario de palavras
- filtro por prefixo

## Erros comuns

- esquecer de marcar fim de palavra
- usar trie quando hash set simples ja resolve
- nao controlar uso de memoria

## Exemplo em JavaScript

```js
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
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.end = true;
  }
}
```

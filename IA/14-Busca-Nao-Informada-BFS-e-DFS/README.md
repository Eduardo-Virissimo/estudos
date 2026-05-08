# 📚 Módulo 14: Busca Não Informada: BFS e DFS

> **Foco do módulo:** aprender a lógica da busca cega e diferenciar busca em largura de busca em profundidade.

## 🧭 1) O que é busca não informada

A busca não informada começa sem conhecimento prévio sobre onde está a solução.

Ela trabalha apenas com:

- estado inicial;
- regras de expansão;
- verificação de objetivo.

Os dois métodos mais clássicos são:

- **Busca em Largura (BFS)**;
- **Busca em Profundidade (DFS)**.

## 🌐 2) Busca em Largura (BFS)

A BFS explora o espaço de busca por níveis.

### Como funciona

- começa no nó inicial;
- visita todos os vizinhos imediatos;
- depois visita os vizinhos do próximo nível;
- usa **fila** para controlar a exploração.

### Pontos fortes

- encontra a solução mais próxima em termos de número de passos;
- é útil em espaços rasos;
- funciona bem em problemas de caminho mais curto.

### Limite principal

- pode consumir muita memória em espaços grandes.

## ⛏️ 3) Busca em Profundidade (DFS)

A DFS explora um ramo o mais fundo possível antes de voltar.

### Como funciona

- começa no nó inicial;
- escolhe um ramo;
- avança profundamente;
- faz retrocesso quando necessário;
- usa **pilha**.

### Pontos fortes

- usa menos memória que BFS em muitos cenários;
- é boa para exploração profunda;
- é útil em árvores, grafos e quebra-cabeças.

### Limites principais

- não garante o caminho mais curto;
- pode entrar em ciclos se não houver controle de visitados.

## ⚖️ 4) Comparação direta

| Método | Estrutura | Vantagem principal                 | Limitação principal            |
| ------ | --------- | ---------------------------------- | ------------------------------ |
| BFS    | fila      | encontra solução mais próxima      | alto consumo de memória        |
| DFS    | pilha     | explora profundamente com menos memória | não garante solução ótima |

## 📌 5) Ideia central do módulo

BFS prioriza cobertura por nível; DFS prioriza aprofundamento. A escolha depende do tipo de problema e dos recursos disponíveis.

---

## ✅ Checklist rápido

- Sei definir busca não informada.
- Sei explicar o funcionamento da BFS.
- Sei explicar o funcionamento da DFS.
- Sei comparar fila x pilha e proximidade x profundidade.

⬅️ [Voltar para o índice principal](../README.md)

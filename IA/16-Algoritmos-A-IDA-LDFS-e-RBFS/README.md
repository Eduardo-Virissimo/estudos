# 📚 Módulo 16: Algoritmos A*, IDA*, LDFS e RBFS

> **Foco do módulo:** consolidar os algoritmos de busca mais fortes e entender a troca entre otimalidade, memória e eficiência.

## ⭐ 1) Busca A*

O A* combina:

- custo já percorrido `g`;
- estimativa heurística restante `h`.

Sua função clássica é:

`f(n) = g(n) + h(n)`

### Ideia central

O algoritmo escolhe expandir os nós com menor custo total estimado.

### Vantagem principal

Com heurística admissível, o A* pode encontrar o caminho ótimo.

### Aplicações comuns

- GPS e navegação;
- jogos;
- robótica;
- planejamento automatizado;
- roteamento e planejamento de tarefas.

## 🧠 2) Busca heurística limitada pela memória

Quando a memória vira problema, surgem variantes que tentam manter a eficiência sem armazenar tudo.

## 🔁 3) IDA*

O **Iterative Deepening A*** combina:

- ideia do A*;
- aprofundamento iterativo;
- uso controlado de memória.

### Pontos fortes

- mantém consumo de memória mais baixo;
- pode manter otimalidade quando a avaliação é adequada.

### Limite

- pode repetir exploração de partes da árvore em várias iterações.

## ⛏️ 4) LDFS

O **Limited Depth-First Search** aplica uma busca em profundidade com limite.

### Vantagem

- economiza memória.

### Limite

- pode perder soluções melhores ou até não alcançar a solução ideal.

## 🪜 5) RBFS

O **Recursive Best-First Search** mantém apenas uma parte limitada da árvore de busca e usa backtracking recursivo.

### Pontos fortes

- mais econômico em memória do que A* tradicional;
- útil quando armazenar a árvore completa é inviável.

### Limite

- depende bastante da qualidade da heurística;
- pode perder eficiência se a ordenação dos nós for ruim.

## ⚖️ 6) Comparação rápida

| Algoritmo | Força principal                  | Trade-off principal                    |
| --------- | -------------------------------- | -------------------------------------- |
| A*        | solução ótima com boa heurística | maior custo de memória                 |
| IDA*      | menos memória com boa qualidade  | repete partes da busca                 |
| LDFS      | simplicidade e baixo uso de memória | pode perder qualidade da solução   |
| RBFS      | busca heurística com memória limitada | depende muito da heurística        |

## 📌 7) Ideia central do módulo

Esses algoritmos mostram que, em busca heurística, quase sempre estamos equilibrando três coisas: qualidade da solução, tempo e memória.

---

## ✅ Checklist rápido

- Sei explicar a fórmula do A*.
- Sei dizer quando o A* é ótimo.
- Sei diferenciar A*, IDA*, LDFS e RBFS.
- Sei relacionar cada algoritmo ao problema de memória.

⬅️ [Voltar para o índice principal](../README.md)

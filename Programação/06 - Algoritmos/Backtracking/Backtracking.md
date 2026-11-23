---
nivel: escrito
foco: importante
revisado:
---

# Backtracking

**Quanto focar: 📌 importante.** Aparece em problemas médios de entrevista (combinações, permutações). Entenda o molde e pratique alguns.

Você está num labirinto de cerca viva, sem mapa. Chega numa bifurcação e escolhe a esquerda. Mais adiante, outra bifurcação: esquerda de novo. Beco sem saída. O que você faz? Volta **até a última bifurcação** e tenta o outro lado. Se aquele também não der, volta mais uma bifurcação. Você nunca desiste do labirinto inteiro; só desfaz a última escolha que deu errado.

Isso é **backtracking** (voltar atrás): construa uma solução fazendo uma escolha de cada vez; se em algum momento perceber que o caminho não dá certo, **desfaça a última escolha** e tente a próxima. É a técnica pra problemas em que você precisa **testar combinações**: todas as senhas possíveis, todas as formas de montar um time, onde colocar cada número num sudoku, todos os anagramas de uma palavra.

É força bruta, mas força bruta **organizada**, e com um truque que a torna muitas vezes viável: perceber cedo que um caminho não vai dar certo e nem continuar por ele. Ajuda ter a [[Recursão]] e a [[DFS (Busca em Profundidade)|DFS]] firmes, porque backtracking é uma DFS sobre a árvore de escolhas.

## Escolher, explorar, desfazer

Todo backtracking tem o mesmo esqueleto de três passos. O exemplo mais simples: gerar todas as permutações (ordens possíveis) de `[1, 2, 3]`.

```ts
function permutacoes(nums: number[]): number[][] {
  const resultado: number[][] = [];
  const atual: number[] = [];
  const usado = new Set<number>();

  function explorar(): void {
    if (atual.length === nums.length) {     // solução completa
      resultado.push([...atual]);           // COPIA: atual vai continuar mudando
      return;
    }
    for (const n of nums) {
      if (usado.has(n)) continue;
      atual.push(n); usado.add(n);          // 1. escolher
      explorar();                           // 2. explorar
      atual.pop(); usado.delete(n);         // 3. desfazer
    }
  }

  explorar();
  return resultado;
}

permutacoes([1, 2, 3]); // [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

O passo 3 é o que dá nome à técnica, e é o que todo mundo esquece na primeira vez. Depois de explorar tudo que começa com "1", você precisa **tirar o 1** pra poder tentar começar com "2". Sem o `pop`, o `atual` só cresce e o resultado sai errado.

O outro erro clássico está no `[...atual]`. Se você fizer `resultado.push(atual)`, está guardando **o mesmo array** seis vezes, e como ele é esvaziado no final, o resultado sai `[[], [], [], [], [], []]`. É a mesma armadilha de referência da matriz feita com `fill` ([[Matrizes]]). Guarde sempre uma cópia.

## A árvore de escolhas

Ajuda muito desenhar o que o backtracking está fazendo. Cada nível da árvore é uma escolha, e cada folha é uma solução completa:

```text
                    [ ]
          /          |          \
        [1]         [2]         [3]
       /   \       /   \       /   \
    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
      |     |     |     |     |     |
   [1,2,3] ...
```

O backtracking anda por essa árvore em profundidade: desce pela esquerda até uma folha, volta um nível, desce pelo próximo galho. E aí fica claro o custo: o número de folhas. Pra permutações de n itens, n! (3! = 6, 10! = 3,6 milhões, 15! = mais de 1 trilhão). Backtracking é **exponencial** ou pior, e só funciona com entradas pequenas (algo como n ≤ 10 a 20, dependendo do problema). Se o enunciado fala em n até 100 mil, a resposta não é backtracking.

| Problema | Número de soluções |
|---|---|
| Subconjuntos de n itens | 2ⁿ |
| Permutações de n itens | n! |
| Combinações de k entre n | n! / (k! (n−k)!) |

## A poda: não descer onde não há nada

O que transforma backtracking de "impraticável" em "rápido o suficiente" é a **poda**: perceber que um galho inteiro da árvore não tem solução, e nem descer por ele.

O exemplo clássico é o das **N rainhas**: coloque N rainhas num tabuleiro N × N sem que nenhuma ataque outra (mesma linha, coluna ou diagonal). Testar todas as posições possíveis de 8 rainhas em 64 casas é mais de 4 bilhões de combinações. Mas, colocando uma rainha por linha e **desistindo assim que uma rainha nova é atacada**, você nunca desce por galhos já condenados:

```ts
function nRainhas(n: number): number {
  const colunas = new Set<number>();
  const diag1 = new Set<number>();   // linha - coluna é igual na mesma diagonal ↘
  const diag2 = new Set<number>();   // linha + coluna é igual na mesma diagonal ↙
  let solucoes = 0;

  function colocar(linha: number): void {
    if (linha === n) { solucoes++; return; }
    for (let c = 0; c < n; c++) {
      if (colunas.has(c) || diag1.has(linha - c) || diag2.has(linha + c)) continue; // PODA
      colunas.add(c); diag1.add(linha - c); diag2.add(linha + c);       // escolher
      colocar(linha + 1);                                               // explorar
      colunas.delete(c); diag1.delete(linha - c); diag2.delete(linha + c); // desfazer
    }
  }

  colocar(0);
  return solucoes;
}

nRainhas(8); // 92
```

O `continue` da poda é a linha mais importante. Ele corta a árvore de bilhões de folhas pra alguns milhares de nós visitados. E o truque das diagonais (`linha − coluna` e `linha + coluna`), que transforma "estão na mesma diagonal?" numa consulta de [[Set]] em O(1), vale guardar.

Quanto mais cedo você poda, melhor. Num sudoku, conferir se o número já está na linha, coluna e quadrado **antes** de colocá-lo é poda. Numa busca por subconjuntos que somam um alvo, parar quando a soma passou do alvo (com números positivos) é poda.

## Reconhecer o problema

Sinais de backtracking: o enunciado pede **todas** as soluções (todas as combinações, todos os caminhos, todas as formas), ou pede **uma** solução que satisfaça restrições sem fórmula direta (sudoku, palavras cruzadas, horários sem conflito), e a entrada é **pequena**. Se o enunciado pede só a **quantidade** ou o **melhor valor**, e os subproblemas se repetem, desconfie: talvez seja [[Programação Dinâmica]], muito mais rápida.

## O essencial

1. Backtracking: escolher, explorar, desfazer; é uma DFS na árvore de escolhas.
2. Desfaça a escolha depois de explorar (`pop`), e guarde **cópias** das soluções (`[...atual]`).
3. O custo é o tamanho da árvore: exponencial (2ⁿ, n!). Só serve pra entradas pequenas.
4. Poda: desista de um galho assim que ele violar uma restrição. Quanto mais cedo, melhor.
5. Pede "todas as soluções" ou "uma que satisfaça restrições" com n pequeno: pense em backtracking.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva [Subsets](https://leetcode.com/problems/subsets/) (todos os subconjuntos), [Permutations](https://leetcode.com/problems/permutations/) e [Combination Sum](https://leetcode.com/problems/combination-sum/), que tem poda (pare quando a soma passar do alvo). Pra cada um, desenhe os três primeiros níveis da árvore de escolhas antes de codar, e anote o tamanho da árvore como Big-O. Depois, o desafio de verdade: um resolvedor de sudoku que lê um tabuleiro do terminal (zeros nas casas vazias) e imprime a solução. Ele precisa resolver um sudoku "difícil" de jornal em menos de um segundo; se não resolver, sua poda está atrasada.

Daqui, siga pra [[Programação Dinâmica]].

---

## 🧠 Me teste

> [!question]- Quais são os três passos do backtracking?
> Escolher (fazer uma escolha e marcar), explorar (chamar recursivamente pro próximo passo) e desfazer (reverter a escolha pra tentar a próxima).

> [!question]- Por que é preciso guardar `[...atual]` e não `atual` no resultado?
> Porque `atual` é o mesmo array, que continua sendo modificado; guardar a referência faria todas as soluções apontarem pro mesmo array, que termina vazio.

> [!question]- O que é a poda e por que ela importa?
> Desistir de um galho da árvore de escolhas assim que se percebe que ele não pode levar a uma solução. Ela corta partes enormes da árvore e é o que torna o backtracking viável.

> [!question]- Como saber se um problema é de backtracking ou de programação dinâmica?
> Backtracking quando se pede todas as soluções ou uma que satisfaça restrições, com entrada pequena. Programação dinâmica quando se pede a quantidade ou o melhor valor e os subproblemas se repetem.

> [!question]+ No gerador de permutações, você esqueceu as linhas `atual.pop(); usado.delete(n);`. O que acontece?
> - a) Sai o resultado certo, só mais devagar
> - b) Dá erro de pilha estourada
> - c) Só a primeira permutação é encontrada, porque nada é desfeito e as outras escolhas ficam bloqueadas
> - d) As permutações saem duplicadas
>
> > [!check]- Resposta
> > **c)** Sem desfazer, depois de montar `[1, 2, 3]` todos os números continuam marcados como usados e no `atual`, então nenhum outro galho consegue escolher nada. A recursão termina normalmente (não estoura), mas com uma só permutação.

---

## Pra consultar depois

```ts
function explorar(estado) {
  if (completo(estado)) { resultado.push(copia(estado)); return; }
  for (const escolha of opcoes(estado)) {
    if (!valida(escolha, estado)) continue; // poda
    aplicar(escolha, estado);               // escolher
    explorar(estado);                       // explorar
    desfazer(escolha, estado);              // desfazer
  }
}
```

**Pra ler e ver:** o capítulo de backtracking do [Hello Algo](https://www.hello-algo.com/en/chapter_backtracking/backtracking_algorithm/) desenha a árvore de escolhas e a poda com exemplos em TypeScript, incluindo as N rainhas. O [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) do LeetCode serve pra testar o seu resolvedor.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

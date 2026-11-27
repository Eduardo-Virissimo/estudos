---
nivel: escrito
foco: importante
revisado:
---

# Divide and Conquer

**Quanto focar: 📌 importante.** É uma forma de pensar que aparece em vários algoritmos. Entenda a ideia; ela vem junto com Merge Sort e Busca Binária.

**⏱️ Quanto tempo: cerca de 1h30.** Uns 10 min de leitura, 5 min no Me teste e 1h15 no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você precisa calcular 3 elevado a 1.000.000. O jeito óbvio é multiplicar 3 por ele mesmo um milhão de vezes. Mas olhe de outro ângulo: 3¹⁰⁰⁰⁰⁰⁰ é (3⁵⁰⁰⁰⁰⁰)². Se você soubesse quanto é 3⁵⁰⁰⁰⁰⁰, bastaria **uma** multiplicação a mais. E 3⁵⁰⁰⁰⁰⁰ é (3²⁵⁰⁰⁰⁰)². E assim por diante. Em vez de um milhão de multiplicações, umas 20 elevações ao quadrado (mais algumas multiplicações nos expoentes ímpares). De um milhão de passos pra uns 40.

Esse jeito de pensar se chama **dividir e conquistar** (*divide and conquer*): quebre o problema em pedaços **menores do mesmo tipo**, resolva cada pedaço (do mesmo jeito, recursivamente), e **combine** as respostas. Você já viu ele funcionando três vezes neste estágio sem que a nota dissesse o nome: a [[Busca Binária]] (divide ao meio e descarta uma metade), o [[Merge Sort]] (divide ao meio, ordena as duas, intercala) e o [[Quick Sort]] (particiona e ordena os dois lados).

Esta nota não traz um algoritmo novo. Ela traz a **receita** por trás deles, pra você reconhecer e usar em problemas que ainda não viu. Ajuda ter a [[Recursão]] firme.

## A receita em três passos

Todo algoritmo de dividir e conquistar tem a mesma forma:

1. **Caso base:** o problema é tão pequeno que a resposta é óbvia.
2. **Dividir:** quebre em subproblemas menores, do mesmo tipo.
3. **Conquistar e combinar:** resolva cada um recursivamente e junte as respostas.

A potência do começo, nessa receita:

```ts
function potencia(base: number, exp: number): number {
  if (exp === 0) return 1;                    // 1. caso base: qualquer coisa elevada a 0
  const metade = potencia(base, Math.floor(exp / 2)); // 2. um subproblema com metade do tamanho
  return exp % 2 === 0
    ? metade * metade                         // 3. combinar: x^(2k) = (x^k)²
    : metade * metade * base;                 //    x^(2k+1) = (x^k)² · x
}
```

Um detalhe que faz toda a diferença: `metade` é calculada **uma vez** e usada duas. Se você escrever `potencia(base, exp / 2) * potencia(base, exp / 2)`, calcula o mesmo subproblema duas vezes, e volta a fazer n multiplicações (é o mesmo erro do Fibonacci ingênuo da [[Recursão]]). Com a variável, cada nível faz uma chamada só: **O(log n)**.

## Onde está o trabalho

Os três algoritmos que você já conhece colocam o trabalho em lugares diferentes da receita, e comparar ajuda a entender:

| Algoritmo | Dividir | Combinar | Custo |
|---|---|---|---|
| Busca binária | barato (achar o meio), e **descarta** uma metade | nada | O(log n) |
| Merge sort | barato (cortar ao meio) | caro (intercalar, O(n)) | O(n log n) |
| Quick sort | caro (particionar, O(n)) | nada | O(n log n) em média |
| Potência rápida | barato | uma multiplicação | O(log n) |

E dá pra estimar o custo de qualquer um olhando três números: **quantos** subproblemas são criados, **de que tamanho**, e quanto custa **dividir e combinar**. Se divide em 2 metades e combina em O(n) (merge sort), são log n níveis de O(n): O(n log n). Se divide em 1 metade e combina em O(1) (busca binária), são log n níveis de O(1): O(log n). Existe uma fórmula geral pra isso, o **Teorema Mestre**, que você vai encontrar em livros de algoritmos; pra começar, desenhar a árvore de chamadas e somar o trabalho de cada nível resolve.

## Um problema novo: o máximo de uma lista

Pra praticar a receita num problema simples, ache o maior número de uma lista dividindo e conquistando:

```ts
function maximo(a: number[], ini = 0, fim = a.length - 1): number {
  if (ini === fim) return a[ini];             // um item só: ele é o máximo
  const meio = Math.floor((ini + fim) / 2);
  return Math.max(maximo(a, ini, meio), maximo(a, meio + 1, fim));
}
```

Funciona, e é O(n), o mesmo que um `for` simples. Ou seja, aqui dividir e conquistar **não ajudou**. E essa é uma lição importante: a técnica só ganha quando dividir permite **descartar** coisas (busca binária) ou quando **combinar** pedaços resolvidos é mais barato do que resolver tudo junto (merge sort: intercalar duas listas ordenadas é muito mais fácil do que ordenar). Quando os pedaços não ajudam um ao outro, um laço resolve igual e mais simples.

Mas repare numa vantagem escondida: as duas metades são **independentes**. Elas poderiam ser calculadas ao mesmo tempo, em dois processadores. É por isso que dividir e conquistar é a base de muito processamento paralelo e distribuído (o famoso MapReduce é essa ideia em escala de datacenter).

## Quando os pedaços se repetem

Uma última distinção, que leva à próxima grande técnica. No merge sort, as duas metades são **diferentes**, e cada subproblema aparece uma vez só. Mas em alguns problemas, ao dividir, os **mesmos subproblemas** aparecem várias vezes: o Fibonacci (`fib(5)` chama `fib(4)` e `fib(3)`, e `fib(4)` chama `fib(3)` de novo). Dividir e conquistar puro recalcula tudo e fica exponencial. A cura é anotar as respostas já calculadas, e isso tem nome: [[Programação Dinâmica]].

| Os subproblemas... | Técnica |
|---|---|
| são independentes e não se repetem | dividir e conquistar |
| se repetem | programação dinâmica |
| são escolhas a testar, voltando atrás | [[Backtracking]] |

## O essencial

1. Dividir e conquistar: caso base, dividir em subproblemas menores do mesmo tipo, combinar.
2. Busca binária, merge sort, quick sort e potência rápida são todos isso.
3. Calcule o subproblema uma vez e reutilize; chamar duas vezes o mesmo pedaço destrói o ganho.
4. Só compensa quando dividir permite descartar, ou combinar é mais barato que resolver tudo junto.
5. Se os subproblemas se repetem, é caso de programação dinâmica.

## Agora é com você

Três problemas em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), e pra cada um escreva antes, em comentário, os três passos da receita. O [Pow(x, n)](https://leetcode.com/problems/powx-n/), que é a potência rápida (cuidado com n negativo). O [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) com dividir e conquistar: a maior soma está na metade esquerda, na direita, ou cruzando o meio, e o caso "cruzando" se calcula em O(n). E contar **inversões** (pares i < j com `a[i] > a[j]`) modificando o seu `mergeSort` pra contar, durante o `intercalar`, quantas vezes um item da direita passa na frente dos da esquerda. Terminou quando os três funcionam e você sabe dizer o Big-O de cada um pelo desenho da árvore de chamadas.

Daqui, siga pra [[Backtracking]].

---

## 🧠 Me teste

> [!question]- Quais são os três passos de um algoritmo de dividir e conquistar?
> Caso base (resolve direto o problema pequeno), dividir em subproblemas menores do mesmo tipo, e conquistar recursivamente combinando as respostas.

> [!question]- Por que a potência rápida é O(log n)?
> Porque cada chamada reduz o expoente à metade e faz só uma chamada recursiva, então são cerca de log₂ n níveis com trabalho constante em cada um.

> [!question]- Onde está o trabalho pesado no merge sort e no quick sort?
> No merge sort, no combinar (intercalar as metades). No quick sort, no dividir (particionar); não há combinação.

> [!question]- Qual a diferença entre dividir e conquistar e programação dinâmica?
> Em dividir e conquistar os subproblemas são independentes e não se repetem; na programação dinâmica eles se repetem, e por isso se guardam as respostas.

> [!question]+ Uma potência escrita como `return potencia(b, e / 2) * potencia(b, e / 2)` (sem guardar numa variável) custa quanto?
> - a) O(log n), como a versão com variável
> - b) O(n), porque cada nível dobra o número de chamadas
> - c) O(n²)
> - d) O(1)
>
> > [!check]- Resposta
> > **b)** Chamar o mesmo subproblema duas vezes faz o número de chamadas dobrar a cada nível: 1, 2, 4... ao longo de log n níveis, o que soma cerca de n chamadas. Guardar o resultado numa variável faz uma chamada por nível e volta a O(log n).

---

## Pra consultar depois

| Algoritmo | Subproblemas | Combinar | Custo |
|---|---|---|---|
| Busca binária | 1 de tamanho n/2 | O(1) | O(log n) |
| Potência rápida | 1 de tamanho n/2 | O(1) | O(log n) |
| Merge sort | 2 de tamanho n/2 | O(n) | O(n log n) |
| Máximo dividindo | 2 de tamanho n/2 | O(1) | O(n) |

**Pra ler:** o capítulo de dividir e conquistar do [Hello Algo](https://www.hello-algo.com/en/chapter_divide_and_conquer/divide_and_conquer/) compara a técnica com laços e mostra quando ela ganha, com desenhos das árvores de chamada.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: importante
revisado:
---

# Programação Dinâmica

**Quanto focar: 📌 importante.** É temida em entrevista, mas no trabalho aparece pouco. Entenda a ideia e faça os problemas clássicos; não trave aqui.

**Quanto tempo:** cerca de 2h15: 15 min de leitura, 5 min no Me teste e 2h no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Uma escada tem 10 degraus, e você sobe dando passos de 1 ou de 2 degraus. De quantas formas diferentes dá pra chegar no topo? Tente pensar pelo fim. Pra pisar no degrau 10, seu último passo veio **ou** do degrau 9 (passo de 1) **ou** do degrau 8 (passo de 2). Então o número de formas de chegar no 10 é o número de formas de chegar no 9 **mais** o de chegar no 8. E o do 9 é o do 8 mais o do 7. E assim por diante, até o degrau 1 (uma forma só) e o 2 (duas formas: 1+1 ou 2).

Você acabou de quebrar o problema em subproblemas menores, como em [[Divide and Conquer]]. Mas repare: pra calcular o 10 você precisa do 9 e do 8; pro 9, do 8 e do 7. O **8 aparece duas vezes**. Descendo mais, o 7 aparece três vezes, o 6 cinco vezes. É o Fibonacci da nota de [[Recursão]], que ficava lento justamente por recalcular os mesmos valores milhões de vezes.

**Programação dinâmica** (PD) é a ideia de resolver cada subproblema **uma vez só** e guardar a resposta. O nome é péssimo (foi escolhido nos anos 1950 pra soar impressionante, não pra explicar nada), mas a ideia é simples: **recursão + memória**. E ela é a técnica com a maior distância entre "parece impossível" e "é fácil depois que você vê". Esta nota é sobre ver.

## Primeiro passo: anotar as respostas

Comece pela recursão direta, que é a tradução da frase "as formas de chegar no n são as formas do n−1 mais as do n−2":

```ts
function formas(n: number): number {
  if (n <= 2) return n;                   // 1 degrau: 1 forma; 2 degraus: 2 formas
  return formas(n - 1) + formas(n - 2);
}
formas(45); // segundos e segundos de espera
```

Certa e exponencial: cada chamada abre duas, e as mesmas se repetem. A cura é a que você já viu como [[Memoization]] na nota de [[Recursão]]: antes de calcular, veja se já calculou.

```ts
function formasMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;   // já sei: não recalculo
  const r = formasMemo(n - 1, memo) + formasMemo(n - 2, memo);
  memo.set(n, r);
  return r;
}
formasMemo(45); // instantâneo
```

Agora cada degrau é calculado uma vez: **O(n)**. Essa versão se chama **top-down** (de cima pra baixo): começa no problema grande e desce, anotando no caminho.

## Segundo passo: preencher uma tabela

Se cada degrau só depende dos anteriores, dá pra inverter a ordem: comece de baixo e vá subindo, preenchendo uma tabela. Sem recursão nenhuma:

```ts
function formasTabela(n: number): number {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
```

Essa é a versão **bottom-up** (de baixo pra cima). Mesma complexidade, sem risco de estourar a pilha com n grande. E ela revela uma otimização: cada passo só usa os **dois** valores anteriores, então nem precisa da tabela inteira. Duas variáveis bastam, e a memória cai de O(n) pra O(1).

As duas versões são PD. A top-down é mais fácil de escrever a partir da recursão; a bottom-up é mais rápida e econômica. Comece sempre pela recursão, que é onde mora o raciocínio, e transforme depois.

## As três perguntas que montam qualquer PD

O difícil da PD nunca é o código, é achar a recursão. Três perguntas guiam isso, e vale fazer as três por escrito antes de codar:

1. **Qual é o estado?** Que informação define um subproblema? Na escada, só o número do degrau. Em problemas mais difíceis, pode ser um par (posição na lista, dinheiro restante).
2. **Qual é a transição?** Como a resposta de um estado sai das respostas de estados menores? Na escada: `dp[i] = dp[i-1] + dp[i-2]`.
3. **Quais são os casos base?** Os estados pequenos com resposta óbvia. Na escada: 1 e 2.

E dois sinais dizem que um problema **é** de PD: ele pede uma **contagem** ("de quantas formas"), um **ótimo** ("o mínimo", "o máximo", "o melhor") ou um **sim/não** ("é possível?"); e, quando você tenta a recursão, os **subproblemas se repetem**.

## O troco mínimo

Um problema que mostra a PD em ação de verdade. Você tem moedas de 1, 3 e 4 centavos, quantas quiser de cada. Qual o **menor número de moedas** pra dar 6 centavos de troco?

O instinto é ser guloso: pegue a maior moeda que cabe. 4, sobra 2; 1, sobra 1; 1. Três moedas. Mas 3 + 3 dá 6 com **duas**. O guloso errou (a nota de [[Greedy]] explica quando ele funciona). A PD acerta porque testa todas as possibilidades, sem recalcular.

As três perguntas: o **estado** é o valor que falta pagar. A **transição**: pra pagar v, a última moeda usada foi alguma moeda m; então `dp[v] = 1 + o menor dp[v − m]` entre as moedas que cabem. O **caso base**: `dp[0] = 0` (pagar zero não precisa de moeda).

```ts
function trocoMinimo(moedas: number[], valor: number): number {
  const dp = new Array(valor + 1).fill(Infinity);
  dp[0] = 0;
  for (let v = 1; v <= valor; v++) {
    for (const m of moedas) {
      if (m <= v && dp[v - m] + 1 < dp[v]) dp[v] = dp[v - m] + 1;
    }
  }
  return dp[valor] === Infinity ? -1 : dp[valor]; // -1: impossível pagar
}

trocoMinimo([1, 3, 4], 6); // 2
```

```text
v:     0  1  2  3  4  5  6
dp:    0  1  2  1  1  2  2
                         └ 6 = 3 + 3
```

O custo é O(valor × moedas), uma tabela de tamanho `valor` com um laço curto em cada casa. Comparado com testar todas as combinações (exponencial), é a diferença entre milissegundos e o fim do universo.

Esse mesmo formato, uma tabela em que cada casa olha casas anteriores, resolve uma família enorme de problemas: a **mochila** (quais itens levar sem passar do peso, maximizando o valor), a **maior subsequência comum** entre dois textos (a base do `git diff`), a **distância de edição** (quantas letras trocar pra transformar uma palavra em outra: o corretor ortográfico). Os dois últimos usam uma tabela de duas dimensões, com estado (posição no texto 1, posição no texto 2), mas a lógica é a mesma.

## O essencial

1. PD = recursão em que os subproblemas se repetem + guardar cada resposta pra calcular uma vez só.
2. Top-down: recursão com memo. Bottom-up: tabela preenchida dos menores pros maiores.
3. Antes de codar, responda: qual o estado, qual a transição, quais os casos base.
4. Sinais: pede contagem, ótimo ou "é possível?", e a recursão repete subproblemas.
5. Comece pela recursão escrita em português ("as formas de chegar no n são..."); o código vem depois.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva quatro problemas, e em cada um escreva no comentário do topo o estado, a transição e os casos base **antes** do código: [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) (a escada da nota, sem olhar), [House Robber](https://leetcode.com/problems/house-robber/) (roubar casas sem pegar duas vizinhas: o estado é a casa, a escolha é roubar ou pular), [Coin Change](https://leetcode.com/problems/coin-change/) (o troco) e [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/), que é a primeira com tabela de duas dimensões. Faça cada um primeiro top-down e depois bottom-up. Terminou quando os quatro passam e você consegue explicar a transição do LCS desenhando a tabela pra "abcde" e "ace".

Daqui, siga pra [[Greedy]], que é o contraponto da PD.

---

## 🧠 Me teste

> [!question]- O que caracteriza um problema de programação dinâmica?
> Ele pode ser quebrado em subproblemas menores do mesmo tipo, e esses subproblemas se repetem; normalmente pede uma contagem, um valor ótimo ou se algo é possível.

> [!question]- Qual a diferença entre top-down e bottom-up?
> Top-down é a recursão com memo: começa do problema grande e guarda as respostas ao descer. Bottom-up preenche uma tabela a partir dos casos base, sem recursão.

> [!question]- Quais são as três perguntas pra montar uma PD?
> Qual é o estado (o que define um subproblema), qual é a transição (como a resposta sai de estados menores) e quais são os casos base.

> [!question]- No troco mínimo com moedas [1, 3, 4] e valor 6, por que o guloso falha e a PD acerta?
> O guloso pega 4 e depois 1 + 1 (três moedas), sem considerar outras opções. A PD calcula o melhor pra cada valor de 0 a 6 testando todas as moedas e acha 3 + 3 (duas moedas).

> [!question]+ Na escada com passos de 1 ou 2, qual é a transição correta?
> - a) `dp[i] = dp[i - 1] + 1`
> - b) `dp[i] = dp[i - 1] * 2`
> - c) `dp[i] = Math.max(dp[i - 1], dp[i - 2])`
> - d) `dp[i] = dp[i - 1] + dp[i - 2]`
>
> > [!check]- Resposta
> > **d)** Pra chegar no degrau i, o último passo veio do i − 1 ou do i − 2, e as formas de cada caminho se somam. A c) usaria `max`, que é pra problemas de ótimo, não de contagem: aqui queremos todas as formas, não a melhor.

---

## Pra consultar depois

| Problema | Estado | Transição |
|---|---|---|
| Escada | degrau i | `dp[i] = dp[i-1] + dp[i-2]` |
| House Robber | casa i | `dp[i] = max(dp[i-1], dp[i-2] + valor[i])` |
| Troco mínimo | valor v | `dp[v] = 1 + min(dp[v - m])` |
| LCS | (i, j) | iguais: `dp[i-1][j-1] + 1`; senão `max(dp[i-1][j], dp[i][j-1])` |

**Pra ler e ver:** o capítulo de programação dinâmica do [Hello Algo](https://www.hello-algo.com/en/chapter_dynamic_programming/intro_to_dynamic_programming/) começa justamente pela escada e mostra a passagem de recursão pra memo e pra tabela, com desenhos. O roadmap da [NeetCode](https://neetcode.io/roadmap) tem as listas "1-D Dynamic Programming" e "2-D Dynamic Programming" em ordem de dificuldade, com vídeo explicando cada uma.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

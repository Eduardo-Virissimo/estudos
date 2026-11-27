---
nivel: escrito
foco: importante
revisado:
---

# Recursão

**Quanto focar: 📌 importante.** Você vai usar pouco no dia a dia, mas ela é a base de árvores, grafos e backtracking no Estágio 2. Entenda bem e pratique alguns exercícios.

**Quanto tempo:** cerca de 1h15: 20 min de leitura, 5 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você está numa fila enorme e quer saber em que posição está. Só que não dá pra ver o começo da fila, e você só consegue falar com a pessoa logo à sua frente. Então você pergunta: "em que posição você está?". Ela também não sabe, e pergunta pra pessoa da frente dela. Que pergunta pra da frente. E assim vai, até chegar na primeira pessoa da fila, que **sabe** a resposta sem perguntar pra ninguém: "eu sou a primeira". Aí a resposta começa a voltar: "então eu sou a segunda", "então eu sou a terceira", até chegar em você.

Isso é **recursão**: quando uma função chama a si mesma pra resolver uma versão **menor** do mesmo problema. Cada pessoa da fila resolve um problema um pouco menor (a fila à frente dela) e usa a resposta pra resolver o seu. E a primeira pessoa é o **caso base**: o problema tão pequeno que a resposta é óbvia.

Toda função recursiva precisa dessas duas partes: o **caso base**, que diz quando parar, e o **passo recursivo**, que chama de novo com um problema menor. Sem caso base, ela se chama até estourar a memória. A recursão brilha em coisas que contêm a si mesmas (pastas dentro de pastas, comentários com respostas, menus com submenus), mas pra listas e contagens simples, um laço costuma ser melhor. Ajuda ter passado por [[Funções]] e [[Escopo]].

## Caso base e passo recursivo

O exemplo mais simples possível, uma contagem regressiva:

```ts
function contagemRegressiva(n: number): void {
  if (n === 0) {              // 1. CASO BASE: para aqui
    console.log("🚀 Decolar!");
    return;
  }
  console.log(n);
  contagemRegressiva(n - 1);  // 2. PASSO: o mesmo problema, menor
}
contagemRegressiva(3); // 3, 2, 1, 🚀 Decolar!
```

Ela mostra o número e pede pra "outra contagem" cuidar do resto, começando de um número a menos. Quando chega no zero, para.

A recursão fica interessante de verdade quando ela **devolve um valor**, como na fila. O fatorial é o exemplo clássico: 5! é 5 × 4 × 3 × 2 × 1.

```ts
function fatorial(n: number): number {
  if (n <= 1) return 1;          // caso base
  return n * fatorial(n - 1);    // 5! = 5 × 4!
}
```

Existe uma pergunta que ajuda a montar qualquer recursão, e vale guardar: **"se eu já soubesse resolver o problema um pouco menor, como resolveria este?"** Pro fatorial: se eu já sei quanto é 4!, então 5! é só 5 × 4!. Pronto, a recursão está escrita.

Dois erros aparecem sempre. O primeiro é o **caso base que nunca chega**. Com `if (n === 1)`, chamar `fatorial(-1)` nunca para: -1, -2, -3... pra sempre. Por isso o `n <= 1`, que pega todos os casos pequenos. E o problema **precisa diminuir** a cada chamada: uma `f(n)` que chama `f(n)` é só um laço infinito com outro nome.

O segundo é **esquecer o `return`**. Escrever só `fatorial(n - 1)`, sem `return n * ...`, calcula o valor e joga fora. Na fila, seria a pessoa da frente responder, e você não repassar a resposta. Ela precisa **voltar**.

## A pilha de chamadas

Pra entender o que acontece por dentro, você precisa saber de uma coisa: quando uma função chama outra, a primeira **fica esperando** a segunda terminar. O computador guarda essas esperas numa **pilha**, a *call stack*, uma em cima da outra, como pratos empilhados.

```text
fatorial(4)
  └ 4 * fatorial(3)
        └ 3 * fatorial(2)
              └ 2 * fatorial(1)
                    └ 1            ← caso base: começa a voltar
              └ 2 * 1 = 2
        └ 3 * 2 = 6
  └ 4 * 6 = 24
```

Primeiro a pilha **cresce**, com cada chamada esperando a próxima. Quando chega no caso base, ela **desmonta**: cada chamada recebe a resposta, termina a sua conta e devolve. É exatamente a fila: as perguntas vão pra frente, e as respostas voltam.

Só que essa pilha tem um tamanho limitado. Se ela crescer demais (milhares de chamadas, ou um caso base que nunca chega), aparece um erro que você vai ver muitas vezes na vida:

```text
RangeError: Maximum call stack size exceeded
```

"Tamanho máximo da pilha de chamadas excedido." Quando ele aparecer, a primeira suspeita é sempre um caso base que não está sendo atingido. A nota [[Pilhas]] explica a estrutura com mais calma.

## Onde a recursão é natural

Aqui vai uma confissão: fatorial e contagem regressiva são ótimos pra **aprender** recursão, mas na vida real um `for` resolve os dois melhor. Então onde a recursão realmente brilha?

Quando **o dado contém a si mesmo**. Pense numa pasta do seu computador: ela tem arquivos e subpastas. E cada subpasta tem arquivos e subpastas. E assim por diante, sem saber quantos níveis.

```ts
type Pasta = { nome: string; arquivos: number; subpastas: Pasta[] };

function contarArquivos(pasta: Pasta): number {
  let total = pasta.arquivos;
  for (const sub of pasta.subpastas) total += contarArquivos(sub);
  return total;
}
```

Leia em voz alta: "o total de uma pasta é os arquivos dela, mais o total de cada subpasta". O código tem **o mesmo formato do dado**, e por isso é tão fácil de ler. E o caso base? Está escondido. Uma pasta sem subpastas não entra no `for`, então não chama a função de novo. A recursão para sozinha.

Fazer isso com um laço é possível, mas você teria que controlar uma pilha à mão, anotando quais pastas ainda faltam visitar. Com recursão, a linguagem faz isso por você.

| Use recursão | Use laço |
|---|---|
| árvores, pastas, JSON aninhado, grafos | listas e contagens simples |
| problema que se divide ao meio ([[Merge Sort]]) | quando a profundidade pode ser enorme |
| testar combinações ([[Backtracking]]) | quando a versão com laço é igualmente clara |

E um limite prático: percorrer uma lista de 100 mil itens com recursão estoura a pilha, porque cada item vira uma chamada esperando. Pra listas, laço.

## A recursão bonita e lenta

Tem um último cuidado, e ele é famoso. A sequência de Fibonacci (0, 1, 1, 2, 3, 5, 8...) tem uma definição recursiva linda: cada número é a soma dos dois anteriores.

```ts
function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
fib(40); // demora segundos
```

Está certa, e é muito lenta. Por quê? O `fib(40)` chama o `fib(39)` e o `fib(38)`. Mas o `fib(39)` **também** chama o `fib(38)`. E cada um desses chama outros, repetidos. Os mesmos valores são calculados milhões de vezes.

A solução é anotar o que já foi calculado e consultar a anotação antes de calcular de novo. Isso se chama *memoization* ([[Memoization]]):

```ts
function fibRapido(n: number, memo = new Map<number, number>()): number {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const r = fibRapido(n - 1, memo) + fibRapido(n - 2, memo);
  memo.set(n, r);
  return r;
}
fibRapido(40); // instantâneo
```

Essa ideia de "não recalcular" é o ponto de partida da [[Programação Dinâmica]], no Estágio 2.

## O essencial

1. Toda recursão tem um caso base (quando parar) e um passo recursivo (o mesmo problema, menor).
2. Pergunte: "se eu soubesse resolver o problema menor, como resolveria este?".
3. O problema precisa diminuir, e a resposta precisa voltar com `return`.
4. `Maximum call stack size exceeded`: suspeite do caso base.
5. Recursão pra dados que contêm a si mesmos (pastas, árvores); laço pra listas.

## Agora é com você

Três recursões, do simples ao útil. A `somarAte(n)`, que soma de 1 até n (`somarAte(4)` dá 10). A `inverterTexto(t)`, em que o primeiro caractere vai pro fim do inverso do resto. E a `achatar(lista)`, que transforma `[1, [2, [3, 4]], 5]` em `[1, 2, 3, 4, 5]` (dica: `Array.isArray` diz se um item é uma lista). Antes de escrever cada uma, anote em uma linha qual é o caso base e como o problema diminui. Você terminou quando as três funcionarem, incluindo os casos de borda: `somarAte(0)`, `inverterTexto("")` e `achatar([])`.

Daqui, siga pra [[Pilhas]], [[Árvore Binária]], [[Divide and Conquer]] e [[Backtracking]].

---

## 🧠 Me teste

> [!question]- Quais são as duas partes obrigatórias de uma função recursiva?
> O caso base (a condição em que ela para sem chamar a si mesma) e o passo recursivo (chamar a si mesma com um problema menor).

> [!question]- O que causa "Maximum call stack size exceeded"?
> Chamadas demais empilhadas: normalmente falta caso base, o problema não diminui, ou a profundidade é grande demais.

> [!question]- Quando recursão é melhor que um laço?
> Quando o dado tem estrutura aninhada que contém a si mesma: árvores, pastas, JSON, grafos, divisão e conquista.

> [!question]- Por que o Fibonacci recursivo ingênuo é lento?
> Porque recalcula os mesmos valores muitas vezes; o número de chamadas cresce exponencialmente. Memoization resolve.

> [!question]- O que é a pilha de chamadas (call stack)?
> A estrutura onde o programa guarda cada chamada de função que ainda não terminou; a última que entrou é a primeira a sair.

> [!question]+ `function f(n) { return n * f(n - 1) }`. O que acontece com `f(3)`?
> - a) Retorna `6`
> - b) Retorna `0`
> - c) "Maximum call stack size exceeded"
> - d) Retorna `undefined`
>
> > [!check]- Resposta
> > **c)** Falta o **caso base** (`if (n <= 1) return 1`). Sem ele a função chama a si mesma pra sempre, até estourar a pilha.

---

## Pra consultar depois

| Parte | Exemplo |
|---|---|
| Caso base | `if (n <= 1) return 1;` |
| Passo recursivo | `return n * f(n - 1);` |
| Percorrer algo aninhado | `for (const filho of no.filhos) total += f(filho);` |
| Memoization | `if (memo.has(n)) return memo.get(n)!;` |
| Erro típico | `RangeError: Maximum call stack size exceeded` |

**Pra ler e ver:** o capítulo [Recursion and stack](https://javascript.info/recursion) do javascript.info desenha a pilha de chamadas passo a passo, e é a melhor explicação escrita. E o [Visualgo, na parte de recursão](https://visualgo.net/en/recursion), mostra a árvore de chamadas sendo montada ao vivo: rode o Fibonacci lá e veja com os próprios olhos por que ele é lento.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

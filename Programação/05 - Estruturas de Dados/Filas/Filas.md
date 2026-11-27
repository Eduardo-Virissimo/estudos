---
nivel: escrito
foco: importante
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Filas

**Quanto focar: 📌 importante.** Aparecem em BFS e em processamento de tarefas. Entenda e implemente uma vez.

**Quanto tempo:** cerca de 1h: 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Fila de padaria. Quem chegou primeiro é atendido primeiro, quem chega agora vai pro fim, e ninguém fura. É tão natural que parece não ter nada pra aprender. Só que ela está em todo sistema de verdade: os pedidos de uma loja virtual esperando processamento, os arquivos esperando a impressora, as mensagens que um servidor recebe mais rápido do que consegue tratar, os e-mails que um sistema manda um de cada vez pra não ser bloqueado.

A regra é **FIFO** (*first in, first out*, o primeiro a entrar é o primeiro a sair), o espelho da [[Pilhas|pilha]]. E a nota tem uma lição só, que vale ouro no JavaScript: **o jeito óbvio de fazer fila com array é lento**, e você vai ver por quê e como consertar. Ajuda ter passado por [[Arrays]].

## O jeito óbvio, e o problema escondido

Com um array, a fila parece pronta: `push` põe no fim, `shift` tira do começo.

```ts
const pedidos: string[] = [];
pedidos.push("pedido 1");
pedidos.push("pedido 2");
pedidos.push("pedido 3");

pedidos.shift(); // "pedido 1": o primeiro que chegou
```

Funciona, e com algumas dezenas de itens está ótimo. O problema é o que a nota de [[Arrays]] mostrou: tirar do **começo** obriga a puxar todo mundo uma casa pra trás. Cada `shift` é O(n). Uma fila de 100 mil pedidos processada inteira com `shift` faz cerca de 5 bilhões de movimentos. Na prática os motores de JavaScript têm truques que às vezes disfarçam isso, mas você não pode contar com eles, e o dia em que o processamento trava em produção é o dia em que você descobre.

## A fila com um ponteiro de início

A ideia pra consertar é simples: **não tire nada do array**. Guarde um índice que diz onde a fila começa, e ande com ele.

```ts
class Fila<T> {
  private itens: T[] = [];
  private inicio = 0;

  enfileirar(item: T): void {
    this.itens.push(item);
  }

  desenfileirar(): T | undefined {
    if (this.vazia()) return undefined;
    const item = this.itens[this.inicio];
    this.itens[this.inicio] = undefined as T; // solta a referência pro coletor de lixo
    this.inicio++;
    // de vez em quando, joga fora a parte já consumida
    if (this.inicio > 1000 && this.inicio * 2 > this.itens.length) {
      this.itens = this.itens.slice(this.inicio);
      this.inicio = 0;
    }
    return item;
  }

  frente(): T | undefined {
    return this.vazia() ? undefined : this.itens[this.inicio];
  }

  get tamanho(): number { return this.itens.length - this.inicio; }
  vazia(): boolean { return this.tamanho === 0; }
}
```

Desenfileirar agora é só ler uma posição e somar 1: O(1). O `if` do meio é o detalhe que separa a versão de exercício da versão de verdade. Sem ele, a parte já atendida do array fica lá pra sempre, ocupando memória. Com ele, quando mais da metade é lixo, você copia só o que importa. A cópia é O(n), mas acontece raramente, e o custo médio continua O(1). É o mesmo raciocínio do array que dobra de tamanho, a [[Complexidade Amortizada]].

O outro jeito clássico é usar uma [[Listas Ligadas|lista ligada]] com cabeça e cauda: enfileira na cauda, desenfileira na cabeça, tudo O(1) sem truque nenhum. É mais elegante e um pouco mais lento na prática, porque cada item vira um objeto.

## A fila que deixa o sistema respirar

Por que filas aparecem tanto em sistemas? Porque elas **desacoplam** quem produz trabalho de quem faz o trabalho. A loja recebe mil pedidos num minuto de promoção, mas só consegue emitir nota fiscal de dez por segundo. Sem fila, os pedidos se perdem ou o sistema cai. Com fila, eles esperam a vez.

```ts
const fila = new Fila<Pedido>();

// quem produz: chega a qualquer hora, em qualquer quantidade
function receberPedido(p: Pedido) { fila.enfileirar(p); }

// quem consome: no seu ritmo, um de cada vez
async function trabalhador() {
  while (true) {
    const p = fila.desenfileirar();
    if (p) await emitirNota(p);
    else await esperar(100); // fila vazia: descansa um pouco
  }
}
```

No mundo real essa fila não fica na memória do programa (se ele reiniciar, perde tudo), mas num serviço feito pra isso, como o Redis ou o RabbitMQ, que você encontra no Estágio 5. A ideia, porém, é exatamente esta.

E a fila tem uma propriedade importante pra algoritmos: ela processa as coisas **na ordem em que foram descobertas**. É isso que faz a [[BFS (Busca em Largura)]] explorar um grafo nível por nível e achar o caminho mais curto. A BFS é, no fundo, uma fila e um laço.

## Variações que você vai encontrar

Duas variações têm nota própria. A **fila de duas pontas**, que deixa entrar e sair pelos dois lados, é o [[Deque]]. E a **fila de prioridade**, em que quem sai primeiro não é quem chegou antes, mas quem tem mais urgência (o pronto-socorro), é feita com um [[Heap (Estrutura de Dados)|heap]].

Uma terceira aparece em entrevista: a **fila com duas pilhas**. Você empilha tudo numa pilha de entrada; quando precisa tirar e a pilha de saída está vazia, despeja a entrada inteira na saída, e a ordem se inverte, virando FIFO. Cada item é movido uma vez só, então o custo médio é O(1). Vale tentar escrever, é um ótimo exercício de pensar em custo.

## O essencial

1. Fila é FIFO: o primeiro a entrar é o primeiro a sair.
2. `array.shift()` é O(n); uma fila grande processada com `shift` fica O(n²).
3. Fila eficiente: array com um índice de início (limpando de vez em quando) ou lista ligada com cabeça e cauda.
4. Filas desacoplam quem produz de quem consome e deixam o sistema aguentar picos.
5. BFS é uma fila; prioridade é um heap; duas pontas é um deque.

## Agora é com você

Escreva a `Fila<T>` em 📦 `estruturas-do-zero/src/fila.ts` ([[Estruturas de Dados do Zero]]), sem usar `shift`, com testes que cobrem a fila vazia e enfileirar depois de esvaziar. Depois escreva o `benchmark.ts` do projeto: enfileire 100 mil números e desenfileire todos, uma vez com a sua `Fila` e outra com `push`/`shift` num array puro, medindo com `performance.now()`. Rode com 100 mil e depois com 300 mil e veja qual dos dois tempos triplica e qual faz pior que isso. Anote os números no README. Se sobrar fôlego, faça a versão com duas pilhas e meça também.

Daqui, siga pra [[Deque]] e, quando chegar nos algoritmos, pra [[BFS (Busca em Largura)]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre fila e pilha?
> A fila é FIFO (o primeiro a entrar sai primeiro, como numa padaria); a pilha é LIFO (o último a entrar sai primeiro, como pratos empilhados).

> [!question]- Por que uma fila feita com `push` e `shift` fica lenta com muitos itens?
> Porque `shift` remove do começo do array e desloca todos os outros: O(n) por operação, O(n²) pra esvaziar uma fila de n itens.

> [!question]- Como funciona a fila com índice de início, e por que ela precisa de limpeza?
> Ela nunca remove do array, só avança um índice `inicio`. Sem limpeza, a parte já consumida fica ocupando memória pra sempre; de tempos em tempos copia-se só o trecho ativo.

> [!question]- Por que sistemas usam filas entre quem recebe e quem processa o trabalho?
> Pra desacoplar os ritmos: picos de entrada esperam na fila em vez de derrubar o sistema ou se perder, e o consumidor processa no próprio ritmo.

> [!question]+ Qual estrutura faz a BFS explorar um grafo nível por nível?
> - a) Uma pilha
> - b) Um heap
> - c) Uma fila
> - d) Um Set
>
> > [!check]- Resposta
> > **c)** A fila processa os nós na ordem em que foram descobertos: primeiro todos os vizinhos do início, depois os vizinhos deles. Com uma pilha, você teria DFS. O Set entra na BFS também, mas pra marcar visitados, não pra definir a ordem.

---

## Pra consultar depois

| Jeito | Enfileirar | Desenfileirar |
|---|---|---|
| Array com `push`/`shift` | O(1) | **O(n)** |
| Array com índice de início | O(1) | O(1) amortizado |
| Lista ligada com cauda | O(1) | O(1) |
| Duas pilhas | O(1) | O(1) amortizado |

**Pra ler e ver:** o capítulo de filas do [Hello Algo](https://www.hello-algo.com/en/chapter_stack_and_queue/queue/) mostra as implementações com array circular e com lista ligada, em TypeScript. O [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) do LeetCode é o exercício das duas pilhas.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

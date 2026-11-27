---
nivel: escrito
foco: importante
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Pilhas

**Quanto focar: 📌 importante.** Aparecem disfarçadas (desfazer, parênteses, call stack) e em entrevista. Entenda e implemente uma vez.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 15 min de leitura, 5 min no Me teste e 1h no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Você está editando um texto, escreve uma frase, apaga uma palavra, cola um parágrafo. Aí aperta Ctrl+Z. O que volta? O parágrafo colado, a última coisa que você fez. Ctrl+Z de novo: a palavra apagada volta. O editor desfaz na ordem **contrária** à que você fez, como quem tira pratos de uma pilha: o último prato que entrou é o primeiro a sair.

Essa regra tem nome, **LIFO** (*last in, first out*, o último a entrar é o primeiro a sair), e a estrutura que a segue é a **pilha**. Ela é provavelmente a estrutura mais simples do estágio, só três operações, e uma das mais importantes: a linguagem que você usa roda em cima de uma ([[Recursão]] mostrou a *call stack*), e um monte de problemas que parecem difíceis ficam fáceis quando você percebe que "o mais recente importa primeiro". Esta nota é sobre reconhecer esses problemas.

## Três operações, e um array já resolve

Uma pilha só deixa mexer no **topo**:

- `push(x)`: põe x no topo.
- `pop()`: tira e devolve o do topo.
- `peek()`: olha o do topo sem tirar.

No JavaScript, um array já faz isso de graça, porque `push` e `pop` mexem no fim, e o fim é barato ([[Arrays]]):

```ts
const desfazer: string[] = [];
desfazer.push("escreveu frase");
desfazer.push("apagou palavra");
desfazer.push("colou parágrafo");

desfazer.pop();        // "colou parágrafo"
desfazer.at(-1);       // "apagou palavra": o peek
```

Então por que escrever uma classe? Porque o array deixa fazer **tudo**: `shift`, `splice`, `arr[0] = ...`. Uma classe `Pilha` restringe de propósito, e essa restrição é a documentação: quem lê `Pilha` sabe que ali só se mexe no topo.

```ts
class Pilha<T> {
  private itens: T[] = [];

  push(item: T): void { this.itens.push(item); }
  pop(): T | undefined { return this.itens.pop(); }
  peek(): T | undefined { return this.itens.at(-1); }
  get tamanho(): number { return this.itens.length; }
  vazia(): boolean { return this.itens.length === 0; }
}
```

Tudo O(1). Um detalhe que pega: `pop()` numa pilha vazia devolve `undefined`, e se a pilha guarda valores que podem ser `undefined`, você não sabe se ela estava vazia. Por isso o `vazia()` existe; confira antes de tirar.

## Parênteses balanceados

O exercício clássico, e o melhor exemplo de "o mais recente importa primeiro". Dada uma string como `"{[()]}"`, os parênteses fecham direito?

Pense no que acontece quando você lê um `)`. Ele precisa fechar **o último que foi aberto e ainda não fechou**. Não o primeiro, o último. Isso é uma pilha:

```ts
function balanceado(texto: string): boolean {
  const pares: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const abertos = new Pilha<string>();

  for (const ch of texto) {
    if (ch === "(" || ch === "[" || ch === "{") {
      abertos.push(ch);
    } else if (ch in pares) {
      if (abertos.pop() !== pares[ch]) return false; // fechou o errado, ou nada aberto
    }
  }
  return abertos.vazia(); // sobrou algum aberto?
}

balanceado("{[()]}"); // true
balanceado("([)]");   // false: o ] tenta fechar o (
balanceado("((");     // false: sobrou aberto
```

Os dois erros comuns aqui são esquecer o `return abertos.vazia()` no fim (aí `"(("` passa como balanceado) e não tratar o fechamento com a pilha vazia (`")("`). O `pop()` de uma pilha vazia devolve `undefined`, que é diferente de `"("`, e o código acima trata isso sem `if` extra.

É assim que o seu editor pinta o parêntese que combina, e que o compilador reclama de chave faltando.

## Onde mais a pilha aparece

Depois que você enxerga, vê em todo canto. O botão **voltar** do navegador é uma pilha de páginas. A **call stack** é uma pilha de chamadas de função esperando a próxima terminar, e é por isso que uma recursão sem fim dá `Maximum call stack size exceeded`. E toda recursão pode ser reescrita como um laço com uma pilha explícita, que é exatamente como se faz [[DFS (Busca em Profundidade)]] sem recursão:

```ts
// percorrer pastas sem recursão: a pilha guarda o que falta visitar
const faltam = new Pilha<Pasta>();
faltam.push(raiz);
while (!faltam.vazia()) {
  const pasta = faltam.pop()!;
  console.log(pasta.nome);
  for (const sub of pasta.subpastas) faltam.push(sub);
}
```

A recursão usa a pilha do sistema, que tem limite. A versão com laço usa uma pilha sua, no heap, que só acaba quando a memória acaba. Pra árvores muito fundas, essa troca evita o estouro.

Uma última família de problemas, mais avançada: a **pilha monotônica**, que responde "qual o próximo dia mais quente que hoje?" pra cada dia, em O(n). A pilha guarda os dias que ainda esperam resposta, e cada dia novo resolve todos os da pilha que são mais frios que ele. Vale guardar o nome e voltar quando aparecer o [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/).

## O essencial

1. Pilha é LIFO: o último a entrar é o primeiro a sair.
2. `push`, `pop` e `peek`, todos O(1); um array com `push`/`pop` já é uma pilha.
3. Se o problema diz "o mais recente que ainda não foi resolvido", pense em pilha.
4. Parênteses balanceados: empilha a abertura, desempilha no fechamento, e confira se sobrou algo.
5. Toda recursão vira laço com uma pilha explícita.

## Agora é com você

Escreva a `Pilha<T>` em 📦 `estruturas-do-zero/src/pilha.ts`, com testes (o exemplo de teste está em [[Estruturas de Dados do Zero]]), e use-a pra resolver dois exercícios: o [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) e uma calculadora de **notação polonesa reversa**, em que `"3 4 + 2 *"` dá 14 (cada número vai pra pilha; cada operador tira dois, calcula e empilha o resultado). Na calculadora, decida o que fazer com expressões quebradas como `"3 +"` e lance um erro com mensagem clara. Você terminou quando os dois passam e cada um tem o Big-O anotado no topo do arquivo.

Daqui, siga pra [[Filas]], a irmã da pilha, que tira pelo outro lado.

---

## 🧠 Me teste

> [!question]- O que significa LIFO e dê dois exemplos do dia a dia?
> Last in, first out: o último a entrar é o primeiro a sair. Ctrl+Z, botão voltar do navegador, pilha de pratos, call stack.

> [!question]- Por que um array do JavaScript serve como pilha eficiente?
> Porque `push` e `pop` mexem no fim do array, que é O(1). Basta nunca mexer no começo.

> [!question]- No algoritmo de parênteses balanceados, por que é preciso checar se a pilha está vazia no fim?
> Porque aberturas que nunca foram fechadas (`"(("`) não geram erro durante o laço; só sobram na pilha. Se sobrou algo, não está balanceado.

> [!question]- Como percorrer uma árvore muito profunda sem estourar a call stack?
> Trocando a recursão por um laço com uma pilha explícita, que guarda os nós que faltam visitar. Ela vive no heap, sem o limite da call stack.

> [!question]+ Você empilha 1, 2 e 3, nessa ordem, e faz `pop()` duas vezes. O que sai?
> - a) 1 e depois 2
> - b) 3 e depois 2
> - c) 3 e depois 1
> - d) 1 e depois 3
>
> > [!check]- Resposta
> > **b)** O último a entrar (3) sai primeiro, e depois o que estava embaixo dele (2). Quem responde "1 e 2" está pensando em fila (FIFO).

---

## Pra consultar depois

| Operação | Array | Custo |
|---|---|---|
| Empilhar | `arr.push(x)` | O(1) |
| Desempilhar | `arr.pop()` | O(1) |
| Olhar o topo | `arr.at(-1)` | O(1) |
| Está vazia? | `arr.length === 0` | O(1) |

**Pra ler e ver:** o [VisuAlgo, na parte de pilha](https://visualgo.net/en/list) (escolha "Stack" no topo) mostra push e pop animados. O capítulo de pilhas do [Hello Algo](https://www.hello-algo.com/en/chapter_stack_and_queue/stack/) implementa com array e com lista ligada, em TypeScript, e compara as duas.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

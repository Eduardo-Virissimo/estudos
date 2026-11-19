---
nivel: escrito
revisado:
---

# Listas Ligadas

Lembra da fileira de armários de [[Arrays]], em que pôr um armário novo no começo obrigava todo mundo a se mudar? Agora pense num trem. Cada vagão só sabe uma coisa: qual vagão vem engatado atrás dele. Pra colocar um vagão novo na frente, você não mexe em nenhum outro: engata o novo na locomotiva e engata o antigo primeiro vagão atrás dele. Duas ligações trocadas, pronto, não importa se o trem tem 5 vagões ou 5 mil.

Isso é uma **lista ligada**: uma sequência de **nós**, em que cada nó guarda um valor e uma referência pro próximo. Ela troca a principal força do array (ir direto na posição `i`) por outra (inserir e remover sem empurrar ninguém). E o mais importante da nota não é a lista em si, que você raramente vai usar crua no JavaScript. É o **jeito de pensar com ponteiros**, que aparece de novo em árvores, grafos e em metade dos exercícios de entrevista.

## Um nó, e depois uma corrente de nós

O nó é um objeto com duas coisas:

```ts
class No<T> {
  constructor(
    public valor: T,
    public proximo: No<T> | null = null,
  ) {}
}

// montando à mão: 1 → 2 → 3
const tres = new No(3);
const dois = new No(2, tres);
const um = new No(1, dois);
```

A lista inteira é acessada pela **cabeça** (o primeiro nó). O último nó aponta pra `null`, e é assim que você sabe que o trem acabou. Pra percorrer, você segue as setas:

```ts
let atual: No<number> | null = um;
while (atual !== null) {
  console.log(atual.valor);
  atual = atual.proximo;
}
```

Esse laço é o coração de tudo que se faz com listas ligadas, e vale escrever algumas vezes até sair sozinho. Repare no custo: pra chegar no terceiro elemento, você passa pelo primeiro e pelo segundo. Não existe `lista[2]` direto. **Acessar a posição i custa O(n)**, e esse é o preço que a lista paga.

## A classe, com cabeça e cauda

Na prática você embrulha os nós numa classe que guarda a cabeça, a cauda (o último nó, pra inserir no fim sem percorrer tudo) e o tamanho:

```ts
class ListaLigada<T> {
  private cabeca: No<T> | null = null;
  private cauda: No<T> | null = null;
  tamanho = 0;

  inserirNoInicio(valor: T): void {
    const novo = new No(valor, this.cabeca); // o novo aponta pro antigo primeiro
    this.cabeca = novo;                      // e vira a cabeça
    if (this.cauda === null) this.cauda = novo; // lista estava vazia
    this.tamanho++;
  }

  inserirNoFim(valor: T): void {
    const novo = new No(valor);
    if (this.cauda === null) {
      this.cabeca = this.cauda = novo;
    } else {
      this.cauda.proximo = novo;
      this.cauda = novo;
    }
    this.tamanho++;
  }

  removerDoInicio(): T | undefined {
    if (this.cabeca === null) return undefined;
    const valor = this.cabeca.valor;
    this.cabeca = this.cabeca.proximo;
    if (this.cabeca === null) this.cauda = null; // ficou vazia
    this.tamanho--;
    return valor;
  }
}
```

As três operações são O(1): nenhuma percorre a lista. E repare que todas têm um `if` pro caso da **lista vazia**. Esse é o lugar onde quase todo bug de lista ligada mora: esquecer de atualizar a `cauda` quando o último nó sai, ou a `cabeca` quando o primeiro entra numa lista vazia. Quando for testar, comece sempre pela lista vazia e pela lista de um elemento só.

## A ordem em que você troca as setas

Inserir no meio, depois do nó `a`, é trocar duas setas. E a ordem importa:

```ts
// certo: primeiro o novo aponta pro que vinha depois de a
novo.proximo = a.proximo;
a.proximo = novo;

// errado: a já aponta pro novo, e o resto da lista se perdeu
a.proximo = novo;
novo.proximo = a.proximo; // novo aponta pra ele mesmo!
```

Na versão errada, quando você faz `a.proximo = novo`, a única referência pro resto do trem some, e ninguém mais sabe onde estão os vagões seguintes. A regra é: **antes de soltar uma seta, garanta que alguém está segurando o que ela apontava**. Quando travar, desenhe caixinhas e setas no papel. Todo mundo que é bom em ponteiros faz isso.

## Inverter a lista, o exercício clássico

Inverter uma lista ligada (1 → 2 → 3 vira 3 → 2 → 1) é talvez o exercício de entrevista mais famoso, e usa exatamente a regra acima. Você anda pela lista com três variáveis: o anterior, o atual e o próximo.

```ts
function inverter<T>(cabeca: No<T> | null): No<T> | null {
  let anterior: No<T> | null = null;
  let atual = cabeca;
  while (atual !== null) {
    const proximo = atual.proximo; // 1. segura o resto antes de soltar
    atual.proximo = anterior;      // 2. vira a seta pra trás
    anterior = atual;              // 3. anda os dois um passo
    atual = proximo;
  }
  return anterior; // o antigo último é a nova cabeça
}
```

O(n) de tempo, O(1) de memória: nenhum array, nenhuma cópia. Faça uma vez no papel com três nós, acompanhando as três variáveis em cada volta, e você entende listas ligadas.

## Duplamente ligada, e onde isso existe de verdade

Se cada nó também guardar o **anterior**, você tem uma lista **duplamente ligada**. Ela anda nos dois sentidos e remove um nó em O(1) quando você já tem a referência pra ele (porque sabe quem vem antes, sem procurar). O custo é uma seta a mais pra manter certa em cada operação.

E onde isso aparece fora de exercício? Honestamente, no JavaScript do dia a dia, quase nunca: o array é otimizado e quase sempre ganha. Mas por baixo dos panos as listas ligadas estão em todo lugar: o histórico de "voltar e avançar" de um navegador, a playlist com anterior e próxima, e o **cache LRU** (que joga fora o item usado há mais tempo), que combina uma [[Hash Table]] com uma lista duplamente ligada pra fazer tudo em O(1). Ela também é a base pra entender [[Pilhas]] e [[Filas]] eficientes e, mais adiante, [[Árvore Binária|árvores]], que são basicamente nós com duas setas em vez de uma.

| | Array | Lista ligada |
|---|---|---|
| Acessar posição i | O(1) | O(n) |
| Inserir/remover no começo | O(n) | O(1) |
| Inserir no fim | O(1) amortizado | O(1) com cauda |
| Inserir no meio (já tendo o nó) | O(n) | O(1) |
| Memória | compacta | um objeto por item, mais as setas |

## O essencial

1. Lista ligada = nós com valor e referência pro próximo; o último aponta pra `null`.
2. Inserir e remover no começo é O(1); acessar a posição i é O(n).
3. Antes de soltar uma seta, guarde o que ela apontava (`const proximo = atual.proximo`).
4. Teste sempre a lista vazia e a de um elemento: é lá que moram os bugs de cabeça e cauda.
5. No JS do dia a dia, prefira array; a lista é a base de filas, caches LRU e árvores.

## Agora é com você

Complete a `ListaLigada<T>` da nota em 📦 `estruturas-do-zero/src/lista-ligada.ts` ([[Estruturas de Dados do Zero]]) com `obter(i)`, `removerValor(valor)` (remove a primeira ocorrência e devolve `true` ou `false`), `inverter()` e `[Symbol.iterator]`, pra que `for (const x of lista)` e `[...lista]` funcionem. O `removerValor` é o difícil: ele precisa tratar remover a cabeça, remover a cauda (e atualizar a `cauda`!) e não achar nada. Escreva um teste pra cada um desses casos antes de escrever o método. Você terminou quando `[...lista]` depois de cada operação mostra exatamente o que você espera, e `tamanho` nunca desmente.

Daqui, siga pra [[Pilhas]] e [[Filas]], que você vai poder construir em cima desta lista.

---

## 🧠 Me teste

> [!question]- Por que acessar a posição i numa lista ligada é O(n)?
> Porque os nós não ficam contíguos na memória; a única forma de chegar no i-ésimo é começar na cabeça e seguir as referências `proximo` uma a uma.

> [!question]- Pra que serve guardar a `cauda` além da `cabeca`?
> Pra inserir no fim em O(1). Sem ela, seria preciso percorrer a lista inteira até o último nó a cada inserção.

> [!question]- Quais casos de teste pegam a maioria dos bugs de lista ligada?
> Lista vazia, lista com um elemento só, e operações na cabeça e na cauda (especialmente remover o último nó e esquecer de atualizar a `cauda`).

> [!question]- Explique as três variáveis do algoritmo de inverter a lista.
> `anterior` (o pedaço já invertido), `atual` (o nó que está sendo virado) e `proximo` (guarda o resto da lista antes de a seta de `atual` ser virada pra trás). No fim, `anterior` é a nova cabeça.

> [!question]+ Pra inserir `novo` logo depois do nó `a`, qual ordem está certa?
> - a) `a.proximo = novo; novo.proximo = a.proximo;`
> - b) `novo.proximo = a; a.proximo = novo;`
> - c) `novo.proximo = a.proximo; a.proximo = novo;`
> - d) Tanto faz a ordem, o resultado é o mesmo
>
> > [!check]- Resposta
> > **c)** Primeiro o novo segura o resto da lista, depois `a` passa a apontar pro novo. Na a), `a.proximo` já virou `novo` quando você o lê, então `novo` aponta pra si mesmo e o resto da lista se perde.

---

## Pra consultar depois

| Operação | Custo |
|---|---|
| Inserir/remover no início | O(1) |
| Inserir no fim (com cauda) | O(1) |
| Remover do fim (simples) | O(n): precisa achar o penúltimo |
| Acessar/buscar | O(n) |
| Inverter | O(n) tempo, O(1) memória |

**Pra ler e ver:** o [VisuAlgo, em listas ligadas](https://visualgo.net/en/list) anima cada troca de seta, inclusive na lista duplamente ligada: rode "insert" no meio e observe a ordem. O capítulo de listas ligadas do [Hello Algo](https://www.hello-algo.com/en/chapter_array_and_linkedlist/linked_list/) compara com arrays lado a lado, com código em TypeScript. E o [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) do LeetCode é o exercício pra fixar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

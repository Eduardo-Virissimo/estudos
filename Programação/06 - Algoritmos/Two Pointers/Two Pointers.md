---
nivel: escrito
revisado:
---

# Two Pointers

Uma loja tem os preços dos produtos numa lista **ordenada**, do mais barato pro mais caro, e um cliente tem um vale-presente de exatamente R$ 100 que quer gastar em **dois** produtos. Quais dois? O jeito ingênuo testa todos os pares: o primeiro com cada um dos outros, o segundo com cada um dos outros... O(n²).

Mas a lista está ordenada, e isso dá uma ideia. Ponha um dedo no produto **mais barato** e outro no **mais caro**. Some os dois. Se deu mais que 100, o caro é caro demais pra qualquer par com ele (até o mais barato passou do limite), então mova o dedo da direita pra um mais barato. Se deu menos que 100, o barato é barato demais (nem com o mais caro chegou), então mova o dedo da esquerda pra um mais caro. Se deu 100, achou. Os dedos vão se aproximando, e em no máximo n passos você termina.

Isso é **dois ponteiros** (*two pointers*): dois índices andando pela mesma estrutura, de um jeito coordenado, de modo que cada passo descarta possibilidades sem precisar testá-las. Ela transforma muita coisa O(n²) em **O(n)**, sem memória extra, e aparece de três formas: das pontas pro meio, os dois na mesma direção, e um rápido e um lento. Ajuda ter passado por [[Arrays]]; a [[Sliding Window]] é uma prima próxima.

## Das pontas pro meio

O vale-presente em código:

```ts
function parComSoma(precos: number[], alvo: number): [number, number] | null {
  let esq = 0;
  let dir = precos.length - 1;
  while (esq < dir) {
    const soma = precos[esq] + precos[dir];
    if (soma === alvo) return [esq, dir];
    if (soma > alvo) dir--;    // grande demais: troca o caro por um mais barato
    else esq++;                // pequena demais: troca o barato por um mais caro
  }
  return null;
}
```

O motivo de funcionar é o que faz a técnica valer: quando a soma passou do alvo, o `dir` atual **não forma par válido com ninguém** que ainda está na disputa (todos os outros à direita do `esq` são maiores ou iguais ao `precos[esq]`, então somariam ainda mais). Ele pode ser descartado sem teste. Cada passo descarta um elemento inteiro, e por isso são no máximo n passos.

E a condição é `esq < dir`, não `<=`: um produto não pode fazer par com ele mesmo.

Esse formato tem uma pré-condição forte: **a lista precisa estar ordenada**. Sem ordem, "a soma passou, mova o da direita" não significa nada. Se a lista não está ordenada, você pode ordenar antes (O(n log n)) ou usar o `Map` do Two Sum ([[Hash Table]]), que é O(n) sem ordenar, mas usa O(n) de memória.

O mesmo formato verifica **palíndromos** sem criar string nova (compara a primeira com a última, a segunda com a penúltima) e **inverte um array no lugar** (troca as pontas e aproxima).

## Os dois na mesma direção

Na segunda forma, os dois ponteiros andam pra frente, mas em ritmos diferentes: um **lê** todos os elementos e o outro marca **onde escrever** os que interessam. O exemplo clássico: remover os repetidos de uma lista ordenada, **no próprio array**, sem criar outro.

```ts
function removerRepetidos(a: number[]): number {
  if (a.length === 0) return 0;
  let escrita = 1;                       // a[0] sempre fica
  for (let leitura = 1; leitura < a.length; leitura++) {
    if (a[leitura] !== a[escrita - 1]) { // é novo: guarda
      a[escrita] = a[leitura];
      escrita++;
    }
  }
  return escrita;                        // os primeiros `escrita` itens são os únicos
}

const nums = [1, 1, 2, 3, 3, 3, 4];
const k = removerRepetidos(nums);        // k = 4, nums começa com [1, 2, 3, 4, ...]
```

A `leitura` olha tudo; a `escrita` só anda quando encontra algo que vale guardar. É o mesmo que um `filter`, mas sem memória extra: O(n) de tempo, O(1) de espaço. Em JavaScript você usaria o `filter` no dia a dia, mas em entrevista e em linguagens de baixo nível, "faça no lugar" é pedido frequente.

O [[Merge Sort]] também usa dois ponteiros na mesma direção, um em cada lista, no `intercalar`.

## Um rápido e um lento

A terceira forma é a mais esperta. Numa [[Listas Ligadas|lista ligada]], como saber se ela tem um **ciclo** (o último nó aponta de volta pra um do meio, e percorrer nunca termina)? Guardar os nós visitados num Set funciona, mas gasta memória.

O truque de Floyd, chamado "tartaruga e lebre": dois ponteiros saem da cabeça, a tartaruga anda **um** nó por vez, a lebre anda **dois**. Se não houver ciclo, a lebre chega no fim. Se houver, as duas entram no ciclo e a lebre, mais rápida, **alcança a tartaruga** por trás, como numa pista de corrida.

```ts
function temCiclo<T>(cabeca: No<T> | null): boolean {
  let lenta = cabeca;
  let rapida = cabeca;
  while (rapida !== null && rapida.proximo !== null) {
    lenta = lenta!.proximo;
    rapida = rapida.proximo.proximo;
    if (lenta === rapida) return true;   // a lebre alcançou: há ciclo
  }
  return false;                          // a lebre chegou no fim
}
```

O(n) de tempo, O(1) de memória. O mesmo par acha o **meio** de uma lista ligada numa passada só: quando a lebre chega no fim, a tartaruga está no meio.

## Reconhecer o problema

| Sinal no enunciado | Forma |
|---|---|
| Array **ordenado**, achar par/trio com uma soma | das pontas pro meio |
| Palíndromo, inverter no lugar | das pontas pro meio |
| "No lugar", "sem memória extra", remover/filtrar | mesma direção (leitura e escrita) |
| Juntar duas listas ordenadas | um ponteiro em cada lista |
| Lista ligada: ciclo, meio, k-ésimo do fim | rápido e lento |

## O essencial

1. Dois ponteiros: dois índices coordenados em que cada passo descarta possibilidades sem testá-las.
2. Das pontas pro meio exige dados **ordenados**: soma grande, anda a direita; pequena, anda a esquerda.
3. Mesma direção: um lê tudo, o outro marca onde escrever; filtra no lugar com O(1) de memória.
4. Rápido e lento (Floyd): detecta ciclo e acha o meio de lista ligada.
5. Quase sempre transforma O(n²) em O(n), sem memória extra.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva um problema de cada forma: [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) (pontas), [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) (mesma direção), [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) (rápido e lento), e depois o [3Sum](https://leetcode.com/problems/3sum/), que é o difícil: ordene, fixe um número e use as pontas no resto, com cuidado pra não repetir trios. No comentário do Two Sum II, compare com a solução de `Map` do Two Sum original: qual gasta menos memória e qual exige o quê. Terminou quando o 3Sum passa sem trios repetidos.

Daqui, siga pra [[Manipulação de Bits]].

---

## 🧠 Me teste

> [!question]- Por que, no par com soma alvo, é seguro mover o ponteiro da direita quando a soma passou do alvo?
> Porque a lista está ordenada: o elemento da direita, somado ao menor elemento ainda disponível, já passa do alvo, então ele não forma par válido com ninguém e pode ser descartado.

> [!question]- Como remover repetidos de um array ordenado sem criar outro array?
> Com um ponteiro de leitura que percorre tudo e um de escrita que só avança quando encontra um valor diferente do último escrito, copiando-o pra posição de escrita.

> [!question]- Como o algoritmo da tartaruga e da lebre detecta ciclo numa lista ligada?
> Um ponteiro anda um nó por vez e outro anda dois; se houver ciclo, o rápido alcança o lento dentro dele; se não houver, o rápido chega ao fim.

> [!question]- Two Sum com `Map` ou com dois ponteiros: quando usar cada um?
> Dois ponteiros quando o array já está ordenado (O(n) de tempo, O(1) de memória). `Map` quando não está (O(n) de tempo, O(n) de memória, sem precisar ordenar).

> [!question]+ Você usou dois ponteiros das pontas pro meio pra achar um par com soma 12 em `[5, 1, 9, 7, 2]`, e o algoritmo não encontrou nada, embora 5 + 7 = 12. Por quê?
> - a) Dois ponteiros só funcionam com números positivos
> - b) A condição deveria ser `esq <= dir`
> - c) O algoritmo tem que começar com os dois ponteiros no meio
> - d) O array não está ordenado, e a técnica depende da ordem pra descartar elementos
>
> > [!check]- Resposta
> > **d)** "A soma passou, então descarto o da direita" só é verdade se todos os da esquerda forem menores. Sem ordem, a técnica descarta elementos que formariam o par. Ordene antes ou use um `Map`. A b) faria um elemento formar par consigo mesmo.

---

## Pra consultar depois

| Forma | Esqueleto |
|---|---|
| Pontas | `while (esq < dir) { ... esq++ ou dir-- }` |
| Mesma direção | `for (leitura...) if (vale) a[escrita++] = a[leitura]` |
| Rápido e lento | `lenta = lenta.proximo; rapida = rapida.proximo.proximo` |

**Pra ler:** a lista "Two Pointers" do roadmap da [NeetCode](https://neetcode.io/roadmap) tem os problemas da técnica em ordem, com vídeo; o 3Sum de lá é explicado com muito cuidado na parte de evitar repetidos.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

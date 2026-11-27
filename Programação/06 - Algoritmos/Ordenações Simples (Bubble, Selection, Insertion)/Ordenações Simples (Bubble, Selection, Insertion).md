---
nivel: escrito
foco: bom saber
revisado:
---

# Ordenações Simples (Bubble, Selection, Insertion)

**Quanto focar: 💤 bom saber.** Você nunca vai escrever uma no trabalho, você usa o `sort`. Servem pra aprender a pensar; entenda a ideia e não gaste muito tempo.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 15 min de leitura, 5 min no Me teste e 1h no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Antes de tudo, um teste. Abra o terminal, rode `node` e digite:

```js
[10, 9, 1, 100].sort()
```

O resultado é `[1, 10, 100, 9]`. Não é bug. O `sort` do JavaScript, sem argumento, converte tudo em **texto** e ordena como dicionário: "10" vem antes de "9" porque o caractere "1" vem antes do "9". Pra ordenar números você precisa dizer como comparar: `sort((a, b) => a - b)`. Se tirar uma só coisa desta nota, tire esta, porque ela já derrubou sistema em produção.

Agora a pergunta da nota: **como** o computador ordena? Você vai usar o `sort` pronto a vida toda, e ele é melhor que qualquer coisa que você escreveria. Mas entender ordenação é a melhor porta de entrada pra pensar em algoritmos: as três ordenações desta nota são simples o bastante pra caber na cabeça, e lentas o bastante pra mostrar, na prática, o que O(n²) significa. A próxima nota, [[Merge Sort]], mostra como sair disso.

O exemplo que volta em todas: ordenar uma mão de cartas, `[5, 2, 4, 6, 1, 3]`.

## O que o número da comparação quer dizer

Antes dos algoritmos, a função que o `sort` recebe. Ela compara dois itens e devolve um número:

- **negativo**: `a` vem antes de `b`;
- **positivo**: `b` vem antes de `a`;
- **zero**: tanto faz (são "iguais" pra ordenação).

```ts
nums.sort((a, b) => a - b);                          // crescente
nums.sort((a, b) => b - a);                          // decrescente
tarefas.sort((a, b) => a.prazo.localeCompare(b.prazo)); // por texto (datas ISO ordenam como texto)
pessoas.sort((a, b) => a.idade - b.idade || a.nome.localeCompare(b.nome)); // idade, e empate por nome
```

O último é um truque útil: o `||` só usa o segundo critério quando o primeiro dá zero. E um aviso: o `sort` **altera o array original**. Se não quiser isso, use `toSorted`, que devolve uma cópia ordenada.

## Bubble Sort: as bolhas sobem

A ideia mais ingênua possível: percorra o array comparando vizinhos, e troque se estiverem fora de ordem. Ao fim de uma passada, o **maior** foi empurrado até o final, como uma bolha subindo. Repita até não haver mais trocas.

```ts
function bubbleSort(a: number[]): number[] {
  for (let fim = a.length - 1; fim > 0; fim--) {
    let trocou = false;
    for (let i = 0; i < fim; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        trocou = true;
      }
    }
    if (!trocou) break; // passada sem troca: já está ordenado
  }
  return a;
}
```

Com `[5, 2, 4, 6, 1, 3]`, a primeira passada leva o 6 pro fim, a segunda leva o 5, e assim por diante. O `trocou` é um detalhe esperto: se uma passada inteira não trocou nada, o array já está ordenado e dá pra parar. Sem ele, mesmo um array já ordenado faria todas as passadas.

O bubble sort é o mais famoso e o pior dos três. Ele existe pra ser ensinado.

## Selection Sort: escolha o menor

Uma ideia mais humana: ache o **menor** de todos e coloque na primeira posição. Depois ache o menor do que sobrou e coloque na segunda. E assim até o fim.

```ts
function selectionSort(a: number[]): number[] {
  for (let i = 0; i < a.length - 1; i++) {
    let menor = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[menor]) menor = j;
    }
    [a[i], a[menor]] = [a[menor], a[i]]; // uma troca por passada
  }
  return a;
}
```

A virtude dele é fazer **poucas trocas**: no máximo n − 1. O defeito é que ele sempre faz todas as comparações, mesmo se o array já estiver ordenado, porque nunca sabe se o menor está mais adiante sem olhar.

## Insertion Sort: como você ordena cartas

Este é o que você faz com cartas na mão sem pensar. Pegue as cartas uma por uma; cada carta nova, você **encaixa** no lugar certo entre as que já estão ordenadas na sua mão, empurrando as maiores pro lado.

```ts
function insertionSort(a: number[]): number[] {
  for (let i = 1; i < a.length; i++) {
    const carta = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > carta) {
      a[j + 1] = a[j]; // empurra a maior uma casa pra direita
      j--;
    }
    a[j + 1] = carta;  // encaixa no buraco
  }
  return a;
}
```

```text
[5 | 2, 4, 6, 1, 3]   a parte da esquerda já está ordenada
[2, 5 | 4, 6, 1, 3]   o 2 entrou antes do 5
[2, 4, 5 | 6, 1, 3]   o 4 entrou entre o 2 e o 5
[2, 4, 5, 6 | 1, 3]   o 6 já estava no lugar
[1, 2, 4, 5, 6 | 3]   o 1 empurrou todo mundo
[1, 2, 3, 4, 5, 6]
```

O insertion sort tem uma qualidade especial: **se o array já está quase ordenado, ele é quase O(n)**, porque cada carta nova anda só um pouquinho. Por isso ele não é só didático: os algoritmos de verdade (como o TimSort, que o `sort` do JavaScript usa no V8) usam insertion sort pra pedaços pequenos, em que ele ganha dos rápidos.

## O que é O(n²) na prática

Os três têm dois laços aninhados, e no pior caso fazem por volta de n²/2 comparações. Isso é **O(n²)**, e o que isso significa fica claro com números:

| n | n² / 2 comparações | Tempo aproximado |
|---|---|---|
| 1.000 | 500 mil | instantâneo |
| 100.000 | 5 bilhões | alguns segundos |
| 1.000.000 | 500 bilhões | horas |

Dez vezes mais dados, **cem** vezes mais tempo. O [[Merge Sort]] e o [[Quick Sort]] fazem por volta de n log n comparações: com 1 milhão de itens, cerca de 20 milhões. É a diferença entre horas e uma fração de segundo.

Um último conceito, que importa no dia a dia: **estabilidade**. Uma ordenação é **estável** se itens "iguais" mantêm a ordem em que estavam. Ordenou as tarefas por data e depois por prioridade? Numa ordenação estável, as tarefas de mesma prioridade continuam em ordem de data. Bubble e insertion são estáveis; selection não é (a troca de longe pode pular um igual). O `sort` do JavaScript é estável desde 2019 (ES2019), então pode contar com isso.

| | Bubble | Selection | Insertion |
|---|---|---|---|
| Pior caso | O(n²) | O(n²) | O(n²) |
| Já ordenado | O(n) (com o `trocou`) | O(n²) | O(n) |
| Trocas | muitas | no máximo n − 1 | muitas (deslocamentos) |
| Estável | sim | não | sim |
| Memória extra | O(1) | O(1) | O(1) |

## O essencial

1. `sort()` sem argumento ordena como texto: pra números, `sort((a, b) => a - b)`.
2. A função de comparação devolve negativo (a antes), positivo (b antes) ou zero.
3. Bubble troca vizinhos, selection escolhe o menor, insertion encaixa cada carta no lugar.
4. Os três são O(n²): 10× mais dados, 100× mais tempo.
5. Insertion é ótimo pra dados quase ordenados; estável mantém a ordem dos iguais.

## Agora é com você

Escreva as três em 📦 `estruturas-do-zero/src/ordenacoes.ts` ([[Estruturas de Dados do Zero]]), mas com uma mudança: cada uma recebe também a função de comparação, como o `sort` de verdade (`insertionSort(lista, (a, b) => a - b)`), e devolve quantas comparações fez. Rode as três com o mesmo array aleatório de 5 mil números, com um já ordenado e com um invertido, e monte uma tabela de comparações no README. Os números vão confirmar a tabela da nota, inclusive o insertion sort ganhando no já ordenado. Terminou quando um teste confere que as três dão o mesmo resultado que o `toSorted` em cem arrays aleatórios.

Daqui, siga pra [[Merge Sort]].

---

## 🧠 Me teste

> [!question]- Por que `[10, 9, 1].sort()` dá `[1, 10, 9]`?
> Porque, sem função de comparação, o `sort` converte os itens em texto e compara como dicionário: "10" vem antes de "9" porque "1" < "9".

> [!question]- O que a função de comparação do `sort` deve devolver?
> Um número negativo se `a` vem antes, positivo se `b` vem antes, e zero se tanto faz.

> [!question]- Por que o insertion sort é rápido em arrays quase ordenados?
> Porque cada elemento novo só precisa andar umas poucas posições até seu lugar; o laço interno quase não roda, e o total fica perto de O(n).

> [!question]- O que é uma ordenação estável, e por que importa?
> Uma que mantém a ordem original entre itens considerados iguais. Importa quando você ordena por um critério e depois por outro e quer preservar o primeiro dentro dos empates.

> [!question]+ Uma ordenação O(n²) leva 1 segundo pra 10 mil itens. Mais ou menos quanto leva pra 100 mil?
> - a) 10 segundos
> - b) 2 segundos
> - c) 1.000 segundos
> - d) 100 segundos
>
> > [!check]- Resposta
> > **d)** Em O(n²), multiplicar n por 10 multiplica o tempo por 10² = 100. A a) seria o comportamento de um algoritmo O(n). Essa conta é o motivo de ninguém usar essas ordenações com muitos dados.

---

## Pra consultar depois

| Quero | Código |
|---|---|
| Números crescente | `nums.sort((a, b) => a - b)` |
| Números decrescente | `nums.sort((a, b) => b - a)` |
| Texto em português | `nomes.sort((a, b) => a.localeCompare(b, "pt-BR"))` |
| Dois critérios | `(a, b) => a.x - b.x \|\| a.y - b.y` |
| Sem alterar o original | `lista.toSorted((a, b) => a - b)` |

**Pra ver:** o [VisuAlgo, em ordenação](https://visualgo.net/en/sorting), anima os três (e os rápidos das próximas notas) passo a passo com o mesmo array; rode o insertion sort num array quase ordenado e veja a diferença. A [página do MDN sobre `sort`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) explica a ordenação como texto e a estabilidade.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

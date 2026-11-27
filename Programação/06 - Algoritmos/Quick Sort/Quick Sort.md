---
nivel: escrito
foco: importante
revisado:
---

# Quick Sort

**Quanto focar: 📌 importante.** Muito cobrado na teoria e em entrevista. Entenda a partição e implemente uma vez.

**⏱️ Quanto tempo: cerca de 1h.** Uns 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Uma turma precisa fazer fila por altura. Em vez de comparar todo mundo com todo mundo, a professora escolhe um aluno qualquer, o Caio, e diz: "quem é mais baixo que o Caio vai pra esquerda dele, quem é mais alto vai pra direita". Em um minuto, a turma está dividida em dois grupos, e o Caio já está **exatamente no lugar certo** da fila final, porque todo mundo à esquerda é mais baixo e todo mundo à direita é mais alto. Agora ela repete o truque em cada grupo, escolhendo um novo "Caio" em cada um. Logo, todo mundo está no lugar.

Esse é o **quick sort**. O aluno escolhido se chama **pivô**, e o passo de mandar cada um pro seu lado se chama **particionar**. Como o [[Merge Sort]], ele é dividir e conquistar ([[Divide and Conquer]]), mas ao contrário: o merge sort divide sem pensar e faz o trabalho na hora de juntar; o quick sort faz o trabalho na hora de dividir e não precisa juntar nada.

Ele costuma ser o mais rápido na prática, ordena no próprio array sem memória extra, e por décadas foi o `sort` padrão de muitas linguagens. Mas tem um pior caso que é importante conhecer, porque ele aparece justamente quando você menos espera: com dados **já ordenados**.

## Particionar: o trabalho de verdade

A partição pega um trecho do array, escolhe um pivô e reorganiza o trecho pra que os menores fiquem à esquerda e os maiores à direita, com o pivô no meio, no lugar definitivo. O jeito mais fácil de entender é o de Lomuto, que usa o **último** elemento como pivô:

```ts
function particionar(a: number[], ini: number, fim: number): number {
  const pivo = a[fim];
  let fronteira = ini;                 // tudo antes da fronteira é menor que o pivô
  for (let i = ini; i < fim; i++) {
    if (a[i] < pivo) {
      [a[i], a[fronteira]] = [a[fronteira], a[i]];
      fronteira++;
    }
  }
  [a[fronteira], a[fim]] = [a[fim], a[fronteira]]; // o pivô vai pro lugar dele
  return fronteira;                    // a posição final do pivô
}
```

A variável `fronteira` divide o trecho em "já sei que é menor" (à esquerda dela) e "o resto". Cada vez que acha um menor que o pivô, troca ele pra dentro da área dos menores e avança a fronteira. No fim, o pivô é trocado pra fronteira, e está no lugar certo pra sempre.

```text
pivô = 3       [5, 2, 4, 6, 1, 3]
i=0: 5 ≥ 3     [5, 2, 4, 6, 1, 3]   fronteira=0
i=1: 2 < 3     [2, 5, 4, 6, 1, 3]   fronteira=1
i=4: 1 < 3     [2, 1, 4, 6, 5, 3]   fronteira=2
fim: pivô      [2, 1, 3, 6, 5, 4]   o 3 está no lugar definitivo
```

## O resto é recursão

Com a partição, o quick sort é: particione, depois ordene a esquerda e a direita do pivô. Sem juntar nada, porque elas já estão nos lugares certos uma em relação à outra.

```ts
function quickSort(a: number[], ini = 0, fim = a.length - 1): number[] {
  if (ini >= fim) return a;                  // trecho de 0 ou 1 item: pronto
  const p = particionar(a, ini, fim);
  quickSort(a, ini, p - 1);                  // os menores
  quickSort(a, p + 1, fim);                  // os maiores (o pivô já ficou)
  return a;
}
```

Repare que tudo acontece **dentro do mesmo array**, só trocando posições. Nada de `slice`, nada de array novo. Por isso o quick sort usa quase nenhuma memória extra (só a pilha da recursão, O(log n) em média).

## Quando o pivô é ruim

Agora a parte importante. O quick sort é rápido quando o pivô divide o trecho **mais ou menos ao meio**: aí são log n níveis com O(n) de trabalho cada, O(n log n), como o merge sort.

Mas e se o pivô for sempre o **maior** (ou o menor) do trecho? Aí a partição não divide nada: sobra um lado com n − 1 itens e o outro vazio. O próximo nível, n − 2. E assim vai, com n níveis em vez de log n. O total vira n + (n − 1) + (n − 2) + ... = **O(n²)**, tão ruim quanto o bubble sort.

E quando isso acontece com o pivô no último elemento? Quando o array **já está ordenado**. O último é sempre o maior. Ou seja, o caso que parece o mais fácil de todos é o pior caso do quick sort ingênuo. E dados já ordenados (ou quase) são comuns.

A cura é escolher o pivô de um jeito que não dependa da ordem dos dados. A solução mais simples é **sortear**:

```ts
// antes de particionar: troca um elemento aleatório pro fim, e ele vira o pivô
const r = ini + Math.floor(Math.random() * (fim - ini + 1));
[a[r], a[fim]] = [a[fim], a[r]];
```

Com pivô aleatório, o pior caso continua existindo em teoria, mas a chance de acontecer é desprezível pra qualquer entrada. Outra opção clássica é a "mediana de três": olhar o primeiro, o do meio e o último, e usar o do meio dos três.

E um segundo cuidado: **muitos valores repetidos** (um array de um milhão de zeros e uns). Com a partição de Lomuto, os iguais ao pivô vão todos pro mesmo lado, e volta o O(n²). As versões de verdade usam uma partição em três partes (menores, iguais, maiores) pra resolver isso.

## Quick sort contra merge sort

| | Quick Sort | Merge Sort |
|---|---|---|
| Tempo médio | O(n log n), na prática o mais rápido | O(n log n) |
| Pior caso | O(n²), raro com pivô aleatório | O(n log n), sempre |
| Memória extra | O(log n), ordena no lugar | O(n) |
| Estável | não | sim |

Por que o quick sort costuma ser mais rápido na prática, se os dois são O(n log n)? Porque ele mexe no array no lugar, sem criar arrays novos, e acessa posições vizinhas da memória, o que o processador adora. O [[Big O]] diz como o custo cresce, mas não diz as constantes.

E o `sort` do JavaScript usa qual? Nenhum dos dois puro. O V8 usa o **TimSort**, um híbrido de merge sort com insertion sort, escolhido justamente por ser estável e muito rápido em dados que já vêm parcialmente ordenados. O quick sort vive em outras bibliotecas, como uma variação dele (o *introsort*) no `std::sort` do C++.

Uma última ideia que vale guardar: a partição sozinha resolve o problema "qual o k-ésimo menor?" em O(n) na média, sem ordenar tudo. Você particiona e só desce pro lado em que o k está. Chama-se *quickselect*.

## O essencial

1. Quick sort: escolha um pivô, particione (menores à esquerda, maiores à direita), ordene cada lado.
2. Depois de particionar, o pivô está no lugar definitivo; não há etapa de juntar.
3. Pivô que divide ao meio: O(n log n). Pivô sempre o maior ou menor: O(n²).
4. Com o último elemento como pivô, array já ordenado é o pior caso. Sorteie o pivô.
5. Ordena no lugar (pouca memória) e não é estável.

## Agora é com você

Escreva o `quickSort` com pivô aleatório em 📦 `estruturas-do-zero/src/ordenacoes.ts` ([[Estruturas de Dados do Zero]]), contando comparações como nas outras. Agora faça o experimento que prova a nota: rode a versão com pivô fixo (o último) e a com pivô aleatório num array de 5 mil números **já ordenado**, e compare as comparações. A versão fixa vai passar de 12 milhões; a aleatória vai ficar perto das outras O(n log n). Rode as duas também num array aleatório pra ver que aí empatam. Bônus: escreva o `quickselect` e resolva o [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) sem heap.

Daqui, siga pra [[Heap Sort]].

---

## 🧠 Me teste

> [!question]- O que faz a partição do quick sort?
> Escolhe um pivô e reorganiza o trecho pra que os menores fiquem à esquerda e os maiores à direita, deixando o pivô na sua posição final.

> [!question]- Por que o quick sort não precisa de uma etapa de juntar, como o merge sort?
> Porque, depois da partição, tudo à esquerda já é menor que tudo à direita; ordenando cada lado no lugar, o array inteiro fica ordenado.

> [!question]- O que torna o quick sort O(n²) e como evitar?
> Pivôs que sempre caem num extremo (o maior ou o menor), gerando partições desequilibradas. Evita-se com pivô aleatório ou mediana de três.

> [!question]- Se quick e merge sort são O(n log n), por que o quick costuma ser mais rápido?
> Porque ordena no próprio array, sem criar arrays novos, e acessa memória contígua, o que deixa as constantes menores. O Big-O não mostra essas constantes.

> [!question]+ Quick sort com o último elemento como pivô, num array de 10 mil números já ordenado. O que acontece?
> - a) É o melhor caso: O(n), porque já está ordenado
> - b) É o pior caso: O(n²), porque o pivô é sempre o maior e as partições ficam desequilibradas
> - c) É o caso médio: O(n log n)
> - d) Dá erro, porque não há o que trocar
>
> > [!check]- Resposta
> > **b)** Com o array ordenado, o último é sempre o maior do trecho; cada partição tira só um elemento, e são n níveis em vez de log n. O "melhor caso no ordenado" é do insertion sort, não do quick sort.

---

## Pra consultar depois

| Pivô | Risco |
|---|---|
| Último (ou primeiro) | O(n²) em dados ordenados ou invertidos |
| Aleatório | pior caso praticamente impossível |
| Mediana de três | bom e determinístico |
| Muitos repetidos | use partição em três partes |

**Pra ver:** o [VisuAlgo, em ordenação](https://visualgo.net/en/sorting) (escolha "Quick Sort" e depois "Random Quick Sort"), anima a partição com o pivô destacado; rode os dois num array ordenado. O capítulo de quick sort do [Hello Algo](https://www.hello-algo.com/en/chapter_sorting/quick_sort/) explica a escolha do pivô e a mediana de três.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

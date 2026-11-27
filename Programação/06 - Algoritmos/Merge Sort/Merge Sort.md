---
nivel: escrito
foco: importante
revisado:
---

# Merge Sort

**Quanto focar: 📌 importante.** É o exemplo clássico de dividir e conquistar e aparece em entrevista. Entenda e implemente uma vez.

**⏱️ Quanto tempo: cerca de 1h.** Uns 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Uma professora tem 400 provas pra colocar em ordem alfabética. Sozinha, ordenando de uma vez, ela vai passar a tarde comparando e reencaixando. Então ela tem uma ideia: divide a pilha em quatro e entrega cada parte pra um monitor. Cada monitor, com 100 provas, divide de novo e repassa. Quando as pilhas ficam com uma prova só, elas já estão "ordenadas" (uma prova sozinha está sempre em ordem). Aí começa a volta: cada um junta duas pilhas ordenadas numa só, até a professora receber de volta quatro pilhas ordenadas e juntar tudo.

O passo mágico é o **juntar**. Juntar duas pilhas **já ordenadas** numa pilha ordenada é fácil e rápido: você olha a prova do topo de cada pilha, pega a que vem antes, e repete. Nunca precisa reencaixar nada.

Esse é o **merge sort**: divida o array ao meio, ordene cada metade (do mesmo jeito, recursivamente) e intercale as duas metades ordenadas. É o primeiro algoritmo do estágio que usa a estratégia de [[Divide and Conquer]], e ele é **O(n log n)** sempre, no melhor, no médio e no pior caso. Com 1 milhão de itens, as [[Ordenações Simples (Bubble, Selection, Insertion)|ordenações simples]] levavam horas; o merge sort leva uma fração de segundo. Ajuda ter a [[Recursão]] firme.

## Juntar duas pilhas ordenadas

Comece pela parte que importa, a intercalação (o *merge*). Duas listas ordenadas entram, uma lista ordenada sai:

```ts
function intercalar(a: number[], b: number[]): number[] {
  const saida: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) saida.push(a[i++]); // <= mantém a ordem dos iguais: estável
    else saida.push(b[j++]);
  }
  // uma das duas acabou: o resto da outra já está em ordem
  while (i < a.length) saida.push(a[i++]);
  while (j < b.length) saida.push(b[j++]);
  return saida;
}

intercalar([2, 5, 8], [1, 3, 9, 10]); // [1, 2, 3, 5, 8, 9, 10]
```

Dois ponteiros, um em cada lista, comparando os da frente (o mesmo padrão de [[Two Pointers]]). Cada item é olhado uma vez, então intercalar custa O(n). Os dois `while` do fim são os que todo mundo esquece na primeira vez: quando uma lista acaba, sobram itens na outra, e eles precisam entrar.

E repare no `<=` em vez de `<`. Quando os dois são iguais, ele pega o da esquerda primeiro, mantendo a ordem original. É isso que faz o merge sort ser **estável**.

## Dividir até não dar mais

Com o `intercalar` pronto, o merge sort inteiro cabe em quatro linhas:

```ts
function mergeSort(lista: number[]): number[] {
  if (lista.length <= 1) return lista;                // caso base: já está ordenado
  const meio = Math.floor(lista.length / 2);
  const esquerda = mergeSort(lista.slice(0, meio));   // ordena cada metade
  const direita = mergeSort(lista.slice(meio));
  return intercalar(esquerda, direita);               // e junta
}
```

Leia em voz alta: "pra ordenar uma lista, ordene as duas metades e intercale". A recursão cuida do resto. E o caso base é a professora percebendo que uma prova sozinha já está em ordem.

```text
             [5, 2, 4, 6, 1, 3]
              /              \
        [5, 2, 4]          [6, 1, 3]
         /     \            /     \
      [5]    [2, 4]      [6]    [1, 3]
             /   \              /   \
           [2]   [4]          [1]   [3]
     ───────────── volta intercalando ─────────────
      [5]    [2, 4]      [6]    [1, 3]
        [2, 4, 5]          [1, 3, 6]
              \              /
             [1, 2, 3, 4, 5, 6]
```

## Por que é n log n

O desenho acima responde. Quantos **andares** tem? Como cada andar divide ao meio, de n até 1 são log₂ n andares (a mesma conta da [[Busca Binária]]). E quanto trabalho tem **cada andar**? Somando todas as intercalações de um andar, cada um dos n itens é copiado uma vez: O(n) por andar.

**log n andares × n de trabalho por andar = O(n log n).**

E isso vale sempre, não importa como os dados chegam: ordenados, invertidos ou embaralhados, a divisão é sempre ao meio. Essa previsibilidade é a grande vantagem do merge sort sobre o [[Quick Sort]], que costuma ser mais rápido mas tem um pior caso feio.

## O preço: memória

Nada é de graça. O merge sort precisa de **memória extra** proporcional a n, pra montar as listas intercaladas (os `slice` e os `saida` do código). As ordenações simples e o quick sort ordenam no próprio array, sem isso. Em geral não importa, mas com dados enormes ou memória curta, importa ([[Trade-offs Tempo x Espaço]]).

Essa característica, por outro lado, faz o merge sort brilhar num caso especial: **ordenar dados que não cabem na memória**. Um arquivo de 100 GB pode ser cortado em pedaços de 1 GB, cada pedaço ordenado separado e salvo, e depois todos intercalados lendo um pouquinho de cada. Os bancos de dados fazem exatamente isso. É o "ordenação externa".

E a parte de intercalar, sozinha, resolve vários exercícios: juntar duas listas ordenadas ([Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)), juntar K listas, ou contar quantos pares estão "fora de ordem" num array (as inversões) aproveitando as comparações do merge.

| | Merge Sort |
|---|---|
| Tempo (melhor, médio, pior) | O(n log n) |
| Memória extra | O(n) |
| Estável | sim |
| Bom pra | previsibilidade, listas ligadas, dados que não cabem na memória |

## O essencial

1. Merge sort: divida ao meio, ordene cada metade recursivamente, intercale.
2. Intercalar duas listas ordenadas é O(n), com dois ponteiros; não esqueça o resto da lista que sobrou.
3. São log n andares com O(n) de trabalho cada: O(n log n) sempre.
4. Usa O(n) de memória extra; é estável (graças ao `<=`).
5. Serve pra dados enormes (ordenação externa) e o "intercalar" resolve exercícios sozinho.

## Agora é com você

Escreva o `mergeSort` genérico, recebendo a função de comparação, em 📦 `estruturas-do-zero/src/ordenacoes.ts`, ao lado das ordenações simples ([[Estruturas de Dados do Zero]]). Rode a mesma comparação da nota anterior (5 mil itens aleatórios, ordenados e invertidos) e acrescente a coluna do merge sort na tabela: a contagem de comparações deve ficar abaixo de n log n (uns 60 mil) nos três casos, e nunca na casa dos milhões, como as simples no pior caso. Depois prove a estabilidade: ordene uma lista de tarefas por prioridade e confira que as de mesma prioridade continuaram na ordem de criação. Bônus: resolva o [Sort an Array](https://leetcode.com/problems/sort-an-array/) com ele.

Daqui, siga pra [[Quick Sort]].

---

## 🧠 Me teste

> [!question]- Quais são os três passos do merge sort?
> Dividir a lista ao meio, ordenar cada metade recursivamente e intercalar as duas metades ordenadas.

> [!question]- Por que intercalar duas listas ordenadas é O(n)?
> Porque basta comparar os itens da frente de cada lista e pegar o menor; cada item é olhado e copiado uma única vez.

> [!question]- Por que o merge sort é O(n log n) mesmo no pior caso?
> Porque a divisão é sempre ao meio, gerando log n níveis, e cada nível faz O(n) de trabalho somando as intercalações. Isso não depende da ordem dos dados.

> [!question]- Qual a principal desvantagem do merge sort?
> A memória extra O(n) pras listas intercaladas; ele não ordena no próprio array como o quick sort.

> [!question]+ No `intercalar`, o laço principal termina quando uma das listas acaba. O que acontece se você esquecer os dois `while` do final?
> - a) Nada, a lista sai certa do mesmo jeito
> - b) O resultado sai fora de ordem
> - c) O laço vira infinito
> - d) Os itens que sobraram na outra lista somem do resultado
>
> > [!check]- Resposta
> > **d)** Quando uma lista acaba, os itens restantes da outra (que já estão em ordem) nunca são copiados. `intercalar([1, 2], [3, 4, 5])` devolveria só `[1, 2]`. A ordem do que saiu continua certa; o problema é o que ficou de fora.

---

## Pra consultar depois

```ts
function mergeSort(lista: number[]): number[] {
  if (lista.length <= 1) return lista;
  const meio = Math.floor(lista.length / 2);
  return intercalar(mergeSort(lista.slice(0, meio)), mergeSort(lista.slice(meio)));
}
```

**Pra ver:** o [VisuAlgo, em ordenação](https://visualgo.net/en/sorting) (escolha "Merge Sort" no topo), mostra as divisões e as intercalações em cores; dá pra ver os andares do desenho da nota. O capítulo de merge sort do [Hello Algo](https://www.hello-algo.com/en/chapter_sorting/merge_sort/) tem o código em TypeScript com a análise de custo desenhada.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

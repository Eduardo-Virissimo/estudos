---
nivel: escrito
revisado:
---

# Busca Binária

Procurar "ornitorrinco" num dicionário de papel. Ninguém começa na primeira página e vai virando uma por uma. Você abre mais ou menos no meio, cai no "L", sabe que o "O" vem depois, e ignora a metade da esquerda inteira. Abre no meio do que sobrou, cai no "R", volta um pouco. Em poucas aberturas você chega na página, num livro de mil.

Isso só funciona porque **o dicionário está em ordem alfabética**. Num livro com as palavras embaralhadas, abrir no meio não diz nada sobre onde está a palavra. A **busca binária** é esse método: num array ordenado, olhe o meio, descarte a metade em que o alvo não pode estar, repita. Cada passo corta o problema pela metade, e por isso ela é absurdamente rápida: num milhão de itens, a [[Busca Linear]] faz até um milhão de comparações; a binária faz no máximo **20**.

Ela é também famosa por outra coisa: é o algoritmo simples mais fácil de escrever **errado**. Um `<` no lugar de um `<=`, um `+1` esquecido, e o laço nunca termina ou pula o alvo. Esta nota é sobre a ideia e, principalmente, sobre escrevê-la certa sem decorar.

## A ideia, e por que é log n

```text
procurando o 23 em [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
                    0  1  2  3   4   5   6   7   8   9

ini=0 fim=9  meio=4 → 16 < 23: o alvo está à direita → ini=5
ini=5 fim=9  meio=7 → 56 > 23: o alvo está à esquerda → fim=6
ini=5 fim=6  meio=5 → 23: achou!
```

Três comparações em vez de seis. E a vantagem cresce com o tamanho: a cada passo, o trecho onde o alvo pode estar cai pela metade. Começando com n, depois de k passos sobram n / 2ᵏ. Quando sobra 1, acabou. Então o número de passos é quantas vezes você divide n por 2 até chegar em 1, que é exatamente o **log₂ n**. Por isso a busca binária é **O(log n)**.

| Itens | Busca linear (pior caso) | Busca binária (pior caso) |
|---|---|---|
| 1.000 | 1.000 | 10 |
| 1.000.000 | 1.000.000 | 20 |
| 1.000.000.000 | 1.000.000.000 | 30 |

Multiplicar os dados por mil acrescenta só 10 passos. Essa é a cara de um algoritmo O(log n), e vale ter esse número na cabeça.

## Escrevendo certo: o intervalo e o invariante

O jeito de não errar é decidir **o que `ini` e `fim` significam** e nunca mais violar isso. A convenção mais comum: o alvo, se existir, está **sempre** em algum lugar entre `ini` e `fim`, **incluindo os dois**.

```ts
function buscaBinaria(lista: number[], alvo: number): number {
  let ini = 0;
  let fim = lista.length - 1;        // fim INCLUÍDO: é um índice válido

  while (ini <= fim) {               // <= porque um trecho de 1 item (ini === fim) ainda precisa ser olhado
    const meio = Math.floor((ini + fim) / 2);
    if (lista[meio] === alvo) return meio;
    if (lista[meio] < alvo) ini = meio + 1; // o meio já foi olhado: começa DEPOIS dele
    else fim = meio - 1;                    // termina ANTES dele
  }
  return -1;                         // o trecho ficou vazio: não existe
}
```

Cada linha decorre da regra "o alvo está entre `ini` e `fim`, inclusive":

- `fim = lista.length - 1`, porque `fim` é um índice que pode conter o alvo.
- `while (ini <= fim)`, porque quando `ini === fim` ainda sobra um item pra olhar. Com `<`, você deixaria de olhar o último candidato e responderia "não achei" pra um alvo que existe.
- `ini = meio + 1` e `fim = meio - 1`, porque o `meio` já foi comparado e não é o alvo. Se você escrever `ini = meio`, num trecho de dois itens o `meio` pode ser sempre o mesmo, e o laço roda pra sempre.

Esses três erros são os três da vida inteira de busca binária, e todos se resolvem lembrando da regra. Teste sempre com o alvo na **primeira** posição, na **última**, num array de **um** item, num **vazio**, e com alvo que **não existe**.

Um detalhe que aparece em outras linguagens: `(ini + fim) / 2` pode estourar o limite de inteiros em Java ou C quando os índices são enormes, e por isso você vai ver muito `ini + Math.floor((fim - ini) / 2)`. No JavaScript os números são grandes o bastante pra isso não importar, mas é bom reconhecer a forma.

## A pré-condição que não pode faltar

A busca binária **exige** dados ordenados. Num array fora de ordem ela não dá erro: ela devolve uma resposta errada, silenciosamente, e isso é pior. Se os dados não estão ordenados, você tem duas opções: ordenar antes (O(n log n), compensa se for buscar muitas vezes) ou usar busca linear, ou um `Set`.

E ordenar números no JavaScript tem uma pegadinha clássica, que a nota de [[Ordenações Simples (Bubble, Selection, Insertion)|ordenações]] explica: `[10, 9, 1].sort()` dá `[1, 10, 9]`, porque o `sort` padrão compara como texto. Pra números, sempre `sort((a, b) => a - b)`.

## Além de "achar o item"

A busca binária vale muito mais do que achar um número numa lista. Duas variações aparecem o tempo todo.

**Achar a fronteira.** "Qual o primeiro índice em que o valor é ≥ x?" (chamado de *lower bound*). Serve pra saber onde **inserir** mantendo a ordem, ou pra achar a primeira ocorrência de um valor repetido. A mudança é pequena: quando acha um candidato, guarda e continua procurando à esquerda.

```ts
// primeiro índice com lista[i] >= x (ou lista.length, se nenhum)
function primeiroMaiorOuIgual(lista: number[], x: number): number {
  let ini = 0, fim = lista.length - 1, resposta = lista.length;
  while (ini <= fim) {
    const meio = Math.floor((ini + fim) / 2);
    if (lista[meio] >= x) { resposta = meio; fim = meio - 1; } // candidato: tenta mais à esquerda
    else ini = meio + 1;
  }
  return resposta;
}
```

**Busca binária na resposta.** Esta é a ideia mais poderosa, e a mais escondida. Às vezes não há array nenhum, mas há uma pergunta de sim ou não que muda **uma vez só**: "dá pra entregar todos os pacotes em D dias com um caminhão de capacidade C?". Pra C pequeno, não; a partir de algum C, sim. Então você faz busca binária **nos valores de C**, testando "dá?" em cada meio. O [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) e o [Capacity To Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) são exatamente isso. Quando um problema pede "o menor valor tal que..." e testar um valor é fácil, pense nisto.

O `git bisect`, que acha o commit que introduziu um bug, é busca binária no histórico: "neste commit o bug existe?" muda de não pra sim uma vez só.

## O essencial

1. Busca binária só funciona em dados ordenados: olha o meio, descarta a metade errada.
2. É O(log n): um milhão de itens, 20 passos.
3. Com o intervalo fechado: `fim = length - 1`, `while (ini <= fim)`, `ini = meio + 1`, `fim = meio - 1`.
4. Teste: primeiro, último, um item, vazio, inexistente.
5. Variações: achar a fronteira (*lower bound*) e busca binária na resposta.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), escreva a `buscaBinaria` **sem olhar a nota**, só lembrando da regra do intervalo, e teste os cinco casos de borda. Depois resolva três: o [Binary Search](https://leetcode.com/problems/binary-search/) (o básico), o [Search Insert Position](https://leetcode.com/problems/search-insert-position/) (a fronteira) e o [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (busca na resposta). No Koko, antes de codar, escreva em uma frase qual é a pergunta de sim ou não e por que ela muda uma vez só. Bônus: use o `git bisect` num repositório seu pra achar o commit em que um arquivo mudou.

Daqui, siga pra [[Ordenações Simples (Bubble, Selection, Insertion)]].

---

## 🧠 Me teste

> [!question]- Por que a busca binária é O(log n)?
> Porque cada comparação descarta metade dos candidatos; o número de passos é quantas vezes dá pra dividir n por 2 até sobrar 1, que é log₂ n.

> [!question]- O que acontece se você rodar busca binária num array desordenado?
> Ela não dá erro: devolve uma resposta errada (geralmente "não achei" pra algo que existe), porque a decisão de ir pra esquerda ou direita deixa de fazer sentido.

> [!question]- Por que `ini = meio + 1`, e não `ini = meio`?
> Porque o meio já foi comparado e não é o alvo. Com `ini = meio`, num trecho de dois itens o meio pode se repetir pra sempre, e o laço não termina.

> [!question]- O que é "busca binária na resposta"?
> Fazer busca binária sobre os valores possíveis da resposta, quando existe uma pergunta de sim ou não que muda uma vez só (por exemplo, "dá pra fazer com capacidade C?"), testando cada meio.

> [!question]+ Com `fim = lista.length - 1`, qual condição do `while` está certa?
> - a) `while (ini < fim)`
> - b) `while (ini <= fim)`
> - c) `while (meio !== alvo)`
> - d) `while (fim - ini > 1)`
>
> > [!check]- Resposta
> > **b)** Com o `fim` incluído, um trecho de um item só tem `ini === fim` e ainda precisa ser olhado. Com a a), esse último candidato é ignorado e um alvo que existe pode virar "não achei". A c) compara um índice com um valor e pode não terminar.

---

## Pra consultar depois

```ts
let ini = 0, fim = lista.length - 1;
while (ini <= fim) {
  const meio = Math.floor((ini + fim) / 2);
  if (lista[meio] === alvo) return meio;
  if (lista[meio] < alvo) ini = meio + 1;
  else fim = meio - 1;
}
return -1;
```

| Itens | Passos no pior caso |
|---|---|
| 1 mil | 10 |
| 1 milhão | 20 |
| 1 bilhão | 30 |

**Pra ler:** o capítulo de busca binária do [Hello Algo](https://www.hello-algo.com/en/chapter_searching/binary_search/) discute as duas convenções de intervalo (fechado e semiaberto) lado a lado, que é o que acaba com os erros de um. E a [documentação do `git bisect`](https://git-scm.com/docs/git-bisect) mostra a busca binária achando o commit culpado.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

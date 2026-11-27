---
nivel: escrito
foco: bom saber
revisado:
---

# Complexidade Amortizada

**Quanto focar: 💤 bom saber.** Explica por que o `push` do array é rápido. Conheça a ideia; o formalismo pode esperar.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 10 min de leitura, 5 min no Me teste e 30 min no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você paga R$ 1.200 de seguro do carro uma vez por ano. Naquele dia, dói. Mas se alguém pergunta "quanto custa o seguro?", você não responde "R$ 1.200 num dia e zero nos outros 364". Você responde "uns R$ 100 por mês". Você **espalhou** o gasto grande pelo ano inteiro, e a média diz mais sobre o seu orçamento do que o pico.

A **complexidade amortizada** é essa conta aplicada a algoritmos. Algumas operações são quase sempre baratas, mas de vez em quando fazem um trabalho enorme. O exemplo que você já viu várias vezes neste estágio: o `push` de um array. Quase sempre ele só escreve na próxima casa livre, O(1). Mas quando o espaço reservado acaba, ele aloca um bloco com o dobro do tamanho e **copia tudo**, O(n). Então o `push` é O(1) ou O(n)? A resposta honesta é: **O(1) amortizado**. Esta nota explica o que isso garante, e por que é uma garantia forte.

É aprofundamento e pode ser pulada no caminho pra primeira vaga, mas ela fecha uma porta que ficou aberta em [[Arrays]], [[Filas]], [[Hash Table]] e [[Deque]], que todas citaram este nome.

## A conta do array que dobra

Faça a conta com um array que começa com capacidade 1 e dobra quando enche. Inserindo 16 itens, quantas cópias acontecem?

```text
push 1:  cabe                              cópias: 0
push 2:  cheio (cap 1) → dobra pra 2, copia 1     1
push 3:  cheio (cap 2) → dobra pra 4, copia 2     2
push 5:  cheio (cap 4) → dobra pra 8, copia 4     4
push 9:  cheio (cap 8) → dobra pra 16, copia 8    8
                                       total:    15
```

Quinze cópias pra 16 inserções. Some 1 + 2 + 4 + 8 + ... até n/2: essa soma dá sempre menos que n. Então, pra n inserções, o trabalho total é n escritas mais menos de n cópias: **menos de 2n**. Dividindo por n, cada `push` custa, em média, menos de 2 passos. Constante. **O(1) amortizado.**

Repare que isso só funciona porque o tamanho **dobra**. Se o array crescesse de 10 em 10 (capacidade 10, 20, 30...), cada redimensionamento copiaria tudo, a cada 10 inserções, e o total seria perto de n²/20: O(n) amortizado por `push`. A multiplicação, e não a soma, é o que deixa as cópias cada vez mais raras. Esse é o detalhe que todo mundo erra ao implementar o próprio array dinâmico.

## Amortizado não é "em média"

Uma distinção que parece pequena e não é. O custo **médio** (como o O(1) da [[Hash Table]]) depende de **sorte**: com uma função de hash boa, os dados se espalham e em média tudo é rápido, mas uma entrada azarada (ou maliciosa) pode fazer tudo colidir e ficar O(n). O custo **amortizado** não depende de sorte nenhuma: é uma **garantia** sobre qualquer sequência de operações. Faça 1 milhão de `push` em qualquer ordem, com quaisquer valores, e o total é no máximo uns 2 milhões de passos. Sempre.

O que o amortizado **não** garante é que cada operação individual seja rápida. Um `push` específico pode demorar (o que copia 1 milhão de itens). Pra quase todo programa, isso não importa, porque o que conta é o tempo total. Mas num sistema que não pode travar nunca, nem por um instante (o controle de um freio, o áudio de uma chamada), esse pico importa, e se escolhem estruturas com garantia por operação.

| Tipo de garantia | O que diz | Exemplo |
|---|---|---|
| Pior caso | **cada** operação custa no máximo isso | heap: inserir O(log n) sempre |
| Amortizado | uma **sequência** de n operações custa no máximo n × isso | `push`: O(1) amortizado |
| Médio | **em média, com dados típicos**, custa isso | hash table: O(1) em média |

## O mesmo truque em outros lugares

Depois que você vê o padrão "caro de vez em quando, barato quase sempre, e o caro fica cada vez mais raro", ele aparece em vários lugares do estágio:

- **Hash table que redimensiona** ([[Hash Table]]): quando o fator de carga passa de 0,75, ela dobra e reespalha tudo, O(n). Mas dobrando, o `set` continua O(1) amortizado.
- **Fila com índice de início** ([[Filas]]): de tempos em tempos ela copia a parte ativa e joga fora o lixo. Como só copia quando metade é lixo, cada item é copiado poucas vezes.
- **Fila com duas pilhas**: cada item entra na pilha de entrada uma vez, é despejado pra de saída uma vez e sai uma vez. O despejo é caro quando acontece, mas cada item é despejado **uma vez só** na vida. O(1) amortizado por operação.
- **Union-Find com compressão de caminho** ([[Union-Find (Disjoint Set)]]): um `encontrar` pode subir uma corrente longa, mas ao fazer isso ele achata a corrente, e as próximas buscas ficam baratas.

O raciocínio é sempre o mesmo, e é o jeito de verificar: **conte quantas vezes cada item pode participar da operação cara, ao longo da vida inteira dele.** Se for um número constante de vezes, o custo amortizado por operação é constante.

## O essencial

1. Amortizado = o custo total de uma sequência de operações dividido pelo número de operações.
2. O `push` é O(1) amortizado porque o array **dobra**: as cópias somam menos de n.
3. Crescer de tamanho fixo (+10) em vez de dobrar deixa o `push` O(n) amortizado.
4. Amortizado é garantia sobre qualquer sequência; "médio" depende dos dados. Nenhum dos dois promete que cada operação é rápida.
5. Pra verificar: quantas vezes cada item pode entrar na operação cara? Se for constante, é O(1) amortizado.

## Agora é com você

Se você fez o `ArrayDinamico` da nota de [[Arrays]], volte nele em 📦 `estruturas-do-zero/src/array-dinamico.ts` ([[Estruturas de Dados do Zero]]) e faça duas versões do crescimento: uma que dobra e uma que soma 10. Insira 100 mil itens em cada e imprima o total de cópias. A que dobra vai ficar abaixo de 200 mil (menos de duas cópias por item); a que soma 10 vai passar de 400 milhões (e talvez você precise esperar). Depois implemente a fila com duas pilhas e conte quantas vezes cada item é movido de uma pilha pra outra ao longo de 10 mil operações misturadas: deve dar no máximo 1 por item. Anote os dois resultados no README.

Daqui, siga pra [[Trade-offs Tempo x Espaço]].

---

## 🧠 Me teste

> [!question]- Por que o `push` de um array dinâmico é O(1) amortizado, se às vezes ele copia o array inteiro?
> Porque o array dobra de capacidade a cada redimensionamento; as cópias somadas ao longo de n inserções dão menos de n, então o custo médio por inserção é constante.

> [!question]- Qual a diferença entre custo amortizado e custo médio?
> O amortizado é uma garantia sobre qualquer sequência de operações, sem depender dos dados. O médio depende de os dados serem típicos (ou de sorte, como numa hash table).

> [!question]- Em que situação o custo amortizado não é suficiente?
> Quando nenhuma operação individual pode demorar, como em sistemas de tempo real (áudio, controle de máquinas), porque o amortizado permite picos isolados.

> [!question]- Por que a fila com duas pilhas é O(1) amortizado?
> Porque cada item é movido da pilha de entrada pra de saída uma única vez na vida; o despejo é caro quando acontece, mas distribuído pelos itens dá custo constante por operação.

> [!question]+ Um array dinâmico que cresce somando 10 posições quando enche (em vez de dobrar). Qual o custo amortizado do `push`?
> - a) O(1), como em qualquer array dinâmico
> - b) O(log n)
> - c) O(n), porque a cada 10 inserções ele copia tudo, e o total de cópias fica perto de n²/20
> - d) O(10)
>
> > [!check]- Resposta
> > **c)** Crescendo de 10 em 10, há n/10 redimensionamentos, cada um copiando até n itens: cerca de n²/20 cópias no total, O(n) por `push`. O O(1) amortizado depende de crescer **multiplicando**, que deixa as cópias cada vez mais raras.

---

## Pra consultar depois

| Estrutura | Operação cara | Por que é amortizado O(1) |
|---|---|---|
| Array dinâmico | dobrar e copiar | cópias somam < n |
| Hash table | dobrar e reespalhar | idem |
| Fila com índice | compactar | só quando metade é lixo |
| Fila com duas pilhas | despejar | cada item é despejado uma vez |

**Pra ler:** o capítulo de array do [Hello Algo](https://www.hello-algo.com/en/chapter_array_and_linkedlist/array/) e o de lista (array dinâmico) logo depois mostram o redimensionamento com desenho, que é a base da conta desta nota.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

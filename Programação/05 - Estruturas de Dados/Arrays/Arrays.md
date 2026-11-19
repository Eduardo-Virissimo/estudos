---
nivel: escrito
revisado:
---

# Arrays

Pense numa fileira de armários numerados num vestiário. Você chega com a ficha "armário 37" e vai direto nele: não abre o 1, o 2, o 3 até achar. Basta saber onde a fileira começa e andar 37 portas. Agora imagine que alguém quer um armário novo **no começo** da fileira. Pra isso, todo mundo precisa mudar as coisas um armário pra frente: o do 1 vai pro 2, o do 2 vai pro 3, e assim até o fim.

Essas duas cenas são o array inteiro. Ele é a estrutura de dados mais usada do mundo, e você usa desde a primeira semana (`[1, 2, 3]`), mas agora a pergunta muda. Não é mais "como eu uso um array", é **"quanto custa cada coisa que eu faço com ele"**. Ler pela posição é instantâneo. Mexer no começo é caro. Se esquecer tudo desta nota, lembre dessas duas frases, porque elas explicam metade das escolhas que você vai fazer no Estágio 2.

Ajuda ter passado por [[Objetos e Arrays no JavaScript]]; aqui a gente olha por baixo do capô.

## Por que ler pela posição é instantâneo

Um array, no sentido clássico, é um bloco **contíguo** de memória: os elementos ficam grudados um no outro, todos do mesmo tamanho. Se o array começa no endereço 1000 e cada número ocupa 8 bytes, o elemento de índice `i` está no endereço:

```text
endereço = início + i × tamanho
arr[0] → 1000
arr[1] → 1008
arr[5] → 1000 + 5 × 8 = 1040
```

Uma conta de multiplicar e uma de somar, não importa se o array tem 10 ou 10 milhões de itens. É por isso que `arr[i]` custa **O(1)**, tempo constante (a notação vem em [[Big O]], mas a ideia é só essa: o custo não cresce com o tamanho).

É também por isso que o índice começa no zero. O índice é a **distância** desde o começo: o primeiro elemento está a zero passos do início.

## O preço de mexer no meio

Agora a fileira de armários do começo, em código:

```ts
const fila = ["ana", "bia", "caio", "duda"];

fila.push("edu");      // no fim: só ocupa o próximo armário livre
fila.unshift("zé");    // no começo: todo mundo anda uma casa pra frente
fila.splice(2, 0, "x"); // no meio: todo mundo DEPOIS da posição 2 anda
```

O `push` é barato porque o fim está livre. Já o `unshift` precisa mover os quatro (ou os quatro milhões) que estão lá. Remover tem o mesmo problema ao contrário: `shift()` tira o primeiro e puxa todo mundo uma casa pra trás.

| Operação | Custo | Por quê |
|---|---|---|
| `arr[i]`, `arr[i] = x` | O(1) | conta de endereço |
| `push`, `pop` | O(1) | mexe só no fim |
| `unshift`, `shift` | O(n) | move todos |
| `splice` no meio | O(n) | move os que vêm depois |
| `includes`, `indexOf`, `find` | O(n) | olha um por um ([[Busca Linear]]) |

Aqui mora a pegadinha mais cara do JavaScript iniciante: usar `shift()` dentro de um laço pra "consumir" uma lista grande. Com mil itens ninguém percebe. Com cem mil, cada `shift` move cem mil elementos, e o laço inteiro vira bilhões de operações. A nota [[Filas]] mostra como fazer isso direito.

## E quando o array enche?

Em linguagens como C ou Java, o array tem **tamanho fixo**: você pede 10 posições e ganha 10, nem uma a mais. Os arrays do JavaScript parecem crescer pra sempre, mas por baixo eles fazem um truque: reservam um espaço maior do que o necessário e, quando ele acaba, **alocam um bloco novo, mais ou menos com o dobro do tamanho, e copiam tudo pra lá**.

Copiar tudo é O(n), então um `push` às vezes é caro. Mas como o tamanho dobra, isso acontece cada vez mais raramente, e na média cada `push` sai O(1). Esse raciocínio de "média ao longo de muitas operações" tem nome, [[Complexidade Amortizada]], e é um dos assuntos mais bonitos do estágio.

Você pode ver o truque construindo o seu próprio array dinâmico, que é justamente o desafio desta nota.

## Os erros de índice

Dois tropeços acompanham arrays pela vida toda. O primeiro é o **erro de um** (*off-by-one*): o último índice é `length - 1`, não `length`.

```ts
const notas = [7, 8, 9];
notas[notas.length];      // undefined: passou do fim
notas[notas.length - 1];  // 9
notas.at(-1);             // 9: o jeito moderno de pegar o último

for (let i = 0; i <= notas.length; i++) {} // <= roda uma vez a mais
for (let i = 0; i < notas.length; i++) {}  // <  certo
```

O JavaScript não reclama quando você lê fora do array, só devolve `undefined`, e o erro aparece três funções depois, longe de onde nasceu. Em outras linguagens, isso derruba o programa na hora (`IndexOutOfBounds`), o que é até melhor.

O segundo é **mudar o array enquanto percorre**. Remover itens dentro de um `for` crescente pula elementos, porque todo mundo anda uma casa pra trás e o `i` anda uma pra frente. Quando precisar filtrar, crie um array novo com `filter`, ou percorra de trás pra frente.

## O essencial

1. Array = bloco contíguo; `arr[i]` é O(1) porque é só uma conta de endereço.
2. Mexer no fim (`push`/`pop`) é barato; no começo ou no meio (`shift`, `unshift`, `splice`) custa O(n).
3. Procurar um valor (`includes`, `indexOf`) é O(n): pra perguntar "existe?" muitas vezes, use um [[Set]].
4. Arrays dinâmicos dobram de tamanho quando enchem, e por isso o `push` é O(1) amortizado.
5. Último índice é `length - 1`; use `.at(-1)`.

## Agora é com você

Construa um `ArrayDinamico` sem usar `push`: a classe guarda um array interno de capacidade fixa (comece com 2), um contador `tamanho`, e os métodos `adicionar(x)`, `obter(i)` e `removerUltimo()`. Quando a capacidade acabar, crie um array interno com o dobro do tamanho e copie os elementos um a um, contando quantas cópias fez no total. Adicione mil itens e imprima o número de cópias: você vai ver que fica perto de mil, e não perto de meio milhão. Esse número é a prova da [[Complexidade Amortizada]]. Faça em 📦 `estruturas-do-zero/src/array-dinamico.ts` ([[Estruturas de Dados do Zero]]). Terminou quando `obter` fora do intervalo lança um erro claro em vez de devolver `undefined`.

Daqui, siga pra [[Matrizes]], [[Strings]] e [[Listas Ligadas]], que resolve justamente o problema de inserir no começo.

---

## 🧠 Me teste

> [!question]- Por que acessar `arr[i]` custa O(1), independentemente do tamanho?
> Porque os elementos ficam contíguos na memória e o endereço é calculado com uma conta: início + i × tamanho do elemento. Não é preciso percorrer nada.

> [!question]- Por que `push` é barato e `unshift` é caro?
> O `push` ocupa a próxima posição livre no fim. O `unshift` precisa deslocar todos os elementos uma posição pra frente pra abrir espaço no começo: O(n).

> [!question]- Como um array "cresce" se a memória dele é um bloco contíguo?
> Quando a capacidade acaba, aloca-se um bloco maior (em geral o dobro) e copia-se tudo. A cópia é cara, mas rara, então o custo médio do `push` é O(1) amortizado.

> [!question]- Você vai perguntar "este id existe?" milhares de vezes numa lista de 100 mil ids. O que muda?
> `includes` é O(n) a cada pergunta. Converter a lista num `Set` uma vez (O(n)) deixa cada pergunta O(1).

> [!question]+ Um laço processa uma lista de 100 mil pedidos com `while (pedidos.length) { const p = pedidos.shift(); ... }`. Qual é o problema?
> - a) Nenhum: `shift` é O(1), como `pop`
> - b) O `while` nunca termina
> - c) Cada `shift` move todos os itens restantes, então o laço todo fica O(n²)
> - d) `shift` não funciona em arrays de objetos
>
> > [!check]- Resposta
> > **c)** Tirar do **começo** obriga a puxar todo mundo uma casa pra trás. Um `shift` é O(n), e n deles dão O(n²). `pop` é O(1) porque mexe no fim. Pra fila de verdade, use um índice de início ou uma lista ligada ([[Filas]]).

---

## Pra consultar depois

| Operação | Custo |
|---|---|
| `arr[i]` / `arr.at(-1)` | O(1) |
| `push` / `pop` | O(1) amortizado |
| `shift` / `unshift` / `splice` | O(n) |
| `includes` / `indexOf` / `find` | O(n) |
| `slice` / `[...arr]` / `concat` | O(n): copiam |
| `sort` | O(n log n) |

**Pra ler e ver:** o capítulo de arrays do [Hello Algo](https://www.hello-algo.com/en/chapter_array_and_linkedlist/array/) desenha a memória contígua e a conta do endereço, com código em TypeScript ao lado. E o [VisuAlgo, em listas](https://visualgo.net/en/list), anima inserir no começo e no fim: veja os elementos andando um por um.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

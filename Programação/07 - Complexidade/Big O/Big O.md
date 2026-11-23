---
nivel: escrito
foco: essencial
revisado:
---

# Big O

**Quanto focar: 🔥 essencial.** Você vai usar pra comparar soluções e vai ser perguntado em toda entrevista técnica. Domine.

Você escreve uma função que acha os nomes repetidos numa lista de inscritos. Testa com 100 nomes: instantâneo. Sobe pro servidor. Um mês depois, a lista tem 200 mil nomes, e a página que chama a sua função leva quatro minutos pra abrir. O código não mudou. O que mudou foi o **tamanho da entrada**, e a sua função, que era instantânea com 100, cresce de um jeito que com 200 mil fica inviável.

A pergunta que essa história ensina a fazer é: **quando a entrada dobra, o que acontece com o tempo?** Dobra também? Quadruplica? Quase não muda? Essa pergunta tem uma linguagem própria, a notação **Big O**, e ela é a ferramenta que liga tudo deste estágio. Cada nota anterior terminou com uma tabela de O(1), O(n), O(log n). Esta nota explica o que esses símbolos querem dizer, como descobrir o de qualquer código só lendo, e por que eles importam mais que o computador ser rápido.

Se esquecer tudo, lembre desta frase: **Big O não mede segundos, mede como o custo cresce quando a entrada cresce.**

## Contar passos, não segundos

Medir em segundos não serve, porque depende do computador, da linguagem, do que mais estava rodando. Em vez disso, conte **quantos passos** o código dá em função do tamanho da entrada, que se chama **n**.

```ts
function primeiro(lista: number[]) {
  return lista[0];                    // 1 passo, não importa o tamanho
}

function soma(lista: number[]) {
  let total = 0;
  for (const x of lista) total += x;  // n passos
  return total;
}

function temRepetido(lista: number[]) {
  for (let i = 0; i < lista.length; i++)
    for (let j = i + 1; j < lista.length; j++)
      if (lista[i] === lista[j]) return true; // ~n²/2 passos no pior caso
  return false;
}
```

O `primeiro` é **O(1)**: o custo é constante. O `soma` é **O(n)**: dobrou a lista, dobrou o trabalho. O `temRepetido` faz cerca de n²/2 comparações, e é **O(n²)**: dobrou a lista, **quadruplicou** o trabalho. Era essa a função da história do começo.

## Jogar fora o que não importa

Por que o `temRepetido` é O(n²) e não O(n²/2)? Porque Big O ignora duas coisas de propósito.

**Constantes multiplicando.** n²/2, 3n² e 100n² são todos O(n²). O que interessa é o **formato** do crescimento: todos quadruplicam quando n dobra. A constante depende da máquina e dos detalhes; o formato, não.

**Termos menores.** n² + n + 1000 é O(n²). Com n = 1 milhão, n² é um trilhão, e o "+ n" (um milhão) e o "+ 1000" são migalhas. Quando n é grande, o maior termo engole o resto.

```text
5n + 3          → O(n)
n²/2 + 10n      → O(n²)
3 log n + 7     → O(log n)
2ⁿ + n³         → O(2ⁿ)
```

Isso tem uma consequência prática que vale saber: Big O diz quem ganha **com entrada grande**. Com entrada pequena, um O(n²) com constante pequena pode ganhar de um O(n log n) com constante grande. É por isso que o `sort` do JavaScript usa insertion sort (O(n²)) pra pedaços pequenos ([[Ordenações Simples (Bubble, Selection, Insertion)]]).

## As classes que você vai ver

Quase todo algoritmo cai numa destas, da mais rápida pra mais lenta:

| Big O | Nome | Exemplo | n = 1 milhão |
|---|---|---|---|
| O(1) | constante | `arr[i]`, `map.get(k)` | 1 |
| O(log n) | logarítmica | [[Busca Binária]] | 20 |
| O(n) | linear | percorrer uma lista | 1 milhão |
| O(n log n) | "n log n" | [[Merge Sort]], `sort` | 20 milhões |
| O(n²) | quadrática | dois laços aninhados | 1 trilhão |
| O(2ⁿ) | exponencial | todos os subconjuntos ([[Backtracking]]) | inimaginável |
| O(n!) | fatorial | todas as permutações | pior ainda |

A coluna da direita é a mais importante da nota. Um computador comum faz algo na casa de **100 milhões a 1 bilhão** de operações simples por segundo. Então, com 1 milhão de itens: O(n log n) termina num piscar de olhos; O(n²) leva de minutos a horas; O(2ⁿ) não termina antes do Sol apagar. Essa conta, feita de cabeça, diz se uma solução vai funcionar **antes** de você escrevê-la.

Uma regra prática de entrevista e de juiz online (LeetCode, Beecrowd): olhe o limite de n no enunciado. Até uns 20, exponencial passa. Até uns 5 mil, O(n²) passa. Até 1 milhão, precisa de O(n log n) ou O(n). Acima disso, O(n), O(log n) ou O(1).

## Ler o Big O direto do código

Quatro regras resolvem quase tudo:

**Laços em sequência se somam.** Um `for` de n, depois outro de n: O(n + n) = O(n).

**Laços aninhados se multiplicam.** Um `for` de n dentro de um `for` de n: O(n × n) = O(n²). Se o de dentro for de m (outra lista), O(n × m).

**Dividir ao meio a cada passo dá log n.** Um laço em que a variável dobra (`i *= 2`) ou o problema cai pela metade roda log n vezes.

**Chamadas de método contam.** Esta é a que esconde os bugs. Um `includes`, `indexOf`, `find`, `slice`, `shift`, `splice` ou `[...arr]` **é um laço**, mesmo sem `for` à vista ([[Busca Linear]]).

```ts
for (const p of pedidos) {            // n
  if (bloqueados.includes(p.cliente)) // × m, escondido no includes
    continue;
}
// O(n × m), não O(n)
```

E pra recursão: desenhe a árvore de chamadas e some o trabalho de cada nível, como nas notas de [[Merge Sort]] e [[Divide and Conquer]].

## Pior caso, e a memória também conta

Quando se diz "a busca linear é O(n)", se fala do **pior caso** (o alvo no fim, ou ausente). Às vezes vale distinguir: o quick sort é O(n log n) no caso médio e O(n²) no pior; a [[Hash Table]] é O(1) em média e O(n) no pior. Na dúvida, o pior caso é o que se usa, porque é a garantia.

E Big O mede também **memória**, não só tempo: quanta memória **extra** o algoritmo usa em função de n. O Two Sum com `Map` é O(n) de tempo e O(n) de espaço; com dois laços, O(n²) de tempo e O(1) de espaço. Escolher entre os dois é o assunto de [[Trade-offs Tempo x Espaço]]. Na recursão, lembre que a pilha de chamadas ocupa memória: uma recursão de profundidade n usa O(n) de espaço, mesmo sem criar array nenhum.

## O essencial

1. Big O mede como o custo cresce com a entrada, não quantos segundos leva.
2. Ignore constantes e termos menores: 3n² + 5n é O(n²).
3. Em sequência soma, aninhado multiplica, cortar ao meio é log n.
4. Métodos como `includes`, `find`, `slice` e `shift` são laços escondidos.
5. Com 1 milhão de itens: n log n é instantâneo, n² leva horas. Faça a conta antes de codar.

## Agora é com você

Volte ao 📦 `estruturas-do-zero` ([[Estruturas de Dados do Zero]]) e confira o Big-O de tempo e de espaço de **todos** os exercícios já feitos, sem olhar a resposta de ninguém, e complete a tabela do README. Depois faça um experimento: escreva três funções que recebem uma lista de n números, uma O(n), uma O(n log n) (com `sort`) e uma O(n²) (dois laços), e meça o tempo de cada uma com n = 1.000, 10.000 e 100.000 usando `performance.now()`. Ponha os números numa tabela e confira se a O(n²) realmente fica cerca de 100 vezes mais lenta a cada 10× de n. Ver isso com os próprios olhos fixa mais que qualquer explicação.

Daqui, siga pra [[Complexidade Amortizada]] e [[Trade-offs Tempo x Espaço]].

---

## 🧠 Me teste

> [!question]- O que o Big O mede?
> Como o custo (tempo ou memória) de um algoritmo cresce quando o tamanho da entrada cresce. Não mede segundos.

> [!question]- Por que 3n² + 5n + 2 é O(n²)?
> Porque Big O ignora constantes multiplicando e termos menores: com n grande, o n² domina, e o formato do crescimento é quadrático.

> [!question]- Qual o Big O de dois laços em sequência, cada um de n, e de dois laços aninhados?
> Em sequência, O(n + n) = O(n). Aninhados, O(n × n) = O(n²).

> [!question]- O enunciado diz que n pode chegar a 1 milhão. Uma solução O(n²) serve?
> Não: seriam cerca de 1 trilhão de operações, horas de execução. É preciso O(n log n) ou melhor.

> [!question]- Por que uma função recursiva pode usar O(n) de memória sem criar nenhum array?
> Porque cada chamada que ainda não terminou ocupa espaço na pilha de chamadas; uma profundidade de n chamadas usa O(n) de memória.

> [!question]+ Qual o Big O de `for (const x of a) { if (b.includes(x)) total++; }`, com `a` de tamanho n e `b` de tamanho m?
> - a) O(n), porque só tem um laço
> - b) O(n + m)
> - c) O(n × m), porque o `includes` é um laço sobre `b` pra cada item de `a`
> - d) O(log m)
>
> > [!check]- Resposta
> > **c)** O `includes` percorre `b` inteiro no pior caso, e ele roda uma vez pra cada item de `a`. Quem respondeu a) contou só os laços visíveis. Com `const setB = new Set(b)` antes, vira O(n + m), a b).

---

## Pra consultar depois

| Padrão no código | Big O |
|---|---|
| Acesso por índice, `Map.get`, `Set.has` | O(1) |
| Corta o problema ao meio a cada passo | O(log n) |
| Um laço sobre a entrada | O(n) |
| `sort` | O(n log n) |
| Laço dentro de laço | O(n²) |
| Testar todos os subconjuntos | O(2ⁿ) |

| Limite de n no enunciado | Precisa de |
|---|---|
| ≤ 20 | até O(2ⁿ) |
| ≤ 5.000 | até O(n²) |
| ≤ 1.000.000 | O(n log n) |
| maior | O(n) ou O(log n) |

**Pra ler e ver:** o [Big O, do Sam Rose](https://samwho.dev/big-o/), é uma explicação interativa e bonita, com animações mostrando cada classe crescendo. A [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) tem num lugar só o custo de cada operação das estruturas e algoritmos clássicos, ótima pra revisar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

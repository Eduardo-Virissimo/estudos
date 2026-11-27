---
nivel: escrito
foco: importante
revisado:
---

# Trade-offs Tempo x Espaço

**Quanto focar: 📌 importante.** É o raciocínio por trás de cache e índice. Entenda bem; aparece em entrevista e em decisão de projeto.

**⏱️ Quanto tempo: cerca de 1h45.** Uns 15 min de leitura, 5 min no Me teste e 1h30 no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Um professor corrige a prova da turma toda e, pra cada aluno, precisa conferir se ele está na lista de quem tem direito a tempo extra. Ele pode, pra cada prova, abrir a lista e procurar o nome: lento, mas não ocupa nada na mesa. Ou pode, antes de começar, fazer um papelzinho com os nomes em ordem alfabética, ou melhor ainda, marcar com um adesivo a pasta de cada aluno com tempo extra. Gasta um tempo antes e um pouco de espaço na mesa, e depois cada conferência é instantânea.

Essa troca, **usar mais memória pra ganhar velocidade** (ou o contrário), é provavelmente a decisão de engenharia mais comum que existe. Você já a fez várias vezes neste estágio: o Two Sum com `Map` em vez de dois laços, o `Set` em vez do `includes`, a [[Programação Dinâmica]] guardando respostas em vez de recalcular. Esta nota dá nome à troca e, mais importante, ensina a decidir **quando** ela vale a pena, porque nem sempre vale.

Ajuda ter passado por [[Big O]].

## O exemplo que resume tudo

Achar se uma lista tem algum número repetido. Três soluções, três trocas diferentes:

```ts
// 1. Comparar todos com todos: O(n²) de tempo, O(1) de espaço
function repetidoForcaBruta(a: number[]): boolean {
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if (a[i] === a[j]) return true;
  return false;
}

// 2. Ordenar e olhar vizinhos: O(n log n) de tempo, O(1) extra se ordenar no lugar
function repetidoOrdenando(a: number[]): boolean {
  const ordenado = a.toSorted((x, y) => x - y); // toSorted copia: O(n) de espaço; sort() seria no lugar
  for (let i = 1; i < ordenado.length; i++)
    if (ordenado[i] === ordenado[i - 1]) return true;
  return false;
}

// 3. Lembrar o que já viu: O(n) de tempo, O(n) de espaço
function repetidoComSet(a: number[]): boolean {
  const vistos = new Set<number>();
  for (const x of a) {
    if (vistos.has(x)) return true;
    vistos.add(x);
  }
  return false;
}
```

Nenhuma é "a certa". Com 1 milhão de números, a primeira não termina a tempo, e a terceira é a mais rápida, mas guarda até 1 milhão de números a mais na memória. Se a memória estiver curta, a segunda é o meio-termo. Se a lista tiver 30 itens, qualquer uma serve, e a mais simples de ler ganha.

## Os quatro jeitos clássicos de trocar memória por tempo

Quase toda troca deste tipo cai em um destes padrões, e reconhecê-los é metade do trabalho.

**Lembrar o que já viu.** Um [[Set]] ou um `Map` que guarda os itens processados pra responder "já vi isso?" em O(1). É o Two Sum, o `Set` de visitados das buscas em grafo, a detecção de repetidos.

**Guardar respostas já calculadas.** Se a mesma pergunta vai ser feita de novo, guarde a resposta. Isso é [[Memoization]] e [[Programação Dinâmica]] dentro de um algoritmo, e é um **cache** num sistema inteiro: o navegador guardando imagens, o servidor guardando o resultado de uma consulta pesada ao banco.

**Pré-calcular.** Faça um trabalho uma vez, antes, pra que muitas perguntas depois fiquem baratas. O exemplo mais bonito é a **soma de prefixos**: pra responder "qual a soma do índice 3 ao 7?" muitas vezes, calcule uma vez um array em que cada posição guarda a soma de tudo até ali.

```ts
const vendas = [5, 3, 8, 2, 7, 4];
const prefixo = [0];                        // prefixo[i] = soma dos i primeiros
for (const v of vendas) prefixo.push(prefixo.at(-1)! + v);
// prefixo = [0, 5, 8, 16, 18, 25, 29]

const somaEntre = (i: number, j: number) => prefixo[j + 1] - prefixo[i]; // O(1)!
somaEntre(1, 3); // 3 + 8 + 2 = 13
```

O(n) de memória e de preparo, e depois cada pergunta é O(1) em vez de O(n). Com mil perguntas, a troca compensa de longe.

**Indexar.** Organize os dados por uma chave pra achar direto. Um `Map` de id pra usuário, em vez de procurar na lista. Nos bancos de dados, é literalmente isso que um **índice** faz: ocupa espaço em disco e deixa as escritas um pouco mais lentas, e em troca a busca sai de O(n) pra O(log n). Você vai criar índices no Estágio 4, e a decisão é exatamente esta nota.

E o caminho inverso também existe: **economizar memória gastando tempo**. Recalcular em vez de guardar, processar um arquivo gigante linha por linha (*streaming*) em vez de carregar tudo, ordenar no lugar em vez de copiar ([[Heap Sort]] em vez de [[Merge Sort]]). Quando a memória é o gargalo (celular, servidor pequeno, arquivo de 50 GB), esse é o lado certo da troca.

## Como decidir

Três perguntas resolvem a maioria dos casos:

1. **Quantas vezes?** Pré-calcular, indexar e cachear só compensam se a pergunta se repete. Uma busca só, numa lista, não justifica montar um `Map`.
2. **De que tamanho?** Com n pequeno, a diferença entre O(n²) e O(n) é invisível, e o código mais simples ganha. A troca só importa quando a entrada é grande ou vai crescer.
3. **Qual recurso está faltando?** Se o usuário espera a página carregar, o tempo é o que falta. Se o servidor está caindo por falta de memória, é a memória. Otimize o que dói.

E um custo que não aparece no Big O, mas aparece no trabalho: **complexidade do código**. Um cache resolve lentidão e cria um problema novo, o de manter a informação guardada atualizada (o famoso "o dado está velho no cache"). Toda estrutura a mais é algo a mais pra manter certo. Às vezes a troca certa é não trocar nada.

## O essencial

1. Muitas vezes dá pra ganhar velocidade usando mais memória, ou o contrário; nenhuma das duas é sempre a certa.
2. Os padrões: lembrar o que já viu (Set/Map), guardar respostas (memo, cache), pré-calcular (soma de prefixos), indexar.
3. Só compensa se a pergunta se repete e a entrada é grande.
4. Otimize o recurso que está faltando de verdade: tempo ou memória.
5. Cada estrutura extra é código a mais pra manter certo; às vezes o simples ganha.

## Agora é com você

Este é o fechamento do Estágio 2, então o desafio é revisar. Escolha cinco exercícios do seu caderno em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]) e, pra cada um, escreva no README uma segunda solução que faça a troca **ao contrário** da que você fez (se usou `Map`, faça sem memória extra; se fez sem, faça com), com o Big-O de tempo e espaço das duas. Depois resolva o [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) com soma de prefixos e o [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/), que é um pré-cálculo esperto. Quando a tabela do README tiver 30 linhas e você conseguir defender cada escolha, o critério do estágio está cumprido: siga pro Estágio 3 no [[Roadmap]].

---

## 🧠 Me teste

> [!question]- Dê dois exemplos de trocar memória por tempo.
> Usar um Set pra responder "já vi?" em O(1) em vez de procurar na lista; guardar respostas já calculadas (memo ou cache); pré-calcular somas de prefixo; criar um índice.

> [!question]- O que é soma de prefixos e quando ela compensa?
> Um array em que cada posição guarda a soma de todos os elementos até ali; permite responder a soma de qualquer trecho em O(1). Compensa quando há muitas perguntas de soma sobre os mesmos dados.

> [!question]- Quando faz sentido gastar mais tempo pra economizar memória?
> Quando a memória é o recurso escasso: arquivos maiores que a memória (processar por streaming), dispositivos pequenos, servidores no limite.

> [!question]- Quais as três perguntas pra decidir uma troca entre tempo e espaço?
> Quantas vezes a operação se repete, qual o tamanho da entrada, e qual recurso está faltando de verdade.

> [!question]+ Você precisa responder uma única vez se o id 4217 está numa lista de 50 ids. Qual a melhor escolha?
> - a) Converter a lista num Set e usar `has`, porque é O(1)
> - b) Ordenar a lista e fazer busca binária, porque é O(log n)
> - c) Criar uma soma de prefixos
> - d) Usar `includes` direto: com uma pergunta só e 50 itens, montar outra estrutura não compensa
>
> > [!check]- Resposta
> > **d)** Montar o Set custa O(n), o mesmo que o `includes`, e ordenar custa O(n log n), mais que procurar. As estruturas extras só se pagam quando a pergunta se repete muitas vezes. Quem respondeu a) olhou só o custo do `has`, sem o custo de montar.

---

## Pra consultar depois

| Padrão | Gasta | Ganha |
|---|---|---|
| Set/Map de vistos | O(n) memória | "já vi?" em O(1) |
| Memo / cache | memória por resposta | não recalcular |
| Soma de prefixos | O(n) memória + preparo | soma de trecho em O(1) |
| Índice (banco) | disco + escrita mais lenta | busca O(log n) |
| Streaming | tempo (processa aos poucos) | memória constante |

**Pra ler:** o capítulo sobre complexidade de espaço do [Hello Algo](https://www.hello-algo.com/en/chapter_computational_complexity/space_complexity/) fecha a parte de complexidade com exemplos de cada classe de memória e uma discussão da troca entre tempo e espaço.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

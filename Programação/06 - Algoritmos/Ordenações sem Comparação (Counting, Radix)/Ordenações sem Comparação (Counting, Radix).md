---
nivel: escrito
foco: bom saber
revisado:
---

# Ordenações sem Comparação (Counting, Radix)

**Quanto focar: 💤 bom saber.** Servem pra casos bem específicos. Pode deixar pra depois da primeira vaga.

Uma escola tem 50 mil alunos e quer a lista ordenada pelas notas da prova, que vão de 0 a 10, inteiras. Você poderia usar o [[Merge Sort]] e comparar notas. Mas pense de outro jeito: só existem **11 notas possíveis**. Pegue 11 caixinhas, uma pra cada nota, e passe pela lista uma vez jogando cada aluno na caixa da sua nota. Depois, esvazie as caixas em ordem: a do 0, a do 1, até a do 10. Pronto, ordenado, sem comparar um aluno com outro nem uma vez.

Existe um resultado famoso da computação que diz: **nenhuma ordenação que funciona comparando pares de itens pode ser mais rápida que O(n log n)** no pior caso. As notas anteriores bateram nesse limite. As ordenações desta nota escapam dele porque **não comparam**: elas usam o **valor** do item como endereço. O preço é que só funcionam em casos específicos (inteiros num intervalo pequeno, ou chaves de tamanho fixo).

Esta nota é aprofundamento e pode ser pulada no caminho pra primeira vaga. Mas a ideia de "usar o valor como índice" é útil muito além de ordenar, e vale conhecer.

## Counting Sort: conte, depois espalhe

O jeito mais simples das caixinhas: conte quantas vezes cada valor aparece e depois reescreva o array.

```ts
function countingSort(nums: number[], max: number): number[] {
  const contagem = new Array(max + 1).fill(0);
  for (const x of nums) contagem[x]++;           // quantos de cada valor?

  const saida: number[] = [];
  for (let v = 0; v <= max; v++) {
    for (let k = 0; k < contagem[v]; k++) saida.push(v);
  }
  return saida;
}

countingSort([3, 0, 2, 3, 1, 0], 3); // [0, 0, 1, 2, 3, 3]
```

O custo é uma passada pela lista (n) mais uma passada pelas caixas (k, o tamanho do intervalo): **O(n + k)**. Com 50 mil notas de 0 a 10, isso é umas 50 mil operações, contra umas 800 mil de um O(n log n).

Mas repare no `k`. Se os valores vão de 0 a 1 bilhão, o array de contagem tem 1 bilhão de posições, mesmo que você só tenha 10 números pra ordenar. O counting sort só vale quando **k é pequeno perto de n**: idades, notas, dias do mês, códigos de categoria.

Na vida real você ordena objetos (alunos), não só números. A versão completa e **estável** faz uma soma acumulada nas contagens pra descobrir em que posição começa cada nota, e depois coloca cada aluno na sua posição, percorrendo de trás pra frente pra manter a ordem dos empates. A estabilidade é o que permite a próxima ideia.

## Radix Sort: dígito por dígito

E se os números forem grandes, como CPFs ou ids de 6 dígitos? O intervalo é enorme, mas cada **dígito** só vai de 0 a 9. O radix sort ordena **um dígito de cada vez**, começando pelo menos importante (as unidades), usando um counting sort estável em cada passada.

```text
         [170, 45, 75, 90, 802, 24, 2, 66]
unidade → [170, 90, 802, 2, 24, 45, 75, 66]
dezena  → [802, 2, 24, 45, 66, 170, 75, 90]
centena → [2, 24, 45, 66, 75, 90, 170, 802]
```

Parece mágica que funcione, e o segredo é a estabilidade. Quando a passada das dezenas encontra o 802 e o 2 (os dois com dezena 0), ela os mantém na ordem que a passada anterior deixou. Cada passada ordena por um dígito sem bagunçar o trabalho das anteriores.

```ts
function radixSort(nums: number[]): number[] {
  let a = [...nums];
  const max = Math.max(...a);
  for (let casa = 1; Math.floor(max / casa) > 0; casa *= 10) {
    const baldes: number[][] = Array.from({ length: 10 }, () => []);
    for (const x of a) baldes[Math.floor(x / casa) % 10].push(x); // estável: mantém a ordem de chegada
    a = baldes.flat();
  }
  return a;
}
```

O custo é O(d × (n + 10)), em que d é o número de dígitos do maior. Com d fixo (ids de 6 dígitos), é O(n). Essa versão só aceita inteiros não negativos; negativos e decimais pedem adaptações.

## Quando usar, de verdade

Quase nunca no código do dia a dia: o `sort` pronto é ótimo e funciona pra tudo. Mas a ideia aparece em lugares práticos:

- **Contar frequência com um array** em vez de `Map`, quando as chaves são inteiros pequenos. Contar as 26 letras de um texto em inglês com `new Array(26).fill(0)` e `ch.charCodeAt(0) - 97` é counting sort sem a parte de ordenar.
- **Agrupar em baldes** quando a chave tem poucos valores: pedidos por status, tarefas por prioridade (baixa, média, alta). Três listas e uma passada.
- **Ordenar muitos inteiros de tamanho fixo** em sistemas de alto desempenho (bancos de dados, placas de vídeo usam radix sort).

| | Counting | Radix |
|---|---|---|
| Tempo | O(n + k) | O(d × (n + base)) |
| Memória | O(k) | O(n + base) |
| Funciona com | inteiros num intervalo pequeno | inteiros (ou textos) de tamanho fixo |
| Estável | sim (versão completa) | sim |

## O essencial

1. Ordenações por comparação não passam de O(n log n); as sem comparação escapam usando o valor como endereço.
2. Counting sort: conte cada valor e reescreva; O(n + k), só vale com k pequeno.
3. Radix sort: ordene dígito por dígito, do menos significativo, com uma ordenação estável em cada passada.
4. A estabilidade é o que faz o radix funcionar.
5. No dia a dia, a ideia vale mais que o algoritmo: array de contagem e baldes por categoria.

## Agora é com você

Resolva o [Sort Colors](https://leetcode.com/problems/sort-colors/) do LeetCode (ordenar um array de 0, 1 e 2) com counting sort, em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]). Depois resolva o [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) em O(n) usando baldes: o índice do balde é a frequência (que vai de 1 a n), e cada balde guarda os números com aquela frequência. Anote no topo por que isso é O(n) e não O(n log n). Bônus: adicione o `radixSort` à tabela de comparações do README (ele faz zero comparações, e esse é o ponto).

Daqui, siga pra [[DFS (Busca em Profundidade)]].

---

## 🧠 Me teste

> [!question]- Por que o counting sort consegue ser mais rápido que O(n log n)?
> Porque não compara itens entre si: usa o valor de cada item como índice num array de contagem. O limite de O(n log n) só vale pra ordenações por comparação.

> [!question]- Quando o counting sort é uma má ideia?
> Quando o intervalo de valores (k) é muito maior que a quantidade de itens: o array de contagem fica enorme e quase vazio.

> [!question]- Por que o radix sort precisa de uma ordenação estável em cada passada?
> Pra não desfazer o que as passadas anteriores ordenaram: itens com o mesmo dígito atual precisam continuar na ordem dos dígitos menos significativos.

> [!question]- Dê um uso do dia a dia da ideia do counting sort.
> Contar letras com um array de 26 posições, ou agrupar itens por uma categoria com poucos valores (status, prioridade) em baldes numa passada só.

> [!question]+ Você precisa ordenar 1 milhão de idades de pessoas (de 0 a 120). Qual o custo do counting sort?
> - a) O(n log n), como qualquer ordenação
> - b) O(n²), por causa dos dois laços
> - c) O(n + k), praticamente O(n), porque k = 121 é minúsculo perto de n
> - d) O(k²)
>
> > [!check]- Resposta
> > **c)** Uma passada pra contar (n) e uma pelas 121 caixas (k). Os dois laços aninhados do final não fazem n × k operações: o laço de dentro, somado, roda n vezes no total. Quem respondeu b) contou laços em vez de contar operações.

---

## Pra consultar depois

| Algoritmo | Use quando |
|---|---|
| Counting | inteiros num intervalo pequeno (notas, idades) |
| Radix | inteiros de tamanho fixo (ids, CEPs) |
| Baldes | agrupar por uma chave de poucos valores |

**Pra ver:** o [VisuAlgo, em ordenação](https://visualgo.net/en/sorting), tem "Counting Sort" e "Radix Sort" no menu do topo, com as caixinhas animadas. O capítulo de radix sort do [Hello Algo](https://www.hello-algo.com/en/chapter_sorting/radix_sort/) explica a estabilidade com desenhos.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

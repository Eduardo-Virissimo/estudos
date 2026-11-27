---
nivel: escrito
foco: importante
revisado:
---

# Matrizes

**Quanto focar: 📌 importante.** Aparecem em grade, tabuleiro e alguns exercícios de entrevista. Entenda bem como percorrer; no trabalho são raras.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 15 min de leitura, 5 min no Me teste e 1h no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Um tabuleiro de jogo da velha, uma planilha, o mapa de um joguinho em que cada quadrado é grama, parede ou água, a tela do seu computador (que é uma grade de pixels). Tudo isso tem duas dimensões: linha e coluna. E todos são guardados do mesmo jeito, com uma **matriz**, que no JavaScript é simplesmente um array de arrays.

A ideia parece simples demais pra merecer uma nota, e é mesmo, até a hora em que você precisa olhar os **vizinhos** de uma casa. Aí aparecem os três problemas que derrubam todo mundo: trocar linha com coluna, sair da borda do tabuleiro, e uma armadilha do `fill` que faz todas as linhas mudarem ao mesmo tempo. Esta nota é sobre esses três. Ajuda ter passado por [[Arrays]].

O exemplo que vai voltar até o fim: um mapa pequeno, em que `#` é parede e `.` é chão.

```text
. . # .
. # . .
. . . #
```

## Linha primeiro, coluna depois

Uma matriz é um array em que cada item é outro array, uma linha:

```ts
const mapa: string[][] = [
  [".", ".", "#", "."],   // linha 0
  [".", "#", ".", "."],   // linha 1
  [".", ".", ".", "#"],   // linha 2
];

mapa[1][1];       // "#": linha 1, coluna 1
mapa.length;      // 3 linhas
mapa[0].length;   // 4 colunas
```

A regra é sempre `matriz[linha][coluna]`, e vale decorar como se fosse lei. A confusão clássica é pensar em coordenadas de gráfico, `(x, y)`, em que o x (horizontal) vem primeiro. Numa matriz, o primeiro índice escolhe a **linha** (anda na vertical) e o segundo escolhe a **coluna** (anda na horizontal). Se você chamar as variáveis de `l` e `c`, ou `linha` e `coluna`, em vez de `x` e `y`, a confusão some.

Percorrer é um laço dentro de outro:

```ts
for (let l = 0; l < mapa.length; l++) {
  for (let c = 0; c < mapa[l].length; c++) {
    if (mapa[l][c] === "#") console.log(`parede em (${l}, ${c})`);
  }
}
```

Uma matriz de `L` linhas e `C` colunas tem `L × C` casas, e percorrer tudo custa O(L × C). Numa matriz quadrada de lado n, isso é O(n²), e é por isso que laços aninhados aparecem tanto quando se fala de [[Big O]].

## A armadilha do fill

Você quer criar um tabuleiro 3×3 vazio, e escreve o que parece óbvio:

```ts
const tab = Array(3).fill(Array(3).fill(" "));
tab[0][0] = "X";
console.log(tab);
// [["X"," "," "], ["X"," "," "], ["X"," "," "]]  ← o X apareceu nas três!
```

O `fill` coloca **o mesmo valor** em todas as posições. Como o valor é um array, e arrays são guardados por referência (lembra de [[Objetos e Arrays no JavaScript]]?), as três linhas são **a mesma linha**. Mexer numa é mexer em todas.

O jeito certo é criar uma linha nova pra cada posição, com `Array.from`, que chama a função de novo a cada item:

```ts
const tab = Array.from({ length: 3 }, () => Array(3).fill(" "));
tab[0][0] = "X"; // só a primeira linha muda
```

Dentro da linha, o `fill(" ")` está tudo bem, porque textos e números são copiados por valor.

## Os vizinhos, e a borda do mapa

Quase todo problema de grade pergunta alguma coisa sobre vizinhos: em quais casas o personagem pode andar, quantas minas há em volta (o campo minado), qual o próximo estado de uma célula. O truque que deixa o código limpo é guardar as direções num array, em vez de escrever quatro `if`s:

```ts
const DIRECOES = [
  [-1, 0], // cima
  [1, 0],  // baixo
  [0, -1], // esquerda
  [0, 1],  // direita
];

function vizinhosLivres(mapa: string[][], l: number, c: number): [number, number][] {
  const livres: [number, number][] = [];
  for (const [dl, dc] of DIRECOES) {
    const nl = l + dl;
    const nc = c + dc;
    const dentro = nl >= 0 && nl < mapa.length && nc >= 0 && nc < mapa[0].length;
    if (dentro && mapa[nl][nc] === ".") livres.push([nl, nc]);
  }
  return livres;
}

vizinhosLivres(mapa, 0, 0); // [[1, 0], [0, 1]]
```

A linha do `dentro` é a mais importante deste código. Sem ela, olhar o vizinho de cima da linha 0 lê `mapa[-1]`, que é `undefined`, e `undefined[0]` derruba o programa com `TypeError: Cannot read properties of undefined`. A ordem também importa: confira se está dentro **antes** de ler a casa, porque o `&&` para no primeiro falso e protege a leitura.

Quer as diagonais também, como no campo minado? Acrescente as quatro diagonais (`[-1,-1]`, `[-1,1]`, `[1,-1]`, `[1,1]`) ao array. O resto do código não muda, e essa é a vantagem.

Essa função é a peça que falta pra resolver labirintos: com ela, [[BFS (Busca em Largura)]] acha o caminho mais curto e [[DFS (Busca em Profundidade)]] conta "ilhas". Uma grade é um [[Grafos|grafo]] disfarçado, em que cada casa é um nó e os vizinhos são as arestas.

## Girar e transpor

Dois movimentos aparecem em exercício toda hora. **Transpor** é trocar linhas por colunas: a linha 0 vira a coluna 0.

```ts
function transpor<T>(m: T[][]): T[][] {
  return m[0].map((_, c) => m.map((linha) => linha[c]));
}
```

E **girar 90° no sentido horário** é transpor e depois inverter cada linha. Vale testar no papel com uma matriz 2×2 pra se convencer: `[[1,2],[3,4]]` transposta é `[[1,3],[2,4]]`, e com as linhas invertidas vira `[[3,1],[4,2]]`, exatamente o original girado.

## O essencial

1. Matriz é array de arrays: `m[linha][coluna]`, sempre nessa ordem.
2. Nunca crie matriz com `Array(n).fill([])`: todas as linhas viram a mesma. Use `Array.from({ length: n }, () => ...)`.
3. Guarde as direções num array e confira a borda **antes** de ler o vizinho.
4. Percorrer uma matriz n×n é O(n²).
5. Uma grade é um grafo: vizinhos são arestas.

## Agora é com você

Escreva o **Jogo da Vida** de Conway no terminal. Cada casa de uma grade 10×10 está viva ou morta. A cada geração: uma célula viva com 2 ou 3 vizinhas vivas (contando as diagonais) continua viva, uma morta com exatamente 3 vizinhas nasce, e todas as outras morrem ou continuam mortas. O cuidado principal é calcular a geração nova numa **matriz nova**, sem mexer na atual enquanto conta os vizinhos. Comece com um "planador" (`.#.`, `..#`, `###` no canto) e imprima 10 gerações; se ele andar na diagonal, deu certo. Faça em 📁 `Programação/Práticas/Matrizes/` ou no 📦 `estruturas-do-zero/exercicios/`.

Daqui, siga pra [[Strings]] e, quando chegar lá, use a função de vizinhos em [[BFS (Busca em Largura)]].

---

## 🧠 Me teste

> [!question]- Em `m[2][5]`, o que é o 2 e o que é o 5?
> O 2 é a linha (terceira linha) e o 5 é a coluna (sexta coluna). Linha sempre primeiro.

> [!question]- Por que o `dentro` precisa vir antes de ler `mapa[nl][nc]`?
> Porque se `nl` estiver fora (por exemplo -1), `mapa[nl]` é `undefined` e ler `[nc]` dele lança TypeError. O `&&` para no primeiro falso e evita a leitura.

> [!question]- Como girar uma matriz 90° no sentido horário?
> Transpor (linhas viram colunas) e depois inverter a ordem dos elementos de cada linha.

> [!question]- No Jogo da Vida, por que calcular a geração nova numa matriz separada?
> Se você alterar a matriz atual enquanto percorre, as células seguintes contam vizinhos já atualizados, e o resultado sai errado.

> [!question]+ `const t = Array(3).fill(Array(3).fill(0)); t[1][1] = 5;` Como fica `t`?
> - a) Só `t[1][1]` vale 5
> - b) A coluna 1 inteira vale 5: `t[0][1]`, `t[1][1]` e `t[2][1]`
> - c) A linha 1 inteira vale 5
> - d) Dá erro, porque `fill` não aceita arrays
>
> > [!check]- Resposta
> > **b)** As três linhas são **o mesmo array**, então mudar a posição 1 de uma muda a posição 1 de todas, e isso aparece como a coluna inteira. A correção é `Array.from({ length: 3 }, () => Array(3).fill(0))`.

---

## Pra consultar depois

| Tarefa | Código |
|---|---|
| Criar n×m | `Array.from({ length: n }, () => Array(m).fill(0))` |
| Linhas / colunas | `m.length` / `m[0].length` |
| Está dentro? | `l >= 0 && l < m.length && c >= 0 && c < m[0].length` |
| 4 direções | `[[-1,0],[1,0],[0,-1],[0,1]]` |
| Transpor | `m[0].map((_, c) => m.map((linha) => linha[c]))` |
| Copiar sem compartilhar | `m.map((linha) => [...linha])` |

**Pra ler:** o [Jogo da Vida na Wikipédia](https://pt.wikipedia.org/wiki/Jogo_da_vida) tem as regras e animações de padrões famosos (planador, pulsar) pra conferir o seu. E o problema [Rotate Image](https://leetcode.com/problems/rotate-image/) do LeetCode é o treino perfeito de girar matriz.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

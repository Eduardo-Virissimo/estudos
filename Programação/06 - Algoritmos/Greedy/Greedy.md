---
nivel: escrito
foco: importante
revisado:
---

# Greedy

**Quanto focar: 📌 importante.** É simples quando funciona e cai em entrevista. Entenda quando dá certo e quando não dá.

Você trabalha no caixa e precisa dar R$ 0,87 de troco com o menor número de moedas. Ninguém faz conta nenhuma: pega a maior moeda que cabe (50 centavos), depois a maior que cabe no que sobrou (25), depois 10, e 1, e 1. Cinco moedas, sem pensar. E está certo, é o mínimo possível.

Esse jeito de decidir tem nome: **guloso** (*greedy*). A cada passo, você escolhe o que parece **melhor agora**, sem olhar pra frente e sem voltar atrás. É o algoritmo mais simples de escrever e, quando funciona, o mais rápido. O problema é aquele "quando funciona". Na nota de [[Programação Dinâmica]], o mesmo troco com moedas de 1, 3 e 4 centavos fez o guloso errar: pra dar 6, ele pega 4 + 1 + 1 (três moedas), quando 3 + 3 dá duas.

Então a nota tem duas partes, e a segunda importa mais que a primeira. Como montar um algoritmo guloso. E como **desconfiar** dele: saber que ele pode estar errado e procurar o contraexemplo antes de confiar.

## A escolha local

Todo guloso tem o mesmo formato: **ordene** (ou organize) as opções pelo critério certo e pegue uma por uma, enquanto couber.

```ts
function trocoGuloso(moedas: number[], valor: number): number[] {
  const usadas: number[] = [];
  for (const m of [...moedas].sort((a, b) => b - a)) { // da maior pra menor
    while (valor >= m) {
      usadas.push(m);
      valor -= m;
    }
  }
  return usadas;
}

trocoGuloso([50, 25, 10, 5, 1], 87); // [50, 25, 10, 1, 1]: certo
trocoGuloso([4, 3, 1], 6);           // [4, 1, 1]: errado, o ótimo é [3, 3]
```

Mesmo código, uma resposta certa e uma errada. Com as moedas do real (e da maioria dos países), o guloso sempre acerta, porque o sistema de moedas foi desenhado pra isso. Com moedas arbitrárias, não. A diferença não está no código, está no **problema**, e é por isso que guloso pede cuidado.

## A agenda de reuniões, onde o guloso brilha

Um problema em que o guloso funciona, e que mostra como o **critério** é tudo. Você tem uma sala e uma lista de reuniões, cada uma com início e fim. Quantas reuniões, no máximo, cabem na sala sem sobreposição?

Existem três critérios "óbvios" pra escolher qual reunião pegar primeiro:

- **A mais curta?** Falha: uma reunião curta no meio pode bloquear duas longas, uma antes e uma depois dela.
- **A que começa mais cedo?** Falha: uma reunião que começa às 8h e vai até as 18h bloqueia o dia inteiro.
- **A que termina mais cedo?** Funciona.

```ts
type Reuniao = { inicio: number; fim: number };

function maximoDeReunioes(rs: Reuniao[]): Reuniao[] {
  const escolhidas: Reuniao[] = [];
  let livreAPartirDe = -Infinity;
  for (const r of [...rs].sort((a, b) => a.fim - b.fim)) { // termina mais cedo primeiro
    if (r.inicio >= livreAPartirDe) {
      escolhidas.push(r);
      livreAPartirDe = r.fim;
    }
  }
  return escolhidas;
}
```

Por que "termina mais cedo" funciona? Porque a reunião que termina primeiro é a que **deixa mais tempo livre** pro resto. Qualquer solução ótima pode trocar a sua primeira reunião por essa sem perder nada, já que ela termina antes ou junto. Esse argumento de troca ("dá pra trocar a escolha da solução ótima pela minha sem piorar") é o jeito clássico de provar que um guloso está certo.

O custo é o da ordenação, O(n log n), e depois uma passada. Comparado a testar todos os subconjuntos de reuniões (2ⁿ), é uma diferença absurda.

## Como desconfiar de um guloso

Aqui está a habilidade que vale mais que qualquer algoritmo desta nota. Antes de confiar numa ideia gulosa, **tente quebrá-la** com um exemplo pequeno. É o que a lista de critérios da agenda fez: pra cada critério, procurar um caso em que ele erra.

Uma receita prática:

1. Escreva a ideia gulosa em uma frase ("pegue sempre a maior moeda").
2. Invente 3 ou 4 exemplos **pequenos e maldosos**, que tentem enganar a regra: valores repetidos, um item enorme, itens que se bloqueiam.
3. Resolva cada exemplo **à mão**, testando todas as possibilidades, e compare com o guloso.
4. Achou um contraexemplo? A ideia está errada; pense em [[Programação Dinâmica]] ou [[Backtracking]]. Não achou? Tente argumentar por que a escolha local nunca atrapalha o futuro.

Uma forma ainda melhor de fazer o passo 3: escreva uma versão de força bruta, que testa tudo, e compare as duas respostas em centenas de entradas aleatórias pequenas. Isso se chama **teste de estresse**, e acha bugs de guloso que nenhuma intuição acharia.

| Problema | Guloso funciona? | Critério |
|---|---|---|
| Troco com moedas do real | sim | maior moeda primeiro |
| Troco com moedas quaisquer | **não** | precisa de PD |
| Máximo de reuniões numa sala | sim | termina mais cedo primeiro |
| Mochila com itens fracionáveis (pode levar meio saco de arroz) | sim | maior valor por quilo |
| Mochila com itens inteiros | **não** | precisa de PD |
| Árvore geradora mínima | sim | aresta mais barata ([[Árvore Geradora Mínima (Kruskal e Prim)\|Kruskal]]) |
| Caminho mais curto com pesos ≥ 0 | sim | o mais próximo primeiro ([[Dijkstra]]) |

Repare nas duas últimas linhas: o Kruskal e o Dijkstra são gulosos que funcionam, cada um com uma prova por trás.

## Guloso ou programação dinâmica?

As duas resolvem problemas de "o melhor". A diferença: o guloso faz **uma** escolha a cada passo e nunca reconsidera; a PD **considera todas** as escolhas de cada passo e guarda as melhores. A PD é mais segura e mais lenta; o guloso é mais rápido e só funciona quando a escolha local nunca atrapalha o futuro.

Na prática, em entrevista ou num problema novo: se você tem uma ideia gulosa, tente quebrá-la por dois minutos. Se não quebrar e você conseguir explicar por que ela funciona, use. Se quebrar, vá pra PD.

## O essencial

1. Guloso: a cada passo, a escolha que parece melhor agora, sem voltar atrás.
2. Quase sempre é "ordene pelo critério certo e pegue enquanto couber"; o critério é tudo.
3. Ele pode estar errado. Tente quebrá-lo com exemplos pequenos antes de confiar.
4. Agenda: ordene pelo fim, não pela duração nem pelo início.
5. Quando o guloso falha, a resposta costuma ser programação dinâmica.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva [Jump Game](https://leetcode.com/problems/jump-game/), [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) (a agenda, ao contrário: quantas remover?) e [Gas Station](https://leetcode.com/problems/gas-station/). Pra cada um, escreva no comentário a frase da ideia gulosa e um exemplo pequeno que você tentou usar pra quebrá-la. Depois faça o teste de estresse do troco: escreva o `trocoGuloso` e o `trocoMinimo` da nota de [[Programação Dinâmica]], gere conjuntos de moedas aleatórios e valores de 1 a 50, e imprima o primeiro caso em que os dois discordam. Terminou quando o seu teste de estresse acha o contraexemplo sozinho.

Daqui, siga pra [[Sliding Window]].

---

## 🧠 Me teste

> [!question]- O que caracteriza um algoritmo guloso?
> A cada passo ele faz a escolha que parece melhor naquele momento, sem considerar as consequências futuras e sem voltar atrás.

> [!question]- Por que o critério "termina mais cedo" funciona na agenda de reuniões?
> Porque a reunião que termina primeiro é a que deixa mais tempo livre pras outras; qualquer solução ótima pode trocar a sua primeira reunião por ela sem perder nada.

> [!question]- Como testar se uma ideia gulosa está certa?
> Procurando contraexemplos pequenos e maldosos, resolvendo-os à mão (ou com força bruta) e comparando; o teste de estresse automatiza isso com entradas aleatórias.

> [!question]- Qual a diferença entre guloso e programação dinâmica?
> O guloso faz uma escolha por passo e nunca reconsidera; a PD considera todas as escolhas de cada subproblema e guarda as melhores. A PD é mais segura, o guloso é mais rápido quando funciona.

> [!question]+ Pra escolher o máximo de reuniões sem sobreposição numa sala, qual critério guloso funciona?
> - a) Pegar primeiro a que começa mais cedo
> - b) Pegar primeiro a mais curta
> - c) Pegar primeiro a que termina mais cedo
> - d) Pegar primeiro a que tem menos conflitos com as outras
>
> > [!check]- Resposta
> > **c)** A que começa mais cedo pode durar o dia todo e bloquear tudo; a mais curta pode estar no meio e bloquear duas. A que termina mais cedo deixa o máximo de tempo livre pro resto, e dá pra provar que ela nunca piora a solução.

---

## Pra consultar depois

| Passo | O que fazer |
|---|---|
| 1 | escreva a regra gulosa em uma frase |
| 2 | invente 3 a 4 exemplos pequenos e maldosos |
| 3 | resolva à mão ou com força bruta e compare |
| 4 | quebrou? PD ou backtracking. Não quebrou? argumente por troca |

**Pra ler:** o capítulo de algoritmos gulosos do [Hello Algo](https://www.hello-algo.com/en/chapter_greedy/greedy_algorithm/) traz o exemplo do troco que falha, com desenho, e discute quando o guloso é garantido.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

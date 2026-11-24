---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Lógica de Programação

**Quanto focar: 🔥 essencial.** É a base de tudo que vem depois. Se travar aqui, trava em todo o resto, então pratique até quebrar problemas em passos com naturalidade.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Peça pra alguém fazer um sanduíche, e a pessoa faz. Agora tente escrever as instruções pra um robô que só faz **exatamente** o que está escrito. "Passe a manteiga no pão." O robô pega o pote fechado e esfrega no pão. Você não disse pra abrir o pote. Nem pra pegar uma faca. Nem qual lado do pão.

Essa brincadeira, que professores de programação adoram fazer em sala, mostra o centro de tudo: **o computador não entende o que você quer.** Ele segue passos exatos, um de cada vez, sem adivinhar nada e sem preencher lacunas. A **lógica de programação** é a habilidade de pegar um problema e quebrar em passos pequenos e sem ambiguidade, e de escrever esses passos em português estruturado antes de pensar em linguagem.

Isso importa mais do que parece. Quando alguém trava num exercício, quase nunca é por causa da sintaxe. É porque ainda não sabe, em português, **como** resolver. E a boa notícia é que lógica não é dom: é treino. Esta é a primeira nota da trilha, então não precisa de nada antes.

## Uma receita sem "a gosto"

Um **algoritmo** é uma sequência **finita** de passos **claros** que resolve um problema. A palavra parece técnica, mas você segue algoritmos o tempo todo: uma receita de bolo, o caminho até a casa de um amigo, o manual de montar um móvel.

A diferença está no grau de precisão. Numa receita, "coloque sal a gosto" funciona, porque você sabe provar e decidir. O computador não sabe o que é "a gosto". Pra ele, precisa ser "coloque 5 g de sal". Cada passo tem que ser algo que dá pra executar sem interpretar.

É por isso que programar é difícil no começo: você passou a vida explicando coisas pra pessoas, que preenchem as lacunas sozinhas. O computador não preenche nada. Um bom teste: "organizar a lista" não é um passo, é um desejo. "Comparar cada par de vizinhos e trocar de lugar se estiverem fora de ordem" é um passo. **Se você não consegue escrever o passo em detalhe, ainda não sabe resolver o problema** — e tudo bem, é aí que o trabalho começa.

## Três perguntas antes de qualquer código

Quase todo programa tem três partes. Antes de escrever uma linha, responda estas três perguntas. Pense num programa que calcula a média de três notas:

| Pergunta | Exemplo: média de 3 notas |
|---|---|
| **Entrada:** o que eu recebo? | 3 números |
| **Processamento:** o que eu faço com isso? | somar e dividir por 3 |
| **Saída:** o que eu devolvo? | a média, e se passou (≥ 7) |

Parece óbvio demais pra escrever. Mas responder isso no começo evita o erro mais comum de todos: começar a codar sem saber direito o que o programa precisa receber e devolver.

Com as respostas em mãos, você escreve o **pseudocódigo**: a solução em português estruturado, sem se preocupar com a sintaxe de nenhuma linguagem.

```text
INÍCIO
  LER nota1, nota2, nota3
  media ← (nota1 + nota2 + nota3) / 3
  SE media >= 7 ENTÃO
    MOSTRAR "Aprovado com", media
  SENÃO
    MOSTRAR "Reprovado com", media
  FIM SE
FIM
```

Só depois disso você traduz pra uma linguagem. E aqui vem o segredo: a tradução é a parte fácil. Se o pseudocódigo está certo, o código sai quase sozinho. Por isso, quando você travar no código, a melhor coisa a fazer é voltar pro pseudocódigo. Se não consegue explicar a solução em português, não vai conseguir em TypeScript.

## Só três peças

Agora uma ideia que, quando cai a ficha, é libertadora. **Todo algoritmo do mundo**, do mais simples ao mais complexo, do cálculo de média ao Google Maps, é feito de **três peças só**:

A **sequência**: um passo depois do outro. Ler, depois calcular, depois mostrar. A **decisão**: fazer uma coisa ou outra, dependendo de uma condição (`SE ... ENTÃO ... SENÃO`); no código, isso vira as [[Estruturas Condicionais]]. E a **repetição**: fazer a mesma coisa várias vezes (`ENQUANTO ... FAÇA`); no código, as [[Estruturas de Repetição]].

Quando um problema parecer grande demais, lembre disso: você só precisa descobrir qual combinação dessas três peças resolve ele.

Cuidado pra não confundir com a lista anterior, porque são duas listas de três. Entrada, processamento e saída são as **partes** de um programa: **o que** ele faz. Sequência, decisão e repetição são as **estruturas** que montam o algoritmo: **como** ele faz.

## Onde os bugs moram

Se você testar seu programa só com o caso normal, ele vai parecer certo. O bug quase nunca está no caso normal. Ele mora nas **bordas**: o zero, o número negativo, a lista vazia, o maior valor possível, o primeiro e o último item, dois valores iguais.

Olhe o problema do ano bissexto, que é traiçoeiro justamente por isso. A regra do mundo real é: um ano é bissexto se for divisível por 4, **exceto** os divisíveis por 100, **a menos que** também sejam divisíveis por 400.

```text
LER ano
SE (ano divisível por 400) ENTÃO bissexto
SENÃO SE (ano divisível por 100) ENTÃO não bissexto
SENÃO SE (ano divisível por 4) ENTÃO bissexto
SENÃO não bissexto
```

Antes de codar, escolha anos que testam **cada regra**: 2024 (sim, divisível por 4), 1900 (não, divisível por 100), 2000 (sim, divisível por 400) e 2023 (não). Se você testasse só com 2024, uma solução errada, que só checa "divisível por 4", passaria sem você perceber.

Só agora, o código:

```ts
const ano = 1900;
const bissexto = ano % 400 === 0 || (ano % 4 === 0 && ano % 100 !== 0);
console.log(bissexto); // false
```

Repare na ordem das coisas: **os casos de teste vieram antes do código.** Essa é a semente de uma prática inteira, o [[TDD (Test Driven Development)|TDD]]. A regra prática pra levar daqui: sempre teste **um caso normal e dois casos de borda**.

## O debugger mais barato do mundo

Existe uma técnica que parece coisa de escola, mas que você vai usar a vida inteira: o **teste de mesa**. É executar o algoritmo **no papel**, anotando o valor de cada variável a cada passo, como se você fosse o computador.

| Passo | nota1 | nota2 | nota3 | media | Saída |
|---|---|---|---|---|---|
| ler | 8 | 6 | 7 | – | – |
| calcular | 8 | 6 | 7 | 7 | – |
| decidir | 8 | 6 | 7 | 7 | "Aprovado com 7" |

Parece trabalhoso demais pra um exemplo desse tamanho, e é. Mas quando um laço não faz o que você espera, montar essa tabela volta por volta quase sempre mostra exatamente onde o raciocínio desviou. É o debugger mais barato que existe: só precisa de papel.

E sobre o treino: os primeiros 20 problemas doem. De verdade. Mas do 50º em diante você começa a **reconhecer padrões** ("ah, isso é um acumulador", "isso é um SE dentro de um laço"), e problemas novos passam a parecer variações de problemas velhos. Sites de exercícios como o Beecrowd e o Exercism existem pra esse treino.

## O essencial

1. O computador não adivinha: cada passo precisa ser executável sem interpretação.
2. Antes do código: entrada, processamento, saída. Depois, pseudocódigo.
3. Todo algoritmo é sequência, decisão e repetição.
4. Teste um caso normal e dois de borda (zero, vazio, negativo, iguais).
5. Travou? Volte pro pseudocódigo, ou faça um teste de mesa.

## Agora é com você

Sem computador, só com papel: escreva três algoritmos em pseudocódigo e faça o teste de mesa de cada um. O **troco**: dado o valor da compra e o valor pago, diga o troco e se o dinheiro foi suficiente. O **maior de três**: receba 3 números e mostre o maior, sem usar nenhum "máximo" pronto. E a **tabuada**: receba um número e mostre a tabuada dele de 1 a 10. Você terminou quando cada um tiver entrada, processamento e saída escritos, o pseudocódigo, e um teste de mesa com pelo menos um caso de borda (pagou exatamente o valor; dois números iguais).

Daqui, siga pra [[Variáveis e Tipos de Dados]], e depois pras [[Estruturas Condicionais]] e [[Estruturas de Repetição]], onde as três peças viram código.

---

## 🧠 Me teste

> [!question]- O que é um algoritmo?
> Uma sequência finita de passos claros e sem ambiguidade que resolve um problema.

> [!question]- Quais são as três partes de quase todo programa?
> Entrada (o que recebo), processamento (o que faço) e saída (o que devolvo).

> [!question]- Quais são as três estruturas básicas que formam qualquer algoritmo?
> Sequência, decisão (se/senão) e repetição (enquanto/para).

> [!question]- Pra que serve o pseudocódigo?
> Pra pensar na solução sem brigar com a sintaxe da linguagem. Se o pseudocódigo está certo, traduzir pro código é fácil.

> [!question]- O que é teste de mesa?
> Executar o algoritmo no papel, anotando o valor de cada variável a cada passo, pra achar erros antes de programar.

> [!question]- Por que testar casos de borda?
> Porque os bugs aparecem nos extremos (zero, vazio, negativo, valores iguais), não no caso normal.

> [!question]+ Quais são as três estruturas que formam qualquer algoritmo?
> - a) Variável, função e classe
> - b) Sequência, decisão e repetição
> - c) Entrada, processamento e saída
> - d) Pseudocódigo, fluxograma e código
>
> > [!check]- Resposta
> > **b)** Sequência (um passo depois do outro), decisão (`if`) e repetição (laços). Entrada/processamento/saída são as **partes de um programa**, não as estruturas: é a confusão mais comum.

---

## Pra consultar depois

| Pseudocódigo | Vira em código |
|---|---|
| `LER x` | Entrada (`process.argv`, `readline`) |
| `MOSTRAR x` | `console.log(x)` |
| `x ← 5` | `let x = 5` |
| `SE ... ENTÃO ... SENÃO` | `if (...) { } else { }` |
| `ENQUANTO cond FAÇA` | `while (cond) { }` |
| `PARA i DE 1 ATÉ 10` | `for (let i = 1; i <= 10; i++) { }` |

**Pra praticar e ler:** o [Beecrowd](https://judge.beecrowd.com/) tem centenas de problemas de lógica em português, com correção automática, perfeito pro treino dos primeiros 50. O [Exercism, na trilha JavaScript](https://exercism.org/tracks/javascript), tem exercícios curtos e mentoria gratuita. E *Lógica de Programação*, de André Forbellone, é o clássico brasileiro do pseudocódigo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

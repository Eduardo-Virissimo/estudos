---
nivel: escrito
revisado:
---

# Estruturas de Repetição

Você tem uma lista com o XP de cada sessão de estudo e quer saber o total. Com quatro sessões, dá pra escrever `xps[0] + xps[1] + xps[2] + xps[3]`. Com quarenta, já fica ridículo. Com uma lista que cresce todo dia, é impossível: você nem sabe quantos itens ela vai ter.

Os **laços** (*loops*) existem pra isso: repetir um bloco de código quantas vezes for preciso, sem você escrever a mesma coisa várias vezes. Existem três principais, e cada um responde a uma pergunta diferente. O `for...of` é pra quando você quer fazer algo **com cada item** de uma lista. O `for` clássico é pra quando importa **contar** quantas vezes. E o `while` é pra quando a repetição depende de uma **condição que muda** ("enquanto o jogador tiver vida...").

E a melhor notícia da nota: quase todo laço que você vai escrever na vida segue um de **quatro padrões**. Quando você aprende a reconhecer eles, escrever um laço vira algo automático. Se ainda não leu, as [[Estruturas Condicionais]] ajudam aqui.

## Para cada item da lista

Na maior parte do tempo, o que você quer é fazer alguma coisa com cada item de uma lista. É pra isso que existe o `for...of`:

```ts
const tarefas = ["estudar", "treinar", "dormir"];
for (const tarefa of tarefas) {
  console.log(tarefa);
}
```

Dá pra ler em voz alta: "para cada `tarefa` **de** `tarefas`, faça...". Em cada volta, `tarefa` vale um item, na ordem. Você não precisa saber quantos itens tem, nem mexer com índice: o laço cuida disso.

Se precisar da posição também, o `.entries()` entrega o par `[índice, item]`:

```ts
for (const [i, tarefa] of tarefas.entries()) {
  console.log(`${i + 1}. ${tarefa}`); // 1. estudar, 2. treinar...
}
```

Cuidado com um primo de nome parecido, o `for...in`. Ele percorre as **chaves** de um objeto, e num array entrega os índices como texto (`"0"`, `"1"`), não os itens. É uma confusão que gera bugs estranhos. Pra listas, a resposta é sempre `for...of`.

## Quando o número importa

Às vezes o que importa não são os itens, é **contar**: de 1 a 10, as próximas 5 páginas, de 2 em 2. Pra isso existe o `for` clássico, que tem três partes separadas por `;`:

```ts
for (let i = 1; i <= 5; i++) {
  console.log(`Volta ${i}`);
}
//   início      condição   passo
```

O **início** (`let i = 1`) roda uma vez só, antes de tudo. A **condição** (`i <= 5`) é testada antes de cada volta, e quando ela fica falsa, o laço acaba. E o **passo** (`i++`, que soma 1) roda no fim de cada volta.

Esse laço tem uma armadilha tão comum que ganhou nome: o erro de **um a mais ou um a menos** (*off-by-one*). Arrays começam no índice **0**, então o último índice é `lista.length - 1`. Se você escreve `for (let i = 0; i <= lista.length; i++)`, com `<=`, o laço dá uma volta a mais e tenta ler um item que não existe, recebendo `undefined`. Use `<`, ou melhor ainda, use `for...of` e esqueça índices.

## Enquanto valer

O `while` repete **enquanto** uma condição for verdadeira. É o laço pra quando você não sabe de antemão quantas voltas vão ser:

```ts
let vida = 100;
while (vida > 0) {
  vida -= 30;
  console.log(`Vida: ${vida}`);
}
// 70, 40, 10, -20 → para
```

O uso mais comum no dia a dia é o **menu que se repete** até o usuário pedir pra sair:

```ts
while (true) {
  const op = (await rl.question("[a]dicionar, [l]istar, [s]air: ")).trim();
  if (op === "s") break;
  // ... trata as outras opções
}
```

Um `while (true)` assusta, mas com um `break` claro, logo no topo, é perfeitamente aceitável.

Existe ainda o `do...while`, que roda **pelo menos uma vez** antes de testar a condição. É útil quando você precisa mostrar alguma coisa antes de perguntar se continua.

E aqui mora o erro clássico dos laços: o **laço infinito**. Se nada lá dentro muda a condição, ela nunca fica falsa, e o programa trava. Um `while (i < 10)` sem nenhum `i++` dentro roda pra sempre. Se acontecer, não entre em pânico: `Ctrl + C` no [[Terminal]] para o programa.

## Os quatro padrões

Esta é a parte mais importante da nota. Quase todo laço que percorre uma lista está fazendo uma destas quatro coisas, e quando você reconhece o padrão, o laço se escreve sozinho:

```ts
const xps = [120, 80, 200, 50];

// 1. SOMAR: começa em 0 e vai somando
let soma = 0;
for (const xp of xps) soma += xp;              // 450

// 2. CONTAR: começa em 0 e soma 1 quando a condição bate
let acima100 = 0;
for (const xp of xps) if (xp > 100) acima100++; // 2

// 3. MAIOR (ou menor): guarda o recorde e troca quando acha um melhor
let maior = -Infinity;
for (const xp of xps) if (xp > maior) maior = xp; // 200

// 4. LISTA NOVA: começa vazia e vai adicionando
const dobrados: number[] = [];
for (const xp of xps) dobrados.push(xp * 2);   // [240, 160, 400, 100]
```

Repare que os quatro têm a mesma forma: **uma variável criada antes do laço** (o acumulador) e **uma atualização dentro dele**. O problema do começo da nota, somar o XP, é o padrão 1.

No padrão 3, um detalhe: por que `-Infinity` e não `0`? Porque se todos os números da lista forem negativos, nenhum é maior que 0, e o resultado sai 0, um número que nem está na lista. Comece em `-Infinity`, ou no primeiro item.

Mais pra frente, em [[Objetos e Arrays no JavaScript]], você vai trocar esses laços por métodos prontos: `reduce` pra somar, `filter` pra selecionar, `map` pra criar uma lista nova. Mas entenda o laço primeiro, porque é exatamente isso que esses métodos fazem por dentro.

## Controlando o laço por dentro

Duas palavras deixam você interferir no laço enquanto ele roda:

```ts
for (const n of [3, 8, -1, 5]) {
  if (n < 0) break;          // break: para o laço inteiro
  if (n % 2 === 0) continue; // continue: pula pra próxima volta
  console.log(n);            // só mostra 3
}
```

O `break` sai do laço na hora. O `continue` abandona só a volta atual e segue pra próxima.

Um conselho que vai te poupar de um bug misterioso: **não mexa na lista enquanto percorre ela.** Remover ou adicionar itens durante o `for...of` bagunça a contagem, e o laço pula elementos ou nunca termina. Se precisa tirar itens, monte uma lista nova só com o que fica (o padrão 4).

E dá pra colocar um laço dentro do outro, por exemplo pra montar uma tabuada:

```ts
for (let linha = 1; linha <= 3; linha++) {
  let texto = "";
  for (let col = 1; col <= 3; col++) texto += `${linha * col}\t`;
  console.log(texto);
}
```

Só fique de olho no custo: o laço de dentro roda inteiro a cada volta do de fora. Duas listas de 1.000 itens viram 1 milhão de voltas. A nota de [[Big O]] fala disso.

## O essencial

1. `for...of` pra cada item; `for` clássico pra contar; `while` pra "enquanto valer".
2. Quatro padrões: somar, contar, achar o maior, montar lista nova. Acumulador antes, atualização dentro.
3. Índices vão de `0` a `length - 1`: use `<`, não `<=`.
4. Laço infinito é a condição que nunca muda. `Ctrl + C` salva.

## Agora é com você

Faça o jogo **"adivinhe o número"**. Sorteie um número de 1 a 100 com `Math.floor(Math.random() * 100) + 1`. Num `while`, peça um palpite e responda "maior", "menor" ou "acertou". Conte as tentativas e mostre no fim. E se o usuário digitar algo que não é número, avise e **não** conte como tentativa (use `continue`). Você terminou quando der pra jogar até acertar, uma entrada inválida não quebrar nada, e o total de tentativas estiver certo.

Daqui, siga pras [[Funções]] e depois pra [[Objetos e Arrays no JavaScript]], onde os métodos `map`, `filter` e `reduce` substituem os quatro padrões.

---

## 🧠 Me teste

> [!question]- Quando usar `for`, `for...of` e `while`?
> `for` quando sabe quantas vezes (contador); `for...of` pra percorrer os itens de uma lista; `while` quando depende de uma condição que muda durante a execução.

> [!question]- Qual a diferença entre `break` e `continue`?
> `break` sai do laço inteiro; `continue` pula o resto da volta atual e vai pra próxima.

> [!question]- Qual a diferença entre `for...of` e `for...in`?
> `for...of` dá os valores (use em arrays); `for...in` dá as chaves de um objeto.

> [!question]- O que causa um laço infinito?
> Uma condição que nunca fica falsa, normalmente porque a variável testada não muda dentro do laço.

> [!question]- Qual o índice do último elemento de um array?
> `lista.length - 1`, porque os índices começam em 0.

> [!question]- Quando usar `do...while`?
> Quando o bloco precisa rodar pelo menos uma vez antes do teste (ex: mostrar um menu antes de perguntar se continua).

> [!question]- Por que começar o "maior" em `-Infinity` e não em `0`?
> Porque se todos os números forem negativos, nenhum supera o 0 e o resultado sai errado.

> [!question]+ `for (const x in ["a", "b"])` percorre o quê?
> - a) `"a"` e `"b"`
> - b) `"0"` e `"1"` (os índices, como string)
> - c) `0` e `1` (números)
> - d) Dá erro em array
>
> > [!check]- Resposta
> > **b)** `for...in` percorre as **chaves**. Pra pegar os valores de um array, use `for...of`.

---

## Pra consultar depois

| Sintaxe | Quando |
|---|---|
| `for (let i = 0; i < n; i++)` | n vezes |
| `for (const x of lista)` | Cada item |
| `for (const [i, x] of lista.entries())` | Item + índice |
| `for (const chave in objeto)` | Chaves de um objeto |
| `while (cond)` | Enquanto valer |
| `do { } while (cond)` | Pelo menos uma vez |
| `break` / `continue` | Sair / pular a volta |

**Pra ler:** o capítulo [Loops: while and for](https://javascript.info/while-for) do javascript.info tem exercícios no fim de cada seção, ótimos pra treinar. O guia de [laços e iterações do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Loops_and_iteration) é a referência em português.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: essencial
revisado:
---

# Strings

**Quanto focar: 🔥 essencial.** Manipular texto está em todo lugar, e é tema frequente de entrevista. Domine os métodos e o custo de concatenar.

**Quanto tempo:** cerca de 1h30: 15 min de leitura, 10 min nos exercícios, 5 min no Me teste e 1h no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você está fazendo o cadastro de um site e precisa de três regrinhas: o nome de usuário não pode ter espaço, a busca tem que achar "José" quando alguém digita "jose", e o contador de caracteres da bio tem que bater com o que a pessoa vê. Três coisas que parecem triviais. As três têm uma pegadinha, e a terceira pega até gente experiente.

Uma string é uma **sequência de caracteres**, e em muitos sentidos se comporta como um array: tem `length`, tem índice, dá pra percorrer. Mas tem duas diferenças que mudam tudo. Ela é **imutável**: você nunca altera uma string, sempre cria outra. E o que você chama de "caractere" nem sempre é o que o computador chama. Esta nota é sobre essas duas diferenças e sobre os padrões que aparecem em quase todo exercício de string. Ajuda ter passado por [[Arrays]].

## Strings não mudam

Tente trocar uma letra:

```ts
let nome = "gato";
nome[0] = "p";       // não faz nada (e o TypeScript reclama)
console.log(nome);   // "gato"

nome = "p" + nome.slice(1); // cria uma string NOVA: "pato"
```

Todo método de string (`toUpperCase`, `replace`, `trim`, `slice`) devolve uma string nova e deixa a original como estava. Isso é bom: você pode passar uma string pra qualquer função sem medo de ela ser alterada lá dentro.

Mas tem um custo escondido. Criar uma string nova significa copiar os caracteres. Em muitas linguagens, montar um texto grande concatenando dentro de um laço (`texto += pedaco`) copia o texto inteiro a cada volta, e o laço vira O(n²). Os motores de JavaScript modernos otimizam bastante esse caso, mas o hábito profissional, que funciona em qualquer linguagem, é juntar os pedaços num array e unir no fim:

```ts
const linhas: string[] = [];
for (const t of tarefas) linhas.push(`- ${t.titulo}`);
const relatorio = linhas.join("\n");
```

## Tratar o texto antes de comparar

A busca de "jose" por "José" falha porque, pro computador, `"José" === "jose"` é falso duas vezes: a maiúscula e o acento. O padrão é **normalizar** os dois lados antes de comparar:

```ts
function normalizar(texto: string): string {
  return texto
    .trim()                          // tira espaços nas pontas
    .toLowerCase()                   // tudo minúsculo
    .normalize("NFD")                // separa a letra do acento: "é" → "e" + "´"
    .replace(/[̀-ͯ]/g, ""); // apaga os acentos soltos
}

normalizar("  José ") === normalizar("jose"); // true
```

O `normalize("NFD")` é a parte mágica: ele decompõe cada letra acentuada em duas, a letra pura e o acento, e aí uma [[Regex]] apaga os acentos. Pra **ordenar** nomes em português, não use `<` (ele coloca "Ágata" depois de "Zé"), use `a.localeCompare(b, "pt-BR")`.

## Quando um caractere não é um caractere

Agora a terceira regrinha, a do contador da bio:

```ts
"oi".length;   // 2
"👍".length;   // 2 ?!
"👍🏽".length;  // 4 ?!?!
```

O `length` não conta o que você vê. Ele conta **unidades de código UTF-16**, os pedacinhos de 16 bits em que o JavaScript guarda o texto. Letras comuns cabem em um pedaço. Emojis e vários símbolos precisam de dois, e emojis com tom de pele ou bandeiras são vários emojis colados.

Na maioria dos exercícios, com texto em inglês sem acento, isso nunca aparece. Mas num produto de verdade aparece, e o sintoma é cortar uma string no meio de um emoji (`texto.slice(0, 280)`) e aparecer um quadradinho com `?`. Pra contar o que o usuário vê, há duas ferramentas:

```ts
[..."👍"].length; // 1: o spread separa por "ponto de código", resolve a maioria dos emojis

const seg = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
[...seg.segment("👍🏽")].length; // 1: conta o que o olho vê
```

Guarde a ideia, não a API: **`length` conta pedaços de memória, não letras**. Quando o número tiver que bater com o que aparece na tela, desconfie.

## Os três padrões que resolvem metade dos exercícios

Quase todo problema de string cai num destes.

**Contar frequência.** "Estas duas palavras são anagramas?" vira "elas têm as mesmas letras com as mesmas quantidades?". Um `Map` de letra para contagem resolve em O(n):

```ts
function contar(texto: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of texto) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return freq;
}
```

Ordenar as duas palavras e comparar também funciona (`[...a].sort().join("")`), e é mais curto, mas custa O(n log n) por causa do sort.

**Dois ponteiros.** "É palíndromo?" compara a primeira letra com a última, a segunda com a penúltima, andando das pontas pro meio. Sem criar string nova, O(n) de tempo e O(1) de memória. A nota [[Two Pointers]] é inteira sobre isso.

**Janela deslizante.** "Qual a maior substring sem letra repetida?" mantém um trecho que cresce pela direita e encolhe pela esquerda. É a [[Sliding Window]].

Repare que nenhum dos três é "um método de string". São jeitos de pensar que funcionam em qualquer sequência, e é por isso que strings aparecem tanto em entrevista.

## O essencial

1. Strings são imutáveis: todo método devolve uma string nova.
2. Pra montar texto grande, junte num array e use `join`.
3. Antes de comparar texto de gente, normalize: `trim`, `toLowerCase`, `normalize("NFD")` e tire os acentos.
4. `length` conta unidades UTF-16, não o que se vê: emoji pode valer 2 ou mais.
5. Frequência com `Map`, palíndromo com dois ponteiros, substring com janela deslizante.

## Agora é com você

Escreva três funções e um teste pra cada. `ehPalindromo(frase)`, que ignora espaços, maiúsculas e acentos (então "Socorram-me, subi no ônibus em Marrocos" é palíndromo), usando dois ponteiros em vez de inverter a string. `saoAnagramas(a, b)`, com `Map` de frequência, sem `sort`. E `slug(titulo)`, que transforma "Estudar Promises & Async!" em `estudar-promises-async` (minúsculas, sem acento, só letras e números, separados por um hífen só). Você terminou quando as três passam nos casos estranhos: string vazia, só espaços, e um emoji no meio. Faça em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), e anote o Big-O de cada uma no comentário do topo.

Daqui, siga pra [[Listas Ligadas]], e volte pra [[Two Pointers]] e [[Sliding Window]] quando chegar nos algoritmos.

---

## 🧠 Me teste

> [!question]- O que significa dizer que strings são imutáveis em JavaScript?
> Que não dá pra alterar uma string existente: `s[0] = "x"` não faz nada, e todo método (`replace`, `toUpperCase`...) devolve uma string nova.

> [!question]- Como fazer "José" e "jose" serem considerados iguais numa busca?
> Normalizar os dois: `toLowerCase()`, `normalize("NFD")` pra separar os acentos e `replace(/[̀-ͯ]/g, "")` pra removê-los. Depois comparar.

> [!question]- Duas formas de checar se duas palavras são anagramas, e o custo de cada?
> Ordenar as letras das duas e comparar: O(n log n). Contar a frequência de cada letra com um `Map` e comparar as contagens: O(n).

> [!question]- Por que `texto.slice(0, 280)` pode estragar uma mensagem?
> Porque `slice` corta por unidades UTF-16; se cair no meio de um emoji (que ocupa 2 ou mais), sobra meio caractere, que aparece como símbolo quebrado.

> [!question]+ Quanto vale `"👍".length` em JavaScript?
> - a) `2`
> - b) `1`
> - c) `4`
> - d) `0`, porque emoji não é texto
>
> > [!check]- Resposta
> > **a)** O `length` conta unidades de código UTF-16, e esse emoji precisa de duas. Pra contar o que se vê, use `[..."👍"].length` (dá 1) ou `Intl.Segmenter`.

> [!question]+ Você precisa ordenar `["Zé", "ana", "Ágata"]` em ordem alfabética do português. O que usar?
> - a) `lista.sort()`
> - b) `lista.sort((a, b) => a < b ? -1 : 1)`
> - c) `lista.sort((a, b) => a.length - b.length)`
> - d) `lista.sort((a, b) => a.localeCompare(b, "pt-BR"))`
>
> > [!check]- Resposta
> > **d)** O `sort()` padrão e o `<` comparam códigos de caractere: maiúsculas vêm antes de minúsculas e letras acentuadas vão pro fim. O `localeCompare` com `"pt-BR"` segue a ordem do dicionário.

---

## Pra consultar depois

| Tarefa | Código |
|---|---|
| Pedaço | `s.slice(inicio, fim)` |
| Tem / começa / termina | `s.includes(x)` / `s.startsWith(x)` / `s.endsWith(x)` |
| Separar e juntar | `s.split(",")` / `lista.join(",")` |
| Inverter | `[...s].reverse().join("")` |
| Tirar acento | `s.normalize("NFD").replace(/[̀-ͯ]/g, "")` |
| Ordem do dicionário | `a.localeCompare(b, "pt-BR")` |
| Contar o que se vê | `[...s].length` |

**Pra ler:** o capítulo [Strings](https://javascript.info/string) do javascript.info cobre os métodos, a imutabilidade e a comparação, com exercícios curtos no fim. Pra entender de vez a história dos emojis, a [página do MDN sobre String](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String) explica UTF-16 e unidades de código.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

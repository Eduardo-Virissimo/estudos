---
nivel: escrito
revisado:
---

# Ler Mensagens de Erro

Você roda o programa e o terminal se enche de texto vermelho. Dez linhas, caminhos de arquivo estranhos, palavras em inglês, números soltos. O primeiro impulso é fechar o terminal, copiar tudo e colar em algum lugar perguntando "o que é isso?".

Só que tem uma coisa que separa quem está começando de quem já se vira sozinho, e não é decorar mais comandos. É que **o iniciante entra em pânico com o erro, e o experiente lê.** A mensagem de erro não é uma bronca. É o computador tentando te contar exatamente o que deu errado, e quase sempre ele conta.

Quase toda mensagem de erro diz três coisas: **o tipo** do erro, **o que** aconteceu, e **onde**. Ler com calma resolve a maioria dos problemas antes de você precisar perguntar pra alguém. Esta nota ensina a ler, e depois ensina o raciocínio pra ir do erro até o bug.

## As três partes

Olhe um erro de verdade, sem pressa:

```text
/home/ana/tarefas/src/main.ts:12
  console.log(tarefa.titulo.toUpperCase());
                            ^
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at listar (/home/ana/tarefas/src/main.ts:12:29)      ← onde explodiu
    at main (/home/ana/tarefas/src/main.ts:20:3)         ← quem chamou
    at ...node:internal...                               ← ignore
```

Parece um bloco assustador, mas ele tem só três informações.

O **tipo** é `TypeError`: você usou um valor do jeito errado. O **o quê** é a frase depois dos dois pontos: `Cannot read properties of undefined (reading 'toUpperCase')`. Traduzindo: "não consigo ler propriedades de `undefined` (tentando ler `toUpperCase`)". Ou seja, você tentou chamar `.toUpperCase()` em alguma coisa que é `undefined`, e olhando a linha, essa coisa é `tarefa.titulo`. E o **onde** é `main.ts:12:29`: arquivo `main.ts`, linha 12, coluna 29. O erro até desenha um `^` apontando o lugar.

As linhas que começam com `at` são a **pilha de chamadas** (a [[Stack Trace]]): o caminho que o programa percorreu até chegar no erro. A de cima é onde explodiu; a de baixo é quem chamou essa função; e assim por diante. Muitas vezes a pilha tem dezenas de linhas, e a dica de ouro é: **procure a primeira linha que é do seu código**, e ignore o que vem de `node:internal` ou `node_modules`.

O erro mais comum na hora de ler é ler só a primeira palavra. "Deu TypeError" não ajuda ninguém, nem você. A resposta está na frase inteira. Leia tudo, devagar, em voz alta se precisar.

## O erro mostra o sintoma, não a causa

Esta é a parte mais importante da nota. Repare neste código:

```ts
const tarefas = [{ titulo: "Estudar" }, { titulo: "Treinar" }];
for (let i = 0; i <= tarefas.length; i++) {
  console.log(tarefas[i].titulo);
}
```

```text
Estudar
Treinar
TypeError: Cannot read properties of undefined (reading 'titulo')
    at main.ts:3:26
```

O erro aponta a linha 3. Mas olhe pra linha 3: ela está certa! `tarefas[i].titulo` é exatamente o que você queria escrever. Então vamos investigar, como um detetive.

**O quê?** `tarefas[i]` era `undefined` quando o código tentou ler o `.titulo`. **Quando?** O programa mostrou os dois títulos e só depois quebrou, então foi na terceira volta, com `i = 2`. **Por quê?** Porque `tarefas[2]` não existe: a lista só tem as posições 0 e 1. O laço vai até `i <= length`, uma volta a mais do que devia. E a **correção** está na **linha 2**, não na 3: `i < tarefas.length`, ou um `for...of`, que nem tem esse problema.

Esse é o raciocínio que você vai usar a vida inteira: **o erro aparece onde o valor ruim foi usado, não onde ele foi criado.** A mensagem mostra o sintoma. Você volta pelo caminho até achar onde o valor ficou errado.

E daí vem uma tentação perigosa. Colocar `?.` em tudo (`tarefas[i]?.titulo`) faz o erro sumir. Mas o bug continua lá, só que agora escondido: o programa segue em frente com dados errados, e o problema vai aparecer de outro jeito, mais tarde, mais difícil de achar. Descubra **por que** o valor veio vazio.

## Um roteiro pra quando travar

Quando um erro aparecer, siga esta ordem, e você vai se surpreender com quantas vezes ele se resolve antes do passo 5:

1. **Leia a mensagem inteira.**
2. **Vá na linha indicada.** No [[VS Code]], `Ctrl + clique` no caminho do erro abre o arquivo direto na linha certa.
3. **Pergunte:** que valor eu esperava aqui, e que valor tem de verdade? Um `console.log` logo antes da linha responde.
4. **Reproduza com o menor caso possível.** Vá tirando tudo o que não importa, até o erro aparecer em 3 linhas. Muitas vezes, nesse processo, você já descobre a causa.
5. **Pesquise a mensagem exata**, sem os seus nomes de variável: `"Cannot read properties of undefined" reading`.
6. **Ainda travado?** Pergunte com contexto: a mensagem inteira, o trecho do código, e o que você já tentou. A nota [[Como Fazer Boas Perguntas]] fala disso.

Isso vale também pra IA. Colar o erro sem ler tira de você justamente a habilidade que esta nota quer desenvolver. Leia primeiro. Se precisar de ajuda, mande a mensagem **inteira** e o trecho do código, e não só "deu erro".

## Os erros que você mais vai ver

Alguns erros aparecem tanto que vale conhecer a tradução de cada um. Saber o que eles querem dizer já te leva até a metade da solução:

| Erro | Tradução | Causa típica |
|---|---|---|
| `TypeError: Cannot read properties of undefined (reading 'x')` | tentou ler `.x` de algo vazio | dado não carregou, índice errado |
| `TypeError: x is not a function` | chamou algo que não é função | nome errado, import errado, esqueceu de exportar |
| `ReferenceError: x is not defined` | essa variável não existe aqui | erro de digitação, fora do [[Escopo]] |
| `SyntaxError: Unexpected token` | código mal escrito | faltou `}`, `)` ou vírgula; JSON inválido |
| `RangeError: Maximum call stack size exceeded` | recursão sem fim | faltou o caso base ([[Recursão]]) |
| `Error: ENOENT: no such file or directory` | o arquivo não existe | caminho errado, pasta atual errada |
| `Error: Cannot find module 'x'` | o import não foi encontrado | pacote não instalado (`npm install`) ou caminho errado |

Uma observação sobre bibliotecas: muitas vezes o erro estoura lá dentro do `node_modules`, e dá vontade de culpar a biblioteca. Mas quase sempre o culpado é o valor que **você** passou pra ela. Ache a primeira linha sua na pilha.

## Os erros do TypeScript

O TypeScript tem uma vantagem enorme: ele avisa **antes** do programa rodar, sublinhando em vermelho no editor (ou no `tsc`). A mensagem tem outra cara:

```text
src/main.ts:8:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

O `TS2345` é o código do erro, e pesquisar "TS2345" traz explicações prontas. E essas mensagens ficam mais fáceis se você ler de trás pra frente: "o **parâmetro** espera `number`, e você passou uma `string`". Quando a mensagem de tipo for muito longa, cheia de tipos aninhados, a **última** linha costuma ser a causa mais específica.

E um detalhe que poupa tempo: um erro de tipo costuma gerar vários outros em cascata, depois dele. Corrija o **primeiro** da lista, e muitas vezes os outros somem junto.

## O essencial

1. Toda mensagem tem tipo, o quê e onde. Leia a frase inteira.
2. Na pilha, procure a primeira linha do seu código.
3. O erro mostra onde o valor ruim foi usado; o bug está onde ele foi criado. Volte o caminho.
4. Não esconda o sintoma com `?.`. Descubra por que veio vazio.
5. No TypeScript, corrija o primeiro erro da lista.

## Agora é com você

Provoque cinco erros **de propósito**, num arquivo `erros.ts`, um de cada vez: um `ReferenceError`, um `TypeError` de `undefined`, um `x is not a function`, um `RangeError` (uma recursão sem fim) e um `ENOENT` (lendo um arquivo que não existe com `fs.readFileSync`). Pra cada um, anote o tipo, a frase do "o quê", o arquivo e a linha, e a causa em uma linha. Depois provoque um erro de TypeScript (`const n: number = "5"`) e anote o código `TS....`. Você terminou quando tiver uma tabelinha com os 6 erros e conseguir dizer a causa de cada um só olhando a mensagem. Quebrar as coisas de propósito é a forma mais rápida de perder o medo delas.

Daqui, siga pra [[Stack Trace]], [[Debugging]] e [[Como Fazer Boas Perguntas]].

---

## 🧠 Me teste

> [!question]- Quais são as três informações principais de uma mensagem de erro?
> O tipo (`TypeError`), a descrição do que aconteceu e o local (arquivo:linha:coluna).

> [!question]- O que significa "Cannot read properties of undefined (reading 'x')"?
> Que você tentou ler a propriedade `x` de um valor que é `undefined`: o objeto que você esperava não existe ali.

> [!question]- Qual a diferença entre um erro do TypeScript e um erro de execução?
> O do TypeScript aparece antes de rodar (no editor ou no `tsc`), sobre tipos; o de execução acontece com o programa rodando.

> [!question]- Por que a linha do erro nem sempre é a linha do bug?
> Porque o erro estoura onde o valor ruim foi usado; o bug pode estar antes, onde esse valor foi criado ou buscado.

> [!question]- O que fazer quando a pilha mostra muitas linhas de `node_modules`?
> Procurar a primeira linha que é do seu código: normalmente o problema é o valor que você passou pra biblioteca.

> [!question]- Por que colocar `?.` em tudo não resolve o bug?
> O erro some, mas o valor continua errado; o problema aparece depois, escondido e mais difícil de achar.

> [!question]- O que significa `ENOENT`?
> "Error NO ENTry": o arquivo ou pasta não existe no caminho informado.

> [!question]+ `TypeError: Cannot read properties of undefined (reading 'nome')`. Qual o problema?
> - a) A propriedade `nome` não existe no objeto
> - b) O objeto antes de `.nome` é `undefined`
> - c) `nome` é `undefined`
> - d) Falta importar `nome`
>
> > [!check]- Resposta
> > **b)** O erro é ao **ler de** `undefined`: em `usuario.nome`, quem é `undefined` é o `usuario`. Se só faltasse `nome`, o resultado seria `undefined`, sem erro.

---

## Pra consultar depois

| Erro | Primeiro suspeito |
|---|---|
| `Cannot read properties of undefined` | Dado vazio, índice errado |
| `is not a function` | Nome ou import errado |
| `is not defined` | Digitação, escopo |
| `Unexpected token` | Faltou `}` `)` `,` ou JSON inválido |
| `Maximum call stack` | Recursão sem caso base |
| `ENOENT` | Caminho do arquivo |
| `Cannot find module` | `npm install` / caminho do import |
| `TS2345` | Tipo do argumento errado |

**Pra ler:** a [referência de erros do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Errors) tem uma página pra cada mensagem do JavaScript, com o que causa e como corrigir; vale abrir sempre que aparecer uma nova. Pros erros de sistema, como ENOENT e EACCES, a [lista do Node.js](https://nodejs.org/api/errors.html#common-system-errors).

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

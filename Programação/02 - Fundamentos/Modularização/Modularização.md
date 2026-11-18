---
nivel: escrito
revisado:
---

# Modularização

Imagine o seu gerenciador de tarefas inteiro num arquivo só, com 500 linhas. Ele lê do teclado, valida, calcula prazos, formata a saída e salva em JSON, tudo misturado. Um dia você quer mudar o formato da data na tela. Rola o arquivo procurando onde isso está, acha, mexe, e torce pra não ter quebrado o cálculo de prazo, que estava logo do lado, usando a mesma variável.

**Modularizar** é o remédio pra isso: dividir o código em partes pequenas, cada uma com **uma responsabilidade**. Funções que fazem uma coisa, e arquivos que agrupam o que é do mesmo assunto. Cada parte esconde os próprios detalhes e mostra pro resto só o necessário. O resultado é que dá pra entender, testar e mudar uma parte sem quebrar as outras.

A sintaxe de como juntar arquivos (`import` e `export`) fica na nota [[Módulos ES (import e export)]]. O assunto aqui é a parte que nenhuma sintaxe ensina: **como decidir onde cortar.** Ajuda ter passado por [[Funções]] e [[Escopo]].

## A pergunta que diz onde cortar

Existe uma pergunta que resolve a maioria das dúvidas de divisão: **"por que motivo este código mudaria?"** Se um pedaço de código pode mudar por dois motivos diferentes, provavelmente ele é dois módulos.

No gerenciador de tarefas, os motivos são bem claros:

| Muda quando... | Módulo |
|---|---|
| a regra do negócio muda (como calcular XP) | `regras.ts` |
| o jeito de mostrar muda (terminal → web) | `interface.ts` |
| o jeito de guardar muda (JSON → banco) | `armazenamento.ts` |

Agora imagine que um dia você quer mostrar as tarefas numa página web, em vez do terminal. Você mexe só na interface. As regras e o armazenamento nem ficam sabendo que alguma coisa mudou.

Com essa pergunta, um anti-padrão muito comum fica fácil de enxergar: o arquivo `utils.ts`. Ele começa inocente, com uma função, e um ano depois tem 40 funções sem relação nenhuma entre si. Isso não é um módulo, é uma gaveta de bagunça, porque "utilitário" não é uma responsabilidade. Se a função é de datas, vai pra `datas.ts`; se é de texto, pra `texto.ts`.

## Mostre pouco, esconda o resto

Todo módulo tem dois lados: a **interface pública**, que é o que ele exporta e os outros usam, e os **detalhes**, que ficam só lá dentro.

```ts
// armazenamento.ts
const ARQUIVO = "tarefas.json";                       // detalhe: ninguém de fora precisa saber
function caminho() { return `./dados/${ARQUIVO}`; }   // detalhe

export function salvar(dados: unknown) { /* usa caminho() */ } // público
export function carregar(): unknown { /* ... */ }              // público
```

Quem usa esse módulo só conhece `salvar` e `carregar`. É como uma tomada: você liga o aparelho sem fazer ideia de como é a fiação dentro da parede. E isso traz uma liberdade enorme: se amanhã você trocar o JSON por um banco de dados, **nenhum outro arquivo do programa muda**, porque ninguém dependia do `ARQUIVO` nem do `caminho()`.

Daí vem uma regra que parece mesquinha mas é sábia: **exporte só o que os outros realmente usam.** Cada coisa exportada é uma promessa. Alguém pode começar a usar, e a partir daí você não pode mais mudar aquilo sem quebrar quem usa. O que fica privado continua livre pra mudar.

## As regras não falam com o mundo

Se for guardar uma ideia desta nota, guarde esta, porque é a divisão que mais vale a pena. Separe as **regras** (os cálculos, as decisões) de tudo o que fala com o mundo de fora (o terminal, os arquivos, a internet). As regras recebem dados e devolvem dados, e só. Sem `console.log`, sem `fs`.

```text
main.ts  ──►  interface.ts  ──►  regras.ts
   │                               ▲
   └──────►  armazenamento.ts ─────┘ (só tipos)
```

As setas mostram quem importa quem, e elas vão **numa direção só**. As regras não importam a interface nem o armazenamento. Por quê? Porque assim você testa as regras chamando uma função e conferindo o resultado, sem precisar de terminal nem de arquivo. É a mesma ideia de função pura que você viu em [[Funções]], só que agora no tamanho de arquivos.

Olhe um programa de notas escolares, antes e depois de modularizar:

```text
antes: notas.ts (180 linhas)
  lê do teclado, valida, calcula média, decide aprovação, formata, salva em arquivo

depois:
  src/
    notas.ts        → calcularMedia(), situacao()        ← regras puras
    validacao.ts    → validarNota()                       ← regras de entrada
    terminal.ts     → perguntarNotas(), mostrar()         ← entrada e saída
    arquivo.ts      → salvarHistorico(), lerHistorico()   ← armazenamento
    main.ts         → junta tudo
```

E o `main` fica assim:

```ts
import { perguntarNotas, mostrar } from "./terminal.js";
import { calcularMedia, situacao } from "./notas.js";
import { salvarHistorico } from "./arquivo.js";

const notas = await perguntarNotas();
const media = calcularMedia(notas);
mostrar(media, situacao(media));
await salvarHistorico(notas, media);
```

O `main` não tem regra nenhuma. Ele só **orquestra**, chamando cada parte na ordem certa. E repare: ler essas cinco linhas conta a história do programa inteiro.

Um sinal de alerta: se o arquivo A importa o B, e o B importa o A, a divisão está errada. As duas partes dependem uma da outra, então na prática elas são uma só, cortada no lugar errado. Quando isso acontecer, repense onde cortar.

## Quando dividir, e quando não

Alguns sinais de que um arquivo está pedindo pra ser dividido: ele passou de umas 300 linhas (ou uma função passou de umas 30); você rola a tela procurando onde está as coisas; o nome dele é genérico demais (`utils.ts`, `helpers.ts`, `coisas.ts`); ou pra mudar uma regra você precisa mexer em cinco lugares.

Mas o exagero oposto também atrapalha, e muito. Dez arquivos de cinco linhas obrigam você a abrir dez abas pra entender uma coisa simples. O conselho é: **comece com um arquivo, e divida quando doer.** Uma boa divisão nasce de refatorar um código que você já entende ([[Refatoração]]), não de tentar prever o futuro. Dividir antes de entender o problema costuma criar as fronteiras nos lugares errados, e mudar fronteira depois dá mais trabalho do que não ter dividido.

## O essencial

1. Pergunte "por que motivo isto mudaria?". Motivos diferentes, módulos diferentes.
2. Exporte só o necessário; os detalhes ficam escondidos e livres pra mudar.
3. Regras não falam com o mundo: nada de `console.log` ou `fs` nelas. As dependências vão numa direção só.
4. O `main` só orquestra.
5. Comece com um arquivo e divida quando doer.

## Agora é com você

Pegue um programa seu, o quiz de [[Entrada e Saída]] ou o jogo de [[Estruturas de Repetição]], e modularize. Primeiro, liste cada coisa que ele faz e classifique: é regra, é entrada e saída, ou é armazenamento? Depois separe em pelo menos 3 arquivos. Garanta que o arquivo de regras **não** tem `console.log`, `readline` nem `process`, e que o `main.ts` tem menos de 20 linhas. Você terminou quando o programa funcionar igual e você conseguir chamar as regras a partir de outro arquivo qualquer, sem o terminal, sem erro.

Daqui, siga pra [[Módulos ES (import e export)]], [[Responsabilidade Única]] e [[Organização de Pastas de um Projeto]].

---

## 🧠 Me teste

> [!question]- Que pergunta ajuda a decidir como dividir o código em módulos?
> "Por que motivo este código mudaria?" Cada motivo diferente (regra, interface, armazenamento) merece seu módulo.

> [!question]- O que um módulo deve exportar?
> Só o que outros módulos precisam usar (a interface pública). Os detalhes ficam escondidos e podem mudar sem afetar ninguém.

> [!question]- Por que o módulo de regras não deve usar `console.log` ou `fs`?
> Pra poder ser testado e reusado sem terminal nem arquivo: recebe dados e devolve dados.

> [!question]- Cite dois sinais de que um arquivo precisa ser dividido.
> Ficou grande demais (centenas de linhas), tem nome genérico como `utils`, ou uma mudança simples exige mexer em vários pontos dele.

> [!question]- O que quer dizer um import em círculo (A importa B, B importa A)?
> Que a divisão está errada: as duas partes dependem uma da outra, então na prática são uma só.

> [!question]- Qual o papel do `main`?
> Orquestrar: chamar os módulos na ordem certa, sem conter regras de negócio.

> [!question]+ Num gerenciador de tarefas, onde deve ficar a função que calcula se uma tarefa está atrasada?
> - a) No `main.ts`, junto com a leitura do teclado
> - b) Num módulo de regras, sem `console.log` nem `fs`
> - c) No módulo que salva o JSON
> - d) Num arquivo `utils.ts` com tudo que sobrou
>
> > [!check]- Resposta
> > **b)** Regra de negócio fica isolada e pura: recebe dados, devolve resposta. Assim dá pra testar sem terminal nem arquivo, e trocar a interface sem reescrever a regra.

---

## Pra consultar depois

| Ideia | Na prática |
|---|---|
| Uma responsabilidade | Um motivo pra mudar por módulo |
| Interface pública | `export` só o necessário |
| Esconder detalhes | Constantes e helpers sem `export` |
| Dependência numa direção | Regras não importam terminal nem arquivo |
| `main` fino | Só orquestra |

**Pra ler:** *A Philosophy of Software Design*, de John Ousterhout, tem os melhores capítulos já escritos sobre esconder complexidade (ele chama de "deep modules": módulos com uma interface pequena e muita coisa escondida). É curto e muda o jeito de pensar. Pro lado da sintaxe, o capítulo [Modules](https://javascript.info/modules-intro) do javascript.info.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

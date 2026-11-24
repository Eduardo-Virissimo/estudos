---
nivel: escrito
foco: essencial
revisado:
---

# Tipos Básicos do TypeScript

**Quanto focar: 🔥 essencial.** Você usa em toda linha de TypeScript. Domine, principalmente `unknown` versus `any`.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

O seu programa de tarefas aceita uma prioridade, que pode ser "baixa", "média" ou "alta". Um dia, em algum canto do código, alguém escreve `prioridade = "Alta"`, com maiúscula. Em outro, `"media"`, sem acento. Nada dá erro. O programa roda. Só que o filtro de prioridade alta para de achar essas tarefas, e ninguém entende por quê.

Esse é o tipo de bug que os tipos do TypeScript existem pra pegar. Os **tipos básicos** são o vocabulário da linguagem, as palavras com que você descreve os seus dados: os primitivos (`string`, `number`, `boolean`), as listas (`string[]`), as tuplas (`[string, number]`), e os **tipos literais** (`"baixa" | "média" | "alta"`), que resolvem exatamente o bug da prioridade.

E existem quatro tipos especiais que você precisa entender, porque eles aparecem o tempo todo: o `any`, que desliga a checagem (e que você deve evitar); o `unknown`, que aceita qualquer coisa mas obriga a conferir antes de usar; o `void`, pra função que não devolve nada; e o `never`, pra algo que nunca acontece. A regra geral pra levar daqui: **anote os parâmetros e os retornos, e deixe a inferência cuidar do resto.** Ajuda ter passado pelo [[Configurando um Projeto TypeScript]] e pelas [[Variáveis e Tipos de Dados]].

## As palavras mais simples

Os tipos dos valores simples são os mesmos do JavaScript, escritos em minúsculo:

```ts
let titulo: string = "Estudar";
let xp: number = 120;
let concluida: boolean = false;
```

Na prática, quando a variável já nasce com um valor, você **não precisa** anotar: `let xp = 120` já é um `number`, pela inferência. Anote quando declarar sem valor (`let xp: number;`) e nos parâmetros das funções.

Um detalhe que confunde: `String`, `Number` e `Boolean`, com letra maiúscula, também existem, mas são outra coisa (objetos "embrulho", que quase ninguém usa). Escreva sempre em minúsculo.

Pra listas, coloque `[]` depois do tipo dos itens:

```ts
const tags: string[] = ["ts", "node"];
const notas: Array<number> = [7, 8.5]; // mesma coisa, outra forma de escrever
const vazio: string[] = [];             // lista vazia PRECISA de anotação
```

Repare na última linha. Uma lista que nasce vazia não dá nenhuma pista do que vai ter dentro, e o TypeScript fica sem saber: acaba tratando como `any[]` (que aceita tudo) ou `never[]` (que não aceita nada). Sempre anote as listas vazias.

## Só estes valores, e nenhum outro

Agora a solução pro bug da prioridade. Às vezes uma variável não pode ser **qualquer** texto: só alguns valores específicos. O TypeScript deixa você dizer exatamente isso:

```ts
let dificuldade: "fácil" | "média" | "difícil";
dificuldade = "média";   // ✅
dificuldade = "extrema"; // ❌ Type '"extrema"' is not assignable...
```

O `|` se lê "ou". Isso é um **tipo literal**, e ele ajuda de dois jeitos. Os erros de digitação, como `"facil"` sem acento ou `"Alta"` com maiúscula, viram erros de compilação, sublinhados em vermelho na hora. E o editor passa a **sugerir** os valores possíveis enquanto você digita.

Muitas vezes você precisa da lista de valores pra duas coisas ao mesmo tempo: como tipo, e pra mostrar ao usuário ("use: baixa, média, alta"). Pra não escrever duas vezes, existe o `as const`:

```ts
const NIVEIS = ["escrito", "praticado", "projeto"] as const;
type Nivel = (typeof NIVEIS)[number]; // "escrito" | "praticado" | "projeto"
```

Sem o `as const`, o TypeScript acharia que `NIVEIS` é só um `string[]` qualquer, que aceita qualquer texto. Com ele, a lista fica "congelada", e cada valor vira um tipo literal. A segunda linha parece esquisita, mas se lê assim: "o tipo de qualquer item dessa lista".

Você talvez encontre o `enum`, que o TypeScript tem e que parece feito justamente pra isso. Ele funciona, mas gera código extra e não roda no modo do Node que só apaga os tipos. Prefira a união de literais com `as const`.

## Qualquer coisa, com e sem cuidado

Aqui está a distinção mais importante da nota. O `any` e o `unknown` aceitam **qualquer valor**, mas são opostos em segurança.

O `any` **desliga** o TypeScript. Você pode fazer qualquer coisa com o valor, e ninguém confere nada:

```ts
const a: any = JSON.parse(texto);
a.qualquerCoisa.inventada(); // compila... e quebra rodando
```

O `unknown` diz "eu não sei o que é isso", e por isso **obriga você a conferir** antes de usar:

```ts
const u: unknown = JSON.parse(texto);
u.nome; // ❌ 'u' is of type 'unknown'

if (typeof u === "object" && u !== null && "nome" in u) {
  console.log(u.nome); // ✅ só depois de conferir
}
```

Pense no `unknown` como uma caixa fechada que chegou pelo correio: antes de usar o que tem dentro, você abre e confere. O `any` é usar o conteúdo sem abrir, torcendo pra ser o que você imagina.

A regra que sai disso: **um dado de origem desconhecida é `unknown`.** O resultado de um `JSON.parse`, a resposta de uma API, o erro capturado num `catch`. O `any` fica como último recurso, e temporário.

E o `any` tem um agravante: ele **se espalha**. Tudo o que vem de uma variável `any` também vira `any`, e um único `any` vai contaminando o código em volta, desligando a checagem onde você nem percebe. A regra `no-explicit-any` do [[Linter]] avisa quando ele aparece.

## Listas de tamanho fixo, e funções sem retorno

Uma **tupla** é um array em que cada posição tem o seu tipo definido:

```ts
function minMax(nums: number[]): [number, number] {
  return [Math.min(...nums), Math.max(...nums)];
}
const [menor, maior] = minMax([3, 9, 1]);
```

É útil pra devolver dois valores rapidinho. Mas com mais de dois ou três itens, prefira um objeto: `{ menor, maior }` diz o que é cada coisa, e `[1, 9]` não.

E dois tipos pra funções:

```ts
function log(msg: string): void {     // não devolve nada útil
  console.log(msg);
}

function falhar(msg: string): never { // nunca termina normalmente: sempre lança erro
  throw new Error(msg);
}
```

O `void` é o mais comum: funções que fazem alguma coisa, mas não devolvem resultado. O `never` é pra quando a função **nunca chega ao fim**, porque sempre lança um erro. Ele também aparece quando o TypeScript consegue provar que um caso é impossível, e você vai ver isso em [[Union Types e Narrowing]].

## Juntando tudo

Um exemplo que usa literais, `as const` e conferência, e que fecha o problema da prioridade de vez. O texto que vem do terminal é uma `string` qualquer, e só vira uma `Prioridade` depois de conferido:

```ts
const PRIORIDADES = ["baixa", "média", "alta"] as const;
type Prioridade = (typeof PRIORIDADES)[number];

function ehPrioridade(valor: string): valor is Prioridade {
  return (PRIORIDADES as readonly string[]).includes(valor);
}

const entrada = process.argv[2] ?? "média";
if (!ehPrioridade(entrada)) {
  console.error(`Prioridade inválida. Use: ${PRIORIDADES.join(", ")}`);
  process.exit(1);
}
// daqui pra baixo, o TypeScript sabe que entrada é Prioridade
```

A lista é escrita uma vez só, e serve pro tipo, pra validação e pra mensagem de erro.

Por fim, você vai ver o `as`, que **afirma** um tipo:

```ts
const input = document.querySelector("#nome") as HTMLInputElement;
```

Cuidado: o `as` não converte nada nem confere nada. É você dizendo ao compilador "confia em mim, isso é deste tipo". Se você estiver errado, quebra rodando. Usar o `as` pra calar um erro num dado que você não validou é mentir pro compilador. Sempre que der, prefira conferir com um `if`.

## O essencial

1. Primitivos em minúsculo: `string`, `number`, `boolean`. Lista vazia sempre anotada.
2. Tipos literais (`"baixa" | "alta"`) transformam erros de digitação em erros de compilação.
3. `as const` numa lista + `(typeof LISTA)[number]` = escreva os valores uma vez só.
4. Dado de fora é `unknown`: confira antes de usar. `any` desliga a checagem e se espalha.
5. `void` não devolve nada; `never` nunca termina. `as` não confere nada: prefira `if`.

## Agora é com você

Tipe sem `any`. Crie um `type Status = "a fazer" | "fazendo" | "feito"` e uma função `avancar(status: Status): Status`, que leva de "a fazer" pra "fazendo", de "fazendo" pra "feito", e mantém "feito" como está. Escreva `lerNumeros(texto: string): number[]`, que recebe algo como `"3,7,x,10"` e devolve só os números válidos. E escreva `estatisticas(nums: number[]): [number, number, number]`, com o mínimo, o máximo e a média. Rode `npm run check` sem nenhum `any` e sem nenhum `as`. Você terminou quando `avancar("feito")` der `"feito"`, `lerNumeros("3,7,x,10")` der `[3, 7, 10]`, e o `tsc` não reclamar de nada.

Daqui, siga pra [[Objetos e Arrays no JavaScript]], [[Interfaces e Type Aliases]] e [[Union Types e Narrowing]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `any` e `unknown`?
> `any` desliga a checagem (dá pra fazer qualquer coisa); `unknown` aceita qualquer valor, mas obriga a conferir o tipo antes de usar.

> [!question]- O que é um tipo literal?
> Um tipo que aceita só valores específicos, como `"fácil" | "difícil"`. Restringe o que pode ser atribuído.

> [!question]- O que é uma tupla?
> Um array com quantidade e tipo de cada posição fixos, como `[string, number]`.

> [!question]- Quando uma função tem retorno `void` e quando `never`?
> `void` quando não retorna nada útil; `never` quando nunca termina normalmente (sempre lança erro ou entra em laço infinito).

> [!question]- O que `as` faz?
> Afirma um tipo pro compilador sem converter nem checar nada em execução. Se a afirmação estiver errada, o erro aparece rodando.

> [!question]- Pra que serve `as const` numa lista?
> Mantém os valores como literais e somente leitura, permitindo derivar um tipo união a partir da lista.

> [!question]- Por que uma lista vazia precisa de anotação?
> Porque sem valores o TypeScript não tem como deduzir o tipo dos itens e cai em `any[]` ou `never[]`.

> [!question]+ Qual a diferença entre `any` e `unknown`?
> - a) Nenhuma, são sinônimos
> - b) `any` desliga a checagem; `unknown` obriga a checar o tipo antes de usar
> - c) `unknown` desliga a checagem; `any` obriga a checar
> - d) `unknown` só serve pra erros
>
> > [!check]- Resposta
> > **b)** Com `unknown` você precisa provar o tipo (`typeof x === "string"`) antes de usar. É o tipo certo pra dado de fora. `any` aceita tudo e esconde os bugs.

---

## Pra consultar depois

| Tipo | Exemplo |
|---|---|
| Primitivos | `string`, `number`, `boolean` |
| Array | `string[]` ou `Array<string>` |
| Tupla | `[string, number]` |
| Literal | `"a" \| "b"` |
| Desconhecido | `unknown` (confira antes) |
| Sem retorno | `void` |
| Impossível | `never` |
| Derivar de uma lista | `(typeof LISTA)[number]` com `as const` |

**Pra ler e praticar:** a parte [Everyday Types do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) cobre tudo desta nota, com mais exemplos. E o [tutorial de iniciantes do Total TypeScript](https://www.totaltypescript.com/tutorials/beginners-typescript) é gratuito e interativo: você resolve exercícios direto no navegador, e é a melhor forma de fixar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Interfaces e Type Aliases

**Quanto focar: 🔥 essencial.** Você vai descrever formato de dado o tempo todo. Domine; é o coração do TypeScript.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 20 min de leitura, 5 min no Me teste e 45 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

O seu gerenciador de tarefas tem uma dúzia de funções que mexem com tarefas: adicionar, concluir, listar, salvar, filtrar. Em cada uma delas, você escreve o tipo do parâmetro: `{ id: number; titulo: string; concluida: boolean }`. Doze vezes. Um dia uma tarefa ganha um prazo, e você precisa achar e atualizar as doze. Esquece uma, e é ali que o bug vai morar.

Pra isso existem a `interface` e o `type`: eles dão **um nome ao formato de um objeto**. Você descreve uma vez quais propriedades uma `Tarefa` tem, e de que tipo é cada uma, e reusa esse nome em todo o programa. A partir daí, o TypeScript avisa quando falta campo, quando sobra campo, ou quando o tipo não bate. É como um molde: tudo o que diz ser uma `Tarefa` precisa caber nele.

Pra descrever objetos, os dois são quase iguais, e a dúvida "qual usar?" tem uma resposta curta no fim da nota. Ajuda já conhecer os [[Tipos Básicos do TypeScript]] e o [[null e undefined]].

## Dando nome ao formato

```ts
interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

type Usuario = {
  nome: string;
  email: string;
};

const t: Tarefa = { id: 1, titulo: "Estudar", concluida: false };
const u: Usuario = { nome: "Ana" }; // ❌ Property 'email' is missing
```

As duas formas fazem a mesma coisa aqui. E a partir delas, qualquer função que recebe uma `Tarefa` sabe exatamente o que tem dentro, e o [[VS Code]] autocompleta os campos enquanto você digita. Esqueceu o `email` de um usuário? O TypeScript avisa na hora, com o nome do campo que falta.

Os tipos podem usar outros tipos, e é assim que você monta o "modelo" do seu programa, a descrição de todas as coisas que ele manipula:

```ts
type Prioridade = "baixa" | "média" | "alta";

interface Tarefa {
  readonly id: number;
  titulo: string;
  concluida: boolean;
  prioridade: Prioridade;
  criadaEm: string;   // data no formato ISO (veja Datas e Fusos Horários)
  prazo?: string;
}

interface ArquivoDeTarefas {
  versao: 1;          // tipo literal: ajuda a mudar o formato do arquivo no futuro
  tarefas: Tarefa[];
}
```

Repare no `versao: 1`. Esse campo só aceita o número 1, e parece inútil hoje. Mas no dia em que o formato do arquivo mudar, a versão 2 vai poder conviver com a 1, e o programa vai saber qual está lendo.

Um detalhe de estilo: você vai encontrar código antigo com nomes como `ITarefa`, com um "I" na frente. É uma convenção que veio do C#. Em TypeScript moderno, o nome é só `Tarefa`.

## O que pode faltar, e o que não pode mudar

Dois modificadores mudam o comportamento de um campo:

```ts
interface Tarefa {
  readonly id: number;   // não pode ser alterado depois de criado
  titulo: string;
  prazo?: string;        // pode não existir
}

t.id = 2; // ❌ Cannot assign to 'id' because it is a read-only property
```

O `?` diz "esse campo pode faltar". Quando ele falta, o valor é `undefined`, e o TypeScript vai te obrigar a tratar esse caso antes de usar, com algo como `t.prazo?.toUpperCase()`. E o `readonly` protege os campos que não deveriam mudar nunca, como o `id`.

O `?` tem uma armadilha de design. Quando você não tem certeza de quais campos vão existir, dá vontade de colocar `?` em tudo. Mas um tipo em que quase todo campo é opcional não protege nada: qualquer objeto passa nele, até um vazio. Quando os campos dependem da situação (uma tarefa nova, por exemplo, ainda não tem `id`), o caminho é criar **tipos diferentes pra cada situação**, derivando um do outro com os [[Utility Types]]: `Omit<Tarefa, "id">` é "uma tarefa sem o id".

E o `readonly` tem um limite: ele é só uma conferência do compilador. Quando o programa roda, nada impede a mudança. Pra congelar um objeto de verdade, existe o `Object.freeze`.

## O formato é o que vale

Esta é a ideia mais importante da nota, e a que mais surpreende quem vem de outras linguagens. Em Java e C#, um objeto só é de um tipo se foi **declarado** como desse tipo. No TypeScript, o que importa é o **formato**: se o objeto tem as propriedades certas, ele serve.

```ts
interface Ponto { x: number; y: number }

const p = { x: 1, y: 2, z: 3 };
const q: Ponto = p; // ✅ tem x e y, isso basta
```

O objeto `p` nunca foi declarado como `Ponto`, e tem até um campo a mais. Mas ele tem um `x` e um `y` numéricos, e pro TypeScript isso basta. Isso se chama **tipagem estrutural**: a comparação é pela estrutura, não pelo nome. É como uma tomada: qualquer plugue com o formato certo encaixa, não importa a marca.

Tem uma exceção, e ela existe pra pegar erros de digitação:

```ts
const r: Ponto = { x: 1, y: 2, z: 3 }; // ❌ campo a mais num objeto escrito direto
```

Quando você escreve o objeto **direto** na atribuição, um campo a mais provavelmente é engano (talvez você digitou `z` querendo outra coisa), então o TypeScript reclama.

## Dicionários, extensões e combinações

Quando um objeto funciona como **dicionário** (uma chave leva a um valor), o tipo certo é o `Record`:

```ts
type XpPorDia = Record<string, number>;
const historico: XpPorDia = { "2026-11-14": 120, "2026-11-15": 80 };

type Nivel = "escrito" | "praticado" | "projeto";
const emoji: Record<Nivel, string> = { escrito: "📝", praticado: "🔨", projeto: "🚀" };
// se faltar um nível, o TypeScript reclama ✅
```

O segundo exemplo é muito útil, por um motivo que só aparece com o tempo. Quando você adicionar um nível novo à união `Nivel`, o TypeScript vai apontar **todos** os `Record` do programa que esqueceram dele. Ele vira uma lista automática do que precisa ser atualizado.

Também dá pra montar um tipo a partir de outro:

```ts
interface Pessoa { nome: string }
interface Aluno extends Pessoa { matricula: string }   // interface: extends

type Admin = Usuario & { permissoes: string[] };       // type: & (junta os dois)
```

O `Aluno` tem o `nome` e a `matricula`. O `Admin` tem tudo do `Usuario`, mais as `permissoes`.

E um tipo também pode descrever métodos, não só dados:

```ts
interface Repositorio {
  listar(): Tarefa[];
  buscar(id: number): Tarefa | undefined;
  salvar: (t: Tarefa) => void;   // outra forma de escrever
}
```

## interface ou type?

A pergunta que todo mundo faz. As diferenças, lado a lado:

| | `interface` | `type` |
|---|---|---|
| Formato de objeto | ✅ | ✅ |
| União (`"a" \| "b"`) | ❌ | ✅ |
| Tupla, função, primitivo | ❌ | ✅ |
| Estender | `extends` | `&` |
| Pode ser "reaberta" e somada | ✅ | ❌ |

A diferença que mais importa é a segunda linha: uniões, como o `Prioridade` lá de cima, **só** dá pra fazer com `type`. E a última linha esconde uma armadilha: se você declarar duas interfaces com o mesmo nome, elas se **somam** em silêncio (isso se chama *declaration merging*), sem nenhum aviso. Com `type`, um nome duplicado dá erro, o que é mais seguro.

Na prática, duas regras são comuns, e as duas funcionam: **`type` pra tudo**, ou **`interface` pra objetos e `type` pro resto**. O que importa de verdade é ser consistente dentro do projeto.

## O essencial

1. `interface` e `type` dão nome ao formato de um objeto. Escreva uma vez, reuse em todo lugar.
2. `?` é campo que pode faltar (vira `undefined`); `readonly` é campo que não muda.
3. Tudo opcional não protege nada. Crie tipos pra cada situação, com `Omit` e companhia.
4. O TypeScript compara pelo formato, não pelo nome (tipagem estrutural).
5. Uniões só com `type`. `Record<K, V>` pra dicionários.

## Agora é com você

Modele uma **biblioteca pessoal**. Crie os tipos `Autor`, `Livro` (com `autor: Autor`, um `lidoEm?: string` e uma `nota?: 1 | 2 | 3 | 4 | 5`) e `Estante`, que é um `Record<string, Livro[]>` em que a chave é o nome da estante. Escreva `livrosLidos(estante: Estante): Livro[]` e `mediaDasNotas(livros: Livro[]): number | null`, que devolve `null` se nenhum livro tem nota. Crie dados de exemplo com 2 estantes e 5 livros, e tente dar nota 6 a um deles: o TypeScript precisa reclamar. Você terminou quando as funções funcionarem, a nota 6 der erro de compilação, e você não tiver usado nenhum `any`.

Daqui, siga pros [[Union Types e Narrowing]], pros [[Generics]] e pros [[Utility Types]]. E no Estágio 3, a nota [[Interfaces]] mostra o mesmo conceito do ponto de vista da orientação a objetos.

---

## 🧠 Me teste

> [!question]- Qual a principal diferença prática entre `interface` e `type`?
> `type` também representa uniões, tuplas e outros tipos; `interface` só formatos de objeto (e pode ser reaberta e somada). Pra objetos, os dois servem.

> [!question]- O que faz `readonly` numa propriedade?
> Impede, em tempo de compilação, que a propriedade seja reatribuída depois que o objeto é criado.

> [!question]- Pra que serve `Record<K, V>`?
> Pra tipar objetos usados como dicionário: chaves do tipo K e valores do tipo V. Com K sendo uma união, obriga a ter todas as chaves.

> [!question]- Como estender um tipo com `interface` e com `type`?
> `interface B extends A { ... }` e `type B = A & { ... }`.

> [!question]- O que significa TypeScript ter tipagem estrutural?
> Que a compatibilidade é decidida pelo formato (as propriedades), não pelo nome do tipo.

> [!question]- Por que colocar `?` em quase todos os campos é um problema?
> Porque o tipo deixa de proteger: qualquer objeto, até um vazio, passa.

> [!question]+ O que **só** o `type` consegue fazer, e a `interface` não?
> - a) Descrever o formato de um objeto
> - b) Ser estendido por outro tipo
> - c) Declarar uma união como `"baixa" | "media" | "alta"`
> - d) Ter propriedades opcionais
>
> > [!check]- Resposta
> > **c)** União, tupla e alias de primitivo só com `type`. Objeto, extensão e opcionais os dois fazem.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `interface X { a: string }` | Formato de objeto |
| `type X = { a: string }` | O mesmo, com type |
| `a?: T` | Campo opcional |
| `readonly a: T` | Não pode ser reatribuído |
| `Record<string, number>` | Dicionário |
| `interface B extends A` | Estender |
| `type B = A & { b: T }` | Combinar |
| `metodo(x: T): R` | Função dentro do tipo |

**Pra ler:** a parte de [Object Types do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/objects.html) cobre tudo desta nota com mais exemplos. E a seção [Differences Between Type Aliases and Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) é a resposta oficial pra dúvida "qual usar?".

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

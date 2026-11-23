---
nivel: escrito
foco: essencial
revisado:
---

# Union Types e Narrowing

**Quanto focar: 🔥 essencial.** É o que deixa o TypeScript útil de verdade. Domine, porque aparece em todo tratamento de erro e resposta de API.

Uma tela do seu app busca dados da internet. Enquanto espera, mostra um ícone de carregando. Se der certo, mostra os dados. Se der errado, mostra o erro. Você modela isso com um objeto: `{ carregando: boolean; dados?: string[]; erro?: string }`. Funciona. Até o dia em que um bug faz a tela mostrar o ícone de carregando **e** uma mensagem de erro ao mesmo tempo. O tipo que você escreveu permite isso. Ele permite até "deu certo, mas sem dados".

O TypeScript tem uma ferramenta que torna esses estados impossíveis **de escrever**. Ela começa com o **union type**: um tipo como `string | number`, que diz que um valor pode ser **um entre vários tipos**. Pra usar esse valor, você precisa primeiro descobrir qual deles ele é, e isso se chama **narrowing** (estreitar): depois de uma pergunta como um `typeof`, o TypeScript **sabe** o tipo exato dentro daquele bloco.

E juntando as duas ideias nasce o padrão mais poderoso desta nota, a **união discriminada**, que resolve o problema da tela de vez, e ainda faz o TypeScript avisar quando aparece um caso novo que você esqueceu de tratar. Ajuda ter passado por [[Interfaces e Type Aliases]], [[null e undefined]] e [[Estruturas Condicionais]].

## Um entre vários

```ts
let id: string | number;
id = 42;     // ✅
id = "a42";  // ✅
id = true;   // ❌
```

O `|` se lê "ou": o `id` é uma string **ou** um number. Isso aparece o tempo todo no mundo real: um id que pode vir como texto ou como número, uma função que aceita um item só ou uma lista, uma resposta que pode ser sucesso ou erro.

E tem um detalhe que faz toda a diferença: com uma união, você só pode usar o que é **comum a todos** os tipos dela.

```ts
function mostrar(id: string | number) {
  id.toUpperCase(); // ❌ Property 'toUpperCase' does not exist on type 'number'
}
```

Faz todo o sentido. Se o `id` for um número, o `toUpperCase` não existe, e o programa quebraria. O TypeScript não deixa você arriscar. Pra usar, primeiro você descobre qual é.

## Fazendo a pergunta certa

Narrowing é fazer uma pergunta que **estreita** as possibilidades. E depois da pergunta, dentro do bloco, o TypeScript sabe a resposta:

```ts
function mostrar(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();   // aqui, id é string
  }
  return id.toFixed(0);        // aqui só sobrou number
}
```

Repare no segundo `return`. Você não precisou perguntar "é número?". Se não é string, e só havia duas opções, **só pode** ser number. O TypeScript faz essa dedução sozinho, como um detetive eliminando suspeitos.

Existem várias perguntas que estreitam, e cada uma serve pra um tipo de situação:

```ts
// existe? (tira o undefined)
function saudar(nome: string | undefined) {
  if (!nome) return "Olá!";
  return `Olá, ${nome}`;        // aqui nome é string
}

// tem esta propriedade? (in)
type Gato = { miar(): void };
type Cachorro = { latir(): void };
function falar(animal: Gato | Cachorro) {
  if ("miar" in animal) animal.miar(); else animal.latir();
}

// é um erro de verdade? (instanceof)
function mensagem(erro: unknown) {
  if (erro instanceof Error) return erro.message;
  return String(erro);
}

// é uma lista?
function normalizar(x: string | string[]): string[] {
  return Array.isArray(x) ? x : [x];
}
```

Duas armadilhas. A primeira é antiga: `typeof null` dá `"object"`, por um erro da primeira versão do JavaScript que nunca foi corrigido. Então `typeof x === "object"` deixa o `null` passar. Pra checar se é um objeto de verdade, escreva `typeof x === "object" && x !== null`.

A segunda é a tentação de pular a pergunta. Um `(r as { dados: string[] }).dados` compila sem perguntar nada, e quebra rodando se o `r` não tiver `dados`. O `as` não confere nada, só afirma. Pergunte de verdade, com um `if` ou um `switch`.

## A tela que não pode estar em dois estados

Agora a solução pro problema do começo. Este é o padrão que mais vale aprender nesta nota. Olhe de novo o jeito ingênuo:

```ts
// ❌ permite estados impossíveis
type ResultadoRuim = { carregando: boolean; dados?: string[]; erro?: string };
```

O problema é que nada impede `carregando: true` **e** `erro: "falhou"` ao mesmo tempo, ou um sucesso sem dados. O tipo aceita combinações que não fazem sentido nenhum, e cada uma delas é um bug esperando pra acontecer. O código que usa esse tipo fica cheio de `if` tentando adivinhar qual combinação está acontecendo.

A **união discriminada** muda a pergunta. Em vez de um objeto com campos que podem ou não existir, ela descreve **cada situação separadamente**, com um campo em comum (o **discriminante**) que diz qual é:

```ts
type Resultado =
  | { status: "carregando" }
  | { status: "sucesso"; dados: string[] }
  | { status: "erro"; mensagem: string };

function render(r: Resultado): string {
  switch (r.status) {
    case "carregando": return "⏳";
    case "sucesso":    return r.dados.join(", ");  // dados só existe aqui
    case "erro":       return `❌ ${r.mensagem}`;  // mensagem só existe aqui
  }
}
```

Agora os estados impossíveis **não podem nem ser escritos**: não existe um jeito de montar um `Resultado` que esteja carregando e com erro ao mesmo tempo. E dentro de cada `case`, o TypeScript sabe exatamente quais campos existem. O `r.dados` só funciona no caso de sucesso; tentar usar no caso de erro dá erro de compilação.

E dá pra ir um passo além: fazer o TypeScript garantir que **nenhum caso ficou de fora**.

```ts
    default: {
      const impossivel: never = r;
      return impossivel;
    }
```

O `never` é o tipo de algo que não pode existir. Se todos os casos foram tratados nos `case` de cima, não sobra nada pro `default`, e o `r` lá é `never`, então a linha compila. Mas imagine que, meses depois, alguém adiciona uma variante `{ status: "vazio" }` e esquece de tratar. Agora sobra esse caso no `default`, ele não é `never`, e o TypeScript dá erro **exatamente nessa linha**. Na prática: adicionou uma variante nova, e o compilador te entrega a lista de todos os `switch` do programa que precisam ser atualizados.

Pra funcionar, o discriminante precisa ter valores **fixos**, como `"sucesso"` e `"erro"`. Se o campo for só `status: string`, o TypeScript não consegue separar os casos.

## Um exemplo completo: os comandos do terminal

O texto que chega do terminal é bagunçado: pode ter um comando que não existe, um id que não é número, um título vazio. Um bom padrão é transformar esse texto **uma vez só** numa união discriminada, e deixar o resto do programa trabalhar com dados limpos:

```ts
type Comando =
  | { tipo: "add"; titulo: string }
  | { tipo: "done"; id: number }
  | { tipo: "list" }
  | { tipo: "invalido"; motivo: string };

function interpretar(args: string[]): Comando {
  const [cmd, ...resto] = args;
  if (cmd === "list") return { tipo: "list" };
  if (cmd === "add") {
    const titulo = resto.join(" ").trim();
    return titulo ? { tipo: "add", titulo } : { tipo: "invalido", motivo: "título vazio" };
  }
  if (cmd === "done") {
    const id = Number(resto[0]);
    return Number.isInteger(id) ? { tipo: "done", id } : { tipo: "invalido", motivo: "id inválido" };
  }
  return { tipo: "invalido", motivo: `comando desconhecido: ${cmd ?? "(nenhum)"}` };
}

const c = interpretar(process.argv.slice(2));
switch (c.tipo) {
  case "add":      console.log(`Adicionando "${c.titulo}"`); break;
  case "done":     console.log(`Concluindo #${c.id}`); break;
  case "list":     console.log("Listando..."); break;
  case "invalido": console.error(c.motivo); process.exitCode = 1; break;
}
```

Toda a bagunça fica concentrada no `interpretar`. Depois dele, o `switch` não precisa conferir mais nada: no caso `"done"`, o `c.id` é garantidamente um número inteiro.

## As suas próprias perguntas

Você também pode escrever funções que fazem narrowing, com um tipo de retorno especial, o `x is Tipo`:

```ts
function ehTarefa(x: unknown): x is Tarefa {
  return typeof x === "object" && x !== null
    && "titulo" in x && typeof x.titulo === "string"
    && "concluida" in x && typeof x.concluida === "boolean";
}

const dado: unknown = JSON.parse(texto);
if (ehTarefa(dado)) dado.titulo; // ✅ aqui dado é Tarefa
```

O `x is Tarefa` quer dizer: "se esta função devolver `true`, trate o valor como uma `Tarefa`". Isso se chama **type guard**. É exatamente o que bibliotecas como o [[Validação com Zod|Zod]] fazem por você, sem escrever todas essas checagens à mão.

Um último detalhe, que confunde quando acontece: dentro de uma função passada adiante, como num `setTimeout(() => ...)`, o TypeScript pode "esquecer" o estreitamento de uma variável `let`, porque ela poderia ter mudado até a função rodar. A solução é copiar pra uma `const` antes.

## O essencial

1. `A | B` é um valor que pode ser A ou B. Você só usa o que é comum aos dois até perguntar qual é.
2. Narrowing: `typeof`, `in`, `instanceof`, `Array.isArray` e `if (!x)` estreitam o tipo dentro do bloco.
3. União discriminada: cada situação é uma variante com um campo literal (`status`). Estados impossíveis nem compilam.
4. `const impossivel: never = r` no `default` garante que todos os casos foram tratados.
5. `x is T` cria o seu próprio type guard.

## Agora é com você

Modele o **estado de um download** com uma união discriminada de quatro variantes: `"pendente"`; `"baixando"`, com um `progresso: number`; `"concluido"`, com o `caminho: string`; e `"falhou"`, com o `erro: string` e o número de `tentativas`. Escreva `descrever(d: Download): string` com um `switch` e a checagem exaustiva com `never`. Escreva `avancar(d: Download): Download`, que simula o próximo passo (pendente → baixando 0% → ... → concluído). E então o teste de verdade: adicione uma variante `"cancelado"` e veja o compilador apontar exatamente onde falta tratar. Você terminou quando o último passo der erro de compilação no `default` e, depois de você tratar o caso novo, tudo passar.

Daqui, siga pros [[Generics]], pro [[Tratamento de Erros na API]] e pro [[Polimorfismo]].

---

## 🧠 Me teste

> [!question]- O que é narrowing?
> O TypeScript deduzir um tipo mais específico dentro de um bloco depois de uma checagem (`typeof`, `in`, `instanceof`, igualdade, truthiness).

> [!question]- O que é uma união discriminada?
> Uma união de objetos que têm um campo literal em comum (ex: `status`) com valor diferente em cada variante; checar esse campo estreita pro tipo certo.

> [!question]- Pra que serve atribuir o valor a uma variável `never` no `default` do switch?
> Pra garantir que todos os casos foram tratados: se aparecer uma variante nova não tratada, dá erro de compilação ali.

> [!question]- O que significa o retorno `x is Tarefa` numa função?
> Que ela é um type guard: quando retorna `true`, o TypeScript passa a tratar `x` como `Tarefa`.

> [!question]- Por que `{ carregando: boolean; dados?: ...; erro?: ... }` é pior que uma união discriminada?
> Porque permite estados impossíveis (carregando e com erro ao mesmo tempo, sucesso sem dados), que o código precisa adivinhar como tratar.

> [!question]- Por que `typeof x === "object"` não basta pra saber se é um objeto?
> Porque `typeof null` também dá `"object"`. Complete com `&& x !== null`.

> [!question]+ `function f(x: string | number) { if (typeof x === "string") { ... } }`. Dentro do `if`, qual o tipo de `x`?
> - a) `string | number`
> - b) `string`
> - c) `unknown`
> - d) `any`
>
> > [!check]- Resposta
> > **b)** Isso é **narrowing**: o `typeof` estreita a união. No `else`, `x` vira `number`.

---

## Pra consultar depois

| Sintaxe | Estreita para |
|---|---|
| `typeof x === "string"` | Primitivos |
| `x instanceof Error` | Instância de uma classe |
| `"campo" in x` | Objeto que tem o campo |
| `Array.isArray(x)` | Array |
| `if (!x) return` | Tira null/undefined/falsy |
| `switch (x.tipo)` | Variante da união discriminada |
| `const n: never = x` | Checagem exaustiva |
| `(x: unknown): x is T` | Type guard próprio |

**Pra ler:** a parte de [Narrowing do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) mostra todas as formas de estreitar, com exemplos. E o artigo [Discriminated Unions are a dev's best friend](https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend), do Total TypeScript, mostra o padrão do "carregando, sucesso, erro" com antes e depois, e é ótimo pra fixar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: essencial
revisado:
---

# null e undefined

**Quanto focar: 🔥 essencial.** É a origem do erro mais comum do JavaScript. Domine `?.`, `??` e o `strictNullChecks`.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Se você programar em JavaScript por tempo suficiente, uma mensagem de erro vai virar sua velha conhecida: `Cannot read properties of undefined`. Ela é, provavelmente, o erro mais comum de toda a linguagem. E ela sempre conta a mesma história: você tentou usar alguma coisa como se fosse um objeto, e ela era um **nada**.

O JavaScript, curiosamente, tem **dois** jeitos de dizer "não tem nada aqui". O `undefined` quer dizer "ainda não tem valor": uma variável que nunca recebeu nada, uma propriedade que não existe, uma função sem `return`. O `null` quer dizer "vazio de propósito": alguém decidiu, conscientemente, que aquilo está vazio.

Três ferramentas resolvem quase todos os problemas com esses dois. O `?.`, que acessa alguma coisa só se ela existir. O `??`, que dá um valor padrão. E a mais importante, o **`strictNullChecks`** do TypeScript, que transforma aquele erro famoso, que só aparecia rodando, num aviso **enquanto você escreve**. Ajuda ter passado pelos [[Tipos Básicos do TypeScript]] e por [[Objetos e Arrays no JavaScript]].

## De onde vem o nada

O `undefined` aparece sozinho, sem ninguém pedir, em muitas situações:

```ts
let x;                         // declarada sem valor
const obj = { a: 1 };
obj.b;                         // propriedade que não existe (em JS puro)
[1, 2][5];                     // índice que não existe
function f() {}  f();          // função sem return
[1, 2].find((n) => n > 9);     // find que não achou nada
```

Já o `null` só aparece quando **alguém coloca** ele lá:

```ts
const usuario = { apelido: null }; // alguém decidiu: sem apelido
document.querySelector("#nada");   // APIs do navegador usam null pra "não achei"
```

Uma imagem ajuda a separar os dois. O `undefined` é uma gaveta que **nunca foi aberta**: você não sabe o que tem nela, porque ninguém colocou nada. O `null` é uma gaveta que alguém **abriu, esvaziou e deixou vazia de propósito**.

E a diferença importa de verdade em alguns casos. Pense num usuário que **apagou** o apelido, e num que **nunca preencheu**. São situações diferentes, e às vezes o seu programa precisa saber qual é. A regra prática: use `undefined` pra "não informado" (os campos opcionais) e reserve o `null` pras vezes em que o "vazio de propósito" importa.

## O TypeScript não deixa passar

Com o `strict: true` ligado no projeto ([[Configurando um Projeto TypeScript]]), o TypeScript ativa uma checagem chamada `strictNullChecks`. Com ela, o `null` e o `undefined` **não cabem** em nenhum outro tipo, a menos que você diga explicitamente que cabem.

```ts
let nome: string = undefined;      // ❌
let apelido: string | undefined;   // ✅ declarado como "pode faltar"

const tarefa = tarefas.find((t) => t.id === 3); // tipo: Tarefa | undefined
tarefa.titulo;                     // ❌ 'tarefa' is possibly 'undefined'
```

Olhe a última linha com atenção, porque ela resume o valor dessa checagem. O `find` pode não achar nada, e aí devolve `undefined`. Sem o `strictNullChecks`, o `tarefa.titulo` compilaria tranquilamente, e explodiria rodando, com aquele erro famoso, no dia em que a tarefa 3 não existisse. Com a checagem, o TypeScript está te perguntando: "o `find` pode não achar nada; o que você quer fazer nesse caso?". E você **tem** que responder antes de seguir.

Nos tipos, existem duas formas de dizer que alguma coisa pode faltar, e elas querem dizer coisas diferentes:

```ts
type Tarefa = {
  titulo: string;
  prazo?: string;             // pode nem existir (string | undefined)
  responsavel: string | null; // sempre existe, mas pode estar vazio
};
```

O `prazo?` é a gaveta que pode nem ter sido aberta. O `responsavel: string | null` é a gaveta que sempre está ali, e pode ter sido esvaziada.

## Respondendo à pergunta

Existem três ferramentas pra lidar com o vazio, cada uma pra uma situação.

A primeira é o **`if`**, pra quando o caminho do programa muda. Se a coisa não existir, o programa faz outra coisa:

```ts
if (!tarefa) {
  console.error("Tarefa não encontrada");
  return;
}
tarefa.titulo; // ✅ daqui pra baixo, o TypeScript sabe que existe
```

A segunda é o **`?.`** (*optional chaining*), que acessa uma coisa só se ela existir. Se algo no caminho for `null` ou `undefined`, ele para e devolve `undefined`, em vez de dar erro:

```ts
const cidade = usuario?.endereco?.cidade; // undefined se faltar qualquer parte
const primeiraTag = tarefa?.tags?.[0];
callback?.();                             // chama só se a função existir
```

A terceira é o **`??`** (*nullish coalescing*), que dá um valor padrão. Ele troca o valor só se ele for `null` ou `undefined`:

```ts
const titulo = tarefa?.titulo ?? "(sem título)";
const volume = config.volume ?? 50; // mantém o 0 se o usuário escolheu 0
```

E os dois juntos são poderosos: dá pra ler dados incompletos, cheios de buracos, sem escrever um `if` sequer.

```ts
function resumo(config: Config | undefined): string {
  const tema = config?.tema ?? "escuro";
  const minutos = config?.meta?.minutosPorDia ?? 30;
  return `Tema ${tema}, meta de ${minutos} min/dia`;
}
```

Duas armadilhas acompanham essas ferramentas. A primeira é usar o `||` no lugar do `??`. O `0 || 30` dá `30`, e o `"" || "x"` dá `"x"`: o `||` troca qualquer valor "falsy", inclusive o zero e o texto vazio, que muitas vezes são valores válidos (o volume que o usuário colocou no zero, como em [[Operadores e Expressões]]). Pra valor padrão, use `??`, que só troca o que realmente não existe.

A segunda é o **`?.` em tudo**. Se um valor **deveria** sempre existir, colocar `?.` nele não resolve nada: esconde o bug. Em vez de quebrar na hora, perto da causa, o `undefined` segue adiante pelo programa, e o erro aparece bem longe dali, onde ninguém entende de onde veio. Use o `?.` só quando "não existir" é um caso normal, esperado.

## O ! que pede pra confiar

Você vai encontrar um ponto de exclamação no fim de algumas expressões:

```ts
const el = document.querySelector("#app")!; // tira o null do tipo
```

O `!` diz ao TypeScript "eu garanto que isso existe, pode confiar". Só que ele não confere nada quando o programa roda. Se você estiver errado, o programa explode exatamente como explodiria sem ele. Use só quando você **sabe** que existe (por exemplo, logo depois de conferir com um `map.has()`). Espalhar `!` pelo código pra calar o compilador é o mesmo bug de antes, só que escondido. Na dúvida, um `if`.

E mais algumas ferramentas, menos usadas mas úteis. O `??=` preenche uma coisa só se ela estiver vazia:

```ts
config.tema ??= "escuro"; // só atribui se tema for null ou undefined
```

E existe um único caso em que o `==` (dois iguais, que você aprendeu a evitar) é aceito: `valor == null` pega o `null` **e** o `undefined` de uma vez só. É um atalho conhecido pra `valor === null || valor === undefined`.

Dois detalhes que pegam pra fechar. O `typeof null` dá `"object"`, um erro histórico da linguagem, então checar `typeof x === "object"` deixa o `null` passar: complete com `&& x !== null`. E o JSON não tem `undefined`: `JSON.stringify({ a: undefined })` vira `{}`, e o campo simplesmente some. Se o vazio precisa ser salvo num arquivo, use `null`.

## O essencial

1. `undefined` é "ainda não tem valor"; `null` é "vazio de propósito".
2. Com `strictNullChecks`, o TypeScript obriga a tratar o vazio. `find` devolve `T | undefined`.
3. `if` quando o caminho muda; `?.` pra acessar se existir; `??` pra valor padrão.
4. `??` e não `||`, que apaga o `0` e o `""`. E `?.` só onde faltar é normal.
5. O `!` não confere nada: prefira `if`.

## Agora é com você

Torne uma função à prova de vazio. Escreva `nomeDoResponsavel(projetos, idProjeto)`, em que cada projeto tem um `responsavel?: { nome: string; apelido?: string | null }`. Ela deve devolver o apelido; se não houver apelido, o nome; se não houver responsável, `"ninguém"`; e se o projeto não existir, `"projeto não encontrado"`. Sem nenhum `!`, sem nenhum `any`, com o `strict` ligado. Teste os quatro casos. Você terminou quando o `npm run check` passar e os quatro casos derem a resposta certa.

Daqui, volte a [[Interfaces e Type Aliases]] e siga pros [[Union Types e Narrowing]], onde o "pode ser vazio" vira só mais um caso de união.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `null` e `undefined`?
> `undefined` é "ainda não tem valor/não existe"; `null` é "vazio de propósito", atribuído por alguém.

> [!question]- O que o `?.` faz?
> Acessa a propriedade (ou chama a função) só se o valor antes dele não for `null`/`undefined`; senão, o resultado é `undefined` sem erro.

> [!question]- Qual a diferença entre `??` e `||`?
> `??` só usa o padrão quando o valor é `null`/`undefined`; `||` usa pra qualquer falsy, inclusive `0` e `""`.

> [!question]- O que o `strictNullChecks` muda?
> Impede que `null`/`undefined` sejam usados como outros tipos: o TS obriga a tratar o caso vazio antes de usar.

> [!question]- Por que evitar o `!` (non-null assertion)?
> Porque só cala o compilador, sem checar nada em execução. Se o valor estiver vazio, o programa quebra do mesmo jeito.

> [!question]- Qual a diferença entre `prazo?: string` e `prazo: string | null`?
> `prazo?` pode nem existir no objeto; `string | null` sempre existe, mas pode estar vazio.

> [!question]- Por que colocar `?.` em tudo é perigoso?
> Porque esconde o bug: o `undefined` segue adiante e o erro aparece longe da causa.

> [!question]+ `const t = { prazo: null }`. Quanto vale `t.prazo?.length ?? 0`?
> - a) Erro: não dá pra ler `length` de `null`
> - b) `0`
> - c) `null`
> - d) `undefined`
>
> > [!check]- Resposta
> > **b)** `?.` vê o `null` e para, devolvendo `undefined` em vez de dar erro. Depois o `??` troca o `undefined` por `0`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `a?.b` | Acessa se `a` existir |
| `a?.[0]` / `f?.()` | Índice / chamada opcional |
| `a ?? padrao` | Padrão só pra null/undefined |
| `a ??= padrao` | Preenche se estiver vazio |
| `campo?: T` | Propriedade opcional |
| `T \| null` | Existe, mas pode estar vazio |
| `x == null` | Pega null e undefined |
| `x!` | "Confia em mim" (evite) |

**Pra ler:** o capítulo [Optional chaining](https://javascript.info/optional-chaining) do javascript.info explica o `?.` com todos os casos de uso. E a seção sobre [null e undefined no TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined) mostra o `strictNullChecks` em ação.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

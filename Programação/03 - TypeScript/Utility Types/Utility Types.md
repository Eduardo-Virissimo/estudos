---
nivel: escrito
foco: importante
revisado:
---

# Utility Types

**Quanto focar: 📌 importante.** Economizam muito tipo repetido. Conheça os principais (`Partial`, `Pick`, `Omit`, `Record`) e consulte o resto.

**Quanto tempo:** cerca de 1h: 20 min de leitura, 5 min no Me teste e 40 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

O seu programa tem um tipo `Tarefa`, com seis campos. Mas na hora de criar uma tarefa nova, o usuário não informa o `id` nem a data de criação: o programa gera os dois. Então você escreve um segundo tipo, `NovaTarefa`, copiando quatro dos campos. Na tela de edição, todos os campos são opcionais, e nasce um terceiro tipo, `AtualizacaoTarefa`. Na lista resumida, só aparecem dois campos: um quarto tipo. Quatro tipos, todos parecidos, todos copiados à mão.

Aí um dia a tarefa ganha um campo novo, `tags`. Você atualiza o `Tarefa`, e esquece de atualizar a `NovaTarefa`. O formulário de criação para de mandar as tags, e ninguém percebe por semanas.

Os **utility types** existem pra isso. São tipos prontos do TypeScript que **criam tipos novos a partir dos que já existem**. Você escreve o tipo principal uma vez só, e deriva as variações dele: o que o usuário informa ao criar é `Omit<Tarefa, "id">`; o que pode mudar numa atualização é `Partial<...>`; o que aparece numa lista é `Pick<...>`. E aí, mudou o tipo principal, tudo o que deriva dele muda junto. Ajuda ter passado pelos [[Generics]] e por [[Interfaces e Type Aliases]].

Pros exemplos, este é o tipo principal:

```ts
interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  prioridade: "baixa" | "média" | "alta";
  prazo?: string;
  criadaEm: string;
}
```

## Tirar e escolher campos

Quando o usuário cria uma tarefa, ele não informa o `id` nem a `criadaEm`. Então o tipo da entrada é "uma `Tarefa`, **menos** esses dois campos". E é exatamente assim que se escreve:

```ts
type NovaTarefa = Omit<Tarefa, "id" | "criadaEm">;

function criar(dados: NovaTarefa): Tarefa {
  return { ...dados, id: Date.now(), criadaEm: new Date().toISOString() };
}
```

O `Omit` **tira** campos. O oposto dele é o `Pick`, que **escolhe** só alguns:

```ts
type ResumoTarefa = Pick<Tarefa, "id" | "titulo">; // só o que aparece numa lista curta
```

Pra não confundir os dois, lembre do inglês: *omit* é omitir (tira), *pick* é pegar (escolhe).

Um cuidado com o `Omit`: se você errar o nome do campo, como `Omit<Tarefa, "idd">`, ele não reclama. Simplesmente não remove nada, e o seu tipo continua com o `id`. Pra conferir o resultado de qualquer utility type, passe o mouse por cima do nome do tipo no editor: ele mostra o tipo final, campo por campo.

## Tudo opcional, ou tudo obrigatório

Numa atualização, você quer mudar **só alguns** campos: marcar uma tarefa como concluída, sem precisar mandar o título de novo. O `Partial` deixa todos os campos opcionais:

```ts
type AtualizacaoTarefa = Partial<Omit<Tarefa, "id" | "criadaEm">>;

function atualizar(t: Tarefa, mudancas: AtualizacaoTarefa): Tarefa {
  return { ...t, ...mudancas };
}

atualizar(tarefa, { concluida: true }); // ✅ só um campo
```

Repare que os utility types se combinam: primeiro o `Omit` tira o que **não pode** mudar (ninguém deveria trocar o `id` de uma tarefa), e depois o `Partial` deixa o resto opcional. E o spread `{ ...t, ...mudancas }` aplica só o que veio, mantendo o resto.

O contrário do `Partial` é o `Required`, que deixa tudo obrigatório:

```ts
type TarefaCompleta = Required<Tarefa>; // o prazo deixa de ser opcional
```

Só tem um limite no `Partial`: ele age no **primeiro nível**. Se a tarefa tivesse um objeto dentro, como `endereco: { cidade, uf }`, o `Partial` deixaria o `endereco` opcional, mas se você mandar um `endereco`, ele precisa vir completo, com cidade e uf.

## Derive, não copie

Esta é a ideia por trás de toda a nota, então vale olhar lado a lado:

```ts
// ❌ copiado à mão: vários lugares pra manter
type CriarTarefaInput = { titulo: string; prioridade: "baixa" | "média" | "alta"; prazo?: string };
type TarefaParaLista  = { id: number; titulo: string; concluida: boolean };

// ✅ derivado: um lugar só
type CriarTarefaInput     = Omit<Tarefa, "id" | "criadaEm" | "concluida">;
type AtualizarTarefaInput = Partial<CriarTarefaInput> & { concluida?: boolean };
type TarefaParaLista      = Pick<Tarefa, "id" | "titulo" | "concluida">;
```

Agora volte ao problema do começo e adicione um campo `tags` na `Tarefa`. Na versão copiada, você precisa lembrar de atualizar cada tipo, um por um, e em algum momento vai esquecer de um. Na versão derivada, os três já sabem do campo novo, sem você tocar neles.

É o mesmo princípio que vale pro código: **uma fonte da verdade, e o resto deriva dela.**

Só não exagere no encadeamento. Um `Partial<Pick<Omit<Required<T>, ...>>>` vira um enigma que ninguém consegue ler. Quando ficar comprido assim, dê nomes aos passos intermediários, como `type Editavel = ...`.

## Pegando o tipo de outras coisas

Às vezes a ordem é a inversa: o **valor** ou a **função** vem primeiro, e você quer o tipo deles.

```ts
const CONFIG_PADRAO = { tema: "escuro", meta: 30 };
type Config = typeof CONFIG_PADRAO; // { tema: string; meta: number }

function criarUsuario(nome: string, admin: boolean) {
  return { nome, admin, criadoEm: new Date() };
}
type Usuario = ReturnType<typeof criarUsuario>; // o tipo do que ela devolve
type Args = Parameters<typeof criarUsuario>;    // [nome: string, admin: boolean]
```

O `typeof`, quando aparece no lugar de um tipo, pega o tipo de um **valor**. E o `ReturnType` pega o tipo do que uma função devolve. Assim, se a função mudar, o tipo `Usuario` muda junto.

Pra funções `async`, que devolvem uma `Promise`, o `Awaited` "abre" a promessa e te dá o que tem dentro:

```ts
async function carregar() { return [] as Tarefa[]; }
type Carregado = Awaited<ReturnType<typeof carregar>>; // Tarefa[] (sem o Promise)
```

E pra pegar o tipo de **um campo só**, use colchetes:

```ts
type Prioridade = Tarefa["prioridade"]; // "baixa" | "média" | "alta"
```

## Dicionários, leitura e uniões

O `Record<Chave, Valor>` é um dicionário. E quando as chaves são uma união, o TypeScript exige **todas** elas:

```ts
const cores: Record<Prioridade, string> = { baixa: "verde", média: "amarelo", alta: "vermelho" };
```

O `Readonly<T>` impede alterações:

```ts
function mostrar(t: Readonly<Tarefa>) {
  t.titulo = "x"; // ❌ read-only
}
const LISTA: readonly string[] = ["a", "b"]; // sem push nem pop
```

Ele é ótimo pra deixar claro, na assinatura, que uma função só vai **ler** a tarefa, não alterar. Mas lembre: ele só vale na compilação, e só no primeiro nível. Objetos lá dentro continuam alteráveis.

Por fim, três utility types que mexem em **uniões**:

```ts
type Status = "a fazer" | "fazendo" | "feito" | "cancelado";
type Ativo = Exclude<Status, "feito" | "cancelado">;  // "a fazer" | "fazendo"
type Final = Extract<Status, "feito" | "cancelado">;  // "feito" | "cancelado"
type Nome  = NonNullable<string | null | undefined>;  // string
```

O `Exclude` tira opções de uma união, o `Extract` fica só com algumas, e o `NonNullable` tira o `null` e o `undefined`.

## O essencial

1. Escreva o tipo principal uma vez e derive o resto. Mudou o principal, os derivados acompanham.
2. `Omit` tira campos, `Pick` escolhe campos. Confira o resultado passando o mouse no editor.
3. `Partial` deixa tudo opcional (bom pra atualizações), `Required` deixa tudo obrigatório.
4. `typeof valor`, `ReturnType<typeof f>` e `Awaited` pegam tipos de valores e funções. `T["campo"]` pega o tipo de um campo.
5. Encadeou demais? Dê nomes aos passos.

## Agora é com você

Derive todos os tipos de um cadastro a partir de um só. Crie uma `interface Livro` com `id`, `titulo`, `autor`, `paginas`, `lido: boolean`, uma `nota?: 1 | 2 | 3 | 4 | 5` e o `adicionadoEm`. Agora derive, sem repetir nenhum campo: um `NovoLivro` (sem o `id` e sem o `adicionadoEm`), um `AtualizarLivro` (tudo opcional, menos o `id`) e um `CartaoLivro` (só o título, o autor e a nota). Escreva `adicionar(lista, dados: NovoLivro)` e `atualizar(lista, mudancas: AtualizarLivro)`. E então o teste final: adicione um campo `genero` no `Livro`, e veja onde o compilador passa a pedir o campo. Você terminou quando os três tipos derivados aparecerem certos no editor, e adicionar o `genero` exigir mudança **só** na função `adicionar` e nos dados de exemplo.

Daqui, siga pra [[Validação com Zod]], e mais adiante pras [[Rotas e Controllers]] e pro [[ORM]], onde esses tipos derivados aparecem o tempo todo.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `Pick` e `Omit`?
> `Pick<T, K>` fica só com as chaves K; `Omit<T, K>` fica com todas, menos as K.

> [!question]- Pra que serve `Partial<T>`?
> Deixa todas as propriedades de T opcionais; comum em tipos de atualização ("muda só o que vier").

> [!question]- Como pegar o tipo de retorno de uma função async sem o `Promise`?
> `Awaited<ReturnType<typeof funcao>>`.

> [!question]- O que `Exclude<"a" | "b" | "c", "a">` produz?
> `"b" | "c"`.

> [!question]- Por que derivar tipos em vez de escrever cada um?
> Pra ter uma fonte da verdade: ao mudar o tipo principal, os derivados acompanham e não saem de sincronia.

> [!question]- O que faz `Tarefa["prioridade"]`?
> Acessa o tipo da propriedade `prioridade` de `Tarefa` (acesso por índice).

> [!question]+ `type Dados = Omit<Tarefa, "id">`. O que `Dados` tem?
> - a) Só o campo `id`
> - b) Todos os campos de `Tarefa`, menos `id`
> - c) Todos os campos, com `id` opcional
> - d) Todos os campos, todos opcionais
>
> > [!check]- Resposta
> > **b)** `Omit` **tira** campos e `Pick` **escolhe** campos. Deixar tudo opcional é o `Partial`.

---

## Pra consultar depois

| Utility | Resultado |
|---|---|
| `Partial<T>` | Tudo opcional |
| `Required<T>` | Tudo obrigatório |
| `Readonly<T>` | Tudo somente leitura |
| `Pick<T, K>` | Só as chaves K |
| `Omit<T, K>` | Tudo menos K |
| `Record<K, V>` | Dicionário |
| `Exclude<U, X>` / `Extract<U, X>` | Tirar / ficar com membros da união |
| `NonNullable<T>` | Sem null/undefined |
| `ReturnType<typeof f>` / `Parameters<typeof f>` | Retorno / parâmetros |
| `Awaited<P>` | O valor dentro da Promise |
| `T["campo"]` | O tipo de uma propriedade |

**Pra ler e praticar:** a página de [Utility Types do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/utility-types.html) lista todos, cada um com um exemplo curto. E o [Type Challenges](https://github.com/type-challenges/type-challenges) é uma coleção de exercícios de tipos, do fácil ao absurdo; um bom exercício é reimplementar o `Pick` e o `Omit` você mesmo, pra ver como eles funcionam por dentro.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

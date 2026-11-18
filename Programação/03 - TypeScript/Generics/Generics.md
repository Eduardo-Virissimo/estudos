---
nivel: escrito
revisado:
---

# Generics

Você quer escrever uma função que devolve o primeiro item de uma lista. Qualquer lista: de textos, de números, de tarefas. Como tipar isso? Se você escreve `lista: string[]`, ela só serve pra textos. Uma versão pra cada tipo seria absurdo. Então você tenta o óbvio, `any`, e ele aceita qualquer coisa. Mas aí acontece isto:

```ts
function primeiroAny(lista: any[]): any { return lista[0]; }

const a = primeiroAny(["x", "y"]); // any: o TypeScript esqueceu que era texto
a.toFixed();                       // compila... e quebra rodando
```

Entrou uma lista de textos, e saiu "qualquer coisa". O TypeScript perdeu a informação no caminho, e deixou passar um `toFixed()`, que nem existe em texto. Você ganhou flexibilidade e perdeu exatamente a proteção que o TypeScript existe pra dar.

Os **generics** resolvem esse dilema. Eles deixam uma função, um tipo ou uma classe funcionar com **qualquer tipo, sem perder a checagem**. E apesar do nome intimidador, você já usa generics o tempo todo: `Array<string>`, `Promise<Tarefa>`, `Map<string, number>`. Esta nota ensina a escrever os seus. Ajuda já conhecer [[Interfaces e Type Aliases]], [[Union Types e Narrowing]] e [[Funções]].

## Uma variável pra tipos

A mesma função, agora com generics:

```ts
function primeiro<T>(lista: T[]): T | undefined { return lista[0]; }

const b = primeiro(["x", "y"]);    // string | undefined ✅
b?.toFixed();                      // ❌ erro: string não tem toFixed
```

O `<T>` é um **parâmetro de tipo**. Pense nele como uma variável, só que em vez de guardar um valor, ela guarda um tipo. A assinatura se lê assim: "esta função funciona com algum tipo `T`; ela recebe uma lista de `T` e devolve um `T`". E a cada chamada, o TypeScript descobre sozinho quem é o `T`, olhando o argumento: você passou `["x", "y"]`, então `T` é `string`, e o retorno é `string`.

Uma imagem ajuda. Pense numa caixa de transporte. Com `any`, a caixa não tem etiqueta: você coloca um livro dentro e, quando abre do outro lado, não faz ideia do que vai encontrar. Com generics, a etiqueta **acompanha o conteúdo**: entrou livro, a caixa diz "livro" até o fim da viagem.

E isso dá o critério pra saber quando usar: **generics servem pra ligar a entrada à saída.** Se o tipo do que entra determina o tipo do que sai, é caso de generic.

Pode haver mais de um parâmetro de tipo:

```ts
function mapear<T, R>(lista: T[], fn: (item: T) => R): R[] {
  const saida: R[] = [];
  for (const item of lista) saida.push(fn(item));
  return saida;
}
mapear([1, 2], (n) => `#${n}`); // string[]
```

Aqui entra uma lista de `T`, a função transforma cada `T` num `R`, e sai uma lista de `R`. Os nomes são só convenção: `T` de *type*, `K` de *key*, `V` de *value*, `R` de *return*. Nomes completos, como `TItem`, também valem quando ajudam a ler.

Duas observações sobre o que **não** fazer. A primeira: um generic que não liga nada não serve pra nada. Numa `function f<T>(x: T): void`, o `T` aparece uma vez só, e não conecta a entrada com saída nenhuma, então é o mesmo que `unknown`, só que mais complicado. A segunda: não force o tipo na chamada sem precisar. `primeiro<string>(["a"])` é redundante, porque o TypeScript deduz sozinho. Passe explícito só quando ele não consegue, como ao criar uma coleção vazia: `new Map<string, number>()`.

## Qualquer tipo, desde que...

Às vezes o `T` não pode ser **qualquer** coisa. Se a sua função usa `.length`, o `T` precisa ter `.length`. Se você tentar sem avisar, o TypeScript reclama, e com razão: ele não sabe se o `T` vai ter essa propriedade.

O `extends` resolve isso, dizendo: "o `T` pode ser qualquer tipo, **desde que** tenha isto":

```ts
function maisLongo<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
maisLongo("abc", "de");  // ✅ string tem length
maisLongo([1, 2], [3]);  // ✅ array tem length
maisLongo(10, 20);       // ❌ number não tem length
```

O uso mais comum disso no dia a dia são funções que trabalham com qualquer coisa que tenha um `id`:

```ts
function porId<T extends { id: number }>(lista: T[], id: number): T | undefined {
  return lista.find((x) => x.id === id);
}
```

Ela funciona com tarefas, usuários, produtos, qualquer coisa com `id`. E devolve o tipo certo de cada um: passou tarefas, recebe uma tarefa.

## Os generics que você já usa

Agora que você sabe o que é o `<T>`, vai reconhecer generics em todo canto. O que está entre `< >` é o tipo que preenche o `T`:

```ts
const nomes: Array<string> = [];             // lista de textos (o mesmo que string[])
const dados: Promise<Tarefa> = buscar();     // promessa que vai entregar uma Tarefa
const xp = new Map<string, number>();        // mapa de texto pra número
```

E você pode criar seus próprios **tipos** genéricos. Este é um dos mais úteis que existem, pra representar uma operação que pode dar certo ou errado:

```ts
type Resultado<T> =
  | { ok: true; valor: T }
  | { ok: false; erro: string };

function dividir(a: number, b: number): Resultado<number> {
  return b === 0 ? { ok: false, erro: "divisão por zero" } : { ok: true, valor: a / b };
}
```

`Resultado<number>`, `Resultado<Tarefa>`, `Resultado<string[]>`: um tipo escrito uma vez só, que serve pra qualquer coisa.

## As chaves de um tipo

Existe um operador que combina muito bem com generics: o `keyof`, que dá a união das chaves de um tipo.

```ts
interface Tarefa { id: number; titulo: string; concluida: boolean }
type Chave = keyof Tarefa; // "id" | "titulo" | "concluida"
```

Junto com generics, ele permite escrever funções que **só aceitam chaves que existem**:

```ts
function pegar<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}
pegar(tarefa, "titulo"); // string
pegar(tarefa, "prazo");  // ❌ "prazo" não é chave de Tarefa
```

O `K extends keyof T` diz "a chave tem que ser uma das chaves de `T`". E o `T[K]` quer dizer "o tipo da propriedade `K` dentro de `T`". Então o TypeScript sabe que `pegar(tarefa, "titulo")` devolve uma `string`, e que `pegar(tarefa, "concluida")` devolve um `boolean`. É um nível de precisão que parece mágica na primeira vez.

## Classes genéricas

Classes também aceitam parâmetros de tipo. Olhe um repositório em memória que serve pra qualquer coisa com `id`:

```ts
interface ComId { id: number }

class RepositorioMemoria<T extends ComId> {
  #itens = new Map<number, T>();

  salvar(item: T): void { this.#itens.set(item.id, item); }
  buscar(id: number): T | undefined { return this.#itens.get(id); }
  listar(): T[] { return [...this.#itens.values()]; }
}

const tarefas = new RepositorioMemoria<Tarefa>();
tarefas.salvar({ id: 1, titulo: "Estudar", concluida: false });

const usuarios = new RepositorioMemoria<Usuario>();
usuarios.salvar({ id: 1, titulo: "x" }); // ❌ Usuario não tem titulo
```

Uma classe só, escrita uma vez, e tipada certinho pra cada uso. Esse é o padrão [[Repository]], que aparece no Estágio 3.

Um tipo genérico também pode ter um valor padrão, pra quando ninguém disser qual é o `T`: `interface Resposta<T = unknown> { status: number; corpo: T }`.

E um aviso pra fechar: generics demais viram enigma. Se você se pegar escrevendo um `<T extends keyof U[K]>` de três níveis, provavelmente o design pode ser mais simples. Generic bom é o que deixa o código mais fácil de usar, não mais impressionante de ler.

## O essencial

1. Generics ligam a entrada à saída: entrou `T`, sai `T`. O `any` perde o tipo no caminho.
2. O TypeScript descobre o `T` pelo argumento. Só passe explícito quando ele não conseguir.
3. `<T extends X>` restringe: qualquer tipo, desde que tenha o que você precisa.
4. `keyof T` são as chaves de `T`; `T[K]` é o tipo de uma delas.
5. `Array<T>`, `Promise<T>` e `Map<K, V>` são generics que você já usa.

## Agora é com você

Escreva três utilitários genéricos que você vai reusar em todo projeto. O `agruparPor<T, K extends PropertyKey>(lista: T[], chave: (item: T) => K): Record<K, T[]>`, que agrupa os itens de uma lista. O `unicoPor<T>(lista: T[], chave: (item: T) => unknown): T[]`, que remove os duplicados por uma chave (dica: `Set`). E o `type Resultado<T>` com uma função `tentar<T>(fn: () => T): Resultado<T>`, que roda uma função e captura qualquer exceção. Teste com uma lista de tarefas e uma de usuários, e confira no editor (passando o mouse por cima) que os tipos de retorno estão certos. Você terminou quando `agruparPor(tarefas, t => t.prioridade)` devolver um objeto tipado por prioridade, sem nenhum `any` no caminho.

Daqui, siga pros [[Utility Types]], que são generics prontos, e depois pro [[Repository]] e pra [[Validação com Zod]].

---

## 🧠 Me teste

> [!question]- Por que generics são melhores que `any`?
> Porque mantêm a informação do tipo: o que entra define o que sai, e o TS continua checando. `any` desliga a checagem.

> [!question]- O que faz `<T extends { id: number }>`?
> Restringe o T: aceita qualquer tipo, desde que tenha a propriedade `id` do tipo number.

> [!question]- O que `keyof Tarefa` produz?
> A união das chaves do tipo: `"id" | "titulo" | "concluida"`.

> [!question]- Cite três generics que você já usa sem perceber.
> `Array<T>` (`T[]`), `Promise<T>`, `Map<K, V>`, `Set<T>`, `Record<K, V>`.

> [!question]- Quando passar o tipo explicitamente (`f<string>(...)`)?
> Só quando o TypeScript não consegue inferir, como numa coleção criada vazia (`new Map<string, number>()`).

> [!question]- Quando um generic não serve pra nada?
> Quando o `T` aparece uma vez só e não liga a entrada à saída: aí é o mesmo que `unknown`.

> [!question]+ `function primeiro<T>(lista: T[]): T`. Qual o tipo de `primeiro(["a", "b"])`?
> - a) `any`
> - b) `T`
> - c) `string`
> - d) `string[]`
>
> > [!check]- Resposta
> > **c)** O TypeScript **infere** `T = string` pelo argumento. Essa é a vantagem sobre `any`: o tipo de quem chamou chega até o retorno.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `function f<T>(x: T): T` | Função genérica |
| `type R<T> = { valor: T }` | Tipo genérico |
| `class C<T> { }` | Classe genérica |
| `<T extends X>` | Restrição |
| `keyof T` | As chaves de T |
| `T[K]` | O tipo da propriedade K |
| `<T = unknown>` | Tipo padrão |
| `new Map<string, number>()` | Passar o tipo explícito |

**Pra ler:** a parte de [Generics do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/generics.html) vai do básico até classes genéricas, com exemplos curtos. E a página sobre o [operador keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) é pequena e esclarece bem o `T[K]`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

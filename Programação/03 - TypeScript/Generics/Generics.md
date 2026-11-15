---
nivel: escrito
revisado:
---

# Generics

> *"Generic é um parâmetro, só que pra tipos."*

> [!tip] ⚡ Em 30 segundos
> **Generics** deixam uma função, tipo ou classe funcionar com **qualquer tipo sem perder a checagem**. Em vez de `any` (que esquece o tipo), você escreve um "parâmetro de tipo" `<T>`: `primeiro<T>(lista: T[]): T | undefined`. Chamou com `string[]`, volta `string`; com `Tarefa[]`, volta `Tarefa`. Você já usa generics o tempo todo: `Array<string>`, `Promise<Tarefa>`, `Map<string, number>`.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever funções genéricas e explicar por que são melhores que `any`
- Criar tipos e classes genéricos (`Resultado<T>`, `Repositorio<T>`)
- Restringir um generic com `extends` e usar `keyof`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Interfaces e Type Aliases]] · [[Union Types e Narrowing]] · [[Funções]]
- **Depois:** [[Utility Types]] · [[Repository]] · [[Validação com Zod]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O problema que generics resolvem

```ts
function primeiroAny(lista: any[]): any { return lista[0]; }
const a = primeiroAny(["x", "y"]);  // any: o TS esqueceu que era string
a.toFixed();                        // compila... e quebra rodando

function primeiro<T>(lista: T[]): T | undefined { return lista[0]; }
const b = primeiro(["x", "y"]);     // string | undefined ✅
b?.toFixed();                       // ❌ erro: string não tem toFixed
```

`T` é um **nome**: o TS descobre qual tipo ele é a cada chamada (inferência).

### 2. Vários parâmetros de tipo

```ts
function par<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
par("xp", 120); // [string, number]

function mapear<T, R>(lista: T[], fn: (item: T) => R): R[] {
  const saida: R[] = [];
  for (const item of lista) saida.push(fn(item));
  return saida;
}
mapear([1, 2], (n) => `#${n}`); // string[]
```

Convenção: `T` (type), `K` (key), `V` (value), `R` (return), ou nomes completos (`TItem`) quando ajuda.

### 3. Tipos genéricos

```ts
type Resultado<T> =
  | { ok: true; valor: T }
  | { ok: false; erro: string };

function dividir(a: number, b: number): Resultado<number> {
  return b === 0 ? { ok: false, erro: "divisão por zero" } : { ok: true, valor: a / b };
}

interface Pagina<T> {
  itens: T[];
  pagina: number;
  total: number;
}
const p: Pagina<Tarefa> = { itens: [], pagina: 1, total: 0 };
```

### 4. Restrições com `extends`

"T pode ser qualquer coisa, **desde que** tenha...":

```ts
function maisLongo<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
maisLongo("abc", "de");     // ✅ string tem length
maisLongo([1, 2], [3]);     // ✅ array tem length
maisLongo(10, 20);          // ❌ number não tem length

function porId<T extends { id: number }>(lista: T[], id: number): T | undefined {
  return lista.find((x) => x.id === id);
}
```

### 5. `keyof`: as chaves de um tipo

```ts
interface Tarefa { id: number; titulo: string; concluida: boolean }
type Chave = keyof Tarefa; // "id" | "titulo" | "concluida"

function pegar<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}
pegar(tarefa, "titulo");   // string
pegar(tarefa, "prazo");    // ❌ "prazo" não é chave de Tarefa

function ordenarPor<T>(lista: T[], chave: keyof T): T[] {
  return lista.toSorted((a, b) => (a[chave] < b[chave] ? -1 : a[chave] > b[chave] ? 1 : 0));
}
ordenarPor(tarefas, "titulo");
```

### 6. Classe genérica

```ts
class Pilha<T> {
  #itens: T[] = [];
  empilhar(item: T) { this.#itens.push(item); }
  desempilhar(): T | undefined { return this.#itens.pop(); }
  get tamanho() { return this.#itens.length; }
}

const historico = new Pilha<string>();
historico.empilhar("abrir");
historico.empilhar(42); // ❌
```

### 7. Valor padrão do tipo

```ts
interface Resposta<T = unknown> { status: number; corpo: T }
const r: Resposta = { status: 200, corpo: "?" }; // T = unknown
```

---

## 🛠️ Exemplo guiado

Um repositório em memória que serve pra qualquer entidade com `id`:

```ts
interface ComId { id: number }

class RepositorioMemoria<T extends ComId> {
  #itens = new Map<number, T>();

  salvar(item: T): void { this.#itens.set(item.id, item); }
  buscar(id: number): T | undefined { return this.#itens.get(id); }
  listar(): T[] { return [...this.#itens.values()]; }
  filtrar(cond: (item: T) => boolean): T[] { return this.listar().filter(cond); }
}

interface Tarefa extends ComId { titulo: string; concluida: boolean }
interface Usuario extends ComId { nome: string }

const tarefas = new RepositorioMemoria<Tarefa>();
tarefas.salvar({ id: 1, titulo: "Estudar", concluida: false });
tarefas.filtrar((t) => !t.concluida);    // t: Tarefa, autocomplete funciona

const usuarios = new RepositorioMemoria<Usuario>();
usuarios.salvar({ id: 1, titulo: "x" }); // ❌ Usuario não tem titulo
```

Uma classe, escrita uma vez, tipada certinha pra cada uso. É o padrão [[Repository]] do Estágio 3.

---

## 🔧 Pegadinhas

- **Generic que não liga nada.** `function f<T>(x: T): void` com `T` usado uma vez só não ganha nada; use `unknown`. Generic serve pra **conectar** entrada e saída.
- **Forçar o tipo na chamada sem precisar.** `primeiro<string>(["a"])` é redundante; deixe inferir. Passe explícito só quando o TS não consegue (ex: `new Map<string, number>()` vazio).
- **`T` sem restrição e acessando propriedade.** `x.id` com `T` livre dá erro: adicione `T extends { id: number }`.
- **Generics em excesso.** Três níveis de `<T extends keyof U[K]>` ninguém lê. Se ficou complicado, simplifique o design.

---

## 🔨 Desafio prático

**Objetivo:** utilitários genéricos que você vai reusar.

1. `agruparPor<T, K extends PropertyKey>(lista: T[], chave: (item: T) => K): Record<K, T[]>`.
2. `unicoPor<T>(lista: T[], chave: (item: T) => unknown): T[]` (remove duplicados pela chave; dica: `Set`).
3. `type Resultado<T>` e `tentar<T>(fn: () => T): Resultado<T>` que captura exceções.
4. Teste com tarefas e com usuários, confirmando no editor (passe o mouse) que os tipos de retorno estão certos.

**Pronto quando:** `agruparPor(tarefas, t => t.prioridade)` devolve um objeto tipado por prioridade, e nenhum `any` foi usado.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `function f<T>(x: T): T` | função genérica |
| `type R<T> = { valor: T }` | tipo genérico |
| `class C<T> { }` | classe genérica |
| `<T extends X>` | restrição |
| `keyof T` | chaves de T |
| `T[K]` | tipo da propriedade K |
| `<T = unknown>` | tipo padrão |
| `new Map<string, number>()` | passar explícito |

---

## 🛠️ Exemplo meu

```ts

```

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
- 

**O que me confundiu / onde eu errei:**
- 

**Onde eu usei de verdade:**
- 

---

## 📚 Recursos

- [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook · Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

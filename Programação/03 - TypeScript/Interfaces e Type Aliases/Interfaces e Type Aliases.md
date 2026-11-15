---
nivel: escrito
revisado:
---

# Interfaces e Type Aliases

> *"Defina o formato dos seus dados primeiro. O resto do código se escreve quase sozinho."*

> [!tip] ⚡ Em 30 segundos
> `interface` e `type` dão **nome ao formato de um objeto**: quais propriedades ele tem e de que tipo. Escrito uma vez, o tipo `Tarefa` é reusado em todo o programa, e o TypeScript avisa quando falta campo, sobra campo ou o tipo não bate. Pra objetos os dois são quase iguais; `type` também serve pra uniões e outros tipos. Escolha um padrão e mantenha.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Descrever o formato de um objeto com `interface` e com `type`
- Usar propriedades opcionais, `readonly`, objetos aninhados e índices (`Record`)
- Estender e combinar tipos (`extends` e `&`) e escolher entre `interface` e `type`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Tipos Básicos do TypeScript]] · [[null e undefined]]
- **Depois:** [[Union Types e Narrowing]] · [[Generics]] · [[Utility Types]] · [[Interfaces]] (de OO, no Estágio 3)
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. As duas formas

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

### 2. Opcional e `readonly`

```ts
interface Tarefa {
  readonly id: number;   // não pode ser alterado depois de criado
  titulo: string;
  prazo?: string;        // pode faltar
  tags: string[];
}

t.id = 2; // ❌ Cannot assign to 'id' because it is a read-only property
```

### 3. Aninhado e reusando

```ts
interface Endereco { cidade: string; uf: string }

interface Cliente {
  nome: string;
  endereco: Endereco;          // reusa outro tipo
  contatos: { tipo: "email" | "telefone"; valor: string }[];
}
```

### 4. Objeto como dicionário: `Record`

```ts
type XpPorDia = Record<string, number>;      // chaves string, valores number
const historico: XpPorDia = { "2026-11-14": 120, "2026-11-15": 80 };

type Nivel = "escrito" | "praticado" | "projeto";
const emoji: Record<Nivel, string> = { escrito: "📝", praticado: "🔨", projeto: "🚀" };
// se faltar um nível, o TS reclama ✅
```

### 5. Funções dentro do tipo

```ts
interface Repositorio {
  listar(): Tarefa[];
  buscar(id: number): Tarefa | undefined;
  salvar: (t: Tarefa) => void;   // sintaxe alternativa
}
```

### 6. Estendendo e combinando

```ts
interface Pessoa { nome: string }
interface Aluno extends Pessoa { matricula: string }   // interface: extends

type Admin = Usuario & { permissoes: string[] };       // type: & (interseção)
```

### 7. `interface` × `type`: qual usar?

| | `interface` | `type` |
|---|---|---|
| Formato de objeto | ✅ | ✅ |
| União (`"a" \| "b"`) | ❌ | ✅ |
| Tupla, função, primitivo | ❌ | ✅ |
| Estender | `extends` | `&` |
| Pode ser "reaberta" e somada | ✅ (declaration merging) | ❌ |

Regra simples e comum: **`type` pra tudo**, ou **`interface` pra objetos e `type` pro resto**. O que importa é a consistência no projeto.

### 8. Tipo estrutural: o formato é o que vale

```ts
interface Ponto { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const q: Ponto = p; // ✅ tem x e y, isso basta

const r: Ponto = { x: 1, y: 2, z: 3 }; // ❌ objeto literal com campo a mais é erro (provável erro de digitação)
```

TypeScript compara **formato**, não nome. É diferente de Java/C#.

---

## 🛠️ Exemplo guiado

Modelando o domínio do gerenciador de tarefas:

```ts
type Prioridade = "baixa" | "média" | "alta";

interface Tarefa {
  readonly id: number;
  titulo: string;
  concluida: boolean;
  prioridade: Prioridade;
  criadaEm: string;        // ISO 8601 (veja Datas e Fusos Horários)
  prazo?: string;
}

interface ArquivoDeTarefas {
  versao: 1;               // tipo literal: ajuda a migrar o formato no futuro
  tarefas: Tarefa[];
}

function novaTarefa(id: number, titulo: string, prioridade: Prioridade = "média"): Tarefa {
  return { id, titulo, concluida: false, prioridade, criadaEm: new Date().toISOString() };
}
```

Com o tipo definido, o [[VS Code]] autocompleta todos os campos e qualquer função que receber `Tarefa` sabe exatamente o que tem.

---

## 🔧 Pegadinhas

- **Tipo enorme com tudo opcional.** Se quase tudo é `?`, o tipo não protege nada. Separe em tipos diferentes por situação (ex: `TarefaNova` sem `id`).
- **Duplicar tipos parecidos à mão.** Derive com [[Utility Types]] (`Omit<Tarefa, "id">`).
- **Achar que `readonly` congela em execução.** É só checagem de compilação. Pra congelar de verdade, `Object.freeze`.
- **Interface com o mesmo nome em dois lugares.** Elas se **somam** sem avisar (declaration merging). Com `type`, dá erro de nome duplicado, o que é mais seguro.
- **Nomes com `I` na frente (`ITarefa`).** Convenção antiga de C#; em TS moderno, só `Tarefa`.

---

## 🔨 Desafio prático

**Objetivo:** modelar uma biblioteca pessoal.

1. Crie os tipos `Autor`, `Livro` (com `autor: Autor`, `lidoEm?: string`, `nota?: 1 | 2 | 3 | 4 | 5`) e `Estante` (`Record<string, Livro[]>`, chave = nome da estante).
2. Escreva `livrosLidos(estante: Estante): Livro[]` e `mediaDasNotas(livros: Livro[]): number | null` (null se nenhum tem nota).
3. Crie dados de exemplo com 2 estantes e 5 livros e tente pôr uma nota 6: o TS precisa reclamar.

**Pronto quando:** as funções funcionam, a nota 6 dá erro de compilação e você não usou `any`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `interface X { a: string }` | formato de objeto |
| `type X = { a: string }` | o mesmo, com type |
| `a?: T` | opcional |
| `readonly a: T` | não reatribuível |
| `Record<string, number>` | dicionário |
| `interface B extends A` | estender |
| `type B = A & { b: T }` | combinar |
| `metodo(x: T): R` | função no tipo |

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

- [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook · Differences Between Type Aliases and Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

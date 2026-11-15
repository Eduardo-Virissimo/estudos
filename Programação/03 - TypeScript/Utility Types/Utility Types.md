---
nivel: escrito
revisado:
---

# Utility Types

> *"Uma fonte da verdade. Todo o resto, derivado."*

> [!tip] ⚡ Em 30 segundos
> **Utility types** são tipos prontos do TypeScript que **criam tipos novos a partir dos que já existem**: `Partial<T>` (tudo opcional), `Required<T>`, `Pick<T, "a" | "b">` (só esses campos), `Omit<T, "id">` (tudo menos), `Record<K, V>`, `Readonly<T>`, `ReturnType<typeof f>`, `Awaited<T>`. Com eles você escreve o tipo principal **uma vez** e deriva as variações (criar, atualizar, mostrar), sem copiar e colar campos que depois saem de sincronia.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Derivar tipos de entrada (criar/atualizar) a partir do tipo principal com `Omit`, `Pick` e `Partial`
- Usar `Record`, `Readonly`, `NonNullable`, `Exclude` e `Extract`
- Extrair tipos de funções e valores com `ReturnType`, `Parameters`, `Awaited` e `typeof`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Generics]] · [[Interfaces e Type Aliases]]
- **Depois:** [[Validação com Zod]] · [[Rotas e Controllers]] · [[ORM]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

Tipo base pros exemplos:

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

### 1. `Omit` e `Pick`: escolher campos

```ts
type NovaTarefa = Omit<Tarefa, "id" | "criadaEm">;  // o que o usuário informa ao criar
type ResumoTarefa = Pick<Tarefa, "id" | "titulo">;  // o que aparece numa lista curta

function criar(dados: NovaTarefa): Tarefa {
  return { ...dados, id: Date.now(), criadaEm: new Date().toISOString() };
}
```

### 2. `Partial` e `Required`: opcional ou obrigatório

```ts
type AtualizacaoTarefa = Partial<Omit<Tarefa, "id" | "criadaEm">>; // muda só o que vier

function atualizar(t: Tarefa, mudancas: AtualizacaoTarefa): Tarefa {
  return { ...t, ...mudancas };
}
atualizar(tarefa, { concluida: true }); // ✅ só um campo

type TarefaCompleta = Required<Tarefa>;  // prazo deixa de ser opcional
```

### 3. `Readonly`: ninguém altera

```ts
function mostrar(t: Readonly<Tarefa>) {
  t.titulo = "x"; // ❌ read-only
}
const CONFIG: Readonly<{ tema: string }> = { tema: "escuro" };
const LISTA: readonly string[] = ["a", "b"]; // sem push/pop
```

### 4. `Record`: dicionário com chaves conhecidas

```ts
type Prioridade = Tarefa["prioridade"];              // "baixa" | "média" | "alta" (acesso por índice)
const cores: Record<Prioridade, string> = { baixa: "verde", média: "amarelo", alta: "vermelho" };
const contagem: Record<string, number> = {};
```

### 5. Mexendo em uniões: `Exclude`, `Extract`, `NonNullable`

```ts
type Status = "a fazer" | "fazendo" | "feito" | "cancelado";
type Ativo = Exclude<Status, "feito" | "cancelado">;  // "a fazer" | "fazendo"
type Final = Extract<Status, "feito" | "cancelado">;  // "feito" | "cancelado"

type TalvezNome = string | null | undefined;
type Nome = NonNullable<TalvezNome>;                  // string
```

### 6. Tipos tirados de funções e valores

```ts
function criarUsuario(nome: string, admin: boolean) {
  return { nome, admin, criadoEm: new Date() };
}

type Usuario = ReturnType<typeof criarUsuario>;        // { nome: string; admin: boolean; criadoEm: Date }
type Args = Parameters<typeof criarUsuario>;           // [nome: string, admin: boolean]

async function carregar() { return [] as Tarefa[]; }
type Carregado = Awaited<ReturnType<typeof carregar>>; // Tarefa[] (sem o Promise)

const CONFIG_PADRAO = { tema: "escuro", meta: 30 };
type Config = typeof CONFIG_PADRAO;                    // { tema: string; meta: number }
```

`typeof` (no lugar de um tipo) pega o tipo de um **valor**. Útil quando o valor vem primeiro.

### 7. Combinando: o padrão "criar / atualizar / mostrar"

```ts
type CriarTarefaInput   = Omit<Tarefa, "id" | "criadaEm" | "concluida">;
type AtualizarTarefaInput = Partial<CriarTarefaInput> & { concluida?: boolean };
type TarefaParaLista    = Pick<Tarefa, "id" | "titulo" | "concluida">;
```

Adicionou um campo `tags` em `Tarefa`? Os três tipos já sabem. Nada a sincronizar à mão.

---

## 🛠️ Exemplo guiado

Uma função de atualização segura, com campos protegidos:

```ts
type CamposProtegidos = "id" | "criadaEm";
type Editavel = Omit<Tarefa, CamposProtegidos>;

function editar<K extends keyof Editavel>(t: Tarefa, campo: K, valor: Editavel[K]): Tarefa {
  return { ...t, [campo]: valor };
}

editar(tarefa, "titulo", "Novo título");  // ✅
editar(tarefa, "prioridade", "urgente");  // ❌ "urgente" não é uma prioridade
editar(tarefa, "id", 99);                 // ❌ id não é editável
```

[[Generics]] + `keyof` + `Omit` juntos: o compilador protege as regras do negócio.

---

## 🔧 Pegadinhas

- **`Partial` profundo.** `Partial<T>` só deixa opcional o primeiro nível; objetos aninhados continuam completos.
- **`Readonly` raso e só em compilação.** Não impede mudar objetos internos nem protege em execução.
- **`Omit` com chave errada não dá erro.** `Omit<Tarefa, "idd">` (com erro de digitação) passa sem aviso e não remove nada. Confira passando o mouse.
- **Encadear demais.** `Partial<Pick<Omit<Required<T>, ...>>>` vira enigma. Dê nomes intermediários (`type Editavel = ...`).
- **Copiar tipos em vez de derivar.** Duas definições "iguais" divergem no primeiro campo novo.

---

## 🔨 Desafio prático

**Objetivo:** derivar todos os tipos de um cadastro a partir de um só.

1. Crie `interface Livro { id; titulo; autor; paginas; lido: boolean; nota?: 1|2|3|4|5; adicionadoEm }`.
2. Derive, sem repetir campos: `NovoLivro` (sem id e adicionadoEm), `AtualizarLivro` (tudo opcional menos id), `CartaoLivro` (só titulo, autor e nota).
3. Escreva `adicionar(lista, dados: NovoLivro)` e `atualizar(lista, mudancas: AtualizarLivro)`.
4. Adicione o campo `genero` em `Livro` e veja onde o compilador passa a pedir o campo.

**Pronto quando:** os 3 tipos derivados aparecem certos no editor e adicionar `genero` exige mudança **só** em `adicionar` e nos dados de exemplo.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Utility | Resultado |
|---|---|
| `Partial<T>` | tudo opcional |
| `Required<T>` | tudo obrigatório |
| `Readonly<T>` | tudo somente leitura |
| `Pick<T, K>` | só as chaves K |
| `Omit<T, K>` | tudo menos K |
| `Record<K, V>` | dicionário |
| `Exclude<U, X>` / `Extract<U, X>` | tirar / ficar com membros da união |
| `NonNullable<T>` | sem null/undefined |
| `ReturnType<typeof f>` / `Parameters<typeof f>` | retorno / parâmetros |
| `Awaited<P>` | o valor dentro da Promise |
| `T["campo"]` | tipo de uma propriedade |

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

- [TypeScript Handbook · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Type Challenges](https://github.com/type-challenges/type-challenges): exercícios de tipos, do fácil ao absurdo

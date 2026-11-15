---
nivel: escrito
revisado:
---

# Union Types e Narrowing

> *"Torne estados impossíveis impossíveis de representar."*

> [!tip] ⚡ Em 30 segundos
> Um **union type** (`string | number`) diz que um valor pode ser **um entre vários tipos**. Pra usar, você precisa descobrir qual é: isso é **narrowing** (estreitamento). Depois de um `typeof`, `in`, `instanceof` ou checagem de uma propriedade, o TypeScript **sabe** o tipo exato dentro daquele bloco. O padrão mais poderoso é a **união discriminada**: cada variante tem um campo `tipo` diferente, e um `switch` nele cobre todos os casos com checagem de que nenhum ficou de fora.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Declarar uniões e estreitar o tipo com `typeof`, `in`, `instanceof` e igualdade
- Modelar estados com uniões discriminadas e tratar todos com `switch`
- Garantir com `never` que nenhum caso novo fique sem tratamento

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Interfaces e Type Aliases]] · [[null e undefined]] · [[Estruturas Condicionais]]
- **Depois:** [[Generics]] · [[Tratamento de Erros na API]] · [[Polimorfismo]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. União

```ts
let id: string | number;
id = 42;     // ✅
id = "a42";  // ✅
id = true;   // ❌
```

Com união, você só pode usar o que é **comum a todos**:

```ts
function mostrar(id: string | number) {
  id.toUpperCase(); // ❌ Property 'toUpperCase' does not exist on type 'number'
}
```

### 2. Narrowing com `typeof`

```ts
function mostrar(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();   // aqui id é string
  }
  return id.toFixed(0);        // aqui só sobrou number
}
```

### 3. Os outros jeitos de estreitar

```ts
// truthiness / null
function saudar(nome: string | undefined) {
  if (!nome) return "Olá!";
  return `Olá, ${nome}`;        // string
}

// in: tem a propriedade?
type Gato = { miar(): void };
type Cachorro = { latir(): void };
function falar(animal: Gato | Cachorro) {
  if ("miar" in animal) animal.miar(); else animal.latir();
}

// instanceof: é instância de uma classe?
function mensagem(erro: unknown) {
  if (erro instanceof Error) return erro.message;
  return String(erro);
}

// Array.isArray
function normalizar(x: string | string[]): string[] {
  return Array.isArray(x) ? x : [x];
}
```

### 4. União discriminada: o padrão de ouro

Cada variante tem um campo literal em comum (o **discriminante**):

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

Compare com a alternativa ruim:

```ts
// ❌ permite estados impossíveis: carregando E com erro? sucesso sem dados?
type ResultadoRuim = { carregando: boolean; dados?: string[]; erro?: string };
```

### 5. Checagem exaustiva com `never`

```ts
function render(r: Resultado): string {
  switch (r.status) {
    case "carregando": return "⏳";
    case "sucesso":    return r.dados.join(", ");
    case "erro":       return `❌ ${r.mensagem}`;
    default: {
      const impossivel: never = r; // se alguém adicionar { status: "vazio" } e esquecer de tratar, ERRO AQUI
      return impossivel;
    }
  }
}
```

Adicionou uma variante nova? O compilador lista todos os `switch` que precisam ser atualizados.

### 6. Type guard próprio

```ts
interface Tarefa { titulo: string; concluida: boolean }

function ehTarefa(x: unknown): x is Tarefa {
  return typeof x === "object" && x !== null
    && "titulo" in x && typeof x.titulo === "string"
    && "concluida" in x && typeof x.concluida === "boolean";
}

const dado: unknown = JSON.parse(texto);
if (ehTarefa(dado)) dado.titulo; // ✅ Tarefa
```

`x is Tarefa` diz ao TS: "se esta função retornar true, trate como Tarefa". É exatamente o que bibliotecas como [[Validação com Zod|Zod]] fazem por você.

---

## 🛠️ Exemplo guiado

Comandos de um CLI como união discriminada:

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

O texto bagunçado do terminal vira um tipo preciso **uma vez**; o resto do programa nunca mais lida com string solta.

---

## 🔧 Pegadinhas

- **`typeof x === "object"` deixa passar `null`.** Acrescente `x !== null`.
- **Esquecer o `default` com `never`.** Sem ele, uma variante nova passa em silêncio.
- **Discriminante que não é literal.** `status: string` não estreita nada; precisa ser `"sucesso"`, `"erro"`...
- **`as` em vez de narrowing.** `(r as { dados: string[] }).dados` compila e quebra se não for sucesso.
- **Narrowing perdido em callback.** Dentro de um `setTimeout(() => ...)` ou de uma função passada adiante, o TS pode "esquecer" o estreitamento de uma variável `let`. Copie pra uma `const` antes.

---

## 🔨 Desafio prático

**Objetivo:** modelar o estado de um download.

1. `type Download` com 4 variantes: `"pendente"`, `"baixando"` (com `progresso: number`), `"concluido"` (com `caminho: string`) e `"falhou"` (com `erro: string` e `tentativas: number`).
2. `descrever(d: Download): string` com `switch` e checagem exaustiva com `never`.
3. `avancar(d: Download): Download` simula o próximo passo (pendente → baixando 0% → ... → concluído).
4. Adicione uma variante `"cancelado"` e veja o compilador apontar onde falta tratar.

**Pronto quando:** o passo 4 dá erro de compilação no `default` e, depois de tratar, tudo passa.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Sintaxe | Estreita para |
|---|---|
| `typeof x === "string"` | primitivos |
| `x instanceof Error` | instância de classe |
| `"campo" in x` | objeto com o campo |
| `Array.isArray(x)` | array |
| `if (!x) return` | tira null/undefined/falsy |
| `switch (x.tipo)` | variante da união discriminada |
| `const n: never = x` | checagem exaustiva |
| `(x: unknown): x is T` | type guard próprio |

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

- [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Total TypeScript · Discriminated Unions](https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend)

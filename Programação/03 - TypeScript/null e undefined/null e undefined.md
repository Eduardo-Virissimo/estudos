---
nivel: escrito
revisado:
---

# null e undefined

> *"Inventei a referência nula em 1965. Foi o meu erro de um bilhão de dólares."* (Tony Hoare)

> [!tip] ⚡ Em 30 segundos
> `undefined` é "ainda não tem valor" (variável sem valor, propriedade que não existe, função sem `return`); `null` é "propositalmente vazio". O erro mais comum do JavaScript, `Cannot read properties of undefined`, vem de usar um desses como se fosse um objeto. Três ferramentas resolvem: `?.` (acessa só se existir), `??` (valor padrão) e o **`strictNullChecks`** do TypeScript, que obriga você a tratar o vazio antes de usar.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Explicar a diferença entre `null` e `undefined` e de onde cada um aparece
- Usar `?.` e `??` pra acessar dados que podem não existir
- Tratar valores possivelmente vazios do jeito que o `strictNullChecks` exige, sem abusar do `!`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Tipos Básicos do TypeScript]] · [[Objetos e Arrays no JavaScript]]
- **Depois:** [[Interfaces e Type Aliases]] · [[Union Types e Narrowing]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. De onde vem cada um

```ts
let x;                         // undefined: declarada sem valor
const obj = { a: 1 };
obj.b;                         // undefined: propriedade não existe (em JS puro)
[1, 2][5];                     // undefined: índice não existe
function f() {}  f();          // undefined: função sem return
[1, 2].find((n) => n > 9);     // undefined: não achou

const usuario = { apelido: null }; // null: alguém decidiu "vazio"
document.querySelector("#nada");   // null: APIs do navegador usam null
```

**Regra prática pro seu código:** use `undefined` pra "não informado" (campos opcionais) e `null` só quando o "vazio de propósito" importa (ex: o usuário **apagou** o apelido).

### 2. `strictNullChecks`: o TypeScript te protege

Com `strict: true` ([[Configurando um Projeto TypeScript]]), `null` e `undefined` **não cabem** em outros tipos:

```ts
let nome: string = undefined;      // ❌
let apelido: string | undefined;   // ✅ declarado como "pode faltar"

const tarefa = tarefas.find((t) => t.id === 3); // tipo: Tarefa | undefined
tarefa.titulo;                     // ❌ 'tarefa' is possibly 'undefined'
```

O TypeScript transforma o bug de execução em erro de compilação. Você **tem** que decidir o que fazer quando não existir.

### 3. Tratando: `if`, `?.` e `??`

```ts
// 1. if: quando o caminho muda
if (!tarefa) {
  console.error("Tarefa não encontrada");
  return;
}
tarefa.titulo; // ✅ aqui o TS sabe que existe

// 2. ?. (optional chaining): acessa só se existir, senão dá undefined
const cidade = usuario?.endereco?.cidade;
const primeiraTag = tarefa?.tags?.[0];
callback?.();                // chama só se a função existir

// 3. ?? (nullish coalescing): valor padrão só pra null/undefined
const titulo = tarefa?.titulo ?? "(sem título)";
const volume = config.volume ?? 50;  // mantém 0 se o usuário escolheu 0
```

### 4. Opcional em tipos

```ts
type Tarefa = {
  titulo: string;
  prazo?: string;            // pode não existir (tipo: string | undefined)
  responsavel: string | null; // sempre existe, mas pode estar vazio
};

function mostrarPrazo(t: Tarefa) {
  return t.prazo ? `até ${t.prazo}` : "sem prazo";
}
```

### 5. `??=`: preencher se estiver vazio

```ts
config.tema ??= "escuro"; // só atribui se for null/undefined
```

### 6. O `!` (non-null assertion): "confia em mim"

```ts
const el = document.querySelector("#app")!; // tira o null do tipo
```

Não confere nada em execução. Se estiver errado, explode igual. Use só quando você **garante** que existe (ex: acabou de checar com `map.has()`). Na dúvida, `if`.

### 7. Checando os dois de uma vez

```ts
if (valor == null) { }   // a ÚNICA exceção aceita ao ===: pega null e undefined
if (valor === null || valor === undefined) { } // mesma coisa, explícito
```

---

## 🛠️ Exemplo guiado

Ler a configuração de um usuário que pode estar incompleta:

```ts
type Config = {
  tema?: "claro" | "escuro";
  meta?: { minutosPorDia?: number };
  ultimoAcesso: string | null;
};

function resumo(config: Config | undefined): string {
  const tema = config?.tema ?? "escuro";
  const minutos = config?.meta?.minutosPorDia ?? 30;
  const acesso = config?.ultimoAcesso ?? "nunca";
  return `Tema ${tema}, meta de ${minutos} min/dia, último acesso: ${acesso}`;
}

resumo(undefined);                                     // tudo padrão
resumo({ ultimoAcesso: null, meta: { minutosPorDia: 0 } }); // 0 min respeitado
```

Nenhum `if`, nenhum crash, e o `0` não vira `30` (com `||` viraria).

---

## 🔧 Pegadinhas

- **`||` no lugar de `??`.** `0 || 30` é `30`, `"" || "x"` é `"x"`. Pra padrão, `??`.
- **`!` espalhado pra calar o compilador.** É o mesmo bug de antes, só que escondido. Trate de verdade.
- **`?.` em tudo.** Se um valor **deveria** existir, `?.` esconde o bug e o erro aparece longe. Use quando "não existir" é um caso válido.
- **`typeof null === "object"`.** Checar `typeof x === "object"` deixa o `null` passar. Some `&& x !== null`.
- **JSON não tem `undefined`.** `JSON.stringify({ a: undefined })` vira `{}`. Se o "vazio" precisa ser salvo, use `null`.

---

## 🔨 Desafio prático

**Objetivo:** tornar à prova de vazio.

1. Escreva `nomeDoResponsavel(projetos, idProjeto)` onde cada projeto tem `responsavel?: { nome: string; apelido?: string | null }`.
2. Retorne o apelido; se não tiver, o nome; se não houver responsável, `"ninguém"`; se o projeto não existir, `"projeto não encontrado"`.
3. Sem `!`, sem `any`, com `strict` ligado.
4. Teste os 4 casos.

**Pronto quando:** `npm run check` passa e os 4 casos dão a resposta certa.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `a?.b` | acessa se `a` existir |
| `a?.[0]` / `f?.()` | índice / chamada opcional |
| `a ?? padrao` | padrão só pra null/undefined |
| `a ??= padrao` | preenche se vazio |
| `campo?: T` | propriedade opcional |
| `T \| null` | existe, mas pode ser vazio |
| `x == null` | pega null e undefined |
| `x!` | "confia" (evite) |

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

- [javascript.info · Optional chaining](https://javascript.info/optional-chaining)
- [TypeScript Handbook · strictNullChecks](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)

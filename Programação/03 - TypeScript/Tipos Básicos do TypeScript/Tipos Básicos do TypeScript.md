---
nivel: escrito
revisado:
---

# Tipos Básicos do TypeScript

> *"`any` é o botão de desligar o TypeScript. `unknown` é o botão de 'confere antes'."*

> [!tip] ⚡ Em 30 segundos
> Os tipos básicos são os primitivos (`string`, `number`, `boolean`), **arrays** (`string[]`), **tuplas** (`[string, number]`), **tipos literais** (`"fácil" | "difícil"`) e os especiais: `any` (desliga a checagem, evite), `unknown` (aceita tudo mas obriga a conferir antes de usar), `void` (função que não retorna nada) e `never` (o que nunca acontece). Anote parâmetros e retornos; deixe a inferência cuidar do resto.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Anotar variáveis, parâmetros e retornos com tipos primitivos, arrays e tuplas
- Usar tipos literais pra restringir valores (`"todo" | "feito"`)
- Explicar por que preferir `unknown` a `any`, e quando aparecem `void` e `never`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Configurando um Projeto TypeScript]] · [[Variáveis e Tipos de Dados]]
- **Depois:** [[Objetos e Arrays no JavaScript]] · [[Interfaces e Type Aliases]] · [[Union Types e Narrowing]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Primitivos

```ts
let titulo: string = "Estudar";
let xp: number = 120;
let concluida: boolean = false;
```

Na prática, com valor inicial você **não precisa** anotar: `let xp = 120` já é `number`. Anote quando declarar sem valor (`let xp: number;`) e em parâmetros.

### 2. Arrays

```ts
const tags: string[] = ["ts", "node"];
const notas: Array<number> = [7, 8.5]; // mesma coisa, outra sintaxe
const vazio: string[] = [];             // sem anotar, [] vira never[] ou any[]
```

### 3. Tuplas: array de tamanho e tipos fixos

```ts
const coordenada: [number, number] = [10, 20];
const entrada: [string, number] = ["xp", 120];

function minMax(nums: number[]): [number, number] {
  return [Math.min(...nums), Math.max(...nums)];
}
const [menor, maior] = minMax([3, 9, 1]);
```

Útil pra retornos curtos. Com mais de 2 ou 3 itens, use um objeto com nomes.

### 4. Tipos literais: só estes valores

```ts
let dificuldade: "fácil" | "média" | "difícil";
dificuldade = "média";   // ✅
dificuldade = "extrema"; // ❌ Type '"extrema"' is not assignable...

function mover(direcao: "cima" | "baixo" | "esquerda" | "direita") { }
```

O editor sugere os valores possíveis no autocomplete. É o substituto moderno do `enum`.

### 5. `as const`: congelar como literal

```ts
const NIVEIS = ["escrito", "praticado", "projeto"] as const;
type Nivel = (typeof NIVEIS)[number]; // "escrito" | "praticado" | "projeto"
```

Uma lista só serve de fonte pra valores **e** pro tipo. Sem duplicar.

### 6. `any` × `unknown`

```ts
const a: any = JSON.parse(texto);
a.qualquerCoisa.inventada(); // compila... e quebra rodando. Checagem desligada.

const u: unknown = JSON.parse(texto);
u.nome;                      // ❌ 'u' is of type 'unknown'
if (typeof u === "object" && u !== null && "nome" in u) {
  console.log(u.nome);       // ✅ só depois de conferir
}
```

**Regra:** dado de origem desconhecida (JSON, API, `catch`) é `unknown`. `any` só como último recurso, e temporário.

### 7. `void` e `never`

```ts
function log(msg: string): void {     // não retorna nada útil
  console.log(msg);
}

function falhar(msg: string): never { // nunca retorna: sempre lança
  throw new Error(msg);
}
```

`never` também aparece quando o TypeScript prova que um caso é impossível (veja [[Union Types e Narrowing]]).

### 8. `as`: afirmar um tipo (com cuidado)

```ts
const input = document.querySelector("#nome") as HTMLInputElement;
```

`as` não converte nada: é você dizendo "confia em mim". Se estiver errado, quebra em execução. Prefira conferir com `if`.

---

## 🛠️ Exemplo guiado

Tipando o "cadastro" de uma tarefa:

```ts
const PRIORIDADES = ["baixa", "média", "alta"] as const;
type Prioridade = (typeof PRIORIDADES)[number];

function criarTarefa(titulo: string, prioridade: Prioridade = "média", tags: string[] = []) {
  return { titulo, prioridade, tags, criadaEm: Date.now() };
}

function ehPrioridade(valor: string): valor is Prioridade {
  return (PRIORIDADES as readonly string[]).includes(valor);
}

const entrada = process.argv[2] ?? "média";
if (!ehPrioridade(entrada)) {
  console.error(`Prioridade inválida. Use: ${PRIORIDADES.join(", ")}`);
  process.exit(1);
}
console.log(criarTarefa("Estudar TS", entrada)); // entrada agora é Prioridade
```

Texto do terminal (`string`) foi conferido em execução e virou um tipo seguro.

---

## 🔧 Pegadinhas

- **`any` se espalha.** Uma variável `any` contamina tudo que deriva dela. Ligue a regra `no-explicit-any` no [[Linter]].
- **`[]` sem anotação.** `const lista = []` pode virar `any[]`. Anote: `const lista: string[] = []`.
- **`as` pra calar erro.** `x as Tarefa` em dado não validado é mentir pro compilador.
- **Tipos com maiúscula.** `String`, `Number`, `Boolean` (maiúsculos) são os objetos wrapper. Use sempre minúsculo.
- **`enum`.** Funciona, mas gera código extra e não roda no modo "só apagar tipos" do Node. Prefira união de literais com `as const`.

---

## 🔨 Desafio prático

**Objetivo:** tipar sem `any`.

1. Crie `type Status = "a fazer" | "fazendo" | "feito"`.
2. Escreva `avancar(status: Status): Status` (a fazer → fazendo → feito → feito).
3. Escreva `lerNumeros(texto: string): number[]` que recebe `"3,7,x,10"` e devolve só os números válidos.
4. Escreva `estatisticas(nums: number[]): [number, number, number]` (mínimo, máximo, média).
5. Rode `npm run check` sem nenhum `any` e sem `as`.

**Pronto quando:** `avancar("feito")` dá `"feito"`, `lerNumeros("3,7,x,10")` dá `[3, 7, 10]` e o `tsc` não reclama de nada.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `any` e `unknown`?
> `any` desliga a checagem (dá pra fazer qualquer coisa); `unknown` aceita qualquer valor, mas obriga a conferir o tipo antes de usar.

> [!question]- O que é um tipo literal?
> Um tipo que aceita só valores específicos, como `"fácil" | "difícil"`. Restringe o que pode ser atribuído.

> [!question]- O que é uma tupla?
> Um array com quantidade e tipo de cada posição fixos, como `[string, number]`.

> [!question]- Quando uma função tem retorno `void` e quando `never`?
> `void` quando não retorna nada útil; `never` quando nunca termina normalmente (sempre lança erro ou entra em laço infinito).

> [!question]- O que `as` faz?
> Afirma um tipo pro compilador sem converter nem checar nada em execução. Se a afirmação estiver errada, o erro aparece rodando.

> [!question]- Pra que serve `as const` numa lista?
> Mantém os valores como literais e somente leitura, permitindo derivar um tipo união a partir da lista.

---

## 📋 Cola rápida

| Tipo | Exemplo |
|---|---|
| primitivos | `string`, `number`, `boolean` |
| array | `string[]` ou `Array<string>` |
| tupla | `[string, number]` |
| literal | `"a" \| "b"` |
| desconhecido | `unknown` (confira antes) |
| sem retorno | `void` |
| impossível | `never` |
| derivar da lista | `(typeof LISTA)[number]` com `as const` |

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

- [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Total TypeScript · Beginner's tutorial (gratuito, interativo)](https://www.totaltypescript.com/tutorials/beginners-typescript)

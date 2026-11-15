---
nivel: escrito
revisado:
---

# Módulos ES (import e export)

> *"Cada arquivo é uma caixa fechada. `export` é a porta."*

> [!tip] ⚡ Em 30 segundos
> Em JavaScript moderno, **cada arquivo é um módulo**: o que você cria nele é privado, a não ser que você **exporte** (`export`). Outro arquivo usa com `import`. Prefira **exports nomeados** (`export function salvar`), que o editor encontra e renomeia sem erro. No Node com TypeScript (`module: NodeNext` + `"type": "module"`), o caminho do import **precisa da extensão `.js`**, mesmo o arquivo sendo `.ts`.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Exportar e importar funções, constantes e tipos entre arquivos
- Escolher entre export nomeado e `export default`
- Resolver os erros de import mais comuns no Node (extensão, `type: module`, CommonJS)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Modularização]] · [[Configurando um Projeto TypeScript]]
- **Depois:** [[Classes no TypeScript]] · [[Gerenciador de Pacotes]] · [[Organização de Pastas de um Projeto]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Export nomeado (o padrão)

```ts
// src/tarefas.ts
export interface Tarefa { id: number; titulo: string; concluida: boolean }

export function criar(id: number, titulo: string): Tarefa {
  return { id, titulo, concluida: false };
}

export const LIMITE = 100;

function segredo() {}   // sem export: privado deste arquivo
```

```ts
// src/main.ts
import { criar, LIMITE, type Tarefa } from "./tarefas.js";

const t: Tarefa = criar(1, "Estudar");
```

### 2. Renomear e importar tudo

```ts
import { criar as criarTarefa } from "./tarefas.js";
import * as tarefas from "./tarefas.js";   // tarefas.criar(...), tarefas.LIMITE
```

### 3. `export default`

```ts
// src/config.ts
export default { tema: "escuro", meta: 30 };

// src/main.ts
import config from "./config.js";   // o nome é você quem escolhe
```

> Prefira nomeados: com `default`, cada arquivo pode importar com um nome diferente, o editor não acha todos os usos e renomear vira caça ao tesouro. `default` ainda aparece em React e em algumas bibliotecas.

### 4. `import type`: só tipos

```ts
import type { Tarefa } from "./tarefas.js";
import { criar, type Tarefa as T } from "./tarefas.js"; // misturado
```

Deixa claro que é só tipo (some na compilação) e é exigido quando o projeto usa `verbatimModuleSyntax`.

### 5. A extensão `.js` (a pegadinha nº 1)

```ts
import { criar } from "./tarefas";      // ❌ no Node com NodeNext: precisa da extensão
import { criar } from "./tarefas.js";   // ✅ (aponta pro .js que vai existir depois do tsc)
```

O TypeScript entende que `./tarefas.js` se refere ao `./tarefas.ts`. Parece estranho, mas é o nome do arquivo que o Node vai carregar depois de compilar.

> Em projetos com bundler (Vite, Next.js), o import sem extensão funciona, porque a ferramenta resolve sozinha.

### 6. Pacotes e módulos nativos

```ts
import { readFile } from "node:fs/promises";  // nativo do Node
import { z } from "zod";                        // pacote do npm (node_modules)
import { criar } from "./tarefas.js";          // arquivo seu (começa com ./ ou ../)
```

Sem `./`, o Node procura um pacote. Com `./`, um arquivo relativo **ao arquivo atual**.

### 7. ESM × CommonJS

Você ainda vai ver o formato antigo do Node (**CommonJS**):

```js
const fs = require("fs");      // import antigo
module.exports = { criar };    // export antigo
```

| | ES Modules (use) | CommonJS (legado) |
|---|---|---|
| Sintaxe | `import` / `export` | `require` / `module.exports` |
| Ativa com | `"type": "module"` ou `.mjs` | padrão antigo ou `.cjs` |
| Navegador | ✅ | ❌ |

Tutoriais antigos usam `require`. Em projeto novo, ESM.

### 8. Reexportar (arquivo "índice")

```ts
// src/dominio/index.ts
export * from "./tarefa.js";
export { calcularXp } from "./xp.js";

// em outro lugar
import { criar, calcularXp } from "./dominio/index.js";
```

Útil pra expor a "porta da frente" de uma pasta. Não exagere: índices demais criam ciclos de import.

---

## 🛠️ Exemplo guiado

Dividindo um script em 3 módulos:

```text
src/
  tarefas.ts     ← tipo + regras (puro)
  formatar.ts    ← como mostrar
  main.ts        ← junta
```

```ts
// src/formatar.ts
import type { Tarefa } from "./tarefas.js";

export function linha(t: Tarefa): string {
  return `${t.concluida ? "[x]" : "[ ]"} ${t.id}. ${t.titulo}`;
}

// src/main.ts
import { criar } from "./tarefas.js";
import { linha } from "./formatar.js";

const lista = [criar(1, "Estudar"), criar(2, "Treinar")];
lista.forEach((t) => console.log(linha(t)));
```

```bash
npx tsx src/main.ts
```

---

## 🔧 Pegadinhas

- **`ERR_MODULE_NOT_FOUND` / `Cannot find module './tarefas'`.** Faltou o `.js` no caminho (ou o caminho relativo está errado).
- **`Cannot use import statement outside a module`.** Falta `"type": "module"` no `package.json`.
- **`require is not defined in ES module scope`.** Código CommonJS num projeto ESM. Troque `require` por `import`.
- **`X is not exported`.** Esqueceu o `export` ou é `default` e você importou com chaves (ou o contrário).
- **Ciclo de import.** A importa B, B importa A: algo chega `undefined`. Mova o que é compartilhado pra um terceiro arquivo.
- **`__dirname is not defined`.** Não existe em ESM. Use `import.meta.dirname` (Node 20.11+).

---

## 🔨 Desafio prático

**Objetivo:** modularizar de verdade.

1. Pegue o código do [[Funções#🚀 Projeto|núcleo do gerenciador de tarefas]] (ou qualquer script seu com 3+ funções).
2. Separe em `tipos.ts`, `regras.ts`, `formatar.ts` e `main.ts`, com exports nomeados e `import type` pros tipos.
3. Provoque e anote 3 erros: tirar o `.js`, tirar um `export`, tirar o `"type": "module"`.
4. Rode `npm run check` e `npx tsx src/main.ts`.

**Pronto quando:** tudo roda, nenhum arquivo tem mais de uma responsabilidade e você sabe o que cada um dos 3 erros significa.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que acontece com uma função que não tem `export`?
> Fica privada do arquivo (módulo): outros arquivos não conseguem importá-la.

> [!question]- Por que preferir export nomeado a `export default`?
> Porque o nome é o mesmo em todo lugar: o editor encontra os usos, autocompleta e renomeia com segurança.

> [!question]- Por que o import no Node com TypeScript usa `./arquivo.js` se o arquivo é `.ts`?
> Porque o Node exige a extensão e vai carregar o `.js` gerado pelo compilador; o TypeScript entende que se refere ao `.ts`.

> [!question]- Qual a diferença entre `import x from "zod"` e `import x from "./zod.js"`?
> Sem `./` o Node procura um pacote instalado (node_modules); com `./` procura um arquivo relativo ao atual.

> [!question]- O que `"type": "module"` no package.json faz?
> Faz os arquivos `.js` do projeto serem tratados como ES Modules (`import`/`export`) em vez de CommonJS.

> [!question]- Pra que serve `import type`?
> Pra importar só tipos, que somem na compilação; deixa a intenção clara e evita imports desnecessários em execução.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `export function f()` | exporta nomeado |
| `import { f } from "./a.js"` | importa nomeado |
| `import { f as g }` | renomeia |
| `import * as a from "./a.js"` | tudo num objeto |
| `export default x` / `import x from` | export padrão |
| `import type { T }` | só tipo |
| `export * from "./a.js"` | reexporta |
| `import.meta.dirname` | pasta do arquivo atual |

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

- [javascript.info · Modules, introduction](https://javascript.info/modules-intro) e [Export and Import](https://javascript.info/import-export)
- [TypeScript · Modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [Node.js · ECMAScript modules](https://nodejs.org/api/esm.html)

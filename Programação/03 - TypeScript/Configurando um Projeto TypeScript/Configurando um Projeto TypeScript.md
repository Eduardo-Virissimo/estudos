---
nivel: escrito
revisado:
---

# Configurando um Projeto TypeScript

> *"Configure uma vez, direito, e esqueça."*

> [!tip] ⚡ Em 30 segundos
> Um projeto TypeScript é uma pasta com: `package.json` (nome, scripts e dependências), `tsconfig.json` (as regras do compilador), a pasta `src/` com o código e o `.gitignore`. Pra **desenvolver**, rode direto com `tsx`; pra **checar tipos**, `tsc --noEmit`; pra **gerar JavaScript**, `tsc`. Ligue o `strict: true` desde o primeiro dia.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Criar um projeto TypeScript do zero, com `package.json`, `tsconfig.json` e `src/`
- Explicar a diferença entre rodar com `tsx`, checar com `tsc --noEmit` e compilar com `tsc`
- Criar scripts no `package.json` (`dev`, `check`, `build`, `start`)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Node.js]] · [[Gerenciador de Pacotes]] · [[Terminal]]
- **Depois:** [[Tipos Básicos do TypeScript]] · [[Módulos ES (import e export)]] · [[Linter]] · [[Formatter]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Passo a passo

```bash
mkdir tarefas && cd tarefas
npm init -y                                   # cria o package.json
npm install -D typescript tsx @types/node     # -D = só pra desenvolvimento
npx tsc --init                                # cria o tsconfig.json
mkdir src
git init                                      # versionar desde o começo
```

| Pacote | Pra quê |
|---|---|
| `typescript` | o compilador `tsc` |
| `tsx` | roda `.ts` direto, rápido, sem gerar arquivos |
| `@types/node` | os tipos do Node (`process`, `fs`...) pro editor entender |

### 2. `package.json`

```json
{
  "name": "tarefas",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "check": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/main.js"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

- `"type": "module"` → usa `import`/`export` moderno ([[Módulos ES (import e export)]]).
- Rode os scripts com `npm run dev`, `npm run check`... (`start` e `test` dispensam o `run`).

### 3. `tsconfig.json` enxuto e moderno

O `tsc --init` gera um arquivo gigante comentado. Esta é uma base boa pra projetos Node:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

| Opção | O que faz |
|---|---|
| `strict: true` | liga todas as checagens importantes (inclusive [[null e undefined\|strictNullChecks]]). **Nunca desligue.** |
| `noUncheckedIndexedAccess` | `lista[0]` passa a ser `T \| undefined`: obriga a tratar índice que não existe |
| `rootDir` / `outDir` | código em `src/`, JavaScript gerado em `dist/` |
| `module: NodeNext` | segue as regras de módulos do Node |
| `sourceMap` | erros apontam pra linha do `.ts`, não do `.js` |

### 4. Os três jeitos de "rodar"

| Comando | Checa tipos? | Gera `.js`? | Quando |
|---|---|---|---|
| `npx tsx src/main.ts` | ❌ | ❌ | desenvolvendo, rapidez |
| `npx tsc --noEmit` | ✅ | ❌ | antes do commit, no CI |
| `npx tsc` | ✅ | ✅ (em `dist/`) | build pra produção |

> ⚠️ O `tsx` **não** confere tipos: ele só apaga e executa. Um erro de tipo roda "normal". Por isso o script `check` existe: rode sempre antes de commitar.

### 5. `.gitignore`

```gitignore
node_modules/
dist/
.env
```

`node_modules` se recria com `npm install`; `dist` com `npm run build`. Nenhum dos dois vai pro Git.

### 6. Estrutura final

```text
tarefas/
├── src/
│   └── main.ts
├── dist/            ← gerado, fora do Git
├── node_modules/    ← gerado, fora do Git
├── .gitignore
├── package.json
├── package-lock.json  ← vai pro Git (trava as versões)
└── tsconfig.json
```

---

## 🛠️ Exemplo guiado

Ver o `check` salvando você:

```ts
// src/main.ts
const tarefas = ["Estudar", "Treinar"];
const primeira = tarefas[5];
console.log(primeira.toUpperCase());
```

```bash
npm run dev     # roda e explode: Cannot read properties of undefined
npm run check   # error TS18048: 'primeira' is possibly 'undefined'.
```

Com `noUncheckedIndexedAccess`, o TypeScript avisou antes de rodar. Correção:

```ts
console.log(primeira?.toUpperCase() ?? "Não existe tarefa 6");
```

---

## 🔧 Pegadinhas

- **`tsx` rodando código com erro de tipo.** Ele não checa. Rode `npm run check` (e ligue o TypeScript no editor).
- **`Cannot find name 'process'`.** Falta o `@types/node`.
- **Import sem extensão com `NodeNext`.** O Node exige a extensão: `import { x } from "./tarefas.js"` (sim, `.js`, mesmo o arquivo sendo `.ts`, porque é o nome que vai existir depois de compilar). Detalhes em [[Módulos ES (import e export)]].
- **`strict: false` pra "parar de dar erro".** Os erros continuam existindo; você só para de ver.
- **Commitar `node_modules`.** Centenas de MB no repositório. Confira o `.gitignore` antes do primeiro commit.

---

## 🔨 Desafio prático

**Objetivo:** um projeto modelo que você vai copiar pros próximos.

1. Siga o passo a passo e crie o projeto `modelo-ts`.
2. Configure o `tsconfig.json` acima e os 4 scripts.
3. Escreva um `src/main.ts` com um erro de tipo proposital e confirme: `dev` roda, `check` acusa.
4. Corrija, rode `build` e depois `start`. Confira o `dist/main.js` gerado.
5. Primeiro commit com o `.gitignore` certo (`git status` não pode mostrar `node_modules`).

**Pronto quando:** `npm run check` passa sem erros, `npm start` roda o JS compilado e o repositório não tem `node_modules` nem `dist`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `tsx`, `tsc --noEmit` e `tsc`?
> `tsx` executa o TS direto sem checar tipos; `tsc --noEmit` só checa tipos; `tsc` checa e gera os `.js` na pasta de saída.

> [!question]- O que faz `strict: true` no tsconfig?
> Liga o conjunto de checagens rigorosas do TypeScript, incluindo tratar `null`/`undefined` (strictNullChecks). Deve ficar sempre ligado.

> [!question]- Pra que serve o `-D` no `npm install -D typescript`?
> Instala como dependência de desenvolvimento (`devDependencies`): usada pra construir, não pra rodar em produção.

> [!question]- O que vai e o que não vai pro Git num projeto TS?
> Vai: `src/`, `package.json`, `package-lock.json`, `tsconfig.json`. Não vai: `node_modules/`, `dist/`, `.env`.

> [!question]- O que faz `noUncheckedIndexedAccess`?
> Faz `lista[i]` ter tipo `T | undefined`, obrigando a tratar o caso de o índice não existir.

> [!question]- Pra que servem `rootDir` e `outDir`?
> Dizer onde está o código-fonte (`src`) e onde o `tsc` deve colocar o JavaScript gerado (`dist`).

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `npm init -y` | cria o `package.json` |
| `npm i -D typescript tsx @types/node` | instala as ferramentas |
| `npx tsc --init` | cria o `tsconfig.json` |
| `npm run dev` | roda com recarga (`tsx watch`) |
| `npm run check` | confere os tipos |
| `npm run build` | gera `dist/` |
| `npm start` | roda o JS gerado |

---

## 🛠️ Exemplo meu

```json

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

- [TypeScript · tsconfig reference](https://www.typescriptlang.org/tsconfig): cada opção explicada
- [tsx](https://tsx.is/): documentação do executor
- [Total TypeScript · TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet): qual config usar pra cada tipo de projeto

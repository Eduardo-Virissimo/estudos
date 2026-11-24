---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Configurando um Projeto TypeScript

**Quanto focar: 🔥 essencial.** Você vai criar projeto do zero várias vezes. Pratique até montar um sem tutorial aberto.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Até aqui, você criava um `teste.ts` em qualquer pasta e rodava com `npx tsx teste.ts`. Funciona pra experimentar. Mas quando o programa cresce pra vários arquivos, ganha dependências, precisa ir pro Git e rodar em outro computador, o arquivo solto não basta mais. Você precisa de um **projeto**.

Um projeto TypeScript de verdade é uma pasta organizada com quatro coisas: o `package.json` (o nome, os comandos e as dependências), o `tsconfig.json` (as regras do compilador), a pasta `src/` com o código, e o `.gitignore`. Montar isso parece burocracia na primeira vez. Mas você faz uma vez, guarda como modelo, e reusa pra sempre.

E tem duas ideias nesta nota que valem mais que todo o resto. A primeira: existem **três jeitos de rodar** um projeto TypeScript, e **só dois deles conferem os tipos**. Confundir isso é como achar que o código está certo só porque rodou. A segunda: ligue o **`strict: true`** desde o primeiro dia. Ajuda já conhecer o [[Node.js]], o [[Gerenciador de Pacotes]] e o [[Terminal]].

## Montando o projeto

A sequência inteira, do zero:

```bash
mkdir tarefas && cd tarefas
npm init -y                                   # cria o package.json
npm install -D typescript tsx @types/node     # -D = só pra desenvolvimento
npx tsc --init                                # cria o tsconfig.json
mkdir src
git init                                      # versionar desde o começo
```

Três pacotes foram instalados, e cada um tem um papel. O **`typescript`** traz o compilador, o `tsc`, que confere os tipos e gera JavaScript. O **`tsx`** roda arquivos `.ts` direto, rápido, sem gerar nada. E o **`@types/node`** traz os tipos do próprio Node (`process`, `fs` e companhia), pra o editor e o compilador saberem que essas coisas existem.

Esse último merece uma nota: se um dia aparecer `Cannot find name 'process'`, é porque faltou o `@types/node`. Sem ele, o TypeScript simplesmente não sabe que o `process` existe.

O `-D` instala tudo como **dependência de desenvolvimento**: coisas que você usa pra programar, mas que o programa não precisa pra rodar (o [[Gerenciador de Pacotes]] explica a diferença). O `package.json` fica assim:

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

O `"type": "module"` liga o `import` e `export` modernos ([[Módulos ES (import e export)]]). E os `scripts` são atalhos que você roda com `npm run dev`, `npm run check` e `npm run build` (o `start` dispensa o `run`). A estrutura final fica assim:

```text
tarefas/
├── src/
│   └── main.ts
├── dist/              ← gerado, fora do Git
├── node_modules/      ← gerado, fora do Git
├── .gitignore
├── package.json
├── package-lock.json  ← vai pro Git (trava as versões)
└── tsconfig.json
```

## Rodou não quer dizer que está certo

Esta é a parte que mais confunde, e a mais importante da nota. Existem três comandos, e eles fazem coisas bem diferentes:

| Comando | Confere tipos? | Gera `.js`? | Quando usar |
|---|---|---|---|
| `npx tsx src/main.ts` | ❌ | ❌ | desenvolvendo, pela rapidez |
| `npx tsc --noEmit` | ✅ | ❌ | antes do commit e na CI |
| `npx tsc` | ✅ | ✅ (em `dist/`) | build pra produção |

O `tsx` é rápido justamente porque **não confere nada**. Ele só apaga os tipos do código e executa o que sobra. Ou seja: um erro de tipo roda "normalmente", e só quebra quando aquela linha específica é executada. Olhe:

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

O `check` avisou **antes** de rodar, apontando a linha e o motivo: a posição 5 pode não existir. A correção seria algo como `primeira?.toUpperCase() ?? "Não existe tarefa 6"`.

Então o fluxo do dia a dia fica assim: `npm run dev` enquanto você programa (e o editor vai mostrando os erros em vermelho), e `npm run check` antes de cada commit. Nunca confie no `tsx` pra dizer que os tipos estão certos. Ele não foi feito pra isso.

## O tsconfig e a opção que importa

O `tsc --init` gera um `tsconfig.json` gigante, com dezenas de opções comentadas. Você pode apagar quase tudo. Esta é uma base enxuta e moderna pra projetos Node:

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

Duas opções aí fazem toda a diferença. O **`strict: true`** liga todas as checagens importantes de uma vez, inclusive a que obriga você a tratar [[null e undefined|null e undefined]]. Sem ela, o TypeScript deixa passar boa parte dos bugs que ele existe justamente pra pegar. E o **`noUncheckedIndexedAccess`** faz `lista[0]` ter o tipo `T | undefined`, porque o índice pode não existir. Foi ela que pegou o erro do exemplo anterior.

As outras são mais de encanamento. O `rootDir` e o `outDir` dizem que o código fica em `src/` e o JavaScript gerado vai pra `dist/`. O `module: NodeNext` segue as regras de módulos do Node. E o `sourceMap` faz os erros apontarem pra linha do seu `.ts`, e não do `.js` gerado.

Vai chegar um dia em que o `strict` vai te irritar, apontando erro atrás de erro, e dá vontade de desligar "pra parar de reclamar". Não faça isso. Os erros continuam existindo; você só para de vê-los. E eles voltam, rodando, na pior hora.

Um detalhe que estranha no começo: com `module: NodeNext`, os imports entre seus arquivos precisam da extensão **`.js`**, mesmo o arquivo sendo `.ts`. Fica `import { x } from "./tarefas.js"`. Parece errado, mas é assim mesmo, e o porquê está em [[Módulos ES (import e export)]].

## O que vai pro Git

Antes do primeiro commit, crie o `.gitignore`:

```gitignore
node_modules/
dist/
.env
```

O `node_modules/` tem centenas de megabytes e se recria inteiro com `npm install`. O `dist/` se recria com `npm run build`. E o `.env`, que guarda senhas e chaves, **nunca** vai pro Git.

Já o `package-lock.json` **vai**: ele trava as versões exatas de cada pacote, pra que você, um colega e a CI instalem exatamente a mesma coisa.

Faça isso **antes** do primeiro commit. Commitar o `node_modules` sem querer coloca centenas de megabytes no histórico do repositório, e tirar de lá depois é bem mais difícil do que parece. Um `git status` que não mostra o `node_modules` é o sinal de que está tudo certo.

## O essencial

1. Um projeto tem `package.json`, `tsconfig.json`, `src/` e `.gitignore`.
2. `tsx` roda sem conferir tipos; `tsc --noEmit` só confere; `tsc` confere e gera o `dist/`.
3. `npm run dev` enquanto programa, `npm run check` antes de cada commit.
4. `strict: true` sempre ligado, e `noUncheckedIndexedAccess` também.
5. `node_modules`, `dist` e `.env` ficam fora do Git; o `package-lock.json` vai.

## Agora é com você

Crie um **projeto modelo**, o `modelo-ts`, que você vai copiar pra começar todos os próximos. Siga o passo a passo, configure o `tsconfig.json` acima e os quatro scripts. Escreva um `src/main.ts` com um erro de tipo de propósito e confirme a diferença: o `dev` roda, o `check` acusa. Depois corrija, rode o `build`, rode o `start`, e abra o `dist/main.js` gerado pra ver no que o seu TypeScript se transformou. Por fim, faça o primeiro commit com o `.gitignore` certo. Você terminou quando o `npm run check` passar sem erros, o `npm start` rodar o JavaScript compilado, e o repositório não tiver `node_modules` nem `dist`.

Daqui, siga pros [[Tipos Básicos do TypeScript]] e pros [[Módulos ES (import e export)]], e depois volte ao modelo pra adicionar o [[Linter]] e o [[Formatter]].

---

## 🧠 Me teste

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

> [!question]- Apareceu `Cannot find name 'process'`. O que falta?
> O pacote `@types/node`, com os tipos do Node.

> [!question]+ Qual comando **só checa os tipos**, sem gerar nenhum arquivo?
> - a) `tsx main.ts`
> - b) `tsc`
> - c) `tsc --noEmit`
> - d) `node main.ts`
>
> > [!check]- Resposta
> > **c)** `tsx` roda sem checar tipos. `tsc` checa e gera `.js` no `outDir`. `tsc --noEmit` só checa: ideal pra CI e pra antes de commitar.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `npm init -y` | Cria o `package.json` |
| `npm i -D typescript tsx @types/node` | Instala as ferramentas |
| `npx tsc --init` | Cria o `tsconfig.json` |
| `npm run dev` | Roda com recarga (`tsx watch`) |
| `npm run check` | Confere os tipos |
| `npm run build` | Gera o `dist/` |
| `npm start` | Roda o JavaScript gerado |

**Pra ler:** o [TSConfig Cheat Sheet do Total TypeScript](https://www.totaltypescript.com/tsconfig-cheat-sheet) diz, em uma página, qual configuração usar pra cada tipo de projeto, e explica o porquê de cada opção. A [referência oficial do tsconfig](https://www.typescriptlang.org/tsconfig) tem cada opção explicada com exemplo. E a [documentação do tsx](https://tsx.is/) é curta e direta.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

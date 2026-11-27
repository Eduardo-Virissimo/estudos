---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Módulos ES (import e export)

**Quanto focar: 🔥 essencial.** Todo arquivo de um projeto usa. Domine o básico e entenda os erros de import, que são frequentes.

**⏱️ Quanto tempo: cerca de 1h.** Uns 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3 · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Na nota de [[Modularização]], você decidiu dividir o gerenciador de tarefas em vários arquivos: as regras num, o terminal noutro, o armazenamento num terceiro. Ótimo. Mas aí vem a pergunta prática: como o `main.ts` usa uma função que está no `regras.ts`? Os arquivos estão separados, e cada um não sabe nada do outro.

A resposta é o sistema de **módulos**. Em JavaScript moderno, **cada arquivo é um módulo**, e tudo o que você cria nele é privado, a não ser que você **exporte** com `export`. Outro arquivo usa o que foi exportado com `import`. A [[Modularização]] ensina **como** decidir onde cortar; esta nota é a sintaxe que faz os pedaços se encontrarem.

Duas coisas pra levar desde já. Prefira **exports nomeados** (`export function salvar`), e não o `export default`. E a pegadinha número um, que vai te pegar com certeza: no Node com TypeScript, **o caminho do import precisa da extensão `.js`**, mesmo o arquivo sendo `.ts`. Parece errado, e tem uma explicação. Ajuda ter passado pelo [[Configurando um Projeto TypeScript]].

## Portas fechadas, portas abertas

Pense em cada arquivo como uma casa com todas as portas fechadas. O que está lá dentro só sai se você abrir uma porta, e o `export` é essa porta.

```ts
// src/tarefas.ts
export interface Tarefa { id: number; titulo: string; concluida: boolean }

export function criar(id: number, titulo: string): Tarefa {
  return { id, titulo, concluida: false };
}

export const LIMITE = 100;

function segredo() {}   // sem export: só existe dentro deste arquivo
```

```ts
// src/main.ts
import { criar, LIMITE, type Tarefa } from "./tarefas.js";

const t: Tarefa = criar(1, "Estudar");
```

Por que tudo começa privado? Porque assim cada arquivo decide o que os outros podem usar. A função `segredo` pode mudar à vontade, ser renomeada, até apagada, sem quebrar nada, já que ninguém de fora sabe que ela existe. É a ideia de "mostre pouco, esconda o resto" da [[Modularização]], agora com sintaxe.

Na hora de importar, existem algumas variações úteis:

```ts
import { criar as criarTarefa } from "./tarefas.js"; // renomeia na chegada
import * as tarefas from "./tarefas.js";             // tudo: tarefas.criar(...), tarefas.LIMITE
```

E pra tipos, use `import type`. Ele deixa claro que você está trazendo só um tipo (que some na compilação), e é obrigatório em projetos com a opção `verbatimModuleSyntax`:

```ts
import type { Tarefa } from "./tarefas.js";
import { criar, type Tarefa as T } from "./tarefas.js"; // misturado
```

Existe também o **`export default`**, um export "principal" do arquivo, sem nome fixo:

```ts
// src/config.ts
export default { tema: "escuro", meta: 30 };

// src/main.ts
import config from "./config.js"; // quem importa escolhe o nome
```

Parece prático, e esse é justamente o problema. Com `default`, cada arquivo pode importar a mesma coisa com um nome diferente: um chama de `config`, outro de `cfg`, outro de `opcoes`. O editor não consegue mais achar todos os usos, e renomear vira caça ao tesouro. **Prefira os exports nomeados**, que têm o mesmo nome em todo lugar. (O `default` ainda aparece no React e em algumas bibliotecas, então você vai precisar reconhecer.)

Quando aparecer o erro "X is not exported", é uma de duas coisas: você esqueceu o `export` no arquivo de origem, ou misturou os dois tipos, importando com chaves algo que é `default` (ou o contrário).

## O .js que confunde todo mundo

Agora a pegadinha. Num projeto Node com TypeScript configurado do jeito moderno (`module: NodeNext` e `"type": "module"`), olhe isto:

```ts
import { criar } from "./tarefas";      // ❌ falta a extensão
import { criar } from "./tarefas.js";   // ✅
```

Mas o arquivo se chama `tarefas.ts`! Por que importar como `.js`?

Por causa de um detalhe de como o TypeScript trabalha: ele **não reescreve** os seus imports quando compila. O `main.ts` vira `main.js`, o `tarefas.ts` vira `tarefas.js`, e a linha do import continua **exatamente** como você escreveu. Quem roda o código no final é o Node, e o Node exige a extensão do arquivo **que vai existir** depois da compilação, o `.js`. O TypeScript, por sua vez, é esperto o bastante pra entender que `./tarefas.js` se refere ao `./tarefas.ts` enquanto você está programando.

Parece estranho. Todo mundo estranha. Mas é assim, e depois de uma semana você nem pensa mais nisso.

O erro que aparece quando você esquece é o `ERR_MODULE_NOT_FOUND`, ou `Cannot find module './tarefas'`. Quase sempre é a extensão que faltou (ou um caminho relativo errado). Uma ressalva: em projetos com *bundler*, como o Vite ou o Next.js, o import sem extensão funciona, porque a própria ferramenta resolve.

## De onde vem cada import

O que vem depois do `from` diz ao Node **onde procurar**:

```ts
import { readFile } from "node:fs/promises";  // módulo nativo do Node
import { z } from "zod";                        // pacote do npm (pasta node_modules)
import { criar } from "./tarefas.js";          // arquivo seu
```

A regra é simples. **Com `./` ou `../`** no começo, é um arquivo seu, procurado a partir do arquivo **atual**. **Sem** isso, o Node procura um pacote instalado na pasta `node_modules`, ou um módulo nativo, que começa com `node:`.

## O formato antigo

Você ainda vai encontrar, em tutoriais e projetos mais velhos, o formato antigo de módulos do Node, o **CommonJS**:

```js
const fs = require("fs");      // import antigo
module.exports = { criar };    // export antigo
```

| | ES Modules (use) | CommonJS (legado) |
|---|---|---|
| Sintaxe | `import` / `export` | `require` / `module.exports` |
| Ativa com | `"type": "module"` no package.json, ou `.mjs` | padrão antigo, ou `.cjs` |
| Funciona no navegador | ✅ | ❌ |

Em projeto novo, sempre ES Modules. Mas os dois formatos geram erros característicos quando se misturam, e vale reconhecer cada um. `Cannot use import statement outside a module` quer dizer que falta o `"type": "module"` no `package.json`. `require is not defined in ES module scope` é código antigo num projeto novo: troque o `require` por `import`. E `__dirname is not defined` aparece porque essa variável não existe em ES Modules; o equivalente moderno é o `import.meta.dirname` (Node 20.11 ou mais novo).

## Dois cuidados

O primeiro é o **import em círculo**. Se o arquivo A importa o B, e o B importa o A, algum dos dois recebe `undefined` no lugar do que esperava, e o erro aparece num lugar que não faz sentido nenhum. Quando isso acontecer, a solução é mover o que os dois compartilham pra um terceiro arquivo, que os dois importam.

O segundo é sobre os **arquivos índice**. Um arquivo pode reexportar o que outros exportam, servindo de "porta da frente" de uma pasta:

```ts
// src/dominio/index.ts
export * from "./tarefa.js";
export { calcularXp } from "./xp.js";

// em outro lugar
import { criar, calcularXp } from "./dominio/index.js";
```

É útil, mas não exagere: índices demais são a forma mais comum de criar, sem perceber, aqueles imports em círculo.

## O essencial

1. Cada arquivo é um módulo, e tudo nele é privado até você exportar.
2. Prefira exports nomeados; `default` deixa cada um importar com um nome diferente.
3. No Node com TypeScript, o import leva `.js`, porque aponta pro arquivo que vai existir depois de compilar.
4. Com `./`, é arquivo seu; sem, é pacote do `node_modules` ou nativo (`node:`).
5. `import type` pra tipos. E import em círculo se resolve com um terceiro arquivo.

## Agora é com você

Modularize de verdade. Pegue o código do [[Funções#Agora é com você|núcleo do gerenciador de tarefas]] (ou qualquer script seu com três ou mais funções) e separe em `tipos.ts`, `regras.ts`, `formatar.ts` e `main.ts`, com exports nomeados e `import type` pros tipos. Depois, quebre de propósito e anote o que acontece em três casos: tirar o `.js` de um import, tirar um `export`, e tirar o `"type": "module"` do `package.json`. Rode `npm run check` e `npx tsx src/main.ts`. Você terminou quando tudo rodar, nenhum arquivo tiver mais de uma responsabilidade, e você souber explicar o que cada um dos três erros quis dizer.

Daqui, siga pras [[Classes no TypeScript]], pro [[Gerenciador de Pacotes]] e pra [[Organização de Pastas de um Projeto]].

---

## 🧠 Me teste

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

> [!question]+ Em `import { soma } from "./util.js"`, o arquivo de verdade é `util.ts`. Por que `.js`?
> - a) É um erro: devia ser `.ts`
> - b) O import aponta pro arquivo que vai **existir depois de compilar**
> - c) O Node ignora a extensão
> - d) `.js` é obrigatório só no Windows
>
> > [!check]- Resposta
> > **b)** O TypeScript não reescreve os imports: eles saem como estão no `.js` compilado, e o Node exige a extensão em ES Modules.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `export function f()` | Export nomeado |
| `import { f } from "./a.js"` | Import nomeado |
| `import { f as g }` | Renomeia na chegada |
| `import * as a from "./a.js"` | Tudo num objeto |
| `export default x` / `import x from` | Export padrão |
| `import type { T }` | Só o tipo |
| `export * from "./a.js"` | Reexporta |
| `import.meta.dirname` | A pasta do arquivo atual |

**Pra ler:** os capítulos [Modules, introduction](https://javascript.info/modules-intro) e [Export and Import](https://javascript.info/import-export) do javascript.info cobrem toda a sintaxe com calma. A [referência de módulos do TypeScript](https://www.typescriptlang.org/docs/handbook/modules/reference.html) explica a fundo a história do `.js`. E a [documentação de ES modules do Node](https://nodejs.org/api/esm.html) é a referência pro lado do Node.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
revisado:
---

# Ler e Escrever Arquivos

> *"Programa sem persistência tem a memória de um peixinho dourado."*

> [!tip] ⚡ Em 30 segundos
> O módulo **`node:fs/promises`** lê e grava arquivos: `readFile`, `writeFile`, `mkdir`, `readdir`, `rm`. Pra guardar dados estruturados, o combo é `JSON.stringify` → `writeFile` e `readFile` → `JSON.parse`, **validando** o que voltou (o arquivo pode estar corrompido ou ter sido editado à mão). Monte caminhos com `path.join` e trate o erro `ENOENT` (arquivo não existe) como caso normal no primeiro uso.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Ler, criar, sobrescrever e anexar arquivos de texto com `fs/promises`
- Salvar e carregar dados em JSON com segurança (validação e escrita atômica)
- Listar pastas, criar diretórios e montar caminhos que funcionam no Windows e no Linux

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Async e Await]] · [[Node.js]] · [[Objetos e Arrays no JavaScript]]
- **Depois:** [[JSON]] · [[CSV]] · [[SQL]] (quando o JSON não der mais conta) · [[Gerenciador de Tarefas no Terminal]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Ler e escrever texto

```ts
import { readFile, writeFile, appendFile } from "node:fs/promises";

const texto = await readFile("notas.txt", "utf-8");  // sem "utf-8" vem um Buffer (bytes)
await writeFile("saida.txt", "Olá\n");                // cria ou SOBRESCREVE
await appendFile("log.txt", `${new Date().toISOString()} iniciou\n`); // adiciona no fim
```

### 2. Pastas

```ts
import { mkdir, readdir, rm, stat } from "node:fs/promises";

await mkdir("dados/backup", { recursive: true });   // cria a árvore; não falha se já existe
const itens = await readdir("dados");               // ["backup", "tarefas.json"]
const comTipo = await readdir("dados", { withFileTypes: true });
comTipo.filter((d) => d.isFile()).map((d) => d.name);

const info = await stat("dados/tarefas.json");      // tamanho, datas
info.size; info.mtime;

await rm("dados/temp", { recursive: true, force: true }); // ⚠️ apaga sem perguntar
```

### 3. Caminhos

```ts
import path from "node:path";

path.join("dados", "tarefas.json");     // "dados\tarefas.json" no Windows, "dados/tarefas.json" no Linux
path.resolve("dados");                   // caminho absoluto a partir da pasta atual
path.basename("a/b/nota.md");            // "nota.md"
path.extname("nota.md");                 // ".md"
path.join(import.meta.dirname, "dados"); // relativo AO ARQUIVO, não de onde você rodou
```

> Caminho relativo (`"dados.json"`) é relativo a `process.cwd()`, a pasta **de onde você rodou o comando**. Pra algo sempre ao lado do script, use `import.meta.dirname`.

### 4. JSON: salvar e carregar

```ts
interface Tarefa { id: number; titulo: string; concluida: boolean }

await writeFile("tarefas.json", JSON.stringify(tarefas, null, 2)); // 2 = indentação legível

const dados: unknown = JSON.parse(await readFile("tarefas.json", "utf-8"));
```

`JSON.parse` devolve `any`. Trate como `unknown` e **valide** antes de usar ([[Union Types e Narrowing]] mostra o type guard; mais tarde, [[Validação com Zod]]).

### 5. Tratando erros de arquivo

```ts
try {
  const texto = await readFile("config.json", "utf-8");
} catch (erro) {
  const codigo = (erro as NodeJS.ErrnoException).code;
  if (codigo === "ENOENT") { /* não existe: usar padrão */ }
  else if (codigo === "EACCES") { /* sem permissão */ }
  else throw erro;
}
```

| Código | Significa |
|---|---|
| `ENOENT` | arquivo ou pasta não existe |
| `EACCES` / `EPERM` | sem permissão (ou arquivo aberto em outro programa no Windows) |
| `EEXIST` | já existe |
| `EISDIR` | é uma pasta, não um arquivo |

### 6. Escrita atômica: não corromper o arquivo

Se o programa cair **no meio** de um `writeFile`, o arquivo fica pela metade e o JSON quebra. O truque: escrever num temporário e renomear (renomear é instantâneo).

```ts
import { rename } from "node:fs/promises";

async function salvarSeguro(caminho: string, conteudo: string) {
  const temp = `${caminho}.tmp`;
  await writeFile(temp, conteudo);
  await rename(temp, caminho);
}
```

### 7. Síncrono existe, mas...

```ts
import { readFileSync } from "node:fs";
const texto = readFileSync("a.txt", "utf-8"); // trava o programa até terminar
```

Aceitável em scripts curtos e na inicialização. **Nunca** num servidor atendendo requisições: trava todo mundo.

---

## 🛠️ Exemplo guiado

Um "repositório" de tarefas em JSON, com validação:

```ts
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";

interface Tarefa { id: number; titulo: string; concluida: boolean }

const PASTA = path.join(import.meta.dirname, "..", "dados");
const ARQUIVO = path.join(PASTA, "tarefas.json");

function ehTarefa(x: unknown): x is Tarefa {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "titulo" in x && typeof x.titulo === "string"
    && "concluida" in x && typeof x.concluida === "boolean";
}

export async function carregar(): Promise<Tarefa[]> {
  let texto: string;
  try {
    texto = await readFile(ARQUIVO, "utf-8");
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw erro;
  }
  const dados: unknown = JSON.parse(texto);
  if (!Array.isArray(dados) || !dados.every(ehTarefa)) {
    throw new Error(`Arquivo ${ARQUIVO} está corrompido`);
  }
  return dados;
}

export async function salvar(tarefas: Tarefa[]): Promise<void> {
  await mkdir(PASTA, { recursive: true });
  const temp = `${ARQUIVO}.tmp`;
  await writeFile(temp, JSON.stringify(tarefas, null, 2));
  await rename(temp, ARQUIVO);
}
```

Esse arquivo é praticamente a camada de armazenamento do [[Gerenciador de Tarefas no Terminal]].

---

## 🔧 Pegadinhas

- **Esquecer o `"utf-8"`.** `readFile` devolve um `Buffer`; `JSON.parse(buffer)` até funciona, mas `texto.split` quebra.
- **`writeFile` sobrescreve sem avisar.** Pra adicionar, `appendFile`. Pra não sobrescrever: `writeFile(c, t, { flag: "wx" })` falha se existir.
- **Caminho relativo à pasta errada.** Rodou de outra pasta, não achou o arquivo. Use `import.meta.dirname`.
- **Confiar no JSON lido.** Alguém editou à mão, ficou uma vírgula sobrando: `SyntaxError: Unexpected token`. Trate e dê uma mensagem clara.
- **`EPERM` no Windows.** Arquivo aberto no Excel ou antivírus segurando. Feche o programa e tente de novo.
- **`rm` com `recursive: true` num caminho montado errado.** Pode apagar o que não devia. Confira o caminho com `console.log` antes da primeira vez.

---

## 🔨 Desafio prático

**Objetivo:** um "diário" de linha de comando.

1. `npx tsx diario.ts "Hoje estudei Promises"` adiciona a linha com data/hora em `diario/AAAA-MM-DD.md` (um arquivo por dia, data **local**: veja [[Datas e Fusos Horários]]).
2. `npx tsx diario.ts --hoje` mostra o arquivo de hoje.
3. `npx tsx diario.ts --lista` mostra todos os dias com a quantidade de linhas.
4. Crie a pasta se não existir e trate o dia sem anotações.

**Pronto quando:** rodando 3 vezes no mesmo dia, o arquivo tem 3 linhas; `--lista` funciona com a pasta vazia; e tudo funciona rodando o comando de outra pasta.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `writeFile` e `appendFile`?
> `writeFile` cria ou sobrescreve o arquivo inteiro; `appendFile` adiciona no fim.

> [!question]- O que significa o erro `ENOENT`?
> Que o arquivo ou pasta não existe no caminho informado.

> [!question]- Por que validar o resultado de `JSON.parse`?
> Porque ele devolve `any`: o arquivo pode estar corrompido ou ter outro formato, e o TypeScript não confere em execução.

> [!question]- O que é escrita atômica e por que usar?
> Gravar num arquivo temporário e renomear pro nome final; se o programa cair no meio, o arquivo original continua inteiro.

> [!question]- Um caminho relativo como `"dados.json"` é relativo a quê?
> À pasta de onde o comando foi executado (`process.cwd()`), não à pasta do arquivo `.ts`.

> [!question]- Por que evitar `readFileSync` num servidor?
> Porque trava o programa inteiro até terminar de ler, e nenhuma outra requisição é atendida nesse tempo.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `await readFile(c, "utf-8")` | ler texto |
| `await writeFile(c, t)` | criar/sobrescrever |
| `await appendFile(c, t)` | adicionar no fim |
| `await mkdir(p, { recursive: true })` | criar pastas |
| `await readdir(p)` | listar |
| `await rename(a, b)` | renomear/mover |
| `JSON.stringify(x, null, 2)` | objeto → JSON legível |
| `path.join(import.meta.dirname, "x")` | caminho ao lado do script |

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

- [Node.js · File system (promises)](https://nodejs.org/api/fs.html#promises-api)
- [Node.js · Path](https://nodejs.org/api/path.html)
- [Node.js Learn · Working with files](https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs)

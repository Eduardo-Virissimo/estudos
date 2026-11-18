---
nivel: escrito
revisado:
---

# Ler e Escrever Arquivos

O seu gerenciador de tarefas funciona. Você adiciona três tarefas, conclui uma, lista, está tudo lá. Aí você fecha o terminal, abre de novo, roda o programa... e a lista está vazia. As tarefas sumiram. Não foi bug: é que tudo o que estava em variáveis morava na memória, e a memória é apagada quando o programa termina.

Pra guardar dados entre uma execução e outra, o jeito mais simples que existe é um **arquivo**. No Node, quem lê e grava arquivos é o módulo **`node:fs/promises`**, com funções como `readFile`, `writeFile`, `mkdir`, `readdir` e `rm`. E pra dados estruturados, como uma lista de tarefas, o caminho é o JSON: `JSON.stringify` + `writeFile` pra salvar, `readFile` + `JSON.parse` pra carregar.

Mas esta nota é sobre mais do que essas funções. Ela é sobre os cuidados que separam um programa que "funciona na minha máquina" de um programa em que você confia os seus dados: **validar o que voltou** do arquivo (ele pode ter sido editado à mão, ou estar corrompido), tratar o "arquivo não existe" como um caso normal, e montar caminhos do jeito certo. Ajuda ter passado por [[Async e Await]], [[Node.js]] e [[Objetos e Arrays no JavaScript]].

## Ler e escrever texto

```ts
import { readFile, writeFile, appendFile } from "node:fs/promises";

const texto = await readFile("notas.txt", "utf-8"); // lê o arquivo inteiro
await writeFile("saida.txt", "Olá\n");               // cria ou SOBRESCREVE
await appendFile("log.txt", `${new Date().toISOString()} iniciou\n`); // adiciona no fim
```

São três funções com três comportamentos bem diferentes. O **`readFile`** lê o arquivo inteiro. O `"utf-8"` diz "me entregue como texto"; sem ele, você recebe um `Buffer`, os bytes crus, e coisas como `texto.split("\n")` quebram. O **`writeFile`** escreve, e **apaga o que já tinha**, como salvar um documento por cima do anterior. E o **`appendFile`** adiciona no fim, sem apagar nada, o que é perfeito pra logs.

Preste atenção especial no `writeFile`. Usar ele achando que adiciona é um jeito rápido de perder dados, e ele não avisa. Se o que você quer é **não** sobrescrever um arquivo que já existe, existe uma opção pra isso: `writeFile(caminho, texto, { flag: "wx" })` falha se o arquivo já estiver lá.

As três funções são assíncronas (daí o `await`), porque ler e escrever no disco demora, e o programa não deve ficar travado esperando ([[Async e Await]]).

## Salvar e carregar JSON

Pra guardar a lista de tarefas, você transforma ela em texto JSON e grava:

```ts
interface Tarefa { id: number; titulo: string; concluida: boolean }

await writeFile("tarefas.json", JSON.stringify(tarefas, null, 2)); // o 2 deixa legível
```

E pra carregar, faz o caminho de volta:

```ts
const dados: unknown = JSON.parse(await readFile("tarefas.json", "utf-8"));
```

Repare no `unknown` ali. Esta é a parte mais importante da nota. O `JSON.parse` devolve `any`, e o TypeScript confia cegamente em qualquer coisa marcada como `any`. Mas pense em tudo o que pode ter acontecido com esse arquivo desde que você o salvou: alguém pode ter editado à mão, deixado uma vírgula sobrando, ou ele pode ser de uma versão antiga do seu programa, com outro formato. **Não confie no que voltou.** Trate como `unknown`, e confira antes de usar:

```ts
function ehTarefa(x: unknown): x is Tarefa {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "titulo" in x && typeof x.titulo === "string"
    && "concluida" in x && typeof x.concluida === "boolean";
}

if (!Array.isArray(dados) || !dados.every(ehTarefa)) {
  throw new Error("Arquivo de tarefas está corrompido");
}
// daqui pra baixo, dados é Tarefa[]
```

A `ehTarefa` é um *type guard* ([[Union Types e Narrowing]] explica): uma função que confere o formato, e que avisa o TypeScript de que, se ela passou, o valor é mesmo uma `Tarefa`. Parece muito código pra pouca coisa, e é: mais pra frente, bibliotecas como o [[Validação com Zod|Zod]] fazem isso numa linha. Mas entenda a ideia agora.

E se o JSON estiver quebrado mesmo, com aquela vírgula a mais, o `JSON.parse` lança um `SyntaxError: Unexpected token`. Trate esse erro e mostre uma mensagem clara, como "o arquivo tarefas.json está corrompido", em vez de deixar o programa explodir com uma mensagem que ninguém entende.

## O arquivo que ainda não existe

Na primeira vez que o programa roda, o arquivo de tarefas ainda não existe, e o `readFile` lança um erro com o código `ENOENT`. Isso não é um problema. É só o primeiro uso, e a resposta certa é começar com uma lista vazia:

```ts
try {
  texto = await readFile(ARQUIVO, "utf-8");
} catch (erro) {
  if ((erro as NodeJS.ErrnoException).code === "ENOENT") return []; // primeiro uso: lista vazia
  throw erro; // qualquer outro erro é problema de verdade
}
```

A ideia, que já apareceu em [[Async e Await]]: trate o erro que você **espera**, e deixe os outros subirem. Os códigos de erro que você mais vai ver:

| Código | Significa |
|---|---|
| `ENOENT` | o arquivo ou a pasta não existe |
| `EACCES` / `EPERM` | sem permissão (ou, no Windows, arquivo aberto em outro programa) |
| `EEXIST` | já existe |
| `EISDIR` | é uma pasta, não um arquivo |

O `EPERM` no Windows merece um aviso: quase sempre é o arquivo aberto em outro programa (o Excel, um editor) ou o antivírus segurando ele. Feche e tente de novo.

## Onde fica o arquivo

Os caminhos de arquivo têm duas armadilhas, e as duas pegam todo mundo.

```ts
import path from "node:path";

path.join("dados", "tarefas.json");      // "dados\tarefas.json" no Windows, "dados/tarefas.json" no Linux
path.resolve("dados");                    // caminho completo a partir da pasta atual
path.basename("a/b/nota.md");             // "nota.md"
path.extname("nota.md");                  // ".md"
path.join(import.meta.dirname, "dados");  // relativo AO ARQUIVO, não de onde você rodou
```

A primeira: **monte caminhos com `path.join`, nunca com `+`.** O Windows usa `\` e o Linux usa `/`, e o `path.join` escolhe a barra certa sozinho. Juntar com `+` funciona no seu computador e quebra no do colega.

A segunda é mais sutil: **um caminho relativo é relativo a quem rodou o programa.** Quando o seu código lê `"dados.json"`, o Node procura esse arquivo na pasta **de onde você rodou o comando** (o `process.cwd()`), e não na pasta onde está o seu arquivo `.ts`. Então o programa funciona perfeitamente quando você roda de dentro da pasta dele, e dá `ENOENT` quando você roda de qualquer outro lugar. Pra algo que deve ficar sempre ao lado do script, use `import.meta.dirname`.

## Não corromper o arquivo

Agora um cuidado de profissional. Imagine que o programa cai **bem no meio** de um `writeFile`: falta luz, dá um erro, você aperta Ctrl+C. O arquivo fica escrito pela metade, o JSON fica quebrado, e na próxima vez que você abrir, todas as tarefas estão perdidas.

O truque é escrever num **arquivo temporário** e, só no fim, **renomear** ele pro nome certo. Renomear é instantâneo: ou acontece inteiro, ou não acontece. Não existe "meio renomeado".

```ts
import { writeFile, rename, mkdir } from "node:fs/promises";

async function salvar(tarefas: Tarefa[]): Promise<void> {
  await mkdir(PASTA, { recursive: true });
  const temp = `${ARQUIVO}.tmp`;
  await writeFile(temp, JSON.stringify(tarefas, null, 2));
  await rename(temp, ARQUIVO);
}
```

Se o programa cair durante o `writeFile`, quem fica pela metade é o `.tmp`, e o arquivo original continua inteiro. Isso se chama **escrita atômica**. Junto com o carregar validado de antes, isso é praticamente a camada de armazenamento inteira do [[Gerenciador de Tarefas no Terminal]].

## Pastas, e a versão que trava

Pra mexer com pastas:

```ts
import { mkdir, readdir, rm, stat } from "node:fs/promises";

await mkdir("dados/backup", { recursive: true }); // cria a árvore toda; não falha se já existe
const itens = await readdir("dados");             // ["backup", "tarefas.json"]
const info = await stat("dados/tarefas.json");    // tamanho, datas
await rm("dados/temp", { recursive: true, force: true }); // ⚠️ apaga sem perguntar
```

> [!warning] Cuidado com o rm recursivo
> O `rm` com `recursive: true` apaga uma pasta inteira, com tudo dentro, sem lixeira e sem perguntar. Num caminho montado errado, ele apaga o que não devia. Na primeira vez, confira o caminho com um `console.log` antes de rodar de verdade.

Por fim, existem versões **síncronas** dessas funções, como o `readFileSync`, que travam o programa até terminar. Elas são aceitáveis em scripts curtos e na inicialização de um programa. Mas **nunca** use num servidor atendendo pessoas: enquanto ele está lendo um arquivo, ninguém mais é atendido.

## O essencial

1. `writeFile` sobrescreve, `appendFile` adiciona. Sem `"utf-8"`, você recebe bytes.
2. O que volta do `JSON.parse` é `unknown`: confira antes de usar.
3. `ENOENT` na primeira execução é normal. Trate esse erro e deixe os outros subirem.
4. Caminhos com `path.join`. Relativo é relativo a quem rodou; ao lado do script, `import.meta.dirname`.
5. Pra não corromper: escreva num `.tmp` e renomeie.

## Agora é com você

Construa um **diário de linha de comando**. Rodar `npx tsx diario.ts "Hoje estudei Promises"` adiciona essa linha, com data e hora, num arquivo `diario/AAAA-MM-DD.md`, um arquivo por dia (e a data é a **local**: lembra do bug das 21h em [[Datas e Fusos Horários]]?). Rodar com `--hoje` mostra o arquivo de hoje. Rodar com `--lista` mostra todos os dias, com a quantidade de linhas de cada um. Crie a pasta se ela não existir, e trate o dia sem anotações. Você terminou quando, rodando 3 vezes no mesmo dia, o arquivo tiver 3 linhas; o `--lista` funcionar com a pasta vazia; e tudo funcionar mesmo rodando o comando de outra pasta.

Daqui, siga pra [[JSON]] e [[CSV]], e mais adiante pra [[SQL]], pra quando um arquivo JSON não der mais conta. E aplique tudo no [[Gerenciador de Tarefas no Terminal]].

---

## 🧠 Me teste

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

> [!question]+ `readFile("dados.json")` deu `ENOENT`, mas o arquivo existe na pasta do script. Causa provável?
> - a) O arquivo está corrompido
> - b) O caminho relativo é resolvido a partir de **onde você rodou o comando**, não da pasta do script
> - c) Falta permissão de leitura
> - d) Falta `JSON.parse`
>
> > [!check]- Resposta
> > **b)** Caminhos relativos partem do diretório atual (`process.cwd()`). Pra apontar pra pasta do arquivo, monte o caminho com `import.meta.dirname` e `path.join`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `await readFile(c, "utf-8")` | Lê texto |
| `await writeFile(c, t)` | Cria ou sobrescreve |
| `await appendFile(c, t)` | Adiciona no fim |
| `await mkdir(p, { recursive: true })` | Cria pastas |
| `await readdir(p)` | Lista uma pasta |
| `await rename(a, b)` | Renomeia ou move |
| `JSON.stringify(x, null, 2)` | Objeto → JSON legível |
| `path.join(import.meta.dirname, "x")` | Caminho ao lado do script |

**Pra ler:** o guia [Working with files](https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs), do site oficial do Node, é curto e cheio de exemplos, um bom próximo passo. Pra consultar, a referência da [API de arquivos com promises](https://nodejs.org/api/fs.html#promises-api) e a do [módulo path](https://nodejs.org/api/path.html).

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: essencial
revisado:
---

# Node.js

**Quanto focar: 🔥 essencial.** É o que roda o seu back-end e as suas ferramentas. Entenda bem o que ele é e como rodar um projeto.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 5 min no Me teste e 20 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Durante quase quinze anos, o JavaScript viveu preso dentro do navegador. Ele servia pra uma coisa só: deixar páginas interativas, fazer um menu abrir, validar um formulário. Se você quisesse escrever um servidor, um script de automação ou uma ferramenta de terminal, precisava aprender outra linguagem.

Em 2009, um programador chamado Ryan Dahl teve uma ideia simples e poderosa: pegar o motor que executa JavaScript dentro do Chrome, o **V8**, e colocar ele pra rodar direto no sistema operacional, fora do navegador. Nasceu o **Node.js**: um programa que roda JavaScript no seu terminal, num servidor, num script. E ele acrescentou o que o navegador nunca teve: ler e escrever arquivos, criar servidores, acessar o sistema.

O Node vem junto com o **npm**, o [[Gerenciador de Pacotes]] que instala bibliotecas. E é nele que todo o seu TypeScript vai rodar neste roadmap. Por isso vale entender o que ele **tem**, e principalmente o que ele **não tem**. Ajuda ter passado por [[JavaScript e TypeScript]] e pelo [[Terminal]].

## O mesmo idioma, outro país

Pense no JavaScript como um idioma, e no ambiente onde ele roda como o país onde você fala. O idioma é o mesmo, a gramática é a mesma, mas o que existe ao redor muda completamente:

| | Navegador | Node.js |
|---|---|---|
| A página (`document`, `window`) | ✅ | ❌ |
| Arquivos (`fs`) | ❌ | ✅ |
| Criar servidor HTTP | ❌ | ✅ |
| `fetch`, `console`, `setTimeout` | ✅ | ✅ |
| Processo e argumentos (`process`) | ❌ | ✅ |

As diferenças fazem todo o sentido quando você pensa nelas. No navegador, não dá pra ler arquivos do seu computador: imagine qualquer site que você visita podendo ler os seus documentos! E no Node não existe página, então não existe `document`.

Essa segunda diferença gera um erro que você vai ver: `document is not defined` (ou `window is not defined`). Ele quer dizer que você está rodando no Node um código que foi feito pro navegador. Não tem nada de errado com o código; ele só está no país errado.

O Node trouxe também um jeito de trabalhar que fez muito sucesso: **assíncrono**. Em vez de ficar parado esperando o disco ou a rede responderem, ele segue fazendo outras coisas e é avisado quando o resultado chega ([[Event Loop]] e [[Promises]] explicam como). Isso o tornou ótimo pra servidores que atendem muita gente ao mesmo tempo.

## Instalar e rodar

Baixe a versão **LTS** em [nodejs.org](https://nodejs.org/). LTS quer dizer *Long Term Support*: é a versão estável, que recebe correções por anos. A outra opção, a "Current", tem as novidades, mas muda mais. Pra estudar e pra trabalhar, LTS.

No Windows, o instalador oficial já coloca o Node no PATH. Confira se deu certo:

```bash
node --version   # v22.x ou mais nova
npm --version
```

E os jeitos de rodar código:

```bash
node ola.js          # executa um arquivo JavaScript
node                 # abre o REPL: digite JS e veja o resultado na hora (.exit pra sair)
npx tsx ola.ts       # executa TypeScript sem compilar antes
node --watch app.js  # roda de novo a cada vez que você salva
```

O **REPL** (sigla de *Read-Eval-Print Loop*) merece um destaque. É um prompt onde você digita uma linha de JavaScript e vê o resultado na hora. Perfeito pra tirar uma dúvida rápida, do tipo "quanto dá `"5" + 3` mesmo?", sem criar arquivo nenhum.

Uma armadilha comum: você segue um tutorial recente, e um recurso "não existe" no seu Node. Quase sempre é versão velha. Confira com `node --version` e atualize pra LTS. E se um dia você precisar de várias versões no mesmo computador (projetos diferentes às vezes pedem versões diferentes), existem gerenciadores pra isso, como o **fnm** e o **nvm-windows**.

## O que já vem na caixa

O Node vem com vários módulos prontos, que você usa sem instalar nada. Importe com o prefixo `node:`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

console.log(process.cwd());                      // pasta atual
console.log(path.join("dados", "tarefas.json")); // monta o caminho certo no Windows e no Linux
console.log(process.platform);                   // "win32", "linux", "darwin"
```

Os que você mais vai usar ao longo do roadmap:

| Módulo | Pra quê |
|---|---|
| `node:fs` | ler e escrever arquivos ([[Ler e Escrever Arquivos]]) |
| `node:path` | montar caminhos |
| `node:process` | argumentos, variáveis de ambiente, código de saída |
| `node:readline` | perguntar no terminal ([[Entrada e Saída]]) |
| `node:http` | servidor HTTP |
| `node:test` | testes, sem instalar nada |

O prefixo `node:` não é obrigatório, mas vale usar: ele deixa claro que é um módulo nativo, e evita confusão com algum pacote do npm que tenha o mesmo nome.

Um exemplo juntando tudo, que lista as notas `.md` de uma pasta e conta as linhas de cada uma:

```ts
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const pasta = process.argv[2] ?? ".";
const notas = readdirSync(pasta).filter((f) => f.endsWith(".md"));

for (const nota of notas) {
  const linhas = readFileSync(path.join(pasta, nota), "utf-8").split("\n").length;
  console.log(`${nota}: ${linhas} linhas`);
}
console.log(`Total: ${notas.length} notas`);
```

Repare no `path.join` ali. Juntar caminhos com `+`, como `"dados/" + arquivo`, quebra entre sistemas, porque o Windows usa `\` e o Linux usa `/`. O `path.join` escolhe a barra certa sozinho. E repare também numa armadilha que a nota [[Ler e Escrever Arquivos]] explica com calma: um caminho relativo como `"dados.json"` é procurado na pasta **de onde você rodou o comando**, e não na pasta onde está o seu arquivo `.ts`.

## Configurações que mudam de máquina pra máquina

Algumas configurações mudam de um computador pro outro: a porta do servidor, a senha do banco de dados. Essas coisas não ficam escritas no código. Ficam em **variáveis de ambiente**, que o programa lê quando roda:

```ts
const porta = process.env.PORT ?? "3000";
```

```bash
PORT=8080 node servidor.js        # Bash
$env:PORT=8080; node servidor.js  # PowerShell
```

A partir do Node 20.6, dá pra carregar essas variáveis de um arquivo `.env` com `node --env-file=.env app.js`. A nota [[Variáveis de Ambiente]] aprofunda.

E uma novidade: as versões recentes do Node conseguem rodar arquivos `.ts` direto (`node ola.ts`), apagando os tipos na hora. Funciona bem pra scripts simples. Pra um projeto de verdade, o caminho está em [[Configurando um Projeto TypeScript]].

## O essencial

1. O Node roda JavaScript fora do navegador. Tem arquivos, processo e servidor; não tem `document` nem `window`.
2. Instale a versão LTS. Algo "não existe"? Confira o `node --version`.
3. `node` sozinho abre o REPL, pra testar ideias rápidas.
4. Módulos nativos com `node:` (`fs`, `path`, `process`), sem instalar nada.
5. Caminhos com `path.join`; configurações que mudam vão em variáveis de ambiente.

## Agora é com você

Instale o Node LTS e confira as versões. Abra o REPL, calcule `2 ** 32`, e saia com `.exit`. Depois crie um `info.ts` que mostra quatro coisas: a versão do Node (`process.version`), o sistema (`process.platform`), a pasta atual e os argumentos recebidos. Rode com `npx tsx info.ts a b c`, e depois rode com `--watch` e altere o arquivo pra ver ele reiniciar sozinho. Você terminou quando o script mostrar as quatro informações e reiniciar ao salvar.

Daqui, siga pro [[Configurando um Projeto TypeScript]], pra [[Ler e Escrever Arquivos]] e pro [[Servidor HTTP com Node.js]].

---

## 🧠 Me teste

> [!question]- O que é o Node.js?
> Um ambiente que executa JavaScript fora do navegador (terminal, servidor), usando o motor V8, com acesso a arquivos, rede e sistema.

> [!question]- O que significa LTS e por que escolher essa versão?
> Long Term Support: a versão estável, com correções por mais tempo. É a recomendada pra projetos.

> [!question]- Cite algo que existe no navegador e não no Node, e algo que existe no Node e não no navegador.
> No navegador: `document`/`window`. No Node: `fs` (arquivos), `process`, criar servidor HTTP.

> [!question]- O que quer dizer `document is not defined`?
> Que um código feito pro navegador está rodando no Node, onde não existe página.

> [!question]- Pra que serve o prefixo `node:` no import?
> Indica que é um módulo nativo do Node (ex: `node:fs`), não um pacote instalado.

> [!question]- Por que usar `path.join` em vez de concatenar caminhos?
> Porque ele usa o separador certo de cada sistema (`\` no Windows, `/` no Linux) e evita barras duplicadas.

> [!question]+ Qual destes **não** existe no Node.js puro?
> - a) `process`
> - b) `fs`
> - c) `document`
> - d) `fetch`
>
> > [!check]- Resposta
> > **c)** `document` é do navegador (a página HTML). `process` e `fs` são do Node, e `fetch` existe nos dois desde o Node 18.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `node --version` | Versão instalada |
| `node arquivo.js` | Executa |
| `node` | Abre o REPL |
| `npx tsx arquivo.ts` | Executa TypeScript |
| `node --watch arquivo.js` | Reinicia ao salvar |
| `node --env-file=.env app.js` | Carrega o `.env` |
| `process.argv` / `process.env` | Argumentos / variáveis de ambiente |

**Pra ler:** a [introdução oficial ao Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) é curta e boa pra fixar o que é o Node e como ele pensa. A [documentação da API](https://nodejs.org/api/) é a referência de cada módulo nativo. E o [fnm](https://github.com/Schniz/fnm) é o gerenciador de versões mais simples pra Windows, se um dia você precisar de mais de uma.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

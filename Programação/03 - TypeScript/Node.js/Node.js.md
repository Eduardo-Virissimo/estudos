---
nivel: escrito
revisado:
---

# Node.js

> *"JavaScript no servidor parecia piada em 2009. Hoje roda metade da internet."*

> [!tip] ⚡ Em 30 segundos
> **Node.js** é um programa que executa JavaScript **fora do navegador**: no seu terminal, num servidor, num script de automação. Ele usa o motor V8 (o mesmo do Chrome) e acrescenta o que o navegador não tem: ler e escrever arquivos, criar servidores, acessar o sistema. Vem com o **npm**, o [[Gerenciador de Pacotes]] que instala bibliotecas. É o ambiente onde todo o seu TypeScript vai rodar neste roadmap.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Instalar o Node.js (versão LTS) e conferir a instalação no terminal
- Rodar um arquivo JavaScript/TypeScript e usar o REPL
- Usar módulos nativos (`node:fs`, `node:path`, `node:process`) e explicar o que muda em relação ao navegador

---

## 🧭 Onde isso se encaixa

- **Antes:** [[JavaScript e TypeScript]] · [[Terminal]] · [[Gerenciador de Pacotes]]
- **Depois:** [[Configurando um Projeto TypeScript]] · [[Ler e Escrever Arquivos]] · [[Servidor HTTP com Node.js]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é Node.js?

Criado por **Ryan Dahl** em **2009**, o Node pegou o motor V8 do Chrome e o colocou pra rodar no sistema operacional, com um modelo **assíncrono**: em vez de ficar parado esperando o disco ou a rede, ele segue fazendo outras coisas e é avisado quando o resultado chega ([[Event Loop]]). Isso o tornou ótimo pra servidores que atendem muitas conexões ao mesmo tempo.

| | Navegador | Node.js |
|---|---|---|
| Página (`document`, `window`) | ✅ | ❌ |
| Arquivos (`fs`) | ❌ | ✅ |
| Criar servidor HTTP | ❌ | ✅ |
| `fetch`, `console`, `setTimeout` | ✅ | ✅ |
| Processo e argumentos (`process`) | ❌ | ✅ |

---

## 🧱 O mínimo pra usar

### 1. Instalar

Baixe a versão **LTS** (*Long Term Support*, a estável) em [nodejs.org](https://nodejs.org/). No Windows, o instalador oficial já põe no PATH. Conferindo:

```bash
node --version   # v22.x ou mais nova
npm --version
```

> Pra ter várias versões no mesmo PC (projetos diferentes pedem versões diferentes), use um gerenciador de versões: **fnm** ou **nvm-windows**.

### 2. Rodar código

```bash
node ola.js          # executa um arquivo JS
node                 # abre o REPL: digite JS e veja o resultado na hora (.exit pra sair)
npx tsx ola.ts       # executa TypeScript sem compilar antes
```

> Versões recentes do Node também rodam `.ts` direto (`node ola.ts`), apagando os tipos na hora. Funciona pra scripts simples; o setup completo está em [[Configurando um Projeto TypeScript]].

### 3. Módulos nativos

Já vêm com o Node, sem instalar nada. Importe com o prefixo `node:`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

console.log(process.cwd());                      // pasta atual
console.log(path.join("dados", "tarefas.json")); // monta caminho certo no Windows e no Linux
console.log(process.platform);                   // "win32", "linux", "darwin"
```

| Módulo | Pra quê |
|---|---|
| `node:fs` | ler/escrever arquivos ([[Ler e Escrever Arquivos]]) |
| `node:path` | montar caminhos |
| `node:process` | argumentos, variáveis de ambiente, código de saída |
| `node:readline` | perguntar no terminal ([[Entrada e Saída]]) |
| `node:http` | servidor HTTP |
| `node:test` | testes sem instalar nada |

### 4. Variáveis de ambiente

```ts
const porta = process.env.PORT ?? "3000";
```

```bash
PORT=8080 node servidor.js        # Bash
$env:PORT=8080; node servidor.js  # PowerShell
```

Node 20.6+ lê um arquivo `.env` com `node --env-file=.env app.js`. Mais em [[Variáveis de Ambiente]].

### 5. `--watch`: reinicia sozinho

```bash
node --watch app.js      # roda de novo a cada arquivo salvo
npx tsx watch app.ts     # o mesmo pra TypeScript
```

---

## 🛠️ Exemplo guiado

Um script que lista os arquivos `.md` de uma pasta e conta as linhas:

```ts
// contar-notas.ts
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

```bash
npx tsx contar-notas.ts "../Inglês/01 - Técnicas"
```

---

## 🔧 Pegadinhas

- **`document is not defined` / `window is not defined`.** Esse código é de navegador; no Node não existe página.
- **Versão velha.** Tutoriais novos usam recursos novos. Se algo não existir, confira `node --version` e atualize pra LTS.
- **Caminho com `+` ou barra fixa.** `"dados/" + arquivo` quebra entre sistemas. Use `path.join`.
- **Caminho relativo à pasta errada.** `readFileSync("dados.json")` procura na pasta **de onde você rodou o comando** (`process.cwd()`), não na pasta do arquivo.
- **Esquecer `node:`.** Funciona sem, mas o prefixo deixa claro que é nativo e evita confusão com um pacote de mesmo nome.

---

## 🔨 Desafio prático

**Objetivo:** um "info do sistema" no terminal.

1. Instale o Node LTS e confira as versões.
2. Abra o REPL, calcule `2 ** 32` e saia com `.exit`.
3. Crie `info.ts` que mostra: versão do Node (`process.version`), sistema (`process.platform`), pasta atual e os argumentos recebidos.
4. Rode com `npx tsx info.ts a b c` e com `--watch`, alterando o arquivo pra ver reiniciar.

**Pronto quando:** o script mostra as 4 informações e reinicia sozinho ao salvar.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que é o Node.js?
> Um ambiente que executa JavaScript fora do navegador (terminal, servidor), usando o motor V8, com acesso a arquivos, rede e sistema.

> [!question]- O que significa LTS e por que escolher essa versão?
> Long Term Support: a versão estável, com correções por mais tempo. É a recomendada pra projetos.

> [!question]- Cite algo que existe no navegador e não no Node, e algo que existe no Node e não no navegador.
> No navegador: `document`/`window`. No Node: `fs` (arquivos), `process`, criar servidor HTTP.

> [!question]- Pra que serve o prefixo `node:` no import?
> Indica que é um módulo nativo do Node (ex: `node:fs`), não um pacote instalado.

> [!question]- Por que usar `path.join` em vez de concatenar caminhos?
> Porque ele usa o separador certo de cada sistema (`\` no Windows, `/` no Linux) e evita barras duplicadas.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `node --version` | versão instalada |
| `node arquivo.js` | executa |
| `node` | abre o REPL |
| `npx tsx arquivo.ts` | executa TypeScript |
| `node --watch arquivo.js` | reinicia ao salvar |
| `node --env-file=.env app.js` | carrega `.env` |
| `process.argv` / `process.env` | argumentos / variáveis de ambiente |

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

- [Node.js · Introdução oficial](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Node.js · Documentação da API](https://nodejs.org/api/)
- [fnm](https://github.com/Schniz/fnm): gerenciador de versões do Node, rápido e funciona no Windows

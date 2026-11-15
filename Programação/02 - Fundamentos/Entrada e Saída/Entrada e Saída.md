---
nivel: escrito
revisado:
---

# Entrada e Saída

> *"Um programa que não recebe nada e não mostra nada é só um aquecedor de CPU."*

> [!tip] ⚡ Em 30 segundos
> **Entrada** é como o programa recebe dados (teclado, argumentos do terminal, arquivo, rede); **saída** é como ele mostra o resultado (tela, arquivo, resposta HTTP). No Node.js, o básico é `console.log` pra sair, `process.argv` pra receber argumentos e `readline` pra perguntar ao usuário. Toda entrada chega como **texto**: converter e validar é com você.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Mostrar dados no terminal com `console.log`, `console.error` e `console.table`
- Receber argumentos na linha de comando com `process.argv`
- Fazer perguntas ao usuário com `readline` e validar a resposta

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Variáveis e Tipos de Dados]] · [[Terminal]]
- **Depois:** [[Estruturas Condicionais]] · [[Ler e Escrever Arquivos]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Saída: a família `console`

```ts
console.log("Olá", 42, { nivel: 3 }); // saída normal (stdout)
console.error("Deu ruim");             // saída de erro (stderr)
console.table([{ nome: "Ana", xp: 120 }, { nome: "Bia", xp: 80 }]);
```

`stdout` e `stderr` são canais separados: no [[Bash]], `2>` redireciona só os erros.

### 2. Entrada por argumentos: `process.argv`

```ts
// npx tsx somar.ts 10 5
const args = process.argv.slice(2); // ["10", "5"]  (as 2 primeiras são o node e o arquivo)
const [a, b] = args.map(Number);
console.log(a + b); // 15
```

Bom pra scripts e ferramentas de linha de comando (CLIs): `git commit -m "msg"` funciona assim.

### 3. Entrada interativa: `readline`

```ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const rl = readline.createInterface({ input, output });
  const nome = await rl.question("Qual seu nome? ");
  console.log(`Bem-vindo, ${nome.trim()}!`);
  rl.close(); // sem isso o programa não termina
}

main();
```

> O `async`/`await` você entende em [[Async e Await]]. Por enquanto, copie a estrutura: perguntas sempre com `await rl.question(...)` dentro do `main`.

### 4. Validar sempre

Tudo que vem de fora é texto e pode vir errado:

```ts
const resposta = await rl.question("Idade: ");
const idade = Number(resposta);
if (resposta.trim() === "" || Number.isNaN(idade) || idade < 0) {
  console.error("Idade inválida");
  process.exitCode = 1; // sinaliza erro pra quem chamou o programa
}
```

### 5. Código de saída

Todo programa termina com um número: `0` = deu certo, qualquer outro = erro. Scripts, [[Git Hooks]] e CI leem esse número. Use `process.exitCode = 1` quando algo falhar.

---

## 🛠️ Exemplo guiado

Uma calculadora de IMC que aceita argumentos **ou** pergunta se eles não vierem:

```ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function lerNumero(rl: readline.Interface, pergunta: string): Promise<number> {
  while (true) {
    const n = Number((await rl.question(pergunta)).replace(",", "."));
    if (!Number.isNaN(n) && n > 0) return n;
    console.error("Digite um número maior que zero.");
  }
}

async function main() {
  let [peso, altura] = process.argv.slice(2).map(Number);
  if (!peso || !altura) {
    const rl = readline.createInterface({ input, output });
    peso = await lerNumero(rl, "Peso (kg): ");
    altura = await lerNumero(rl, "Altura (m): ");
    rl.close();
  }
  const imc = peso / altura ** 2;
  console.log(`IMC: ${imc.toFixed(1)}`);
}

main();
```

Repare: aceitar `1,75` (vírgula) é pensar no usuário brasileiro.

---

## 🔧 Pegadinhas

- **Esquecer que a entrada é texto.** `"10" + "5"` é `"105"`. Converta com `Number()`.
- **Esquecer o `rl.close()`.** O programa fica "pendurado" esperando mais entrada.
- **Esquecer o `.slice(2)` no `process.argv`.** As duas primeiras posições são o caminho do Node e do arquivo.
- **Não tratar espaço e vírgula.** Use `.trim()` e, pra decimais, `.replace(",", ".")`.
- **Usar `console.log` pra erro.** Use `console.error`: assim quem redireciona a saída não mistura erro com resultado.

---

## 🔨 Desafio prático

**Objetivo:** um "quiz" de 3 perguntas no terminal.

1. Pergunte 3 coisas com `readline` (ex: capital do Brasil, 7 × 8, ano atual).
2. Compare cada resposta (ignorando maiúsculas e espaços: `.trim().toLowerCase()`).
3. No fim, mostre a pontuação e uma tabela com `console.table` (pergunta, sua resposta, certa?).
4. Se acertou menos de 2, termine com `process.exitCode = 1`.

**Pronto quando:** responder `" BRASÍLIA "` conta como certo e, no [[Bash]], `npx tsx quiz.ts; echo $?` mostra `1` quando você vai mal.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Por que usar `process.argv.slice(2)`?
> Porque as duas primeiras posições do `process.argv` são o caminho do Node e do arquivo; os argumentos do usuário começam na terceira.

> [!question]- Qual o tipo de qualquer dado que chega pelo teclado ou argumento?
> Sempre `string`. É preciso converter (ex: `Number()`) e validar.

> [!question]- Qual a diferença entre `console.log` e `console.error`?
> `log` escreve no stdout (saída normal); `error` no stderr (saída de erro). Dá pra redirecionar cada um separado.

> [!question]- O que acontece se esquecer o `rl.close()`?
> O programa não termina: fica esperando mais entrada.

> [!question]- O que significa o código de saída 0?
> Que o programa terminou com sucesso. Qualquer outro número indica erro.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `console.log(x)` | mostra na saída normal |
| `console.error(x)` | mostra na saída de erro |
| `console.table(lista)` | mostra uma tabela |
| `process.argv.slice(2)` | argumentos do terminal |
| `await rl.question("?")` | pergunta e espera a resposta |
| `rl.close()` | encerra a leitura |
| `process.exitCode = 1` | termina indicando erro |

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

- [Node.js · readline](https://nodejs.org/api/readline.html#promises-api)
- [Node.js · process.argv](https://nodejs.org/api/process.html#processargv)
- [MDN · console](https://developer.mozilla.org/pt-BR/docs/Web/API/console)

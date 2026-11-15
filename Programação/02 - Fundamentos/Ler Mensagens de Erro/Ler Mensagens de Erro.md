---
nivel: escrito
revisado:
---

# Ler Mensagens de Erro

> *"A mensagem de erro não é uma bronca. É uma pista."*

> [!tip] ⚡ Em 30 segundos
> Iniciante vê um erro vermelho e entra em pânico; dev experiente **lê**. Quase toda mensagem diz três coisas: **o tipo** do erro (`TypeError`), **o que** aconteceu (`Cannot read properties of undefined (reading 'nome')`) e **onde** (`tarefas.ts:12:18`). Ler com calma resolve a maioria dos problemas antes de você precisar perguntar pra alguém.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Achar na mensagem o tipo do erro, a descrição e o arquivo/linha
- Distinguir erro do TypeScript (antes de rodar) de erro em tempo de execução
- Seguir um roteiro de investigação antes de pedir ajuda

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Terminal]]
- **Depois:** [[Stack Trace]] · [[Debugging]] · [[Como Fazer Boas Perguntas]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Anatomia de um erro

```text
/home/ana/tarefas/src/main.ts:12
  console.log(tarefa.titulo.toUpperCase());
                            ^
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at listar (/home/ana/tarefas/src/main.ts:12:29)      ← onde explodiu
    at main (/home/ana/tarefas/src/main.ts:20:3)         ← quem chamou
    at ...node:internal...                               ← ignore
```

| Parte | O que diz |
|---|---|
| `TypeError` | **tipo**: usou um valor do jeito errado |
| `Cannot read properties of undefined (reading 'toUpperCase')` | **o quê**: `tarefa.titulo` é `undefined` |
| `main.ts:12:29` | **onde**: arquivo, linha 12, coluna 29 |
| linhas `at ...` | **o caminho**: a pilha de chamadas ([[Stack Trace]]) |

Leia **a primeira linha do seu código** na pilha (ignore `node:internal` e `node_modules`).

### 2. Os erros de execução mais comuns

| Erro | Tradução | Causa típica |
|---|---|---|
| `TypeError: Cannot read properties of undefined (reading 'x')` | tentou ler `.x` de algo vazio | dado não carregou, índice errado, faltou `?.` |
| `TypeError: x is not a function` | chamou algo que não é função | nome errado, import errado, esqueceu de exportar |
| `ReferenceError: x is not defined` | variável não existe aqui | erro de digitação, fora do [[Escopo]] |
| `SyntaxError: Unexpected token` | código mal escrito | faltou `}`, `)` ou vírgula; JSON inválido |
| `RangeError: Maximum call stack size exceeded` | recursão sem fim | faltou caso base ([[Recursão]]) |
| `Error: ENOENT: no such file or directory` | arquivo não existe | caminho errado, pasta atual errada |
| `Error: Cannot find module 'x'` | import não encontrado | pacote não instalado (`npm install`) ou caminho errado |

### 3. Erro do TypeScript (antes de rodar)

O TypeScript avisa **no editor**, sublinhado em vermelho, e no `tsc`:

```text
src/main.ts:8:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

- `TS2345` é o código: pesquise "TS2345" pra ver explicações.
- Leia de trás pra frente: "o **parâmetro** espera `number`, você passou `string`".
- Mensagens longas de tipo: leia a **última** linha, que é a causa mais específica.

### 4. Roteiro de investigação

1. **Leia a mensagem inteira**, devagar, em voz alta se precisar.
2. **Vá na linha** indicada (no [[VS Code]], `Ctrl + clique` no caminho do erro).
3. **Pergunte:** que valor eu esperava aqui? Que valor tem de verdade? (`console.log` antes da linha)
4. **Reproduza** com o menor caso possível.
5. **Pesquise** a mensagem exata, sem seus nomes de variável: `"Cannot read properties of undefined" reading`.
6. Ainda travado? Pergunte com contexto: [[Como Fazer Boas Perguntas]].

### 5. A linha do erro nem sempre é a do bug

O erro aparece onde o valor ruim foi **usado**, não onde ele foi **criado**. Se `tarefa` é `undefined` na linha 12, o bug pode estar na linha 5, onde você buscou a tarefa errada. Volte o caminho.

---

## 🛠️ Exemplo guiado

```ts
const tarefas = [{ titulo: "Estudar" }, { titulo: "Treinar" }];
for (let i = 0; i <= tarefas.length; i++) {
  console.log(tarefas[i].titulo);
}
```

```text
Estudar
Treinar
TypeError: Cannot read properties of undefined (reading 'titulo')
    at main.ts:3:26
```

1. **O quê:** `tarefas[i]` é `undefined` quando tentou ler `.titulo`.
2. **Quando:** depois de mostrar os 2 itens, ou seja, na 3ª volta (`i = 2`).
3. **Por quê:** `tarefas[2]` não existe; o laço vai até `i <= length`.
4. **Correção:** `i < tarefas.length` (ou `for...of`, que não tem esse problema).

---

## 🔧 Pegadinhas

- **Ler só a primeira palavra.** "Deu TypeError" não ajuda ninguém; a frase toda é que tem a resposta.
- **Corrigir o sintoma.** Pôr `?.` em tudo esconde o erro, não resolve. Descubra **por que** o valor veio vazio.
- **Olhar só pro `node_modules`.** O erro costuma estourar dentro de uma biblioteca, mas o culpado é o valor que **você** passou. Ache a primeira linha sua na pilha.
- **Vários erros de TypeScript em cascata.** Corrija o **primeiro**; muitas vezes os outros somem junto.
- **Copiar a mensagem pra IA sem ler.** Leia primeiro. Se ainda assim precisar, mande a mensagem inteira + o trecho do código.

---

## 🔨 Desafio prático

**Objetivo:** provocar e consertar 5 erros de propósito.

1. Crie `erros.ts` e provoque, um de cada vez: `ReferenceError`, `TypeError` de undefined, `x is not a function`, `RangeError` (recursão sem fim) e `ENOENT` (ler um arquivo que não existe com `fs.readFileSync`).
2. Pra cada um, anote: tipo, a frase do "o quê", arquivo:linha, e a causa em 1 linha.
3. Faça um erro de TypeScript (`const n: number = "5"`) e anote o código `TS....`.

**Pronto quando:** você tem uma tabelinha com os 6 erros e consegue dizer a causa de cada um só olhando a mensagem.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quais são as três informações principais de uma mensagem de erro?
> O tipo (`TypeError`), a descrição do que aconteceu e o local (arquivo:linha:coluna).

> [!question]- O que significa "Cannot read properties of undefined (reading 'x')"?
> Que você tentou ler a propriedade `x` de um valor que é `undefined`: o objeto que você esperava não existe ali.

> [!question]- Qual a diferença entre um erro do TypeScript e um erro de execução?
> O do TypeScript aparece antes de rodar (no editor ou no `tsc`), sobre tipos; o de execução acontece com o programa rodando.

> [!question]- Por que a linha do erro nem sempre é a linha do bug?
> Porque o erro estoura onde o valor ruim foi usado; o bug pode estar antes, onde esse valor foi criado ou buscado.

> [!question]- O que fazer quando a pilha mostra muitas linhas de `node_modules`?
> Procurar a primeira linha que é do seu código: normalmente o problema é o valor que você passou pra biblioteca.

> [!question]- O que significa `ENOENT`?
> "Error NO ENTry": o arquivo ou pasta não existe no caminho informado.

---

## 📋 Cola rápida

| Erro | Primeiro suspeito |
|---|---|
| `Cannot read properties of undefined` | dado vazio, índice errado |
| `is not a function` | nome/import errado |
| `is not defined` | digitação, escopo |
| `Unexpected token` | faltou `}` `)` `,` ou JSON inválido |
| `Maximum call stack` | recursão sem caso base |
| `ENOENT` | caminho do arquivo |
| `Cannot find module` | `npm install` / caminho do import |
| `TS2345` | tipo do argumento errado |

---

## 🛠️ Exemplo meu

> Um erro de verdade que você teve, a mensagem e o que era.

```text

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

- [MDN · Referência de erros JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Errors): cada mensagem explicada
- [Node.js · Common system errors](https://nodejs.org/api/errors.html#common-system-errors) (ENOENT, EACCES...)

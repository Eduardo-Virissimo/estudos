---
nivel: escrito
revisado:
---

# Modularização

> *"Arquivo de 2.000 linhas não é um programa. É um esconderijo de bugs."*

> [!tip] ⚡ Em 30 segundos
> **Modularizar** é dividir o código em partes pequenas, cada uma com **uma responsabilidade**: funções que fazem uma coisa, arquivos que agrupam o que é do mesmo assunto. Cada módulo esconde seus detalhes e expõe só o necessário (a sua "interface"). Resultado: dá pra entender, testar e mudar uma parte sem quebrar as outras. A sintaxe (`import`/`export`) vem em [[Módulos ES (import e export)]]; aqui é o **como dividir**.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Dividir um programa em módulos por responsabilidade (regras, entrada/saída, armazenamento)
- Decidir o que um módulo expõe e o que ele esconde
- Reconhecer sinais de que um arquivo ou função precisa ser dividido

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Escopo]]
- **Depois:** [[Módulos ES (import e export)]] · [[Responsabilidade Única]] · [[Organização de Pastas de um Projeto]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Um módulo = uma responsabilidade

Pergunte: **"por que motivo este código mudaria?"** Se há dois motivos diferentes, são dois módulos.

| Muda quando... | Módulo |
|---|---|
| a regra do negócio muda (como calcular XP) | `regras.ts` |
| o jeito de mostrar muda (terminal → web) | `interface.ts` |
| o jeito de guardar muda (JSON → banco) | `armazenamento.ts` |

### 2. Interface pública × detalhes escondidos

```ts
// armazenamento.ts
const ARQUIVO = "tarefas.json";        // detalhe: ninguém de fora precisa saber

function caminho() { return `./dados/${ARQUIVO}`; } // detalhe

export function salvar(dados: unknown) { /* usa caminho() */ }   // público
export function carregar(): unknown { /* ... */ }                // público
```

Quem usa só conhece `salvar` e `carregar`. Se amanhã trocar JSON por banco, **ninguém mais muda**.

### 3. Dependências em uma direção

```text
main.ts  ──►  interface.ts  ──►  regras.ts
   │                               ▲
   └──────►  armazenamento.ts ─────┘ (só tipos)
```

As **regras** não importam a interface nem o armazenamento. Assim você testa as regras sem terminal e sem arquivo. Ciclo de import (A importa B que importa A) é sinal de divisão errada.

### 4. Sinais de que precisa dividir

- Arquivo com mais de ~300 linhas, ou função com mais de ~30.
- Você rola a tela procurando onde está a coisa.
- Nome genérico: `utils.ts`, `helpers.ts`, `coisas.ts` com 40 funções sem relação.
- Pra mudar uma regra, você mexe em 5 lugares.

### 5. Não exagere

10 arquivos de 5 linhas também atrapalham. Comece com um arquivo; divida **quando doer**. Modularização boa nasce de refatorar ([[Refatoração]]), não de prever.

---

## 🛠️ Exemplo guiado

Um programa de notas escolares, antes e depois:

```text
antes: notas.ts (180 linhas)
  lê do teclado, valida, calcula média, decide aprovação, formata, salva em arquivo

depois:
  src/
    notas.ts        → calcularMedia(), situacao()        ← regras puras
    validacao.ts    → validarNota()                       ← regras de entrada
    terminal.ts     → perguntarNotas(), mostrar()         ← entrada/saída
    arquivo.ts      → salvarHistorico(), lerHistorico()   ← armazenamento
    main.ts         → junta tudo (10 linhas)
```

```ts
// main.ts: só orquestra, não tem regra nenhuma
import { perguntarNotas, mostrar } from "./terminal.js";
import { calcularMedia, situacao } from "./notas.js";
import { salvarHistorico } from "./arquivo.js";

const notas = await perguntarNotas();
const media = calcularMedia(notas);
mostrar(media, situacao(media));
await salvarHistorico(notas, media);
```

Ler o `main` conta a história do programa em 5 linhas.

---

## 🔧 Pegadinhas

- **`utils.ts` virando lixeira.** Se a função é de datas, vai pra `datas.ts`. "Utilitário" não é responsabilidade.
- **Regras importando `console`/`fs`.** Aí não dá pra testar sem terminal. Regras recebem dados e retornam dados.
- **Exportar tudo.** Exporte só o que outros módulos usam; o resto fica privado e livre pra mudar.
- **Dividir cedo demais.** Separar antes de entender o problema cria fronteiras erradas. Divida quando o arquivo começar a doer.

---

## 🔨 Desafio prático

**Objetivo:** pegar um programa seu (o quiz de [[Entrada e Saída]] ou o jogo de [[Estruturas de Repetição]]) e modularizar.

1. Liste cada coisa que ele faz e classifique: regra, entrada/saída ou armazenamento.
2. Separe em pelo menos 3 arquivos.
3. Garanta que o arquivo de regras **não** tem `console.log`, `readline` nem `process`.
4. O `main.ts` deve ter menos de 20 linhas.

**Pronto quando:** o programa funciona igual e você consegue apagar o arquivo de terminal e chamar as regras de outro arquivo sem erro.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Que pergunta ajuda a decidir como dividir o código em módulos?
> "Por que motivo este código mudaria?" Cada motivo diferente (regra, interface, armazenamento) merece seu módulo.

> [!question]- O que um módulo deve exportar?
> Só o que outros módulos precisam usar (a interface pública). Os detalhes ficam escondidos e podem mudar sem afetar ninguém.

> [!question]- Por que o módulo de regras não deve usar `console.log` ou `fs`?
> Pra poder ser testado e reusado sem terminal nem arquivo: recebe dados e devolve dados.

> [!question]- Cite dois sinais de que um arquivo precisa ser dividido.
> Ficou grande demais (centenas de linhas), tem nome genérico como `utils`, ou uma mudança simples exige mexer em vários pontos dele.

> [!question]- Qual o papel do `main`?
> Orquestrar: chamar os módulos na ordem certa, sem conter regras de negócio.

---

## 📋 Cola rápida

| Ideia | Na prática |
|---|---|
| Uma responsabilidade | um motivo pra mudar por módulo |
| Interface pública | `export` só o necessário |
| Esconder detalhes | constantes e helpers sem `export` |
| Dependência numa direção | regras não importam terminal/arquivo |
| `main` fino | só orquestra |

---

## 🛠️ Exemplo meu

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

- [javascript.info · Modules](https://javascript.info/modules-intro)
- *A Philosophy of Software Design* (John Ousterhout): capítulos sobre "deep modules", o melhor texto sobre esconder complexidade

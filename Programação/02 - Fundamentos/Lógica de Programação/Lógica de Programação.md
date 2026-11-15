---
nivel: escrito
revisado:
---

# Lógica de Programação

> *"Primeiro resolva o problema. Depois escreva o código."* (John Johnson)

> [!tip] ⚡ Em 30 segundos
> O computador não "entende" o que você quer: ele segue **passos exatos, um de cada vez**. Lógica de programação é quebrar um problema em passos pequenos e sem ambiguidade (um **algoritmo**) e escrever isso em **pseudocódigo** antes de pensar em linguagem. Quem trava no código quase sempre travou aqui.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Quebrar um problema do dia a dia em passos que um computador conseguiria seguir
- Escrever a solução em pseudocódigo com entrada, processamento e saída
- Testar um algoritmo "de cabeça" (teste de mesa) antes de programar

---

## 🧭 Onde isso se encaixa

- **Antes:** nada. Este é o primeiro passo.
- **Depois:** [[Variáveis e Tipos de Dados]] · [[Estruturas Condicionais]] · [[Estruturas de Repetição]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Algoritmo = receita sem ambiguidade

Um algoritmo é uma sequência **finita** de passos **claros** que resolve um problema. "Coloque sal a gosto" não é algoritmo: o computador não sabe o que é "a gosto". "Coloque 5 g de sal" é.

### 2. Entrada → Processamento → Saída

Quase todo programa tem as três partes. Antes de codar, responda:

| Pergunta | Exemplo: calcular média de 3 notas |
|---|---|
| **Entrada:** o que eu recebo? | 3 números |
| **Processamento:** o que eu faço com isso? | somar e dividir por 3 |
| **Saída:** o que eu devolvo? | a média, e se passou (≥ 7) |

### 3. Pseudocódigo

Português estruturado, sem se preocupar com sintaxe:

```text
INÍCIO
  LER nota1, nota2, nota3
  media ← (nota1 + nota2 + nota3) / 3
  SE media >= 7 ENTÃO
    MOSTRAR "Aprovado com", media
  SENÃO
    MOSTRAR "Reprovado com", media
  FIM SE
FIM
```

Só depois disso você traduz para a linguagem. A tradução é a parte fácil.

### 4. As 3 estruturas que montam qualquer programa

1. **Sequência:** um passo depois do outro.
2. **Decisão:** `SE ... ENTÃO ... SENÃO` → vira [[Estruturas Condicionais]].
3. **Repetição:** `ENQUANTO ... FAÇA` → vira [[Estruturas de Repetição]].

Todo algoritmo, por mais complexo, é combinação dessas três.

### 5. Teste de mesa

Execute o algoritmo **no papel**, anotando o valor de cada variável a cada passo. É o debugger mais barato que existe.

| Passo | nota1 | nota2 | nota3 | media | Saída |
|---|---|---|---|---|---|
| ler | 8 | 6 | 7 | – | – |
| calcular | 8 | 6 | 7 | 7 | – |
| decidir | 8 | 6 | 7 | 7 | "Aprovado com 7" |

---

## 🛠️ Exemplo guiado

**Problema:** descobrir se um ano é bissexto.

1. **Regra (do mundo real):** divisível por 4, **exceto** os divisíveis por 100, **a menos que** também sejam divisíveis por 400.
2. **Pseudocódigo:**

```text
LER ano
SE (ano divisível por 400) ENTÃO bissexto
SENÃO SE (ano divisível por 100) ENTÃO não bissexto
SENÃO SE (ano divisível por 4) ENTÃO bissexto
SENÃO não bissexto
```

3. **Teste de mesa** com casos que quebram regras: 2024 (sim), 1900 (não), 2000 (sim), 2023 (não).
4. **Só agora o código** (TypeScript):

```ts
const ano = 1900;
const bissexto = ano % 400 === 0 || (ano % 4 === 0 && ano % 100 !== 0);
console.log(bissexto); // false
```

> Repare: os **casos de teste** vieram antes do código. Isso é a semente de [[TDD (Test Driven Development)|TDD]].

---

## 🔧 Pegadinhas

- **Pular direto pro código.** Se você não consegue explicar a solução em português, o código não vai sair. Escreva o pseudocódigo primeiro.
- **Testar só o caso feliz.** O bug mora nas bordas: zero, número negativo, lista vazia, o maior valor possível. Sempre teste 1 caso normal + 2 casos de borda.
- **Passos vagos.** "Organizar a lista" não é um passo; "comparar cada par e trocar se estiver fora de ordem" é.
- **Achar que lógica é dom.** É treino. Os primeiros 20 problemas doem; do 50º em diante você reconhece padrões.

---

## 🔨 Desafio prático

**Objetivo:** escrever 3 algoritmos em pseudocódigo e fazer o teste de mesa de cada um. Sem computador.

1. **Troco:** dado o valor da compra e o valor pago, diga o troco e se o dinheiro foi suficiente.
2. **Maior de três:** receba 3 números e mostre o maior (sem usar "máximo" pronto).
3. **Tabuada:** receba um número e mostre a tabuada dele de 1 a 10.

**Pronto quando:** cada um tem entrada/processamento/saída escritos, pseudocódigo e um teste de mesa com pelo menos um caso de borda (ex: pagou exatamente o valor; dois números iguais).

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- O que é um algoritmo?
> Uma sequência finita de passos claros e sem ambiguidade que resolve um problema.

> [!question]- Quais são as três partes de quase todo programa?
> Entrada (o que recebo), processamento (o que faço) e saída (o que devolvo).

> [!question]- Quais são as três estruturas básicas que formam qualquer algoritmo?
> Sequência, decisão (se/senão) e repetição (enquanto/para).

> [!question]- Pra que serve o pseudocódigo?
> Pra pensar na solução sem brigar com a sintaxe da linguagem. Se o pseudocódigo está certo, traduzir pro código é fácil.

> [!question]- O que é teste de mesa?
> Executar o algoritmo no papel, anotando o valor de cada variável a cada passo, pra achar erros antes de programar.

> [!question]- Por que testar casos de borda?
> Porque os bugs aparecem nos extremos (zero, vazio, negativo, valores iguais), não no caso normal.

---

## 📋 Cola rápida

| Pseudocódigo | Vira em código |
|---|---|
| `LER x` | entrada (`process.argv`, `readline`) |
| `MOSTRAR x` | `console.log(x)` |
| `x ← 5` | `let x = 5` |
| `SE ... ENTÃO ... SENÃO` | `if (...) { } else { }` |
| `ENQUANTO cond FAÇA` | `while (cond) { }` |
| `PARA i DE 1 ATÉ 10` | `for (let i = 1; i <= 10; i++) { }` |

---

## 🛠️ Exemplo meu

> Um algoritmo que **você** escreveu pra um problema seu (ex: dividir a conta do bar, calcular XP pra subir de nível).

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

- [Beecrowd](https://judge.beecrowd.com/): centenas de problemas de lógica em português, com correção automática
- [Exercism · trilha JavaScript](https://exercism.org/tracks/javascript): exercícios curtos com mentoria gratuita
- *Lógica de Programação* (André Forbellone): o clássico brasileiro de pseudocódigo

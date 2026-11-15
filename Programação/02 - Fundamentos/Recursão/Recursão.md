---
nivel: escrito
revisado:
---

# Recursão

> *"Pra entender recursão, você primeiro precisa entender recursão."*

> [!tip] ⚡ Em 30 segundos
> **Recursão** é uma função que chama a si mesma pra resolver uma versão **menor** do mesmo problema. Toda função recursiva precisa de duas partes: o **caso base** (quando parar) e o **passo recursivo** (chamar de novo com um problema menor). Sem caso base, ela chama a si mesma até estourar a memória (*stack overflow*). Brilha em estruturas que contêm a si mesmas: pastas dentro de pastas, árvores, menus aninhados.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Identificar o caso base e o passo recursivo de um problema
- Escrever uma função recursiva e rastrear as chamadas na pilha
- Decidir quando recursão é melhor que um laço (e quando não é)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Escopo]]
- **Depois:** [[Pilhas]] · [[Árvore Binária]] · [[Divide and Conquer]] · [[Backtracking]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. As duas partes obrigatórias

```ts
function contagemRegressiva(n: number): void {
  if (n === 0) {              // 1. CASO BASE: para aqui
    console.log("🚀 Decolar!");
    return;
  }
  console.log(n);
  contagemRegressiva(n - 1);  // 2. PASSO: mesmo problema, menor
}
contagemRegressiva(3); // 3, 2, 1, 🚀 Decolar!
```

Pergunta pra montar qualquer recursão: **"se eu já soubesse resolver o problema um pouco menor, como resolveria este?"**

### 2. Recursão que retorna valor

```ts
function fatorial(n: number): number {
  if (n <= 1) return 1;          // caso base
  return n * fatorial(n - 1);    // 5! = 5 × 4!
}
```

### 3. A pilha de chamadas

Cada chamada espera a próxima terminar. O computador empilha:

```text
fatorial(4)
  └ 4 * fatorial(3)
        └ 3 * fatorial(2)
              └ 2 * fatorial(1)
                    └ 1            ← caso base, começa a voltar
              └ 2 * 1 = 2
        └ 3 * 2 = 6
  └ 4 * 6 = 24
```

Isso é uma [[Pilhas|pilha]] (*call stack*). Se ela crescer demais (milhares de chamadas, ou sem caso base) dá `RangeError: Maximum call stack size exceeded`.

### 4. Onde recursão é a escolha natural

Quando o dado **contém a si mesmo**:

```ts
type Pasta = { nome: string; arquivos: number; subpastas: Pasta[] };

function contarArquivos(pasta: Pasta): number {
  let total = pasta.arquivos;
  for (const sub of pasta.subpastas) total += contarArquivos(sub);
  return total; // caso base implícito: pasta sem subpastas não chama de novo
}
```

Com laço, você teria que controlar uma pilha à mão. Com recursão, o código fica do formato do dado.

### 5. Recursão × laço

| Use recursão | Use laço |
|---|---|
| árvores, pastas, JSON aninhado, grafos | listas e contagens simples |
| problema que se divide ao meio ([[Merge Sort]]) | quando a profundidade pode ser enorme |
| testar combinações ([[Backtracking]]) | quando a versão em laço é igualmente clara |

Fatorial e contagem são ótimos pra **aprender**, mas na prática um `for` resolve melhor.

---

## 🛠️ Exemplo guiado

Fibonacci, e o perigo de recalcular:

```ts
function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
fib(40); // demora segundos: fib(38) é calculado 2 vezes, fib(37) 3 vezes...
```

Guardando o que já calculou ([[Memoization]]):

```ts
function fibRapido(n: number, memo = new Map<number, number>()): number {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const r = fibRapido(n - 1, memo) + fibRapido(n - 2, memo);
  memo.set(n, r);
  return r;
}
fibRapido(40); // instantâneo
```

Essa ideia vira [[Programação Dinâmica]] no Estágio 2.

---

## 🔧 Pegadinhas

- **Sem caso base, ou caso base que nunca chega.** `fatorial(-1)` com `if (n === 1)` nunca para. Use `n <= 1`.
- **Esquecer o `return` na chamada recursiva.** `fatorial(n - 1)` sem `return n * ...` perde o resultado.
- **Problema que não diminui.** Chamar `f(n)` dentro de `f(n)` é laço infinito com outro nome.
- **Recalcular a mesma coisa.** Fibonacci ingênuo é exponencial. Se a mesma chamada se repete, memorize.
- **Profundidade enorme.** Lista com 100 mil itens percorrida por recursão estoura a pilha. Use laço.

---

## 🔨 Desafio prático

**Objetivo:** três recursões, do simples ao útil.

1. `somarAte(n)`: soma de 1 até n (`somarAte(4)` → 10).
2. `inverterTexto(t)`: o primeiro caractere vai pro fim do inverso do resto.
3. `achatar(lista)`: transforma `[1, [2, [3, 4]], 5]` em `[1, 2, 3, 4, 5]` (dica: `Array.isArray`).

Pra cada uma, escreva **antes** em 1 linha: qual é o caso base e como o problema diminui.

**Pronto quando:** as três funcionam, incluindo os casos de borda (`somarAte(0)`, `inverterTexto("")`, `achatar([])`).

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quais são as duas partes obrigatórias de uma função recursiva?
> O caso base (a condição em que ela para sem chamar a si mesma) e o passo recursivo (chamar a si mesma com um problema menor).

> [!question]- O que causa "Maximum call stack size exceeded"?
> Chamadas demais empilhadas: normalmente falta caso base, o problema não diminui, ou a profundidade é grande demais.

> [!question]- Quando recursão é melhor que um laço?
> Quando o dado tem estrutura aninhada que contém a si mesma: árvores, pastas, JSON, grafos, divisão e conquista.

> [!question]- Por que o Fibonacci recursivo ingênuo é lento?
> Porque recalcula os mesmos valores muitas vezes; o número de chamadas cresce exponencialmente. Memoization resolve.

> [!question]- O que é a pilha de chamadas (call stack)?
> A estrutura onde o programa guarda cada chamada de função que ainda não terminou; a última que entrou é a primeira a sair.

---

## 📋 Cola rápida

| Parte | Exemplo |
|---|---|
| Caso base | `if (n <= 1) return 1;` |
| Passo recursivo | `return n * f(n - 1);` |
| Percorrer aninhado | `for (const filho of no.filhos) total += f(filho);` |
| Memoization | `if (memo.has(n)) return memo.get(n)!;` |
| Erro típico | `RangeError: Maximum call stack size exceeded` |

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

- [javascript.info · Recursion and stack](https://javascript.info/recursion)
- [Visualgo · Recursion Tree](https://visualgo.net/en/recursion): veja a árvore de chamadas sendo montada

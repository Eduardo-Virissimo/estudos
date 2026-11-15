---
nivel: escrito
revisado:
---

# Funções

> *"Uma função deve fazer uma coisa. Deve fazê-la bem. Deve fazer somente ela."* (Robert C. Martin)

> [!tip] ⚡ Em 30 segundos
> Uma **função** é um bloco de código com nome que você escreve uma vez e chama quantas vezes quiser. Ela recebe **parâmetros** (a entrada), executa uma tarefa e **retorna** um valor (a saída). Em TypeScript você declara o tipo de cada parâmetro e do retorno, e o compilador avisa se alguém chamar errado. Função pequena, com nome claro e sem efeitos escondidos, é a base de código bom.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Declarar funções com `function` e com arrow function, com tipos nos parâmetros e no retorno
- Usar parâmetros opcionais, valores padrão e retornar mais de um valor (objeto)
- Explicar a diferença entre retornar um valor e mostrar na tela, e entre função pura e com efeito colateral

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Estruturas Condicionais]] · [[Estruturas de Repetição]]
- **Depois:** [[Escopo]] · [[Recursão]] · [[Modularização]] · [[Funções Puras]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Declarando e chamando

```ts
function somar(a: number, b: number): number {
  return a + b;
}

const total = somar(2, 3); // 5
```

- `a` e `b` são **parâmetros** (na definição); `2` e `3` são **argumentos** (na chamada).
- `: number` depois do `)` é o **tipo do retorno**.

### 2. Arrow function

```ts
const dobrar = (n: number): number => n * 2;   // retorno implícito numa linha

const saudacao = (nome: string) => {
  const texto = `Olá, ${nome}`;
  return texto;                                 // com chaves, precisa de return
};
```

Use `function` pra funções "principais" com nome; arrow pra funções curtas e callbacks (`lista.map(n => n * 2)`).

### 3. `return` não é `console.log`

```ts
function media(a: number, b: number) {
  console.log((a + b) / 2);  // ❌ só mostra, devolve undefined
}
function media2(a: number, b: number) {
  return (a + b) / 2;        // ✅ devolve, quem chamou decide o que fazer
}
```

Função que **retorna** dá pra reusar, testar e combinar. `return` também **encerra** a função na hora.

### 4. Parâmetros opcionais e padrão

```ts
function cumprimentar(nome: string, saudacao = "Olá", emoji?: string): string {
  return `${saudacao}, ${nome}${emoji ?? ""}`;
}
cumprimentar("Ana");              // "Olá, Ana"
cumprimentar("Ana", "Oi", "👋");  // "Oi, Ana👋"
```

### 5. Retornando vários valores

```ts
function estatisticas(numeros: number[]) {
  const soma = numeros.reduce((acc, n) => acc + n, 0);
  return { soma, media: soma / numeros.length };
}
const { soma, media } = estatisticas([1, 2, 3]); // desestruturação
```

### 6. Muitos parâmetros? Use um objeto

```ts
// ❌ criarUsuario("Ana", 20, true, false) — o que é true? o que é false?
// ✅
function criarUsuario(opcoes: { nome: string; idade: number; admin?: boolean }) { /* ... */ }
criarUsuario({ nome: "Ana", idade: 20, admin: true });
```

Regra prática: mais de 3 parâmetros → objeto.

### 7. Função recebendo função (callback)

```ts
function repetir(vezes: number, acao: (i: number) => void) {
  for (let i = 0; i < vezes; i++) acao(i);
}
repetir(3, (i) => console.log(`volta ${i}`));
```

Isso é a base de `map`, `filter`, eventos e [[Promises]]. Aprofundamento em [[Higher Order Functions]].

### 8. Pura × efeito colateral

- **Pura:** mesma entrada → mesma saída, não mexe em nada fora (`somar`). Fácil de testar.
- **Com efeito colateral:** escreve arquivo, muda variável global, chama API, mostra na tela.

Programas precisam de efeitos, mas **separe**: calcule em funções puras e deixe os efeitos nas bordas (no `main`).

---

## 🛠️ Exemplo guiado

Refatorando código repetido em funções:

```ts
// antes: o mesmo cálculo copiado 3 vezes
// depois:
function calcularXp(minutos: number, dificuldade: "fácil" | "média" | "difícil"): number {
  const multiplicador = { fácil: 1, média: 1.5, difícil: 2 }[dificuldade];
  return Math.round(minutos * multiplicador);
}

function formatarXp(xp: number): string {
  return `${xp.toLocaleString("pt-BR")} XP`;
}

console.log(formatarXp(calcularXp(90, "difícil"))); // "180 XP"
```

Cada função faz **uma** coisa: uma calcula, outra formata. Dá pra testar cada uma sozinha.

---

## 🔧 Pegadinhas

- **Esquecer o `return`.** A função devolve `undefined` e o erro aparece longe dali. Declare o tipo do retorno: o TypeScript avisa.
- **Arrow com chaves sem `return`.** `n => { n * 2 }` devolve `undefined`. Sem chaves (`n => n * 2`) o retorno é implícito.
- **Chamar sem os parênteses.** `const x = somar` guarda a função, não o resultado. `somar(1, 2)` chama.
- **Função que faz tudo.** Se o nome precisa de "e" (`lerEValidarESalvar`), divida.
- **Mudar o parâmetro objeto.** Alterar `opcoes.nome` dentro da função altera o objeto de quem chamou. Crie uma cópia (`{ ...opcoes }`).

---

## 🔨 Desafio prático

**Objetivo:** uma mini biblioteca de funções de texto, sem usar métodos prontos equivalentes.

1. `contarVogais(texto: string): number`
2. `inverter(texto: string): string` (com laço, sem `.reverse()`)
3. `ehPalindromo(texto: string): boolean` (reusando `inverter`, ignorando maiúsculas e espaços)
4. `resumo(texto: string)` que retorna `{ letras, vogais, palindromo }` usando as três (`letras` não conta espaços).

**Pronto quando:** `resumo("Ame a ema")` retorna `{ letras: 7, vogais: 5, palindromo: true }`, nenhuma função tem `console.log` dentro, e todas têm tipo de retorno declarado.

---

## 🚀 Projeto

> [!example] O núcleo do gerenciador de tarefas
> O projeto do Estágio 1 ([[Gerenciador de Tarefas no Terminal]]) começa aqui: as regras do programa como funções puras, sem terminal nem arquivo ainda.
>
> **Tempo:** 1 sessão

**O mínimo:**
- [ ] Um tipo `Tarefa` com `id`, `titulo` e `concluida`
- [ ] `adicionar(tarefas, titulo)` que **retorna uma lista nova** (não altera a original)
- [ ] `concluir(tarefas, id)` e `remover(tarefas, id)`, também retornando listas novas
- [ ] `formatar(tarefas)` que devolve o texto pronto pra mostrar (`[x] 1. Estudar`)
- [ ] Um `main` que chama tudo e só ele usa `console.log`

**Se quiser ir além:**
- `adicionar` recusa título vazio ou repetido
- `estatisticas(tarefas)` com total, concluídas e porcentagem

**Pronto quando:** o `main` adiciona 3 tarefas, conclui uma, remove outra e mostra a lista certa, e nenhuma função além do `main` tem `console.log`.

> Terminou? Mude `nivel` para `projeto` e conte no 📓 Diário de bordo onde travou.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre parâmetro e argumento?
> Parâmetro é o nome na definição da função (`a` em `function f(a)`); argumento é o valor passado na chamada (`5` em `f(5)`).

> [!question]- Qual a diferença entre `return` e `console.log` dentro de uma função?
> `return` devolve o valor pra quem chamou (dá pra reusar); `console.log` só mostra na tela e a função devolve `undefined`.

> [!question]- Por que `n => { n * 2 }` retorna `undefined`?
> Com chaves, a arrow function precisa de `return` explícito. Sem chaves (`n => n * 2`) o retorno é implícito.

> [!question]- Quando trocar vários parâmetros por um objeto?
> Quando são mais de 3 ou quando há booleanos soltos: `f({ nome, admin: true })` diz o que cada valor significa.

> [!question]- O que é uma função pura?
> Uma função que, pra mesma entrada, sempre dá a mesma saída e não altera nada fora dela.

> [!question]- O que é um callback?
> Uma função passada como argumento pra outra função, que a chama depois (ex: a função dentro de `lista.map(...)`).

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `function f(a: T): R { return x }` | declaração |
| `const f = (a: T): R => x` | arrow, retorno implícito |
| `(a = 10)` | valor padrão |
| `(a?: T)` | parâmetro opcional |
| `return { x, y }` | vários valores |
| `const { x, y } = f()` | desestruturar o retorno |
| `(cb: (n: number) => void)` | parâmetro que é função |

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

- [MDN · Funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
- [TypeScript Handbook · More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

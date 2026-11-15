---
nivel: escrito
revisado:
---

# Estruturas Condicionais

> *"Todo `if` é uma pergunta. Faça perguntas claras."*

> [!tip] ⚡ Em 30 segundos
> Condicionais deixam o programa **tomar decisões**: `if` executa um bloco quando a condição é verdadeira, `else` quando não é, `else if` encadeia alternativas e `switch` escolhe entre muitos valores fixos. O segredo de condicional legível é o **retorno antecipado** (*early return*): tratar os casos de erro primeiro e deixar o caminho feliz sem aninhamento.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever decisões com `if`, `else if` e `else` na ordem certa
- Escolher entre `if`, `switch`, ternário e um objeto de consulta (*lookup*)
- Reescrever `if`s aninhados usando retorno antecipado

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Operadores e Expressões]] · [[Entrada e Saída]]
- **Depois:** [[Estruturas de Repetição]] · [[Funções]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. `if` / `else if` / `else`

```ts
const nota = 8.5;

if (nota >= 9) {
  console.log("A");
} else if (nota >= 7) {
  console.log("B");
} else if (nota >= 5) {
  console.log("C");
} else {
  console.log("Reprovado");
}
```

Testa **de cima pra baixo** e para no primeiro verdadeiro. Por isso a ordem importa: se `nota >= 5` viesse primeiro, quem tirou 10 ganharia "C".

### 2. Combinando condições

```ts
if (idade >= 18 && temDocumento) { /* entra */ }
if (ehAdmin || ehDono) { /* pode editar */ }
if (!estaLogado) { /* manda pro login */ }
```

### 3. `switch`: muitos valores fixos

```ts
switch (comando) {
  case "add":
    adicionar();
    break;          // sem break, "cai" no próximo case
  case "list":
  case "ls":        // dois valores, mesma ação
    listar();
    break;
  default:
    console.error(`Comando desconhecido: ${comando}`);
}
```

`switch` compara com `===`. Serve pra valores exatos, não pra faixas (`> 7`).

### 4. Objeto de consulta: o `switch` sem `switch`

Quando cada caso só devolve um valor, um objeto é mais curto e fácil de estender:

```ts
const emojiPorNivel: Record<string, string> = {
  escrito: "📝",
  praticado: "🔨",
  projeto: "🚀",
};
const emoji = emojiPorNivel[nivel] ?? "❓";
```

### 5. Retorno antecipado (*guard clauses*)

```ts
// ❌ "pirâmide do mal"
function sacar(conta, valor) {
  if (conta) {
    if (valor > 0) {
      if (conta.saldo >= valor) {
        conta.saldo -= valor;
        return "ok";
      } else { return "saldo insuficiente"; }
    } else { return "valor inválido"; }
  } else { return "conta não existe"; }
}

// ✅ trata os problemas primeiro, caminho feliz no fim
function sacar(conta, valor) {
  if (!conta) return "conta não existe";
  if (valor <= 0) return "valor inválido";
  if (conta.saldo < valor) return "saldo insuficiente";

  conta.saldo -= valor;
  return "ok";
}
```

---

## 🛠️ Exemplo guiado

Calcular o frete de uma loja:

```ts
function calcularFrete(valorCompra: number, estado: string, ehPremium: boolean): number {
  if (valorCompra <= 0) throw new Error("Compra inválida");
  if (ehPremium || valorCompra >= 200) return 0;     // frete grátis

  const fretePorRegiao: Record<string, number> = { SP: 15, RJ: 18, MG: 18 };
  return fretePorRegiao[estado] ?? 30;               // outros estados: 30
}

console.log(calcularFrete(250, "BA", false)); // 0
console.log(calcularFrete(100, "SP", false)); // 15
console.log(calcularFrete(100, "AM", false)); // 30
```

Nenhum `else`, nenhum aninhamento, e adicionar um estado novo é mexer em uma linha.

---

## 🔧 Pegadinhas

- **Ordem errada no `else if`.** Teste da condição mais específica pra mais geral.
- **Esquecer o `break` no `switch`.** O código "cai" no próximo `case`. O [[Linter]] avisa (`no-fallthrough`).
- **`if (x = 5)`.** Atribuição, não comparação. Use `===`.
- **Comparar float com `===`.** `0.1 + 0.2 === 0.3` é `false`. Compare com margem ou use inteiros.
- **`if` com `return true`/`false`.** `if (idade >= 18) return true; else return false;` é só `return idade >= 18;`.

---

## 🔨 Desafio prático

**Objetivo:** um classificador de senha.

1. Escreva `forcaSenha(senha: string): string` que devolve `"fraca"`, `"média"` ou `"forte"`.
2. Regras: menos de 8 caracteres → fraca; 8+ com número **e** letra maiúscula → forte; o resto → média. (Dica: `/[0-9]/.test(senha)` e `/[A-Z]/.test(senha)`, veja [[Regex]].)
3. Use retorno antecipado, sem nenhum `else`.
4. Teste com `"abc"`, `"abcdefgh"`, `"Abcdefg1"` e `""`.

**Pronto quando:** os 4 casos dão o resultado certo e a função não tem nenhum `if` dentro de outro `if`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Por que a ordem dos `else if` importa?
> Porque eles são testados de cima pra baixo e o primeiro verdadeiro vence. Condições gerais antes das específicas escondem as específicas.

> [!question]- Quando usar `switch` em vez de `if`?
> Quando você compara uma mesma variável com vários valores exatos (comandos, status). Pra faixas (`> 7`), use `if`.

> [!question]- O que acontece se esquecer o `break` num `case`?
> A execução continua no próximo `case` (fall-through), executando código que não devia.

> [!question]- O que é retorno antecipado (guard clause)?
> Tratar os casos de erro no começo da função com `return`, deixando o caminho principal sem aninhamento.

> [!question]- Como simplificar `if (cond) return true; else return false;`?
> `return cond;`

> [!question]- Quando trocar um `switch` por um objeto de consulta?
> Quando cada caso só devolve um valor: `mapa[chave] ?? padrao` fica mais curto e fácil de estender.

---

## 📋 Cola rápida

| Sintaxe | Quando usar |
|---|---|
| `if (c) { } else { }` | decisão com 2 caminhos |
| `else if (c2)` | várias faixas em ordem |
| `switch (x) { case v: ...; break; }` | muitos valores exatos |
| `c ? a : b` | escolher entre 2 valores |
| `mapa[chave] ?? padrao` | valor por chave |
| `if (!ok) return` | retorno antecipado |

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

- [MDN · if...else](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) e [switch](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/switch)
- [Refactoring Guru · Replace Nested Conditional with Guard Clauses](https://refactoring.guru/replace-nested-conditional-with-guard-clauses)

---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Estruturas Condicionais

**Quanto focar: 🔥 essencial.** Todo programa toma decisões. Domine, e aprenda cedo a evitar `if` aninhado demais.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Pense em quantas decisões um caixa eletrônico toma antes de te entregar o dinheiro. O cartão é válido? A senha está certa? O valor é positivo? Tem saldo? Tem notas na máquina? Cada pergunta dessas leva a um caminho diferente: se a senha estiver errada, ele não pergunta o valor; se não tiver saldo, ele não conta as notas.

Programas são assim o tempo todo. As **estruturas condicionais** são o que deixa o programa **tomar decisões**: fazer uma coisa ou outra dependendo de uma condição. O `if` roda um bloco quando a condição é verdadeira, o `else if` encadeia alternativas, o `else` pega o que sobrou, e o `switch` escolhe entre muitos valores fixos.

Escrever um `if` é fácil, e você provavelmente já sabe. O que esta nota quer te ensinar é a parte difícil: **escrever condicionais que alguém consegue ler depois**. E o truque principal pra isso tem nome, **retorno antecipado**, e vai aparecer daqui a pouco. Ajuda já conhecer os [[Operadores e Expressões]].

## O primeiro verdadeiro vence

Uma nota vira conceito:

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

O JavaScript testa as condições **de cima pra baixo** e para no **primeiro** verdadeiro. Os outros nem são olhados. Com 8.5: é `>= 9`? Não. É `>= 7`? Sim. Mostra "B" e pula todo o resto.

Isso parece óbvio, mas tem uma consequência que pega muita gente: **a ordem importa**. Se o `nota >= 5` viesse primeiro, quem tirou 10 cairia nele e ganharia um "C", porque 10 também é maior ou igual a 5. A regra é ir **da condição mais específica pra mais geral**.

E um erro de digitação que todo mundo comete pelo menos uma vez: `if (x = 5)`. Com **um** igual só, isso não compara nada. Isso **atribui** 5 ao `x`, e como 5 é "verdadeiro", o `if` sempre entra. Comparação é com três iguais, `===`. O TypeScript e o [[Linter]] costumam te avisar, o que já é um bom motivo pra usar os dois.

## Mais de uma condição

Muitas decisões dependem de mais de uma coisa ao mesmo tempo, e pra isso existem três operadores:

```ts
if (idade >= 18 && temDocumento) { /* entra: as duas precisam ser verdade */ }
if (ehAdmin || ehDono) { /* pode editar: basta uma ser verdade */ }
if (!estaLogado) { /* manda pro login: inverte a condição */ }
```

`&&` é "E", `||` é "OU", e `!` é "NÃO". Quando a condição começa a ficar comprida, um truque simples deixa tudo mais legível: **dê um nome pra ela**.

```ts
const podeComprar = idade >= 18 && temCartao && !estaBloqueado;
if (podeComprar) { /* ... */ }
```

Quem lê o `if` entende na hora o que está sendo decidido, sem precisar decifrar a expressão.

E já que estamos falando de booleanos: repare que uma comparação **já é** um `true` ou `false`. Então isto aqui:

```ts
if (idade >= 18) return true; else return false;
```

é só um jeito comprido de escrever `return idade >= 18;`.

## Retorno antecipado: o que mais muda o seu código

Se for guardar uma coisa desta nota, guarde esta. Olhe duas versões da mesma função, a do caixa eletrônico:

```ts
// ❌ a "pirâmide do mal": cada condição empurra o código pra direita
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

// ✅ trata os problemas primeiro, e o caminho feliz fica no fim
function sacar(conta, valor) {
  if (!conta) return "conta não existe";
  if (valor <= 0) return "valor inválido";
  if (conta.saldo < valor) return "saldo insuficiente";

  conta.saldo -= valor;
  return "ok";
}
```

As duas fazem exatamente a mesma coisa. Mas na primeira, pra saber qual mensagem corresponde a qual problema, você precisa contar chaves e casar cada `else` com o seu `if`, lá em cima. Na segunda, a função se lê como uma lista de checagens: "não tem conta? Para. Valor inválido? Para. Sem saldo? Para. Passou por tudo? Saca."

Cada um desses `if` com `return` se chama **guard clause**, cláusula de guarda: ele protege a entrada da função, como um segurança na porta. O que sobra no fim é o caminho normal, sem nenhum aninhamento.

Mais um exemplo, calculando frete:

```ts
function calcularFrete(valorCompra: number, estado: string, ehPremium: boolean): number {
  if (valorCompra <= 0) throw new Error("Compra inválida");
  if (ehPremium || valorCompra >= 200) return 0; // frete grátis

  const fretePorRegiao: Record<string, number> = { SP: 15, RJ: 18, MG: 18 };
  return fretePorRegiao[estado] ?? 30;           // outros estados: 30
}
```

Nenhum `else`, nenhum aninhamento. E adicionar um estado novo é mexer numa linha só.

## Muitos valores fixos: o switch

Quando você compara **a mesma variável** com vários valores exatos, uma escada de `else if` fica repetitiva. O `switch` organiza melhor:

```ts
switch (comando) {
  case "add":
    adicionar();
    break;          // sem break, "cai" no próximo case
  case "list":
  case "ls":        // dois valores, a mesma ação
    listar();
    break;
  default:
    console.error(`Comando desconhecido: ${comando}`);
}
```

O `switch` compara com `===`, então serve pra valores exatos (`"add"`, `3`), não pra faixas como `> 7`. O `default` é o "nenhum dos anteriores".

E repare nos `break`. Eles existem por causa de um comportamento esquisito, herdado da linguagem C: sem o `break`, depois de rodar o `case` certo, o código **continua rodando os `case` de baixo**, até achar um `break` ou chegar no fim. Isso se chama *fall-through*. Às vezes é útil (é o que permite o `"list"` e o `"ls"` dividirem a mesma ação), mas na maioria das vezes é bug. O linter tem uma regra só pra isso, a `no-fallthrough`.

Agora, quando cada caso só **devolve um valor**, existe um jeito ainda mais curto: um objeto de consulta.

```ts
const emojiPorNivel: Record<string, string> = {
  escrito: "📝",
  praticado: "🔨",
  projeto: "🚀",
};
const emoji = emojiPorNivel[nivel] ?? "❓"; // ?? = valor padrão se não achar
```

Adicionar um nível novo é adicionar uma linha no objeto. A regra pra escolher: use `switch` quando cada caso **faz** coisas diferentes; use um objeto quando cada caso só **é** um valor diferente.

Uma curiosidade que vai te salvar um dia: `0.1 + 0.2 === 0.3` dá `false` em JavaScript (e na maioria das linguagens). O computador guarda números decimais com pequenas imprecisões, e `0.1 + 0.2` vira `0.30000000000000004`. Pra dinheiro, trabalhe com centavos, em números inteiros. Pros outros casos, compare com uma margem: `Math.abs(a - b) < 0.0001`.

## O essencial

1. O primeiro `if` verdadeiro vence: do mais específico pro mais geral.
2. Comparação é `===`. Um `=` só atribui.
3. Trate os problemas primeiro, com `return` (guard clauses), e deixe o caminho normal no fim, sem aninhamento.
4. `switch` pra muitos valores exatos (não esqueça o `break`); objeto de consulta quando cada caso só é um valor.

## Agora é com você

Escreva um **classificador de senha**: uma função `forcaSenha(senha: string): string` que devolve `"fraca"`, `"média"` ou `"forte"`. As regras: menos de 8 caracteres é fraca; 8 ou mais, com número **e** letra maiúscula, é forte; o resto é média. Pra testar se tem número e maiúscula, use `/[0-9]/.test(senha)` e `/[A-Z]/.test(senha)` (a nota de [[Regex]] explica). A regra de ouro: retorno antecipado, sem nenhum `else`. Teste com `"abc"`, `"abcdefgh"`, `"Abcdefg1"` e `""`. Você terminou quando os 4 casos derem o resultado certo e a função não tiver nenhum `if` dentro de outro `if`.

Daqui, siga pras [[Estruturas de Repetição]] e pras [[Funções]].

---

## 🧠 Me teste

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

> [!question]+ `nota = 95`. O que este código mostra? `if (nota >= 60) "aprovado" else if (nota >= 90) "excelente"`
> - a) `excelente`
> - b) `aprovado`
> - c) Os dois
> - d) Nada
>
> > [!check]- Resposta
> > **b)** O primeiro `if` verdadeiro ganha e os outros nem são testados. Por isso a condição mais específica (`>= 90`) vem **antes**.

---

## Pra consultar depois

| Sintaxe | Quando usar |
|---|---|
| `if (c) { } else { }` | Decisão com 2 caminhos |
| `else if (c2)` | Várias faixas, em ordem |
| `switch (x) { case v: ...; break; }` | Muitos valores exatos |
| `c ? a : b` | Escolher entre 2 valores |
| `mapa[chave] ?? padrao` | Valor por chave |
| `if (!ok) return` | Retorno antecipado |

**Pra ler:** o artigo [Replace Nested Conditional with Guard Clauses](https://refactoring.guru/replace-nested-conditional-with-guard-clauses), do Refactoring Guru, mostra o retorno antecipado com um antes e depois ilustrado. A referência de [if...else](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) e [switch](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/switch) do MDN tira qualquer dúvida de sintaxe.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

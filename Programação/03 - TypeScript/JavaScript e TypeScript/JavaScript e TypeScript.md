---
nivel: escrito
revisado:
---

# JavaScript e TypeScript

> *"TypeScript é JavaScript que te avisa antes de você passar vergonha em produção."*

> [!tip] ⚡ Em 30 segundos
> **JavaScript** é a linguagem que roda no navegador e, com o [[Node.js]], no servidor e no terminal. **TypeScript** é JavaScript **com tipos**: você escreve `nome: string`, o compilador confere tudo antes de rodar e depois **apaga os tipos**, gerando JavaScript comum. Os tipos não existem em execução: eles servem pra pegar erros cedo e dar autocomplete no editor.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Explicar a relação entre JavaScript e TypeScript (superconjunto, compila pra JS)
- Explicar por que os tipos não existem quando o programa roda
- Mostrar um bug que o TypeScript pega e o JavaScript deixa passar

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Variáveis e Tipos de Dados]] · [[Funções]]
- **Depois:** [[Node.js]] · [[Configurando um Projeto TypeScript]] · [[Tipos Básicos do TypeScript]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que são?

**JavaScript** (JS) nasceu em **1995**, criado por Brendan Eich em 10 dias pro navegador Netscape. Hoje é a única linguagem que todo navegador executa nativamente, e com o Node.js roda em qualquer lugar. O padrão oficial se chama **ECMAScript** (ES2015, ES2024...).

**TypeScript** (TS) foi lançado pela Microsoft em **2012** (Anders Hejlsberg, o criador do C#). É um **superconjunto**: todo JavaScript válido é TypeScript válido; o TS só acrescenta a sintaxe de tipos.

---

## 🧱 O mínimo pra usar

### 1. O fluxo

```text
tarefas.ts  ──(tsc confere os tipos)──►  erros? para aqui
     │
     └──(remove os tipos)──►  tarefas.js  ──►  Node / navegador executa
```

```ts
// TypeScript
function saudar(nome: string): string {
  return `Olá, ${nome}`;
}
```

```js
// JavaScript gerado: os tipos somem
function saudar(nome) {
  return `Olá, ${nome}`;
}
```

### 2. O que o TypeScript pega

```ts
function calcularTotal(preco: number, quantidade: number) {
  return preco * quantidade;
}

calcularTotal("10", 2);
// ❌ TS: Argument of type 'string' is not assignable to parameter of type 'number'.
// Em JS puro, "10" * 2 dá 20 e funciona... até alguém passar "10,00" e dar NaN em produção.

const usuario = { nome: "Ana", email: "ana@x.com" };
usuario.emial;
// ❌ TS: Property 'emial' does not exist. Did you mean 'email'?
// Em JS puro: undefined, sem aviso nenhum.
```

### 3. Inferência: você não anota tudo

```ts
const nivel = 3;            // TS já sabe: number
const nomes = ["Ana", "Bia"]; // string[]
nomes.push(42);             // ❌ number não entra em string[]
```

Anote **parâmetros de função** e o que o TS não consegue adivinhar. O resto ele infere.

### 4. Tipos não existem em execução

```ts
function processar(id: number) { /* ... */ }
processar(JSON.parse('"abc"')); // compila (JSON.parse devolve any)... e quebra rodando
```

O TS confia no que você declara. Dado que vem **de fora** (teclado, arquivo, API) precisa ser **validado em execução**, porque o tipo é uma promessa, não uma verificação. É por isso que existe [[Validação com Zod]] mais pra frente.

### 5. Por que TypeScript virou padrão

- **Autocomplete de verdade** no [[VS Code]]: ele sabe quais propriedades e métodos existem.
- **Refatorar sem medo:** renomeia uma propriedade e o compilador mostra todos os lugares quebrados.
- **Documentação viva:** a assinatura `(id: number) => Promise<Tarefa>` já diz como usar.
- **Mercado:** a maioria dos projetos JS novos já nasce em TS.

---

## 🛠️ Exemplo guiado

Veja o TS pegando um bug na hora:

1. Crie `bug.ts`:
   ```ts
   type Tarefa = { titulo: string; concluida: boolean };
   const tarefas: Tarefa[] = [{ titulo: "Estudar", concluida: false }];

   function concluir(lista: Tarefa[], indice: number) {
     lista[indice].concluido = true; // erro de digitação
   }
   ```
2. No VS Code, `concluido` fica sublinhado: *Property 'concluido' does not exist on type 'Tarefa'. Did you mean 'concluida'?*
3. Renomeie o arquivo pra `bug.js` e apague o `type`: nenhum aviso. Rodando, ele cria uma propriedade nova `concluido` e a tarefa continua "não concluída". O bug passaria despercebido.

---

## 🔧 Pegadinhas

- **Achar que TS valida em execução.** Não valida. `as Tarefa` ou `any` desligam a checagem; dado externo precisa de validação real.
- **Usar `any` pra "fazer o erro sumir".** Você desliga o TypeScript exatamente onde ele ajudaria. Prefira `unknown` ([[Tipos Básicos do TypeScript]]).
- **Anotar tudo.** `const x: number = 5` é ruído. Deixe a inferência trabalhar.
- **Confundir TS com outra linguagem.** Tudo que vale em JS (falsy, `===`, `this`, assincronismo) continua valendo. Estudar TS **é** estudar JS.

---

## 🔨 Desafio prático

**Objetivo:** sentir a diferença na prática.

1. Escreva em `.js` uma função `aplicarDesconto(preco, porcentagem)` e chame com 4 entradas erradas: texto, `undefined`, porcentagem 150, argumentos trocados.
2. Rode e anote o que acontece em cada uma.
3. Copie pra `.ts`, adicione tipos e veja quais erros o TS pega **antes de rodar**.
4. Quais ele **não** pega? (dica: porcentagem 150 é um `number` válido)

**Pronto quando:** você tem uma lista do que o TS pegou e do que só uma validação em execução pegaria.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a relação entre TypeScript e JavaScript?
> TypeScript é um superconjunto do JavaScript: acrescenta tipos, é conferido pelo compilador e vira JavaScript comum pra rodar.

> [!question]- Os tipos do TypeScript existem quando o programa roda?
> Não. São apagados na compilação; servem só pra checar o código antes de rodar e pro editor.

> [!question]- Por que dados de fora (API, teclado) precisam de validação mesmo em TypeScript?
> Porque o TS confia no tipo declarado e não confere em execução; o dado real pode vir diferente.

> [!question]- O que é inferência de tipos?
> O TypeScript descobrir o tipo sozinho pelo valor (`const n = 5` é `number`), sem você anotar.

> [!question]- Cite duas vantagens práticas do TypeScript.
> Pega erros antes de rodar, autocomplete preciso, refatoração segura e assinaturas que documentam o código.

---

## 📋 Cola rápida

| Conceito | Resumo |
|---|---|
| Superconjunto | todo JS é TS válido |
| `tsc` | confere tipos e gera JS |
| Inferência | `const x = 5` → `number` |
| Tipos em execução | não existem |
| `any` | desliga a checagem (evite) |
| ECMAScript | o padrão oficial do JS |

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

- [TypeScript para programadores JavaScript](https://www.typescriptlang.org/pt/docs/handbook/typescript-in-5-minutes.html) (docs oficiais em português)
- [TypeScript Playground](https://www.typescriptlang.org/play): escreva TS e veja o JS gerado ao lado
- [javascript.info](https://javascript.info/): o melhor tutorial gratuito de JavaScript moderno

---
nivel: escrito
foco: essencial
revisado:
---

# JavaScript e TypeScript

**Quanto focar: 🔥 essencial.** É a sua linguagem principal. Entender o que o TypeScript adiciona ao JavaScript é a base de todo o resto.

Imagine um assistente sentado do seu lado enquanto você programa, lendo cada linha que você escreve. Você digita `usuario.emial`, e ele cutuca: "você quis dizer `email`?". Você chama uma função de preço passando o texto `"10"` no lugar do número 10, e ele avisa antes de você rodar. Ele não programa por você. Ele só não deixa passar os erros bobos que, sem ele, você só descobriria rodando, ou pior, quando um usuário reclamasse.

Esse assistente é o **TypeScript**. Pra entender o que ele é, comece pelo **JavaScript**: a linguagem que roda no navegador e, com o [[Node.js]], também no servidor e no terminal. O TypeScript é JavaScript **com tipos**. Você escreve `nome: string`, um programa chamado compilador confere tudo antes de rodar, e depois **apaga os tipos**, gerando JavaScript comum.

Ou seja: os tipos não existem quando o programa roda. Essa é a ideia mais importante da nota, e a que mais confunde, então ela vai ganhar uma seção só dela. E daí vem uma consequência boa: **estudar TypeScript é estudar JavaScript**, com um assistente que avisa dos erros. Ajuda já conhecer [[Variáveis e Tipos de Dados]] e [[Funções]].

## O caminho até rodar

Um arquivo TypeScript faz este caminho até ser executado:

```text
tarefas.ts  ──(tsc confere os tipos)──►  erros? para aqui
     │
     └──(remove os tipos)──►  tarefas.js  ──►  Node / navegador executa
```

Você escreve isto:

```ts
function saudar(nome: string): string {
  return `Olá, ${nome}`;
}
```

E o que roda de verdade é isto:

```js
function saudar(nome) {
  return `Olá, ${nome}`;
}
```

O `: string` sumiu. Ele só existiu pra o compilador conferir que ninguém chamaria `saudar(42)`.

Por que isso vale a pena? Olhe dois erros que o TypeScript pega:

```ts
function calcularTotal(preco: number, quantidade: number) {
  return preco * quantidade;
}

calcularTotal("10", 2);
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
// Em JS puro, "10" * 2 dá 20 e funciona... até alguém passar "10,00" e dar NaN em produção.

const usuario = { nome: "Ana", email: "ana@x.com" };
usuario.emial;
// ❌ Property 'emial' does not exist. Did you mean 'email'?
// Em JS puro: undefined, sem aviso nenhum.
```

Os dois seriam **silenciosos** em JavaScript: o programa roda, dá um resultado errado, e você só descobre bem depois. Com TypeScript, eles aparecem sublinhados em vermelho enquanto você digita.

E os ganhos não param nos erros. O [[VS Code]] passa a ter **autocomplete de verdade**, porque sabe quais propriedades e métodos cada valor tem. Você pode **refatorar sem medo**: renomeia uma propriedade, e o compilador lista todos os lugares que quebraram. A própria assinatura vira **documentação**: `(id: number) => Promise<Tarefa>` já diz como usar a função. E no **mercado**, a maioria dos projetos JavaScript novos já nasce em TypeScript.

Um mal-entendido comum é achar que o TypeScript é outra linguagem. Não é. Tudo o que vale em JavaScript continua valendo: o `===`, os valores truthy e falsy, o `this`, o assincronismo. O TypeScript só **acrescenta** os tipos; ele não muda em nada como o código roda.

## Os tipos somem quando o programa roda

Agora a ideia que mais confunde, e que mais importa. O TypeScript confere **o seu código**. Ele não confere **os dados** que chegam quando o programa está rodando. Olhe:

```ts
function processar(id: number) { /* ... */ }

processar(JSON.parse('"abc"')); // compila sem erro... e quebra rodando
```

Por que isso compila? Porque o `JSON.parse` devolve `any`, um tipo especial que desliga a checagem, e o TypeScript simplesmente acredita. E quando o programa roda, os tipos já foram apagados há muito tempo, e ninguém confere se `"abc"` é mesmo um número.

Pense assim: **o tipo é uma promessa, não uma verificação.** No seu próprio código, quem garante a promessa é o compilador, e ele é rigoroso. Mas um dado que vem **de fora** (do teclado, de um arquivo, de uma API) pode chegar de qualquer jeito, e o compilador nunca viu esse dado. Ele precisa ser **validado enquanto o programa roda**, com `if` e checagens, ou com bibliotecas feitas pra isso, como você vai ver em [[Validação com Zod]].

Daí vem uma tentação que vale evitar desde o primeiro dia. Quando o TypeScript reclama de alguma coisa e você não entende por quê, colocar um `any` faz o erro sumir. Mas ele não resolveu nada: só desligou a checagem justamente no lugar onde ela estava te ajudando. O erro continua lá, e agora vai aparecer rodando. Quando você realmente não souber o tipo, prefira o `unknown` ([[Tipos Básicos do TypeScript]] explica).

## Você não precisa anotar tudo

Uma surpresa boa: na maioria das vezes, o TypeScript **descobre o tipo sozinho**, pelo valor.

```ts
const nivel = 3;              // o TS já sabe: number
const nomes = ["Ana", "Bia"]; // string[]
nomes.push(42);               // ❌ number não entra em string[]
```

Você não escreveu tipo nenhum, e mesmo assim ele pegou o erro. Isso se chama **inferência**.

A regra prática: **anote os parâmetros das funções**, porque o TypeScript não tem como adivinhar o que vai chegar neles, e anote o que ele não consegue deduzir sozinho. O resto, deixe a inferência trabalhar. Escrever `const x: number = 5` é só ruído: o TypeScript já sabia que era um número. Anotação demais deixa o código mais longo sem ajudar em nada.

## Sentindo a diferença

Um teste rápido, que vale fazer agora. Crie um `bug.ts`:

```ts
type Tarefa = { titulo: string; concluida: boolean };
const tarefas: Tarefa[] = [{ titulo: "Estudar", concluida: false }];

function concluir(lista: Tarefa[], indice: number) {
  lista[indice].concluido = true; // erro de digitação
}
```

No VS Code, o `concluido` fica sublinhado na hora: *Property 'concluido' does not exist on type 'Tarefa'. Did you mean 'concluida'?*

Agora renomeie o arquivo pra `bug.js` e apague o `type`. Nenhum aviso. E se você rodar, o JavaScript simplesmente cria uma propriedade nova chamada `concluido`, e a tarefa continua "não concluída" pra sempre. O bug passaria despercebido, e você ficaria se perguntando por que o botão de concluir não funciona.

## O essencial

1. TypeScript é JavaScript com tipos. Tudo o que vale em JavaScript continua valendo.
2. O compilador confere os tipos e depois apaga eles. Quando o programa roda, os tipos não existem.
3. O tipo é uma promessa sobre o seu código. Dado que vem de fora precisa ser validado rodando.
4. `any` desliga a checagem: não use pra "fazer o erro sumir".
5. A inferência deduz a maioria dos tipos. Anote os parâmetros das funções.

## Agora é com você

Escreva em JavaScript puro, num `.js`, uma função `aplicarDesconto(preco, porcentagem)`, e chame ela com quatro entradas erradas: um texto, um `undefined`, uma porcentagem de 150, e os argumentos trocados de lugar. Rode, e anote o que acontece em cada uma. Depois copie pra um `.ts`, adicione os tipos, e veja quais erros o TypeScript pega **antes de rodar**. E a pergunta mais interessante: quais ele **não** pega? (Uma dica: 150 é um `number` perfeitamente válido.) Você terminou quando tiver uma lista do que o TypeScript pegou e do que só uma validação rodando pegaria.

Daqui, siga pro [[Node.js]], pro [[Configurando um Projeto TypeScript]] e pros [[Tipos Básicos do TypeScript]].

---

## 🧠 Me teste

> [!question]- Qual a relação entre TypeScript e JavaScript?
> TypeScript é um superconjunto do JavaScript: acrescenta tipos, é conferido pelo compilador e vira JavaScript comum pra rodar.

> [!question]- Os tipos do TypeScript existem quando o programa roda?
> Não. São apagados na compilação; servem só pra checar o código antes de rodar e pro editor.

> [!question]- Por que dados de fora (API, teclado) precisam de validação mesmo em TypeScript?
> Porque o TS confia no tipo declarado e não confere em execução; o dado real pode vir diferente.

> [!question]- O que é inferência de tipos?
> O TypeScript descobrir o tipo sozinho pelo valor (`const n = 5` é `number`), sem você anotar.

> [!question]- Por que usar `any` pra calar um erro é má ideia?
> Porque desliga a checagem justamente onde ela ajudaria; o erro continua e aparece rodando.

> [!question]- Cite duas vantagens práticas do TypeScript.
> Pega erros antes de rodar, autocomplete preciso, refatoração segura e assinaturas que documentam o código.

> [!question]+ Você tipou `const dados: Usuario = await resposta.json()`. Se a API mandar outro formato, o que acontece em tempo de execução?
> - a) O TypeScript lança um erro na hora
> - b) Nada avisa: os tipos somem quando o código roda
> - c) O campo errado vira `null`
> - d) O `json()` rejeita a Promise
>
> > [!check]- Resposta
> > **b)** Tipos só existem na compilação. Dado de fora (API, arquivo, teclado) precisa ser **validado** em tempo de execução, com checagens ou uma lib como Zod.

---

## Pra consultar depois

| Conceito | Resumo |
|---|---|
| Superconjunto | Todo JS é TS válido |
| `tsc` | Confere os tipos e gera JS |
| Inferência | `const x = 5` → `number` |
| Tipos em execução | Não existem |
| `any` | Desliga a checagem (evite) |
| ECMAScript | O padrão oficial do JavaScript |

**Pra ler e testar:** o guia [TypeScript para programadores JavaScript](https://www.typescriptlang.org/pt/docs/handbook/typescript-in-5-minutes.html), da documentação oficial, está em português e leva cinco minutos. O [TypeScript Playground](https://www.typescriptlang.org/play) deixa você escrever TypeScript e ver, ao lado, o JavaScript gerado: é a melhor forma de ver os tipos sumindo com os próprios olhos. E pro JavaScript em si, o [javascript.info](https://javascript.info/) é o melhor tutorial gratuito que existe.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

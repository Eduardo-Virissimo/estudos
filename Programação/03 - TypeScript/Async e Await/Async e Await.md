---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Async e Await

**Quanto focar: 🔥 essencial.** É como você vai escrever código assíncrono no dia a dia. Domine, incluindo o tratamento de erro com `try/catch`.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Na nota de [[Promises]], você aprendeu a lidar com coisas que demoram (ler um arquivo, chamar uma API) encadeando `.then`. Funciona, mas depois de três ou quatro passos o código começa a parecer uma escada de funções dentro de funções, e fica difícil de seguir. Ler o arquivo, depois transformar em JSON, depois filtrar, depois salvar, cada passo dentro do `.then` do anterior.

O `async` e o `await` são o jeito moderno de usar essas mesmas Promises, só que escrevendo um código que se lê **de cima pra baixo**, como qualquer código normal. Não é uma tecnologia nova: por baixo, são as mesmas Promises. É uma forma mais humana de escrever.

Três ideias resumem a nota. Uma função `async` **sempre devolve uma Promise**. Dentro dela, o `await` **pausa só aquela função** até o valor chegar, enquanto o resto do programa continua livre. E os erros viram exceções comuns, tratadas com `try/catch`. Tem também um cuidado que vale muito: um `await` atrás do outro deixa o programa lento quando as operações poderiam rodar juntas.

## Do .then pro await

Olhe a mesma função escrita dos dois jeitos:

```ts
import { readFile } from "node:fs/promises";

// com .then
function carregar() {
  return readFile("tarefas.json", "utf-8")
    .then((texto) => JSON.parse(texto))
    .catch(() => []);
}

// com async/await
async function carregar2() {
  try {
    const texto = await readFile("tarefas.json", "utf-8");
    return JSON.parse(texto);
  } catch {
    return [];
  }
}
```

A segunda se lê como uma receita: "leia o arquivo; depois transforme em JSON; se der erro, devolva uma lista vazia". O `await` quer dizer "espere esta Promise terminar e me dê o valor dela".

E é importante entender o "espere". O `await` pausa **só esta função**, não o programa. Lembra da lanchonete das [[Promises]], onde você pede, ganha uma senha, e espera ser chamado? O `await` é você esperando a sua senha. Mas a lanchonete continua atendendo todo mundo, e o programa continua respondendo a outras coisas. Nada trava.

## A regra que mais confunde

Se for guardar uma coisa desta nota, guarde esta: **uma função `async` sempre devolve uma Promise.** Mesmo quando parece que não:

```ts
async function dobro(n: number): Promise<number> {
  return n * 2;
}

const x = dobro(5);        // Promise<number> 😱
const y = await dobro(5);  // 10 ✅
```

A função só devolve `n * 2`, um número simples. Mas como ela é `async`, o resultado chega embrulhado numa Promise. Por isso quem chama **também** precisa de `await` pra abrir o embrulho e pegar o valor.

Isso tem uma consequência: o `async` "contagia" pra cima. Se uma função usa `await`, ela precisa ser `async`. E quem chama ela precisa de `await`, então também vira `async`. E assim por diante. As regras, juntas: o `await` só funciona **dentro de uma função `async`** (ou no topo de um módulo, como você vai ver adiante); uma função `async` **sempre** devolve uma Promise; e quem chama precisa de `await` pra pegar o valor.

E o erro que isso gera é traiçoeiro, porque muitas vezes ele **não dá erro**. Sem o `await`, o código segue em frente com uma Promise no lugar do valor. O caso mais perigoso: um `if (existe())` sem `await` é **sempre verdadeiro**. Por quê? Porque uma Promise é um objeto, e todo objeto é truthy. O seu código acha que o arquivo existe, mesmo quando não existe. A regra `no-floating-promises` do [[Linter]] (com typescript-eslint) existe justamente pra pegar isso, e vale ligar.

## Quando dá errado

Quando uma Promise falha (é **rejeitada**), o `await` transforma isso num erro comum, lançado naquela linha. E você trata como qualquer outro erro, com `try/catch`:

```ts
async function salvarSeguro(dados: unknown) {
  try {
    await writeFile("tarefas.json", JSON.stringify(dados, null, 2));
    console.log("Salvo!");
  } catch (erro) {
    // erro é unknown: confira antes de usar
    const msg = erro instanceof Error ? erro.message : String(erro);
    console.error(`Não consegui salvar: ${msg}`);
  } finally {
    console.log("Tentativa terminada");
  }
}
```

Repare no tipo do `erro`: ele é `unknown`. É que em JavaScript dá pra lançar qualquer coisa como erro, até um texto ou um número. Por isso o `instanceof Error` antes de ler o `.message`.

Agora, o conselho mais importante sobre erros: **trate só o erro que você espera, e deixe os outros subirem.**

```ts
async function carregar(): Promise<Tarefa[]> {
  try {
    return JSON.parse(await readFile("tarefas.json", "utf-8")) as Tarefa[];
  } catch (erro) {
    if (erro instanceof Error && "code" in erro && erro.code === "ENOENT") return []; // primeiro uso
    throw erro; // qualquer outro erro: deixa subir
  }
}
```

Na primeira vez que o programa roda, o arquivo não existe, e isso é **esperado**: vira uma lista vazia. Mas um JSON corrompido é um problema de verdade. Se você engolisse esse erro também, o programa ia achar que não tinha tarefa nenhuma, salvar uma lista vazia por cima, e você perderia tudo sem nenhum aviso.

Por isso, desconfie de um `catch {}` vazio. Ele esconde bugs: o programa segue como se nada tivesse acontecido, e o problema aparece bem depois, sem pista nenhuma.

E um detalhe técnico que pega até gente experiente: dentro de um `try`, escreva `return await x`, e não só `return x`. Sem o `await`, a Promise sai da função antes de terminar, e se ela falhar depois, o seu `catch` não está mais lá pra pegar.

## Um de cada vez, ou todos juntos

Este é o cuidado de desempenho. Olhe estas duas versões:

```ts
// ❌ 3 segundos: espera um terminar pra começar o outro
const a = await buscar("a");
const b = await buscar("b");
const c = await buscar("c");

// ✅ 1 segundo: começa os três e espera todos
const [a2, b2, c2] = await Promise.all([buscar("a"), buscar("b"), buscar("c")]);
```

Se cada busca demora um segundo, a primeira versão leva três: ela espera a primeira terminar pra só então começar a segunda. Como o `await` deixa o código tão parecido com código normal, é fácil esquecer que dava pra fazer as três ao mesmo tempo. O `Promise.all` começa todas juntas e espera todas terminarem.

Um `await` atrás do outro só faz sentido quando o próximo passo **depende** do anterior:

```ts
const usuario = await buscarUsuario(id);
const pedidos = await buscarPedidos(usuario.id); // precisa do usuário primeiro
```

Com laços, tem uma armadilha extra:

```ts
// ❌ forEach não espera: dispara tudo e segue em frente
arquivos.forEach(async (f) => { await processar(f); });
console.log("fim"); // aparece ANTES de processar

// ✅ um de cada vez (quando a ordem importa ou é pesado)
for (const f of arquivos) {
  await processar(f);
}

// ✅ todos juntos
await Promise.all(arquivos.map((f) => processar(f)));
```

Por que o `forEach` não espera? Ele chama a função pra cada item e simplesmente ignora o que ela devolve. Como a função é `async`, ela devolve uma Promise, e o `forEach` joga a Promise fora sem esperar.

## await fora de função

Em módulos ES (com `"type": "module"` no `package.json`), dá pra usar o `await` direto no arquivo, fora de qualquer função. Isso se chama *top-level await*:

```ts
const config = JSON.parse(await readFile("config.json", "utf-8"));
```

Em projetos mais antigos, que não permitem isso, o padrão é colocar tudo numa função `main`:

```ts
async function main() {
  // ... seu código com await
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
```

O `.catch` no fim garante que qualquer erro que ninguém tratou seja mostrado, e que o programa termine sinalizando falha.

Mais duas dicas rápidas. Pra não esperar pra sempre uma resposta que não vem, use um timeout: `await fetch(url, { signal: AbortSignal.timeout(5000) })` desiste depois de 5 segundos. E uma questão de estilo: misturar `.then` e `await` no mesmo trecho funciona, mas confunde quem lê. Escolha um.

## O essencial

1. `async` sempre devolve uma Promise. Quem chama precisa de `await`.
2. `await` pausa só aquela função, não o programa.
3. Esquecer o `await` muitas vezes não dá erro: dá um valor errado. Ligue o `no-floating-promises`.
4. Erros com `try/catch`: trate só o esperado e deixe o resto subir.
5. Operações independentes: `Promise.all`. E `forEach` não espera `async`.

## Agora é com você

Construa um **verificador de sites** no terminal. Ele recebe URLs por argumento (`npx tsx verificar.ts https://github.com https://naoexiste.tld`), faz um `fetch` em cada uma com timeout de 5 segundos e mede quanto tempo levou (`performance.now()`). Rode **todas em paralelo** com `Promise.allSettled`, que espera todas terminarem mesmo que algumas falhem. Mostre uma tabela com `console.table` (a URL, o status ou o erro, e o tempo em ms), e termine com código de saída `1` se alguma falhou. Você terminou quando, com 3 URLs, o tempo total for próximo do da mais lenta (e não a soma das três), e a URL inválida aparecer como erro sem derrubar as outras.

Daqui, siga pra [[Ler e Escrever Arquivos]], [[Fetch API]], [[Servidor HTTP com Node.js]] e [[Event Loop]].

---

## 🧠 Me teste

> [!question]- O que uma função `async` sempre devolve?
> Uma Promise, mesmo que você retorne um valor comum.

> [!question]- O `await` trava o programa inteiro?
> Não. Pausa só a função `async` onde está; o resto do programa (outros eventos, outras Promises) continua rodando.

> [!question]- Como tratar erro de um `await`?
> Com `try/catch` em volta: uma Promise rejeitada vira um `throw` na linha do `await`.

> [!question]- Por que `if (existe())` sem `await` é sempre verdadeiro?
> Porque `existe()` devolve uma Promise, que é um objeto, e todo objeto é truthy.

> [!question]- Por que `lista.forEach(async x => await f(x))` não espera?
> Porque o `forEach` ignora as Promises que a função devolve. Use `for...of` com `await` ou `Promise.all(lista.map(f))`.

> [!question]- Quando é errado fazer vários `await` em sequência?
> Quando as operações não dependem uma da outra: o tempo vira a soma. Nesse caso, `Promise.all`.

> [!question]- O que é top-level await?
> Poder usar `await` direto no topo de um arquivo de módulo ES, fora de qualquer função.

> [!question]+ `async function idade() { return 30 }`. O que `idade()` devolve?
> - a) `30`
> - b) `Promise<number>` que resolve com 30
> - c) `undefined`
> - d) Erro, porque falta `await`
>
> > [!check]- Resposta
> > **b)** Função `async` **sempre** devolve uma Promise, mesmo retornando um valor simples. Pra pegar o 30, use `await idade()`.

> [!question]+ Por que `lista.forEach(async x => await salvar(x))` termina antes de salvar tudo?
> - a) Porque `forEach` não espera as Promises que o callback devolve
> - b) Porque `await` não funciona dentro de arrow function
> - c) Porque `salvar` precisa de `.then`
> - d) Porque `forEach` roda em outra thread
>
> > [!check]- Resposta
> > **a)** `forEach` chama o callback e ignora o que ele devolve. Use `for...of` com `await` (em sequência) ou `await Promise.all(lista.map(salvar))` (em paralelo).

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `async function f(): Promise<T>` | Função assíncrona |
| `const v = await p` | Espera o valor |
| `try { await p } catch (e) { }` | Trata o erro |
| `await Promise.all([a(), b()])` | Em paralelo |
| `for (const x of xs) await f(x)` | Em sequência |
| `main().catch(...)` | Erro do topo do programa |
| `AbortSignal.timeout(5000)` | Desistir depois de 5 s |

**Pra ler:** o capítulo [Async/await](https://javascript.info/async-await) do javascript.info é a melhor explicação passo a passo, com exercícios no fim. A [referência do MDN sobre async function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function) está em português. E a página da regra [no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) mostra exemplos de todos os jeitos de esquecer um `await`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

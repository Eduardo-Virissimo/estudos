---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Objetos e Arrays no JavaScript

**Quanto focar: 🔥 essencial.** É 80% do código do dia a dia: desestruturação, spread, `map`/`filter`. Pratique muito até sair sem consultar.

**Quanto tempo:** cerca de 1h15: 20 min de leitura, 10 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Olhe este código e tente prever o que ele mostra:

```ts
const a = { xp: 10 };
const b = a;
b.xp = 99;
console.log(a.xp);
```

Se você respondeu `10`, está em boa companhia: quase todo mundo responde isso na primeira vez. Afinal, você só mexeu no `b`. Mas o resultado é `99`. O `a` mudou junto, sem você ter tocado nele.

Esse comportamento esquisito explica metade dos bugs com objetos, e é por isso que ele abre a nota. Os **objetos** agrupam dados com nome (`{ titulo: "Estudar", xp: 50 }`) e os **arrays** são listas ordenadas. Juntos, eles guardam quase todos os dados de um programa. No dia a dia, você vai **desestruturar** (tirar propriedades de dentro), **copiar com spread** (`{ ...tarefa, xp: 60 }`) e transformar listas com **`map`, `filter`, `find`, `reduce` e `sort`**. Mas tudo isso fica mais fácil depois de entender o mistério do `99`. Ajuda ter passado pelos [[Tipos Básicos do TypeScript]], pelas [[Estruturas de Repetição]] e pelas [[Funções]].

## O papel com o endereço

Por que o `a` mudou? Porque uma variável **não guarda o objeto em si**. Ela guarda o **endereço** de onde ele está na memória.

Pense num endereço de casa escrito num papel. Quando você faz `const b = a`, você não está construindo uma casa nova: está copiando o **papel**. Agora existem dois papéis, mas os dois apontam pra mesma casa. Quem pintar a parede, pinta pra todo mundo. Isso se chama passar **por referência**.

Com números e textos isso não acontece, porque eles são copiados de verdade. Mas com objetos e arrays, sempre que você passa pra outra variável ou pra uma função, passa o endereço. E daí a consequência importante: uma função que recebe uma lista e faz `lista.push(...)` está mexendo na lista de quem chamou.

Pra copiar de verdade, você precisa construir uma casa nova:

```ts
const c = { ...a }; // objeto novo, com as mesmas propriedades
c.xp = 1;
console.log(a.xp);  // 99 ✅ não mudou
```

Só que essa cópia tem um limite, e ele pega muita gente: ela copia só o **primeiro nível**. Se o objeto tem uma lista dentro, como `tags`, a cópia aponta pra **mesma** lista do original. É como copiar a casa, mas manter a garagem compartilhada. Pra copiar tudo, inclusive o que está aninhado lá dentro, existe o `structuredClone(a)`.

## Espalhar pra criar versões novas

Os três pontinhos (`...`), chamados **spread** ("espalhar"), tiram tudo de dentro de um objeto ou lista e espalham num novo. São a ferramenta pra criar versões novas sem mexer na original:

```ts
const tarefa = { id: 1, titulo: "Estudar", xp: 50 };

const atualizada = { ...tarefa, xp: 80 };  // cópia com o xp trocado
const juntos = [...listaA, ...listaB];      // junta duas listas
const comNova = [...tarefas, novaTarefa];   // um "push" sem alterar a original
```

Em `{ ...tarefa, xp: 80 }`, primeiro o spread copia todas as propriedades, e depois o `xp: 80` sobrescreve só aquela. A `tarefa` original continua com `xp: 50`.

Por que não alterar direto, que seria mais curto? Por causa da seção anterior: alterar o objeto original afeta todo mundo que tem o "endereço" dele, inclusive partes do programa que você nem lembra que existem. Criar uma versão nova é mais seguro. É assim que funcionam as funções puras, e é assim que o React funciona.

O padrão mais importante disso, e que você vai escrever centenas de vezes, é **atualizar um item numa lista**:

```ts
const concluir = (lista: Tarefa[], id: number): Tarefa[] =>
  lista.map((t) => (t.id === id ? { ...t, feita: true } : t));
```

Leia devagar: "pra cada tarefa, se for a do id, devolva uma cópia com `feita: true`; senão, devolva ela mesma". A lista original fica intacta, e você recebe uma nova.

## Transformar listas sem laço

Estes quatro métodos substituem a maioria dos laços que você escreveria. Usando esta lista:

```ts
const tarefas = [
  { id: 1, titulo: "Estudar", xp: 50, feita: true },
  { id: 2, titulo: "Treinar", xp: 30, feita: false },
  { id: 3, titulo: "Ler", xp: 20, feita: true },
];
```

O **`map` transforma cada item**, e devolve uma lista do mesmo tamanho:

```ts
tarefas.map((t) => t.titulo); // ["Estudar", "Treinar", "Ler"]
```

O **`filter` fica só com alguns**, os que passam no teste:

```ts
tarefas.filter((t) => t.feita); // as tarefas 1 e 3
```

O **`find` acha o primeiro** que passa no teste, ou devolve `undefined` se nenhum passar:

```ts
tarefas.find((t) => t.id === 2); // a tarefa 2
```

E o **`reduce` junta tudo num valor só**, como uma soma:

```ts
tarefas.reduce((soma, t) => soma + t.xp, 0); // 100
```

O `reduce` assusta no começo, mas ele é só o padrão "acumulador" que você viu em [[Estruturas de Repetição]], escrito de outro jeito. A `soma` começa em `0` (o segundo argumento), e a cada item vira `soma + t.xp`.

E o melhor: eles se encadeiam, e o código se lê como uma frase:

```ts
const xpFeito = tarefas
  .filter((t) => t.feita)
  .reduce((soma, t) => soma + t.xp, 0); // 70
```

"Das tarefas, as feitas, somando o xp."

Três armadilhas acompanham esses métodos. O `find` pode **não achar**, e aí devolve `undefined`; usar o resultado direto, como `tarefas.find(...).titulo`, quebra. Trate com `tarefas.find(...)?.titulo`. O `map` com chaves precisa de `return`: `lista.map(t => { t.titulo })` devolve uma lista de `undefined` (lembra das arrow functions em [[Funções]]?). E o `reduce` sem o valor inicial, o `, 0` do fim, dá erro numa lista vazia. Sempre passe o valor inicial.

## Tirar o que está dentro

**Desestruturar** é tirar propriedades de dentro de um objeto (ou itens de uma lista) e colocar em variáveis, numa linha só:

```ts
const { titulo, xp } = tarefa;        // cria as variáveis titulo e xp
const { titulo: nome } = tarefa;      // tira o titulo, mas chama de nome
const { prazo = "sem prazo" } = tarefa as { prazo?: string }; // valor padrão se não existir

const [primeira, segunda, ...resto] = [10, 20, 30, 40]; // resto = [30, 40]
```

Isso aparece muito nos parâmetros de funções, quando elas recebem um objeto:

```ts
function mostrar({ titulo, xp }: { titulo: string; xp: number }) {
  console.log(`${titulo}: ${xp} XP`);
}
```

E já que estamos falando de objetos, o básico pra ter à mão:

```ts
const tarefa = { id: 1, titulo: "Estudar", xp: 50, tags: ["ts"] };

tarefa.titulo;          // "Estudar"
tarefa["xp"];           // 50 (útil quando o nome da chave está numa variável)
tarefa.xp = 60;         // alterar
Object.keys(tarefa);    // ["id", "titulo", "xp", "tags"]
Object.entries(tarefa); // [["id", 1], ["titulo", "Estudar"], ...]
"xp" in tarefa;         // true
```

E um atalho simpático: quando a variável tem o mesmo nome da chave, dá pra escrever uma vez só.

```ts
const titulo = "Treinar";
const nova = { titulo, xp: 30 }; // { titulo: "Treinar", xp: 30 }
```

## O sort e as suas duas armadilhas

Ordenar parece a coisa mais simples do mundo, até isto acontecer:

```ts
[10, 9, 1].sort();                 // [1, 10, 9] 😱
[10, 9, 1].sort((a, b) => a - b);  // [1, 9, 10] ✅
```

A primeira armadilha: sem uma função de comparação, o `sort` compara tudo **como texto**. E como texto, `"10"` vem antes de `"9"`, do mesmo jeito que no dicionário "abacaxi" vem antes de "banana": ele olha o primeiro caractere, e "1" vem antes de "9". Pra números, passe sempre `(a, b) => a - b` (crescente) ou `b - a` (decrescente). Pra texto com acento, use o `localeCompare`:

```ts
tarefas.sort((a, b) => b.xp - a.xp);                      // maior xp primeiro
tarefas.sort((a, b) => a.titulo.localeCompare(b.titulo)); // alfabética
```

A segunda armadilha: o `sort` **altera a lista original**, ao contrário do `map` e do `filter`. Pra ordenar sem alterar, use o `toSorted(...)`, ou faça uma cópia antes: `[...tarefas].sort(...)`.

Isso leva a uma tabela que vale a pena ter em mente, porque é a fonte de muitos bugs:

| Alteram o original | Devolvem um novo |
|---|---|
| `push`, `pop`, `shift`, `splice`, `sort`, `reverse` | `map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, spread |

Em código moderno, prefira a coluna da direita. E mais alguns métodos que aparecem no dia a dia:

| Método | Pra quê | Exemplo |
|---|---|---|
| `findIndex` | a posição do primeiro que passa | `tarefas.findIndex(t => t.id === 2)` → `1` (ou `-1`) |
| `some` / `every` | algum passa? todos passam? | `tarefas.some(t => !t.feita)` → `true` |
| `includes` | a lista contém este valor? | `["a","b"].includes("a")` → `true` |
| `join` | vira texto | `["a","b"].join(", ")` → `"a, b"` |

O `forEach` também existe, mas ele só percorre, sem devolver nada. Pra criar uma lista nova, use `map` ou `filter`.

## O essencial

1. Objetos e arrays são passados por referência: `b = a` copia o endereço, não o objeto.
2. `{ ...obj }` copia só o primeiro nível; `structuredClone` copia tudo.
3. Atualizar um item sem alterar a lista: `lista.map(t => t.id === id ? { ...t, campo } : t)`.
4. `map` transforma, `filter` seleciona, `find` acha um (ou `undefined`), `reduce` junta (com valor inicial).
5. `sort()` sem função compara como texto, e altera o original. Use `(a, b) => a - b` e `toSorted`.

## Agora é com você

Responda perguntas sobre uma lista usando só métodos de array, sem nenhum `for`. Monte uma lista `filmes` com pelo menos 6 filmes que você conhece, cada um com `titulo`, `ano`, `nota` e `generos` (uma lista de textos). Depois descubra: os títulos dos filmes com nota maior ou igual a 8, em ordem alfabética; a média das notas; o filme mais antigo; se tem algum filme de terror, e se todos são depois de 2000; a lista de gêneros **sem repetição** (dica: `new Set(...)`, veja [[Map e Set no JavaScript]]); e, por fim, um array novo com a nota de um filme alterada, sem alterar o original. Confira o original no fim. Você terminou quando as seis respostas saírem certas, sem nenhum `for`, e a lista `filmes` continuar intacta.

Daqui, siga pra [[Map e Set no JavaScript]], [[Interfaces e Type Aliases]], [[Arrays]] e [[JSON]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `map` e `filter`?
> `map` transforma cada item e devolve uma lista do mesmo tamanho; `filter` devolve só os itens que passam na condição.

> [!question]- Por que `const b = a` não copia um objeto?
> Porque objetos são guardados por referência: `b` passa a apontar pro mesmo objeto. Mudou um, mudou o outro.

> [!question]- Como atualizar um item numa lista sem alterar a original?
> `lista.map(t => t.id === id ? { ...t, campo: novo } : t)`.

> [!question]- Por que `[10, 9, 1].sort()` dá `[1, 10, 9]`?
> Porque o `sort` sem função compara como texto. Pra números: `sort((a, b) => a - b)`.

> [!question]- Qual a diferença entre `find` e `filter`?
> `find` devolve o primeiro item que passa (ou `undefined`); `filter` devolve um array com todos que passam.

> [!question]- O que o spread copia num objeto com arrays dentro?
> Só o primeiro nível: os arrays internos continuam compartilhados. Pra cópia profunda, `structuredClone`.

> [!question]+ `const a = { n: 1 }; const b = a; b.n = 2;` Quanto vale `a.n`?
> - a) `1`
> - b) `2`
> - c) `undefined`
> - d) Erro, `a` é `const`
>
> > [!check]- Resposta
> > **b)** `b = a` não copia: as duas variáveis apontam pro **mesmo** objeto. Pra copiar, use `{ ...a }` (cópia rasa) ou `structuredClone(a)`.

> [!question]+ O que `[10, 9, 1].sort()` devolve?
> - a) `[1, 9, 10]`
> - b) `[1, 10, 9]`
> - c) `[10, 9, 1]`
> - d) `[9, 10, 1]`
>
> > [!check]- Resposta
> > **b)** Sem função de comparação, `sort` compara como **texto**, e `"10"` vem antes de `"9"`. Pra número, use `sort((a, b) => a - b)`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `const { a, b } = obj` | Desestruturar |
| `{ ...obj, a: 1 }` | Cópia com uma alteração |
| `[...lista, item]` | Adicionar sem alterar |
| `lista.map(fn)` | Transformar |
| `lista.filter(fn)` | Filtrar |
| `lista.find(fn)` | Achar um |
| `lista.reduce((acc, x) => ..., inicial)` | Juntar num valor |
| `lista.toSorted((a, b) => a - b)` | Ordenar sem alterar |
| `structuredClone(obj)` | Cópia profunda |

**Pra ler:** os capítulos [Objects](https://javascript.info/object) e [Array methods](https://javascript.info/array-methods) do javascript.info explicam tudo isso com exercícios ótimos. A [referência de Array do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array) tem todos os métodos com exemplos. E o [Does it mutate?](https://doesitmutate.xyz/) é uma página que responde, método por método, se ele altera o array original.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

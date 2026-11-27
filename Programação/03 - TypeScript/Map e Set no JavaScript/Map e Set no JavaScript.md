---
nivel: escrito
foco: importante
revisado:
---

# Map e Set no JavaScript

**Quanto focar: 📌 importante.** Aparecem menos que objeto e array, mas resolvem muito bem busca rápida e valores únicos. Entenda e use quando fizer sentido.

**⏱️ Quanto tempo: cerca de 1h.** Uns 15 min de leitura, 5 min no Me teste e 40 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você tem a lista de quem participou das sessões de estudo do mês, com cem mil registros e muitos nomes repetidos, e quer saber duas coisas. Quantas pessoas **diferentes** participaram? E quantas vezes cada uma apareceu? Com um array comum, a primeira pergunta vira um laço que, pra cada nome, confere se ele já foi visto, olhando a lista inteira de novo. A segunda vira um objeto com chaves esquisitas. Funciona, mas é lento e desajeitado.

O JavaScript tem duas estruturas feitas exatamente pra esses problemas. O **`Set`** é uma coleção de **valores únicos**: serve pra tirar os repetidos e pra perguntar "isto existe aqui?" quase instantaneamente, mesmo com milhões de itens. O **`Map`** é um dicionário **chave → valor**, em que a chave pode ser de qualquer tipo: serve pra contar, indexar e agrupar.

Elas são as versões prontas, no JavaScript, de duas estruturas que você vai estudar a fundo no Estágio 2, o [[Set]] e a [[Hash Table]]. E o motivo de valer a pena conhecer as duas agora tem a ver com velocidade, e vai ficar claro na segunda seção. Ajuda ter passado por [[Objetos e Arrays no JavaScript]].

## Set: cada coisa uma vez só

Um `Set` é como a lista de convidados de uma festa: cada nome aparece **uma vez só**, não importa quantas vezes você tente adicionar.

```ts
const tags = new Set<string>(["ts", "node", "ts"]);
tags.size;          // 2: o "ts" repetido sumiu
tags.add("git");
tags.has("node");   // true
tags.delete("ts");
for (const t of tags) console.log(t);
```

E a primeira pergunta do começo, "quantas pessoas diferentes?", se resolve numa linha só:

```ts
const unicos = [...new Set([3, 1, 3, 2, 1])]; // [3, 1, 2]
```

O `Set` remove os repetidos, e o spread (`...`) transforma de volta numa lista. É um dos truques mais úteis do JavaScript.

Outro uso natural é **comparar dois grupos**. Quem estudou ontem e voltou hoje? Quem saiu? Quem chegou?

```ts
const ontem = new Set(["ana", "bia", "caio"]);
const hoje = new Set(["bia", "caio", "duda"]);

const ficaram  = [...hoje].filter((u) => ontem.has(u));  // ["bia", "caio"]
const sairam   = [...ontem].filter((u) => !hoje.has(u)); // ["ana"]
const chegaram = [...hoje].filter((u) => !ontem.has(u)); // ["duda"]
```

A partir do Node 22, essas operações já vêm prontas: `hoje.intersection(ontem)`, `ontem.difference(hoje)` e `hoje.union(ontem)`.

Uma armadilha: o `Set` não remove objetos "iguais". `new Set([{ a: 1 }, { a: 1 }])` tem **dois** itens. Os dois objetos parecem idênticos, mas são objetos diferentes na memória, e o `Set` compara por referência, não por conteúdo (lembra das referências em [[Objetos e Arrays no JavaScript]]?). Pra tirar repetidos de uma lista de objetos, use um `Map` com o id como chave.

## Por que o has é tão rápido

Esta é a razão principal de usar um `Set`, então vale entender. Numa lista, perguntar "este valor está aqui?" obriga o computador a olhar **item por item**, do começo, até achar:

```ts
const lista = Array.from({ length: 100_000 }, (_, i) => i);
lista.includes(99_999);  // olha 100 mil itens

const conjunto = new Set(lista);
conjunto.has(99_999);    // vai direto
```

Pense em procurar um nome numa pilha de papéis bagunçada, contra procurar numa agenda organizada por letra. Na pilha, você olha papel por papel. Na agenda, vai direto na letra certa, e não importa se ela tem cem nomes ou cem mil. O `Set` é a agenda.

Uma checagem sozinha não faz diferença que você perceba: as duas são rápidas. O problema aparece **dentro de um laço**, quando essa pergunta se repete milhares de vezes. Aí a diferença vira segundos contra milissegundos. A regra prática: **se você vai perguntar "existe?" muitas vezes, transforme a lista num `Set` antes.** A nota de [[Big O]] explica isso com números.

## Map: cada chave leva a um valor

Um `Map` guarda pares: cada **chave** aponta pra um **valor**. É como uma agenda de telefones, em que o nome leva ao número.

```ts
const xpPorUsuario = new Map<string, number>();
xpPorUsuario.set("ana", 120);
xpPorUsuario.set("bia", 80);

xpPorUsuario.get("ana");   // 120
xpPorUsuario.get("caio");  // undefined
xpPorUsuario.has("bia");   // true
xpPorUsuario.size;         // 2
xpPorUsuario.delete("bia");

for (const [usuario, xp] of xpPorUsuario) console.log(usuario, xp);
```

Existem três usos que você vai encontrar o tempo todo, e o primeiro responde a segunda pergunta do começo, "quantas vezes cada pessoa apareceu?":

```ts
const palavras = ["ts", "js", "ts", "go", "ts"];

// 1. CONTAR quantas vezes cada coisa aparece
const contagem = new Map<string, number>();
for (const p of palavras) contagem.set(p, (contagem.get(p) ?? 0) + 1);
// Map { "ts" => 3, "js" => 1, "go" => 1 }

// 2. INDEXAR: achar por id sem percorrer a lista toda
const porId = new Map(tarefas.map((t) => [t.id, t]));
porId.get(42);

// 3. AGRUPAR
const porStatus = Map.groupBy(tarefas, (t) => (t.feita ? "feitas" : "pendentes"));
```

O contador merece atenção, porque é o padrão mais usado de todos. O `contagem.get(p) ?? 0` quer dizer "quanto já tem, ou 0 se ainda não apareceu", e aí soma 1. Se você esquecer o `?? 0`, na primeira vez que uma palavra aparece o `get` devolve `undefined`, e `undefined + 1` dá `NaN`. Todo o seu contador vira `NaN`.

E o indexar resolve o mesmo problema de velocidade do `Set`: em vez de percorrer a lista de tarefas toda vez que precisa de uma pelo id, você monta o `Map` uma vez e vai direto.

Um erro comum de quem está começando é usar colchetes: `mapa["ana"] = 120`. Isso **não** usa o `Map`. Cria uma propriedade comum no objeto, que o `.get()` nem enxerga. Num `Map`, é sempre `.get()` e `.set()`.

## Map ou objeto?

Os dois guardam chave → valor, então quando usar cada um?

| | Objeto `{}` | `Map` |
|---|---|---|
| Chave | só texto | qualquer tipo (número, objeto...) |
| Tamanho | `Object.keys(o).length` | `.size` |
| Vira JSON direto | ✅ | ❌ |
| Bom pra | **formato fixo** (`{ titulo, xp }`) | **coleção que cresce e encolhe** |

A regra que resolve quase todo caso: se as chaves são **campos** (titulo, xp, concluida), use um objeto. Se as chaves são **dados** (ids, nomes de usuário, datas), use um `Map`.

Só tem um detalhe na hora de salvar. O JSON não sabe representar um `Map`, então `JSON.stringify(mapa)` devolve `{}`, um objeto vazio, sem erro nenhum, e você perde os dados em silêncio. Converta antes:

```ts
const obj = Object.fromEntries(contagem);  // Map → objeto (pra salvar em JSON)
const mapa = new Map(Object.entries(obj)); // objeto → Map
const array = [...tags];                   // Set → lista
```

E uma nota de versão: o `Map.groupBy` e o `Object.groupBy` existem a partir do Node 21. Em versões mais antigas, agrupe com um laço, usando `get` e `set`.

## O essencial

1. `Set` guarda valores únicos. `[...new Set(lista)]` tira os repetidos.
2. `set.has(x)` vai direto; `lista.includes(x)` olha item por item. Muitas perguntas "existe?", use um `Set`.
3. `Map` guarda chave → valor, com qualquer tipo de chave. Use pra contar, indexar e agrupar.
4. Ao contar, `map.get(k) ?? 0`. No `Map`, sempre `.get()` e `.set()`, nunca colchetes.
5. Chaves que são campos: objeto. Chaves que são dados: `Map`. Pra JSON, `Object.fromEntries`.

## Agora é com você

Analise um texto. Pegue um parágrafo de uma nota sua e quebre em palavras (`.toLowerCase().split(/\W+/)`, ou um [[Regex]] que aceite acentos, já que o `\W` não aceita). Com um `Set`, descubra quantas palavras **diferentes** existem. Com um `Map`, ache as 5 palavras mais frequentes (pra ordenar, `[...mapa].sort((a, b) => b[1] - a[1])`). E com outro `Set`, ignore uma lista de palavras muito comuns, como `de`, `a`, `o`, `que` e `e`. Você terminou quando sair um ranking das 5 palavras mais usadas, sem as comuns, e você tiver usado `has` em vez de `includes`.

Daqui, siga pro [[Set]] e pra [[Hash Table]], que explicam como essas estruturas funcionam por dentro, e pro [[Big O]].

---

## 🧠 Me teste

> [!question]- Como remover duplicados de um array?
> `[...new Set(lista)]`.

> [!question]- Por que `set.has(x)` é mais rápido que `lista.includes(x)`?
> `has` vai direto ao valor (tempo constante, O(1)); `includes` percorre a lista até achar (O(n)).

> [!question]- Quando usar `Map` em vez de um objeto?
> Quando as chaves são dados que crescem e mudam (ids, nomes), ou não são strings. Objeto é melhor pra formato fixo de campos.

> [!question]- Como salvar um `Map` em JSON?
> Convertendo antes: `JSON.stringify(Object.fromEntries(mapa))`.

> [!question]- Por que o contador dá `NaN` sem o `?? 0`?
> Porque na primeira vez o `get` devolve `undefined`, e `undefined + 1` é `NaN`.

> [!question]- Por que um `Set` com dois objetos `{a: 1}` tem tamanho 2?
> Porque compara por referência: são dois objetos diferentes na memória, mesmo com o mesmo conteúdo.

> [!question]+ Qual o jeito mais simples de tirar os repetidos de `[1, 2, 2, 3]`?
> - a) `lista.filter(x => x !== x)`
> - b) `[...new Set(lista)]`
> - c) `new Map(lista)`
> - d) `lista.sort().unique()`
>
> > [!check]- Resposta
> > **b)** O `Set` só guarda valores únicos. O spread transforma de volta em array.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `new Set(lista)` | Conjunto sem duplicados |
| `set.add(x)` / `set.has(x)` / `set.delete(x)` | Adicionar / existe? / remover |
| `[...new Set(lista)]` | Remover duplicados |
| `new Map<K, V>()` | Dicionário |
| `map.set(k, v)` / `map.get(k)` | Gravar / ler |
| `map.get(k) ?? 0` | Ler com valor padrão |
| `new Map(lista.map(x => [x.id, x]))` | Indexar por id |
| `Object.fromEntries(map)` | Map → objeto (pra JSON) |

**Pra ler:** o capítulo [Map and Set](https://javascript.info/map-set) do javascript.info é curto e tem exercícios ótimos, inclusive um de achar anagramas com `Map`. Pra consultar os métodos, as páginas do MDN sobre [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set), em português.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

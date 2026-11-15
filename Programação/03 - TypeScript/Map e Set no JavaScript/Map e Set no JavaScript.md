---
nivel: escrito
revisado:
---

# Map e Set no JavaScript

> *"Se você está usando `.includes()` dentro de um laço, provavelmente queria um `Set`."*

> [!tip] ⚡ Em 30 segundos
> **`Set`** é uma coleção de **valores únicos**: tirar duplicados e checar "existe?" em tempo quase instantâneo. **`Map`** é um dicionário **chave → valor** onde a chave pode ser de qualquer tipo, que mantém a ordem de inserção e tem `.size`. São as versões prontas, no JavaScript, das estruturas [[Set]] e [[Hash Table]] que você estuda no Estágio 2.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Usar `Set` pra remover duplicados e checar existência
- Usar `Map` pra contar, agrupar e indexar por chave
- Decidir entre objeto `{}`, `Map`, array e `Set`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Objetos e Arrays no JavaScript]]
- **Depois:** [[Set]] · [[Hash Table]] · [[Big O]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. `Set`: valores únicos

```ts
const tags = new Set<string>(["ts", "node", "ts"]);
tags.size;          // 2 (o "ts" repetido sumiu)
tags.add("git");
tags.has("node");   // true  ← rápido, mesmo com milhões de itens
tags.delete("ts");
for (const t of tags) console.log(t);

const unicos = [...new Set([3, 1, 3, 2, 1])]; // [3, 1, 2]
```

### 2. Por que `has` é melhor que `includes`

```ts
const lista = Array.from({ length: 100_000 }, (_, i) => i);
lista.includes(99_999);  // percorre até achar: O(n)

const conjunto = new Set(lista);
conjunto.has(99_999);    // vai direto: O(1)
```

Dentro de um laço, a diferença vira segundos × milissegundos ([[Big O]]).

### 3. `Map`: chave → valor

```ts
const xpPorUsuario = new Map<string, number>();
xpPorUsuario.set("ana", 120);
xpPorUsuario.set("bia", 80);

xpPorUsuario.get("ana");     // 120
xpPorUsuario.get("caio");    // undefined
xpPorUsuario.has("bia");     // true
xpPorUsuario.size;           // 2
xpPorUsuario.delete("bia");

for (const [usuario, xp] of xpPorUsuario) console.log(usuario, xp);
```

### 4. Os três usos clássicos de `Map`

```ts
const palavras = ["ts", "js", "ts", "go", "ts"];

// contar
const contagem = new Map<string, number>();
for (const p of palavras) contagem.set(p, (contagem.get(p) ?? 0) + 1);
// Map { "ts" => 3, "js" => 1, "go" => 1 }

// indexar (achar por id sem percorrer a lista)
const porId = new Map(tarefas.map((t) => [t.id, t]));
porId.get(42);

// agrupar
const porStatus = Map.groupBy(tarefas, (t) => (t.feita ? "feitas" : "pendentes"));
```

> `Map.groupBy` e `Object.groupBy` existem a partir do Node 21. Em versões antigas, agrupe com um laço e `get`/`set`.

### 5. `Map` × objeto `{}`

| | Objeto `{}` | `Map` |
|---|---|---|
| Chave | só `string`/`symbol` | qualquer tipo (número, objeto...) |
| Tamanho | `Object.keys(o).length` | `.size` |
| Ordem | quase sempre a de inserção | sempre a de inserção |
| Vira JSON direto | ✅ | ❌ (converta: `Object.fromEntries(map)`) |
| Bom pra | **formato fixo** (`{ titulo, xp }`) | **coleção dinâmica** que cresce e encolhe |

Regra: se as chaves são **campos** (titulo, xp), use objeto. Se as chaves são **dados** (ids, nomes de usuário), use `Map`.

### 6. Convertendo

```ts
const obj = Object.fromEntries(contagem);  // Map → objeto (pra salvar em JSON)
const mapa = new Map(Object.entries(obj)); // objeto → Map
const array = [...tags];                   // Set → array
```

---

## 🛠️ Exemplo guiado

Achar quem está em duas listas e quem saiu:

```ts
const ontem = new Set(["ana", "bia", "caio"]);
const hoje = new Set(["bia", "caio", "duda"]);

const ficaram = [...hoje].filter((u) => ontem.has(u)); // ["bia", "caio"]
const sairam = [...ontem].filter((u) => !hoje.has(u)); // ["ana"]
const chegaram = [...hoje].filter((u) => !ontem.has(u)); // ["duda"]
```

> Node 22+ também tem os métodos prontos: `hoje.intersection(ontem)`, `ontem.difference(hoje)`, `hoje.union(ontem)`.

---

## 🔧 Pegadinhas

- **Usar `map[chave]` num `Map`.** Cria uma propriedade comum no objeto e ignora o Map. Sempre `.get()` e `.set()`.
- **`JSON.stringify(map)` dá `{}`.** Converta antes com `Object.fromEntries`.
- **Set de objetos não remove "iguais".** `new Set([{a: 1}, {a: 1}])` tem 2 itens: são objetos diferentes na memória. Pra objetos, use um `Map` com o id como chave.
- **Esquecer o `?? 0` ao contar.** `map.get(x) + 1` com `undefined` dá `NaN`.

---

## 🔨 Desafio prático

**Objetivo:** analisar um texto.

1. Pegue um parágrafo de uma nota sua e quebre em palavras (`.toLowerCase().split(/\W+/)` ou um [[Regex]] que aceite acentos).
2. Com `Set`: quantas palavras **diferentes** existem?
3. Com `Map`: as 5 palavras mais frequentes (ordene `[...mapa].sort((a, b) => b[1] - a[1])`).
4. Com `Set`: ignore uma lista de palavras comuns (`de`, `a`, `o`, `que`, `e`...).

**Pronto quando:** sai um ranking das 5 palavras mais usadas, sem as palavras comuns, e você usou `has` em vez de `includes`.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Como remover duplicados de um array?
> `[...new Set(lista)]`.

> [!question]- Por que `set.has(x)` é mais rápido que `lista.includes(x)`?
> `has` vai direto ao valor (tempo constante, O(1)); `includes` percorre a lista até achar (O(n)).

> [!question]- Quando usar `Map` em vez de um objeto?
> Quando as chaves são dados que crescem e mudam (ids, nomes), ou não são strings. Objeto é melhor pra formato fixo de campos.

> [!question]- Como salvar um `Map` em JSON?
> Convertendo antes: `JSON.stringify(Object.fromEntries(mapa))`.

> [!question]- Por que um `Set` com dois objetos `{a: 1}` tem tamanho 2?
> Porque compara por referência: são dois objetos diferentes na memória, mesmo com o mesmo conteúdo.

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `new Set(lista)` | conjunto sem duplicados |
| `set.add(x)` / `set.has(x)` / `set.delete(x)` | adicionar / existe? / remover |
| `[...new Set(lista)]` | remover duplicados |
| `new Map<K, V>()` | dicionário |
| `map.set(k, v)` / `map.get(k)` | gravar / ler |
| `map.get(k) ?? 0` | ler com padrão |
| `new Map(lista.map(x => [x.id, x]))` | indexar por id |
| `Object.fromEntries(map)` | Map → objeto (JSON) |

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

- [javascript.info · Map and Set](https://javascript.info/map-set)
- [MDN · Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set)

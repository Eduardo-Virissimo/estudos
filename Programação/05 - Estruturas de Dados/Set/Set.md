---
nivel: escrito
foco: importante
revisado:
---

# Set

**Quanto focar: 📌 importante.** Resolve com elegância "já vi isso?" e "tire as duplicatas". Entenda e use sempre que couber.

**Quanto tempo:** cerca de 1h: 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você organiza um campeonato e tem a lista de inscrições: 5 mil linhas, gente que se inscreveu duas vezes, gente que mandou o formulário três vezes porque achou que não tinha ido. Precisa saber quantos jogadores existem de verdade, e na hora do check-in precisa responder rápido "este nick está inscrito?". Ninguém liga pra ordem, nem pra quantas vezes a pessoa se inscreveu. A pergunta é só: **está ou não está?**

Essa é a pergunta que o **Set** (conjunto) responde melhor que qualquer outra estrutura. Um Set é uma coleção de valores **únicos**, sem ordem que importe e sem repetição, e checar se algo está nele custa O(1). Por baixo, ele é uma [[Hash Table]] que guarda só as chaves, sem valores. Se você entendeu a hash table, o Set é de graça; a nota é sobre **reconhecer quando usar**, e sobre a matemática de conjuntos que resolve problemas inteiros em uma linha.

A API do JavaScript (`new Set`, `add`, `has`, `delete`) está em [[Map e Set no JavaScript]]. Aqui a gente fala de ideias.

## O Set é uma hash table sem valores

Lembra dos baldes da hash table? Num Set, cada balde guarda só a chave. Inserir calcula o hash e coloca no balde, **se ainda não estiver lá**. Checar calcula o hash e olha o balde. É isso que dá as duas propriedades:

- **Unicidade de graça.** Inserir um valor que já existe não faz nada, porque o balde já tem ele.
- **`has` em O(1).** O mesmo motivo do `get` da hash table.

Compare com a lista:

```ts
const inscritos = ["ana", "bia", "ana", "caio", "bia"]; // 5 mil, na vida real

inscritos.includes("caio");           // O(n): olha um por um

const jogadores = new Set(inscritos); // O(n), uma vez só
jogadores.size;                       // 3
jogadores.has("caio");                // O(1), quantas vezes quiser
```

Montar o Set custa O(n). Depois disso, cada pergunta é instantânea. Se você vai fazer **uma** pergunta, a lista basta. Se vai fazer **muitas** (o check-in inteiro, ou um laço que pergunta a cada volta), o Set ganha de longe.

Essa é a armadilha que mais aparece em código de iniciante, e vale guardar: `includes` dentro de um laço.

```ts
// O(n × m): pra cada pedido, olha a lista inteira de bloqueados
pedidos.filter((p) => !bloqueados.includes(p.cliente));

// O(n + m): monta o Set uma vez, pergunta em O(1)
const bloq = new Set(bloqueados);
pedidos.filter((p) => !bloq.has(p.cliente));
```

Com 10 mil pedidos e 10 mil bloqueados, a primeira versão faz 100 milhões de comparações. A segunda, 20 mil operações.

## Operações de conjunto

A escola ensinou união, interseção e diferença com aqueles círculos (diagramas de Venn). No código, elas respondem perguntas de negócio:

```ts
const semana1 = new Set(["ana", "bia", "caio"]);
const semana2 = new Set(["bia", "caio", "duda"]);

// interseção: quem jogou nas duas semanas?
const fieis = [...semana1].filter((x) => semana2.has(x));     // ["bia", "caio"]

// diferença: quem jogou na 1 e não voltou?
const perdidos = [...semana1].filter((x) => !semana2.has(x)); // ["ana"]

// união: quem jogou em alguma?
const todos = new Set([...semana1, ...semana2]);             // ana, bia, caio, duda
```

Cada uma é O(n) graças ao `has` em O(1). No Node 22 em diante, elas já vêm prontas (`semana1.intersection(semana2)`, `.difference`, `.union`), mas vale saber escrever, porque em entrevista e em outras linguagens o raciocínio é esse.

## O Set como memória de "já passei aqui"

O uso mais importante em algoritmos é este: um Set de **visitados**. Toda vez que um algoritmo anda por um [[Grafos|grafo]], ele precisa lembrar por onde já passou, senão anda em círculos pra sempre.

```ts
const visitados = new Set<string>();
function visitar(cidade: string) {
  if (visitados.has(cidade)) return; // já estive aqui: não volto
  visitados.add(cidade);
  for (const vizinha of estradas.get(cidade) ?? []) visitar(vizinha);
}
```

Esse `if` de três palavras é a diferença entre um algoritmo que termina e um que trava. Você vai vê-lo de novo em [[DFS (Busca em Profundidade)]] e [[BFS (Busca em Largura)]].

O mesmo truque detecta repetição em qualquer coisa: "a lista tem algum número duplicado?" (insere um por um e, se já estava, achou), "este processo entrou em loop?" (guarda os estados já vistos). Sempre O(n).

## O que o Set não faz

Três limites, pra não se surpreender. O Set **não guarda contagem**: se precisar saber *quantas vezes* algo apareceu, use um `Map` de valor pra número. O Set **não ordena**: o do JavaScript mantém a ordem de inserção, mas não deixa pegar "o menor" nem "o próximo depois de 10" sem percorrer tudo (pra isso existem as [[Árvore Binária de Busca (BST)|árvores de busca]]). E o Set **compara objetos por referência**: dois objetos `{ id: 1 }` criados separadamente são dois itens diferentes. Pra deduplicar objetos, use um Set dos ids, ou um `Map` com o id como chave.

## O essencial

1. Set = valores únicos com `has` em O(1); é uma hash table só de chaves.
2. Pra perguntar "existe?" muitas vezes, converta a lista em Set uma vez.
3. `includes` dentro de laço é O(n × m); com Set vira O(n + m).
4. Interseção, diferença e união resolvem perguntas de negócio em O(n).
5. Set de visitados é o que impede algoritmos de grafo de andarem em círculo.

## Agora é com você

Resolva três exercícios com Set, cada um em 📦 `estruturas-do-zero/exercicios/` com o Big-O no topo ([[Estruturas de Dados do Zero]]): [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) (tem algum repetido?), [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/) e [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/), que é o difícil: o maior trecho de números consecutivos (`[100, 4, 200, 1, 3, 2]` → 4, por causa de 1, 2, 3, 4) em O(n), sem ordenar. A dica do terceiro: um número só começa uma sequência se o anterior dele **não** está no Set. Terminou quando os três passam no LeetCode e você sabe explicar por que o terceiro é O(n) mesmo tendo um `while` dentro do `for`.

Daqui, siga pra [[Árvore Binária]].

---

## 🧠 Me teste

> [!question]- Por que `set.has(x)` é O(1) e `array.includes(x)` é O(n)?
> O Set é uma hash table: calcula o hash de x e olha direto no balde. O array não sabe onde x está e precisa comparar elemento por elemento.

> [!question]- Quando converter uma lista em Set não compensa?
> Quando você vai fazer uma única pergunta: montar o Set custa O(n), o mesmo que um `includes`. Compensa quando há muitas perguntas.

> [!question]- Como achar quem está em duas listas ao mesmo tempo em O(n)?
> Converter uma delas em Set e filtrar a outra com `has`: `[...a].filter((x) => setB.has(x))`.

> [!question]- Pra que serve o Set de visitados em algoritmos de grafo?
> Pra não visitar o mesmo nó duas vezes. Sem ele, em grafos com ciclo, o algoritmo anda em círculos pra sempre.

> [!question]+ `new Set([{ id: 1 }, { id: 1 }]).size` dá quanto?
> - a) `1`, porque os objetos são iguais
> - b) `0`, porque Set não aceita objetos
> - c) Dá erro de compilação
> - d) `2`, porque o Set compara objetos por referência
>
> > [!check]- Resposta
> > **d)** Os dois objetos têm o mesmo conteúdo, mas são objetos diferentes na memória, e o Set compara pela identidade. Pra deduplicar por conteúdo, use os ids: `new Set(lista.map((o) => o.id))`.

---

## Pra consultar depois

| Pergunta | Código | Custo |
|---|---|---|
| Tirar repetidos | `[...new Set(lista)]` | O(n) |
| Existe? | `set.has(x)` | O(1) |
| Interseção | `[...a].filter((x) => b.has(x))` | O(n) |
| Diferença | `[...a].filter((x) => !b.has(x))` | O(n) |
| União | `new Set([...a, ...b])` | O(n) |
| Tem duplicado? | `new Set(lista).size !== lista.length` | O(n) |

**Pra ler:** a [página do MDN sobre Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set) tem os métodos novos de conjunto (`union`, `intersection`...) com exemplos e a tabela de suporte.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

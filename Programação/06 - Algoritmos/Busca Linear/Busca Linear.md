---
nivel: escrito
foco: importante
revisado:
---

# Busca Linear

**Quanto focar: 📌 importante.** É a mais simples e você usa sem perceber (`find`, `includes`). Entenda o custo e siga em frente rápido.

**Quanto tempo:** cerca de 45 min: 15 min de leitura, 5 min no Me teste e 30 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você perdeu a chave e procura nos bolsos da calça: o da frente esquerdo, o da frente direito, os de trás. Não há atalho, porque a chave pode estar em qualquer um, e os bolsos não seguem ordem nenhuma. Você olha um por um até achar ou até acabarem os bolsos.

Isso é a **busca linear**: percorrer os itens do primeiro ao último, comparando cada um com o que se procura. É o algoritmo mais simples que existe, e você já usou centenas de vezes sem saber o nome, porque `includes`, `indexOf`, `find`, `some` e `filter` fazem exatamente isso. A nota não é pra ensinar a escrever um `for` (você já sabe). É pra fazer você **enxergar o custo** escondido atrás desses métodos, e saber quando a busca linear é a resposta certa, o que acontece mais do que parece.

## O algoritmo, e o custo dele

```ts
function buscar<T>(lista: T[], alvo: T): number {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] === alvo) return i; // achou: para na hora
  }
  return -1;                         // olhou tudo e não achou
}
```

Duas coisas nesse código importam. O `return` dentro do laço faz a busca **parar no primeiro** que encontra, sem olhar o resto. E o `-1` no fim é a convenção pra "não achei", a mesma do `indexOf`.

Quanto custa? Depende de onde o alvo está. Se estiver na primeira posição, um passo (o **melhor caso**). Se estiver na última, ou não existir, n passos (o **pior caso**). Em média, metade da lista. Em [[Big O]], que olha como o custo cresce, a busca linear é **O(n)**: dobrou a lista, dobrou o trabalho.

E o pior caso mais comum não é o alvo estar no fim, é ele **não existir**. Perguntar "este e-mail já está cadastrado?" numa lista de 100 mil usuários, quando a resposta é não (o caso normal num cadastro), olha os 100 mil.

## Os métodos que escondem um laço

Todos estes são busca linear disfarçada:

```ts
lista.includes(x);              // existe?           → para no primeiro
lista.indexOf(x);               // em que posição?   → para no primeiro
lista.find((u) => u.id === 7);  // qual objeto?      → para no primeiro
lista.some((u) => u.admin);     // algum satisfaz?   → para no primeiro
lista.every((u) => u.ativo);    // todos satisfazem? → para no primeiro que falha
lista.filter((u) => u.ativo);   // todos que...      → olha SEMPRE a lista inteira
```

Um detalhe útil: o `find` e o `some` param cedo, o `filter` não. Se você só quer saber se **existe** algum, `lista.filter(...).length > 0` percorre tudo à toa; `lista.some(...)` para no primeiro.

Uma pegadinha do `includes` e do `indexOf`: eles comparam com `===` (o `includes` também acha `NaN`, o `indexOf` não). Então procurar um objeto por conteúdo não funciona:

```ts
const usuarios = [{ id: 1 }, { id: 2 }];
usuarios.includes({ id: 1 });           // false: é outro objeto na memória
usuarios.some((u) => u.id === 1);       // true: compara o que importa
```

## O laço dentro do laço

O lugar onde a busca linear machuca não é sozinha, é **dentro de outro laço**. Cada `includes` é O(n), e se você fizer um pra cada item de outra lista, o total vira O(n × m):

```ts
// pra cada um dos 10 mil pedidos, olha os 10 mil clientes: 100 milhões de comparações
for (const pedido of pedidos) {
  const cliente = clientes.find((c) => c.id === pedido.clienteId);
}

// monta um Map uma vez (10 mil passos) e cada busca é O(1)
const porId = new Map(clientes.map((c) => [c.id, c]));
for (const pedido of pedidos) {
  const cliente = porId.get(pedido.clienteId);
}
```

Esse é talvez o problema de performance mais comum em código de verdade, e é invisível em teste com 20 itens. Quando você vir um `find`, `includes` ou `indexOf` dentro de um `for`, `map` ou `filter`, acenda a luz amarela. A cura quase sempre é uma [[Hash Table]] (`Map`) ou um [[Set]], que a nota de [[Trade-offs Tempo x Espaço]] discute.

## Quando a busca linear é a resposta certa

Depois de tudo isso, parece que a busca linear é vilã. Não é. Ela é a escolha certa em muitos casos:

- **Lista pequena.** Com 50 itens, montar um `Map` custa mais do que procurar. O computador faz bilhões de comparações por segundo.
- **Uma busca só.** Se você vai procurar uma vez, converter pra `Set` (O(n)) custa o mesmo que procurar (O(n)). Só compensa com muitas buscas.
- **Dados sem ordem e sem chave.** "O primeiro pedido acima de R$ 500 feito num domingo" não tem índice que ajude. Tem que olhar.
- **Os dados mudam o tempo todo.** Manter um índice atualizado também custa.

A pergunta certa nunca é "busca linear é ruim?". É "**quantas vezes** eu vou procurar, e **em quantos** itens?". Uma vez em mil itens: linear. Mil vezes em mil itens: `Map`. Uma vez em dados ordenados de um milhão: [[Busca Binária]], o assunto da próxima nota.

## O essencial

1. Busca linear olha um por um: O(n), e o pior caso é o alvo não existir.
2. `includes`, `indexOf`, `find`, `some` e `filter` são busca linear; os quatro primeiros param no primeiro achado.
3. `includes`/`indexOf` comparam com `===`: pra objetos, use `some`/`find` com uma condição.
4. Busca linear dentro de laço vira O(n × m): troque por `Map` ou `Set`.
5. Pra listas pequenas, uma busca só, ou dados sem ordem, a linear é a escolha certa.

## Agora é com você

Encontre um O(n × m) no seu próprio código: abra o gerenciador de tarefas do Estágio 1 ([[Gerenciador de Tarefas no Terminal]]) e procure qualquer `find`, `includes`, `some` ou `indexOf` dentro de um laço ou de um `map`/`filter`. Se não achar nenhum, escreva um de propósito: uma função que recebe 50 mil tarefas e uma lista de 50 mil ids concluídos e marca cada tarefa como concluída. Meça o tempo com `performance.now()` na versão com `includes` e na versão com `Set`, e anote os dois números no comentário do arquivo, junto com o Big-O de cada versão. Faça em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]).

Daqui, siga pra [[Busca Binária]].

---

## 🧠 Me teste

> [!question]- Qual o custo da busca linear no melhor e no pior caso?
> Melhor caso O(1), quando o alvo é o primeiro. Pior caso O(n), quando é o último ou não existe.

> [!question]- Qual a diferença entre `some` e `filter(...).length > 0` pra saber se algum item satisfaz uma condição?
> O resultado é o mesmo, mas o `some` para no primeiro que satisfaz; o `filter` sempre percorre a lista inteira e ainda cria um array novo.

> [!question]- Por que `lista.includes({ id: 1 })` devolve `false` mesmo havendo `{ id: 1 }` na lista?
> Porque `includes` compara com `===`, que pra objetos compara a referência. O objeto do argumento é outro objeto na memória. Use `some((u) => u.id === 1)`.

> [!question]- Quando a busca linear é a melhor escolha?
> Em listas pequenas, quando se faz uma busca só, quando os dados não têm ordem nem chave útil, ou quando mudam o tempo todo.

> [!question]+ Um `pedidos.map((p) => clientes.find((c) => c.id === p.clienteId))`, com 20 mil pedidos e 20 mil clientes, faz cerca de quantas comparações no pior caso?
> - a) 20 mil
> - b) 40 mil
> - c) 400 milhões
> - d) 20 mil × log(20 mil)
>
> > [!check]- Resposta
> > **c)** Pra cada um dos 20 mil pedidos, o `find` pode olhar os 20 mil clientes: 20 mil × 20 mil = 400 milhões. A b) seria o custo com um `Map` montado antes (20 mil pra montar + 20 mil buscas O(1)).

---

## Pra consultar depois

| Método | Devolve | Para cedo? |
|---|---|---|
| `includes(x)` | `boolean` | sim |
| `indexOf(x)` | índice ou `-1` | sim |
| `find(f)` / `findIndex(f)` | item / índice | sim |
| `findLast(f)` | o último que satisfaz | sim (de trás pra frente) |
| `some(f)` / `every(f)` | `boolean` | sim |
| `filter(f)` | array | **não** |

**Pra ler:** a [página do MDN sobre `includes`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) explica a comparação usada e a diferença com o `indexOf` no caso do `NaN`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

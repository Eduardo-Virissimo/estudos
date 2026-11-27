---
nivel: escrito
foco: bom saber
revisado:
---

# Union-Find (Disjoint Set)

**Quanto focar: 💤 bom saber.** Aparece só em problemas específicos de grafo. Pode deixar pra depois da primeira vaga.

**Quanto tempo:** cerca de 1h: 15 min de leitura, 5 min no Me teste e 45 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Numa rede social, a Ana é amiga da Bia, a Bia é amiga do Caio, e o Duda é amigo do Edu. Pergunta: a Ana e o Caio estão no mesmo grupo de amigos (ligados por alguma corrente de amizades)? E a Ana e o Edu? Agora imagine que as amizades vão chegando uma de cada vez, milhões delas, e a cada uma você precisa responder perguntas desse tipo na hora.

Daria pra montar um [[Grafos|grafo]] e rodar uma [[BFS (Busca em Largura)|BFS]] a cada pergunta, mas isso percorre a rede inteira toda vez. O **Union-Find** (ou conjuntos disjuntos) é uma estrutura feita sob medida pra esse problema e só pra ele. Ela faz duas coisas: **unir** dois grupos e **descobrir** a que grupo alguém pertence. E faz as duas em tempo praticamente constante, com um código de quinze linhas.

Esta nota é aprofundamento e pode ser pulada no caminho pra primeira vaga. Ela é a peça que faz o [[Árvore Geradora Mínima (Kruskal e Prim)|Kruskal]] funcionar e resolve uma família de exercícios ("quantos grupos?", "isto cria um ciclo?") de forma elegante. Ajuda ter passado por [[Árvore Binária]].

## Cada grupo tem um representante

A ideia: cada grupo elege um **representante**. Duas pessoas estão no mesmo grupo se e só se têm o mesmo representante. Pra organizar, cada pessoa aponta pra um "pai", e seguindo os pais você chega no representante, que aponta pra si mesmo.

```text
pai:   ana → ana      (ana é representante)
       bia → ana
       caio → bia     (caio → bia → ana: representante é ana)
       duda → duda
       edu → duda
```

Isso forma uma floresta de árvores, uma por grupo, guardada num array (ou num `Map`) de pais.

```ts
class UnionFind {
  private pai: number[];
  private tamanho: number[];
  grupos: number;

  constructor(n: number) {
    this.pai = Array.from({ length: n }, (_, i) => i); // cada um é seu próprio grupo
    this.tamanho = Array(n).fill(1);
    this.grupos = n;
  }

  encontrar(x: number): number {
    if (this.pai[x] !== x) {
      this.pai[x] = this.encontrar(this.pai[x]); // compressão de caminho
    }
    return this.pai[x];
  }

  unir(a: number, b: number): boolean {
    let ra = this.encontrar(a);
    let rb = this.encontrar(b);
    if (ra === rb) return false;                  // já estavam juntos
    if (this.tamanho[ra] < this.tamanho[rb]) [ra, rb] = [rb, ra];
    this.pai[rb] = ra;                            // o grupo menor entra no maior
    this.tamanho[ra] += this.tamanho[rb];
    this.grupos--;
    return true;
  }
}
```

`encontrar` sobe pelos pais até o representante. `unir` acha os dois representantes e pendura um embaixo do outro. Pronto, isso é tudo.

## Os dois truques que deixam tudo instantâneo

Sem cuidado nenhum, as árvores podem virar correntes longas (o mesmo problema da [[Árvore Binária de Busca (BST)|BST]] degenerada), e `encontrar` vira O(n). Dois truques, os dois já no código acima, resolvem isso.

**União por tamanho.** Ao unir, o grupo **menor** é pendurado no **maior**. Assim, ninguém fica muito longe do representante: as árvores ficam baixas.

**Compressão de caminho.** A linha mais esperta da nota é `this.pai[x] = this.encontrar(this.pai[x])`. Enquanto sobe até o representante, a função **faz cada nó do caminho apontar direto pra ele**. Da próxima vez, é um passo só. É como, depois de perguntar o caminho pra três pessoas até achar a sala da diretoria, você anotar o número da sala pra nunca mais perguntar.

Com os dois juntos, o custo de cada operação é O(α(n)), em que α é a "inversa da função de Ackermann". O nome assusta, mas o significado é simples: pra qualquer n que caiba no universo, α(n) é no máximo 4. Na prática, **O(1)**.

## Pra que serve

**Contar grupos.** Comece com n grupos e chame `unir` pra cada ligação. O contador `grupos` diz quantas "ilhas" sobraram. Quantos grupos de amigos existem? Quantas redes de computadores isoladas?

**Detectar ciclo.** Se você vai ligar `a` e `b` e eles **já** têm o mesmo representante, essa ligação fecha um ciclo. É por isso que `unir` devolve `false` nesse caso. O [Redundant Connection](https://leetcode.com/problems/redundant-connection/) do LeetCode é exatamente isso.

**Kruskal.** Pra conectar todas as cidades com o menor custo de estrada, você ordena as estradas da mais barata pra mais cara e vai pegando cada uma que **não** fecha ciclo. "Fecha ciclo?" é o Union-Find. A nota [[Árvore Geradora Mínima (Kruskal e Prim)]] faz isso inteiro.

E o que ele **não** faz: separar grupos. Não existe "desunir". E ele não sabe o caminho entre duas pessoas, só se elas estão no mesmo grupo. Pra caminho, é [[BFS (Busca em Largura)|BFS]].

## O essencial

1. Union-Find guarda grupos que só se juntam: `unir(a, b)` e `encontrar(x)`.
2. Cada grupo é uma árvore; o representante é a raiz, e mesmo representante = mesmo grupo.
3. União por tamanho (menor embaixo do maior) e compressão de caminho deixam tudo praticamente O(1).
4. Usos: contar grupos, detectar ciclo, Kruskal.
5. Não separa grupos e não dá o caminho, só "estão juntos?".

## Agora é com você

Copie o `UnionFind` pra 📦 `estruturas-do-zero/src/union-find.ts` ([[Estruturas de Dados do Zero]]) e resolva o [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) com ele (quantos grupos de cidades conectadas?). Depois resolva o mesmo problema com DFS e compare as duas soluções: qual foi mais fácil de escrever, e qual seria melhor se as conexões chegassem uma de cada vez, com perguntas no meio? Anote a resposta no comentário do arquivo. Bônus: troque o array por um `Map<string, string>` pra aceitar nomes em vez de números.

Daqui, siga pra [[Grafos]].

---

## 🧠 Me teste

> [!question]- Quais são as duas operações do Union-Find?
> `encontrar(x)`, que devolve o representante do grupo de x, e `unir(a, b)`, que junta os grupos de a e b.

> [!question]- Como saber se duas pessoas estão no mesmo grupo?
> Comparando os representantes: `encontrar(a) === encontrar(b)`.

> [!question]- O que a compressão de caminho faz?
> Durante o `encontrar`, faz cada nó do caminho apontar diretamente pro representante, pra que as próximas buscas sejam de um passo.

> [!question]- Como o Union-Find detecta um ciclo num grafo?
> Ao processar uma aresta (a, b), se a e b já têm o mesmo representante, eles já estavam conectados, então essa aresta fecha um ciclo.

> [!question]+ Na união por tamanho, qual grupo vira filho de qual?
> - a) Sempre o segundo argumento vira filho do primeiro
> - b) O maior é pendurado embaixo do menor
> - c) O menor é pendurado embaixo do maior
> - d) Os dois viram filhos de um representante novo
>
> > [!check]- Resposta
> > **c)** Pendurar o menor no maior faz com que menos nós fiquem um nível mais longe do representante, o que mantém as árvores baixas. A a) funciona, mas sem garantia de altura: as árvores podem virar correntes.

---

## Pra consultar depois

| Operação | Sem truques | Com os dois truques |
|---|---|---|
| `encontrar` | O(n) no pior caso | ~O(1) |
| `unir` | O(n) no pior caso | ~O(1) |

**Pra ler e ver:** o [VisuAlgo, em Union-Find](https://visualgo.net/en/ufds), anima a compressão de caminho, que é a parte difícil de imaginar. O artigo do [cp-algorithms sobre DSU](https://cp-algorithms.com/data_structures/disjoint_set_union.html) é o mais completo, com aplicações e a prova do custo, pra quem quiser ir fundo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

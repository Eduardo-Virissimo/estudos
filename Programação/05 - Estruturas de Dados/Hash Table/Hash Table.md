---
nivel: escrito
revisado:
---

# Hash Table

Você chega num show, entrega a mochila no guarda-volumes e recebe uma ficha: "armário 214". Na saída, o funcionário não procura sua mochila entre as outras mil. Ele olha a ficha e vai direto no 214. A ficha transformou "a mochila da Marina" num número de armário, e o número leva direto ao lugar.

Agora imagine que não existe ficha, mas existe uma **regra** que transforma o seu nome num número de armário: qualquer funcionário, sabendo a regra, calcula "Marina → 214" e vai direto lá, tanto pra guardar quanto pra buscar. Essa regra é uma **função de hash**, e a estrutura que guarda as coisas nos armários calculados por ela é a **hash table** (tabela de dispersão).

Se tivesse que escolher uma estrutura só deste estágio pra entender de verdade, seria esta. É ela que está por trás do `Map`, do `Set` e dos objetos do JavaScript, dos dicionários do Python, dos índices de banco de dados, dos caches. E é ela que transforma um monte de soluções O(n²) em O(n): quando um exercício parece pedir dois laços, a resposta muitas vezes é "guarde o que já viu numa hash table". Ajuda ter passado por [[Arrays]] e por [[Map e Set no JavaScript]].

## A função de hash: de chave pra posição

A hash table é, por baixo, um array comum de "baldes" (os armários). Pra guardar o par `"marina" → "mochila azul"`, ela faz:

1. Calcula `hash("marina")`, um número grande.
2. Reduz esse número a uma posição válida: `hash % quantidadeDeBaldes`.
3. Guarda o par naquele balde.

Pra buscar, faz as mesmas contas e vai direto no balde. Como calcular o hash e acessar um array por índice são O(1), **buscar, inserir e remover custam O(1) em média**. Nada de percorrer.

Uma função de hash simples pra texto, só pra ver a ideia:

```ts
function hash(chave: string): number {
  let h = 0;
  for (const ch of chave) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0; // >>> 0 mantém um inteiro positivo de 32 bits
  }
  return h;
}

hash("ana");  // sempre o mesmo número pra "ana"
hash("anb");  // um número bem diferente
```

Uma boa função de hash tem duas propriedades. É **determinística**: a mesma chave dá sempre o mesmo número (senão você nunca acharia a mochila de novo). E **espalha bem**: chaves parecidas caem em posições bem diferentes, pra que os armários fiquem ocupados por igual. O `* 31` serve pra isso: sem ele, `"ab"` e `"ba"` teriam a mesma soma.

## Quando duas chaves caem no mesmo armário

Aqui está o ponto mais importante da nota. Existem infinitas chaves possíveis e um número limitado de baldes, então **duas chaves diferentes vão cair no mesmo balde**, inevitavelmente. Isso se chama **colisão**, e não é um bug: é parte do projeto. A pergunta é só como lidar com ela.

O jeito mais comum é o **encadeamento**: cada balde guarda uma listinha de pares. Na colisão, o par novo entra na lista do balde. Pra buscar, você vai no balde e procura **dentro da lista** comparando a chave de verdade.

```ts
class TabelaHash<V> {
  private baldes: [string, V][][] = Array.from({ length: 8 }, () => []);
  tamanho = 0;

  private balde(chave: string): [string, V][] {
    return this.baldes[hash(chave) % this.baldes.length];
  }

  set(chave: string, valor: V): void {
    const balde = this.balde(chave);
    const par = balde.find(([k]) => k === chave);
    if (par) {
      par[1] = valor;           // chave já existe: atualiza
      return;
    }
    balde.push([chave, valor]);
    this.tamanho++;
    if (this.tamanho > this.baldes.length * 0.75) this.redimensionar();
  }

  get(chave: string): V | undefined {
    return this.balde(chave).find(([k]) => k === chave)?.[1];
  }

  private redimensionar(): void {
    const antigos = this.baldes.flat();
    this.baldes = Array.from({ length: this.baldes.length * 2 }, () => []);
    for (const [k, v] of antigos) this.balde(k).push([k, v]); // reespalha tudo
  }
}
```

Repare que o `get` compara a chave de verdade (`k === chave`), não só o hash. Dois hashes iguais não querem dizer duas chaves iguais.

## Fator de carga, e por que a tabela cresce

Se você enfiar mil itens em 8 baldes, cada balde vira uma lista de uns 125 itens, e buscar volta a ser lento. A medida que controla isso é o **fator de carga**: itens divididos por baldes. Quando ele passa de um limite (0,75 é o valor clássico, e é o que o Java usa), a tabela **dobra o número de baldes e reespalha tudo**, porque com mais baldes o `% baldes.length` muda pra todo mundo.

Reespalhar é O(n), mas acontece cada vez mais raramente (a tabela dobra), então o custo médio do `set` continua O(1), como no array que cresce ([[Complexidade Amortizada]]).

E aí vem a honestidade que separa quem entende de quem decorou: o O(1) é **em média**. No pior caso, se todas as chaves colidirem no mesmo balde (por uma função de hash ruim, ou de propósito, num ataque), a tabela vira uma lista e cada operação é O(n). As linguagens se protegem disso com funções de hash boas e, em alguns casos, aleatórias por execução.

| Operação | Média | Pior caso |
|---|---|---|
| `set`, `get`, `has`, `delete` | O(1) | O(n) |
| Percorrer tudo | O(n) | O(n) |

## No JavaScript, você usa o Map

Você não vai escrever sua própria hash table no trabalho, o JavaScript tem o `Map`, e a nota [[Map e Set no JavaScript]] cobre a API. Mas agora você entende três coisas sobre ele que antes eram mágica.

A primeira: **por que objetos como chave de objeto quebram**. Num objeto comum `{}`, toda chave vira texto, e todo objeto vira o mesmo texto:

```js
// JavaScript puro (o TypeScript nem deixa compilar isto, e com razão)
const visitas = {};
const a = { id: 1 };
const b = { id: 2 };
visitas[a] = 1;
visitas[b] = 2;
console.log(visitas); // { "[object Object]": 2 }  ← os dois viraram a mesma chave
```

O `Map` aceita qualquer coisa como chave, usando a **identidade** do objeto, e resolve isso.

A segunda: **o padrão "já vi isso?"**, que é a hash table resolvendo exercício. O problema Two Sum pede dois números da lista que somem um alvo. Dois laços testam todos os pares, O(n²). Com um `Map` você percorre uma vez só, e pra cada número pergunta se o que falta já passou:

```ts
function twoSum(nums: number[], alvo: number): [number, number] | null {
  const visto = new Map<number, number>(); // valor → índice
  for (let i = 0; i < nums.length; i++) {
    const falta = alvo - nums[i];
    if (visto.has(falta)) return [visto.get(falta)!, i];
    visto.set(nums[i], i);
  }
  return null;
}
```

O(n) de tempo, pagando O(n) de memória. Essa troca, memória por velocidade, é o assunto de [[Trade-offs Tempo x Espaço]], e a hash table é o exemplo número um.

A terceira: **contar e agrupar**. Contar palavras, agrupar pedidos por cliente, indexar usuários por e-mail. Tudo isso é um `Map` sendo preenchido num laço só.

## O essencial

1. A função de hash transforma a chave numa posição do array de baldes; por isso buscar, inserir e remover são O(1) em média.
2. Colisões são inevitáveis; o encadeamento guarda uma lista por balde e compara a chave de verdade.
3. Quando o fator de carga passa do limite (~0,75), a tabela dobra e reespalha: O(1) amortizado.
4. Pior caso é O(n), quando tudo colide.
5. "Já vi isso?" com um `Map` transforma muito O(n²) em O(n).

## Agora é com você

Termine a `TabelaHash<V>` da nota em 📦 `estruturas-do-zero/src/hash-table.ts` ([[Estruturas de Dados do Zero]]): falta `has`, `delete` (que precisa diminuir o `tamanho`) e um método `estatisticas()` que devolve o tamanho do maior balde e quantos baldes estão vazios. Depois teste a função de hash: insira 10 mil chaves (`"usuario-0"` até `"usuario-9999"`) e veja as estatísticas. Agora troque a função de hash por uma ruim, que só soma os códigos das letras, e rode de novo. A diferença no maior balde é a lição. Terminou quando os testes cobrem atualizar uma chave existente (o `tamanho` não pode subir) e remover uma que não existe.

Daqui, siga pra [[Set]], que é uma hash table só de chaves.

---

## 🧠 Me teste

> [!question]- Por que buscar numa hash table é O(1) em média?
> Porque a função de hash calcula diretamente o índice do balde onde a chave está; não é preciso percorrer os outros itens.

> [!question]- O que é uma colisão e como o encadeamento resolve?
> Duas chaves diferentes caindo no mesmo balde. No encadeamento, cada balde guarda uma lista de pares, e a busca percorre essa lista curta comparando a chave real.

> [!question]- O que é o fator de carga e o que acontece quando ele fica alto?
> A razão itens/baldes. Quando passa do limite (por exemplo 0,75), a tabela dobra o número de baldes e redistribui todos os itens, pra manter as listas curtas.

> [!question]- Como o Two Sum sai de O(n²) pra O(n)?
> Percorrendo a lista uma vez e guardando num `Map` cada valor já visto; pra cada número, pergunta em O(1) se o complemento (`alvo - num`) já apareceu.

> [!question]- Por que usar objetos como chaves num objeto comum `{}` dá errado?
> Porque as chaves de objeto comum viram string, e todo objeto vira `"[object Object]"`. Todas as chaves colidem na mesma. O `Map` usa a identidade do objeto.

> [!question]+ Qual o custo de `get` numa hash table no pior caso?
> - a) O(1), sempre
> - b) O(n), quando todas as chaves colidem no mesmo balde
> - c) O(log n), porque os baldes são ordenados
> - d) O(n²), por causa do redimensionamento
>
> > [!check]- Resposta
> > **b)** O O(1) é a média com uma boa função de hash. Se tudo colide, o balde vira uma lista com n itens e a busca percorre todos. Os baldes não são ordenados, e o redimensionamento afeta o `set`, não o `get`.

---

## Pra consultar depois

| Conceito | Em uma linha |
|---|---|
| Função de hash | chave → número, sempre o mesmo, bem espalhado |
| Índice do balde | `hash(chave) % baldes.length` |
| Colisão | duas chaves no mesmo balde; normal |
| Encadeamento | cada balde é uma lista de pares |
| Fator de carga | itens / baldes; passou de ~0,75, dobra |
| Custo | O(1) médio, O(n) pior |

**Pra ler e ver:** o [Hashing, do Sam Rose](https://samwho.dev/hashing/), é uma explicação interativa linda: você vê as chaves caindo nos baldes e as colisões acontecendo. O [VisuAlgo, em hash table](https://visualgo.net/en/hashtable), anima encadeamento e as outras estratégias de colisão. E o [Two Sum](https://leetcode.com/problems/two-sum/) é o primeiro exercício do seu caderno.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

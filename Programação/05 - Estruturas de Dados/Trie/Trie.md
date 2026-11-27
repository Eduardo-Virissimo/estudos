---
nivel: escrito
foco: bom saber
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Trie

**Quanto focar: 💤 bom saber.** É específica pra autocomplete e problemas de prefixo. Conheça a ideia; aprofunde se cair num exercício.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 15 min de leitura, 5 min no Me teste e 1h no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Você digita "pro" na busca do seu vault e aparecem, antes de você terminar: "Promises", "Programação Dinâmica", "Profiling". A cada letra nova, a lista encolhe. Como fazer isso rápido com 10 mil títulos? O jeito ingênuo é percorrer os 10 mil a cada tecla perguntando `titulo.startsWith("pro")`. Funciona, mas a busca refaz todo o trabalho a cada letra, e com um dicionário de 300 mil palavras começa a engasgar.

Repare numa coisa sobre essas palavras: "Promises", "Programação" e "Profiling" **começam igual**. O "p-r-o" delas é o mesmo caminho. E se você guardasse as palavras de um jeito em que prefixos iguais **compartilham** o mesmo caminho? Digitar "pro" seria só andar três passos, e tudo que estiver pendurado embaixo dali é a resposta.

Essa é a **trie** (pronuncia-se "trái", de re*trie*val, recuperação), também chamada de árvore de prefixos. Cada nó é uma letra, cada caminho da raiz até um nó é um prefixo, e buscar uma palavra custa o **tamanho da palavra**, não importa quantas palavras existam. É a estrutura do autocomplete, do corretor ortográfico e do roteamento de URLs em vários frameworks web. Ajuda ter passado por [[Árvore Binária]] e [[Map e Set no JavaScript]].

## Cada nó é uma letra

Diferente da árvore binária, um nó de trie pode ter **muitos** filhos, um pra cada letra que pode vir a seguir. O jeito mais simples de guardar isso é um `Map` de letra pra nó. E cada nó tem uma marca dizendo se ali **termina** uma palavra:

```ts
class NoTrie {
  filhos = new Map<string, NoTrie>();
  fimDePalavra = false;
}
```

Guardando "pro", "prova" e "pra":

```text
(raiz)
  └ p
    └ r
      ├ o ●          ← "pro" termina aqui
      │ └ v
      │   └ a ●      ← "prova"
      └ a ●          ← "pra"
```

A marca `●` (o `fimDePalavra`) é essencial. Sem ela, você não saberia se "pro" é uma palavra guardada ou só o começo de "prova". Esquecê-la é o bug mais comum: a busca por "prov" responde "achei", porque o caminho existe, mesmo que ninguém tenha guardado "prov".

## Inserir e buscar: andar letra por letra

Inserir é descer pela palavra criando os nós que faltam; no fim, marca:

```ts
class Trie {
  private raiz = new NoTrie();

  inserir(palavra: string): void {
    let no = this.raiz;
    for (const letra of palavra) {
      if (!no.filhos.has(letra)) no.filhos.set(letra, new NoTrie());
      no = no.filhos.get(letra)!;
    }
    no.fimDePalavra = true;
  }

  private descer(prefixo: string): NoTrie | null {
    let no = this.raiz;
    for (const letra of prefixo) {
      const proximo = no.filhos.get(letra);
      if (!proximo) return null;               // o caminho acabou: ninguém começa assim
      no = proximo;
    }
    return no;
  }

  contem(palavra: string): boolean {
    return this.descer(palavra)?.fimDePalavra === true;
  }

  temPrefixo(prefixo: string): boolean {
    return this.descer(prefixo) !== null;
  }
```

Repare como `contem` e `temPrefixo` usam o mesmo `descer` e só diferem na marca. Os dois custam O(m), em que m é o tamanho da palavra. Com 10 palavras ou 10 milhões, buscar "prova" são 5 passos.

## O autocomplete

Agora o que a trie faz que nenhuma outra estrutura faz bem: listar tudo que começa com um prefixo. Desça até o fim do prefixo e, a partir dali, colete todas as palavras da subárvore, com uma [[DFS (Busca em Profundidade)]] que vai montando as letras pelo caminho:

```ts
  comPrefixo(prefixo: string, limite = 10): string[] {
    const inicio = this.descer(prefixo);
    if (!inicio) return [];
    const resultado: string[] = [];

    const coletar = (no: NoTrie, atual: string) => {
      if (resultado.length >= limite) return;   // já temos o bastante
      if (no.fimDePalavra) resultado.push(atual);
      for (const [letra, filho] of no.filhos) coletar(filho, atual + letra);
    };

    coletar(inicio, prefixo);
    return resultado;
  }
}

const t = new Trie();
["pro", "prova", "pra", "git"].forEach((p) => t.inserir(p));
t.comPrefixo("pr"); // ["pro", "prova", "pra"]
```

O `limite` não é enfeite. Um autocomplete nunca mostra 50 mil sugestões, e parar cedo é o que mantém a busca rápida quando o prefixo é curto (só "p" teria milhares de palavras embaixo).

## Quando a trie vale a pena

A trie não é sempre a resposta. Ela gasta **muita memória**: um nó, com um `Map` inteiro, por letra. Pra só responder "esta palavra existe?", um [[Set]] faz o mesmo em O(m) (o hash também lê a palavra toda) com bem menos memória. A trie ganha quando a pergunta é sobre **prefixos**:

| Pergunta | Set | Trie |
|---|---|---|
| "prova" existe? | O(m) | O(m) |
| Alguém começa com "pro"? | O(n × m): testa todos | O(m) |
| Liste quem começa com "pro" | O(n × m) | O(m + resultado) |
| Memória | pouca | muita |

E pra autocomplete de verdade com muita gente usando, entra mais uma camada: guardar no nó as palavras mais buscadas daquele prefixo, pra não precisar coletar nada. Mas a base é esta.

Uma pegadinha final: maiúsculas e acentos. "Programação" e "programacao" são caminhos diferentes na trie. Normalize as palavras antes de inserir e antes de buscar, como em [[Strings]], e guarde o título original no nó final pra mostrar bonito.

## O essencial

1. Trie é uma árvore de prefixos: cada nó é uma letra, prefixos iguais compartilham o caminho.
2. Buscar e inserir custam O(m), o tamanho da palavra, não importa quantas palavras há.
3. A marca `fimDePalavra` separa "é uma palavra" de "é só um prefixo".
4. Autocomplete: desce até o prefixo e coleta a subárvore com DFS, parando no limite.
5. Gasta muita memória; só vale quando a pergunta é sobre prefixos.

## Agora é com você

Monte a `Trie` em 📦 `estruturas-do-zero/src/trie.ts` ([[Estruturas de Dados do Zero]]) e faça um autocomplete dos títulos do seu próprio vault: leia os nomes das pastas de `Programação/` com o `fs` ([[Ler e Escrever Arquivos]]), normalize (minúsculas, sem acento) pra inserir, mas guarde o título original pra mostrar. Um script que recebe o prefixo pelo terminal e imprime até 5 sugestões. Depois adicione `remover(palavra)`, que é o difícil: desmarcar o `fimDePalavra` é fácil, mas os nós que ficaram sem uso precisam ser apagados de baixo pra cima, sem apagar os que outras palavras ainda usam. Terminou quando `remover("prova")` não estraga `contem("pro")`.

Daqui, siga pra [[Union-Find (Disjoint Set)]] ou direto pra [[Grafos]].

---

## 🧠 Me teste

> [!question]- Por que buscar numa trie custa O(m), e não depende de quantas palavras existem?
> Porque a busca anda um nó por letra da palavra procurada; as outras palavras ficam em outros galhos e nunca são visitadas.

> [!question]- Pra que serve a marca `fimDePalavra`?
> Pra distinguir uma palavra guardada de um simples prefixo de outra. Sem ela, buscar "prov" diria que existe só porque "prova" passa por ali.

> [!question]- Como a trie faz autocomplete?
> Desce até o nó do último caractere do prefixo e coleta, com DFS, todas as palavras marcadas na subárvore dali, até um limite.

> [!question]- Quando um Set é melhor que uma trie?
> Quando só se pergunta "esta palavra existe?": o custo é parecido e o Set gasta muito menos memória. A trie só compensa pra perguntas de prefixo.

> [!question]+ Uma trie guarda só a palavra "casa". O que `contem("cas")` devolve?
> - a) `true`, porque o caminho c-a-s existe
> - b) `false`, porque o nó do "s" não tem a marca de fim de palavra
> - c) `undefined`
> - d) Dá erro, porque "cas" não foi inserido
>
> > [!check]- Resposta
> > **b)** O caminho existe, mas "cas" nunca foi guardado como palavra: só o nó do último "a" de "casa" tem `fimDePalavra`. Quem responde a) esqueceu a marca. `temPrefixo("cas")`, esse sim, daria `true`.

---

## Pra consultar depois

| Operação | Custo |
|---|---|
| Inserir | O(m) |
| Contém / tem prefixo | O(m) |
| Listar com prefixo | O(m + tamanho do resultado) |
| Memória | um nó por letra distinta de cada caminho |

**Pra ler e ver:** a [visualização de trie da USFCA](https://www.cs.usfca.edu/~galles/visualization/Trie.html) monta a árvore letra por letra enquanto você insere. O [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/) do LeetCode é exatamente a classe desta nota, e o [Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure/) é o passo seguinte, com curinga.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
revisado:
---

# Árvore Binária de Busca (BST)

Aquele jogo de adivinhar o número: "pensei num número de 1 a 100". Você chuta 50. "É menor." Chuta 25. "É maior." Chuta 37. Em no máximo 7 chutes você acerta qualquer número, porque cada resposta joga fora **metade** das possibilidades. Agora imagine guardar os seus dados de um jeito em que cada nó faz essa pergunta por você: tudo que é menor fica à esquerda, tudo que é maior fica à direita. Buscar vira descer a árvore respondendo "menor ou maior?".

Essa é a **árvore binária de busca**, ou BST (*binary search tree*). Ela é uma [[Árvore Binária]] com uma regra a mais, e essa regra dá uma coisa que nenhuma estrutura anterior tinha: dados **sempre ordenados** em que inserir, buscar e remover custam O(log n) quando a árvore está equilibrada. O [[Set]] responde "existe?" em O(1), mas não responde "qual o menor?" nem "quais estão entre 10 e 20?". A BST responde. E ela tem um calcanhar de Aquiles que é tão importante quanto as virtudes, e que vai aparecer na terceira seção.

## A regra que organiza tudo

Pra todo nó da árvore: **tudo na subárvore da esquerda é menor que ele, e tudo na subárvore da direita é maior**. Não só os filhos diretos: a subárvore inteira.

```text
          50
        /    \
      30      70
     /  \    /  \
   20   40  60   80
```

Buscar o 60: começa no 50, 60 é maior, vai pra direita. Chega no 70, 60 é menor, vai pra esquerda. Achou. Três comparações numa árvore de sete nós. A cada passo, você descarta uma subárvore inteira, exatamente como no jogo de adivinhar.

```ts
class No {
  constructor(
    public valor: number,
    public esquerda: No | null = null,
    public direita: No | null = null,
  ) {}
}

class ArvoreBusca {
  raiz: No | null = null;

  contem(valor: number): boolean {
    let atual = this.raiz;
    while (atual !== null) {
      if (valor === atual.valor) return true;
      atual = valor < atual.valor ? atual.esquerda : atual.direita;
    }
    return false; // caiu num null: não existe
  }

  inserir(valor: number): void {
    const novo = new No(valor);
    if (this.raiz === null) { this.raiz = novo; return; }
    let atual = this.raiz;
    while (true) {
      if (valor === atual.valor) return;          // já existe: decidimos não duplicar
      if (valor < atual.valor) {
        if (atual.esquerda === null) { atual.esquerda = novo; return; }
        atual = atual.esquerda;
      } else {
        if (atual.direita === null) { atual.direita = novo; return; }
        atual = atual.direita;
      }
    }
  }
}
```

Inserir é buscar até cair num lugar vazio e pendurar o nó novo ali. Os dois custam O(h), em que h é a altura da árvore. E repare na decisão sobre **valores repetidos**: aqui eles são ignorados. Outra opção é mandá-los sempre pra direita, ou guardar um contador no nó. Qualquer uma serve; o erro é não decidir e ter uma árvore que às vezes duplica e às vezes não.

## A em-ordem sai ordenada

Lembra da travessia em-ordem (esquerda, eu, direita) da nota anterior? Numa BST, ela visita os valores **em ordem crescente**, de graça. Pense: primeiro tudo que é menor que a raiz (a esquerda, também em ordem), depois a raiz, depois tudo que é maior.

```ts
emOrdem(no = this.raiz, saida: number[] = []): number[] {
  if (no === null) return saida;
  this.emOrdem(no.esquerda, saida);
  saida.push(no.valor);
  this.emOrdem(no.direita, saida);
  return saida;
}
// na árvore do exemplo: [20, 30, 40, 50, 60, 70, 80]
```

Outras perguntas de ordem também ficam fáceis. O **menor** valor é o nó mais à esquerda (desce pela esquerda até não dar mais); o **maior**, o mais à direita. "Todos entre 35 e 65" é uma em-ordem que não desce pelos galhos que estão fora do intervalo.

Essa propriedade dá um teste ótimo pra saber se uma árvore é BST: faça a em-ordem e veja se saiu ordenada. E evita um erro clássico: achar que basta conferir cada nó com os filhos diretos. Na árvore abaixo, cada pai está certo com os seus filhos, mas o 60 está na subárvore esquerda do 50, e não pode.

```text
       50
      /
    30
      \
       60    ← maior que 50, mas está à esquerda dele: NÃO é BST
```

## O calcanhar de Aquiles: inserir em ordem

Agora o lado sombrio. Insira 10, 20, 30, 40, 50 numa BST vazia, nessa ordem. O 10 vira raiz. O 20 é maior, vai pra direita. O 30 é maior que os dois, vai pra direita do 20. E assim:

```text
10
  \
   20
     \
      30
        \
         40
           \
            50
```

Isso não é uma árvore, é uma [[Listas Ligadas|lista ligada]] deitada. Buscar o 50 passa por todos. A altura é n, e o O(log n) prometido virou **O(n)**. E o pior é que dados chegando já ordenados não são raros, são comuns: ids crescentes, datas, nomes já em ordem alfabética.

Se esquecer tudo desta nota, lembre disto: **a BST simples só é rápida se a árvore ficar baixa, e ela não tem nenhuma garantia disso.** As árvores que resolvem esse problema se reorganizam sozinhas a cada inserção, e são o assunto de [[Árvores Balanceadas (AVL e Rubro-Negra)]]. São elas que existem nas bibliotecas de verdade (o `TreeMap` do Java, o `std::map` do C++) e nos índices dos bancos de dados (uma prima delas, a B-tree).

| Operação | Equilibrada | Degenerada (pior caso) |
|---|---|---|
| Buscar, inserir, remover | O(log n) | O(n) |
| Menor / maior | O(log n) | O(n) |
| Listar em ordem | O(n) | O(n) |

## Remover, o caso que dá trabalho

Buscar e inserir são tranquilos. Remover tem três casos, e o terceiro é a parte mais difícil da BST:

1. **O nó é folha:** só solta ele (o pai aponta pra `null`).
2. **O nó tem um filho:** o pai passa a apontar direto pro neto.
3. **O nó tem dois filhos:** não dá pra simplesmente tirar. Você troca o valor dele pelo **sucessor** (o menor valor da subárvore da direita, que é o próximo na ordem) e remove o sucessor lá embaixo, que sempre cai no caso 1 ou 2.

A versão recursiva fica bem mais limpa que a iterativa, porque cada chamada devolve a nova raiz da subárvore:

```ts
private removerDe(no: No | null, valor: number): No | null {
  if (no === null) return null;                       // não achou
  if (valor < no.valor) no.esquerda = this.removerDe(no.esquerda, valor);
  else if (valor > no.valor) no.direita = this.removerDe(no.direita, valor);
  else {
    if (no.esquerda === null) return no.direita;      // casos 1 e 2
    if (no.direita === null) return no.esquerda;
    let sucessor = no.direita;                        // caso 3
    while (sucessor.esquerda) sucessor = sucessor.esquerda;
    no.valor = sucessor.valor;
    no.direita = this.removerDe(no.direita, sucessor.valor);
  }
  return no;
}

remover(valor: number): void {
  this.raiz = this.removerDe(this.raiz, valor);
}
```

Desenhe a árvore do exemplo e remova o 50 (a raiz, com dois filhos) acompanhando o código. O sucessor é o 60, que sobe pra raiz, e o 60 original sai da subárvore da direita. Fazer isso uma vez no papel vale mais que ler a explicação três vezes.

## O essencial

1. BST: tudo à esquerda é menor, tudo à direita é maior, em **toda** a subárvore.
2. Buscar e inserir descem a árvore descartando metade a cada passo: O(h).
3. A travessia em-ordem devolve os valores ordenados.
4. Inserir dados já ordenados degenera a BST numa lista: O(n). É por isso que existem árvores balanceadas.
5. Remover nó com dois filhos: troca pelo sucessor (menor da direita) e remove o sucessor.

## Agora é com você

Monte a `ArvoreBusca` completa em 📦 `estruturas-do-zero/src/bst.ts`, uma das quatro estruturas obrigatórias do [[Estruturas de Dados do Zero|projeto do estágio]]: `inserir`, `contem`, `remover`, `emOrdem`, `menor`, `maior` e `altura`. Os testes precisam cobrir os três casos de remoção (incluindo remover a raiz) e conferir, depois de cada remoção, que `emOrdem()` continua ordenada. Depois faça o experimento: insira os números de 1 a 1000 em ordem e imprima a altura; depois insira os mesmos 1000 embaralhados e imprima de novo. A diferença entre 999 e algo perto de 20 é a lição da terceira seção, medida por você. Bônus: resolva o [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) e caia (ou não) na armadilha do 60.

Daqui, siga pra [[Heap (Estrutura de Dados)]], ou pra [[Árvores Balanceadas (AVL e Rubro-Negra)]] se quiser ver como a degeneração é resolvida.

---

## 🧠 Me teste

> [!question]- Qual é a regra de uma BST?
> Pra todo nó, todos os valores da subárvore esquerda são menores que ele e todos os da subárvore direita são maiores. Vale pra subárvore inteira, não só pros filhos diretos.

> [!question]- Por que a travessia em-ordem de uma BST sai ordenada?
> Porque ela visita primeiro tudo que é menor (a esquerda), depois o nó, depois tudo que é maior (a direita), e faz o mesmo recursivamente em cada subárvore.

> [!question]- Como achar o menor valor de uma BST?
> Descendo sempre pela esquerda a partir da raiz até um nó que não tenha filho esquerdo.

> [!question]- Como se remove um nó que tem dois filhos?
> Substitui-se o valor dele pelo do sucessor (o menor valor da subárvore direita) e remove-se o sucessor, que tem no máximo um filho.

> [!question]+ Você insere 1, 2, 3, 4 e 5, nessa ordem, numa BST vazia. Quanto custa buscar o 5?
> - a) O(n): a árvore virou uma linha e a busca passa por todos
> - b) O(log n), como em toda BST
> - c) O(1), porque o 5 foi o último inserido
> - d) Não dá pra inserir valores ordenados numa BST
>
> > [!check]- Resposta
> > **a)** Cada valor novo é maior que todos, então vai sempre pra direita, e a árvore degenera numa lista de altura n. O O(log n) só vale se a árvore estiver equilibrada, e a BST simples não garante isso.

---

## Pra consultar depois

| Pergunta | Como |
|---|---|
| Buscar | menor → esquerda, maior → direita, até achar ou cair no `null` |
| Inserir | buscar até o `null` e pendurar ali |
| Menor / maior | sempre pela esquerda / sempre pela direita |
| Ordenado | travessia em-ordem |
| Remover com 2 filhos | trocar pelo sucessor (menor da direita) |
| Custo | O(h): log n equilibrada, n degenerada |

**Pra ler e ver:** o [VisuAlgo, em BST](https://visualgo.net/en/bst), deixa você inserir e remover e mostra cada comparação; tente inserir 1, 2, 3, 4, 5 e assista à degeneração. O capítulo de BST do [Hello Algo](https://www.hello-algo.com/en/chapter_tree/binary_search_tree/) desenha os três casos de remoção, passo a passo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

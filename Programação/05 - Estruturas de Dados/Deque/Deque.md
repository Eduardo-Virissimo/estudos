---
nivel: escrito
foco: bom saber
revisado:
---

# Deque

**Quanto focar: 💤 bom saber.** É uma variação da fila que aparece em poucos problemas. Conheça a ideia; aprofunde se cair num exercício.

**Quanto tempo:** cerca de 1h: 15 min de leitura, 5 min no Me teste e 40 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

O seu editor guarda os últimos 50 arquivos abertos. Quando você abre um arquivo, ele entra **na frente** da lista. Quando a lista passa de 50, o mais antigo sai **pelo fundo**. E se você reabre um arquivo antigo, ele é tirado de onde estava e volta pra frente. Isso não é bem uma pilha (que só mexe numa ponta) nem uma fila (que entra por uma e sai pela outra). É uma estrutura que deixa entrar e sair **pelas duas pontas**.

Esse é o **deque** (pronuncia-se "dék", de *double-ended queue*, fila de duas pontas). Ele é uma generalização das duas notas anteriores: usando só uma ponta, é uma [[Pilhas|pilha]]; entrando por uma e saindo pela outra, é uma [[Filas|fila]]. E é a ferramenta exata pra um tipo de problema que aparece bastante: manter "os últimos N" de alguma coisa, e a janela deslizante com máximo.

## Quatro operações, todas O(1)

```text
        inserirNaFrente           inserirNoFim
              ↓                        ↓
          [ A ][ B ][ C ][ D ][ E ]
              ↑                        ↑
        removerDaFrente          removerDoFim
```

O JavaScript não tem deque pronto. O array até tem as quatro operações (`unshift`, `push`, `shift`, `pop`), mas você já sabe o problema: `unshift` e `shift` são O(n) ([[Arrays]]). Pra ter as quatro em O(1), existem dois caminhos: uma [[Listas Ligadas|lista duplamente ligada]], ou um **buffer circular**, que é o jeito mais usado e o mais bonito.

## O buffer circular

Imagine um array de tamanho fixo cujas pontas estão **coladas**, como um relógio: depois da posição 7 vem a 0 de novo. Você guarda onde está a frente e quantos itens tem. Inserir na frente é andar a frente uma casa pra trás (dando a volta se precisar); inserir no fim é escrever na casa logo depois do último.

```ts
class Deque<T> {
  private buf: (T | undefined)[];
  private frente = 0;
  tamanho = 0;

  constructor(capacidade = 8) {
    this.buf = new Array(capacidade);
  }

  private indice(i: number): number {
    // a posição i a partir da frente, dando a volta no array
    return (this.frente + i) % this.buf.length;
  }

  inserirNoFim(x: T): void {
    if (this.tamanho === this.buf.length) this.crescer();
    this.buf[this.indice(this.tamanho)] = x;
    this.tamanho++;
  }

  inserirNaFrente(x: T): void {
    if (this.tamanho === this.buf.length) this.crescer();
    this.frente = (this.frente - 1 + this.buf.length) % this.buf.length;
    this.buf[this.frente] = x;
    this.tamanho++;
  }

  removerDaFrente(): T | undefined {
    if (this.tamanho === 0) return undefined;
    const x = this.buf[this.frente];
    this.buf[this.frente] = undefined;
    this.frente = (this.frente + 1) % this.buf.length;
    this.tamanho--;
    return x;
  }

  removerDoFim(): T | undefined {
    if (this.tamanho === 0) return undefined;
    const i = this.indice(this.tamanho - 1);
    const x = this.buf[i];
    this.buf[i] = undefined;
    this.tamanho--;
    return x;
  }

  private crescer(): void {
    const novo = new Array<T | undefined>(this.buf.length * 2);
    for (let i = 0; i < this.tamanho; i++) novo[i] = this.buf[this.indice(i)];
    this.buf = novo;
    this.frente = 0;
  }
}
```

O segredo está no operador `%` (resto da divisão). Com 8 posições, `(7 + 1) % 8` dá 0: passou do fim, voltou pro começo. E repare no `- 1 + this.buf.length` do `inserirNaFrente`: em JavaScript, `-1 % 8` dá `-1`, não `7`. Somar o tamanho antes do `%` garante que o índice nunca fica negativo. Esse é o bug clássico do buffer circular, e agora você já o conhece antes de cometê-lo.

O `crescer` copia tudo pra um array com o dobro do tamanho, "desenrolando" o círculo a partir da frente. É raro, então o custo médio continua O(1).

## Onde o deque brilha

**Os últimos N.** O histórico de arquivos do começo: insere na frente e, se passou do limite, remove do fim. O mesmo vale pra "as últimas 100 linhas de log" ou "os últimos 10 comandos digitados".

**Palíndromos.** Ponha as letras no deque e vá tirando uma da frente e uma do fim, comparando. Se todas baterem, é palíndromo. (Com [[Two Pointers]] dá pra fazer o mesmo sem estrutura nenhuma, mas é um bom treino.)

**O máximo de cada janela.** Este é o uso avançado, e o mais famoso em entrevista. Dado um array de temperaturas, qual a máxima de cada janela de 3 dias consecutivos? O jeito ingênuo olha os 3 de cada janela, O(n × k). O jeito com deque guarda os índices dos candidatos a máximo, em ordem decrescente de valor: cada novo dia expulsa pelo fim todos os mais frios que ele (eles nunca mais vão ser o máximo), e o da frente sai quando a janela passa por ele. Cada índice entra e sai uma vez só, então o total é O(n). Guarde a ideia e volte a ela quando estudar a [[Sliding Window]]: é o problema [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/).

## O essencial

1. Deque é uma fila de duas pontas: insere e remove na frente e no fim.
2. Pilha e fila são casos particulares de deque.
3. Com array puro, `unshift`/`shift` são O(n); deque de verdade usa buffer circular ou lista duplamente ligada, tudo O(1).
4. No buffer circular, `%` dá a volta, e `(i - 1 + n) % n` evita índice negativo.
5. Use pra "os últimos N" e pra máximo/mínimo de janela deslizante.

## Agora é com você

Copie o `Deque` da nota pra 📦 `estruturas-do-zero/src/deque.ts` ([[Estruturas de Dados do Zero]]), adicione `obter(i)` e um `[Symbol.iterator]`, e escreva um teste que force o círculo a dar a volta: capacidade 4, insere no fim 3 vezes, remove da frente 2, insere no fim mais 4 (os três primeiros dão a volta pelo começo do array, e o quarto obriga a crescer no meio da volta). Confira com `[...deque]` que a ordem está certa. Depois use o deque pra fazer a classe `Historico` do começo da nota, com limite configurável. Terminou quando o teste da volta passa e o histórico nunca passa do limite.

Daqui, siga pra [[Hash Table]], a estrutura mais útil do estágio.

---

## 🧠 Me teste

> [!question]- Como um deque pode se comportar como pilha e como fila?
> Usando só uma ponta (inserir e remover no fim), é pilha. Inserindo no fim e removendo da frente, é fila.

> [!question]- O que é um buffer circular?
> Um array de tamanho fixo em que, depois da última posição, se volta pra primeira (índice com `%`). Guardando a frente e o tamanho, inserir e remover nas duas pontas é O(1).

> [!question]- Por que `(frente - 1 + n) % n` e não só `(frente - 1) % n`?
> Porque em JavaScript o `%` de número negativo dá negativo (`-1 % 8 === -1`). Somar `n` antes garante um índice válido entre 0 e n-1.

> [!question]- Como o deque ajuda a achar o máximo de cada janela deslizante em O(n)?
> Guardando os índices dos candidatos em ordem decrescente de valor: cada elemento novo remove pelo fim os menores que ele, e o da frente sai quando fica fora da janela. Cada índice entra e sai uma vez.

> [!question]+ Por que não basta usar um array do JavaScript com `unshift` e `shift` como deque?
> - a) Porque essas operações não existem em arrays
> - b) Porque elas deslocam todos os elementos e custam O(n)
> - c) Porque arrays não aceitam inserir no começo
> - d) Pode usar sem problema, elas são O(1)
>
> > [!check]- Resposta
> > **b)** Elas existem e funcionam, mas mexer no começo de um array move todos os outros itens. Com muitos itens e muitas operações, fica lento. O buffer circular só muda um índice.

---

## Pra consultar depois

| Operação | Array puro | Buffer circular |
|---|---|---|
| Inserir/remover no fim | O(1) | O(1) |
| Inserir/remover na frente | O(n) | O(1) |
| Acessar a posição i | O(1) | O(1): `(frente + i) % n` |

**Pra ler:** o capítulo de deque do [Hello Algo](https://www.hello-algo.com/en/chapter_stack_and_queue/deque/) tem as duas implementações (array circular e lista duplamente ligada) desenhadas passo a passo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: importante
revisado:
---

# Sliding Window

**Quanto focar: 📌 importante.** É um dos padrões que mais aparecem em entrevista. Entenda o molde e pratique alguns problemas.

**⏱️ Quanto tempo: cerca de 1h30.** Uns 15 min de leitura, 5 min no Me teste e 1h15 no desafio.

**🔁 Pra rever: cerca de 10 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você tem as vendas diárias de uma loja no ano inteiro, 365 números, e quer saber qual foi a melhor **semana**: os 7 dias seguidos com a maior soma. O jeito óbvio é, pra cada dia de início, somar os 7 dias a partir dele. São 359 semanas possíveis, cada uma com 7 somas. Funciona. Mas agora troque "semana" por "período de 90 dias" e "ano" por "10 anos de dados": o jeito óbvio vira centenas de milhares de somas, quase todas repetidas.

Repare no que muda de uma semana pra seguinte. A semana de segunda a domingo e a de terça a segunda têm **seis dias em comum**. Só entra um dia novo (a segunda seguinte) e sai um dia velho (a primeira segunda). Então, em vez de somar 7 números de novo, basta pegar a soma anterior, **somar o que entrou e subtrair o que saiu**.

Isso é a **janela deslizante** (*sliding window*): um trecho contíguo da lista que anda pra frente, atualizado a cada passo só com o que entra e o que sai. Ela transforma um O(n × k) em **O(n)**, e resolve uma família enorme de problemas de subarray e substring. Ajuda ter passado por [[Arrays]] e [[Strings]].

## Janela de tamanho fixo

O problema da melhor semana:

```ts
function maiorSomaDeK(vendas: number[], k: number): number {
  if (vendas.length < k) throw new Error("dados insuficientes");
  let soma = 0;
  for (let i = 0; i < k; i++) soma += vendas[i];  // a primeira janela, montada uma vez
  let melhor = soma;

  for (let fim = k; fim < vendas.length; fim++) {
    soma += vendas[fim];           // entra o dia novo
    soma -= vendas[fim - k];       // sai o dia que ficou pra trás
    melhor = Math.max(melhor, soma);
  }
  return melhor;
}
```

Cada dia entra uma vez e sai uma vez: O(n), não importa o tamanho de k. A pegadinha é o índice do que sai: `fim - k`. Faça a conta no papel com k = 3 antes de confiar: quando o `fim` está no índice 3, a janela é 1, 2, 3, e quem sai é o 0. Certo.

O mesmo formato calcula **médias móveis** (aquela linha suave em cima do gráfico de ações, ou a média dos últimos 7 dias de casos de uma doença): é a soma da janela dividida por k.

## Janela de tamanho variável

O uso mais poderoso é quando a janela **não tem tamanho fixo**: ela cresce e encolhe conforme uma condição. O problema clássico: qual o **maior trecho de uma string sem letra repetida**? Em `"abcabcbb"`, é `"abc"`, com 3.

A ideia: dois índices, `ini` e `fim`. O `fim` anda sempre pra frente, **crescendo** a janela. Quando a janela fica **inválida** (aparece uma letra repetida), o `ini` anda pra frente, **encolhendo**, até ela voltar a ser válida. A cada passo, a janela válida é uma candidata à resposta.

```ts
function maiorSemRepetir(s: string): number {
  const naJanela = new Set<string>();
  let ini = 0;
  let melhor = 0;

  for (let fim = 0; fim < s.length; fim++) {
    while (naJanela.has(s[fim])) {   // a letra nova repetiria: encolhe pela esquerda
      naJanela.delete(s[ini]);
      ini++;
    }
    naJanela.add(s[fim]);            // agora cabe: cresce pela direita
    melhor = Math.max(melhor, fim - ini + 1);
  }
  return melhor;
}

maiorSemRepetir("abcabcbb"); // 3
```

Tem um `while` dentro do `for`, e o instinto diz O(n²). Mas olhe de outro jeito: o `ini` só anda pra frente e nunca passa do `fim`. Ao longo do laço inteiro, ele anda no máximo n vezes **no total**, não n vezes por volta. Então o total é O(n) pro `fim` mais O(n) pro `ini`: **O(n)**. Esse raciocínio de "quantas vezes cada ponteiro anda no total" é a chave pra analisar janelas, e aparece em entrevista.

E o tamanho da janela é `fim - ini + 1`, com o `+ 1` porque os dois índices estão incluídos. Esquecer esse `+ 1` é o erro de um mais comum da técnica.

## O molde de todo problema de janela

Quase toda janela variável segue o mesmo molde, e reconhecê-lo acelera muito:

```ts
let ini = 0;
for (let fim = 0; fim < n; fim++) {
  // 1. coloque a[fim] na janela (atualize soma, contagem, Set...)
  while (/* a janela está inválida */) {
    // 2. tire a[ini] da janela e avance ini
  }
  // 3. a janela [ini, fim] é válida: compare com a melhor resposta
}
```

O que muda de um problema pro outro é só **o que a janela guarda** (uma soma, um `Set`, um `Map` de contagem) e **o que é "inválida"** (soma passou do limite, letra repetida, mais de k letras diferentes). Pra problemas de "a **menor** janela que satisfaz...", a lógica se inverte: enquanto a janela **é válida**, registre a resposta e encolha.

Os sinais de que um problema é de janela: ele fala de **subarray** ou **substring** (trecho **contíguo**), e pede o maior, o menor, ou a contagem de trechos que satisfazem uma condição. Se a palavra for "subsequência" (que pode pular elementos), não é janela, provavelmente é [[Programação Dinâmica]].

Um aviso: a janela variável com soma só funciona quando **todos os números são positivos**. Com negativos, adicionar um número pode diminuir a soma, e a regra "cresce até ficar inválida, encolhe até voltar" deixa de valer. Aí a ferramenta é outra (somas de prefixo com um `Map`).

## O essencial

1. Janela deslizante: um trecho contíguo que anda, atualizado só com o que entra e o que sai.
2. Tamanho fixo: some o que entra, subtraia o que sai (`a[fim - k]`); O(n).
3. Tamanho variável: `fim` cresce sempre; `ini` encolhe enquanto a janela estiver inválida.
4. O `while` dentro do `for` é O(n) no total, porque `ini` só anda pra frente.
5. Sinal: "subarray/substring" + maior/menor/contagem. Com números negativos, a janela de soma não funciona.

## Agora é com você

Em 📦 `estruturas-do-zero/exercicios/` ([[Estruturas de Dados do Zero]]), resolva [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) (janela fixa), [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (a da nota, sem olhar), [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) (a menor janela) e [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/), que é o difícil. Pra cada um, escreva no comentário do topo o que a janela guarda e o que a torna inválida. Bônus de mundo real: calcule a média móvel de 7 dias do seu tempo de estudo, se a Ficha do herói já tiver alguns dias de registro.

Daqui, siga pra [[Two Pointers]], a prima da janela.

---

## 🧠 Me teste

> [!question]- Como a janela deslizante transforma O(n × k) em O(n) na soma de k elementos seguidos?
> Em vez de recalcular a soma inteira a cada posição, ela soma o elemento que entra e subtrai o que sai; cada elemento é tocado duas vezes no total.

> [!question]- Por que o algoritmo da maior substring sem repetição é O(n), mesmo com um `while` dentro do `for`?
> Porque o `ini` só anda pra frente e nunca passa do `fim`; somando todas as voltas, ele avança no máximo n vezes no total.

> [!question]- Qual o tamanho da janela entre os índices `ini` e `fim`, incluindo os dois?
> `fim - ini + 1`.

> [!question]- Que palavras no enunciado indicam janela deslizante?
> Subarray ou substring (trechos contíguos), pedindo o maior, o menor ou quantos trechos satisfazem uma condição.

> [!question]+ Você quer o menor subarray com soma ≥ 10, mas o array tem números negativos. A janela variável funciona?
> - a) Sim, a janela funciona com qualquer número
> - b) Sim, desde que o array esteja ordenado
> - c) Não: com negativos, crescer a janela pode diminuir a soma, e a regra de encolher deixa de valer
> - d) Não, porque janelas só funcionam com strings
>
> > [!check]- Resposta
> > **c)** A janela de soma depende de "crescer aumenta a soma, encolher diminui". Um número negativo quebra isso: a janela pode ficar inválida e voltar a ser válida crescendo. Pra esses casos usa-se somas de prefixo com `Map` (ou um deque monotônico).

---

## Pra consultar depois

| Tipo | Molde |
|---|---|
| Fixa | `soma += a[fim]; soma -= a[fim - k];` |
| Variável, maior | cresce `fim`; `while (inválida)` encolhe `ini`; registra |
| Variável, menor | cresce `fim`; `while (válida)` registra e encolhe `ini` |
| Tamanho | `fim - ini + 1` |

**Pra ler:** a lista "Sliding Window" do roadmap da [NeetCode](https://neetcode.io/roadmap) tem os problemas da técnica em ordem de dificuldade, cada um com um vídeo curto desenhando a janela.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
revisado:
---

# Ler Documentação

Muita gente que trava numa conversa em inglês lê documentação técnica sem esforço nenhum. Parece contraditório, mas tem explicação. A documentação é o inglês **mais fácil** que existe: frases curtas, um vocabulário muito repetitivo (a mesma meia dúzia de palavras aparece em todo lugar), e um assunto que você já entende. Se você sabe o que é uma função, entende *This function returns a string* mesmo sem conhecer metade das palavras.

Então o problema de ler documentação raramente é o inglês. É outro: a página tem dezenas de seções, você abre a primeira, começa a ler de cima pra baixo, e meia hora depois ainda não achou o que procurava. O segredo não é ler tudo. É **saber onde olhar**.

E quase toda documentação tem a mesma estrutura, em qualquer ferramenta: Getting Started, Guides, API Reference, e assim por diante. Quando você conhece esse mapa, pula direto pra parte que resolve o seu problema. É disso que esta nota trata. Ajuda ter passado pela [[Leitura Extensiva]] e pelo [[Vocabulário Técnico]].

## O mapa de toda documentação

| Seção | Pra que serve | Quando ir |
|---|---|---|
| **Getting Started / Quickstart** | instalar e rodar o primeiro exemplo | o primeiro contato |
| **Tutorial** | construir algo, passo a passo | aprendendo do zero |
| **Guides / How-to** | resolver uma tarefa específica ("How to deploy") | você sabe o que quer fazer |
| **Concepts / Explanation** | entender **como funciona** por dentro | você quer o porquê |
| **API Reference** | cada função ou classe, com parâmetros e retorno | você já sabe o nome da coisa |
| **Changelog / Release notes** | o que mudou em cada versão | algo quebrou depois de atualizar |
| **FAQ / Troubleshooting** | os erros comuns | deu erro |

Cada seção responde a uma pergunta diferente, e saber qual é a sua pergunta já te leva ao lugar certo. Está começando com a ferramenta? **Getting Started**. Sabe o que quer fazer ("como faço login com essa biblioteca?")? **Guides**. Já sabe o nome da função e só quer conferir os parâmetros? **API Reference**. Algo parou de funcionar depois de atualizar uma versão? O **Changelog** quase sempre explica, na parte de *breaking changes*.

Dois erros desperdiçam muito tempo. O primeiro é **ler de cima a baixo**, como um livro. Ninguém faz isso, nem quem escreveu a documentação. Use o `Ctrl + F` e a barra de busca da própria documentação, e vá direto ao que precisa.

O segundo é **ignorar a versão**. Muitas documentações têm um seletor de versão no topo da página, e um exemplo da versão mais nova pode simplesmente não funcionar na versão que você tem instalada. Antes de passar uma hora tentando entender por que o exemplo não funciona, confira a versão.

## Lendo uma API Reference

A API Reference é a seção mais consultada, e ela descreve cada função num formato quase sempre igual:

```
fetch(resource, options?) → Promise<Response>

Parameters
  resource   A string or URL object.
  options    Optional. An object containing custom settings.

Return value
  A Promise that resolves to a Response object.

Exceptions
  TypeError  Thrown if the URL is invalid.
```

Lendo por partes. A **primeira linha** é a assinatura: o nome, o que a função recebe, e o que devolve, exatamente como uma função em TypeScript. Em **Parameters**, está o que você passa; o `?` ou a palavra *Optional* querem dizer que aquele parâmetro não é obrigatório. Em **Return value**, o que a função devolve. Em **Exceptions** (ou *Throws*), os erros que ela pode lançar. E quase sempre tem um **Example** no fim.

E uma dica que economiza muito tempo: **leia o exemplo primeiro.** Muitas vezes ele já responde a sua dúvida inteira, num bloco de código de cinco linhas. As descrições servem depois, pra conferir os detalhes.

## As palavras que mais aparecem

| Palavra | Quer dizer |
|---|---|
| *deprecated* | obsoleto: ainda funciona, mas vai ser removido. Troque pela alternativa indicada. |
| *optional* / *required* | opcional / obrigatório |
| *default* | o valor padrão, se você não passar nada |
| *returns* / *throws* | devolve / lança (um erro) |
| *note* / *warning* / *caveat* | observação / cuidado / ressalva |
| *e.g.* | por exemplo (dá exemplos, pode haver outros) |
| *i.e.* | ou seja (explica exatamente o que veio antes) |
| *under the hood* | por baixo dos panos, internamente |

Duas delas merecem uma atenção especial.

O ***deprecated*** não quer dizer que está quebrado. A função ainda funciona perfeitamente, mas os criadores estão avisando que ela vai sair numa versão futura. E a documentação quase sempre diz o que usar no lugar. Se você está começando um código novo, não use a função *deprecated*: use a alternativa, e evite ter que reescrever tudo daqui a um ano.

E o ***e.g.*** e o ***i.e.***, duas abreviações do latim que confundem até os nativos. O *e.g.* traz **exemplos**: "databases, *e.g.* PostgreSQL" quer dizer que o PostgreSQL é **um** exemplo, e que existem outros. O *i.e.* **explica**, define exatamente o que veio antes: "the main branch, *i.e.* `main`" quer dizer que é exatamente essa, a `main`, e mais nenhuma.

## Não traduza a página inteira

Jogar a página inteira num tradutor parece o jeito mais rápido. E tem dois problemas. O primeiro é que você perde o hábito de ler, que é justamente o que faz a leitura ficar mais fácil com o tempo. O segundo é que o tradutor **erra os termos técnicos**: o *thread* vira "linha", o *build* vira "construção", e a tradução fica mais confusa que o original. Traduza só a frase que realmente travou, e mesmo assim, tente primeiro pelo contexto.

E pense assim: cada página de documentação lida em inglês é um treino de leitura num assunto que você domina. É o melhor tipo de [[Input Compreensível]] que existe pra quem programa.

## O essencial

1. Documentação é o inglês mais fácil: frases curtas, vocabulário repetitivo, assunto conhecido.
2. Não leia de cima a baixo. Use o mapa: Getting Started, Guides, API Reference, Changelog.
3. Na API Reference: assinatura, Parameters, Return value, Exceptions. Leia o exemplo primeiro.
4. *Deprecated* = ainda funciona, mas vai sair. Use a alternativa.
5. *e.g.* = por exemplo; *i.e.* = ou seja. Confira a versão da documentação.

## Agora é com você

Resolva uma dúvida real usando só a documentação em inglês. Escolha uma ferramenta que você usa (o Git, o Node.js, o Python), e escreva uma pergunta de verdade, como "como desfazer o último commit?". Ache a resposta na documentação oficial **sem** tradutor e sem Google, usando o mapa da primeira seção. E anote: em qual seção você achou, quanto tempo levou, e quais palavras eram novas (essas vão pro [[Sentence Mining]]). Você terminou quando achar a resposta em menos de cinco minutos, sem traduzir a página.

Depois, um projeto em que a documentação é a sua única professora: **construir algo pequeno do zero, só com a doc em inglês.** Escolha algo novo pra você, que tenha uma boa documentação oficial: um bot de Discord ([discord.js](https://discordjs.guide)), ou um plugin "Hello world" pro Obsidian ([docs.obsidian.md](https://docs.obsidian.md)). A regra é rígida: só a documentação oficial em inglês, com o Getting Started, os Guides e a API Reference. Sem tutorial em português e sem tradutor. Faça funcionar: o bot responder um comando, ou o plugin mostrar um aviso. E leve as palavras novas pro [[Sentence Mining]]. Você terminou quando funcionar, e você souber dizer em que página da documentação estava cada coisa que usou. Se quiser ir além, resolva pelo menos uma dúvida pela **API Reference**, e não pelo guia; e, se achar um erro na documentação, abra uma issue em inglês no repositório dela.

Daqui, siga pro [[Inglês em Commits, Issues e PRs]].

---

## 🧠 Me teste

> [!question]- Você já sabe o nome da função e quer saber os parâmetros. Qual seção abrir?
> A **API Reference**.

> [!question]- O que significa *deprecated*?
> Obsoleto: ainda funciona, mas será removido no futuro. Evite usar.

> [!question]- Algo quebrou depois de atualizar uma biblioteca. Onde olhar primeiro?
> No **Changelog / Release notes**, que lista o que mudou em cada versão (procure *breaking changes*).

> [!question]- Qual a diferença entre *e.g.* e *i.e.*?
> *e.g.* = por exemplo; *i.e.* = ou seja / isto é.

> [!question]- Por que não traduzir a página inteira?
> Porque você perde o hábito de ler, e o tradutor erra os termos técnicos (*thread*, *build*).

> [!question]+ Uma função aparece como *deprecated*. O que isso significa?
> - a) Está com bug e não funciona
> - b) Ainda funciona, mas vai ser removida: troque pela alternativa indicada
> - c) Foi removida da biblioteca
> - d) É experimental
>
> > [!check]- Resposta
> > **b)** *Deprecated* = desencorajada, com remoção prevista numa versão futura. A doc quase sempre diz o que usar no lugar.

> [!question]+ Qual a diferença entre *e.g.* e *i.e.*?
> - a) *e.g.* = por exemplo; *i.e.* = ou seja
> - b) *e.g.* = ou seja; *i.e.* = por exemplo
> - c) São sinônimos
> - d) *e.g.* = etc.; *i.e.* = isto é, no fim da frase
>
> > [!check]- Resposta
> > **a)** *e.g.* traz **exemplos** (pode haver outros). *i.e.* **explica** ou define exatamente o que veio antes.

---

## Pra consultar depois

| Quero... | Vá em |
|---|---|
| Começar do zero | Getting Started |
| Fazer uma tarefa | Guides / How-to |
| Detalhes de uma função | API Reference |
| Entender o porquê | Concepts |
| Atualizei e quebrou | Changelog |
| Deu erro | Troubleshooting / FAQ |

**Pra ler:** o [MDN Web Docs](https://developer.mozilla.org/) é um exemplo de documentação muito bem organizada, e um ótimo lugar pra treinar o mapa. E o [Diátaxis](https://diataxis.fr/) explica o modelo (tutorial, how-to, reference, explanation) que muitas documentações seguem; entender ele faz você achar as coisas mais rápido em qualquer lugar.

## Minhas anotações

**Dúvida que resolvi pela documentação (ferramenta, seção, tempo):**
- 

**Palavras novas:**
-

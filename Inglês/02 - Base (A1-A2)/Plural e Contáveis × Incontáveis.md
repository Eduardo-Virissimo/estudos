---
nivel: escrito
foco: importante
revisado:
---

# Plural e Contáveis × Incontáveis

**Quanto focar: 📌 importante.** Pegadinhas como "informations" aparecem em texto técnico. Entenda e pratique uma vez.

Você termina uma revisão de código e escreve no PR: *Thanks for the feedbacks! I changed the codes and added some informations.* Três erros numa frase só, e nenhum deles de vocabulário ou de gramática "difícil". Todos do mesmo tipo: você colocou plural em palavras que, em inglês, simplesmente não têm plural.

Isso acontece porque todo substantivo em inglês é de um de dois tipos. Ou ele é **contável**, dá pra contar (*one bug, two bugs*). Ou é **incontável**, e não tem plural nenhum (*information*, *software*, *code*, *advice*). E essa diferença muda tudo em volta da palavra: um incontável não leva *a/an*, não ganha *-s*, e usa ***much*** em vez de *many*.

O problema, pra quem fala português, é que várias palavras que **são** contáveis em português ("as informações", "os códigos", "os conselhos") são **incontáveis** em inglês. É exatamente aí que mora o erro, e ele aparece muito, muito mesmo, em texto técnico. Ajuda ter passado pelos [[Artigos (a, an, the)]] e pelo [[There Is e There Are]].

## Dá pra contar?

A pergunta que separa os dois tipos é: **dá pra contar um, dois, três?**

Os **contáveis** dão: *one bug, two bugs*, *a file, three files*, *a user, many users*. Eles têm plural, e aceitam *a/an*. Os **incontáveis** não dão: *information*, *water*, *time*, *code*. Você não diz "two informations". Eles não têm plural, e não aceitam *a/an*.

Pense na diferença entre "moedas" e "dinheiro". Moedas, dá pra contar: *three coins*. Mas "dinheiro" é uma massa, uma quantidade, e não um monte de coisas separadas. Ninguém diz "três dinheiros": diz "um pouco de dinheiro". Em inglês, *coins* é contável, e *money* é incontável. Os incontáveis são as coisas que o inglês enxerga como massa.

E o plural dos contáveis segue regras simples, que vale ter à mão:

| Termina em | Regra | Exemplo |
|---|---|---|
| a maioria | + s | bugs, files, users |
| -s, -sh, -ch, -x | + es | classes, branches, boxes |
| consoante + y | y vira ies | queries, libraries, dependencies |
| vogal + y | + s | keys, arrays, days |
| -f / -fe (alguns) | vira ves | life → lives, half → halves |

## Os incontáveis que pegam brasileiro

Agora a lista que mais importa, e o motivo de existir esta nota. Estas palavras são contáveis em português e **incontáveis** em inglês. Quando você precisar falar de "um" deles, use a expressão da direita:

| Incontável em inglês | Como contar |
|---|---|
| *information* | *a piece of information* |
| *advice* | *a piece of advice*, *a tip* |
| *feedback* | *some feedback*, *a comment* |
| *code* | *a line of code*, *a snippet* |
| *software* / *hardware* | *a program*, *an app*, *a tool* |
| *equipment* | *a piece of equipment* |
| *homework* / *research* / *knowledge* | *a task*, *a study* |
| *furniture* / *luggage* | *a piece of furniture*, *a bag* |
| *news* (é singular!) | *a piece of news*: *The news **is** good.* |
| *money* / *traffic* / *time* | *a dollar*, *a car*, *an hour* |

Repare em quantos são de tecnologia: *code*, *software*, *hardware*, *feedback*, *information*. Não é coincidência: são as palavras que um dev usa o dia inteiro. *I wrote many codes* é, provavelmente, o erro mais comum de dev brasileiro escrevendo em inglês. O certo é *I wrote **a lot of code***. E se quiser contar, conte as **linhas**: *I wrote fifty lines of code*.

Os erros que saem disso são sempre os mesmos: *informations*, *advices*, *feedbacks*, *softwares*, *codes*. Nenhum deles tem plural: *I need **some information***, *Thanks for **the feedback***. E pelo mesmo motivo, *an advice* também está errado, porque incontável não leva *a/an*: o certo é ***some advice***, ou ***a piece of advice***.

Duas palavras merecem um aviso separado, porque enganam no sentido contrário. ***People*** já é **plural** (é o plural de *person*), então é *people **are***, nunca *people is*. E ***news*** parece plural por causa do *-s*, mas é **singular** e incontável: *the news **is** good*, nunca *the news are*.

## Muito, pouco, quanto

As palavras de quantidade mudam conforme a palavra é contável ou não. Esta tabela resolve quase todos os casos:

| | Contável (plural) | Incontável |
|---|---|---|
| Muito | *many bugs* | *much time* |
| Pouco | *(a) few bugs* | *(a) little time* |
| Quanto? | *How **many** files?* | *How **much** memory?* |
| Os dois | *a lot of bugs* | *a lot of time* |
| Algum (afirmativa) | *some bugs* | *some coffee* |
| Algum, nenhum (pergunta e negativa) | *any bugs?* / *no bugs* | *any coffee?* / *no coffee* |

Se for guardar uma coisa só dessa tabela, guarde o ***a lot of***: ele é o coringa, funciona com os dois tipos, e é o mais natural em frases afirmativas. Inclusive, numa frase afirmativa, o *much* soa formal e esquisito: diga *I have a lot of time*, e não "I have much time". O *much* fica natural é em perguntas e negativas: *I don't have **much** time*.

E um detalhe que muda completamente o sentido: o *a* na frente do *few* e do *little*.

- ***A few** / **a little*** = um pouco, com sentido **positivo**. *I have **a few** friends*: tenho alguns amigos, o suficiente.
- ***Few** / **little*** = quase nada, com sentido **negativo**. *I have **few** friends*: tenho poucos amigos, quase nenhum.

Uma letra só, e a frase passa de "tenho alguns amigos" pra "sou meio solitário".

E o erro que junta tudo isso: *How many money?* Como *money* é incontável, o certo é ***How much money?***

## Plurais irregulares

Alguns plurais não seguem regra nenhuma, e se aprendem pelo uso: *man → men* · *woman → women* · *child → children* · *person → people* · *foot → feet* · *tooth → teeth* · *mouse → mice*. Por isso, *childs* e *persons* estão errados. (O *persons* até existe, mas só em texto jurídico e muito formal.)

E alguns termos técnicos que aparecem bastante: *index → indexes* (o mais comum em código) ou *indices* · *criterion → criteria* · *analysis → analyses* · *datum → data*.

O ***data*** é um caso curioso. Tecnicamente, ele é o plural de *datum*, uma palavra latina. Mas em tecnologia ele é tratado quase sempre como incontável, como uma massa de informação: ***The data is** stored in the database.* Você vai ver as duas formas por aí, mas em código e documentação o *data is* domina.

## O essencial

1. Contável dá pra contar (*a bug, two bugs*); incontável é massa (*code*, *information*, *money*), sem plural e sem *a/an*.
2. Os traiçoeiros de dev: *information, advice, feedback, code, software*. Nada de *-s*.
3. Pra contar um incontável: *a piece of advice*, *a line of code*.
4. *Many* com contável, *much* com incontável. Na dúvida, *a lot of*, que serve pros dois.
5. *A few* = alguns (positivo); *few* = quase nenhum. *People are*, *the news is*.

## Exercícios

> Escreva as respostas (no papel ou em "Minhas anotações") **antes** de abrir o gabarito. Errou 3 ou mais num bloco? Releia a explicação lá em cima e refaça o bloco amanhã.

#### 1. Escreva o plural

1. bug · 2. class · 3. query · 4. key · 5. branch · 6. child · 7. person · 8. library · 9. box · 10. woman · 11. life · 12. dependency

> [!success]- Gabarito
> 1. bugs · 2. classes · 3. queries · 4. keys · 5. branches · 6. children · 7. people · 8. libraries · 9. boxes · 10. women · 11. lives · 12. dependencies

#### 2. Contável (C) ou incontável (I)?

1. file · 2. information · 3. advice · 4. bug · 5. software · 6. app · 7. feedback · 8. comment · 9. code · 10. snippet · 11. money · 12. dollar · 13. news · 14. equipment

> [!success]- Gabarito
> C: file, bug, app, comment, snippet, dollar
> I: information, advice, software, feedback, code, money, news, equipment

#### 3. much ou many?

1. How ___ tests are there?
2. How ___ memory does it use?
3. I don't have ___ experience.
4. There aren't ___ users online.
5. How ___ does it cost?
6. We don't have ___ time.

> [!success]- Gabarito
> 1. many · 2. much · 3. much · 4. many · 5. much · 6. much

#### 4. some, any, a few, a little

1. Do you have ___ questions?
2. I need ___ help with this.
3. There are ___ bugs left, but nothing serious.
4. Can I have ___ water?
5. I don't have ___ money.
6. She speaks ___ Spanish. (um pouco)

> [!success]- Gabarito
> 1. any · 2. some · 3. a few · 4. some (em pedido/oferta usa *some*) · 5. any · 6. a little

#### 5. Corrija o erro

1. Thanks for the feedbacks!
2. Can you give me an advice?
3. I wrote many codes today.
4. The people is nice here.
5. The news are bad.
6. I need some informations.
7. How many money do you have?
8. We installed three softwares.

> [!success]- Gabarito
> 1. Thanks for the feedback! · 2. Can you give me some advice? (ou *a piece of advice*) · 3. I wrote a lot of code today. · 4. The people are nice here. · 5. The news is bad. · 6. I need some information. · 7. How much money do you have? · 8. We installed three programs. (ou *three pieces of software*)

#### 6. Traduza

1. Obrigado pelas informações.
2. Quantos arquivos e quanto espaço?
3. Escrevi poucas linhas de código.
4. Você tem alguma dica?
5. Tenho pouco tempo hoje.

> [!success]- Gabarito
> 1. Thanks for the information.
> 2. How many files and how much space?
> 3. I wrote a few lines of code.
> 4. Do you have any tips? (ou *any advice?*)
> 5. I don't have much time today. (ou *I have little time today.*)

## Agora é com você

Use os incontáveis falando do seu próprio trabalho. Escreva oito frases sobre o seu estudo ou o seu projeto usando *code*, *feedback*, *information*, *advice*, *software*, *research*, *a lot of* e *how much*. Peça a uma IA, ou a um parceiro de idioma, pra corrigir **só** a parte de contável e incontável. E anote aqui embaixo as palavras que você achava que eram contáveis. Você terminou quando tiver oito frases sem nenhum *-s* num incontável, e com o *much* e o *many* certos.

Daqui, siga pras [[Palavras de Alta Frequência]] e pras [[Collocations]], no B2, onde aparecem mais combinações como *a piece of advice* e *a line of code*.

---

## 🧠 Me teste

> [!question]- Por que "I wrote many codes" está errado?
> *Code* é incontável em inglês: *I wrote a lot of code* (ou *many lines of code*).

> [!question]- Cite 5 incontáveis que brasileiro costuma pôr no plural.
> *Information, advice, feedback, software, code* (também *news, equipment, homework, research*).

> [!question]- Quando usar *much* e quando *many*?
> *Many* com contáveis no plural (*many files*); *much* com incontáveis (*much time*), mais em pergunta e negativa.

> [!question]- Qual a diferença entre *a few* e *few*?
> *A few* = alguns (positivo). *Few* = poucos, quase nenhum (negativo).

> [!question]- *The news is* ou *the news are*?
> *The news is.* *News* é singular e incontável.

> [!question]+ Qual frase está certa?
> - a) *I wrote many codes today.*
> - b) *I wrote a lot of code today.*
> - c) *I wrote many code today.*
> - d) *I wrote a code today.*
>
> > [!check]- Resposta
> > **b)** *Code* (no sentido de código-fonte) é **incontável**: sem plural, sem *a*, e com *much*/*a lot of* em vez de *many*.

> [!question]+ *There are ___ bugs left, we're almost done.* Qual completa com sentido positivo, "alguns"?
> - a) *few*
> - b) *a few*
> - c) *much*
> - d) *a little*
>
> > [!check]- Resposta
> > **b)** *A few* = alguns (o suficiente, positivo). *Few* = poucos (quase nenhum, negativo). *Much* e *a little* são pra incontáveis.

---

## Pra consultar depois

| | Contável | Incontável |
|---|---|---|
| Plural | bugs, queries, children | — (sem -s) |
| Artigo | a bug | — / some |
| Muito | many / a lot of | much / a lot of |
| Pouco | a few | a little |
| Pergunta | How many? | How much? |
| Os traiçoeiros | | information · advice · feedback · code · software · news |

**Pra ler:** a gramática A1-A2 do [British Council](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) tem uma página sobre contáveis e incontáveis, com exercícios interativos. E a [gramática do Cambridge Dictionary](https://dictionary.cambridge.org/grammar/british-grammar/) traz listas maiores de incontáveis, pra quando aparecer uma dúvida específica.

## Minhas anotações

**Minhas respostas dos exercícios / onde errei:**
- 

**Palavras que eu achava que eram contáveis:**
-

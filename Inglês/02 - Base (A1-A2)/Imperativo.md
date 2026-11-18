---
nivel: escrito
revisado:
---

# Imperativo

Abra o README de qualquer projeto no GitHub e repare em como ele fala com você: *Clone the repository. Install the dependencies. Run the app.* Uma mensagem de erro diz *Try again later*. Uma tela de configuração diz *Enter your email*. Uma mensagem de commit diz *Fix login bug*. Sem perceber, você lê esse tipo de frase o dia inteiro.

Isso é o **imperativo**: o jeito de dar ordens, instruções e conselhos. E a boa notícia é que ele é a forma mais simples do inglês inteiro: **o verbo puro, sem sujeito**. *Open the file.* *Run the tests.* Pra negar, ***Don't*** antes do verbo: *Don't delete it.* Pra quem programa, entender o imperativo já destrava a maioria dos tutoriais.

O único cuidado de verdade é o **tom**. Numa documentação, o imperativo puro é perfeito. Mas falando com uma pessoa, ele pode soar seco, como uma ordem, e é aí que entram o *please* e o *Could you...?*. Ajuda ter passado pelo [[Presente Simples]], que usa o mesmo verbo base.

## Só o verbo

| | Exemplo |
|---|---|
| Afirmativa | ***Open** the terminal.* · ***Be** careful.* |
| Negativa | ***Don't** run this in production.* · ***Never** share your password.* |
| Com a gente | ***Let's** start.* · ***Let's not** change it now.* |

É o verbo na forma básica, e mais nada: **sem sujeito**, **sem -s**, **sem *to***. A pessoa que recebe a instrução é um "você" escondido, do mesmo jeito que no português "abra o arquivo".

A negativa é sempre o ***Don't*** antes do verbo, não importa com quem você fala. E o ***Let's*** (que é *let us*) é o "vamos": um convite, que inclui você na ação. *Let's start*, "vamos começar".

Os erros aqui são quase sempre alguém colocando coisa demais no verbo, por influência de outras formas. *Don't to do it* e *No do it*: a negativa é só ***Don't do it***, sem *to* e nunca com *no*. *Let's to go* e *Let's going*: depois do *Let's*, o verbo vai puro, ***Let's go***. E *Clicks here* ou *To click here*: como instrução, o verbo vai sozinho, ***Click** here*.

## Os verbos das instruções

A documentação técnica é escrita quase inteira no imperativo, e um punhado de verbos aparece o tempo todo:

| Verbo | Exemplo real |
|---|---|
| *run* | *Run `npm test`.* |
| *install* | *Install the dependencies.* |
| *open* / *close* | *Open the settings.* |
| *click* / *select* / *choose* | *Select a file and click Upload.* |
| *type* / *enter* | *Enter your email.* |
| *make sure* / *ensure* | *Make sure Node is installed.* |
| *note* | *Note that this is case-sensitive.* |
| *see* | *See the docs for more details.* |
| *check* | *Check your internet connection.* |
| *try* | *Try again later.* |
| *add* / *remove* | *Add this line to your config.* |
| *set* | *Set the `PORT` variable.* |

Preste atenção especial no ***Make sure***. Ele quer dizer "garanta que", "confira que": *Make sure Node is installed*, "garanta que o Node está instalado". É um dos mais comuns em documentação, e também um dos mais ignorados. Muita gente pula a linha do *Make sure* achando que é só um aviso, e passa meia hora depois descobrindo que era exatamente o passo que faltava.

Pra dar uma sequência de passos, o inglês usa uma escadinha de palavras: *First, ... Then, ... Next, ... After that, ... Finally, ...*

*First, clone the repo. Then, install the dependencies. Finally, run the app.*

E o imperativo é também a convenção das **mensagens de commit**: *Fix login bug*, e não *Fixed* nem *Fixes*. O motivo é que a mensagem completa a frase "este commit vai...": *(this commit will) fix login bug*. A nota [[Inglês em Commits, Issues e PRs]] aprofunda.

## Do direto ao educado

Numa documentação, o imperativo puro é perfeito: ninguém se ofende ao ler *Run the tests*. Mas falando com uma **pessoa**, a mesma frase pode soar como uma ordem seca. Em inglês, o tom de um pedido vai subindo assim:

| Situação | Forma |
|---|---|
| Instrução escrita, documentação | *Run the tests.* |
| Pedido a um colega, informal | *Please run the tests.* · *Run the tests, please.* |
| Pedido educado | *Could you run the tests?* |
| Muito educado | *Would you mind running the tests?* |

Repare numa coisa curiosa: ao pedir algo a alguém, a forma educada vira uma **pergunta**. *Could you...?*, "você poderia...?". E mesmo o *please* nem sempre resolve: um *Please send me the file* ainda soa como uma ordem, se for pra alguém que não é do seu time.

É aqui que muito brasileiro soa rude sem querer. Em português, "me manda o arquivo" é perfeitamente normal entre colegas. Traduzido ao pé da letra, *Send me the file*, pra alguém de fora do seu time, pode soar seco. O natural é ***Could you send me the file?***

## O essencial

1. O imperativo é o verbo puro, sem sujeito: *Run the tests.*
2. A negativa é *Don't* + verbo, pra qualquer pessoa. "Vamos" é *Let's* + verbo.
3. Nada de *to*, de *-s* ou de *no*: *Don't do it*, *Let's go*, *Click here*.
4. *Make sure* = garanta que. Sequência: *First, Then, Next, Finally*. Commits no imperativo: *Fix bug*.
5. Pedido a uma pessoa: *Could you...?* O imperativo puro pode soar seco.

## Exercícios

> Escreva as respostas (no papel ou em "Minhas anotações") **antes** de abrir o gabarito. Errou 3 ou mais num bloco? Releia a explicação lá em cima e refaça o bloco amanhã.

#### 1. Complete com o verbo da lista

*run · don't forget · make sure · open · click · don't use · enter · let's*

1. ___ the terminal and type `node -v`.
2. ___ your password and press Enter.
3. ___ the tests before you push.
4. ___ to save your work.
5. ___ `var`; use `let` or `const`.
6. ___ Docker is running.
7. ___ the green button.
8. ___ take a break.

> [!success]- Gabarito
> 1. Open · 2. Enter · 3. Run · 4. Don't forget · 5. Don't use · 6. Make sure · 7. Click · 8. Let's

#### 2. Transforme em negativa

1. Delete the folder.
2. Push to main.
3. Close the window.
4. Use your personal email.
5. Commit the `.env` file.

> [!success]- Gabarito
> 1. Don't delete the folder. · 2. Don't push to main. · 3. Don't close the window. · 4. Don't use your personal email. · 5. Don't commit the `.env` file.

#### 3. Corrija o erro

1. Don't to touch the config.
2. Let's to start the meeting.
3. You click here to continue.
4. No run this command.
5. Clicks the button.
6. Fixed typo in README. (mensagem de commit)

> [!success]- Gabarito
> 1. Don't touch the config. · 2. Let's start the meeting. · 3. Click here to continue. · 4. Don't run this command. · 5. Click the button. · 6. Fix typo in README

#### 4. Deixe educado

Transforme em pedido educado com *Could you...?*

1. Send me the link.
2. Review my PR.
3. Repeat that.
4. Speak more slowly.

> [!success]- Gabarito
> 1. Could you send me the link? · 2. Could you review my PR? · 3. Could you repeat that? · 4. Could you speak more slowly?

#### 5. Traduza estas instruções

1. Primeiro, clone o repositório.
2. Depois, instale as dependências.
3. Não esqueça de criar o arquivo `.env`.
4. Certifique-se de que a porta 3000 está livre.
5. Por fim, rode `npm run dev`.

> [!success]- Gabarito
> 1. First, clone the repository.
> 2. Then, install the dependencies.
> 3. Don't forget to create the `.env` file.
> 4. Make sure port 3000 is free. (ou *available*)
> 5. Finally, run `npm run dev`.

## Agora é com você

Escreva um *Getting started* de verdade. Escolha um projeto seu (ou o projeto do Estágio 1 do Roadmap) e escreva a seção *Getting started* do README, em inglês: de cinco a oito passos no imperativo, com *First*, *Then* e *Finally*. Inclua pelo menos um *Don't*, um *Make sure* e um *Note that*. Depois, siga os seus próprios passos numa pasta nova, do zero. Se você travar em algum ponto, a instrução está incompleta. Você terminou quando alguém (ou você mesmo, numa pasta limpa) conseguir rodar o projeto só lendo os seus passos em inglês.

Daqui, siga pra [[Ler Documentação]], pro [[Inglês em Commits, Issues e PRs]] e pro [[Pedir Ajuda e Esclarecimento]].

---

## 🧠 Me teste

> [!question]- Como se forma o imperativo negativo?
> *Don't* + verbo na forma base: *Don't run this in production.*

> [!question]- Como fazer um convite/sugestão "vamos..." em inglês?
> *Let's* + verbo: *Let's start.* Negativa: *Let's not...*

> [!question]- Por que uma mensagem de commit fica "Fix bug" e não "Fixed bug"?
> A convenção é o imperativo: a mensagem completa a frase "If applied, this commit will... *fix bug*".

> [!question]- Como transformar "Send me the file" num pedido educado?
> *Could you send me the file?* (ou *Would you mind sending me the file?*)

> [!question]- O que significa *Make sure* em documentação?
> "Certifique-se de que..." / "Confira que...": *Make sure Node is installed.*

> [!question]+ Qual é o imperativo negativo certo?
> - a) *No push to main.*
> - b) *Not push to main.*
> - c) *Don't push to main.*
> - d) *Doesn't push to main.*
>
> > [!check]- Resposta
> > **c)** Negativo do imperativo é sempre *Don't* + verbo, pra qualquer pessoa. (*No pushing* também aparece em placas, mas a forma geral é *Don't*.)

---

## Pra consultar depois

| Forma | Exemplo |
|---|---|
| Verbo puro | *Run the tests.* |
| Don't + verbo | *Don't push to main.* |
| Let's + verbo | *Let's deploy.* |
| Educado | *Could you...? · Would you mind -ing?* |
| Sequência | *First → Then → Next → Finally* |

**Pra ler:** a gramática A1-A2 do [British Council](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) tem uma página sobre o imperativo, com exercícios. E o [guia de estilo de documentação do Google](https://developers.google.com/style/procedures), na parte de procedimentos, mostra como escrever passos de instrução que qualquer pessoa consegue seguir, um ótimo modelo pro seu README.

## Minhas anotações

**Minhas respostas dos exercícios / onde errei:**
- 

**Instruções reais que eu li e entendi:**
-

---
nivel: escrito
foco: importante
revisado:
---

# Siglas Técnicas

**Quanto focar: 📌 importante.** Aparecem em code review e documentação. Conheça as principais e consulte o resto quando aparecer.

**Quanto tempo:** cerca de 1h: 10 min de leitura, 5 min no Me teste e 40 min no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você abre um pull request de um projeto open source e lê os comentários: *LGTM, just one nit.* *PTAL when you have a sec.* *IMO we should wait, AFAIK the API is changing.* *TL;DR: WIP, ETA Friday.* Todas as palavras são inglês, e mesmo assim a frase parece escrita em código.

Tecnologia é uma verdadeira sopa de siglas. Algumas você precisa entender pra ler qualquer documentação, outras pra acompanhar uma revisão de código, outras pra não travar numa reunião. E saber o que cada uma significa é só metade do trabalho: a outra metade é saber como ela se **fala** em inglês, porque "a-pê-í" numa reunião internacional soa estranho.

A boa notícia é que elas se dividem em dois grupos bem diferentes, e entender essa divisão já ajuda muito. Existem as **siglas técnicas** (API, JSON, HTTP), que são conceitos que você vai estudar ao longo do roadmap. E existem as **abreviações de conversa** (LGTM, PTAL, IMO), que aparecem nos PRs e nos chats do dia a dia, e que são as que deixam aquele comentário do começo tão confuso. Ajuda ter passado pelo [[Vocabulário Técnico]].

## As siglas da conversa

São as que aparecem em comentários de PR, em chats e em e-mails de trabalho. Você vai encontrar estas todo dia:

| Abreviação | Significa | Uso |
|---|---|---|
| **PR** / **MR** | Pull Request / Merge Request | uma proposta de mudança no código |
| **LGTM** | Looks Good To Me | "pra mim está bom", aprovado |
| **PTAL** | Please Take A Look | "pode dar uma olhada?" |
| **WIP** | Work In Progress | "ainda não terminei" |
| **nit** | nitpick | um detalhe pequeno, que não bloqueia |
| **IMO** / **IMHO** | In My (Humble) Opinion | "na minha opinião" |
| **AFAIK** | As Far As I Know | "até onde eu sei" |
| **TL;DR** | Too Long; Didn't Read | "resumindo" |
| **FYI** | For Your Information | "só pra você saber" |
| **ETA** | Estimated Time of Arrival | "previsão de quando fica pronto" |
| **TBD** | To Be Defined / Decided | "a definir" |
| **RFC** | Request For Comments | uma proposta aberta pra discussão |
| **OOO** | Out Of Office | fora do escritório, de folga |

Com essa tabela, o comentário do começo vira português: "Pra mim está bom, só um detalhe." "Pode dar uma olhada quando tiver um tempinho?" "Na minha opinião a gente devia esperar; até onde eu sei, a API está mudando." "Resumindo: ainda não terminei, previsão pra sexta."

Numa revisão de código, três delas importam mais que as outras. O **LGTM** quer dizer "aprovei". O **nit** quer dizer "é só um detalhe, faça se quiser". E o **WIP**, no título de um PR, é um aviso: "não revise ainda, estou trabalhando nisso".

E um cuidado com o contexto: essas siglas são de conversa informal entre colegas. *LGTM* num PR, sim. Num e-mail pro cliente, não.

## As siglas técnicas

Estas são conceitos de verdade, e a maioria tem uma nota própria no roadmap:

| Sigla | Por extenso | O que é | No Roadmap |
|---|---|---|---|
| **API** | Application Programming Interface | um contrato pra um programa conversar com outro | [[REST]] |
| **CLI** | Command-Line Interface | programa usado pelo terminal | [[Terminal]] |
| **GUI** | Graphical User Interface | programa com janelas e botões | – |
| **IDE** | Integrated Development Environment | editor com ferramentas embutidas | [[VS Code]] |
| **SDK** | Software Development Kit | kit de bibliotecas pra usar uma plataforma | – |
| **npm** | (originalmente) Node Package Manager | o gerenciador de pacotes do Node | [[Gerenciador de Pacotes]] |
| **JSON** | JavaScript Object Notation | formato de dados em texto | [[JSON]] |
| **HTTP(S)** | HyperText Transfer Protocol (Secure) | o protocolo da web | [[HTTP]] |
| **URL** | Uniform Resource Locator | o endereço de um recurso | – |
| **DOM** | Document Object Model | a página como uma árvore de objetos | [[DOM e Eventos]] |
| **CRUD** | Create, Read, Update, Delete | as 4 operações básicas com dados | [[CRUD]] |
| **SQL** | Structured Query Language | a linguagem dos bancos relacionais | [[SQL]] |
| **ORM** | Object-Relational Mapping | traduz objetos do código ↔ tabelas do banco | [[ORM]] |
| **CI/CD** | Continuous Integration / Delivery | testar e entregar automaticamente | [[CI/CD]] |
| **SSH** | Secure Shell | acesso remoto seguro | [[SSH]] |
| **OOP** | Object-Oriented Programming | orientação a objetos | [[Classes]] |
| **TDD** | Test-Driven Development | escrever o teste antes do código | [[TDD (Test Driven Development)]] |
| **MVP** | Minimum Viable Product | a menor versão útil de um produto | – |
| **LTS** | Long-Term Support | versão com suporte longo | [[Node.js]] |
| **LLM** | Large Language Model | modelo de linguagem (IA) | [[LLMs]] |

Não precisa decorar essa tabela agora: cada sigla vai ganhar sentido quando você chegar na nota dela. Mas uma diferença vale aprender já, porque cai em entrevista: o **CLI** é um programa usado **digitando comandos**, como o `git` no terminal; o **GUI** é um programa com **janelas e botões**, como o GitHub Desktop. Muitas ferramentas têm as duas versões, e fazem a mesma coisa de jeitos diferentes.

## Como se fala

Agora a metade que muita gente esquece. A maioria das siglas se **soletra em inglês**, letra por letra:

- **API** = "ei-pi-ái"
- **CLI** = "si-el-ái"
- **URL** = "iú-ar-él"
- **SQL** = "és-kiu-él" (ou "síquel")

Algumas, em vez de soletradas, viram uma palavra:

- **JSON** = "djêi-son"
- **CRUD** = "crâd"
- **GUI** = "gúi"

E o **npm** é soletrado: "en-pi-ém". Na dúvida, confira no [YouGlish](https://youglish.com/), que mostra vídeos reais de gente falando a palavra.

O erro mais comum aqui é **soletrar em português**: "a-pê-í", "jota-son", "u-erre-ele". Numa reunião internacional, soa estranho, e às vezes a pessoa simplesmente não entende do que você está falando. A solução é treinar o alfabeto em inglês, principalmente as **vogais**, que são as que mais confundem quem fala português: o **a** é "ei", o **e** é "í", e o **i** é "ái". É por isso que *API* é "ei-pi-ái".

E toda empresa e todo time têm as suas siglas internas, que não estão em lista nenhuma. Na primeira vez que aparecer uma que você não conhece, pergunte, sem vergonha:

*Sorry, what does X stand for?*

É uma pergunta completamente normal numa reunião, e respeitada, inclusive entre nativos: eles também não conhecem as siglas de um time novo. Fingir que entendeu e depois fazer a coisa errada é muito pior ([[Pedir Ajuda e Esclarecimento]]).

## O essencial

1. Dois grupos: siglas técnicas (conceitos, como API e JSON) e abreviações de conversa (LGTM, PTAL, IMO).
2. No review: LGTM = aprovei, nit = detalhe opcional, WIP = não revise ainda.
3. CLI se usa digitando comandos; GUI tem janelas e botões.
4. Soletre em inglês: API = "ei-pi-ái". As vogais: a = "ei", e = "í", i = "ái".
5. Sigla desconhecida: *Sorry, what does X stand for?*

## Agora é com você

Reconheça as siglas em contexto real. Abra três pull requests já fechados de um projeto open source grande no GitHub (o TypeScript, o Node.js ou o VS Code são ótimos). Anote cada sigla e abreviação que aparecer nos comentários, e pra cada uma, escreva o significado e a frase onde ela apareceu. Depois, fale em voz alta, em inglês, as dez siglas técnicas da tabela que você mais vai usar. Você terminou quando conseguir entender os comentários dos três PRs sem precisar procurar nenhuma sigla.

Daqui, siga pra [[Ler Documentação]], pro [[Inglês em Commits, Issues e PRs]] e pro [[Inglês em Reuniões e Daily]].

---

## 🧠 Me teste

> [!question]- O que significa LGTM num code review?
> *Looks Good To Me*: a pessoa aprovou a mudança.

> [!question]- Qual a diferença entre CLI e GUI?
> CLI é um programa usado pelo terminal, com comandos de texto; GUI é um programa com interface gráfica (janelas, botões).

> [!question]- O que é um comentário marcado com *nit*?
> Um detalhe pequeno (nitpick), geralmente de estilo, que não impede a aprovação.

> [!question]- O que significa API?
> *Application Programming Interface*: o contrato que define como um programa conversa com outro.

> [!question]- O que significa WIP no título de um PR?
> *Work In Progress*: ainda não está pronto pra revisão final.

> [!question]- Como perguntar numa reunião o que uma sigla significa?
> "Sorry, what does X stand for?"

> [!question]+ No review, alguém comenta *nit: rename `x` to `count`*. O que significa?
> - a) É um bug grave que bloqueia o merge
> - b) É um detalhe pequeno, opcional
> - c) É uma pergunta, não uma sugestão
> - d) O revisor aprovou
>
> > [!check]- Resposta
> > **b)** *Nit* (de *nitpick*) marca um detalhe pequeno, de estilo ou nome, que não bloqueia o PR. Quem aprova costuma escrever LGTM (*looks good to me*).

---

## Pra consultar depois

| Situação | Siglas |
|---|---|
| Código | API, CLI, SDK, IDE, JSON, DOM |
| Dados | CRUD, SQL, ORM |
| Entrega | CI/CD, LTS, MVP |
| Code review | PR, LGTM, PTAL, nit, WIP |
| Chat | IMO, AFAIK, TL;DR, FYI, ETA, TBD |

**Pra ouvir e ler:** o [YouGlish](https://youglish.com/) mostra como cada sigla é falada em vídeos reais, o jeito mais rápido de tirar a dúvida entre "és-kiu-él" e "síquel". E o [Conventional Comments](https://conventionalcomments.org/) explica o padrão de rótulos nos comentários de review (*nit*, *suggestion*, *question*...).

## Minhas anotações

**Siglas que encontrei de verdade (sigla · onde):**
- 

**O que me confundiu / onde eu errei:**
-

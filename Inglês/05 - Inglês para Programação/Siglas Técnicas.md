---
nivel: escrito
revisado:
---

# Siglas Técnicas

> *"Se ninguém na reunião explicar a sigla, ninguém mais sabe o que ela significa. Pergunte."*

> [!tip] ⚡ Em 30 segundos
> Tecnologia é uma sopa de siglas: API, CLI, PR, CI/CD, LGTM, WIP. Saber o que cada uma significa (e como se **fala** em inglês) evita travar em documentação, reunião e code review. Há dois grupos: **siglas técnicas** (API, JSON, HTTP), que viram tópicos de estudo, e **abreviações de conversa** (LGTM, PTAL, IMO), usadas em PRs e chats.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Dizer o significado das siglas técnicas mais comuns e onde cada uma aparece no Roadmap
- Entender as abreviações usadas em code review e chats (LGTM, PTAL, nit, WIP)
- Falar as siglas do jeito que os devs falam em inglês

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Vocabulário Técnico]]
- **Depois:** [[Ler Documentação]] · [[Inglês em Commits, Issues e PRs]] · [[Inglês em Reuniões e Daily]]
- **Trilhas:** [[Inglês]] · [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Siglas técnicas

| Sigla | Por extenso | O que é | No Roadmap |
|---|---|---|---|
| **API** | Application Programming Interface | contrato pra um programa conversar com outro | [[REST]] |
| **CLI** | Command-Line Interface | programa usado pelo terminal | [[Terminal]] |
| **GUI** | Graphical User Interface | programa com janelas e botões | – |
| **IDE** | Integrated Development Environment | editor com ferramentas embutidas | [[VS Code]] |
| **SDK** | Software Development Kit | kit de bibliotecas pra usar uma plataforma | – |
| **npm** | (originalmente) Node Package Manager | gerenciador de pacotes do Node | [[Gerenciador de Pacotes]] |
| **JSON** | JavaScript Object Notation | formato de dados em texto | [[JSON]] |
| **HTTP(S)** | HyperText Transfer Protocol (Secure) | protocolo da web | [[HTTP]] |
| **URL** | Uniform Resource Locator | endereço de um recurso | – |
| **DOM** | Document Object Model | a página como árvore de objetos | [[DOM e Eventos]] |
| **CRUD** | Create, Read, Update, Delete | as 4 operações de dados | [[CRUD]] |
| **SQL** | Structured Query Language | linguagem de banco relacional | [[SQL]] |
| **ORM** | Object-Relational Mapping | traduz objetos ↔ tabelas | [[ORM]] |
| **CI/CD** | Continuous Integration / Delivery | testar e entregar automaticamente | [[CI/CD]] |
| **SSH** | Secure Shell | acesso remoto seguro | [[SSH]] |
| **OOP** | Object-Oriented Programming | orientação a objetos | [[Classes]] |
| **TDD** | Test-Driven Development | teste antes do código | [[TDD (Test Driven Development)]] |
| **MVP** | Minimum Viable Product | a menor versão útil de um produto | – |
| **LTS** | Long-Term Support | versão com suporte longo | [[Node.js]] |
| **LLM** | Large Language Model | modelo de linguagem (IA) | [[LLMs]] |

### 2. Abreviações de PR e chat

| Abreviação | Significa | Uso |
|---|---|---|
| **PR** / **MR** | Pull Request / Merge Request | proposta de mudança |
| **LGTM** | Looks Good To Me | "aprovado por mim" |
| **PTAL** | Please Take A Look | "pode revisar?" |
| **WIP** | Work In Progress | "ainda não terminei" |
| **nit** | nitpick | detalhe pequeno, não bloqueia |
| **IMO** / **IMHO** | In My (Humble) Opinion | "na minha opinião" |
| **AFAIK** | As Far As I Know | "até onde eu sei" |
| **TL;DR** | Too Long; Didn't Read | "resumindo" |
| **FYI** | For Your Information | "só pra você saber" |
| **ETA** | Estimated Time of Arrival | "previsão de quando fica pronto" |
| **TBD** | To Be Defined/Decided | "a definir" |
| **RFC** | Request For Comments | proposta aberta pra discussão |
| **OOO** | Out Of Office | fora do escritório / de folga |

### 3. Como se fala

A maioria se soletra em inglês: **API** = "ei-pi-ái", **CLI** = "si-el-ái", **SQL** = "es-kiu-él" (ou "síquel"), **URL** = "iú-ar-él". Algumas viram palavra: **JSON** = "djêi-son", **CRUD** = "crâd", **GUI** = "gúi", **npm** = "en-pi-ém". Confira no [YouGlish](https://youglish.com/).

---

## 🔧 Pegadinhas

- **Fingir que entendeu.** Em reunião, "sorry, what does X stand for?" é uma pergunta normal e respeitada.
- **Usar sigla de chat em texto formal.** LGTM no PR, sim; num e-mail pro cliente, não.
- **Soletrar em português.** "A-pê-í" soa estranho em reunião internacional. Treine as letras em inglês (o *i* é "ái", o *e* é "í", o *a* é "ei").
- **Sigla do próprio time.** Toda empresa tem siglas internas. Anote e pergunte na primeira vez.

---

## 🔨 Desafio prático

**Objetivo:** reconhecer siglas em contexto real.

1. Abra 3 Pull Requests fechados de um projeto open source grande (ex: TypeScript, Node.js, VS Code no GitHub).
2. Anote cada sigla e abreviação que aparecer nos comentários.
3. Pra cada uma: significado e a frase onde apareceu.
4. Fale em voz alta as 10 siglas técnicas da tabela 1 que você mais vai usar.

**Pronto quando:** você entende os comentários dos 3 PRs sem procurar nenhuma sigla.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Situação | Siglas |
|---|---|
| Código | API, CLI, SDK, IDE, JSON, DOM |
| Dados | CRUD, SQL, ORM |
| Entrega | CI/CD, LTS, MVP |
| Code review | PR, LGTM, PTAL, nit, WIP |
| Chat | IMO, AFAIK, TL;DR, FYI, ETA, TBD |

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar.

**Siglas que encontrei de verdade (sigla · onde):**
- 

**O que me confundiu / onde eu errei:**
- 

---

## 📚 Recursos

- [YouGlish](https://youglish.com/): pronúncia de siglas em vídeos reais
- [Conventional Comments](https://conventionalcomments.org/): o padrão de comentários de review (nit, suggestion, question...)

---
nivel: escrito
foco: essencial
revisado:
---

# Vocabulário Técnico

**Quanto focar: 🔥 essencial.** É o inglês que você vai ler todo dia em código, erro e documentação. Domine, e vá aumentando o seu glossário.

Leia três mensagens de erro, de três ferramentas diferentes: *Failed to fetch.* *Unexpected token in JSON at position 0.* *Request timed out.* Agora abra a documentação de uma biblioteca qualquer: *This method parses the input and returns...* Depois de algumas semanas lendo esse tipo de coisa, você percebe um padrão: são sempre as **mesmas palavras**, aparecendo em todo lugar, em combinações diferentes.

Esse é o grande segredo do vocabulário técnico. Código, mensagens de erro e documentação usam um vocabulário **pequeno e muito repetido**: umas 150 palavras cobrem a maior parte de tudo o que você vai ler. A maioria são **verbos de ação** (*fetch*, *parse*, *render*, *throw*) e **nomes de coisas do código** (*array*, *string*, *branch*, *request*).

E a melhor forma de aprender essas palavras é **por grupo**, cada uma com uma frase real de exemplo. Quando você conhece o grupo dos verbos de dados, o dos verbos de erro, e as palavras das mensagens de erro, a documentação e o terminal param de assustar, porque você passa a reconhecer as mesmas palavras em todo canto. Ajuda ter passado pelas [[Palavras de Alta Frequência]] e pelo [[Sentence Mining]].

## Os verbos dos dados

São os verbos do que se faz **com os dados**: buscar, transformar, guardar.

| Verbo | Quer dizer | Onde aparece |
|---|---|---|
| *fetch* | buscar (geralmente pela rede) | `fetch(url)` |
| *parse* | ler um texto e transformar em estrutura | `JSON.parse` |
| *serialize* / *stringify* | transformar uma estrutura em texto | `JSON.stringify` |
| *store* / *save* / *persist* | guardar | "the data is persisted to disk" |
| *load* / *read* | carregar / ler | `readFile` |
| *retrieve* | recuperar algo que foi guardado | "retrieve a user by id" |
| *update* / *delete* | atualizar / apagar | CRUD |
| *filter* / *map* / *reduce* / *sort* | filtrar / transformar / juntar / ordenar | métodos de array |
| *append* / *prepend* | adicionar no fim / no começo | `appendFile` |
| *merge* | juntar | Git, objetos |

O par que mais confunde é o ***parse*** e o ***serialize***, e vale entender bem, porque eles aparecem o tempo todo. São caminhos **opostos**. O *parse* lê um **texto** e monta a **estrutura** a partir dele: `JSON.parse('{"a":1}')` transforma aquele texto num objeto de verdade. O *serialize* faz o contrário: pega a **estrutura** e escreve ela como **texto**, com o `JSON.stringify(obj)`. Na prática: você faz *parse* quando carrega um arquivo, e *serialize* quando salva.

## Os verbos de quando o programa roda

São os verbos do que o programa **faz** enquanto está rodando:

| Verbo | Quer dizer |
|---|---|
| *run* / *execute* | rodar |
| *call* / *invoke* | chamar (uma função) |
| *return* | devolver |
| *throw* / *raise* | lançar (um erro) |
| *catch* / *handle* | capturar / tratar (um erro) |
| *await* / *resolve* / *reject* | esperar / cumprir / rejeitar ([[Promises]]) |
| *trigger* / *fire* | disparar (um evento) |
| *render* | desenhar na tela |
| *spawn* | criar (um processo) |
| *hang* / *freeze* | travar |
| *crash* | quebrar e fechar |

Os erros, nessa linguagem, funcionam como uma bola. O código **lança** o erro (*throw*), e outro trecho **pega** ele (*catch*) pra tratar. Se ninguém pegar a bola, o programa **quebra** (*crash*). Com essa imagem na cabeça, um *Uncaught Error* passa a fazer sentido: é um erro que ninguém pegou.

E existe um outro grupo, o dos verbos do **ciclo de trabalho**, que aparecem nas conversas do time, nos commits e na documentação de deploy:

| Verbo | Quer dizer |
|---|---|
| *install* / *set up* / *configure* | instalar / preparar / configurar |
| *build* / *compile* | gerar a versão final / compilar |
| *deploy* / *ship* / *release* | colocar no ar / entregar / lançar |
| *roll back* | voltar pra versão anterior |
| *commit* / *push* / *pull* | gravar / enviar / baixar (Git) |
| *review* / *approve* | revisar / aprovar |
| *debug* / *troubleshoot* | caçar um bug / investigar um problema |
| *refactor* | reorganizar o código sem mudar o comportamento |
| *bump* | subir (a versão): "bump version to 1.2.0" |
| *deprecate* | marcar como obsoleto |

Um detalhe cultural: muitos desses termos **não se traduzem**, nem entre quem fala português. Ninguém diz "empurrar" pro *push*, nem "galho" pra *branch*. São usados em inglês mesmo, no meio de uma frase em português ("faz o push na branch"). Então não perca tempo tentando traduzir: aprenda o termo em inglês, e use.

## As palavras das mensagens de erro

| Na mensagem | Quer dizer |
|---|---|
| *cannot read properties of undefined* | não dá pra ler uma propriedade de algo vazio |
| *is not defined* / *is not a function* | não existe / não é uma função |
| *unexpected token* | apareceu um símbolo onde não devia |
| *not found* / *no such file or directory* | não encontrado / o arquivo não existe |
| *permission denied* / *access denied* | sem permissão |
| *timed out* | demorou demais, e desistiu de esperar |
| *failed to* ... | falhou ao ... |
| *expected X but received Y* | esperava X, recebeu Y |
| *is not assignable to* | (TypeScript) o tipo não encaixa |
| *possibly undefined* | pode estar vazio |

As mensagens de erro são, provavelmente, o inglês mais útil que você vai aprender. Elas dizem exatamente o que está errado, e com essas poucas palavras você entende a maioria delas. Volte às três do começo da nota: *Failed to fetch* é "falhou ao buscar"; *Unexpected token in JSON* é "apareceu um símbolo inesperado no JSON"; *Request timed out* é "a requisição demorou demais". O jeito de ler um erro inteiro, com o tipo, a mensagem e o local, está em [[Ler Mensagens de Erro]].

## Falsos amigos e pronúncia

Algumas palavras técnicas parecem português, e significam outra coisa:

| Palavra | Não é | É |
|---|---|---|
| *actually* | atualmente | na verdade |
| *eventually* | eventualmente | no fim das contas, mais cedo ou mais tarde |
| *library* | livraria | biblioteca (de código) |
| *issue* | emissão | problema, tarefa (no GitHub) |
| *assign* | assinar | atribuir |
| *argument* | argumento de discussão | o valor passado pra uma função |
| *support* | suportar (aguentar) | dar suporte, ser compatível com |

A nota [[Falsos Cognatos]] tem a lista completa. E alguns termos técnicos têm uma pronúncia que engana: *cache* é igual a *cash* (e não "cachê"), *null* é "nâl", *queue* é "kiú", *GUI* é "gúi". Na dúvida, o [YouGlish](https://youglish.com/) mostra devs de verdade falando cada um.

E um conselho pra fechar: não espere saber todas essas palavras antes de começar a ler documentação. É exatamente o contrário. Você aprende essas palavras **lendo** erros e documentação de verdade, e guardando a frase onde achou cada uma, como o [[Sentence Mining]] ensina.

## O essencial

1. O vocabulário técnico é pequeno e repetido: umas 150 palavras cobrem quase tudo.
2. Aprenda por grupo: dados, execução, ciclo de trabalho, mensagens de erro.
3. *Parse* transforma texto em estrutura; *serialize* faz o contrário.
4. *Throw* lança o erro, *catch* pega; sem *catch*, *crash*.
5. Muitos termos não se traduzem (*push*, *branch*). E cuidado com os falsos amigos (*actually*, *issue*).

## Agora é com você

Entenda dez mensagens reais sem tradutor. Junte dez mensagens em inglês que você já viu: erros do terminal, do TypeScript, do Git, do npm. Pra cada uma, escreva em português o que ela diz, e o que você faria a respeito. Sublinhe as palavras que você não sabia, e procure **só elas**. Leve as cinco mais úteis pro Anki, com a mensagem inteira como frase. Você terminou quando conseguir explicar as dez mensagens e tiver cinco cartões novos, com frases reais.

Depois, comece um projeto que vai crescer junto com o roadmap: **o seu glossário vivo.** Ele nasce do que você lê de verdade, e não de uma lista pronta. Crie uma seção "Meu glossário" aqui embaixo, em "Minhas anotações" (ou uma tabela em outra nota), com a palavra, o significado, e a frase onde você achou. Toda semana, acrescente cinco palavras novas, vindas das notas do Roadmap, de mensagens de erro ou de documentação. E as que mais aparecem vão pro Anki. São uns 15 minutos por semana, durante o Estágio 1 inteiro. Você terminou quando o glossário tiver 40 ou mais palavras suas, e você conseguir ler os erros do terminal sem parar pra traduzir. Se quiser ir além, grave você falando cinco frases técnicas e compare a pronúncia com o YouGlish ([[Shadowing]]), e escreva o README de um projeto seu em inglês usando as palavras do glossário.

Daqui, siga pras [[Siglas Técnicas]], pra [[Ler Documentação]] e pro [[Inglês em Commits, Issues e PRs]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre *parse* e *serialize*?
> *Parse* transforma texto em estrutura (ex: `JSON.parse`); *serialize*/*stringify* faz o contrário, estrutura em texto.

> [!question]- O que significa *throw* e *catch* num erro?
> *Throw* é lançar o erro; *catch* é capturá-lo pra tratar.

> [!question]- O que quer dizer *deploy*?
> Colocar uma versão do software no ar (em produção).

> [!question]- O que significa *actually* em inglês?
> "Na verdade", e não "atualmente" (que seria *currently*).

> [!question]- O que diz a mensagem *request timed out*?
> Que a requisição demorou demais e o programa desistiu de esperar.

> [!question]- O que é *bump* a version?
> Subir o número da versão (ex: de 1.1.0 pra 1.2.0).

> [!question]+ Num log, *request timed out* significa:
> - a) A requisição foi recusada por falta de permissão
> - b) A requisição demorou demais e desistiram de esperar a resposta
> - c) O servidor retornou erro 500
> - d) A requisição foi enviada duas vezes
>
> > [!check]- Resposta
> > **b)** *Time out* = esgotar o tempo. A causa pode ser servidor lento, rede ou endereço errado, mas o sintoma é "não respondeu a tempo".

> [!question]+ O que significa *parse* um JSON?
> - a) Transformar o texto em objeto/dados
> - b) Transformar o objeto em texto
> - c) Enviar o JSON pra API
> - d) Validar a senha
>
> > [!check]- Resposta
> > **a)** *Parse* = ler texto e montar a estrutura (`JSON.parse`). O caminho inverso, de objeto pra texto, é *serialize* (`JSON.stringify`).

---

## Pra consultar depois

| Grupo | Palavras-chave |
|---|---|
| Dados | fetch, parse, stringify, store, load, retrieve, append, merge |
| Execução | run, call, return, throw, catch, await, render, crash |
| Ciclo | build, deploy, ship, roll back, review, refactor, bump |
| Erros | not found, denied, timed out, unexpected, expected...received |
| Falsos amigos | actually, eventually, library, issue, assign |

**Pra usar:** o [YouGlish](https://youglish.com/) mostra como devs falam cada termo em vídeos reais. O [glossário do MDN](https://developer.mozilla.org/en-US/docs/Glossary) tem definições curtas, em inglês simples, de centenas de termos da web, e é ótimo pra ler direto em inglês. E o [Cambridge Dictionary](https://dictionary.cambridge.org/) dá o significado, a pronúncia e exemplos de cada palavra.

## Minhas anotações

**Meu glossário** (palavra · significado · frase onde achei):
- 

**O que me confundiu / onde eu errei:**
-

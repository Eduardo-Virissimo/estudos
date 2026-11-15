---
nivel: escrito
revisado:
---

# Vocabulário Técnico

> *"Você já fala mais inglês do que imagina: todo dia você 'commita', 'deploya' e 'debuga'."*

> [!tip] ⚡ Em 30 segundos
> Código, mensagens de erro e documentação usam um vocabulário **pequeno e muito repetido**: umas 150 palavras cobrem a maior parte do que você lê. A maioria são **verbos de ação** (*fetch*, *parse*, *render*, *throw*) e **substantivos de coisas do código** (*array*, *string*, *branch*, *request*). Aprender esses por grupo, com uma frase real de exemplo, faz a documentação e os erros pararem de assustar.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Entender os verbos mais comuns de código e documentação sem traduzir
- Ler uma mensagem de erro em inglês e dizer o que ela significa
- Montar seu próprio glossário com frases reais dos projetos que você usa

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Palavras de Alta Frequência]] · [[Sentence Mining]]
- **Depois:** [[Siglas Técnicas]] · [[Ler Documentação]] · [[Inglês em Commits, Issues e PRs]]
- **Trilhas:** [[Inglês]] · [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Verbos de dados

| Verbo | Significa | Onde aparece |
|---|---|---|
| *fetch* | buscar (geralmente pela rede) | `fetch(url)` |
| *parse* | interpretar um texto e transformar em estrutura | `JSON.parse` |
| *serialize* / *stringify* | transformar estrutura em texto | `JSON.stringify` |
| *store* / *save* / *persist* | guardar | "the data is persisted to disk" |
| *load* / *read* | carregar / ler | `readFile` |
| *retrieve* | recuperar (buscar algo guardado) | "retrieve a user by id" |
| *update* / *delete* | atualizar / apagar | CRUD |
| *filter* / *map* / *reduce* / *sort* | filtrar / transformar / juntar / ordenar | métodos de array |
| *append* / *prepend* | adicionar no fim / no começo | `appendFile` |
| *merge* | juntar | Git, objetos |

### 2. Verbos de execução

| Verbo | Significa |
|---|---|
| *run* / *execute* | rodar |
| *call* / *invoke* | chamar (uma função) |
| *return* | devolver |
| *throw* / *raise* | lançar (um erro) |
| *catch* / *handle* | capturar / tratar (um erro) |
| *await* / *resolve* / *reject* | esperar / cumprir / rejeitar (Promises) |
| *trigger* / *fire* | disparar (um evento) |
| *render* | desenhar na tela |
| *spawn* | criar (um processo) |
| *hang* / *freeze* | travar |
| *crash* | quebrar e fechar |

### 3. Verbos do ciclo de trabalho

| Verbo | Significa |
|---|---|
| *install* / *set up* / *configure* | instalar / preparar / configurar |
| *build* / *compile* | gerar a versão final / compilar |
| *deploy* / *ship* / *release* | colocar no ar / entregar / lançar |
| *roll back* | voltar pra versão anterior |
| *commit* / *push* / *pull* | gravar / enviar / baixar (Git) |
| *review* / *approve* | revisar / aprovar |
| *debug* / *troubleshoot* | caçar bug / investigar problema |
| *refactor* | reorganizar o código sem mudar o comportamento |
| *bump* | subir (a versão): "bump version to 1.2.0" |
| *deprecate* | marcar como obsoleto |

### 4. Palavras de mensagens de erro

| Na mensagem | Quer dizer |
|---|---|
| *cannot read properties of undefined* | não dá pra ler propriedade de algo vazio |
| *is not defined* / *is not a function* | não existe / não é função |
| *unexpected token* | apareceu um símbolo onde não devia |
| *not found* / *no such file or directory* | não encontrado / arquivo não existe |
| *permission denied* / *access denied* | sem permissão |
| *timed out* | demorou demais e desistiu |
| *failed to* ... | falhou ao ... |
| *expected X but received Y* | esperava X, recebeu Y |
| *is not assignable to* | (TypeScript) o tipo não encaixa |
| *possibly undefined* | pode estar vazio |

Mais sobre como ler erros em [[Ler Mensagens de Erro]].

### 5. Falsos amigos técnicos

| Palavra | Não é | É |
|---|---|---|
| *actually* | atualmente | na verdade |
| *eventually* | eventualmente | no fim das contas, mais cedo ou mais tarde |
| *library* | livraria | biblioteca (de código) |
| *issue* | emissão | problema / tarefa (no GitHub) |
| *assign* | assinar | atribuir |
| *argument* | argumento de discussão | valor passado pra função |
| *support* | suportar (aguentar) | dar suporte, ser compatível com |

Mais em [[Falsos Cognatos]].

---

## 🔧 Pegadinhas

- **Decorar lista solta.** Palavra sem frase some em uma semana. Guarde a **frase real** onde você achou ([[Sentence Mining]]).
- **Traduzir termos que não se traduzem.** Ninguém diz "empurrar" pra `push` ou "galho" pra *branch*. Use o termo em inglês mesmo.
- **Pronúncia inventada.** *Cache* é "kash" (não "cachê"), *null* é "nâl", *queue* é "kiu", *GUI* é "gúi" ou "dji-iú-ái". Confira no [YouGlish](https://youglish.com/).
- **Achar que precisa saber tudo antes.** Você aprende essas palavras lendo erro e documentação de verdade. Comece já.

---

## 🔨 Desafio prático

**Objetivo:** entender 10 mensagens reais sem tradutor.

1. Junte 10 mensagens em inglês que você já viu: erros do terminal, do TypeScript, do Git, do npm.
2. Pra cada uma, escreva em português o que ela diz e o que você faria.
3. Sublinhe as palavras que você não sabia e procure **só elas**.
4. Leve as 5 mais úteis pro Anki, com a mensagem inteira como frase.

**Pronto quando:** você explica as 10 mensagens e tem 5 cartões novos com frases reais.

---

## 🚀 Projeto

> [!example] O seu glossário vivo
> Um glossário que nasce do que você lê de verdade, não de uma lista pronta. Cresce junto com o Roadmap.
>
> **Tempo:** 15 min por semana, durante o Estágio 1 inteiro

**O mínimo:**
- [ ] Uma seção "Meu glossário" no 📓 Diário de bordo desta nota (ou uma tabela em outra nota), com palavra, significado e a frase onde você achou
- [ ] Toda semana, 5 palavras novas vindas das notas do Roadmap, de mensagens de erro ou da documentação
- [ ] As que mais aparecem vão pro Anki

**Se quiser ir além:**
- Gravar você falando 5 frases técnicas e comparar a pronúncia com o YouGlish ([[Shadowing]])
- Escrever o README de um projeto seu em inglês usando as palavras do glossário

**Pronto quando:** o glossário tem 40+ palavras suas e você lê os erros do terminal sem parar pra traduzir.

> Terminou? Mude `nivel` para `projeto` e conte no 📓 Diário de bordo onde travou.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Grupo | Palavras-chave |
|---|---|
| Dados | fetch, parse, stringify, store, load, retrieve, append, merge |
| Execução | run, call, return, throw, catch, await, render, crash |
| Ciclo | build, deploy, ship, roll back, review, refactor, bump |
| Erros | not found, denied, timed out, unexpected, expected...received |
| Falsos amigos | actually, eventually, library, issue, assign |

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar.

**Meu glossário** (palavra · significado · frase onde achei):
- 

**O que me confundiu / onde eu errei:**
- 

---

## 📚 Recursos

- [YouGlish](https://youglish.com/): ouça como devs falam cada termo em vídeos reais
- [MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary): definições curtas, em inglês simples, de termos da web
- [Cambridge Dictionary](https://dictionary.cambridge.org/): significado + pronúncia + exemplos

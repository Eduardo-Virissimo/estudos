---
nivel: escrito
revisado:
---

# Ler Documentação

> *"RTFM: a resposta quase sempre está na documentação."*

> [!tip] ⚡ Em 30 segundos
> Documentação técnica é o inglês **mais fácil** que existe: frases curtas, vocabulário repetitivo e um assunto que você já entende. O segredo não é ler tudo, é **saber onde olhar**: toda doc tem a mesma estrutura (Getting Started, Guides, API Reference) e você pula direto pra parte que resolve o seu problema.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Achar em menos de 2 minutos a parte da documentação que responde sua dúvida
- Ler a assinatura de uma função na *API Reference* (parâmetros, retorno, exceções)
- Entender as palavras que mais aparecem em docs (*deprecated*, *optional*, *returns*...)

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Leitura Extensiva]] · [[Vocabulário Técnico]]
- **Depois:** [[Inglês em Commits, Issues e PRs]]
- **Trilhas:** [[Inglês]] · [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. O mapa de toda documentação

| Seção | Pra que serve | Quando ir |
|---|---|---|
| **Getting Started / Quickstart** | Instalar e rodar o primeiro exemplo | Primeiro contato |
| **Tutorial** | Construir algo passo a passo | Aprendendo do zero |
| **Guides / How-to** | Resolver uma tarefa específica ("How to deploy") | Sabe o que quer fazer |
| **Concepts / Explanation** | Entender *como funciona* por dentro | Quer entender o porquê |
| **API Reference** | Cada função/classe, com parâmetros e retorno | Já sabe o nome da coisa |
| **Changelog / Release notes** | O que mudou em cada versão | Algo quebrou depois de atualizar |
| **FAQ / Troubleshooting** | Erros comuns | Deu erro |

### 2. Lendo uma API Reference

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

- `?` ou *Optional* = não é obrigatório.
- **Return value** = o que a função devolve.
- **Exceptions / Throws** = os erros que ela pode lançar.
- **Example**: quase sempre tem um exemplo. Leia o exemplo **primeiro**.

### 3. As palavras que mais aparecem

| Palavra | Significa |
|---|---|
| *deprecated* | Obsoleto: ainda funciona, mas vai sair. Não use. |
| *optional* / *required* | Opcional / obrigatório |
| *default* | Valor padrão, se você não passar nada |
| *returns* / *throws* | Devolve / lança (erro) |
| *note* / *warning* / *caveat* | Observação / cuidado / ressalva |
| *e.g.* / *i.e.* | Por exemplo / ou seja |
| *under the hood* | Por baixo dos panos, internamente |

---

## 🔧 Pegadinhas

- **Traduzir a página inteira.** Você perde o hábito e o tradutor erra termos técnicos ("*thread*" vira "linha"). Traduza só a frase que travou.
- **Ler de cima a baixo.** Use `Ctrl+F` e a barra de busca da doc. Ninguém lê documentação como livro.
- **Ignorar a versão.** Confira se a doc é da versão que você usa (geralmente tem um seletor no topo).

---

## 🔨 Desafio prático

**Objetivo:** resolver uma dúvida real usando só a documentação em inglês.

1. Escolha uma ferramenta que você usa (ex.: Git, Node.js, Python).
2. Escreva uma pergunta real ("como desfazer o último commit?").
3. Ache a resposta na doc oficial **sem** tradutor e sem Google, usando o mapa da seção 1.
4. Anote: em qual seção achou, quanto tempo levou e quais palavras eram novas (essas vão pro [[Sentence Mining]]).

**Pronto quando:** você achou a resposta em menos de 5 minutos, sem traduzir a página.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Você já sabe o nome da função e quer saber os parâmetros. Qual seção abrir?
> A **API Reference**.

> [!question]- O que significa *deprecated*?
> Obsoleto: ainda funciona, mas será removido no futuro. Evite usar.

> [!question]- Algo quebrou depois de atualizar uma biblioteca. Onde olhar primeiro?
> No **Changelog / Release notes**, que lista o que mudou em cada versão (procure *breaking changes*).

> [!question]- Qual a diferença entre *e.g.* e *i.e.*?
> *e.g.* = por exemplo; *i.e.* = ou seja / isto é.

---

## 📋 Cola rápida

| Quero... | Vá em |
|---|---|
| Começar do zero | Getting Started |
| Fazer uma tarefa | Guides / How-to |
| Detalhes de uma função | API Reference |
| Entender o porquê | Concepts |
| Atualizei e quebrou | Changelog |
| Deu erro | Troubleshooting / FAQ |

---

## 📓 Diário de bordo

> Esta parte é **sua**.

**Dúvida que resolvi pela documentação (ferramenta, seção, tempo):**
- 

**Palavras novas:**
- 

---

## 📚 Recursos

- [MDN Web Docs](https://developer.mozilla.org/): exemplo de documentação muito bem organizada
- [Diátaxis](https://diataxis.fr/): o modelo (tutorial, how-to, reference, explanation) que muitas documentações seguem

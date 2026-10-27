# 📚 Formatter

> *"Código bonito não é luxo, é consistência que ninguém precisa discutir."*

---

## O que é um Formatter?

Um **formatter** (formatador de código) reescreve automaticamente o seu código seguindo um **padrão visual fixo**: indentação, espaços, aspas, quebras de linha, vírgulas finais, etc. Ele **não muda o comportamento** do programa, só a aparência.

Exemplos: **Prettier** (JavaScript, TypeScript, CSS, HTML, JSON, Markdown), **Black** e **Ruff format** (Python), **gofmt** (Go), **rustfmt** (Rust), **google-java-format** (Java).

### Uma História Breve 📜

Antes dos formatters, equipes gastavam tempo em discussões sobre estilo (tabs vs espaços, onde colocar chaves). O **gofmt**, da linguagem Go, ajudou a popularizar a ideia de um único formato oficial. No ecossistema JavaScript, o **Prettier** (criado por James Long, por volta de 2017) tornou-se o padrão de fato, e o **Black** fez o mesmo no Python ("o formatador sem concessões").

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Fim das discussões de estilo**: o formatter decide, o time segue.
- 📦 **Diffs mais limpos**: o Git mostra mudanças reais, não espaços.
- 🔧 **Economia de tempo**: você escreve e o editor arruma ao salvar.
- 🤖 **Consistência automática**: todo o projeto com o mesmo visual, independente de quem escreveu.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Formatter vs Linter

- **Formatter**: cuida da **aparência** do código.
- **[[Linter]]**: cuida da **qualidade e dos erros** potenciais.

Os dois se complementam.

### Conceito 2: Antes e depois

```javascript
// Antes
const soma = (a,b)=>{return a+b}
if(x==1){console.log('ok')}

// Depois (Prettier, configuração padrão)
const soma = (a, b) => {
  return a + b;
};
if (x == 1) {
  console.log("ok");
}
```

### Conceito 3: Configuração mínima ("opinionated")

Formatters modernos têm poucas opções de propósito. O arquivo de configuração costuma ser pequeno:

```json
{
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "printWidth": 80
}
```

(arquivo `.prettierrc`)

### Conceito 4: Formatar ao salvar

O fluxo ideal é o editor formatar o arquivo toda vez que você salva, sem esforço manual.

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

Prettier (JavaScript):

```bash
npm install --save-dev prettier
npx prettier --write .
```

Black (Python):

```bash
pip install black
black .
```

### Exemplo 2: Caso de Uso Real

Verificar formatação na CI sem alterar arquivos:

```bash
npx prettier --check .
black --check .
```

E scripts no `package.json`:

```json
{
    "scripts": {
        "format": "prettier --write .",
        "format:check": "prettier --check ."
    }
}
```

---

## Configurações Recomendadas ⚙️

No `settings.json` do [[VS Code]], com a extensão Prettier instalada:

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
}
```

Arquivo `.prettierignore` para pular pastas geradas:

```text
node_modules
dist
build
```

---

## Dicas de Ouro 💎

### 1. Coloque a config no repositório

Assim todo mundo do projeto usa o mesmo formato, independente das configurações pessoais do editor.

### 2. Formate o projeto inteiro em um commit separado

Ao adotar um formatter num projeto existente, faça um commit só de formatação para não misturar com mudanças de lógica.

### 3. Evite conflito com o linter

Desative as regras de estilo do linter que duplicam o formatter (no ESLint, use `eslint-config-prettier`).

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `npx prettier --write .` | Formata todos os arquivos suportados |
| `npx prettier --check .` | Só verifica, sem alterar |
| `black .` | Formata projeto Python |
| `black --check .` | Verifica formatação Python |
| `gofmt -w .` | Formata código Go |
| `.prettierrc` | Arquivo de configuração do Prettier |
| `.prettierignore` | Lista o que não deve ser formatado |

---

## Exercício Prático 🎯

**Objetivo:** Configurar formatação automática ao salvar.

```bash
# 1. Instale a extensão Prettier no VS Code
# 2. Ative "editor.formatOnSave" e defina o Prettier como formatter padrão
# 3. Crie um arquivo .js bagunçado (sem espaços, aspas misturadas)
# 4. Salve e observe a formatação automática
# 5. Crie um .prettierrc e mude tabWidth para 4, depois salve de novo
# 6. Rode npx prettier --check . e veja o resultado
```

---

## Próximos Passos ✅

- [ ] Instalar o formatter da sua linguagem principal
- [ ] Ativar formatação ao salvar no editor
- [ ] Adicionar `format:check` na integração contínua
- [ ] Combinar com um [[Linter]] no mesmo projeto

---

## Recursos Recomendados 📚

### 💻 Sites e Documentação:
- [Prettier](https://prettier.io/docs/en/) - Documentação oficial
- [Black](https://black.readthedocs.io) - Formatador oficial do ecossistema Python
- [Ruff Formatter](https://docs.astral.sh/ruff/formatter/) - Alternativa rápida para Python

---

## Problemas Comuns e Soluções 🔧

### Problema: O arquivo não formata ao salvar

**Solução:**
1. Confirme se há um formatter padrão definido (`editor.defaultFormatter`).
2. Verifique se a extensão está instalada e se o tipo de arquivo é suportado.
3. Veja se o arquivo não está listado no `.prettierignore`.

### Problema: Cada pessoa do time gera um formato diferente

**Solução:**
1. Versione o `.prettierrc` (ou equivalente) no repositório.
2. Fixe a versão do formatter no `package.json` para todos usarem a mesma.

---

## Conclusão 🎉

Um formatter elimina uma categoria inteira de discussão e retrabalho: você escreve, salva e o código se organiza sozinho. Ele é um dos ganhos mais fáceis de produtividade e consistência.

Configure uma vez, automatize ao salvar e foque no que realmente importa: a lógica do programa.

---



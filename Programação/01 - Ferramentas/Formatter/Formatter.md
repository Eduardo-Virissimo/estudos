---
nivel: escrito
revisado:
---

# Formatter

> *"Código bonito não é luxo, é consistência que ninguém precisa discutir."*

> [!tip] ⚡ Em 30 segundos
> Reescreve a **aparência** do código (espaços, aspas, quebras de linha) num padrão fixo, como o Prettier. Acaba com discussão de estilo no time: você salva, ele formata, pronto.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Configurar formatação automática ao salvar
- Versionar a configuração para o time inteiro formatar igual
- Fazer linter e formatter trabalharem juntos sem conflito

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Linter]] · [[VS Code]]
- **Depois:** [[Git Básico]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é um Formatter?

Um **formatter** (formatador de código) reescreve automaticamente o seu código seguindo um **padrão visual fixo**: indentação, espaços, aspas, quebras de linha, vírgulas finais, etc. Ele **não muda o comportamento** do programa, só a aparência.

Exemplos: **Prettier** (JavaScript, TypeScript, CSS, HTML, JSON, Markdown), **Black** e **Ruff format** (Python), **gofmt** (Go), **rustfmt** (Rust), **google-java-format** (Java).

> [!note]- 📜 Um pouco de história
> Antes dos formatters, equipes gastavam tempo em discussões sobre estilo (tabs vs espaços, onde colocar chaves). O **gofmt**, da linguagem Go, ajudou a popularizar a ideia de um único formato oficial. No ecossistema JavaScript, o **Prettier** (criado por James Long, por volta de 2017) tornou-se o padrão de fato, e o **Black** fez o mesmo no Python ("o formatador sem concessões").

---

## 🧱 Conceitos-chave

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

## 🛠️ Exemplos guiados

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

## ⚙️ Configuração recomendada

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

## 💎 Boas práticas

### 1. Coloque a config no repositório

Assim todo mundo do projeto usa o mesmo formato, independente das configurações pessoais do editor.

### 2. Formate o projeto inteiro em um commit separado

Ao adotar um formatter num projeto existente, faça um commit só de formatação para não misturar com mudanças de lógica.

### 3. Evite conflito com o linter

Desative as regras de estilo do linter que duplicam o formatter (no ESLint, use `eslint-config-prettier`).

---

## 🔧 Erros comuns e como resolver

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

## 🔨 Desafio prático

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

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Qual a diferença entre formatter e linter?
> O **formatter** cuida da aparência. O **linter** aponta problemas de qualidade e bugs prováveis (variável não usada, `==`).

> [!question]- Por que a configuração do formatter vai pro repositório?
> Pra todo mundo formatar igual. Sem isso, cada commit vira uma guerra de diffs de estilo.

> [!question]- Por que formatar o projeto inteiro num commit separado?
> Pra não misturar mudança de lógica com mudança de estilo. O review e o `git blame` ficam limpos.

> [!question]- O arquivo não formata ao salvar. O que checar?
> `editor.formatOnSave` ligado, o Prettier definido como formatter padrão, extensão instalada e se o arquivo tem erro de sintaxe.

> [!question]- O que faz `npx prettier --check .`?
> Verifica se está tudo formatado **sem alterar nada**. Ideal pra CI.

> [!question]- `editor.formatOnSave`
> config do VS Code que formata ao salvar

> [!question]- `.prettierrc`
> arquivo de configuração do Prettier

> [!question]- `prettier --write .`
> formata todos os arquivos

> [!question]- Formatter "opinionated"
> poucas opções de propósito, pra ninguém discutir estilo

> [!question]- `eslint-config-prettier`
> desliga as regras de estilo do ESLint que brigam com o Prettier

> [!question]- Formatter muda o comportamento do código?
> Não. Só a aparência.

---

## 📋 Cola rápida

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

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
-

**O que me confundiu / onde eu errei:**
-

**Onde eu usei de verdade:**
-

---

## ➡️ Próximos passos

- [x] Instalar o formatter da sua linguagem principal
- [x] Ativar formatação ao salvar no editor
- [x] Adicionar `format:check` na integração contínua
- [x] Combinar com um [[Linter]] no mesmo projeto

---

## 📚 Recursos

### 💻 Sites e Documentação:
- [Prettier](https://prettier.io/docs/en/) - Documentação oficial
- [Black](https://black.readthedocs.io) - Formatador oficial do ecossistema Python
- [Ruff Formatter](https://docs.astral.sh/ruff/formatter/) - Alternativa rápida para Python

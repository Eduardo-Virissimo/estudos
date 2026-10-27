# 📚 Linter

> *"Um revisor de código que nunca se cansa e nunca esquece uma regra."*

---

## O que é um Linter?

Um **linter** é uma ferramenta que faz **análise estática** do código, ou seja, lê seu código sem executá-lo e aponta **erros potenciais, más práticas e problemas de estilo**. Exemplos: variável declarada e nunca usada, comparação suspeita, função muito complexa, import inexistente.

Cada linguagem tem seus linters: **ESLint** (JavaScript/TypeScript), **Pylint**, **Flake8** e **Ruff** (Python), **Checkstyle** (Java), **ShellCheck** (Bash), entre outros.

### Uma História Breve 📜

O termo vem do programa **lint**, criado por **Stephen C. Johnson** nos **Bell Labs** por volta de 1978 para encontrar problemas em código C que o compilador deixava passar. O nome faz referência à "pelugem" (*lint*) que se tira das roupas. Desde então, linters ficaram cada vez mais completos e hoje fazem parte do fluxo padrão de quase todo projeto.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Pega bugs cedo**: encontra problemas antes de rodar ou subir o código.
- 📦 **Padroniza o time**: todo mundo segue as mesmas regras.
- 🔧 **Ensina boas práticas**: as mensagens explicam o que está errado e por quê.
- 🤖 **Automatizável**: roda no editor, no commit e na integração contínua (CI).

---

## Conceitos Fundamentais 🎯

### Conceito 1: Regras (rules)

Cada verificação é uma regra, que pode ser configurada como **desligada**, **aviso (warn)** ou **erro (error)**.

```javascript
// Regra "no-unused-vars" acusaria esta variável
const nome = "Ana";   // declarada mas nunca usada
```

### Conceito 2: Arquivo de configuração

Define quais regras usar. No ESLint moderno (v9+), o formato padrão é o `eslint.config.js` (flat config). Versões anteriores usavam `.eslintrc`.

```javascript
// eslint.config.js
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn",
            "eqeqeq": "error"
        }
    }
];
```

### Conceito 3: Linter vs Formatter

- **Linter**: encontra erros e problemas de qualidade.
- **[[Formatter]]**: só reorganiza a aparência do código (espaços, aspas, quebras de linha).

Usam-se juntos, cada um no seu papel.

### Conceito 4: Autofix

Muitas regras podem ser corrigidas automaticamente:

```bash
npx eslint . --fix
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

JavaScript com ESLint:

```bash
npm install --save-dev eslint @eslint/js
npx eslint arquivo.js
```

Python com Ruff:

```bash
pip install ruff
ruff check .
```

### Exemplo 2: Caso de Uso Real

Integrar ao projeto via scripts do `package.json`:

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

No dia a dia: instale a extensão do ESLint no [[VS Code]] para ver sublinhados vermelhos/amarelos em tempo real e rode `npm run lint` antes de cada commit ou na CI.

---

## Configurações Recomendadas ⚙️

No `settings.json` do VS Code, para corrigir problemas ao salvar:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

---

## Dicas de Ouro 💎

### 1. Comece com a configuração "recommended"

Todo linter importante traz um conjunto recomendado. Ajuste regra por regra só quando tiver motivo.

### 2. Não desative regras por preguiça

Entenda por que a regra existe. Se precisar ignorar um caso pontual, use comentários localizados (ex.: `// eslint-disable-next-line regra`).

### 3. Rode na integração contínua

Assim ninguém mescla código que quebre as regras do projeto, mesmo sem ter o editor configurado.

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `npx eslint .` | Analisa o projeto (JavaScript/TypeScript) |
| `npx eslint . --fix` | Corrige o que for possível automaticamente |
| `ruff check .` | Analisa projeto Python com Ruff |
| `pylint arquivo.py` | Analisa arquivo Python com Pylint |
| `shellcheck script.sh` | Analisa scripts Bash |
| `// eslint-disable-next-line` | Ignora a regra na próxima linha |

---

## Exercício Prático 🎯

**Objetivo:** Configurar um linter e corrigir os problemas encontrados.

```bash
# 1. Crie um projeto: mkdir lint-teste && cd lint-teste && npm init -y
# 2. Instale: npm install --save-dev eslint @eslint/js
# 3. Crie eslint.config.js com a configuração recommended
# 4. Crie um index.js com variável não usada e uso de == em vez de ===
# 5. Rode npx eslint . e leia as mensagens
# 6. Corrija os erros (alguns com --fix)
```

---

## Próximos Passos ✅

- [ ] Instalar o linter da linguagem que você mais estuda
- [ ] Configurar a extensão no seu editor
- [ ] Aprender a ajustar regras no arquivo de configuração
- [ ] Combinar com um [[Formatter]] no mesmo projeto

---

## Recursos Recomendados 📚

### 📖 Livros:
- *Clean Code* (Robert C. Martin) - Princípios de código limpo que os linters ajudam a reforçar

### 💻 Sites e Documentação:
- [ESLint](https://eslint.org/docs/latest/) - Documentação oficial
- [Ruff](https://docs.astral.sh/ruff/) - Linter rápido para Python
- [ShellCheck](https://www.shellcheck.net/) - Linter para shell scripts

---

## Problemas Comuns e Soluções 🔧

### Problema: O linter e o formatter brigam entre si

**Solução:**
1. Use a configuração que desativa regras de estilo conflitantes (no caso do ESLint com Prettier, o pacote `eslint-config-prettier`).
2. Deixe estilo para o formatter e qualidade para o linter.

### Problema: Milhares de avisos num projeto antigo

**Solução:**
1. Comece só com regras de erro e vá aumentando aos poucos.
2. Corrija por pastas ou use `--fix` onde for seguro.

---

## Conclusão 🎉

O linter é um dos melhores investimentos para a qualidade do código: encontra problemas cedo, ensina boas práticas e mantém o time alinhado. Configurá-lo leva minutos e economiza horas de depuração.

Faça dele parte do seu fluxo desde o início de cada projeto.

---



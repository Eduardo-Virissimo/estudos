---
nivel: escrito
revisado:
---

# Git Básico

> *"Commit cedo, commit sempre. O Git só protege o que você salvou nele."*

> [!tip] ⚡ Em 30 segundos
> **Git** é um sistema que guarda o **histórico** do seu projeto: cada **commit** é uma foto de todos os arquivos num momento, com uma mensagem dizendo o que mudou. O ciclo do dia a dia é: editar → `git add` (escolher o que entra na foto) → `git commit` (tirar a foto). Com isso você volta no tempo, vê quem mudou o quê e trabalha sem medo de quebrar.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Configurar o Git e criar um repositório
- Explicar as três áreas (pasta de trabalho, staging, repositório) e fazer o ciclo `add` → `commit`
- Ler o histórico (`log`, `diff`, `show`) e ignorar arquivos com `.gitignore`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Terminal]] · [[VS Code]]
- **Depois:** [[GitHub e Pull Requests]] · [[Branches, Merge e Conflitos]] · [[Conventional Commits]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é Git?

Criado por **Linus Torvalds** em **2005** pra versionar o kernel Linux, depois que a ferramenta que eles usavam deixou de ser gratuita. É **distribuído**: cada cópia do repositório tem o histórico inteiro, então você trabalha offline e o servidor (GitHub) é só mais uma cópia.

> Git ≠ GitHub. **Git** é o programa no seu PC. **GitHub** é um site que hospeda repositórios Git ([[GitHub e Pull Requests]]).

---

## 🧱 O mínimo pra usar

### 1. Configuração (uma vez por PC)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # VS Code pra editar mensagens
```

### 2. Começar um repositório

```bash
git init            # transforma a pasta atual num repositório (cria a pasta oculta .git)
git clone <url>     # ou: baixa um repositório que já existe
```

### 3. As três áreas

```text
 pasta de trabalho  ──git add──►  staging (índice)  ──git commit──►  repositório (.git)
 (o que você edita)              (o que vai na foto)                (o histórico)
```

O staging existe pra você escolher: mexeu em 5 arquivos, mas só 2 são da mesma mudança? `add` nos 2, commit, depois os outros 3 num segundo commit.

### 4. O ciclo

```bash
git status                  # o que mudou? (use toda hora)
git add src/main.ts         # um arquivo
git add .                   # tudo da pasta atual pra baixo
git commit -m "Adiciona comando de listar tarefas"
```

`git status` mostra: **untracked** (novo, o Git não conhece), **modified** (mudou desde o último commit), **staged** (pronto pro commit).

### 5. Vendo o que mudou

```bash
git diff                    # mudanças ainda não adicionadas
git diff --staged           # o que vai entrar no próximo commit
git log --oneline           # histórico resumido
git log --oneline --graph --all   # com branches desenhadas
git show a1b2c3d            # o que um commit específico mudou
```

Cada commit tem um **hash** (`a1b2c3d...`): o identificador único dele.

### 6. `.gitignore`

Arquivo na raiz dizendo o que o Git deve ignorar:

```gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

Adicione **antes** do primeiro commit. O que já foi commitado continua rastreado: `git rm --cached arquivo` tira do Git sem apagar do disco.

### 7. Commit bom

- **Pequeno e de um assunto só.** "Adiciona validação de título" > "várias coisas".
- **Mensagem no imperativo**, dizendo o que o commit faz: "Corrige cálculo de XP", não "corrigi" nem "mudanças". Padrão completo em [[Conventional Commits]].
- **Funcionando.** Cada commit deveria rodar; fica fácil achar onde algo quebrou.

### 8. Desfazer o básico

```bash
git restore arquivo.ts           # descarta mudanças não adicionadas (⚠️ perde o que fez)
git restore --staged arquivo.ts  # tira do staging (mantém a mudança)
git commit --amend -m "Nova msg" # corrige o último commit (só se ainda não deu push)
```

O resto em [[Desfazendo Mudanças (Reset e Revert)]].

---

## 🛠️ Exemplo guiado

```bash
mkdir tarefas && cd tarefas
git init
echo "node_modules/" > .gitignore
echo "# Tarefas" > README.md
git status                     # 2 arquivos untracked
git add .
git commit -m "Cria projeto com README e gitignore"

echo "console.log('oi')" > main.js
git diff                       # nada: main.js é novo (untracked), diff só mostra modificados
git add main.js
git diff --staged              # agora aparece
git commit -m "Adiciona script inicial"

git log --oneline
# b4c2e1f Adiciona script inicial
# 9a8f7d3 Cria projeto com README e gitignore
```

No [[VS Code]], a aba **Source Control** (`Ctrl + Shift + G`) faz tudo isso com cliques e mostra o diff lado a lado. Aprenda pelo terminal primeiro, depois use o que preferir.

---

## 🔧 Pegadinhas

- **`git add .` sem olhar.** Commita `.env`, arquivos gigantes, lixo. Rode `git status` antes.
- **Commit "WIP", "ajustes", "asdf".** Daqui a 3 meses ninguém sabe o que é. Escreva o que mudou.
- **Commit gigante no fim do dia.** Mistura 5 assuntos e não dá pra desfazer só um.
- **`.gitignore` depois.** `node_modules` já commitado continua no histórico. Ignore no início.
- **Editor `vim` abrindo do nada.** Aconteceu ao rodar `git commit` sem `-m`. Pra sair: `Esc`, digite `:wq` e Enter. Melhor: configure o VS Code como editor.
- **`git restore` descarta de verdade.** Mudança não commitada e descartada não volta.

---

## 🔨 Desafio prático

**Objetivo:** dominar o ciclo e o staging.

1. Crie um repositório com `.gitignore` e um `README.md`, e faça o primeiro commit.
2. Edite 3 arquivos diferentes e faça **2 commits separados**: um com 2 arquivos, outro com o terceiro.
3. Use `git diff` e `git diff --staged` antes de cada commit.
4. Faça um commit com mensagem errada e corrija com `--amend`.
5. Mostre o histórico com `git log --oneline --graph`.

**Pronto quando:** o log mostra 3+ commits com mensagens claras e você sabe explicar em que área cada mudança estava em cada momento.

---

## 🚀 Projeto

> [!example] Versionar um projeto seu de verdade
> Coloque no Git algo que você já tem: os scripts dos desafios do Estágio 1, ou o próprio [[Gerenciador de Tarefas no Terminal]] desde o primeiro arquivo.
>
> **Tempo:** acompanha o projeto (5 min por commit)

**O mínimo:**
- [ ] Repositório criado antes do primeiro arquivo de código
- [ ] `.gitignore` certo desde o início (sem `node_modules`, `dist`, `.env`)
- [ ] Pelo menos 10 commits pequenos, cada um com um assunto
- [ ] Nenhuma mensagem do tipo "ajustes", "wip" ou "update"

**Se quiser ir além:**
- Usar `git add -p` pra commitar só parte das mudanças de um arquivo
- Configurar aliases: `git config --global alias.lg "log --oneline --graph --all"`

**Pronto quando:** lendo só o `git log --oneline`, alguém entende a história do projeto.

> Terminou? Mude `nivel` para `projeto` e conte no 📓 Diário de bordo onde travou.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quais são as três áreas do Git?
> Pasta de trabalho (onde você edita), staging/índice (o que vai no próximo commit) e repositório (o histórico de commits).

> [!question]- Qual a diferença entre `git diff` e `git diff --staged`?
> `diff` mostra mudanças ainda não adicionadas; `--staged` mostra o que já está no staging e vai no próximo commit.

> [!question]- Qual a diferença entre Git e GitHub?
> Git é o programa de controle de versão no seu computador; GitHub é um serviço online que hospeda repositórios Git.

> [!question]- O `.gitignore` funciona pra arquivos que já foram commitados?
> Não. Eles continuam rastreados; é preciso `git rm --cached arquivo` pra parar de rastrear.

> [!question]- O que é um commit bom?
> Pequeno, de um assunto só, funcionando, com mensagem no imperativo dizendo o que faz.

> [!question]- O que `git commit --amend` faz e quando não usar?
> Refaz o último commit (mensagem ou conteúdo). Não use depois de enviar (push) o commit pra outras pessoas.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git init` / `git clone url` | criar / baixar repositório |
| `git status` | o que mudou |
| `git add arquivo` / `git add .` | colocar no staging |
| `git commit -m "msg"` | gravar a foto |
| `git diff` / `git diff --staged` | ver mudanças |
| `git log --oneline --graph` | histórico |
| `git show hash` | detalhes de um commit |
| `git restore arquivo` | descartar mudança |
| `git restore --staged arquivo` | tirar do staging |
| `git commit --amend` | corrigir o último commit |

---

## 🛠️ Exemplo meu

```bash

```

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

## 📚 Recursos

- [Pro Git (livro oficial, gratuito, em português)](https://git-scm.com/book/pt-br/v2)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR): jogo visual e interativo
- [Oh Shit, Git!?!](https://ohshitgit.com/pt_BR): como sair das enrascadas mais comuns

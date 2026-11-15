---
nivel: escrito
revisado:
---

# GitHub e Pull Requests

> *"Pull request não é pedir permissão. É pedir uma segunda opinião antes de ser tarde."*

> [!tip] ⚡ Em 30 segundos
> **GitHub** hospeda repositórios Git na internet: backup, portfólio e o lugar onde times colaboram. Você liga o repositório local ao remoto (`origin`), envia commits com `git push` e baixa os dos outros com `git pull`. Pra propor uma mudança, você cria uma **branch**, envia e abre um **Pull Request (PR)**: uma página onde outras pessoas veem o diff, comentam, pedem ajustes e aprovam antes do **merge** na `main`.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Publicar um repositório local no GitHub e sincronizar com `push` e `pull`
- Abrir um Pull Request com título e descrição bons, e responder a uma revisão
- Contribuir num repositório que não é seu usando fork

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Git Básico]] · [[SSH]] (autenticação)
- **Depois:** [[Branches, Merge e Conflitos]] · [[Code Review]] · [[GitHub Actions]] · [[Portfólio e GitHub]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Autenticação

O GitHub não aceita mais senha no terminal. Duas opções:

- **SSH** (recomendado): uma chave no seu PC, cadastrada no GitHub. Passo a passo em [[SSH]].
- **HTTPS + GitHub CLI**: instale o `gh` e rode `gh auth login`; ele guarda o token por você.

### 2. Repositório local → GitHub

```bash
# crie um repositório VAZIO no site (sem README) e então:
git remote add origin git@github.com:usuario/tarefas.git
git push -u origin main         # -u liga a branch local à remota (só na primeira vez)

# com o GitHub CLI, tudo de uma vez:
gh repo create tarefas --public --source=. --push
```

### 3. O dia a dia com o remoto

```bash
git push            # envia seus commits
git pull            # baixa e junta os commits dos outros (fetch + merge)
git fetch           # só baixa, sem mexer nos seus arquivos
git remote -v       # pra onde aponta o origin
```

**Regra:** `git pull` antes de começar a trabalhar, pra não construir em cima de código velho.

### 4. O fluxo de Pull Request

```bash
git switch -c feat/listar-tarefas      # 1. branch nova a partir da main
# ... edita, commita ...
git push -u origin feat/listar-tarefas # 2. envia a branch
gh pr create --fill                    # 3. abre o PR (ou pelo botão no site)
```

4. Alguém revisa: comenta linhas, sugere mudanças, aprova ou pede ajustes.
5. Você ajusta **na mesma branch** (novos commits + `git push`): o PR atualiza sozinho.
6. Aprovado → **merge** na `main` → apaga a branch.

Mais sobre branches em [[Branches, Merge e Conflitos]].

### 5. Um PR bom

- **Pequeno:** até ~300 linhas mudadas. PR de 2.000 linhas não é revisado, é aprovado no desespero.
- **Um assunto só.** Correção de bug e refatoração em PRs separados.
- **Título claro:** `feat: adiciona filtro por prioridade` (padrão de [[Conventional Commits]]).
- **Descrição que responde:** o quê? por quê? como testar? tem print (se for tela)?

```markdown
## O que muda
Adiciona `--prioridade alta|média|baixa` ao comando `list`.

## Por quê
Com 30+ tarefas, ficou difícil achar as urgentes. Fecha #12.

## Como testar
1. `npm run dev -- add "Teste" --prioridade alta`
2. `npm run dev -- list --prioridade alta` → só a tarefa nova aparece
```

`Fecha #12` (ou `Closes #12`) fecha a issue 12 automaticamente no merge.

### 6. Revisando o PR de outra pessoa

- Comente sobre o **código**, não sobre a pessoa. Faça perguntas: "o que acontece se a lista vier vazia?"
- Separe o que **bloqueia** (bug, falha de segurança) do que é **sugestão** (`nit:` pra detalhe de gosto).
- Elogie o que ficou bom. Mais em [[Code Review]].

### 7. Fork: contribuir no que não é seu

```bash
gh repo fork dono/projeto --clone   # cópia na SUA conta + clone local
# branch → commits → push no seu fork → PR pro repositório original
```

### 8. Issues

Lista de tarefas/bugs do repositório. Antes de abrir um PR grande num projeto alheio, abra (ou comente) uma issue pra combinar a ideia.

### 9. README

A "capa" do repositório. Mínimo: o que é, como instalar, como usar, um print ou GIF. É o que recrutador vê primeiro ([[Portfólio e GitHub]]).

---

## 🛠️ Exemplo guiado

Simulando revisão sozinho (funciona igual com um colega):

```bash
git switch -c fix/titulo-vazio
# corrige o bug: adicionar tarefa com título vazio
git commit -am "fix: recusa tarefa com título vazio"
git push -u origin fix/titulo-vazio
gh pr create --title "fix: recusa tarefa com título vazio" --body "Antes, \`add \"\"\` criava uma tarefa sem nome."
```

No site: aba **Files changed** → clique numa linha → comente "e se o título for só espaços?" → corrija → `git commit -am "fix: considera título só com espaços como vazio"` → `git push` → o comentário vira **Outdated** → **Merge** → **Delete branch**.

```bash
git switch main && git pull     # traz o merge pra sua main local
git branch -d fix/titulo-vazio  # apaga a branch local
```

---

## 🔧 Pegadinhas

- **`rejected ... (fetch first)` no push.** O remoto tem commits que você não tem. `git pull` e depois `git push`.
- **Commitar direto na `main` em projeto de time.** Proteja a `main` (Settings → Branches → exigir PR).
- **Esquecer de atualizar a branch.** A `main` andou e seu PR ficou com conflito. Traga a `main` pra sua branch ([[Branches, Merge e Conflitos]]).
- **Subir segredo.** `.env` ou token no GitHub público é roubado em minutos por robôs. Se aconteceu: **revogue a chave**, apagar o commit não basta. Veja [[Gestão de Secrets]].
- **PR sem descrição.** O revisor precisa adivinhar o objetivo; a revisão fica rasa.

---

## 🔨 Desafio prático

**Objetivo:** o ciclo completo de PR, sozinho.

1. Publique um repositório seu no GitHub (pode ser o modelo de [[Configurando um Projeto TypeScript]]).
2. Escreva um README com o que é, como rodar e como usar.
3. Crie uma issue "Adicionar X", uma branch, faça 2 commits e abra um PR com `Fecha #1` na descrição.
4. Revise o próprio PR comentando uma linha, corrija com um novo commit e faça o merge.
5. Atualize a `main` local e apague a branch.

**Pronto quando:** a issue foi fechada sozinha pelo merge, o PR mostra a conversa e a `main` local está igual à remota (`git status` → "up to date").

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual a diferença entre `git fetch` e `git pull`?
> `fetch` só baixa os commits do remoto; `pull` baixa e já junta (merge) na sua branch atual.

> [!question]- O que é um Pull Request?
> Uma proposta de juntar uma branch em outra, com uma página pra ver o diff, discutir, revisar e aprovar antes do merge.

> [!question]- O que faz `git push -u origin minha-branch`?
> Envia a branch pro remoto e liga a branch local à remota, pra os próximos `push`/`pull` não precisarem dos nomes.

> [!question]- O que deve ter na descrição de um PR?
> O que muda, por que muda e como testar (e prints, se mudar a tela).

> [!question]- Qual a diferença entre fork e branch?
> Branch é uma linha de trabalho dentro do mesmo repositório; fork é uma cópia do repositório inteiro na sua conta, usada pra contribuir onde você não tem permissão.

> [!question]- Subiu um token pro GitHub sem querer. Apagar o commit resolve?
> Não. O token pode já ter sido copiado; é preciso revogá-lo e gerar outro.

---

## 📋 Cola rápida

| Comando | O que faz |
|---|---|
| `git remote add origin url` | liga ao GitHub |
| `git push -u origin main` | primeiro envio |
| `git push` / `git pull` | enviar / baixar e juntar |
| `git fetch` | só baixar |
| `gh repo create nome --source=. --push` | criar repo e enviar |
| `gh pr create --fill` | abrir PR |
| `gh pr checkout 12` | baixar o PR 12 pra testar |
| `gh repo fork dono/repo --clone` | fork + clone |

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

- [GitHub Docs · Sobre pull requests](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [GitHub CLI](https://cli.github.com/manual/)
- [First Contributions](https://github.com/firstcontributions/first-contributions): faça seu primeiro PR num projeto real, guiado

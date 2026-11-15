---
nivel: escrito
revisado:
---

# Git Flow

> *"O melhor fluxo de branches é o mais simples que o seu time consegue seguir."*

> [!tip] ⚡ Em 30 segundos
> Um **fluxo de branches** é o combinado do time sobre quais branches existem e como o código chega em produção. O **Git Flow** clássico tem `main` (produção), `develop` (integração) e branches de `feature/`, `release/` e `hotfix/`: organizado, mas pesado. Hoje a maioria dos times usa algo mais leve: o **GitHub Flow** (só `main` + branches curtas com PR) ou o **Trunk-Based** (commits pequenos e frequentes na `main`, com feature flags). Conheça o Git Flow porque ele aparece em entrevistas e em empresas grandes; use o GitHub Flow nos seus projetos.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Desenhar o Git Flow com suas 5 branches e explicar o papel de cada uma
- Comparar Git Flow, GitHub Flow e Trunk-Based e escolher um pra cada situação
- Proteger a `main` no GitHub pra garantir que tudo entre por PR

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Branches, Merge e Conflitos]] · [[GitHub e Pull Requests]] · [[Tags e Versionamento Semântico]]
- **Depois:** [[CI/CD]] · [[Deploy]] · [[Ambientes (dev, staging, prod)]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Git Flow clássico (Vincent Driessen, 2010)

```text
main      ●───────────────●──────────●─────────   (só versões lançadas, com tag)
           \             / \        /
hotfix/     \           /   ●──────●              (correção urgente da produção)
             \         /            \
release/      \   ●───●              \            (preparando a versão: só correções)
               \ /     \              \
develop    ●────●───●───●──────────────●───────   (integração do que vai pra próxima versão)
                 \     /
feature/          ●───●                           (uma funcionalidade)
```

| Branch | Sai de | Volta pra | Papel |
|---|---|---|---|
| `main` | – | – | o que está em produção; cada merge vira uma tag `vX.Y.Z` |
| `develop` | `main` | – | onde as features se juntam |
| `feature/*` | `develop` | `develop` | uma funcionalidade |
| `release/*` | `develop` | `main` **e** `develop` | congela a versão: só correções, ajustes de número |
| `hotfix/*` | `main` | `main` **e** `develop` | bug urgente em produção |

**Bom pra:** software com versões lançadas de tempos em tempos (app de celular, desktop, biblioteca com várias versões mantidas).
**Ruim pra:** sites e APIs com deploy várias vezes por dia: burocracia demais, branches longas, conflitos.

### 2. GitHub Flow (o padrão da maioria)

```text
main   ●────●────●────●────●   (sempre pronta pra deploy)
        \  /  \  /  \  /
         ●     ●     ●          (branches curtas: horas ou poucos dias, sempre com PR)
```

1. Crie uma branch a partir da `main` (`feat/filtro`).
2. Commits pequenos, push, abra o PR cedo.
3. Revisão + testes automáticos ([[GitHub Actions]]) passando.
4. Merge na `main` → deploy.

Uma regra: **a `main` sempre funciona.**

### 3. Trunk-Based Development

Todo mundo integra na `main` ("tronco") pelo menos uma vez por dia, com branches de horas (ou direto). Funcionalidade incompleta entra **desligada** por uma **feature flag**:

```ts
if (flags.novoFiltro) mostrarNovoFiltro();
```

Exige testes automáticos fortes e disciplina. É o que times de alto desempenho costumam usar.

### 4. Qual escolher

| Situação | Fluxo |
|---|---|
| Projeto pessoal / portfólio | GitHub Flow |
| Time pequeno com deploy contínuo | GitHub Flow |
| Time experiente, CI forte, muitos deploys por dia | Trunk-Based |
| Versões lançadas e mantidas em paralelo (v1, v2) | Git Flow |

### 5. Proteger a `main` (qualquer fluxo)

GitHub → Settings → Branches (ou **Rulesets**) → regra pra `main`:

- [x] Exigir pull request antes do merge (com 1+ aprovação, em times)
- [x] Exigir que os checks (testes, lint) passem
- [x] Bloquear push forçado e exclusão

### 6. Estratégia de merge do PR

O botão de merge no GitHub tem 3 opções. Combine com o time:

| Opção | Resultado na `main` |
|---|---|
| **Merge commit** | todos os commits da branch + um commit de merge |
| **Squash and merge** | a branch inteira vira **1 commit** (popular: histórico limpo, 1 PR = 1 commit) |
| **Rebase and merge** | os commits da branch em linha reta, sem commit de merge |

---

## 🛠️ Exemplo guiado

Um hotfix no Git Flow, na mão:

```bash
git switch main
git switch -c hotfix/1.2.1
# corrige o bug
git commit -am "fix: corrige crash ao abrir arquivo vazio"

git switch main
git merge --no-ff hotfix/1.2.1        # --no-ff: força o commit de merge pra registrar o hotfix
git tag -a v1.2.1 -m "Hotfix: arquivo vazio"

git switch develop
git merge --no-ff hotfix/1.2.1        # a correção não pode se perder na próxima versão
git branch -d hotfix/1.2.1
git push origin main develop --follow-tags
```

O mesmo no GitHub Flow: branch `fix/arquivo-vazio` → PR → merge na `main` → deploy. Uma etapa em vez de cinco.

---

## 🔧 Pegadinhas

- **Usar Git Flow "porque é o profissional".** Pra deploy contínuo ele atrasa tudo. Escolha pelo jeito que o software é entregue.
- **Hotfix que volta só pra `main`.** Na próxima release, o bug "ressuscita" vindo da `develop`.
- **Branch de feature de semanas.** Qualquer fluxo sofre. Divida em PRs menores, use feature flag.
- **`main` sem proteção.** Um `push --force` acidental apaga o trabalho do time.
- **Misturar estratégias de merge.** Metade squash, metade merge commit: o histórico vira bagunça. Configure no repositório qual é permitida.

---

## 🔨 Desafio prático

**Objetivo:** viver os dois fluxos.

1. Num repositório de teste, simule o Git Flow: crie `develop`, 2 `feature/*`, uma `release/1.0.0` (merge na `main` com tag `v1.0.0`) e um `hotfix/1.0.1`.
2. Veja o resultado em `git log --oneline --graph --all`.
3. Num repositório seu no GitHub, configure a proteção da `main` (exigir PR e bloquear force push) e tente dar `git push` direto na `main`.
4. Faça 2 PRs no GitHub Flow, um com **Squash and merge** e outro com **Merge commit**, e compare o histórico.

**Pronto quando:** o push direto na `main` é recusado e você consegue explicar a diferença entre os dois desenhos.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Quais são as branches do Git Flow?
> `main` (produção), `develop` (integração), `feature/*` (funcionalidades), `release/*` (preparação de versão) e `hotfix/*` (correções urgentes).

> [!question]- Por que um hotfix no Git Flow volta pra `main` e pra `develop`?
> Pra correção ir pra produção agora e não se perder: sem voltar pra develop, o bug reapareceria na próxima versão.

> [!question]- Como funciona o GitHub Flow?
> Só a `main` (sempre pronta pra deploy) e branches curtas; tudo entra por Pull Request revisado e testado.

> [!question]- Quando o Git Flow faz sentido?
> Quando o software tem versões lançadas de tempos em tempos e várias versões mantidas em paralelo (apps, bibliotecas).

> [!question]- O que é Trunk-Based Development?
> Integrar na branch principal com muita frequência (diariamente ou mais), com branches curtíssimas e feature flags pra esconder o que está incompleto.

> [!question]- O que faz "Squash and merge"?
> Junta todos os commits da branch do PR em um único commit na `main`.

---

## 📋 Cola rápida

| Fluxo | Branches | Ideal pra |
|---|---|---|
| Git Flow | main, develop, feature, release, hotfix | versões lançadas |
| GitHub Flow | main + branches curtas com PR | web, deploy contínuo |
| Trunk-Based | main + flags | times com CI forte |
| Proteção da main | exigir PR, checks, bloquear force push | todos |

---

## 🛠️ Exemplo meu

```text

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

- [A successful Git branching model (Vincent Driessen)](https://nvie.com/posts/a-successful-git-branching-model/): o artigo original, com a nota do autor recomendando fluxos mais simples pra web
- [GitHub Docs · GitHub flow](https://docs.github.com/pt/get-started/using-github/github-flow)
- [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)

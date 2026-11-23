---
nivel: escrito
foco: bom saber
revisado:
---

# Git Flow

**Quanto focar: 💤 bom saber.** Muitos times usam fluxos mais simples hoje. Conheça a ideia pra reconhecer se a empresa usar; não precisa decorar.

Imagine um time de cinco pessoas trabalhando no mesmo projeto, sem ter combinado nada. Uma faz commit direto na `main`. Outra trabalha três semanas numa branch e tenta juntar tudo de uma vez. Uma terceira cria uma branch chamada `teste2-final`. Alguém sobe uma correção urgente que ninguém revisou, e ela quebra outra coisa. Não é que alguém esteja fazendo errado: é que cada um está fazendo de um jeito.

Um **fluxo de branches** é o combinado do time sobre isso: quais branches existem, pra que serve cada uma, e qual o caminho que o código percorre até chegar em produção. O mais famoso é o **Git Flow** clássico, com várias branches fixas (`main`, `develop`, `feature/`, `release/`, `hotfix/`): muito organizado, mas pesado. Hoje, a maioria dos times usa algo mais leve: o **GitHub Flow**, só com a `main` e branches curtas com pull request, ou o **Trunk-Based**, com commits pequenos e frequentes direto na `main`.

A recomendação desta nota, pra você não ficar em dúvida: **conheça o Git Flow**, porque ele aparece em entrevistas e em empresas grandes, **mas use o GitHub Flow nos seus projetos**. E o motivo vai ficar claro quando você vir os dois lado a lado. Ajuda ter passado por [[Branches, Merge e Conflitos]] e [[GitHub e Pull Requests]].

## GitHub Flow: o caminho mais simples que funciona

É o fluxo que você vai usar nos seus projetos, e ele cabe num desenho:

```text
main   ●────●────●────●────●   (sempre pronta pra ir pro ar)
        \  /  \  /  \  /
         ●     ●     ●          (branches curtas: horas ou poucos dias, sempre com PR)
```

O caminho tem quatro passos. Você cria uma branch a partir da `main`, como `feat/filtro`. Faz commits pequenos, envia, e abre o pull request cedo, mesmo antes de terminar. Espera a revisão e os testes automáticos ([[GitHub Actions]]) passarem. E faz o merge na `main`, que vai pro ar.

Tudo isso gira em torno de **uma regra só**: **a `main` sempre funciona.** Qualquer coisa que entra nela passou por revisão e por testes, então, a qualquer momento, ela pode ir pra produção.

E uma correção urgente? Segue exatamente o mesmo caminho: uma branch `fix/arquivo-vazio`, um PR, o merge, o deploy. Não tem caminho especial, e essa é justamente a graça.

O inimigo de qualquer fluxo, esse incluído, é a **branch de semanas**. Ela acumula conflito, vira um PR gigante, e ninguém consegue revisar de verdade um PR com duas mil linhas. A saída é dividir a funcionalidade em PRs menores, que entram um de cada vez.

## Proteja a main

Seja qual for o fluxo que o seu time escolher, existe uma configuração que vale fazer sempre. No GitHub, em Settings → Branches (ou nos **Rulesets**), crie uma regra pra `main` com três coisas ligadas:

- [x] Exigir pull request antes do merge (com 1+ aprovação, em times)
- [x] Exigir que os checks (testes, lint) passem
- [x] Bloquear push forçado e exclusão

Por que isso importa? Sem essa regra, um `git push --force` acidental de qualquer pessoa, numa sexta à noite, pode apagar o trabalho do time inteiro. Com ela, a regra "a `main` sempre funciona" deixa de depender da boa vontade e da atenção de cada um, e passa a ser garantida pela ferramenta.

Outra coisa pra combinar com o time: o botão de merge do pull request tem três opções, e cada uma deixa o histórico de um jeito.

| Opção | Resultado na `main` |
|---|---|
| **Merge commit** | todos os commits da branch, mais um commit de merge |
| **Squash and merge** | a branch inteira vira **um commit só** (popular: 1 PR = 1 commit, histórico limpo) |
| **Rebase and merge** | os commits da branch em linha reta, sem commit de merge |

Escolham uma, e configurem o repositório pra só ela ficar disponível. Um histórico com metade dos PRs em squash e metade em merge commit vira bagunça.

## O Git Flow clássico

Agora o famoso. Criado por Vincent Driessen em 2010, ele tem cinco tipos de branch, cada uma com um papel:

```text
main      ●───────────────●──────────●─────────   (só versões lançadas, com tag)
           \             / \        /
hotfix/     \           /   ●──────●              (correção urgente da produção)
             \         /            \
release/      \   ●───●              \            (preparando a versão: só correções)
               \ /     \              \
develop    ●────●───●───●──────────────●───────   (onde as features se juntam)
                 \     /
feature/          ●───●                           (uma funcionalidade)
```

| Branch | Sai de | Volta pra | Papel |
|---|---|---|---|
| `main` | – | – | o que está em produção; cada merge vira uma tag `vX.Y.Z` |
| `develop` | `main` | – | onde as funcionalidades se juntam |
| `feature/*` | `develop` | `develop` | uma funcionalidade |
| `release/*` | `develop` | `main` **e** `develop` | congela a versão: só correções e ajustes finais |
| `hotfix/*` | `main` | `main` **e** `develop` | bug urgente em produção |

A ideia é que a `main` só recebe versões prontas, a `develop` é onde o trabalho do dia a dia se junta, e as outras são temporárias, cada uma com uma missão.

O detalhe que mais cai em entrevista: **o hotfix volta pra duas branches.** Pense no porquê. O bug está em produção, então a correção sai da `main`. Ela precisa voltar pra `main`, claro, pra consertar a produção. Mas também precisa voltar pra `develop`. Se não voltasse, a próxima versão, que vai sair da `develop`, traria o bug de volta, como se ninguém tivesse corrigido nada.

```bash
git switch main
git switch -c hotfix/1.2.1
# corrige o bug
git commit -am "fix: corrige crash ao abrir arquivo vazio"

git switch main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix: arquivo vazio"

git switch develop
git merge --no-ff hotfix/1.2.1        # a correção não pode se perder
git branch -d hotfix/1.2.1
git push origin main develop --follow-tags
```

Agora compare com o GitHub Flow, onde uma correção urgente é uma branch, um PR e um merge. Uma etapa contra cinco.

Isso não quer dizer que o Git Flow seja ruim. Ele **é bom** pra software com versões lançadas de tempos em tempos, e às vezes mantidas em paralelo: um app de celular, um programa de desktop, uma biblioteca que tem a v1 e a v2 ao mesmo tempo. E **é ruim** pra sites e APIs que fazem deploy várias vezes por dia: burocracia demais, branches longas, conflitos. Usar o Git Flow "porque é o jeito profissional" num projeto com deploy contínuo só atrasa tudo. O fluxo certo é o que combina com o jeito que o software é entregue.

## Trunk-Based, e como escolher

Existe ainda um terceiro estilo, o mais radical. No **Trunk-Based Development**, todo mundo junta o código na `main` (o "tronco") pelo menos uma vez por dia, com branches que duram horas, ou até sem branch nenhuma.

E uma funcionalidade que ainda não está pronta? Ela entra na `main` **desligada**, por uma **feature flag**:

```ts
if (flags.novoFiltro) mostrarNovoFiltro();
```

O código já está lá, em produção, mas ninguém vê nada até alguém ligar a flag. Isso exige testes automáticos fortes e muita disciplina, e é o estilo que os times de alto desempenho costumam usar.

Pra escolher, esta tabela resolve quase todo caso:

| Situação | Fluxo |
|---|---|
| Projeto pessoal ou portfólio | GitHub Flow |
| Time pequeno, deploy contínuo | GitHub Flow |
| Time experiente, CI forte, muitos deploys por dia | Trunk-Based |
| Versões lançadas e mantidas em paralelo (v1, v2) | Git Flow |

## O essencial

1. Um fluxo de branches é o combinado do time sobre o caminho do código até produção.
2. GitHub Flow: só a `main` e branches curtas com PR. A regra é: a `main` sempre funciona.
3. Proteja a `main`: exigir PR, exigir os checks, bloquear force push.
4. Git Flow: `main`, `develop`, `feature`, `release`, `hotfix`. O hotfix volta pra `main` e pra `develop`.
5. Git Flow pra versões lançadas; GitHub Flow pra deploy contínuo; Trunk-Based pra times com CI forte.

## Agora é com você

Viva os dois fluxos. Num repositório de teste, simule o Git Flow inteiro: crie a `develop`, duas `feature/*`, uma `release/1.0.0` (com merge na `main` e a tag `v1.0.0`), e um `hotfix/1.0.1`. Veja o desenho resultante com `git log --oneline --graph --all`. Depois, num repositório seu no GitHub, configure a proteção da `main` (exigir PR e bloquear force push) e tente dar um `git push` direto nela. Por fim, faça dois PRs no GitHub Flow, um com **Squash and merge** e outro com **Merge commit**, e compare como o histórico ficou. Você terminou quando o push direto na `main` for recusado e você conseguir explicar a diferença entre os dois desenhos.

Daqui, siga pra [[CI/CD]], [[Deploy]] e [[Ambientes (dev, staging, prod)]].

---

## 🧠 Me teste

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

> [!question]- Por que proteger a `main` com regras no GitHub?
> Pra a regra "a main sempre funciona" não depender da atenção de cada um: sem PR aprovado e checks passando, nada entra, e ninguém apaga o trabalho com force push.

> [!question]+ No Git Flow, de onde sai e pra onde volta um **hotfix**?
> - a) Sai da `develop` e volta só pra `develop`
> - b) Sai da `main` e volta pra `main` **e** `develop`
> - c) Sai de uma `feature` e volta pra `main`
> - d) Sai da `main` e volta só pra `main`
>
> > [!check]- Resposta
> > **b)** O bug está em produção, então sai da `main`. Volta pras duas pra correção não sumir na próxima release que sair da `develop`.

---

## Pra consultar depois

| Fluxo | Branches | Ideal pra |
|---|---|---|
| Git Flow | main, develop, feature, release, hotfix | Versões lançadas |
| GitHub Flow | main + branches curtas com PR | Web, deploy contínuo |
| Trunk-Based | main + feature flags | Times com CI forte |
| Proteção da main | Exigir PR, checks, bloquear force push | Todos |

**Pra ler:** o artigo original do Git Flow, [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/), vale pela história e por um detalhe: o próprio autor acrescentou, anos depois, uma nota recomendando fluxos mais simples pra software web. A página do [GitHub Flow na documentação do GitHub](https://docs.github.com/pt/get-started/using-github/github-flow) está em português e é curta. E o site [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/) explica o Trunk-Based com diagramas.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

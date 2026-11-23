---
nivel: escrito
foco: essencial
revisado:
---

# GitHub e Pull Requests

**Quanto focar: 🔥 essencial.** É como o time trabalha e onde o recrutador olha o seu código. Domine o fluxo de PR.

Até aqui, o seu repositório Git morava num lugar só: o seu computador. Se o disco morrer amanhã, o histórico inteiro vai junto. Se você quiser mostrar o projeto pra alguém, não tem como. E se outra pessoa quiser ajudar, ela não tem onde pegar o código.

O **GitHub** resolve as três coisas de uma vez. Ele guarda repositórios Git na internet, e por isso serve de backup, de portfólio, e de lugar onde times colaboram. Você liga o repositório do seu computador ao do GitHub, envia os seus commits com `git push`, e baixa os dos outros com `git pull`.

E quando você trabalha num projeto de time, aparece a peça mais importante desta nota: o **Pull Request**, ou PR. Pra propor uma mudança, você não mexe direto na `main`. Cria uma branch, envia, e abre um PR: uma página onde outras pessoas veem exatamente o que mudou, comentam, pedem ajustes e aprovam, antes de tudo ser juntado. É o jeito como quase todo software profissional é construído hoje. Ajuda ter passado pelo [[Git Básico]] e pelo [[SSH]].

## Dois lugares, sincronizados à mão

Depois de ligar ao GitHub, o seu repositório passa a existir em dois lugares: o **local**, no seu computador, e o **remoto**, no GitHub, que por convenção se chama `origin`. E um detalhe que confunde no começo: eles **não se sincronizam sozinhos**. Você manda e busca as mudanças com comandos.

Pra ligar um projeto local a um repositório novo no GitHub:

```bash
# crie um repositório VAZIO no site (sem README) e então:
git remote add origin git@github.com:usuario/tarefas.git
git push -u origin main   # -u liga a branch local à remota (só na primeira vez)

# ou, com o GitHub CLI, tudo de uma vez:
gh repo create tarefas --public --source=. --push
```

E no dia a dia, quatro comandos:

```bash
git push        # envia seus commits pro GitHub
git pull        # baixa os commits dos outros E junta com os seus
git fetch       # só baixa, sem mexer nos seus arquivos
git remote -v   # mostra pra onde o origin aponta
```

A diferença entre `pull` e `fetch` vale entender. O `pull` é, na verdade, um `fetch` seguido de um merge: ele baixa e já junta com o seu trabalho. O `fetch` só traz as novidades, pra você olhar antes de decidir juntar.

Uma regra de ouro: **rode `git pull` antes de começar a trabalhar.** Assim você não passa uma tarde construindo em cima de código velho. E se um dia o `push` for recusado com uma mensagem dizendo `fetch first`, é exatamente isso que aconteceu: o GitHub tem commits que você não tem. Rode `git pull`, resolva os conflitos se houver, e depois tente o `push` de novo.

Sobre o login: o GitHub não aceita mais senha no terminal. Você usa **SSH** (uma chave no seu computador, cadastrada no GitHub, com o passo a passo em [[SSH]]) ou o **GitHub CLI** (`gh auth login`, que guarda um token pra você).

## O caminho de um Pull Request

Em projeto de time, ninguém commita direto na `main`. O caminho é este:

```bash
git switch -c feat/listar-tarefas       # 1. branch nova, a partir da main
# ... edita e commita ...
git push -u origin feat/listar-tarefas  # 2. envia a branch
gh pr create --fill                     # 3. abre o PR (ou pelo botão no site)
```

Depois de aberto, o PR ganha vida própria. Alguém revisa: comenta linhas específicas, sugere mudanças, aprova ou pede ajustes. Você faz os ajustes **na mesma branch**, com novos commits e `git push`, e o PR se atualiza sozinho, sem precisar abrir outro. Quando estiver aprovado, você faz o merge na `main` e apaga a branch.

E depois do merge, atualize o seu computador:

```bash
git switch main && git pull           # traz o merge pra sua main local
git branch -d feat/listar-tarefas     # apaga a branch local
```

Por que todo esse processo, em vez de commitar direto? Porque **um segundo par de olhos pega bugs que você não viu**. E porque a `main` fica sempre funcionando: nada entra nela sem ser revisado. Pra ninguém pular essa etapa sem querer, proteja a `main` no GitHub (Settings → Branches → exigir PR), como a nota [[Git Flow]] mostra.

Um problema comum: se a `main` andou enquanto você trabalhava na sua branch, o PR fica com conflito. A solução é trazer a `main` pra sua branch e resolver lá, como em [[Branches, Merge e Conflitos]].

## Um PR que dá vontade de revisar

Abrir um PR é fácil. Abrir um PR que alguém consegue revisar de verdade é outra coisa. Algumas regras fazem toda a diferença.

Seja **pequeno**: até umas 300 linhas mudadas. Um PR de 2.000 linhas não é revisado, é aprovado no desespero, porque ninguém tem energia pra ler tudo aquilo com atenção. Tenha **um assunto só**: uma correção de bug e uma refatoração vão em PRs separados. Dê um **título claro**, como `feat: adiciona filtro por prioridade`, no padrão dos [[Conventional Commits]]. E escreva uma **descrição que responda três perguntas**: o que muda, por que muda, e como testar (com um print, se mudar alguma tela).

```markdown
## O que muda
Adiciona `--prioridade alta|média|baixa` ao comando `list`.

## Por quê
Com 30+ tarefas, ficou difícil achar as urgentes. Fecha #12.

## Como testar
1. `npm run dev -- add "Teste" --prioridade alta`
2. `npm run dev -- list --prioridade alta` → só a tarefa nova aparece
```

O `Fecha #12` (ou `Closes #12`) no meio da descrição faz uma coisa útil: fecha a issue número 12 automaticamente quando o PR for juntado. Um PR sem descrição nenhuma obriga o revisor a adivinhar o objetivo, e a revisão fica rasa.

E quando for a sua vez de revisar o PR de outra pessoa, três atitudes ajudam muito. Comente sobre o **código**, nunca sobre a pessoa, e prefira perguntas: "o que acontece se a lista vier vazia?" funciona melhor que "isso está errado". Separe o que **bloqueia** (um bug, uma falha de segurança) do que é só **sugestão**; um `nit:` no começo do comentário avisa que é detalhe de gosto. E elogie o que ficou bom. A nota [[Code Review]] aprofunda.

## Nunca suba segredos

Isto merece uma seção só pra ele. Um arquivo `.env` ou um token num repositório público é encontrado por robôs em **minutos**. Existem programas varrendo o GitHub o tempo todo, procurando chaves e senhas expostas, pra usar antes que o dono perceba.

Se aconteceu com você, o primeiro passo é **revogar a chave**: gerar uma nova e invalidar a antiga, no serviço de onde ela veio. Apagar o commit **não resolve**. O segredo continua no histórico, e alguém pode muito bem já ter copiado. A nota [[Gestão de Secrets]] fala disso com mais calma.

## Contribuindo no que não é seu

Num projeto de outra pessoa, você não tem permissão pra criar branches no repositório dela. A solução é o **fork**: uma cópia do repositório inteiro, só que na **sua** conta.

```bash
gh repo fork dono/projeto --clone   # cópia na sua conta + clone local
# branch → commits → push no seu fork → PR pro repositório original
```

Você trabalha no seu fork, e abre o PR de lá pro repositório original. E uma boa educação de código aberto: antes de mandar um PR grande num projeto alheio, abra (ou comente) uma **issue**, que é a lista de tarefas e bugs do repositório, pra combinar a ideia com quem cuida do projeto. Ninguém gosta de receber um PR enorme sobre algo que não estava nos planos.

E não esqueça do README, a "capa" do repositório. É a primeira coisa que qualquer pessoa vê, inclusive recrutadores. O mínimo: o que é, como instalar, como usar, e um print ou um GIF. A nota [[Portfólio e GitHub]] fala disso.

## O essencial

1. Local e remoto (`origin`) não se sincronizam sozinhos: `push` envia, `pull` baixa e junta, `fetch` só baixa.
2. `git pull` antes de começar. Push recusado com `fetch first`: faça pull primeiro.
3. PR: branch, push, abrir o PR, revisão, ajustes na mesma branch, merge.
4. PR bom: pequeno, um assunto, título claro, descrição com o quê, por quê e como testar.
5. Segredo vazado: revogue primeiro. Apagar o commit não basta.

## Agora é com você

Faça o ciclo completo de um PR, sozinho. Publique um repositório seu no GitHub (pode ser o modelo de [[Configurando um Projeto TypeScript]]) e escreva um README com o que é, como rodar e como usar. Crie uma issue "Adicionar X", uma branch, faça dois commits, e abra um PR com `Fecha #1` na descrição. Depois revise o seu próprio PR, comentando uma linha, corrija com um novo commit, e faça o merge. Por fim, atualize a `main` local e apague a branch. Você terminou quando a issue tiver sido fechada sozinha pelo merge, o PR mostrar a conversa, e a `main` local estar igual à remota (`git status` dizendo "up to date").

E se quiser fazer o seu primeiro PR num projeto **real**, de outra pessoa, o [First Contributions](https://github.com/firstcontributions/first-contributions) existe exatamente pra isso, e te guia passo a passo.

Daqui, siga pras [[Branches, Merge e Conflitos]], pro [[Code Review]], pro [[GitHub Actions]] e pro [[Portfólio e GitHub]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `git fetch` e `git pull`?
> `fetch` só baixa os commits do remoto; `pull` baixa e já junta (merge) na sua branch atual.

> [!question]- O que é um Pull Request?
> Uma proposta de juntar uma branch em outra, com uma página pra ver o diff, discutir, revisar e aprovar antes do merge.

> [!question]- O que faz `git push -u origin minha-branch`?
> Envia a branch pro remoto e liga a branch local à remota, pra os próximos `push`/`pull` não precisarem dos nomes.

> [!question]- O que deve ter na descrição de um PR?
> O que muda, por que muda e como testar (e prints, se mudar a tela).

> [!question]- Por que um PR de 2.000 linhas é um problema?
> Porque ninguém consegue revisar com atenção: acaba aprovado sem ser lido de verdade.

> [!question]- Qual a diferença entre fork e branch?
> Branch é uma linha de trabalho dentro do mesmo repositório; fork é uma cópia do repositório inteiro na sua conta, usada pra contribuir onde você não tem permissão.

> [!question]- Subiu um token pro GitHub sem querer. Apagar o commit resolve?
> Não. O token pode já ter sido copiado; é preciso revogá-lo e gerar outro.

> [!question]+ Qual a diferença entre `git fetch` e `git pull`?
> - a) Nenhuma
> - b) `fetch` baixa as novidades sem mexer nos seus arquivos; `pull` baixa e já faz merge
> - c) `fetch` envia, `pull` recebe
> - d) `pull` só baixa branches novas
>
> > [!check]- Resposta
> > **b)** `pull` = `fetch` + `merge` (ou rebase). Com `fetch` você vê o que mudou antes de juntar.

> [!question]+ Você subiu um token pro GitHub sem querer. Qual o primeiro passo?
> - a) Apagar o commit com `reset` e force push
> - b) Revogar o token e gerar outro
> - c) Deixar o repositório privado
> - d) Adicionar o arquivo no `.gitignore`
>
> > [!check]- Resposta
> > **b)** O token pode já ter sido copiado (robôs varrem o GitHub em minutos). Reescrever o histórico vem depois. O que protege é **revogar**.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git remote add origin url` | Liga ao GitHub |
| `git push -u origin main` | Primeiro envio |
| `git push` / `git pull` | Enviar / baixar e juntar |
| `git fetch` | Só baixar |
| `gh repo create nome --source=. --push` | Criar o repo e enviar |
| `gh pr create --fill` | Abrir um PR |
| `gh pr checkout 12` | Baixar o PR 12 pra testar |
| `gh repo fork dono/repo --clone` | Fork + clone |

**Pra ler:** a página [Sobre pull requests](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests), da documentação do GitHub, está em português e cobre o processo inteiro. O [manual do GitHub CLI](https://cli.github.com/manual/) vale pra quem prefere fazer tudo pelo terminal. E o [First Contributions](https://github.com/firstcontributions/first-contributions) guia o seu primeiro PR num projeto real.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

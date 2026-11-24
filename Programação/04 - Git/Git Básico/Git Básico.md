---
nivel: escrito
foco: essencial
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Git Básico

**Quanto focar: 🔥 essencial.** Todo time usa Git, sem exceção. Pratique o ciclo `add`/`commit`/`push` até ser automático.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3 · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Todo mundo já passou por isso, mesmo antes de programar. Você está fazendo um trabalho, e a pasta vai se enchendo: `trabalho.docx`, `trabalho_final.docx`, `trabalho_final_revisado.docx`, `trabalho_final_AGORA_VAI.docx`. Você não sabe direito o que mudou entre um e outro. E se apagou um parágrafo importante lá na versão 3, boa sorte descobrindo em qual delas ele ainda estava.

Com código, isso é muito pior, porque um programa tem dezenas de arquivos que mudam juntos. O **Git** resolve isso guardando o **histórico** do seu projeto. Cada **commit** é uma foto de todos os arquivos num momento, com uma mensagem dizendo o que mudou. Com essas fotos, você volta no tempo quando algo quebra, vê quem mudou o quê e por quê, e experimenta sem medo nenhum.

O ciclo do dia a dia tem três passos: **editar**, `git add` (escolher o que entra na foto) e `git commit` (tirar a foto). Esse passo do meio, o `add`, é o que mais confunde no começo, e entender ele é o centro desta nota. O Git é uma das ferramentas mais usadas por qualquer dev, em qualquer linguagem, então vale a pena aprender bem. Ajuda já conhecer o [[Terminal]] e o [[VS Code]].

## Fotos numa linha do tempo

Com o Git, em vez de vinte cópias do projeto com nomes cada vez mais desesperados, você tem uma pasta só, e uma linha do tempo de fotos dela. Isso te dá poderes que parecem pequenos e mudam tudo. Você pode **voltar no tempo**: "funcionava ontem, o que eu mudei?". Pode **ler a história**: quem mudou esta linha, quando, e por quê. Pode **experimentar sem medo**: se der errado, volta pra última foto boa. E pode **trabalhar em equipe**: várias pessoas mexendo no mesmo projeto, sem uma sobrescrever o trabalho da outra.

Um pouco de história: o Git foi criado em 2005 por Linus Torvalds, o criador do Linux, pra versionar o próprio Linux. E ele tem uma característica importante: é **distribuído**. Cada cópia do repositório tem o histórico inteiro, então você trabalha offline, e o servidor é só mais uma cópia entre várias.

E uma confusão que vale desfazer logo: **Git não é GitHub.** O Git é o programa que roda no seu computador. O GitHub é um site que guarda cópias de repositórios Git na internet ([[GitHub e Pull Requests]]). Dá pra usar o Git a vida inteira sem nunca abrir o GitHub.

## As três áreas

Agora o conceito que mais confunde, e o mais importante. Uma mudança passa por três lugares antes de virar história:

```text
 pasta de trabalho  ──git add──►  staging (índice)  ──git commit──►  repositório (.git)
 (o que você edita)              (o que vai na foto)                (o histórico)
```

Pense numa sessão de fotos. A **pasta de trabalho** é o estúdio, onde você mexe em tudo, arruma, bagunça. O **staging** é o palco: você escolhe quem sobe pra sair na próxima foto. E o **commit** é o clique da câmera, que registra exatamente quem estava no palco naquele momento.

Por que existe esse passo do meio? Por que o Git não fotografa tudo de uma vez? Pra você **escolher**. Imagine que você mexeu em cinco arquivos: dois são de uma correção de bug, três são de uma funcionalidade nova. Com o palco, você sobe os dois primeiros, tira a foto ("Corrige validação de título"), e depois sobe os outros três e tira outra ("Adiciona comando de listar"). Dois commits, cada um contando uma história só. Daqui a três meses, se a funcionalidade nova tiver um problema, dá pra desfazer só ela, sem perder a correção.

O `git status` mostra em que área cada arquivo está, e usa três palavras. **Untracked** é um arquivo novo, que o Git ainda não conhece. **Modified** é um arquivo que mudou desde o último commit, mas ainda não subiu pro palco. E **staged** é um arquivo que está no palco, e vai entrar na próxima foto.

## O ciclo do dia a dia

```bash
git status                  # o que mudou? (use toda hora)
git add src/main.ts         # coloca um arquivo no palco
git add .                   # coloca tudo da pasta atual pra baixo
git commit -m "Adiciona comando de listar tarefas"
```

E pra enxergar o que mudou:

```bash
git diff                    # mudanças que ainda não estão no palco
git diff --staged           # o que vai entrar no próximo commit
git log --oneline           # histórico resumido
git log --oneline --graph --all   # com as branches desenhadas
git show a1b2c3d            # o que um commit específico mudou
```

Cada commit ganha um **hash**, como `a1b2c3d...`: o identificador único dele, como o número de série de uma foto. Os primeiros sete caracteres já bastam pra se referir a ele.

Um exemplo do começo ao fim, que vale você digitar agora:

```bash
mkdir tarefas && cd tarefas
git init                       # transforma a pasta num repositório
echo "node_modules/" > .gitignore
echo "# Tarefas" > README.md
git status                     # 2 arquivos untracked
git add .
git commit -m "Cria projeto com README e gitignore"

git log --oneline
# 9a8f7d3 Cria projeto com README e gitignore
```

E o que faz um **commit bom**? Três coisas. Ele é **pequeno e de um assunto só**: "Adiciona validação de título" vale muito mais que "várias coisas". Tem uma **mensagem no imperativo**, dizendo o que ele faz: "Corrige cálculo de XP", e não "corrigi" ou "mudanças" (o padrão completo está em [[Conventional Commits]]). E deixa o projeto **funcionando**: se cada commit roda, fica fácil descobrir em qual deles algo quebrou.

Duas armadilhas andam junto com esse ciclo. A primeira é o `git add .` sem olhar. Ele coloca no palco **tudo** o que estiver na pasta: as senhas do `.env`, arquivos gigantes, lixo temporário. Rode um `git status` antes, sempre. A segunda é o **commit gigante no fim do dia**: cinco assuntos misturados numa foto só, com a mensagem "ajustes". Daqui a três meses, ninguém sabe o que aquilo é, e não dá pra desfazer só uma das mudanças.

## O que fica fora do Git

Algumas coisas **nunca** devem entrar no histórico. O arquivo `.gitignore`, na raiz do projeto, lista o que o Git deve fingir que não existe:

```gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

O `node_modules/` e o `dist/` são gerados por comandos e podem ser recriados a qualquer momento. E o `.env` guarda senhas e chaves, e **nunca** pode ir pra um repositório.

Crie o `.gitignore` **antes do primeiro commit**, por causa de um detalhe que pega todo mundo: ele só vale pra arquivos que o Git **ainda não rastreia**. Se o `.env` já foi commitado, adicionar ele no `.gitignore` depois não adianta nada: o Git continua rastreando, e o arquivo continua no histórico. Pra parar de rastrear, é preciso um `git rm --cached .env` (o arquivo continua no seu disco, só sai do Git). E se tinha uma senha dentro, **troque a senha**: ela continua guardada no histórico, pra quem quiser olhar.

## Configurando, uma vez por computador

Antes do primeiro commit numa máquina nova, o Git precisa saber quem você é:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # VS Code pra editar mensagens
```

O nome e o e-mail aparecem em cada commit seu. E o editor é o programa que abre quando o Git precisa de um texto maior.

Essa última linha te salva de uma cena clássica. Se você rodar `git commit` sem o `-m` e não tiver configurado o editor, abre o **vim**, um editor de terminal que muita gente não sabe como fechar. Se acontecer: aperte `Esc`, digite `:wq` e dê Enter. Melhor ainda: configure o VS Code como editor, e isso nunca mais acontece.

## Desfazendo o básico

Pros erros mais comuns do dia a dia:

```bash
git restore arquivo.ts           # descarta as mudanças que não estão no palco
git restore --staged arquivo.ts  # tira do palco (a mudança continua no arquivo)
git commit --amend -m "Nova msg" # corrige o último commit
```

Cuidado com o primeiro: o `git restore` descarta **de verdade**. Uma mudança que nunca foi commitada e foi descartada assim não volta. E o `--amend` só pode ser usado enquanto o commit ainda não foi enviado pro GitHub. O resto da história de desfazer está em [[Desfazendo Mudanças (Reset e Revert)]].

E se você preferir botões: no [[VS Code]], a aba **Source Control** (`Ctrl + Shift + G`) faz tudo isso com cliques, e mostra as diferenças lado a lado. A sugestão é aprender pelo terminal primeiro, pra entender o que cada botão faz, e depois usar o que você preferir.

## O essencial

1. Cada commit é uma foto do projeto inteiro, com uma mensagem.
2. Três áreas: pasta de trabalho → `git add` → staging → `git commit` → histórico. O palco serve pra escolher.
3. `git status` toda hora. Nada de `git add .` sem olhar.
4. Commit bom: pequeno, um assunto, funcionando, mensagem no imperativo.
5. `.gitignore` antes do primeiro commit. Ele não vale pra arquivo que já foi rastreado.

## Agora é com você

Domine o ciclo e o palco. Crie um repositório com um `.gitignore` e um `README.md`, e faça o primeiro commit. Depois edite três arquivos diferentes e faça **dois commits separados**: um com dois deles, outro com o terceiro. Antes de cada commit, olhe o `git diff` e o `git diff --staged`. Faça um commit com a mensagem errada de propósito, e corrija com `--amend`. E mostre o histórico com `git log --oneline --graph`. Você terminou quando o log mostrar três ou mais commits com mensagens claras, e você souber explicar em que área cada mudança estava em cada momento.

Depois, leve isso pra um **projeto seu de verdade**: os scripts dos desafios do Estágio 1, ou o próprio [[Gerenciador de Tarefas no Terminal]] desde o primeiro arquivo. Crie o repositório antes de escrever qualquer código, com o `.gitignore` certo desde o início, e vá fazendo commits pequenos, um por assunto, sem nenhuma mensagem do tipo "ajustes", "wip" ou "update". Você terminou quando alguém conseguir entender a história do projeto lendo só o `git log --oneline`. Pra ir além, experimente o `git add -p`, que deixa você commitar só **parte** das mudanças de um arquivo, e crie um atalho: `git config --global alias.lg "log --oneline --graph --all"`.

Daqui, siga pro [[GitHub e Pull Requests]], pras [[Branches, Merge e Conflitos]] e pros [[Conventional Commits]].

---

## 🧠 Me teste

> [!question]- Quais são as três áreas do Git?
> Pasta de trabalho (onde você edita), staging/índice (o que vai no próximo commit) e repositório (o histórico de commits).

> [!question]- Pra que serve o staging, em vez de commitar tudo direto?
> Pra escolher o que entra em cada commit: dá pra separar mudanças de assuntos diferentes em commits diferentes.

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

> [!question]+ Você adicionou `.env` no `.gitignore`, mas ele continua aparecendo nas mudanças. Por quê?
> - a) O `.gitignore` está com a sintaxe errada
> - b) O `.env` já tinha sido commitado: o Git continua rastreando
> - c) Precisa reiniciar o terminal
> - d) O `.gitignore` só vale depois do push
>
> > [!check]- Resposta
> > **b)** `.gitignore` só ignora arquivos **ainda não rastreados**. Rode `git rm --cached .env`, commite e, se tinha segredo, troque o segredo.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git init` / `git clone url` | Criar / baixar um repositório |
| `git status` | O que mudou |
| `git add arquivo` / `git add .` | Colocar no staging |
| `git commit -m "msg"` | Tirar a foto |
| `git diff` / `git diff --staged` | Ver as mudanças |
| `git log --oneline --graph` | Histórico |
| `git show hash` | Detalhes de um commit |
| `git restore arquivo` | Descartar uma mudança |
| `git restore --staged arquivo` | Tirar do staging |
| `git commit --amend` | Corrigir o último commit |

**Pra ler e treinar:** o [Pro Git](https://git-scm.com/book/pt-br/v2) é o livro oficial, gratuito e em português; os capítulos 1 e 2 cobrem esta nota inteira, com desenhos das três áreas. O [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR) é um jogo visual que mostra o histórico se desenhando enquanto você digita. E o [Oh Shit, Git!?!](https://ohshitgit.com/pt_BR) ensina a sair das enrascadas mais comuns, com humor.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: importante
revisado:
---

# Desfazendo Mudanças (Reset e Revert)

**Quanto focar: 📌 importante.** Um dia você vai precisar desfazer algo, e fazer errado apaga trabalho. Entenda bem a diferença entre os dois.

**⏱️ Quanto tempo: cerca de 1h15.** Uns 20 min de leitura, 10 min no Me teste e 40 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você acabou de fazer um commit e percebeu que a mensagem tem um erro de digitação. Ou esqueceu um arquivo. Ou, pior: rodou um comando que você não entendeu direito, e três commits inteiros sumiram do histórico. O coração acelera. Será que perdeu tudo?

Quase certeza que não. Errar no Git é normal, e quase todo erro tem volta. Pra cada tipo de "ops" existe um comando certo. E a boa notícia é que escolher qual usar depende de **uma pergunta só**, que é a coisa mais importante desta nota: **esse commit já foi enviado pro GitHub, onde outras pessoas podem ter baixado ele?**

Se **não** foi, você pode reescrever o histórico à vontade, com o `amend` e o `reset`. Se **sim**, você usa o `revert`, que cria um commit novo desfazendo o antigo, sem bagunçar o histórico de ninguém. E quando tudo der errado de verdade, existe o `git reflog`, um diário que lembra por onde você passou. Ajuda ter passado pelo [[Git Básico]] e por [[Branches, Merge e Conflitos]].

## A pergunta que decide tudo

Antes de desfazer qualquer coisa, pergunte: **o commit já foi pro GitHub?**

Por que essa pergunta importa tanto? Porque comandos como o `reset` e o `amend` **reescrevem** o histórico: eles apagam commits e criam outros no lugar, com identificadores novos. No seu computador, ninguém mais vê isso, então tudo bem. Mas se o commit já foi enviado e um colega já baixou ele, agora existem duas versões da história: a sua, reescrita, e a dele, com o commit antigo. O Git não consegue mais juntar as duas sem uma bagunça.

É como editar um livro. Enquanto o rascunho está só na sua gaveta, você pode reescrever quantos capítulos quiser. Depois que o livro foi impresso e distribuído, você não consegue mais mudar o que está escrito nas cópias dos outros. O que dá pra fazer é publicar uma errata.

Com isso em mente, esta tabela cobre quase todas as situações:

| O que aconteceu | Comando |
|---|---|
| Mexi num arquivo e quero descartar | `git restore arquivo` |
| Dei `add` sem querer | `git restore --staged arquivo` |
| Mensagem do último commit errada (**sem push**) | `git commit --amend -m "nova"` |
| Esqueci um arquivo no último commit (**sem push**) | `git add arquivo` + `git commit --amend --no-edit` |
| Desfazer os últimos commits, **mantendo** as mudanças (**sem push**) | `git reset --soft HEAD~1` |
| Jogar fora os últimos commits **e** as mudanças (**sem push**) | `git reset --hard HEAD~1` ⚠️ |
| Commit **já enviado** precisa ser desfeito | `git revert <hash>` |
| Fiz besteira e perdi commits | `git reflog` + `git reset --hard <hash>` |

Repare no "sem push" que se repete. É a pergunta aparecendo em cada linha.

## Reset: voltar a branch no tempo

O `git reset` move a branch pra trás, como se os últimos commits não tivessem acontecido. O `HEAD~1` quer dizer "um commit antes do atual"; o `HEAD~3`, três antes.

```text
antes:   A ── B ── C   ← main
git reset HEAD~1
depois:  A ── B        ← main   (C saiu do histórico)
```

O commit `C` saiu do histórico. Mas e as mudanças que ele tinha, os arquivos que você alterou? Isso depende do modo do reset, e é aqui que mora o perigo:

| Modo | As mudanças de C... |
|---|---|
| `--soft` | ficam no **palco** (staged), prontas pra um novo commit |
| `--mixed` (o padrão) | ficam **nos arquivos**, fora do palco |
| `--hard` | são **apagadas** ⚠️ |

Os dois primeiros são seguros: você não perde nada, só "descommita". O trabalho continua todo lá. Já o `--hard` joga fora de verdade, e é o comando mais perigoso desta nota: tudo o que você não tinha commitado some sem volta. Na dúvida, antes de um `--hard`, guarde o que tem com `git stash` ([[Stash]]).

O `--soft` tem um uso muito útil no dia a dia: transformar vários commits bagunçados num só, antes de enviar.

```bash
git log --oneline
# c3 agora vai
# c2 typo
# c1 começa filtro
# b0 versão estável

git reset --soft HEAD~3        # volta pro b0, e tudo de c1 a c3 fica no palco
git commit -m "feat: adiciona filtro por prioridade"
# n1 feat: adiciona filtro por prioridade
# b0 versão estável
```

Os três commits de "trabalho em progresso" viraram um só, limpo, com uma mensagem que conta o que aconteceu de verdade. E o código final é exatamente o mesmo.

## Revert: a errata

E se o commit **já foi** enviado? Aí entra o `git revert`, que é a errata do livro. Ele não apaga nada. Ele cria um commit **novo** que faz exatamente o contrário de um commit antigo:

```bash
git revert a1b2c3d   # cria um commit que desfaz o a1b2c3d
git push             # push normal, sem forçar nada
```

```text
A ── B ── C ── C̄   ← main   (C̄ = "Revert C")
```

O histórico continua contando a verdade: "fizemos C, e depois desfizemos C". Ninguém precisa forçar nada, e a história de todo mundo continua batendo. É o jeito certo de desfazer alguma coisa na `main` compartilhada, e é o que um [[Rollback]] de produção costuma fazer:

```bash
git log --oneline
# x9 feat: muda cálculo de XP   ← quebrou produção, já está no GitHub

git revert x9
git push
```

Em minutos, a produção volta a funcionar, e o histórico registra o que aconteceu. (Pra reverter um merge, existe uma variação: `git revert -m 1 <hash-do-merge>`, onde o `-m 1` diz qual dos dois lados manter.)

Os nomes parecidos confundem, então vale fixar a diferença. O **reset** **tira** commits do histórico, ou seja, reescreve. O **revert** **adiciona** um commit que desfaz, ou seja, preserva. Uma forma de lembrar: re**set** é "reconfigurar", voltar a configuração; re**vert** é "reverter" com um commit novo.

## Reflog: o salva-vidas

Agora a parte que tira o medo de usar o Git. Ele guarda um diário secreto de **cada lugar** por onde você passou, inclusive commits que já sumiram do `git log`. Esse diário se chama `reflog`:

```bash
git reset --hard HEAD~3    # ops, não era pra ter feito isso
git reflog
# 9f8e7d6 HEAD@{0}: reset: moving to HEAD~3
# 3c4d5e6 HEAD@{1}: commit: feat: adiciona filtro   ← estava aqui!
git reset --hard 3c4d5e6   # de volta, tudo recuperado
```

Você fez um `reset --hard` e três commits "sumiram". Mas o reflog lembra que, um passo antes, você estava no `3c4d5e6`. Um reset de volta pra lá, e tudo reaparece.

Saber que o reflog existe muda a sua relação com o Git: **quase tudo o que foi commitado dá pra recuperar**, por cerca de 90 dias. A palavra importante aí é "commitado". O reflog só lembra de posições de commits. Uma mudança que **nunca foi commitada** e foi descartada com `restore` ou `reset --hard` não volta, porque o Git nunca soube dela. É mais um motivo pra commitar com frequência: cada commit é um ponto de salvamento.

## As mudanças que ainda não viraram commit

Pra trabalho que você ainda nem commitou, os comandos são mais simples:

```bash
git restore arquivo.ts            # descarta as mudanças do arquivo (volta pro último commit)
git restore --staged arquivo.ts   # tira do palco, mantendo a mudança
```

Em tutoriais mais antigos, você vai ver o `git checkout arquivo` fazendo o mesmo que o `git restore arquivo`.

E tem um caso que nenhum desses resolve. O `restore` e o `reset` só mexem em arquivos que o Git **conhece**. Pra apagar arquivos novos, que nunca foram adicionados, existe o `git clean`:

```bash
git clean -n     # mostra o que SERIA apagado (só simula)
git clean -fd    # apaga arquivos e pastas não rastreados ⚠️
```

Sempre rode o `-n` antes. O `clean` apaga sem perguntar, e entre os arquivos "não rastreados" podem estar coisas importantes, como um `.env` com as suas senhas que você nunca adicionou ao Git (de propósito).

## O essencial

1. A pergunta: o commit já foi pro GitHub? Se não, pode reescrever. Se sim, `revert`.
2. `git reset HEAD~1`: `--soft` mantém no palco, `--mixed` mantém nos arquivos, `--hard` apaga.
3. `git revert <hash>` cria um commit que desfaz o outro, sem reescrever nada.
4. Reset tira commits do histórico; revert adiciona um que desfaz.
5. `git reflog` recupera commits "perdidos". O que nunca foi commitado, não volta.

## Agora é com você

Erre de propósito e conserte, num repositório de teste. Faça quatro commits. Junte os dois últimos num só com `reset --soft`. Depois faça um `reset --hard HEAD~2` "sem querer", e recupere tudo com o `reflog`. Faça mais um commit, finja que ele já foi enviado pro GitHub, e desfaça com `revert`. Por fim, crie uns arquivos lixo e limpe com `clean`, rodando o `-n` primeiro. Você terminou quando tiver recuperado os commits "perdidos" do `reset --hard`, e o `git log` mostrar o commit de revert.

Daqui, siga pras [[Tags e Versionamento Semântico]] e pro [[Rollback]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `git reset` e `git revert`?
> `reset` move a branch pra trás e tira commits do histórico (reescreve); `revert` cria um commit novo que desfaz um antigo (preserva o histórico).

> [!question]- Qual usar num commit que já foi enviado pro GitHub?
> `git revert`, porque não reescreve o histórico e não exige push forçado.

> [!question]- Qual a diferença entre `reset --soft`, `--mixed` e `--hard`?
> Todos voltam o histórico. `--soft` mantém as mudanças staged; `--mixed` mantém na pasta mas fora do staging; `--hard` apaga as mudanças.

> [!question]- Como recuperar commits depois de um `reset --hard` errado?
> Achando o hash no `git reflog` e fazendo `git reset --hard <hash>`.

> [!question]- O reflog recupera mudanças que nunca foram commitadas?
> Não. Ele só registra posições de commits; trabalho nunca commitado e descartado se perde.

> [!question]- Por que rodar `git clean -n` antes do `-fd`?
> Porque o `clean` apaga sem perguntar, e pode levar arquivos importantes que você nunca adicionou, como o `.env`.

> [!question]- O que `HEAD~2` significa?
> Dois commits antes do commit atual.

> [!question]+ Um commit com bug **já está no GitHub** e outras pessoas puxaram. Como desfazer?
> - a) `git reset --hard HEAD~1` e `git push --force`
> - b) `git revert <hash>` e `git push`
> - c) Apagar o arquivo e commitar
> - d) `git stash`
>
> > [!check]- Resposta
> > **b)** `revert` cria um commit **novo** que desfaz o outro, sem reescrever o histórico. `reset` + force push quebra o repositório de quem já puxou.

> [!question]+ Qual `reset` desfaz o commit mas **mantém as mudanças no stage**, prontas pra commitar de novo?
> - a) `git reset --soft HEAD~1`
> - b) `git reset --mixed HEAD~1`
> - c) `git reset --hard HEAD~1`
> - d) `git revert HEAD`
>
> > [!check]- Resposta
> > **a)** `--soft` mantém tudo staged. `--mixed` (o padrão) mantém os arquivos mas tira do stage. `--hard` **joga fora** as mudanças.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git restore arquivo` | Descarta a mudança na pasta |
| `git restore --staged arquivo` | Tira do staging |
| `git commit --amend` | Refaz o último commit (sem push) |
| `git reset --soft HEAD~n` | Volta n commits, mantém staged |
| `git reset HEAD~n` | Volta n commits, mudanças na pasta |
| `git reset --hard HEAD~n` | Volta e apaga ⚠️ |
| `git revert hash` | Commit que desfaz (seguro) |
| `git reflog` | O histórico do HEAD |
| `git clean -n` / `-fd` | Ver / apagar os não rastreados |

**Pra ler:** o [Oh Shit, Git!?!](https://ohshitgit.com/pt_BR), em português, é um site de receitas pra cada enrascada, escrito com humor; vale deixar nos favoritos pro dia do pânico. No Pro Git, o capítulo [Desfazendo coisas](https://git-scm.com/book/pt-br/v2/Fundamentos-de-Git-Desfazendo-coisas) cobre o básico, e o [Reset desmistificado](https://git-scm.com/book/pt-br/v2/Ferramentas-do-Git-Reset-Desmistificado) explica com desenhos o que cada modo do reset faz por dentro.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

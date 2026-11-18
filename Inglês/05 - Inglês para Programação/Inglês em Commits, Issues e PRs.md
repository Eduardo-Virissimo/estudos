---
nivel: escrito
revisado:
---

# Inglês em Commits, Issues e PRs

Escrever um e-mail formal em inglês dá medo em muita gente. Mas escrever uma mensagem de commit? *Fix login bug.* Três palavras. E uma issue de bug segue sempre o mesmo roteiro, em qualquer projeto do mundo. E um comentário de revisão de código, depois que você conhece meia dúzia de frases, sai quase sozinho.

Escrever em inglês no Git é muito mais fácil do que parece, porque é um inglês **curto e repetitivo**: sempre o mesmo formato, sempre os mesmos verbos. O commit vai no **imperativo** (*Fix login bug*, nunca *Fixed* nem *Fixing*). A issue de bug conta **os passos, o que era esperado, e o que aconteceu**. O pull request explica **o quê, por quê, e como testar**. E os comentários de revisão são **educados e diretos**.

É exatamente o inglês que você vai usar todo dia num trabalho com um time de fora. E a melhor notícia: dá pra praticar ele **já**, nos seus próprios projetos, sem esperar o emprego. Ajuda ter passado pelo [[Imperativo]], pelo [[Vocabulário Técnico]], pelos [[Conventional Commits]] e pelo [[GitHub e Pull Requests]].

## O commit, no imperativo

Existe um teste que resolve qualquer dúvida sobre como escrever a mensagem de um commit. Ela tem que completar a frase **"If applied, this commit will \_\_\_"**, "se aplicado, este commit vai...".

*If applied, this commit will **fix login bug**.* ✅ · *...will **fixed** login bug* ❌

É por isso que o verbo vai na forma básica, como uma ordem ([[Imperativo]]): ***Add***, ***Fix***, ***Remove***. E curto, sem ponto final.

| ❌ | ✅ |
|---|---|
| `Fixed the bug` | `fix: handle empty task title` |
| `Adding filter` | `feat: add priority filter to list command` |
| `changes` | `refactor: extract JSON storage into its own module` |
| `update readme` | `docs: add usage examples to README` |
| `Removed unused stuff` | `chore: remove unused dependencies` |

O prefixo, como `fix:` ou `feat:`, vem do padrão [[Conventional Commits]]. E estes poucos verbos resolvem uns 90% das mensagens que você vai escrever:

| Verbo | Pra quê |
|---|---|
| *Add* | algo novo |
| *Fix* | corrigir |
| *Remove* / *Drop* | tirar |
| *Update* / *Bump* | atualizar / subir a versão |
| *Rename* / *Move* | renomear / mover |
| *Extract* / *Split* | separar em partes |
| *Improve* / *Simplify* | melhorar / simplificar |
| *Handle* | tratar (um caso, um erro) |
| *Prevent* / *Allow* | impedir / permitir |
| *Replace X with Y* | trocar X por Y |

O erro mais comum é usar o **passado**: *Fixed*, *Added*. Ele parece natural, porque em português a gente diria "corrigi o bug". Mas a convenção do Git é o imperativo, e é ele que você vai ver em todo projeto grande: *Fix*, *Add*.

E um erro mais sutil é **traduzir palavra por palavra**. "Arrumei o bug do login" não vira *Arranged the login bug* (o *arrange* é "arrumar" no sentido de organizar). Em inglês, descreva **o que mudou**, e não o que você fez: `fix: login fails with valid password`.

## Uma issue que se resolve sozinha

Uma issue de bug boa tem um objetivo só: deixar **qualquer pessoa reproduzir** o bug, sem precisar te perguntar nada. E a estrutura dela é sempre a mesma, em qualquer projeto:

```markdown
**Title:** `list` crashes when tasks.json is empty

### Steps to reproduce
1. Create an empty `tasks.json`
2. Run `tasks list`

### Expected behavior
An empty list message: "No tasks yet".

### Actual behavior
The app crashes with `SyntaxError: Unexpected end of JSON input`.

### Environment
- Node 24.1, Windows 11
- tasks v1.1.0
```

Cada parte tem a sua regra. O **título** descreve o **sintoma**, no presente: *crashes*, *fails*, *shows*. O **Expected** é o que deveria acontecer; o **Actual** é o que aconteceu de verdade. E a mensagem de erro vai sempre **exata**, copiada e colada, nunca resumida com as suas palavras (o "deu um erro de JSON" não ajuda ninguém).

Pra **pedir uma funcionalidade nova**, a estrutura muda: em vez de passos e erro, é problema e proposta.

```markdown
**Title:** Add due dates to tasks

### Problem
I can't tell which tasks are urgent.

### Proposal
Add a `--due YYYY-MM-DD` option to `add`, and show overdue tasks in red on `list`.

### Alternatives considered
Using priority only, but it doesn't capture deadlines.
```

E a descrição de um **pull request** responde três perguntas: o quê, por quê, e como testar.

```markdown
## What
Adds a `--priority` option to `add` and `list`.

## Why
With 30+ tasks it's hard to find the urgent ones. Closes #12.

## How to test
1. `npm run dev -- add "Test" --priority high`
2. `npm run dev -- list --priority high` → only the new task shows up

## Notes
Old tasks without priority default to `medium`.
```

Repare que nenhum desses textos exige inglês avançado. São frases curtas, diretas, quase listas. O que dá trabalho é a estrutura, e ela é sempre a mesma.

## Revisar com educação

Esta é a parte que mais importa no dia a dia de um time, e onde o inglês de quem fala português pode soar rude sem querer. Em inglês, **as perguntas suavizam**. Um comentário escrito como afirmação pode soar como ataque; o mesmo conteúdo, escrito como pergunta, soa como colaboração.

- *Wrong.* → ofende.
- *I think this might not handle an empty list. What do you think?* → convida.

As duas frases apontam o mesmo problema. Mas a primeira coloca a pessoa na defensiva, e a segunda abre uma conversa. Estas frases cobrem a maior parte das situações:

| Intenção | Frase |
|---|---|
| sugerir | *What do you think about extracting this into a function?* |
| perguntar | *What happens if the list is empty here?* |
| detalhe pequeno | *nit: typo in "recieve" → "receive"* |
| bloquear com motivo | *This would break existing JSON files. Could we add a migration?* |
| elogiar | *Nice catch!* · *This is much cleaner, thanks!* |
| aprovar | *LGTM 👍* |

O ***nit*** no começo de um comentário marca um detalhe pequeno, de gosto, que não bloqueia o PR (vem de *nitpick*, "implicar com detalhe"). E o ***LGTM*** é *looks good to me*, "pra mim está bom" (a nota [[Siglas Técnicas]] tem outras).

E quando é **você** que recebe a revisão:

| Situação | Frase |
|---|---|
| concordou e corrigiu | *Good point, fixed in a1b2c3d.* |
| discorda, com educação | *I considered that, but it would require X. Happy to change if you feel strongly.* |
| vai fazer depois | *Agreed. I'll handle it in a follow-up PR.* |
| não entendeu | *Could you clarify what you mean by...?* |

Um cuidado no sentido contrário: **não exagere no *please* e no *sorry***. Um *could you* já basta pra ser educado. E não peça desculpas por estar revisando o código de alguém: revisar é o seu trabalho, e o seu colega sabe disso.

## O vocabulário que aparece toda hora

Algumas expressões aparecem em quase toda conversa de PR e issue:

| Expressão | Quer dizer |
|---|---|
| *as expected* | como esperado |
| *out of scope* | fora do escopo deste PR |
| *follow-up* | continuação, num PR ou issue seguinte |
| *edge case* | caso de borda |
| *breaking change* | mudança que quebra compatibilidade |
| *works on my machine* | (piada) aqui funciona, e não sei por que aí não |
| *blocked by #12* | depende da issue 12 |

E um truque pra quando você não souber como escrever alguma coisa: **copie a construção de um PR de um projeto grande** no GitHub, como o TypeScript, o Node.js ou o VS Code. É um inglês revisado por centenas de pessoas, e você pode imitar à vontade.

## O essencial

1. Commit no imperativo, completando "If applied, this commit will...": *Fix*, *Add*, nunca *Fixed*.
2. Descreva o que mudou, não traduza o que você fez.
3. Issue de bug: Steps to reproduce, Expected, Actual (com o erro exato), Environment.
4. PR: What, Why, How to test.
5. Revisão em forma de pergunta: *What do you think about...?* E *nit:* pra detalhe que não bloqueia.

## Agora é com você

Reescreva o seu próprio histórico em inglês. Pegue as últimas dez mensagens de commit de um projeto seu, e reescreva em inglês, no imperativo e no padrão [[Conventional Commits]] (só no papel; não precisa mexer no histórico de verdade). Depois escreva em inglês uma issue de bug de alguma coisa real sua, com os passos, o esperado e o que aconteceu. E peça pra uma IA corrigir os textos, com o prompt de [[Output com Correção]], anotando os erros que se repetiram. Você terminou quando as dez mensagens passarem no teste "If applied, this commit will..." e a issue tiver as quatro partes.

Depois, o projeto que é portfólio e treino ao mesmo tempo: **um projeto seu 100% em inglês.** O [[Gerenciador de Tarefas no Terminal]] é um ótimo candidato. Escreva o README em inglês (*what it is*, *how to install*, *how to use*, com exemplos). Faça todos os commits em inglês, no imperativo. Abra três issues em inglês (pelo menos um bug e uma funcionalidade), e faça cada funcionalidade nova entrar por um PR com *What*, *Why* e *How to test*. E revise o seu próprio PR, deixando um comentário em inglês e respondendo a ele. Você terminou quando alguém que não fala português conseguir entender o projeto inteiro só pelo GitHub. Se quiser ir além, contribua com uma correção de documentação (um erro de digitação, por exemplo) num projeto open source em inglês, e configure o commitlint ([[Git Hooks]]) pra validar o formato das mensagens.

Daqui, siga pro [[Inglês em Reuniões e Daily]] e pro [[Code Review]].

---

## 🧠 Me teste

> [!question]- Em que tempo verbal se escreve uma mensagem de commit em inglês?
> No imperativo: *Add*, *Fix*, *Remove* (completa a frase "If applied, this commit will...").

> [!question]- Quais são as partes de uma boa issue de bug?
> Passos pra reproduzir, comportamento esperado, comportamento atual (com o erro exato) e ambiente.

> [!question]- O que vai na descrição de um PR?
> *What* (o que muda), *Why* (por quê) e *How to test* (como testar).

> [!question]- Como sugerir uma mudança num review sem soar rude?
> Em forma de pergunta ou sugestão: "What do you think about...?", "Could we...?".

> [!question]- Como responder a um revisor depois de corrigir o que ele pediu?
> "Good point, fixed in <hash>."

> [!question]- O que significa *out of scope*?
> Fora do escopo: algo que não pertence a este PR/tarefa.

> [!question]+ Qual mensagem de commit segue a convenção em inglês?
> - a) *Fixed login bug*
> - b) *Fix login redirect on expired session*
> - c) *Fixing the bug of login*
> - d) *I fixed the login*
>
> > [!check]- Resposta
> > **b)** Imperativo, como se completasse "this commit will...": *Fix*, *Add*, *Remove*. E específico: diz **o que** foi corrigido.

---

## Pra consultar depois

| Onde | Fórmula |
|---|---|
| Commit | `tipo: verbo no imperativo + o quê` |
| Issue de bug | Steps to reproduce · Expected · Actual · Environment |
| Issue de feature | Problem · Proposal · Alternatives |
| PR | What · Why · How to test |
| Sugerir | *What do you think about...?* |
| Corrigiu | *Good point, fixed in abc123.* |
| Aprovar | *LGTM* |

**Pra ler:** o artigo [How to Write a Git Commit Message](https://cbea.ms/git-commit/), de Chris Beams, é o clássico sobre mensagens de commit, e explica o porquê do imperativo. O [Conventional Comments](https://conventionalcomments.org/) propõe rótulos pros comentários de revisão (*suggestion:*, *question:*, *nit:*), que deixam o tom claro. E a página [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue), do GitHub, mostra como criar templates de issue pro seu projeto.

## Minhas anotações

**Um commit, uma issue ou um comentário que eu escrevi em inglês:**
- 

**Erros que se repetiram:**
-

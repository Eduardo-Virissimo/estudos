---
nivel: escrito
foco: bom saber
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Git Hooks

**Quanto focar: 💤 bom saber.** Normalmente alguém já configurou no projeto. Saiba que existem e o que fazem; aprofunde quando precisar mexer.

**⏱️ Quanto tempo: cerca de 1h30.** Uns 15 min de leitura, 10 min no Me teste e 1h no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Você revisa um pull request de um colega e encontra, de novo, um `console.log` esquecido, um arquivo sem formatação e um commit chamado "ajustes". Você comenta, ele corrige, e na semana seguinte acontece tudo de novo, com outra pessoa. Não é falta de vontade: é que ninguém lembra de rodar o linter, o formatter e a checagem de tipos antes de **cada** commit. Ninguém consegue.

E se o próprio Git fizesse isso sozinho? É exatamente o que os **Git hooks** fazem. Eles são scripts que o Git roda automaticamente em certos momentos: antes de um commit, ao escrever a mensagem, antes de um push. E se o script terminar com erro, o Git **cancela** a operação. O uso clássico é rodar o [[Linter]], o [[Formatter]] e a checagem de tipos antes de cada commit, e conferir se a mensagem segue os [[Conventional Commits]]. Assim, código quebrado ou mal formatado nem chega a virar commit.

Num projeto Node, duas ferramentas, o **Husky** e o **lint-staged**, configuram isso pro time inteiro de uma vez. E tem um limite importante, que esta nota faz questão de deixar claro no fim: o hook **ajuda**, mas não **garante**. Ajuda ter passado pelos Conventional Commits, pelo Linter, pelo Formatter, e pelo código de saída de [[Entrada e Saída]].

## Um porteiro antes do commit

Um hook (que em inglês quer dizer "gancho") é um script que o Git chama num momento específico. Pense num porteiro: antes de deixar o commit entrar, ele confere se está tudo em ordem. Se não estiver, barra na porta.

Existem hooks pra vários momentos, e estes são os que você vai usar:

| Hook | Quando roda | Uso típico |
|---|---|---|
| `pre-commit` | antes de criar o commit | lint, formatação, checar tipos |
| `commit-msg` | depois de escrever a mensagem | validar o formato da mensagem |
| `pre-push` | antes de enviar | rodar os testes |
| `post-merge` | depois de um merge ou pull | `npm install`, se o `package-lock` mudou |

E a regra que faz tudo isso funcionar é a do **código de saída**, que você viu em [[Entrada e Saída]]. Se o script termina com um código diferente de 0, ou seja, com erro, a operação é **cancelada**. (Isso vale pros hooks `pre-*` e pro `commit-msg`; os `post-*` rodam depois que já aconteceu, então não têm o que cancelar.)

Todo repositório já vem com hooks de exemplo, em `.git/hooks/*.sample`. Pra ativar um, basta criar o arquivo sem o `.sample` no nome. Este aqui recusa qualquer commit que tenha um `console.log`:

```bash
# .git/hooks/pre-commit
#!/usr/bin/env bash
if git diff --cached | grep -q "console.log"; then
  echo "❌ Tem console.log no commit. Remova ou use --no-verify se for de propósito."
  exit 1
fi
```

```bash
chmod +x .git/hooks/pre-commit   # dá permissão de execução (no Git Bash do Windows também)
```

O `git diff --cached` mostra o que está no palco, prestes a ser commitado. Se aparecer um `console.log` ali, o script mostra a mensagem e sai com `exit 1`, e o commit é recusado.

Repare no `chmod +x` no final, que pega muita gente. Um hook sem permissão de execução simplesmente **não roda**, e o pior: não avisa nada. Você acha que o porteiro está lá, e a porta está aberta.

## Hooks pro time inteiro

O hook manual tem um problema sério: a pasta `.git` **não vai pro repositório**. Ela é a parte privada do Git no seu computador. Então cada pessoa do time teria que criar os hooks à mão, na própria máquina. E ninguém faz isso.

O **Husky** resolve esse problema guardando os hooks numa pasta comum, que vai pro Git junto com o código:

```bash
npm install -D husky
npx husky init   # cria a pasta .husky/ e o script "prepare" no package.json
```

O truque está no script `prepare`, que o npm roda sozinho a cada `npm install`. Então **todo mundo que clona o projeto e instala as dependências já ganha os hooks**, sem fazer nada a mais. E cada hook vira um arquivo simples:

```bash
# .husky/pre-commit
npm run check
```

Logo aparece um segundo problema: rodar o linter no **projeto inteiro** a cada commit fica lento, principalmente num projeto grande. O **lint-staged** resolve, rodando as ferramentas **só nos arquivos que estão no commit**:

```bash
npm install -D lint-staged
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": "prettier --write"
}
```

```bash
# .husky/pre-commit
npx lint-staged
npm run check   # tipos precisam do projeto todo, mas é rápido
```

E o **commitlint** confere a mensagem do commit, no hook `commit-msg`:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo 'export default { extends: ["@commitlint/config-conventional"] };' > commitlint.config.js
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

```bash
git commit -m "ajustes"
# ✖ subject may not be empty  ✖ type may not be empty
git commit -m "fix: corrige filtro com acento"   # ✅
```

Juntando as três peças (o lint-staged no `pre-commit`, o commitlint no `commit-msg` e um `npm test` no `pre-push`), aquele PR do começo da nota deixa de existir. Código mal formatado é corrigido sozinho, erro de tipo bloqueia o commit, mensagem fora do padrão é recusada, e teste quebrado não sobe.

Dois cuidados. O primeiro: sem o script `"prepare": "husky"` no `package.json`, quem clona o projeto **não** ganha os hooks, e toda a ideia cai. O segundo: **hook lento é hook pulado**. Se o `pre-commit` demora um minuto, em uma semana todo mundo está pulando ele. Mantenha em segundos (é pra isso que o lint-staged existe), e deixe os testes pesados pro `pre-push` ou pra CI.

## O porteiro pode ser driblado

Agora o limite, e ele é importante. Qualquer pessoa pode pular os hooks:

```bash
git commit --no-verify -m "..."   # ignora o pre-commit e o commit-msg
```

Isso existe por um bom motivo: emergências, e commits de rascunho que ficam só no seu computador. Mas ele mostra o limite dos hooks com clareza: eles rodam **no computador de cada pessoa**, e cada pessoa pode desligar.

Então pense no hook como a **primeira linha de defesa**. Ele te dá um aviso rápido, no seu computador, antes de você enviar qualquer coisa, e isso economiza muito tempo. Mas a **garantia** de verdade vem de outro lugar: da **CI** ([[GitHub Actions]]) rodando as mesmas checagens em cada pull request, e da `main` protegida exigindo que essas checagens passem ([[Git Flow]]). Essa, ninguém pula.

E um sinal de alerta: se você se pega usando `--no-verify` toda hora, o problema não é você, é o hook. Ele está lento ou chato demais. Conserte o hook, em vez de pular ele.

Um último detalhe técnico, pra quando você escrever hooks manuais: um hook que **altera** arquivos (formatando, por exemplo) precisa rodar `git add` de novo neles. Senão, o commit leva a versão antiga, e a formatada fica de fora. O lint-staged já cuida disso sozinho.

## O essencial

1. Um hook é um script que o Git roda num momento específico. Saiu com erro, a operação é cancelada.
2. `pre-commit` pra lint e tipos; `commit-msg` pra mensagem; `pre-push` pra testes.
3. A pasta `.git` não vai pro repositório. O Husky guarda os hooks no projeto e instala pra todos via `prepare`.
4. O lint-staged roda as ferramentas só nos arquivos do commit, pra o hook ficar rápido.
5. O hook pode ser pulado com `--no-verify`. A garantia vem da CI e da `main` protegida.

## Agora é com você

Blinde o seu projeto modelo, o de [[Configurando um Projeto TypeScript]]. Primeiro, escreva um hook **manual** que bloqueia commits com `console.log`, e teste ele. Depois apague, e configure o Husky, o lint-staged e o commitlint como no exemplo. Teste três bloqueios: um erro de tipo, uma mensagem `"ajustes"`, e, se o projeto tiver testes, um teste quebrado na hora do push. Por fim, clone o repositório em outra pasta, rode `npm install`, e confirme que os hooks vieram junto. Você terminou quando os três bloqueios funcionarem e o clone novo já tiver os hooks, sem você configurar nada.

Daqui, siga pra [[CI/CD]] e [[GitHub Actions]], que são a garantia de verdade, e pros [[Hooks de Agentes]].

---

## 🧠 Me teste

> [!question]- O que é um Git hook?
> Um script que o Git executa automaticamente em certos eventos (antes do commit, ao escrever a mensagem, antes do push...).

> [!question]- Como um hook `pre-commit` cancela o commit?
> Terminando com código de saída diferente de 0.

> [!question]- Por que usar Husky em vez de escrever em `.git/hooks`?
> Porque `.git/hooks` não é versionado; o Husky guarda os hooks no repositório e instala pra todos via `npm install`.

> [!question]- O que o lint-staged faz?
> Roda as ferramentas (lint, formatação) só nos arquivos que estão no commit, deixando o hook rápido.

> [!question]- Hooks garantem que a `main` sempre tenha código checado?
> Não: dá pra pular com `--no-verify`. A garantia vem do CI e da proteção da branch.

> [!question]- Qual hook usar pra validar a mensagem de commit?
> `commit-msg` (com commitlint, por exemplo).

> [!question]- Por que um hook lento é um problema?
> Porque o time passa a pular ele com `--no-verify`, e a proteção some na prática.

> [!question]+ O time usa um hook `pre-commit` que roda o linter. Isso **garante** código checado na `main`?
> - a) Sim, ninguém consegue commitar sem passar
> - b) Não: dá pra pular com `--no-verify`, então a garantia vem da CI
> - c) Sim, se usar Husky
> - d) Só se o hook estiver em `.git/hooks`
>
> > [!check]- Resposta
> > **b)** Hook roda na máquina de cada um e pode ser pulado. Ele dá feedback rápido. Quem garante é a CI bloqueando o merge.

---

## Pra consultar depois

| Item | O que faz |
|---|---|
| `.git/hooks/pre-commit` | Hook manual (não versionado) |
| `npx husky init` | Cria a `.husky/` e o `prepare` |
| `.husky/pre-commit` | Roda antes do commit |
| `.husky/commit-msg` | Valida a mensagem |
| `.husky/pre-push` | Roda antes do push |
| `npx lint-staged` | Lint só nos arquivos staged |
| `commitlint --edit "$1"` | Valida Conventional Commits |
| `git commit --no-verify` | Pula os hooks |

**Pra ler:** o capítulo [Git Hooks do Pro Git](https://git-scm.com/book/pt-br/v2/Customizando-o-Git-Hooks-do-Git), em português, lista todos os hooks que existem e quando cada um roda. Pra configurar, as documentações do [Husky](https://typicode.github.io/husky/), do [lint-staged](https://github.com/lint-staged/lint-staged) e do [commitlint](https://commitlint.js.org/) são curtas, e cada uma tem um "getting started" de cinco minutos.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

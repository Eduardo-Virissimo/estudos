---
nivel: escrito
foco: importante
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
revisado:
---

# Tags e Versionamento Semântico

**Quanto focar: 📌 importante.** Você precisa entender o `^1.2.3` do `package.json` e como as versões funcionam. As tags em si você usa pouco no começo.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3.

Você usa uma biblioteca de datas no seu projeto, na versão `1.4.2`. Sai a `1.5.0`. Dá pra atualizar sem medo? E se sair a `2.0.0`? Repare que você conseguiu ter uma intuição sobre essas perguntas sem saber nada da biblioteca, só olhando os números. Isso não é coincidência. É o **Versionamento Semântico**, uma convenção que dá significado a cada parte do número de versão.

O **SemVer**, como é chamado, organiza o número em três partes, `MAJOR.MINOR.PATCH`, e cada uma é uma **promessa** pra quem usa o seu software. O **PATCH** sobe quando você corrige um bug sem mudar nada. O **MINOR** sobe quando você adiciona algo novo, mas compatível. E o **MAJOR** sobe quando você quebra a compatibilidade. É lendo esse número que o `npm` decide, sozinho, o que pode atualizar.

E pra marcar no histórico do Git "aqui está a versão 1.2.0", existe a **tag**: um nome fixo pra um commit específico. Diferente de uma branch, ela não anda nunca. É um marcador permanente. Ajuda ter passado pelo [[Git Básico]] e pelo [[Desfazendo Mudanças (Reset e Revert)]].

## O que cada número promete

O número `1.4.2` não é aleatório. Cada parte conta uma coisa:

| Mudou o quê | Sobe | Exemplo |
|---|---|---|
| Correção de bug, sem mudar como se usa | **PATCH** | `1.4.2` → `1.4.3` |
| Funcionalidade nova, compatível | **MINOR** (zera o patch) | `1.4.3` → `1.5.0` |
| Mudança que quebra quem usa | **MAJOR** (zera os outros) | `1.5.0` → `2.0.0` |

A ideia central é a **promessa**. Voltando à biblioteca do começo: se você usa a `1.4.2` e sai a `1.5.0`, pode atualizar tranquilo. O SemVer garante que nada do que você usava mudou: só tem coisa nova. Já a `2.0.0` é um aviso: "alguma coisa vai quebrar; leia as notas antes de atualizar".

E o que conta como "quebrar quem usa"? Remover ou renomear uma função ou uma opção, mudar o formato de uma resposta, mudar um comportamento que as pessoas esperavam. Qualquer coisa que obrigue quem usa a mudar o próprio código.

Aplicando no gerenciador de tarefas, a história das versões ficaria assim:

| Mudança | Versão |
|---|---|
| Primeira versão usável | `1.0.0` |
| Corrige bug: título só com espaços | `1.0.1` |
| Adiciona `--prioridade` (opcional) | `1.1.0` |
| Adiciona comando `stats` | `1.2.0` |
| Muda o formato do `tarefas.json` (versões antigas não leem mais) | `2.0.0` |
| Corrige erro de digitação na ajuda | `2.0.1` |

Repare na linha do `--prioridade`: é uma funcionalidade nova, mas **opcional**, então quem não usa nem percebe. Por isso é minor. Já mudar o formato do arquivo quebra quem tem tarefas salvas no formato antigo, então é major.

Existem dois casos especiais. A fase **`0.x.y`** é a infância de um projeto: nela, **qualquer coisa pode mudar** a qualquer momento, e a promessa de compatibilidade só começa no `1.0.0`. E as versões de **pré-lançamento**, como `2.0.0-beta.1` ou `2.0.0-rc.1`, vêm **antes** do `2.0.0`, pra quem quer testar o que vem por aí.

Duas tentações pra resistir. A primeira é **quebrar a compatibilidade num minor**: "é só uma mudancinha no formato". Ela quebra todo mundo que confiava na promessa, e você vai ver na próxima seção por que isso é tão grave. Na dúvida, é major. A segunda é **ficar no `0.x` pra sempre**, pra "não ter que prometer nada". Isso não funciona quando outras pessoas já dependem do seu código. Chegue no `1.0.0`.

## As tags marcam as versões

Uma tag é um marcador colado num commit. A diferença pra uma branch é que uma branch anda a cada commit novo, e uma tag fica **sempre** no mesmo lugar. É exatamente por isso que ela serve pra marcar versões: daqui a um ano, a `v1.0.0` ainda vai apontar pro mesmo código.

```bash
git tag -a v1.0.0 -m "Primeira versão estável"  # tag anotada (com autor, data e mensagem)
git tag                                          # lista
git tag -l "v1.*"                                # filtra
git show v1.0.0                                  # detalhes e o commit
git tag -a v0.9.0 a1b2c3d -m "..."               # tag num commit antigo
```

Use sempre tags **anotadas**, com o `-a`, pra marcar versões. Elas guardam quem criou, quando e uma mensagem. Existe também a tag "leve" (`git tag v1.0.0`, sem o `-a`), que é só um nome, sem nenhuma dessas informações.

E pra ver como o código estava numa versão antiga:

```bash
git switch --detach v1.0.0   # "detached HEAD": só pra olhar; pra mudar, crie uma branch
```

Dois cuidados. O primeiro pega todo mundo: **o `git push` normal não envia as tags.** Você cria a tag, dá push, e ela não aparece no GitHub. Pra enviar, use `git push origin v1.0.0` (uma tag) ou `git push --follow-tags` (todas as anotadas ligadas aos commits enviados). O segundo: **nunca mude uma tag que já foi publicada.** Quem já baixou a `v1.0.0` fica com uma versão diferente da sua, com o mesmo nome, e ninguém mais sabe o que a `v1.0.0` quer dizer. Errou alguma coisa? Lance a próxima, a `v1.0.1`.

## Onde a promessa vira prática

Agora dá pra entender por que o SemVer importa tanto no dia a dia. Olhe as dependências de um projeto:

```json
"dependencies": {
  "zod": "^3.23.8",
  "dayjs": "~1.11.10",
  "left-pad": "1.3.0"
}
```

Esses símbolos na frente das versões dizem até onde o `npm` pode atualizar sozinho:

| Escrito | Aceita | Por quê |
|---|---|---|
| `^3.23.8` | de `3.23.8` até antes de `4.0.0` | novos minor e patch são compatíveis, pela promessa (**o padrão do npm**) |
| `~1.11.10` | de `1.11.10` até antes de `1.12.0` | só patch |
| `1.3.0` | exatamente essa | trava |

O `^`, que é o padrão do npm, **confia na promessa do SemVer**: ele aceita qualquer versão compatível, mas nunca um major novo. E é aqui que se vê por que quebrar a compatibilidade num minor é tão grave. Todo mundo que tem a sua biblioteca com `^` no `package.json` recebe a quebra **automaticamente**, no próximo `npm update`, sem ter feito nada de errado. A promessa quebrada se espalha por milhares de projetos.

O `package-lock.json` trava a versão **exata** que foi instalada; os símbolos dizem até onde ela pode subir num `npm update`. O [[Gerenciador de Pacotes]] explica a relação entre os dois.

## Lançando versões

Quando chegar a hora de lançar uma versão do seu projeto, o npm faz tudo de uma vez:

```bash
npm version patch   # 1.0.0 → 1.0.1: muda o package.json, faz o commit e cria a tag v1.0.1
npm version minor   # → 1.1.0
npm version major   # → 2.0.0
git push --follow-tags
```

E uma tag pode virar uma **Release** no GitHub: uma página com as notas do que mudou e arquivos pra baixar.

```bash
gh release create v1.1.0 --generate-notes   # monta as notas a partir dos PRs
```

Com os [[Conventional Commits]], dá pra ir além: ferramentas leem as mensagens desde a última versão e escolhem o número sozinhas (teve `feat`? minor; só `fix`? patch), e ainda escrevem o changelog.

O **changelog** é um arquivo que conta, pra pessoas, o que mudou em cada versão. O formato mais comum é o [Keep a Changelog](https://keepachangelog.com/pt-BR/):

```markdown
## [1.1.0] - 2026-11-15
### Adicionado
- Filtro por prioridade no comando `list`.
### Corrigido
- Título só com espaços era aceito.
```

E se um dia você precisar apagar uma tag (raro, e só se ninguém usou ainda): `git tag -d v1.0.0` apaga no seu computador, e `git push origin --delete v1.0.0` apaga no GitHub.

## O essencial

1. `MAJOR.MINOR.PATCH`: patch corrige, minor adiciona algo compatível, major quebra.
2. A versão é uma promessa. Quebrar compatibilidade num minor quebra todo mundo que usa `^`.
3. `0.x` é a fase em que tudo pode mudar; a promessa começa no `1.0.0`.
4. Uma tag marca um commit pra sempre. Use `-a`, e envie com `--follow-tags`.
5. `^1.2.3` aceita até antes de `2.0.0`; `~1.2.3`, até antes de `1.3.0`.

## Agora é com você

Lance três versões de um projeto seu. Num projeto com `package.json`, comece no `1.0.0` e crie a tag `v1.0.0` (com `npm version` ou `git tag -a`). Faça uma correção e suba um `patch`; faça uma funcionalidade nova e suba um `minor`. Escreva um `CHANGELOG.md` com as três versões. Envie as tags e crie a Release `v1.1.0` no GitHub. E por fim, pra cada dependência do seu `package.json`, diga até que versão o `npm update` poderia subir. Você terminou quando o `git tag` listar as três versões, elas aparecerem no GitHub, e o changelog bater com os commits.

Daqui, siga pros [[Conventional Commits]], pro [[Gerenciador de Pacotes]], pro [[Versionamento de API]] e pro [[Deploy]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre tag e branch?
> A branch anda a cada commit novo; a tag aponta sempre pro mesmo commit (marca uma versão).

> [!question]- O que significa cada parte de `MAJOR.MINOR.PATCH`?
> MAJOR: mudança que quebra compatibilidade; MINOR: funcionalidade nova compatível; PATCH: correção compatível.

> [!question]- Que versões `^2.3.1` aceita?
> De 2.3.1 até antes de 3.0.0 (qualquer minor e patch da versão 2).

> [!question]- Mudou o formato de um arquivo e versões antigas não leem mais. Que número sobe?
> O MAJOR, porque quebra compatibilidade.

> [!question]- Por que quebrar compatibilidade num minor é tão grave?
> Porque quem usa `^` recebe a versão automaticamente no `npm update`, e o código dessas pessoas quebra sem aviso.

> [!question]- Por que `git push` não enviou a tag?
> Porque tags não são enviadas por padrão; é preciso `git push origin v1.0.0` ou `git push --follow-tags`.

> [!question]- O que significa estar na versão `0.x.y`?
> Fase inicial de desenvolvimento: a API pode mudar a qualquer momento, sem promessa de compatibilidade.

> [!question]+ Seu app está na `2.4.1`. Você corrigiu um bug sem mudar nada da API. Qual a próxima versão?
> - a) `3.0.0`
> - b) `2.5.0`
> - c) `2.4.2`
> - d) `2.4.1-fix`
>
> > [!check]- Resposta
> > **c)** Correção que não muda a interface sobe o PATCH. MINOR = funcionalidade nova compatível. MAJOR = quebra compatibilidade.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `git tag -a v1.0.0 -m "msg"` | Criar uma tag anotada |
| `git tag` / `git show v1.0.0` | Listar / ver |
| `git push --follow-tags` | Enviar as tags |
| `git tag -d v1` + `git push origin --delete v1` | Apagar |
| `npm version patch\|minor\|major` | Subir a versão + commit + tag |
| `gh release create v1.1.0 --generate-notes` | Release no GitHub |
| `^1.2.3` / `~1.2.3` | Até <2.0.0 / até <1.3.0 |

**Pra ler e testar:** a [especificação do SemVer](https://semver.org/lang/pt-BR/) está em português e é curta. O [Keep a Changelog](https://keepachangelog.com/pt-BR/), também em português, explica como escrever um changelog que as pessoas conseguem ler. E a [calculadora de semver do npm](https://semver.npmjs.com/) deixa você digitar um intervalo, como `^3.23.8`, e ver exatamente quais versões de um pacote ele aceita.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

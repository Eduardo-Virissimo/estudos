---
nivel: escrito
foco: importante
projeto:
  - "[[Gerenciador de Tarefas no Terminal]]"
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Conventional Commits

**Quanto focar: 📌 importante.** Muitos times exigem. É rápido de aprender e já deixa o seu GitHub mais profissional.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 10 min no Me teste e 20 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Gerenciador de Tarefas no Terminal]], projeto dos Estágios 1 e 3 · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Abra o histórico de um projeto pessoal qualquer, inclusive os seus, e você vai encontrar algo assim: "ajustes", "wip", "agora vai", "agora vai mesmo", "arrumei", "agora vai!!!". Daqui a três meses, quando você precisar descobrir em que momento um bug apareceu, esse histórico não vai te dizer nada. Cada commit é uma caixa sem etiqueta.

Os **Conventional Commits** são um padrão simples pra mensagem de commit: `tipo(escopo): descrição`. Algo como `feat(cli): adiciona filtro por prioridade`, ou `fix: recusa título vazio`. O **tipo**, que vem primeiro, diz a natureza da mudança: uma funcionalidade nova, uma correção, documentação.

Parece só uma formalidade, mais uma regra pra seguir. Mas tem dois ganhos bem reais. O histórico fica legível de relance, como um índice do projeto. E, o mais interessante, ferramentas conseguem ler essas mensagens e gerar sozinhas o changelog e a próxima versão do programa ([[Tags e Versionamento Semântico|SemVer]]). Ajuda ter passado pelo [[Git Básico]].

## O formato

```text
tipo(escopo opcional): descrição curta no imperativo

Corpo opcional: o PORQUÊ da mudança, o que não dá pra ver no diff.
Quebre as linhas em uns 72 caracteres.

Rodapé opcional: BREAKING CHANGE: ..., Closes #12
```

Só a primeira linha é obrigatória, e na maioria dos commits ela basta. Olhe como um histórico fica com ela:

```text
feat(cli): adiciona opção --prioridade ao comando add
fix: impede tarefa com título só de espaços
docs(readme): explica como instalar com npm
refactor(storage): extrai leitura do JSON para função própria
test: cobre conclusão de tarefa inexistente
build: atualiza typescript para 5.6
```

Você bate o olho e sabe exatamente o que aconteceu no projeto, em que ordem, e onde. Compare com o histórico de "ajustes" e "agora vai!!!" do começo.

O **escopo**, entre parênteses, é a parte do projeto que foi afetada: `cli`, `storage`, `api`, `ui`. Ele é opcional, mas ajuda muito em projetos maiores, quando você quer saber "o que mudou no armazenamento?".

## Os tipos

São poucos os tipos que você vai usar no dia a dia:

| Tipo | Quando | Efeito na versão |
|---|---|---|
| `feat` | funcionalidade nova pro usuário | sobe o **MINOR** |
| `fix` | correção de bug | sobe o **PATCH** |
| `docs` | só documentação (README, comentários) | – |
| `refactor` | muda a estrutura sem mudar o comportamento | – |
| `test` | adiciona ou corrige testes | – |
| `chore` | manutenção que não é código do produto | – |

Os dois mais comuns são `feat` e `fix`, e a diferença entre eles é a que mais importa entender: **`feat` é algo novo; `fix` é algo que já existia e estava errado.** Repare na terceira coluna: essa diferença decide como o número da versão sobe.

Existem tipos mais específicos também: `style` (formatação, sem mudar a lógica), `perf` (desempenho), `build` (dependências, `package.json`), `ci` (pipelines, GitHub Actions) e `revert` (desfaz um commit).

E três tentações pra resistir. Usar `fix` pra algo que nunca funcionou: se a funcionalidade não existia, não tem o que corrigir, é `feat`. Usar um tipo "maior" pra parecer mais importante: uma refatoração não é `feat`, e o tipo errado faz a versão subir à toa e engana quem lê o changelog. E usar `chore` pra tudo que não se encaixa: ele vira uma gaveta de bagunça, igual ao `utils.ts` da [[Modularização]]. Use o tipo específico.

## Uma boa descrição

A descrição é a parte que dá mais trabalho, e algumas regras fazem toda a diferença.

Escreva no **imperativo**, como uma ordem: "adiciona", "corrige", "remove". Um jeito de acertar é ler como se completasse a frase "este commit vai...". Diga **o que o commit faz**, e não o que você fez: em vez de "mexi no filtro", escreva "corrige filtro que ignorava acentos". Seja **específico**: `fix: corrige bug` não diz nada a ninguém. Qual bug? Seja **curto**: uns 50 a 72 caracteres, e o detalhe vai no corpo. E, pela convenção mais comum, **minúscula e sem ponto final**.

Agora, um teste que vale mais que todas as regras juntas: **se você não consegue escolher um tipo, o commit está grande demais.** Um "mudei tudo" não tem tipo porque não é uma mudança: são várias, e elas deviam ser vários commits.

| Antes | Depois |
|---|---|
| `ajustes` | `fix(cli): mostra ajuda quando nenhum comando é passado` |
| `agora vai!!!` | `fix(storage): cria pasta dados se não existir` |
| `update readme` | `docs(readme): adiciona exemplos de uso` |
| `mudei tudo` | `refactor: separa regras em tarefas.ts` + `refactor: separa leitura em storage.ts` + `test: adiciona testes das regras` |

Repare na última linha. O padrão não te ensina só a escrever mensagens: ele te empurra a fazer **commits menores**, cada um com uma intenção só. E commits pequenos são mais fáceis de revisar, de entender e de desfazer.

## O porquê, no corpo

O diff mostra **o que** mudou, linha por linha. Mas só a mensagem pode contar **por que**:

```text
fix(storage): grava tarefas com escrita atômica

Se o processo era interrompido no meio do writeFile, o tarefas.json
ficava pela metade e o programa não abria mais. Agora grava num
arquivo .tmp e renomeia, que é instantâneo.

Closes #18
```

Daqui a um ano, alguém (muito provavelmente você) vai olhar esse código e pensar: "por que diabos tem um `.tmp` aqui? Dá pra simplificar". O corpo do commit responde, e impede que alguém traga o bug de volta. E o `Closes #18` no fim fecha a issue 18 no GitHub automaticamente quando o commit chega na `main`.

## Quando a mudança quebra quem usa

Às vezes uma mudança **quebra a compatibilidade**: quem usava a versão antiga vai precisar mudar alguma coisa. Isso se marca com um `!` depois do tipo, ou com um `BREAKING CHANGE:` no rodapé:

```text
feat(storage)!: salva tarefas em objeto com campo versao

BREAKING CHANGE: arquivos tarefas.json do formato antigo (array puro)
não são mais lidos. Rode `tarefas migrar` para converter.
```

Isso faz a versão subir o **MAJOR**: de 1.x pra 2.0. E o rodapé avisa exatamente o que quem usa precisa fazer.

E é aqui que dá pra ver o que o padrão destrava. Com as mensagens seguindo uma estrutura, um `git log --oneline --grep "^feat"` lista tudo o que foi adicionado no projeto. Ferramentas como o **release-please** e o **semantic-release** leem os commits desde a última versão e decidem sozinhas: teve `feat!`? Sobe o major. Teve só `feat`? Sobe o minor. Só `fix`? Sobe o patch. E ainda escrevem o changelog. Um [[Git Hooks|hook]] com o `commitlint` pode até recusar um commit cuja mensagem não segue o padrão.

Sobre o idioma: em projetos públicos e times internacionais, a mensagem vai em **inglês** (`feat: add priority filter`). Neste vault e em projetos pessoais, português serve muito bem. O que importa é ser **consistente** dentro de um mesmo repositório. E se quiser treinar o inglês junto, a nota [[Inglês em Commits, Issues e PRs]] é pra isso.

## O essencial

1. O formato é `tipo(escopo): descrição`. Só a primeira linha é obrigatória.
2. `feat` é algo novo (sobe o MINOR); `fix` corrige o que existia (sobe o PATCH).
3. Descrição no imperativo, específica, curta: o que o commit faz.
4. Não consegue escolher um tipo? O commit está grande demais.
5. O corpo conta o porquê. `!` ou `BREAKING CHANGE:` sobe o MAJOR.

## Agora é com você

Treine até ficar automático. Abra o `git log --oneline` de um projeto seu, e reescreva no papel as últimas dez mensagens seguindo o padrão (é um exercício revelador: você vai perceber quais commits tinham várias mudanças misturadas). Depois, nos seus próximos dez commits de verdade, use o padrão, com escopo quando fizer sentido, e escreva pelo menos um com corpo explicando o porquê. No fim, rode `git log --oneline --grep "^feat"` e `--grep "^fix"`, e veja o resumo do projeto aparecer. Você terminou quando os seus últimos dez commits seguirem o padrão, cada um com um tipo só.

Daqui, siga pros [[Git Hooks]], que podem validar a mensagem automaticamente, pro [[Inglês em Commits, Issues e PRs]], e pro [[GitHub Actions]].

---

## 🧠 Me teste

> [!question]- Qual o formato de um Conventional Commit?
> `tipo(escopo opcional): descrição`, com corpo e rodapé opcionais.

> [!question]- Qual a diferença entre `feat` e `fix`?
> `feat` adiciona uma funcionalidade nova (sobe o MINOR); `fix` corrige um bug (sobe o PATCH).

> [!question]- Como marcar uma mudança que quebra compatibilidade?
> Com `!` depois do tipo (`feat!:`) ou `BREAKING CHANGE:` no rodapé. Sobe o MAJOR.

> [!question]- Uma refatoração sem mudar comportamento usa qual tipo?
> `refactor`.

> [!question]- O que vai no corpo do commit?
> O porquê da mudança e o contexto que o diff não mostra.

> [!question]- O que quer dizer não conseguir escolher um tipo pro commit?
> Que ele está grande demais: tem várias mudanças misturadas, que deviam ser commits separados.

> [!question]- Por que a descrição vai no imperativo?
> Porque descreve o que o commit faz quando aplicado ("adiciona filtro"), lendo como uma ordem; é a convenção do próprio Git.

> [!question]+ Você trocou um `for` por `map` sem mudar o resultado. Qual tipo de commit?
> - a) `feat`
> - b) `fix`
> - c) `refactor`
> - d) `chore`
>
> > [!check]- Resposta
> > **c)** `refactor` muda o código sem mudar o comportamento. `feat` = algo novo pro usuário, `fix` = correção de bug, `chore` = manutenção que não é código do produto (deps, config).

---

## Pra consultar depois

| Tipo | Uso |
|---|---|
| `feat:` | Novidade (MINOR) |
| `fix:` | Correção (PATCH) |
| `docs:` | Documentação |
| `refactor:` | Estrutura, sem mudar o comportamento |
| `test:` | Testes |
| `build:` / `ci:` | Dependências / pipeline |
| `chore:` | Manutenção |
| `tipo!:` | Quebra compatibilidade (MAJOR) |
| `Closes #12` | Fecha a issue no merge |

**Pra ler:** a [especificação oficial](https://www.conventionalcommits.org/pt-br/v1.0.0/) está em português e é curta, dá pra ler em dez minutos. O artigo [How to Write a Git Commit Message](https://cbea.ms/git-commit/), de Chris Beams, é o clássico sobre o assunto, com as sete regras de uma boa mensagem e o porquê de cada uma. E o [commitlint](https://commitlint.js.org/) é a ferramenta que valida a mensagem automaticamente.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

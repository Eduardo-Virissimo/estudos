
# 📚 Estudo e Revisões

Este repositório é onde eu guardo meus estudos e revisões. 😁  
_Ainda está crescendo: estou escrevendo aos poucos, estágio por estágio._

## 🗂️ Como está organizado

| Área | O que tem | Comece por |
|---|---|---|
| 💻 **Programação** | Roadmap em 8 estágios, do primeiro terminal até IA. Os Estágios 1 e 2 estão escritos por inteiro. | [[Roadmap]] |
| 🇺🇸 **Inglês** | Método, técnicas, nível A1–A2 completo e inglês para programação | [[Inglês]] |
| 💡 **Ideias de Projetos** | Os projetos de cada estágio e outras ideias pro portfólio | [[Gerenciador de Tarefas no Terminal]] |
| 📓 **Diário** | Um dia por nota (`YYYY-MM-DD.md`): o que estudei e quanto tempo | botão *Iniciar sessão* da Ficha |
| 🧩 **Templates** | O modelo de nota de estudo e o do diário | [Template](Templates/Template.md) |
| 🧰 **Configs** | Backup do Obsidian e do plugin, pra restaurar ao formatar o PC | [[Configs/README\|Configs]] |
| ⚙️ **.sistema** | Código do plugin *Estudos RPG* e os documentos de projeto (`specs/`) | `.sistema/estudos-rpg/README.md` |
| 🕸️ **graphify-out** | Mapa de conhecimento do vault gerado pelo graphify | `graphify-out/graph.html` |

Cada área tem uma **trilha** (uma nota com `tipo: trilha`) que vira uma aba no mapa da Ficha do herói. As notas de Programação ficam em `Programação/NN - Seção/<Tópico>/<Tópico>.md`, e as de Inglês em `Inglês/NN - Seção/<Tópico>.md`.

## 🔁 Como eu estudo aqui

O método segue o que a pesquisa sobre aprendizagem mostra que funciona:

1. **Abro a Ficha do herói** (plugin *Estudos RPG*, abre sozinho) e clico em **Iniciar sessão**: o cronômetro registra o tempo no diário.
2. **Pego o próximo tópico** no painel *Próximos passos*. Os tópicos estão em ordem: cada um usa o anterior.
3. **Leio a nota como um capítulo**, de cima a baixo. Ela mesma diz o que é mais importante ("se esquecer tudo, lembre disto"), e o **O essencial** no fim resume em 3 a 5 itens.
4. **Faço o desafio** (*aprender fazendo*): o **Agora é com você** no fim da nota. Em Programação, ele costuma construir uma peça do projeto do estágio. Travou? Volto no trecho e tento de novo.
5. **Me testo sem olhar** (*recuperação ativa*): as perguntas do **🧠 Me teste** aparecem no painel **Revisar**, uma nota por vez.
6. **Revejo no tempo certo** (*repetição espaçada*): "Lembrei" afasta a próxima revisão (3 → 7 → 14 → 30 → 60 dias); "Esqueci" traz de volta amanhã. Entram no máximo 10 notas novas por dia, pra fila não virar uma parede.
7. **Explico com as minhas palavras** (*técnica Feynman*): o **Minhas anotações** no fim da nota, com "o que eu entendi" e "onde eu travei".
8. **Intercalo**: um tópico de Programação e um de Inglês na mesma semana fixam mais que um bloco só.
9. **Subo o nível**: 📝 escrito → 🔨 praticado → 🚀 usado em projeto (propriedade `nivel`).

### 📖 Como é uma nota

As notas são escritas como **capítulos de livro**, não como fichas: começam por uma cena ou um problema real, os títulos contam a história, o erro comum aparece no momento em que eu o cometeria, e um mesmo exemplo volta ao longo da nota. O exemplo pronto pra copiar o tom é a nota [[Bash]].

O que toda nota tem, nesta ordem:

| Parte | Pra quê |
|---|---|
| Texto do capítulo | Explicar, com o porquê antes do como |
| **O essencial** | 3 a 5 ideias pra guardar |
| **Agora é com você** | O desafio (e, quando faz sentido, um projeto), dizendo onde fazer |
| **🧠 Me teste** | Perguntas abertas + 1 ou 2 de múltipla escolha. A Ficha lê daqui. |
| **Pra consultar depois** | Tabela de consulta (quando o assunto tem sintaxe) e 2 a 4 leituras com o porquê de cada uma |
| **Minhas anotações** | O que eu entendi e onde travei, com as minhas palavras |

As notas de gramática e vocabulário de Inglês têm, além disso, uma seção **🏋️ Exercícios** com o gabarito escondido.

## ➕ Como adicionar conteúdo

| Quero… | Faço… |
|---|---|
| Uma nota de estudo nova | Crio a partir do [Template](Templates/Template.md) (já vem com `nivel: escrito` e as instruções de escrita num comentário `%% %%`, que some no modo leitura). O nome do arquivo é o nome do tópico (ex.: `Git Básico.md`), pra os links `[[Git Básico]]` funcionarem. |
| Uma trilha nova (Matemática, Design…) | Nota com `tipo: trilha`. Títulos `#` viram estágios, `##` viram módulos, e cada `- [ ] [[Nota]] — descrição` vira um tópico. |
| Uma pergunta pra revisão | Callout `> [!question]- Pergunta` com a resposta na linha `> …` de baixo, dentro do 🧠 Me teste. |
| Uma pergunta de múltipla escolha | Callout `> [!question]+` com as alternativas `> - a) …` e a resposta num callout aninhado `> > [!check]- Resposta` começando pela letra (`> > **b)** …`). Só 1 ou 2 por nota, nas pegadinhas, com a letra certa variando: ver o template. |
| Exercícios com gabarito (Inglês) | Seção `## 🏋️ Exercícios` e o gabarito em `> [!success]- Gabarito`. Nunca `[!question]`, que a Ficha leria como pergunta de revisão. |
| Um desafio ou projeto | No **Agora é com você**, em texto corrido, dizendo onde fazer com um dos símbolos da regra abaixo (📁, 🧪 ou 📦). |

## 📍 Onde fazer os desafios e projetos

Nem todo exercício cabe no vault, e nem todo merece um repositório no GitHub. Cada **Agora é com você** diz onde fazer, com um destes símbolos:

| Onde | Quando | Exemplos |
|---|---|---|
| 📁 **No vault**: `Programação/Práticas/<Nome da nota>/` | Exercício de 1 sessão, poucos arquivos, que roda com `npx tsx arquivo.ts`. Fica versionado junto com o estudo. A pasta é criada no primeiro desafio. | biblioteca de funções de texto, Jogo da Vida, script de Bash |
| 🧪 **Laboratório**: `~/lab/<nome>` (fora do vault, sem GitHub) | Precisa de **`git init` próprio**, de **`npm init`/`npm install` só dele**, de **Docker**, ou é pra quebrar de propósito. Apague quando terminar. | conflitos de merge, `reset --hard`, ESLint do zero, compose com Mongo |
| 📦 **Repositório próprio no GitHub** | Algo que você vai **usar** ou **evoluir** em várias sessões, que **outras notas continuam**, ou que entra no **portfólio**. README, `.gitignore` e commits no padrão desde o primeiro arquivo. | os projetos dos estágios ([[Gerenciador de Tarefas no Terminal\|tarefas]], [[Estruturas de Dados do Zero\|estruturas-do-zero]]), tudo de *Ideias de Projetos* |
| 🧰 **Onde a ferramenta mora** | Não gera código pra guardar: navegador, app, configuração do sistema, ou um script que serve o próprio vault (`.sistema/scripts/`). | DevTools, Postman, `~/.ssh`, `$PROFILE` |

**Por que não tudo no vault:** um `git init` dentro do vault cria um repositório dentro de outro, e o Git e o backup automático do Obsidian se perdem; `node_modules` e volumes do Docker dentro do OneDrive deixam a sincronização lenta. **Por que não um repo pra cada exercício:** 50 repositórios de 20 minutos poluem o GitHub e escondem os projetos que importam.

**Na dúvida:** comece no 📁 vault. Se crescer (ganhou dependências próprias, você quer usar no dia a dia, outra nota vai continuar dele), **promova** pra 📦 repo próprio: crie o repositório e leve o código. É o caminho do núcleo do gerenciador: as regras nascem como funções puras no desafio de [[Funções]] e viram o repo `tarefas` em [[Configurando um Projeto TypeScript]].

Detalhes e o código do plugin: `.sistema/estudos-rpg/README.md`.

## 📈 Objetivo

Organizar e documentar o meu progresso nos estudos. Com o tempo, a ideia é que este repositório seja uma referência tanto para mim quanto para outras pessoas que compartilham dos mesmos interesses.

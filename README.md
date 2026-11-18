
# 📚 Estudo e Revisões

Este repositório é onde eu guardo meus estudos e revisões. 😁  
_Não está tudo aqui ainda — nem 10%! Estou organizando aos poucos._

## 🗂️ Como está organizado

| Área | O que tem | Comece por |
|---|---|---|
| 💻 **Programação** | Roadmap em 8 estágios, do primeiro terminal até IA | [[Roadmap]] |
| 🇺🇸 **Inglês** | Método, técnicas e níveis A1 → B2+, mais inglês para programação | [[Inglês]] |
| 📓 **Diário** | Um dia por nota (`YYYY-MM-DD.md`): o que estudei e quanto tempo | botão *Iniciar sessão* da Ficha |
| 🧩 **Templates** | O modelo de nota de estudo e o do diário | [Template](Templates/Template.md) |
| 🧰 **Configs** | Backup do Obsidian e do plugin | [[Configs/README\|Configs]] |

Cada área tem uma **trilha** (uma nota com `tipo: trilha`) que vira uma aba no mapa da Ficha do herói.

## 🔁 Como eu estudo aqui

O método segue o que a pesquisa sobre aprendizagem mostra que funciona:

1. **Abro a Ficha do herói** (plugin *Estudos RPG*, abre sozinho) e clico em **Iniciar sessão**: o cronômetro registra o tempo no diário.
2. **Pego o próximo tópico** no painel *Próximos passos*. Os tópicos estão em ordem: cada um usa o anterior.
3. **Leio o resumo e os tópicos 🔴**: o resumo no topo diz do que se trata e lista o que é essencial. Os 🔴 eu domino antes de seguir; o resto leio no ritmo (legenda abaixo).
4. **Pratico** (*aprender fazendo*): o 🔨 *Pratique* e, quando a nota tem, o 🚀 *Projeto*. Travou? Volto no tópico e tento de novo.
5. **Me testo sem olhar** (*recuperação ativa*): as perguntas 🧠 *Me teste* aparecem no painel **Revisar**, uma nota por vez.
6. **Revejo no tempo certo** (*repetição espaçada*): "Lembrei" afasta a próxima revisão (1 → 3 → 7 → 14 → 30 → 60 dias); "Esqueci" traz de volta amanhã.
7. **Explico com as minhas palavras** (*técnica Feynman*): o 📓 *Diário* no fim da nota, em duas linhas.
8. **Intercalo**: um tópico de Programação e um de Inglês na mesma semana fixam mais que um bloco só.
9. **Subo o nível**: 📝 escrito → 🔨 praticado → 🚀 usado em projeto (propriedade `nivel`).

### 🚦 O que cada selo quer dizer

Cada tópico de uma nota tem um selo no título, pra eu saber onde pôr energia:

| Selo | Quer dizer | Como estudo |
|---|---|---|
| 🔴 | **Tem que saber** | Leio com calma, faço o exemplo, e só sigo quando consigo explicar sem olhar. É o que cai no Me teste. |
| 🟡 | **Bom saber** | Leio e entendo a ideia. Não preciso decorar: volto quando aparecer no código. |
| ⚪ | **Só conhecer** | Só saber que existe e o nome, pra reconhecer quando esbarrar. |

Fora os tópicos, toda nota tem o **Resumo** no topo e o **🧠 Me teste**. As outras seções (🔨 Pratique, 🚀 Projeto, 📋 Consulta rápida, 📚 Pra ir além, 📓 Diário) só aparecem quando o assunto pede.

## ➕ Como adicionar conteúdo

| Quero… | Faço… |
|---|---|
| Uma nota de estudo nova | Crio a partir do [Template](Templates/Template.md) (já vem com `nivel: escrito` e as instruções de escrita num comentário `%% %%`, que some no modo leitura). O nome do arquivo é o nome do tópico (ex.: `Git Básico.md`), pra os links `[[Git Básico]]` funcionarem. |
| Uma trilha nova (Matemática, Design…) | Nota com `tipo: trilha`. Títulos `#` viram estágios, `##` viram módulos, e cada `- [ ] [[Nota]] — descrição` vira um tópico. |
| Uma pergunta pra revisão | Callout `> [!question]- Pergunta` com a resposta na linha `> …` de baixo, dentro da nota. |
| Uma pergunta de múltipla escolha | Callout `> [!question]+` com as alternativas `> - a) …` e a resposta num callout aninhado `> > [!check]- Resposta` começando pela letra (`> > **b)** …`). Só 1 ou 2 por nota, nas pegadinhas: ver o template. |
| Um desafio ou projeto | Logo abaixo do título 🔨 *Pratique* / 🚀 *Projeto*, uma linha **📍 Onde fazer:** com o lugar, escolhido pela regra abaixo. |

## 📍 Onde fazer os desafios e projetos

Nem todo exercício cabe no vault, e nem todo merece um repositório no GitHub. Cada 🔨 *Pratique* e 🚀 *Projeto* diz onde fazer, numa linha **📍 Onde fazer:**. A regra:

| Onde | Quando | Exemplos |
|---|---|---|
| 📁 **No vault**: `Programação/Práticas/<Nome da nota>/` | Exercício de 1 sessão, poucos arquivos, que roda com o que o [`Práticas/`](Programação/Práticas/README.md) já tem (TypeScript + `tsx`). Fica versionado junto com o estudo. | quiz no terminal, conversor de temperatura, classe `Cronometro`, script de Bash |
| 🧪 **Laboratório**: `~/lab/<nome>` (fora do vault, sem GitHub) | Precisa de **`git init` próprio**, de **`npm init`/`npm install` só dele**, de **Docker**, ou é pra quebrar de propósito. Apague quando terminar. | conflitos de merge, `reset --hard`, ESLint do zero, compose com Mongo |
| 📦 **Repositório próprio no GitHub** | Algo que você vai **usar** ou **evoluir** em várias sessões, que **outras notas continuam**, ou que entra no **portfólio**. README, `.gitignore` e commits no padrão desde o primeiro arquivo. | [[Gerenciador de Tarefas no Terminal\|tarefas]], `modelo-ts`, `kit-js`, tudo de *Ideias de Projetos* |
| 🧰 **Onde a ferramenta mora** | Não gera código pra guardar: navegador, app, configuração do sistema, ou um script que serve o próprio vault (`.sistema/scripts/`). | DevTools, Postman, `~/.ssh`, `$PROFILE` |

**Por que não tudo no vault:** um `git init` dentro do vault cria um repositório dentro de outro, e o Git e o backup automático do Obsidian se perdem; `node_modules` e volumes do Docker dentro do OneDrive deixam a sincronização lenta. **Por que não um repo pra cada exercício:** 50 repositórios de 20 minutos poluem o GitHub e escondem os projetos que importam.

**Na dúvida:** comece no 📁 vault. Se crescer (ganhou dependências próprias, você quer usar no dia a dia, outra nota vai continuar dele), **promova** pra 📦 repo próprio: crie o repositório e leve o código. É o caminho do núcleo do gerenciador: nasce em `Práticas/` no projeto de [[Funções]] e vira o repo `tarefas` em [[Configurando um Projeto TypeScript]].

Detalhes e o código do plugin: `.sistema/estudos-rpg/README.md`.

## 📈 Objetivo

Organizar e documentar o meu progresso nos estudos. Com o tempo, a ideia é que este repositório seja uma referência tanto para mim quanto para outras pessoas que compartilham dos mesmos interesses.

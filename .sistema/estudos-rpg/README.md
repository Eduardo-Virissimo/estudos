# Estudos RPG: plugin do Obsidian

Transforma o vault de estudos numa **ficha de RPG**: nível e XP, missões, revisão espaçada, treino misto, calendário, mapa das trilhas e troféus. Tudo é calculado a partir das suas notas: não existe banco de dados separado que possa dessincronizar.

## Como o plugin descobre o conteúdo (sem nada fixo no código)

| Você cria… | Com a propriedade… | Vira… |
|---|---|---|
| Qualquer nota de estudo | `nivel: escrito` / `praticado` / `projeto` | Entra no XP, na revisão espaçada e no oráculo (se tiver perguntas) |
| Uma nota de trilha (ex.: Roadmap, Inglês, Matemática) | `tipo: trilha` (e opcional `nome: …`) | Um **reino** no mapa. Cada `#`/`##` vira uma região; cada `- [ ] [[Nota]] — descrição` vira um tópico |
| Uma nota de projeto com fases | `tipo: missao` (opcional `prioridade`, `ativa: false`) | Uma **missão**. `## Fase N: título`, `**Entrega:** …` e `- [ ] tarefas` |
| Uma nota `YYYY-MM-DD.md` na pasta do diário | (opcional `minutos`) | Um dia na crônica e na sequência 🔥 |
| Um callout `> [!question]- Pergunta` com `> resposta` | em uma nota de estudo | Uma pergunta do oráculo e do treino misto |

E se…
- **…eu criar uma trilha de Inglês?** Nota nova com `tipo: trilha`. Ela aparece no mapa sozinha.
- **…eu renomear ou mover uma nota?** O plugin ouve os eventos do vault e relê tudo (com *debounce*).
- **…uma nota da trilha ainda não existir?** O tópico aparece como "sem nota"; clicar cria a nota.
- **…a propriedade estiver errada** (`caixa: abc`, data inválida)? É ignorada com segurança.
- **…eu editar a trilha enquanto a ficha está aberta?** Marcar um tópico confere se a linha ainda é a mesma antes de gravar.
- **…virar o dia com o Obsidian aberto?** A cada minuto o plugin confere a data e recalcula.
- **…o template do diário sumir?** Ele cria o diário com um modelo mínimo.
- **…o vault estiver vazio?** Cada seção mostra o que criar para começar.

Tudo que poderia ser "fixo" (pastas, XP, intervalos, títulos) está em **Configurações → Estudos RPG**.

## Estrutura do código

```
src/
  main.ts            ponto de entrada: eventos, comandos, barra de status, avisos de XP
  settings.ts        configurações + valores padrão
  domain/            REGRAS DO JOGO (TypeScript puro, sem Obsidian → testável)
    types.ts           tipos dos dados
    parse.ts           lê trilhas, missões e perguntas do Markdown
    dates.ts           datas YYYY-MM-DD no fuso local
    review.ts          revisão espaçada (Leitner)
    quiz.ts            treino misto intercalado
    progress.ts        XP, nível, sequência, habilidades e conquistas
  vault/             CONVERSA COM O OBSIDIAN
    indexer.ts         descobre as notas e monta o Snapshot
    writer.ts          toda escrita no vault (segura)
  ui/                INTERFACE
    view.ts            a aba "Ficha do herói" e suas ações
    sections.ts        cada seção da ficha (ficha, missão, oráculo, revisão, crônica, mapa, troféus)
    dom.ts             botões, painéis, barras
    settingsTab.ts     tela de configurações
test/domain.test.ts  testes das regras do jogo
styles.css           tema fantasia clássica
```

Fluxo: **vault muda → `Indexer` monta um `Snapshot` → `progress.ts` calcula XP/conquistas → a view redesenha.**

### Adicionar uma conquista
Uma linha em `CONQUISTAS` (`src/domain/progress.ts`): id, ícone ([lucide](https://lucide.dev/icons)), nome, descrição e o teste.

### Adicionar uma seção na ficha
Escreva uma função em `src/ui/sections.ts` e chame em `FichaView.desenhar()` (`src/ui/view.ts`).

## Desenvolvimento

Precisa de **Node.js 22+**.

```powershell
cd "estudos/.sistema/estudos-rpg"
npm install        # uma vez
npm run dev        # recompila e instala a cada mudança (recarregue o plugin no Obsidian)
npm run build      # typecheck + testes + build + instala em .obsidian/plugins/estudos-rpg
npm test           # só os testes
```

O build instala direto em `<vault>/.obsidian/plugins/estudos-rpg`. Vault em outro lugar? `$env:OBSIDIAN_VAULT = "C:\caminho\do\vault"` antes do build.

Depois de recompilar: `Ctrl+P` → *Reload app without saving* (ou desligue e ligue o plugin).

A pasta começa com `.` de propósito: o Obsidian ignora pastas ocultas, então o `node_modules` não aparece no vault.

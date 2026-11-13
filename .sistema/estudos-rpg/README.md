# Estudos RPG: plugin do Obsidian

Transforma o vault de estudos numa **ficha de RPG**: nível e XP, cronômetro de sessão, próximos passos por trilha, revisão espaçada com as perguntas das notas, calendário, mapa das trilhas e conquistas. Tudo é calculado a partir das suas notas: não existe banco de dados separado que possa dessincronizar.

## Como o plugin descobre o conteúdo (sem nada fixo no código)

| Você cria… | Com a propriedade… | Vira… |
|---|---|---|
| Qualquer nota de estudo | `nivel: escrito` / `praticado` / `projeto` | Entra no XP e na revisão espaçada |
| Uma nota de trilha (ex.: Roadmap, Inglês, Matemática) | `tipo: trilha` (e opcional `nome: …`) | Uma **aba** no mapa e uma linha em *Próximos passos*. `#` = estágio (agrupa), `##` = região/módulo, cada `- [ ] [[Nota]] — descrição` = um tópico. Sem `##`, cada `#` vira uma região. |
| Uma nota `YYYY-MM-DD.md` na pasta do diário | `minutos` > 0 (o cronômetro preenche sozinho) | Um dia no calendário, na sequência 🔥 e XP a cada 10 min |
| Um callout `> [!question]- Pergunta` com `> resposta` | em uma nota de estudo | Uma pergunta que aparece quando a nota cai na **revisão** |

**Sessão de estudo:** o botão *Iniciar sessão* (topo da ficha, ou `Ctrl+P` → *Iniciar/encerrar a sessão de estudo*) cronometra; *Encerrar* soma os minutos no diário do dia. O cronômetro sobrevive a fechar o Obsidian. Abrir o diário sem estudar não conta.

**Conquistas** são calculadas das notas, mas as de sequência usam o **recorde** de dias seguidos: perder a chama não tira troféu. Clique nas medalhas para ver o progresso de cada uma.

E se…
- **…eu criar uma trilha de Inglês?** Nota nova com `tipo: trilha`. Ela aparece no mapa sozinha.
- **…eu renomear ou mover uma nota?** O plugin ouve os eventos do vault e relê tudo (com *debounce*).
- **…uma nota da trilha ainda não existir?** O tópico aparece como "sem nota"; clicar cria a nota.
- **…a propriedade estiver errada** (`caixa: abc`, data inválida)? É ignorada com segurança.
- **…eu editar a trilha enquanto a ficha está aberta?** Marcar um tópico confere se a linha ainda é a mesma antes de gravar.
- **…virar o dia com o Obsidian aberto?** A cada minuto o plugin confere a data e recalcula.
- **…esquecer o cronômetro ligado?** Conta no máximo o limite de sessão (Configurações) e avisa.
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
    parse.ts           lê trilhas (estágios e regiões) e perguntas do Markdown
    dates.ts           datas YYYY-MM-DD no fuso local
    review.ts          revisão espaçada (Leitner)
    progress.ts        XP, nível, sequência, habilidades e conquistas
  vault/             CONVERSA COM O OBSIDIAN
    indexer.ts         descobre as notas e monta o Snapshot
    writer.ts          toda escrita no vault (segura)
  ui/                INTERFACE
    view.ts            a aba "Ficha do herói" e suas ações
    sections.ts        cada seção da ficha (topo + sessão, próximos passos, revisão, atividade, trilhas em abas)
    topicosModal.ts    janela com os tópicos de uma região e a busca
    conquistasModal.ts janela com todas as conquistas e o progresso
    dom.ts             botões, painéis, barras
    pixel.ts           ícones em pixel art 9×9 (desenhe com "#" e ".")
    settingsTab.ts     tela de configurações
test/domain.test.ts  testes das regras do jogo
styles.css           tema "pixel moderno" (paleta de console, fonte Jersey 15)
```

Fluxo: **vault muda → `Indexer` monta um `Snapshot` → `progress.ts` calcula XP/conquistas → a view redesenha.**

### Adicionar uma conquista
Uma linha em `CONQUISTAS` (`src/domain/progress.ts`): id, ícone (um nome de `src/ui/pixel.ts`; se não existir lá, usa o [lucide](https://lucide.dev/icons)), nome, descrição e `progresso` (devolve `[atual, meta]`).

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

O build instala direto em `<vault>/.obsidian/plugins/estudos-rpg` **e** no backup do repositório (`estudos/Configs/obsidian/plugins/estudos-rpg`), então a versão compilada sempre vai pro Git. Vault em outro lugar? `$env:OBSIDIAN_VAULT = "C:\caminho\do\vault"` antes do build.

Depois de recompilar: `Ctrl+P` → *Reload app without saving* (ou desligue e ligue o plugin).

A pasta começa com `.` de propósito: o Obsidian ignora pastas ocultas, então o `node_modules` não aparece no vault.

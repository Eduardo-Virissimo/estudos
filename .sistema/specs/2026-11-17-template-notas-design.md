# Template novo das notas de estudo — design

## Por quê

O template atual é engessado: força as mesmas seções em toda nota, explica pouco (código + uma linha), tem burocracia repetida (Objetivos, avisos de "Como estudar" e "Nível", "Exemplo meu" vazio em 40 notas, Cola rápida que repete a nota) e não diz o que é essencial. O usuário quer:

- texto que **explica de verdade** (pode ser longo), com **resumo antes**;
- **prioridade clara**: o que tem que saber × o que basta conhecer;
- desafios e projetos **relevantes**;
- **recomendações** de vídeos, livros e afins sobre o assunto;
- estrutura que se adapta ao assunto, sem perder a didática.

**Anti-objetivos:** trocar um engessamento por outro; seção existindo "porque o template manda"; quebrar a Ficha do herói.

## Abordagens consideradas

- **A) Prioridade em cada tópico (escolhida).** Texto corrido por tópicos; cada título leva 🔴 / 🟡 / ⚪. Tópico fica inteiro num lugar só e o peso aparece durante a leitura. Custo: notas de tamanhos bem diferentes.
- B) Camadas (Essencial → Mais fundo → Pra conhecer). Bom pra pouco tempo, mas parte um mesmo assunto em pedaços.
- C) Sem template, só guia de escrita. Máxima liberdade, consistência fraca com o tempo.

## O desenho (A)

**Fixo em toda nota** (pouco, e só o que serve sempre):

1. Propriedades `nivel` e `revisado` (a Ficha do herói depende delas).
2. `# Título` + callout **Resumo**: o que é e por que importa em poucas linhas, e a lista dos tópicos 🔴 (com link). Uma linha "Antes, ajuda saber: [[...]]" só se houver pré-requisito real.
3. **O texto**, por tópicos, cada `##` com selo:
   - 🔴 **Tem que saber** — explicação completa: o porquê, uma analogia quando ajudar, exemplo, o que dá errado. Pegadinha mora **dentro** do tópico (callout `[!warning]`), não numa seção separada.
   - 🟡 **Bom saber** — explicado, mais curto.
   - ⚪ **Só conhecer** — 2 ou 3 linhas: o que é e quando você vai esbarrar nisso.
4. **🧠 Me teste** — perguntas abertas + 1 ou 2 de múltipla escolha (formato atual, que a Ficha lê).

**Opcional (só se o assunto pede):**

- **🔨 Pratique** — desafio(s) relevantes e/ou exercícios com gabarito (comum em inglês).
- **🚀 Projeto** — só quando construir algo maior ensina mais que o desafio; com **📍 Onde fazer**.
- **📋 Consulta rápida** — só em notas de comandos/sintaxe, onde uma tabela de consulta tem uso real.
- **📚 Pra ir além** — recomendações com uma linha dizendo **por que vale** e pra quem (🎥 vídeo, 📖 livro, 🌐 site/doc, 🎮 interativo). Só links verificados.
- **📓 Diário** — espaço pequeno no fim (o que entendi / onde travei).
- "Próximo passo: [[...]]" no fim, quando houver continuação natural.

**Sai:** Objetivos, avisos de "Como estudar" e "Nível" no topo, "Exemplo meu", bloco "Onde isso se encaixa" (vira as linhas de antes/próximo), Pegadinhas como seção separada.

**Onde mora a explicação das regras:** a legenda 🔴🟡⚪ e o "como estudar" ficam **uma vez** no README do vault, não repetidos em cada nota. As instruções de escrita no template ficam em comentários `%% ... %%` (somem no modo leitura).

## Escopo desta etapa

1. `Templates/Template.md` novo.
2. `README.md` do vault: legenda de prioridade e passos de estudo atualizados.
3. Reescrever **Funções** como nota de referência (mesmo conteúdo técnico, explicado de verdade, com selos, Pratique, Projeto, Me teste e Pra ir além).

Fica pra depois (outra etapa, ordem a combinar): reescrever as outras notas.

## Decisões minhas (pode corrigir)

- Emojis 🔴🟡⚪ no título em vez de tags/callouts: aparecem no sumário (outline) do Obsidian e não exigem nada da Ficha.
- Diário mantido, mas pequeno e opcional.
- Recomendações só com link checado; na dúvida, fica de fora.

---
version: 1
slug: "sistema-site"
primary_target: ".sistema/site"
related_targets: []
---

## Scope
Site de leitura do vault (todas as páginas geradas por `.sistema/site/build.ts`: capa, notas, folha do sumário). Mode: Read. Só celular.

## Audience and job
O dono do vault, no celular: ler nota inteira, revisar perguntas, consultar pela busca, seguir a trilha.

## Direction contract
THESIS: Cada caderno é uma coleção de livros de bolso com cor própria e cada nota é um capítulo; recusa o "site de docs branco com links azuis" e o caderno pautado à caneta já rejeitado.
OWN-WORLD: Papel quase branco (#fbfaf7; à noite, grafite quente), tinta quase preta. Faixas de cor chapada por coleção (Programação azul Pelican, Inglês verde, Diário laranja), cor vinda do site.config.json. Fios finos pretos, versalete espaçado em sans. Texto em Source Serif 4, interface e títulos em Source Sans 3. Sem sombras, sem cantos arredondados: papel impresso.
STORY: O leitor sabe em que coleção e capítulo está, lê em paz, testa-se nas perguntas e passa ao próximo capítulo.
FIRST VIEWPORT: Faixa da coleção (56px) com "Estudos" e o botão Sumário; abaixo, "capa" do capítulo centrada: série em versalete na cor, fio curto, título em sans 700 ~40px, linha "Capítulo N de M · X min"; fio grosso da cor fecha a capa; então a coluna em serifa 18px.
FORM: Coleção de livros de bolso (Penguin/Pelican), posição 5 da lista ordenada; seed:cd42be5ed7ed0939. Assinatura: a faixa de cor chapada da coleção, que reaparece no número das seções, na borda do código, nas fichas de pergunta e na capa do site como lombadas.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Raises
- Identidade Gerativa: cor de cada caderno vem do config.
- Bancada de Montagem: "onde você parou" é uma marca (fitinha) no sumário.
- Capa de Fita K7: contagens e minutos alinhados à direita, tabulares.
- Campo de Dados: algarismos tabulares, um só ritmo de grade.

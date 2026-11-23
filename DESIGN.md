---
name: Estudos
description: Coleção de livros de bolso do vault, feita pra ler no celular.
colors:
  papel: "#fbfaf7"
  folha: "#ffffff"
  tinta: "#1b1b1b"
  tinta-2: "#5c5a55"
  fio: "#dcd8cf"
  codigo: "#f1eee7"
  sobre-serie: "#ffffff"
  serie-programacao: "#1f5c99"
  serie-ingles: "#0f7a55"
  serie-diario: "#b5501a"
  serie-neutra: "#1b1b1b"
  f-dica: "#0d6e66"
  f-atencao: "#9a5a00"
  f-perigo: "#b3262f"
  h-palavra: "#7b2f9e"
  h-texto: "#2a6a30"
  h-numero: "#a2480d"
  h-comentario: "#686459"
  h-funcao: "#1f5c99"
  h-tipo: "#8a5414"
typography:
  display:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  lombada:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Serif 4, Times New Roman, Times, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
  meta:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  label:
    fontFamily: "Source Sans 3, Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.1em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Code, Menlo, Consolas, monospace"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
spacing:
  lado: "16px"
  topo: "56px"
  coluna: "36rem"
  bloco: "18px"
  secao: "52px"
components:
  faixa-topo:
    backgroundColor: "{colors.serie-programacao}"
    textColor: "{colors.sobre-serie}"
    height: "56px"
    padding: "0 16px"
  faixa-topo-estante:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    height: "56px"
  botao-sumario:
    backgroundColor: "transparent"
    textColor: "{colors.sobre-serie}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  lombada:
    backgroundColor: "{colors.serie-programacao}"
    textColor: "{colors.sobre-serie}"
    typography: "{typography.lombada}"
    padding: "18px 16px 16px"
  proximo-capitulo:
    backgroundColor: "{colors.serie-programacao}"
    textColor: "{colors.sobre-serie}"
    padding: "22px 16px"
  ficha-pergunta:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  continuar-lendo:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "16px 52px 18px 16px"
  busca:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 14px"
---

# Design System: Estudos

## Overview

**Creative North Star: "A Coleção de Bolso"**

Cada caderno do vault é uma coleção de livros de bolso com cor própria, e cada nota é um capítulo. O papel é quase branco e a tinta quase preta; a única cor forte é a da coleção, aplicada chapada, sem gradiente, sem sombra, sem canto arredondado. É papel impresso numa tela de celular: uma coluna, texto em serifa de livro, interface e títulos em sans.

A cor da coleção não é decoração, é endereço. Ela fecha a faixa do topo, abre cada seção como um toco de faixa, borda o código, encima as fichas de pergunta e vira lombada na estante. O leitor sempre sabe em que coleção está sem ler nenhum rótulo. Fora disso, a estrutura é feita de fios finos (1px) e um ou outro fio grosso (3px) na cor da coleção.

Densidade de livro: margens laterais de 16px, corpo em 18px com entrelinha 1,65, seções arejadas. A interface some enquanto se lê; números (contagens, minutos, posição) são tabulares e discretos. O site é sempre claro: não existe modo escuro (pedido do usuário em 2026-11-19), e a página declara `color-scheme: only light` pro navegador não escurecer sozinho.

**Key Characteristics:**
- Cor chapada por coleção, vinda do `site.config.json`, como único acento.
- Sem sombras, sem cantos arredondados: tudo é retângulo impresso.
- Serifa (Source Serif 4) pro texto, sans (Source Sans 3) pra títulos e interface, mono (JetBrains Mono) pro código.
- Fios de 1px pra estrutura; fio de 3px na cor da coleção pra fechar ou encimar um bloco.
- Uma coluna de no máximo 36rem, pensada só pro celular.

## Colors

Papel e tinta neutros e quentes, mais uma cor de coleção por caderno; as cores semânticas e de sintaxe são contidas e só aparecem dentro do seu bloco.

### Primary
- **Azul Pelican** (serie-programacao): a coleção Programação. Faixa do topo, lombada, toco das seções, borda do código, próximo capítulo.
- **Verde Inglês** (serie-ingles): a coleção Inglês, mesmos papéis.
- **Laranja Diário** (serie-diario): a coleção Diário, mesmos papéis.

As três chegam ao CSS como `--serie` num elemento `[data-serie]` (gerado em `assets/colecoes.css` a partir do config). Delas derivam três papéis: `--serie-fundo` (a cor pura, pra faixas e fios), `--serie-texto` (hoje a própria cor pura, pra texto e sublinhado) e `--serie-leve` (8% sobre o papel, pra fundos de resposta e toque). Fora de uma coleção, a série cai no **Neutro de Série** (serie-neutra). Uma coleção nova se acrescenta só no config; nenhuma cor de coleção vive no CSS.

### Secondary
- **Verde-Água Dica** (f-dica), **Âmbar Atenção** (f-atencao), **Vermelho Perigo** (f-perigo): cor dos boxes de dica, atenção e perigo. Tingem a borda (35% sobre o fio), o fundo (6% sobre o papel) e o rótulo do box. Os boxes "nota" e "resumo" usam a cor da coleção.

### Tertiary
- **Sintaxe** (h-palavra, h-texto, h-numero, h-comentario, h-funcao, h-tipo): realce de código, só dentro de `pre`. Comentário sempre em itálico.

### Neutral
- **Papel** (papel): fundo de tudo.
- **Folha** (folha): superfície um degrau acima do papel, pra fichas, "continuar lendo" e busca.
- **Tinta** (tinta): texto, fios curtos do título e do `hr`, fio grosso de cabeçalho de tabela.
- **Tinta Apagada** (tinta-2): meta, contagens, setas secundárias, citações, seções em branco.
- **Fio** (fio): divisórias de 1px, bordas de ficha e de busca, linhas de lista.
- **Papel de Código** (codigo): fundo de `pre` e de código em linha.
- **Sobre a Série** (sobre-serie): texto e progresso sobre faixa colorida.

### Named Rules
**The Cor É Endereço Rule.** A cor da coleção só aparece chapada, em faixas, tocos, fios e marcadores; ela diz onde você está. Nunca vira gradiente, sombra ou fundo de parágrafo (o único tom leve é `--serie-leve`, pra resposta revelada e toque).

**The Estante Neutra Rule.** Na capa do site a faixa do topo é tinta, não cor: as cores ficam pras lombadas de cada caderno.

## Typography

**Display Font:** Source Sans 3 (com Arial, Helvetica)
**Body Font:** Source Serif 4 com tamanho óptico automático (com Times New Roman, Times)
**Label/Mono Font:** JetBrains Mono pro código (com ui-monospace, Cascadia Code, Menlo, Consolas), ligaduras desligadas

**Character:** Serifa de livro desenhada pra tela no texto corrido, sans firme e pesada (700) nos títulos e na interface: o par clássico de livro de estudo, Times + Arial, redesenhado.

### Hierarchy
- **Display** (700, 60px, 0,95, -0,035em): só o "Estudos" da capa do site.
- **Headline** (700, 38px, 1,08, -0,015em): título do capítulo, centrado, com `text-wrap: balance`, seguido de um fio curto de 44×1px em tinta.
- **Lombada** (700, 26px, 1,1): nome da coleção na faixa da estante.
- **Title** (700, 24px, 1,2): seções (h2) da nota; h3 em 20px/1,3, h4 em 18px/1,35; títulos de bloco da capa em 22px.
- **Body** (400, 18px, 1,65): texto corrido em serifa; dentro de fichas e boxes cai pra 17px. Negrito em 650.
- **Meta** (400, 15px, 1,45, tabular): linha sob o título ("seção · capítulo N de M · X min de leitura"), meta do próximo capítulo e do "continuar lendo".
- **Label** (700, 13px, 0,1em, maiúsculas): botões (Sumário), rótulos de box (Dica, Atenção), contagem da lombada (600). Sempre um rótulo funcional, nunca sobretítulo.
- **Code** (14,5px, 1,6 em bloco; 0,82em em linha).

### Named Rules
**The Serifa Lê, Sans Aponta Rule.** Tudo que se lê de ponta a ponta é serifa; tudo que se toca, se navega ou se conta é sans.

**The Número Tabular Rule.** Contagens, minutos e posição usam algarismos tabulares, em tinta apagada.

## Layout

Uma coluna só, pensada pro celular (capturas de referência em 390×844). Largura de leitura máxima de 36rem (coluna) mais 16px de cada lado (lado). A faixa do topo tem 56px (topo) mais a área segura, fica presa no alto e carrega uma barra de progresso de 3px na base. O `scroll-padding-top` compensa a faixa.

Elementos de cor sangram até a borda da tela com margem negativa igual ao lado: `pre`, lombada e próximo capítulo. O resto respeita o gutter de 16px.

Ritmo vertical: parágrafos e listas a 18px (bloco); seções abrem com 52px acima (secao) e 12px abaixo; h3 34px, h4 26px; capa do capítulo 36px em cima e 26px embaixo; `hr` vira fio curto de 44px com 44px de respiro. Alvos de toque têm no mínimo 44px (linhas da árvore), 52–56px nas listas principais.

O sumário é uma folha que sobe de baixo e cobre a tela; título, fechar e busca ficam presos no alto enquanto a árvore rola.

## Elevation & Depth

Plano. Não há sombra em nenhuma superfície. A profundidade vem de tons (papel → folha → código), de fios de 1px e de fios grossos na cor da coleção. A única `box-shadow` do sistema é um anel de foco de 1px na busca, que dobra a borda; não é elevação.

### Named Rules
**The Papel Impresso Rule.** Nada flutua. Se um bloco precisa se destacar, ele ganha fio, folha ou faixa de cor, nunca sombra.

## Shapes

Tudo é retângulo de canto vivo (0px), inclusive botões e campos. Formas recorrentes: a **faixa** chapada (topo, lombada, próximo capítulo), o **toco** de faixa (32×4px abrindo cada seção), o **quadrado** de cor (12px nas trilhas, 14px nos cadernos do sumário), o **fio curto** centrado (44×1px sob o título e no `hr`) e a **fitinha** de marcador de livro (retângulo com corte em V na ponta, por `clip-path`). As setas de abrir/fechar são um canto de borda de 7px girado; as setas de navegação e os ícones são SVG de traço 2px, pontas arredondadas.

## Components

### Faixa do topo
Faixa chapada da coleção, 56px, só nas notas. À esquerda, seta de voltar + nome da coleção (sans 700, 18px, alvo de 44px), que leva ao início. **Some ao descer a página e volta ao subir** (translateY, 0,22s, `cubic-bezier(0.16, 1, 0.3, 1)`): enquanto se lê, a tela é do texto. A capa do site não tem faixa.

### Fio de leitura
3px na cor da coleção, fixo no alto da tela (acima da faixa), cresce da esquerda conforme a leitura. Fica visível mesmo com a faixa escondida.

### Barra de ações (embaixo)
Fixa no rodapé, no alcance do polegar: folha com fio de 1px em cima, botões de 58px com ícone SVG de 20px sobre o rótulo em sans 600/13px. **Sumário** abre a folha; **Buscar** abre a folha já com o teclado na busca; **Revisar** (só em nota com perguntas, na cor da coleção) leva à primeira pergunta ainda não acertada e mostra o placar "1/9". O `main` reserva 96px embaixo pra barra.

### Botões
- **Shape:** canto vivo (0px), sem borda nos botões da barra; quadrados de 44–48px com borda de fio pra fechar e limpar.
- **Toque:** sem hover (só celular); `:active` clareia o fundo (branco a 16% sobre a faixa; `--serie-leve` no papel). Foco: contorno de 2px em `--serie-texto` a 2px de distância.

### Capa do capítulo
Título centrado (headline), fio curto de 44px em tinta, linha meta em tinta apagada com a seção sem o número da pasta, a posição na ordem de estudo e o tempo ("Fundamentos · capítulo 7 de 13 · 11 min de leitura"). Um fio de 3px na cor da coleção fecha a capa. Nota já lida ganha "· lida" em verde-dica no fim da meta.

### Neste capítulo (índice da nota)
Logo abaixo da capa, em nota com 3 ou mais seções (fora da trilha): linha recolhível de 52px, "Neste capítulo" em sans 700/16px, contagem "11 seções" tabular e seta de canto. Aberta, lista as h2 em linhas de 44px com fio em cima e um toco de 14×3px da coleção antes de cada título. Fio de 1px embaixo.

### Notas lidas
Uma nota conta como lida quando o fim dela entra na tela depois de o leitor rolar (guardado no aparelho, `estudos:lidas`). Na árvore, a nota lida leva um **visto** SVG de 16px na cor da coleção à direita (antes da fitinha, se as duas estiverem na linha); a seção com notas lidas troca a contagem por "6/13" na cor da coleção e ganha um **fio de 2px** embaixo da linha, do tamanho do que foi lido.

### Seções da nota
Cada h2 abre com um toco de faixa de 32×4px na cor da coleção, 14px acima do texto. Seções vazias do modelo (como "Minhas anotações" em branco) **não aparecem**: o gerador as tira antes de montar a página.

### Código e tabelas
O bloco (`figure.codigo`) sangra até a borda, fundo de papel de código, fio de 2px na cor da coleção em cima, 16px de respiro; 13,5px em telas até 380px. A **etiqueta da linguagem** (TypeScript, Terminal, JSON…) fica pendurada sobre o fio, como aba de pasta: faixa da coleção, label 700/11,5px em versalete. Bloco sem linguagem ou `text` não tem etiqueta. Código e tabelas largos ganham **sombra na borda** enquanto ainda há conteúdo pra rolar pro lado (gradientes `local`/`scroll`), que some ao chegar no fim. Código em linha tem fundo de papel de código e quebra em qualquer ponto.

### Fichas de pergunta (signature)
Um padrão só pra pergunta aberta e de múltipla escolha. Perguntas seguidas formam **uma folha de exercícios**: folha com borda de fio, fio de 3px da coleção só em cima da primeira e fio de 1px entre elas. Cada pergunta tem o **número num quadrado** de 30px (borda de 1,5px e número na cor da coleção) à esquerda; texto recuado 60px. A pergunta fica sempre à vista (sans 600/18px); alternativas logo abaixo em 17px. Embaixo, no alcance do polegar, a linha **"Ver resposta"** de 48px alinhada ao texto (sans 700/16px na cor da coleção, seta que gira 180°). A resposta abre em serifa 17px sobre `--serie-leve`. Depois de ver, aparecem **Acertei** (verde-dica) e **Rever depois** (âmbar-atenção), lado a lado, 52px. O estado fica guardado no aparelho e **enche o quadrado do número** (verde = acertou, âmbar = rever, número em branco) com uma linha de estado sob a pergunta. Acima das fichas, um **placar** em meta ("1 de 9 certas · 2 pra rever"). Gabaritos fora de ficha usam a mesma linha "Ver gabarito" dentro de uma caixa de fio.

### Boxes (nota, dica, atenção, perigo, resumo)
Retângulo com borda tingida e fundo levíssimo da cor da família, rótulo em label na mesma cor, corpo em 17px. Nota e resumo usam a cor da coleção.

### Navegação: próximo e anterior
A ordem é a **ordem de estudo**: `ordem:` no frontmatter, senão a ordem em que a nota aparece na trilha (Roadmap), senão alfabética.
- **Próximo capítulo:** faixa da coleção sangrando até a borda, nome em sans 700/22px com seta SVG de 22px à direita e meta abaixo a 88% de opacidade. Toque clareia (brightness 1,12).
- **Anterior:** linha de 56px em tinta com seta de voltar em tinta apagada e fio de 1px embaixo.

### Trilha (Roadmap)
Depois da introdução, um **índice dos estágios** (linhas de 52px, sans 700/17px, contagem "2 de 52" de tópicos marcados, tabular, à direita). Cada estágio é um bloco recolhível: fio de 3px da coleção em cima, título em sans 700/22px, contagem e seta. Link pra uma seção dentro de um estágio fechado abre o estágio. Caixinhas de tarefa são desenhadas (18px, borda de 1,5px em tinta apagada; marcada = quadrado da coleção com visto branco) e o item feito fica em tinta apagada.

### Estante (capa do site)
"Estudos" em sans 700/60px; abaixo, só depois da primeira nota lida, o **placar geral** ("8 de 133 capítulos lidos", meta tabular, barrinha de 3px em tinta). Depois o **cartão** (folha, fio de 1px, fio de 3px da coleção em cima, fitinha pendurada à direita, nome em sans 700/24px) que sempre aponta pra um lugar: a nota aberta e não terminada (com barrinha de quanto já leu e "faltam 6 min"), senão o próximo capítulo não lido depois dela, senão o primeiro não lido ("Começar por aqui"). A ação ocupa a base do cartão como faixa da coleção de 52px com seta. Então a **estante**: um livro em pé por coleção, largura e altura vindas do número de notas (em `colecoes.css`), nome correndo na lombada de cima pra baixo (700/20px), dois filetes no alto, contagem "7/100" embaixo e barrinha de 4px do que foi lido; os livros ficam sobre uma prateleira de 3px em tinta e levam à coleção. Por fim a lista **Por onde começar** com quadrado de cor por trilha; e cada caderno como **lombada**: faixa chapada sangrando até a borda com o nome em 26px e a contagem em label à direita ("7 de 100 lidas" quando há lidas), seguida da árvore de seções (nomes de pasta sem o número).

### Árvore de notas e fitinha
Linhas de 44px em sans 16px; seções são `details` com seta de canto que gira; sub-níveis recuados com fio de 1px à esquerda e texto em tinta apagada; contagens tabulares. A **fitinha** (12×22px, corte em V) pendurada no alto da linha marca a nota atual e a última lida; no cartão "continuar" ela tem 16×30px.

### Folha do sumário e busca
Cobre a tela, sobe de baixo (0,28s, `cubic-bezier(0.16, 1, 0.3, 1)`; desce em 0,2s ease-in). Em cima, preso: título em sans 24px, fechar e fio de 3px da coleção. **Embaixo, presa, a busca** (campo de 48px em folha, borda de fio, lupa SVG; botão de limpar de 48px quando há texto), logo acima do teclado. A busca acha notas e **títulos de seção** (os títulos do modelo que se repetem em muitas notas ficam de fora), marca o trecho encontrado com fundo leve da coleção e diz "seção em Nota". Cada caderno de topo leva um quadrado de 14px da sua cor. Com movimento reduzido, nenhuma transição.

## Do's and Don'ts

### Do:
- **Do** tirar toda cor de coleção do `site.config.json` via `--serie` em `[data-serie]`, e usar `--serie-fundo` pra faixas/fios, `--serie-texto` pra texto e sublinhado, `--serie-leve` pra fundos leves.
- **Do** abrir cada seção h2 com o toco de 32×4px na cor da coleção.
- **Do** usar fio de 1px (fio) pra estrutura e fio de 3px da coleção pra fechar ou encimar um bloco (capa do capítulo, ficha, continuar lendo, cabeçalho do sumário).
- **Do** fazer as faixas de cor (código, lombada, próximo capítulo) sangrarem até a borda com margem negativa de 16px.
- **Do** manter algarismos tabulares em contagens, minutos e posição.
- **Do** desenhar ícones e setas em SVG de traço 2px com `currentColor`.
- **Do** sublinhar links com 1,5px na cor da coleção, a 3px do texto.
- **Do** manter alvos de toque com pelo menos 44px.

### Don't:
- **Don't** usar sombra, gradiente decorativo ou canto arredondado em nenhuma superfície.
- **Don't** escrever cor de coleção à mão no CSS; uma coleção nova entra só pelo config.
- **Don't** pôr a cor de coleção na faixa do topo da estante; ali a faixa é tinta.
- **Don't** colocar sobretítulo ou rótulo de série acima do título do capítulo; a coleção já está na faixa e a posição vai na linha meta.
- **Don't** usar texto em sans no corpo corrido nem serifa na interface.
- **Don't** criar modo escuro nem fundo preto: o usuário quer o site sempre no papel claro.

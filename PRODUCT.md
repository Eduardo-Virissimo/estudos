# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Uma pessoa só: o dono do vault, estudante de programação (TypeScript, React, Node) e de inglês. Abre o site no celular, fora do computador (ônibus, fila, cama), sem o Obsidian mobile.

## Product Purpose
Publicar as notas do vault Obsidian (`Programação/`, `Inglês/`, `Diário/`) como site estático no GitHub Pages, pra estudar pelo celular. Os quatro usos, todos frequentes:
- ler uma nota inteira, do começo ao fim, como capítulo de livro;
- revisar as perguntas do fim de cada nota, abrindo a resposta pra se testar;
- consultar rápido uma nota ou trecho de código pela busca;
- seguir a trilha do roadmap (Anterior / Próxima, "Continuar lendo").

Sucesso = ler com conforto por bastante tempo numa tela pequena e achar qualquer nota em poucos toques.

## Operating Context
- Gerador próprio em `.sistema/site/build.ts` (Markdown do Obsidian → HTML), CSS/JS em `.sistema/site/assets/`. Sem Quartz.
- Deploy por GitHub Actions; o site só atualiza quando o usuário faz commit-and-sync.
- Notas seguem `Templates/Template.md`: texto corrido estilo capítulo, títulos narrativos, blocos de código, callouts do Obsidian (`[!question]` com `[!success]-` aninhado para perguntas e respostas, `[!tip]`, `[!warning]` etc.), tabelas, checklists.

## Capabilities and Constraints
- Só celular: uma coluna; não precisa de layout de desktop.
- Sem servidor: HTML estático, CSP rígida (só scripts/estilos/fontes do próprio site, nada de Google Fonts).
- Fontes hospedadas pelo próprio site via pacotes `@fontsource`.
- "Continuar lendo" é guardado só no aparelho (localStorage).

## Brand Commitments
- Nome: "Estudos".
- Tipografia pedida pelo usuário (2026-11-19): fontes de estudo clássicas — texto corrido numa serifa estilo livro (família Times, mas desenhada pra tela) e interface/títulos numa sans estilo Arial.

## Evidence on Hand
Conteúdo real: as notas do vault. Não há logo, imagens de marca nem outros leitores.

## Product Principles
1. Leitura primeiro: o texto é o produto; a interface some enquanto se lê.
2. Achar em poucos toques: sumário e busca sempre a um toque.
3. Revisar é ativo: perguntas e respostas precisam ser fáceis de abrir, fechar e distinguir.
4. Feito pra uma pessoa: nada de vitrine, contadores ou chamadas pra terceiros.

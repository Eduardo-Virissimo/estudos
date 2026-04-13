# Roteiro Completo de JavaScript (Basico ao Avancado)

## Objetivo

Este arquivo e um mapa de estudo para voce saber exatamente o que aprender em JavaScript, da base ate nivel avancado, sem buracos.

## Como usar este roteiro

- Estude em ordem, sem pular os blocos basicos.
- Para cada topico, faca: teoria curta + 3 exercicios + 1 mini projeto.
- So avance quando conseguir explicar o assunto sem olhar.

## Fase 0 - Ambiente e Fundacao

- Como o JavaScript roda no navegador e no Node.js
- DevTools (Console, Sources, Network)
- Node.js + npm + package.json
- Executar arquivos `.js` e scripts npm
- Leitura de erros e stack trace
- Debug basico com breakpoints e `console.log`

## Fase 1 - Basico da Linguagem

- Sintaxe basica
- Variaveis: `const`, `let`, `var`
- Tipos primitivos e `typeof`
- Operadores aritmeticos, logicos e de comparacao
- Coercao de tipos e comparacao `==` vs `===`
- Controle de fluxo: `if`, `else`, `switch`
- Lacos: `for`, `while`, `do...while`
- `break` e `continue`

## Fase 2 - Funcoes e Escopo

- Declaracao de funcao
- Function expression
- Arrow function
- Parametros padrao
- Rest parameters e spread
- Escopo global, de bloco e de funcao
- Hoisting
- Closures (obrigatorio)
- Funcoes puras e efeitos colaterais

## Fase 3 - Estruturas de Dados Principais

- Arrays: criacao, iteracao e metodos principais
- Objetos: leitura, escrita, remocao, iteracao
- Desestruturacao de arrays e objetos
- Optional chaining (`?.`) e nullish coalescing (`??`)
- `Map`, `Set`, `WeakMap`, `WeakSet`
- `Date`, `Math`, `JSON`

## Fase 4 - Metodos que voce precisa dominar

- Arrays: `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`
- Strings: `slice`, `includes`, `replace`, `split`, `trim`
- Objetos: `Object.keys`, `Object.values`, `Object.entries`
- Imutabilidade em operacoes do dia a dia

## Fase 5 - DOM e Web APIs

- Selecao de elementos (`querySelector`, `querySelectorAll`)
- Criacao e remocao de elementos
- Alteracao de classes, estilos e atributos
- Eventos: click, input, submit, keydown
- Event bubbling, capturing e delegacao de eventos
- Formularios e validacao
- `localStorage` e `sessionStorage`
- `fetch` para consumo de API

## Fase 6 - Assincronismo de Verdade

- Event loop (macro task e micro task)
- Callbacks
- Promises (`then`, `catch`, `finally`)
- `async` e `await`
- Concorrencia com `Promise.all`, `Promise.allSettled`, `Promise.race`
- Tratamento de erro assincrono
- Cancelamento com `AbortController`

## Fase 7 - JavaScript Intermediario para Profissional

- `this` em diferentes contextos
- Prototipos e cadeia de prototipos
- Classes em JavaScript
- Modulos ES (`import` / `export`)
- Diferenca entre CommonJS e ESM
- Tratamento de erros com `try/catch` e classes de erro
- Padroes comuns de projeto em JS

## Fase 8 - JavaScript Avancado

- Engine, parsing e JIT (visao pratica)
- Gerenciamento de memoria e garbage collection
- Performance no browser e no Node
- Web Workers (conceito e uso pratico)
- Programacao funcional em JS (compose, currying, imutabilidade)
- Programacao orientada a eventos em escala
- Streams e buffers no Node.js
- Observabilidade basica (logs, metricas, tracing)

## Fase 9 - Ecossistema e Ferramentas

- npm e versionamento semantico
- ESLint + Prettier
- Babel (quando usar)
- Bundlers (Vite, Webpack, esbuild)
- Testes unitarios (Jest ou Vitest)
- Testes de integracao e E2E (Playwright ou Cypress)
- CI basico para rodar testes automaticamente

## Fase 10 - Backend com Node.js (essencial)

- HTTP, rotas, middlewares
- APIs REST com Express ou Fastify
- Validacao de dados
- Autenticacao (JWT, cookies, sessions)
- Banco de dados (SQL ou NoSQL)
- Arquitetura em camadas
- Tratamento de erro e seguranca basica

## Fase 11 - Boas Praticas Profissionais

- Clean Code aplicado a JS
- Convencoes de nomes e organizacao de pastas
- Refatoracao orientada a legibilidade
- Code review: o que observar
- Documentacao minima util
- Praticas de seguranca (XSS, CSRF, injecoes)

## Fase 12 - Nivel Senior (direcao de estudo)

- Escalabilidade e trade-offs de arquitetura
- Mensageria e filas
- Cache e estrategias de performance
- Design de APIs para longo prazo
- Monolito modular vs microsservicos
- Lideranca tecnica e padroes de equipe

## Projetos por nivel (obrigatorio)

- Basico: calculadora, lista de tarefas, jogo de adivinhacao
- Intermediario: dashboard com API, CRUD completo, auth simples
- Avancado: app full stack com testes e deploy
- Profissional: sistema com observabilidade, cache e pipeline de CI

## Checklist de dominio real

- [ ] Consigo explicar escopo, closure e this com exemplos
- [ ] Consigo consumir API com tratamento de erro robusto
- [ ] Consigo organizar um projeto em modulos
- [ ] Consigo escrever testes para regra de negocio
- [ ] Consigo publicar uma API Node.js com boas praticas
- [ ] Consigo otimizar gargalos comuns de performance

## Ordem recomendada com seus modulos atuais

1. Finalizar toda a trilha de Fundamentos
2. Revisar o roteiro das Fases 0 a 6
3. Construir 2 projetos pequenos e 1 medio
4. Avancar para Fases 7 a 10 com projeto real
5. Estudar Fases 11 e 12 em paralelo com pratica

## Resultado esperado

Ao concluir este roteiro, voce sai de "sei sintaxe" para "consigo entregar software em JavaScript com qualidade, testes e manutencao".

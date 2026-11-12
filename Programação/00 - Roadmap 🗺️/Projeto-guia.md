---
tipo: missao
nome: Duo Finder
prioridade: 1
projeto: "[[Plataforma de Matchmaking para Duos em Jogos]]"
---

# 🎮 Projeto-guia: Duo Finder

> [!tip] A ideia
> Em vez de estudar o [[Roadmap]] de cima pra baixo, você constrói **uma coisa real** (a sua [[Plataforma de Matchmaking para Duos em Jogos|plataforma de matchmaking]]) e estuda cada tópico **no momento em que ele faz falta**. Cada fase termina com algo que funciona.

> [!info] Como usar
> 1. A **Ficha do herói** mostra a primeira fase com tarefas pendentes como *Missão principal*.
> 2. Antes de codar, estude só as notas de **"Estude"** da fase.
> 3. Marque as tarefas (aqui ou na Ficha). Cada uma vale XP.
> 4. Terminou a fase? Suba o `nivel` das notas que usou para `projeto`.
>
> **Stack sugerida:** JavaScript/Node.js + Express + PostgreSQL + Docker.
>
> Quer outra missão em paralelo? Crie outra nota com `tipo: missao` (use `prioridade` para ordenar e `ativa: false` para pausar).

---

## Fase 0: Preparar o terreno

**Entrega:** repositório `duo-finder` no GitHub com README, `.gitignore`, ESLint e Prettier configurados, e um `index.js` que imprime "Duo Finder".

**Estude:** [[Git Básico]] · [[GitHub e Pull Requests]] · [[estudos/Programação/01 - Ferramentas/Gerenciador de Pacotes/README|Gerenciador de Pacotes]] · [[estudos/Programação/01 - Ferramentas/Linter/README|Linter]] · [[estudos/Programação/01 - Ferramentas/Formatter/README|Formatter]]

- [ ] Repositório criado e primeiro commit
- [ ] `npm init`, ESLint e Prettier rodando
- [ ] README explicando a ideia em 5 linhas

## Fase 1: O cérebro do match, no terminal

**Entrega:** `node match.js ana` lê um `jogadores.json` (10 a 20 jogadores inventados) e imprime os 3 parceiros mais compatíveis da Ana, com a pontuação.

**Estude:** [[Variáveis e Tipos de Dados]] · [[Estruturas Condicionais]] · [[Estruturas de Repetição]] · [[Funções]] · [[Modularização]] · [[Arrays]] · [[Hash Table]] · [[JSON]]

- [ ] Ler e percorrer o JSON
- [ ] Função `compatibilidade(a, b)` retornando um número
- [ ] Ordenar e mostrar o top 3

## Fase 2: Filtros e qualidade

**Entrega:** `node match.js ana --regiao=BR --idioma=pt` filtra antes de pontuar, com testes garantindo a pontuação.

**Estude:** [[Set]] · [[Big O]] · [[Testes Unitários]] · [[Debugging]] · [[Exceptions]] · [[Validação]]

- [ ] Filtros por região, idioma e horário
- [ ] 5 testes unitários para `compatibilidade`
- [ ] Erro amigável quando o jogador não existe

## Fase 3: Virar uma API

**Entrega:** servidor Express com `GET /jogadores`, `GET /jogadores/:id/sugestoes`, `POST /likes` e `GET /matches`, testado no Postman ou Insomnia.

**Estude:** [[HTTP]] · [[REST]] · [[Status Codes]] · [[CORS]] · [[estudos/Programação/01 - Ferramentas/Postman/README|Postman]] · [[Tratamento Global de Erros]] · [[Logging]]

- [ ] Rotas funcionando com dados em memória
- [ ] Like dos dois lados gera um match
- [ ] Coleção do Postman/Insomnia salva no repositório

## Fase 4: Dados de verdade

**Entrega:** dados no PostgreSQL rodando no Docker; `docker compose up` sobe API + banco.

**Estude:** [[SQL]] · [[CRUD]] · [[JOIN]] · [[Chave Primária]] · [[Chave Estrangeira]] · [[estudos/Programação/25 - DevOps/Docker/README|Docker]] · [[Docker Compose]] · [[Gestão de Secrets]]

- [ ] Tabelas `jogadores`, `likes`, `matches`
- [ ] `docker-compose.yml` com API + Postgres
- [ ] `.env` fora do Git

## Fase 5: Contas e segurança

**Entrega:** cadastro e login com senha protegida; só quem está logado pode dar like.

**Estude:** [[Autenticação]] · [[Autorização]] · [[Hash]] · [[Salt]] · [[JWT]] · [[SQL Injection]] · [[OWASP Top 10]]

- [ ] `POST /cadastro` e `POST /login`
- [ ] Senha salva com hash (bcrypt)
- [ ] Rotas protegidas com JWT

## Fase 6: Chat e no ar

**Entrega:** chat em tempo real entre quem deu match e o projeto publicado num link.

**Estude:** [[WebSockets]] · [[Concorrência]] · [[CI/CD]] · [[GitHub Actions]] · [[Deploy]] · [[Testes de Integração]]

- [ ] Chat com WebSockets
- [ ] Pipeline rodando lint + testes a cada push
- [ ] Deploy e 3 amigos testando

---
nivel: escrito
foco: essencial
revisado:
---

# Docker

**Quanto focar: 🔥 essencial.** Quase toda empresa usa pra rodar banco local e fazer deploy. Domine o básico: rodar, construir imagem e usar compose.

Você termina a sua API, manda o repositório pra um colega, e ele responde: "não roda aqui". Você confere: na sua máquina, funciona perfeitamente. Depois de meia hora de investigação, descobrem que ele tem o Node 18 e você o 22, que ele não instalou o banco de dados, e que uma variável de ambiente estava configurada só no seu computador. Esse diálogo tem até nome no mundo da programação: **"na minha máquina funciona"**.

O **Docker** existe pra acabar com ele. A ideia é empacotar a sua aplicação **junto com tudo o que ela precisa** (a versão certa do Node, as bibliotecas, as configurações) num pacote chamado **imagem**. E essa imagem roda igualzinha em qualquer computador que tenha Docker, como um **container**. O seu colega não precisa instalar Node, nem banco, nem nada: só o Docker.

Duas peças fazem isso acontecer. O **Dockerfile** é a receita de uma imagem. E o **docker compose** sobe vários containers juntos, como a sua API e o banco de dados, já conversando entre si. No fim desta nota, você vai conseguir clonar um projeto numa pasta limpa, rodar um comando, e ver tudo funcionando, sem ter nada instalado. Ajuda já conhecer o [[Terminal]] e o [[Gerenciador de Pacotes]].

## A caixa de tamanho padrão

O nome vem dos **contêineres de navio**. Antes deles, carregar um navio era um caos: cada carga tinha um formato, um peso, um jeito de amarrar. O contêiner trouxe uma caixa de tamanho padrão, que qualquer navio, trem ou caminhão sabe carregar, não importa o que vai dentro. O Docker faz a mesma coisa com programas: uma caixa padrão, que qualquer computador com Docker sabe rodar.

Pra usar o Docker, você precisa separar dois conceitos que no começo parecem a mesma coisa:

| | Imagem | Container |
|---|---|---|
| O que é | o pacote, a receita pronta | o programa rodando, criado a partir da imagem |
| Muda? | não: é fixa (imutável) | sim: tem estado enquanto roda, e é descartável |
| Comparação | a planta da casa | a casa construída |

A **imagem** é o molde, e nunca muda. O **container** é o programa rodando, criado a partir dela. E uma imagem pode virar vários containers ao mesmo tempo, do mesmo jeito que uma classe vira vários objetos ([[Classes no TypeScript]]).

Talvez você esteja pensando em máquinas virtuais, que também isolam programas. A diferença é de peso. Uma máquina virtual simula um computador **inteiro**, com um sistema operacional completo dentro: é pesada, e leva minutos pra ligar. Um container **compartilha** o núcleo do sistema operacional do seu computador, e isola só a aplicação: é leve, e liga em segundos.

## A receita da imagem

O **Dockerfile** é um arquivo de texto com a receita da imagem, um passo por linha:

```dockerfile
# Base: Node 22, na versão alpine (bem pequena)
FROM node:22-alpine

# Pasta de trabalho dentro do container
WORKDIR /app

# Copia SÓ os arquivos de dependências primeiro...
COPY package*.json ./
# ...e instala
RUN npm ci

# Agora copia o resto do código
COPY . .

# Documenta a porta que a aplicação usa
EXPOSE 3000

# Comando que roda quando o container liga
CMD ["node", "server.js"]
```

Lendo de cima pra baixo: comece de uma imagem que já tem o Node 22; crie uma pasta `/app`; copie os arquivos de dependências e instale; copie o resto do código; e, quando o container ligar, rode o servidor.

Agora, repare na ordem esquisita do meio. Por que copiar o `package.json`, instalar, e **só depois** copiar o código? Por que não copiar tudo de uma vez?

A resposta é a parte mais inteligente do Docker. Cada linha do Dockerfile cria uma **camada** na imagem, e o Docker guarda essas camadas em cache. No próximo build, se nada mudou numa camada, ele simplesmente reaproveita a que já tinha. E pense no que muda com frequência no seu projeto: o código muda o tempo todo; as dependências quase nunca. Copiando primeiro só o `package.json`, a camada do `npm ci`, que é a mais lenta, fica guardada, e só roda de novo quando as dependências mudam. Se você copiasse tudo de uma vez, qualquer mudança numa linha de código obrigaria o Docker a reinstalar todas as dependências, a cada build.

Pra criar a imagem e rodar um container dela:

```bash
docker build -t minha-api .     # cria a imagem a partir do Dockerfile desta pasta
docker run -p 3000:3000 -d minha-api
```

E crie também um `.dockerignore`, na mesma pasta, pra não copiar lixo pra dentro da imagem:

```text
.git
node_modules/
.env
dist/
```

Sem ele, o `COPY . .` leva o `node_modules` e o `.git` pra dentro da imagem, o que deixa o build lento e a imagem enorme. E, pior, pode levar o `.env`, com as suas senhas, pra dentro de uma imagem que talvez você publique.

Um detalhe de sintaxe que causa erros estranhos: no Dockerfile, um comentário só vale no **começo** da linha. Um `FROM node:22-alpine  # base` dá erro, porque o Docker tenta ler o `# base` como parte da instrução.

## Portas: do container pro seu computador

Este é o tropeço mais comum de quem começa, então vale com calma. Um container tem a sua própria rede, isolada do seu computador. A sua aplicação pode estar rodando na porta 3000 **dentro** do container, mas o seu navegador não enxerga isso até você ligar uma porta do seu computador a ela:

```bash
docker run -p 8080:3000 minha-api
#             ^^^^ ^^^^
#     no seu PC    dentro do container
```

O formato é sempre `-p PORTA_DO_PC:PORTA_DO_CONTAINER`. Neste exemplo, você acessa `localhost:8080` no navegador, e o Docker encaminha pra porta 3000 do container.

E quando o container está rodando, mas o `localhost` não responde de jeito nenhum? Confira três coisas, nesta ordem. Você passou o `-p`? A porta da direita é a que a aplicação **realmente** usa dentro do container? E, a mais traiçoeira: a aplicação escuta em `0.0.0.0`, e não só em `localhost`? Dentro do container, `localhost` quer dizer **só o próprio container**. Um servidor que escuta apenas em `localhost` recusa qualquer conexão vinda de fora dele, inclusive a do seu navegador.

## Vários containers juntos

Uma aplicação de verdade raramente é uma peça só. Ela tem a API, o banco de dados, às vezes um cache. Subir cada parte com um `docker run` cheio de opções é trabalhoso, e fácil de errar. O **docker compose** descreve tudo num arquivo só:

```yaml
# compose.yaml (ou docker-compose.yml)
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:senha-de-dev@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: senha-de-dev
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d     # sobe tudo em segundo plano
docker compose logs -f   # acompanha os logs
docker compose down      # para e remove os containers
```

Dois detalhes desse arquivo merecem atenção. O primeiro está na `DATABASE_URL`: o endereço do banco é **`db`**, o nome do serviço. O compose cria uma rede onde cada serviço encontra o outro **pelo nome**.

E isso resolve um erro que todo mundo comete. Você tenta conectar a API no banco usando `localhost`, e não funciona. Pelo mesmo motivo da seção anterior: dentro do container da API, `localhost` é **a própria API**, não o seu computador, nem o banco. Use o nome do serviço. E um cuidado extra: o `depends_on` só garante que o banco **liga** antes da API, não que ele já está **pronto** pra receber conexões (o Postgres leva alguns segundos pra se preparar). A API precisa saber tentar de novo se falhar no começo.

O segundo detalhe é o `volumes`. Containers são descartáveis: tudo o que fica dentro deles some quando são removidos. Isso é ótimo pra aplicação, e péssimo pro banco de dados. Um **volume** guarda os dados do banco **fora** do container, então eles sobrevivem a um `down` seguido de um `up`.

Se você encontrar tutoriais antigos, vai ver o comando `docker-compose`, com hífen, e uma linha `version: '3.8'` no topo do arquivo. Hoje o comando é `docker compose`, com espaço, e a linha `version` é ignorada.

## O dia a dia

Alguns comandos que você vai usar o tempo todo:

```bash
docker ps                      # containers rodando
docker ps -a                   # todos, inclusive os parados
docker logs -f <id>            # acompanha os logs de um container
docker exec -it <id> sh        # abre um terminal dentro do container
docker compose exec db psql -U app -d app   # entra no banco do compose
docker system prune -a         # limpa imagens e containers sem uso ⚠️
```

O `exec -it ... sh` é a ferramenta de investigação: você entra no container e olha os arquivos, as variáveis, o que está rodando, como se estivesse lá dentro.

E quando a imagem começar a ficar grande (é comum uma imagem ingênua passar de 1 GB), três práticas resolvem. Use **imagens base pequenas**: as versões `alpine` ou `slim` têm uma fração do tamanho das completas. Use o **multi-stage**: uma imagem pra **construir**, com todas as ferramentas, e outra, enxuta, pra **rodar**, que recebe só o resultado do build.

```dockerfile
# Estágio 1: build, com todas as ferramentas
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: produção, só o necessário
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

E **não rode como root**. Por padrão, o processo dentro do container roda como administrador, o que é um risco se alguém conseguir invadir a aplicação. Defina um usuário comum:

```dockerfile
RUN adduser -D appuser
USER appuser
```

E nada de senha de produção escrita no `compose.yaml`: use variáveis de ambiente e um `.env` fora do Git.

Uma curiosidade pra fechar: o Docker nasceu em 2013, dentro da dotCloud, uma empresa de hospedagem fundada por Solomon Hykes. A ideia de isolar processos já existia havia décadas no Unix e no Linux. A novidade do Docker foi tornar isso **fácil**: um Dockerfile legível, imagens em camadas, e um lugar público pra compartilhar imagens, o Docker Hub.

## O essencial

1. Imagem é a receita fixa; container é a imagem rodando. Uma imagem vira vários containers.
2. No Dockerfile, copie o `package.json` e instale antes de copiar o código: a camada lenta fica em cache.
3. `-p PC:CONTAINER` liga as portas. A aplicação precisa escutar em `0.0.0.0`.
4. Dentro de um container, `localhost` é o próprio container. No compose, use o nome do serviço.
5. Volume guarda dados fora do container. `.dockerignore` mantém `node_modules`, `.git` e `.env` fora da imagem.

## Agora é com você

Comece com um ambiente de desenvolvimento simples: uma aplicação Node com um banco de dados, subindo junto pelo compose, com o código montado como volume pra recarregar quando você salva. Crie uma pasta, um `package.json` com um script `start`, e este `Dockerfile`:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g nodemon
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

E este `compose.yaml`:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGO_URI: mongodb://mongo:27017/minha-app
    depends_on:
      - mongo
    volumes:
      - .:/app   # monta o código pra recarregar ao salvar

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Suba tudo com `docker compose up -d`, confira com `docker compose ps`, entre no banco com `docker compose exec mongo mongosh` (e rode `show dbs` lá dentro), e acompanhe a aplicação com `docker compose logs app -f`.

Depois, o projeto de verdade: **colocar um projeto seu num container**, com um servidor real, um banco, dados que persistem e configuração por ambiente. O do roadmap é a [[Plataforma de Matchmaking para Duos em Jogos|Matchmaking]]; se ainda não existir, uma API Express de uma rota só serve. Escreva o `Dockerfile` e o `.dockerignore` (sem `node_modules` na imagem). Faça o `docker compose up` subir o app e o banco, com um volume pra os dados sobreviverem a um `docker compose down`. E coloque a configuração num `.env`: nenhuma senha no código, nem no compose. Você terminou quando clonar o repositório numa pasta limpa, rodar `docker compose up`, e tudo funcionar sem ter Node nem banco instalados. Se quiser ir além, faça o build em múltiplas etapas e compare o tamanho da imagem antes e depois (`docker images` mostra), adicione um `healthcheck` no banco pra o app esperar ele ficar pronto, e publique a imagem no Docker Hub ou no GitHub Container Registry.

Daqui, siga pro [[Docker Compose]] e pra [[CI/CD]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre imagem e container?
> A **imagem** é o molde imutável (a receita). O **container** é uma instância rodando dessa imagem. Uma imagem pode ter vários containers.

> [!question]- Dockerfile vs `docker-compose.yml`?
> O Dockerfile descreve como **construir uma imagem**. O compose descreve como **rodar vários serviços juntos** (portas, volumes, rede, variáveis).

> [!question]- O container está rodando, mas `localhost:3000` não responde. Causas prováveis?
> Esqueceu de publicar a porta (`-p 3000:3000`) ou o app escuta em `127.0.0.1` dentro do container em vez de `0.0.0.0`.

> [!question]- A API no container não conecta no banco usando `localhost`. Por quê?
> Dentro do container, `localhost` é **o próprio container**. No compose, use o nome do serviço (ex.: `db`) como host.

> [!question]- Por que copiar o `package.json` e rodar `npm install` antes de copiar o resto do código?
> Cache de camadas: se só o código mudou, o Docker reaproveita a camada das dependências e o build fica muito mais rápido.

> [!question]- Como reduzir uma imagem de mais de 1 GB?
> Multi-stage build, imagem base `alpine`/`slim` e um `.dockerignore` bem feito.

> [!question]- `docker build -t nome .`
> cria uma imagem a partir do Dockerfile

> [!question]- `docker run -p 8080:3000 nome`
> roda um container mapeando porta do host (8080) → container (3000)

> [!question]- `docker ps`
> lista os containers rodando

> [!question]- `docker compose up -d`
> sobe os serviços do compose em segundo plano

> [!question]- `docker logs -f <id>`
> acompanha os logs de um container

> [!question]- `docker exec -it <id> sh`
> abre um terminal dentro do container

> [!question]- `.dockerignore`
> exclui arquivos do contexto de build

> [!question]+ A API roda num container e o banco em outro, no mesmo `docker-compose`. Qual host usar na conexão com o banco?
> - a) `localhost`
> - b) `127.0.0.1`
> - c) O nome do serviço do banco no compose (ex: `db`)
> - d) O IP do seu PC
>
> > [!check]- Resposta
> > **c)** Dentro do container, `localhost` é **o próprio container**. No compose, os serviços se acham pelo nome, numa rede criada sozinha.

> [!question]+ `docker run -p 8080:3000 api`. Em que endereço você acessa no navegador?
> - a) `localhost:3000`
> - b) `localhost:8080`
> - c) `api:3000`
> - d) `localhost:8080:3000`
>
> > [!check]- Resposta
> > **b)** O formato é `-p PORTA_DO_PC:PORTA_DO_CONTAINER`. A app escuta na 3000 dentro do container, e você acessa pela 8080 no seu PC.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `docker --version` | Confere a instalação |
| `docker pull imagem` | Baixa uma imagem do Docker Hub |
| `docker build -t nome .` | Cria uma imagem a partir do Dockerfile |
| `docker run -p 8080:3000 -d nome` | Cria e roda um container |
| `docker images` | Lista as imagens locais |
| `docker ps` / `docker ps -a` | Containers rodando / todos |
| `docker stop` / `docker start` / `docker rm` | Para / inicia / remove um container |
| `docker rmi imagem` | Remove uma imagem |
| `docker logs -f container` | Acompanha os logs |
| `docker exec -it container sh` | Entra no terminal do container |
| `docker compose up -d` / `down` | Sobe / derruba os serviços |
| `docker system prune -a` | Limpa o que não está em uso ⚠️ |

**Pra ler:** a [documentação oficial](https://docs.docker.com/) tem um guia "Get started" que monta uma aplicação do zero, passo a passo, e é o melhor próximo passo depois desta nota. E o livro *Docker Deep Dive*, de Nigel Poulton, explica o que acontece por dentro (camadas, redes, volumes) de um jeito muito acessível.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

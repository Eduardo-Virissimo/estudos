## O que é?

Docker é uma plataforma de **containerização** que permite empacotar uma aplicação junto com todas as suas dependências (bibliotecas, binários, configurações, versão do sistema) em uma unidade isolada chamada **container**.

O objetivo do Docker é resolver o clássico problema: _"na minha máquina funciona"_. Com Docker, o ambiente de execução é sempre o mesmo, independente de onde o container rode — seu notebook, o servidor da empresa ou a nuvem.

Diferente de uma máquina virtual, o container não emula um sistema operacional inteiro. Ele compartilha o kernel do sistema hospedeiro e isola apenas os processos, arquivos e recursos da aplicação. Isso o torna muito mais leve e rápido de iniciar.

## Como funciona?

O Docker se baseia em três conceitos centrais:

- **Imagem (Image)**: um "molde" somente leitura que contém o sistema de arquivos, dependências e instruções necessárias para rodar a aplicação. É construída a partir de um `Dockerfile`.
- **Container**: uma instância em execução de uma imagem. É isolado, mas leve, e pode ser criado, iniciado, parado e destruído rapidamente.
- **Dockerfile**: um arquivo de texto com instruções passo a passo de como construir a imagem (qual sistema base usar, quais pacotes instalar, quais arquivos copiar, qual comando rodar).

O fluxo básico é:

```text
Dockerfile → (docker build) → Imagem → (docker run) → Container
```

Internamente, o Docker usa recursos do kernel Linux como **namespaces** (isolamento de processos, rede, sistema de arquivos) e **cgroups** (limitação de uso de CPU/memória) para criar esse isolamento sem precisar de um hypervisor completo.

Também existem **volumes**, usados para persistir dados fora do ciclo de vida do container, e **redes (networks)**, usadas para permitir comunicação entre containers.

## Sintaxe

Comandos essenciais:

```bash
# Construir uma imagem a partir de um Dockerfile
docker build -t minha-imagem .

# Rodar um container a partir de uma imagem
docker run -d -p 8080:80 --name meu-app minha-imagem

# Listar containers em execução
docker ps

# Listar todos os containers (inclusive parados)
docker ps -a

# Parar um container
docker stop meu-app

# Remover um container
docker rm meu-app

# Listar imagens
docker images

# Remover uma imagem
docker rmi minha-imagem

# Ver logs de um container
docker logs -f meu-app

# Entrar no terminal de um container em execução
docker exec -it meu-app bash

# Rodar com Docker Compose
docker compose up -d
docker compose down
```

Exemplo de `Dockerfile` básico (aplicação Node.js):

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

Exemplo de `docker-compose.yml`:

```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=senha
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

## Exemplo

Imagine que você tem uma API em Node.js que depende do Node 20, precisa da variável de ambiente `DATABASE_URL` e expõe a porta 3000.

Sem Docker, cada desenvolvedor precisaria instalar manualmente a versão correta do Node, configurar variáveis de ambiente e garantir que nenhuma outra dependência do sistema conflite.

Com Docker, basta rodar:

```bash
docker build -t minha-api .
docker run -e DATABASE_URL=postgres://user:pass@db:5432/app -p 3000:3000 minha-api
```

E a aplicação sobe exatamente igual em qualquer máquina que tenha o Docker instalado.

## Casos de uso

- Padronizar ambientes de desenvolvimento entre times
- Criar pipelines de CI/CD reproduzíveis
- Isolar dependências conflitantes entre projetos diferentes
- Rodar múltiplos serviços (API, banco de dados, cache) de forma orquestrada com Compose
- Facilitar deploy em produção (Kubernetes, ECS, etc.)
- Testar bibliotecas ou versões de sistemas sem "sujar" a máquina local
- Criar ambientes descartáveis para experimentação

## Vantagens

- Ambientes consistentes entre dev, teste e produção
- Inicialização muito mais rápida que máquinas virtuais
- Menor consumo de recursos (compartilha o kernel do host)
- Facilita versionamento de infraestrutura (Dockerfile no controle de versão)
- Grande ecossistema (Docker Hub, Compose, Swarm, Kubernetes)
- Facilita rollback (basta voltar para uma imagem anterior)

## Desvantagens

- Curva de aprendizado inicial (networking, volumes, camadas de imagem)
- Overhead de gerenciamento em ambientes muito grandes (geralmente exige Kubernetes)
- Containers Linux não rodam nativamente no Windows/Mac (usam uma VM leve por trás, como o Docker Desktop)
- Imagens mal construídas podem ficar grandes e lentas para build/deploy
- Persistência de dados exige atenção (containers são efêmeros por padrão)

## Boas práticas

- Usar imagens base leves (ex: `alpine`) quando possível
- Nunca rodar containers como usuário `root` em produção
- Usar `.dockerignore` para não copiar arquivos desnecessários (como `node_modules` e `.git`)
- Aproveitar o cache de camadas: copiar `package.json` antes do restante do código
- Definir `HEALTHCHECK` para monitorar a saúde do container
- Nunca colocar segredos (senhas, chaves) diretamente no Dockerfile
- Usar multi-stage builds para reduzir o tamanho final da imagem
- Fixar versões das imagens base (evitar `latest` em produção)

## Erros comuns

- Esquecer de expor a porta com `-p` e achar que a aplicação "não sobe"
- Confundir a porta do host com a porta do container (`host:container`)
- Perder dados por não usar volumes (dados somem ao remover o container)
- Buildar a imagem sem `.dockerignore`, deixando-a enorme e lenta
- Não entender a diferença entre `CMD` e `ENTRYPOINT`
- Achar que `docker stop` remove o container (na verdade só remove com `docker rm`)
- Rodar múltiplos processos dentro de um único container sem necessidade (quebra o princípio de um processo por container)

## Exercícios

- [ ] Criar um Dockerfile para uma aplicação simples (Node, Python ou outra)
- [ ] Rodar essa aplicação em um container e acessá-la pelo navegador
- [ ] Criar um `docker-compose.yml` com a aplicação + um banco de dados
- [ ] Criar um volume e testar a persistência de dados após remover o container
- [ ] Praticar multi-stage build para reduzir o tamanho da imagem final
- [ ] Explicar, sem consultar, a diferença entre imagem e container

## Referências

- Documentação oficial: https://docs.docker.com
- Docker Hub: https://hub.docker.com
- Play with Docker (ambiente prático online): https://labs.play-with-docker.com

## Relacionado

- [[DevOps]]
- [[Redes]]
- [[Sistemas Operacionais]]
- [[Arquitetura de Software]]
- [[Ferramentas]]
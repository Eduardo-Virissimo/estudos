# 📚 Docker

> *"Docker é o futuro da implantação de software – é a única forma correta"* — Jez Humble

---

## O que é Docker?

**Docker** é uma plataforma de virtualização baseada em containers que permite empacotar, executar e gerenciar aplicações de forma consistente em qualquer ambiente. Diferente das máquinas virtuais tradicionais (VMs), os containers do Docker compartilham o kernel do sistema operacional do host, tornando-os mais leves, rápidos e eficientes em recursos.

### Funcionamento Básico

Imagine que você desenvolveu um site web usando Node.js, mas no servidor de produção só existe Python instalado. Com Docker, você pode "empacotar" seu site junto com todas as dependências (Node.js, bibliotecas, etc.) em um container, garantindo que funcione exatamente da mesma forma em qualquer lugar.

Os containers são criados a partir de **imagens** — templates leves e imutáveis que definem todo o ambiente necessário para sua aplicação.

---

## Uma História Breve 📜

A história do Docker começa no início de 2013, quando as empresas buscavam soluções mais eficientes para "dependency hell" (conflitos de dependências). A inspiração veio da indústria aeroespacial e naval:

- **2007**: Solomon Hykes cria o projeto **AppContainer** no Facebook
- **2013**: A empresa Dotcloud renomeia seu sistema como **Docker**
- **2013**: Docker é lançado como código aberto
- **2014-2015**: Criação de ferramentas complementares (Docker Compose, Swarm)
- **Hoje**: O Docker é usado por mais de 70% das empresas que implementam containers

A tecnologia evoluiu do conceito de "containers" (originado no Linux em 2005 com o projeto LXC) para se tornar um padrão da indústria em DevOps e CI/CD.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Portabilidade**: Execute sua aplicação em qualquer lugar (dev, staging, produção) com comportamento idêntico
- 📦 **Consistência**: Elimina o problema "funciona na minha máquina" — todo ambiente é reproduzível
- 🔧 **Isolamento**: Cada aplicativo roda em seu próprio sandbox seguro sem conflitos de dependências
- 🤖 **Escalabilidade Fácil**: Containers podem ser criados e destruídos rapidamente para lidar com carga variável
- 🌐 **Orquestração**: Ferramentas como Kubernetes facilitam a gestão de grandes números de containers
- 💾 **Recursos Eficientes**: Containers consomem menos memória e CPU que máquinas virtuais tradicionais

---

## Conceitos Fundamentais 🎯

### Dockerfile

O **Dockerfile** é um arquivo de texto com instruções para criar uma imagem Docker. Cada linha cria uma camada na imagem final.

```dockerfile
# Exemplo básico de Dockerfile para aplicação Node.js

FROM node:18-alpine            # Base: imagem do Node.js 18 Alpine (leve)

WORKDIR /app                  # Define o diretório de trabalho

COPY package*.json ./         # Copia package.json e package-lock.json

RUN npm install               # Instala dependências

COPY . .                      # Copia todo o código fonte

EXPOSE 3000                   # Expor a porta da aplicação

CMD ["node", "server.js"]     # Comando para iniciar a aplicação
```

### Imagens vs Containers

| Característica | Imagem Docker | Container Docker |
|----------------|---------------|------------------|
| Natureza | Template/Template estático | Instância executável dinâmica |
| Estado | Imutável | Efêmero (muda durante execução) |
| Uso | Criação de ambientes | Execução da aplicação |

### Dockerfile vs docker-compose.yml

O **Dockerfile** cria uma única imagem para um serviço, enquanto o **docker-compose.yml** define múltiplos serviços (servidor DB, aplicação frontend, backend, cache) e como eles se comunicam.

```yaml
# docker-compose.yml - exemplo de ambiente completo

version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: exemplo
    volumes:
      - pgdata:/var/lib/postgresql/data
  
volumes:
  pgdata:
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico — Criando e Executando um Container

**Passo 1: Criar o Dockerfile** (`Dockerfile`):

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y python3-pip
WORKDIR /app
COPY app.py .
CMD ["python3", "app.py"]
```

**Passo 2: Criar a imagem**:

```bash
docker build -t meu-contador-app .
```

**Passo 3: Executar o container**:

```bash
docker run -p 8080:5000 -d meu-contador-app
```

- `-p 8080:5000`: Mapeia a porta 8080 do host para a 5000 do container
- `-d`: Executa em modo detached (background)

### Exemplo 2: Caso de Uso Real — API com Banco de Dados PostgreSQL

**Dockerfile da aplicação**:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
```

**docker-compose.yml para ambiente completo**:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://appuser:mysupersecretpassword@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: mysupersecretpassword
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  cache:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

**Comandos para iniciar o ambiente**:

```bash
docker-compose up -d           # Inicia todos os serviços no background

# Acessar o terminal do banco de dados
docker-compose exec db psql -U appuser -d mydb

# Ver logs de todos os containers
docker-compose logs -f

# Parar tudo
docker-compose down
```

---

## Configurações Recomendadas ⚙️

### .dockerignore — Excluindo Arquivos do Build

Crie um arquivo `.dockerignore` na mesma pasta do Dockerfile para evitar copiar arquivos desnecessários:

```dockerfile
# .dockerignore
.git
.gitignore
__pycache__/
*.pyc
.env
node_modules/
.DS_Store
```

### docker-compose.yml — Variáveis de Ambiente

Use variáveis de ambiente para configurar seu container dinamicamente:

```yaml
services:
  api:
    environment:
      - DEBUG=false
      - NODE_ENV=production
      - API_PORT=3000
```

---

## Dicas de Ouro 💎

### 1. Use Imagens Multi-Stage para Reduzir Tamanho

Crie imagens menores usando estágios separados no Dockerfile:

```dockerfile
# Estágio 1: Build (com todas as ferramentas de compilação)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: Produção (apenas o necessário)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 2. Não Rode Containers como Root

Sempre defina um usuário não-root para segurança:

```dockerfile
RUN useradd -m appuser
USER appuser
```

### 3. Otimize com `.dockerignore`

Arquivos grandes e desnecessários (`.git`, `node_modules`) aumentam significativamente o tempo de build.

---

## Comandos e Sintaxe Essenciais 📋

| Comando | Função |
|---------|--------|
| `docker --version` | Verifica instalação do Docker |
| `docker pull [IMAGE]` | Baixa uma imagem do Docker Hub |
| `docker build -t NOME .` | Cria uma imagem a partir de um Dockerfile |
| `docker run [OPÇÕES] [IMAGEM]` | Cria e executa um container |
| `docker images` | Lista imagens locais |
| `docker ps` | Lista containers rodando |
| `docker ps -a` | Lista todos os containers (incluidos parados) |
| `docker stop [ID/NAME]` | Para um container em execução |
| `docker start [ID/NAME]` | Inicia um container parado |
| `docker rm [ID/NAME]` | Remove um container parado |
| `docker rmi [ID/IMAGE]` | Remove uma imagem local |
| `docker logs [CONTAINER]` | Mostra logs do container |
| `docker exec -it [CONTAINER] bash` | Entra no terminal do container |
| `docker-compose up -d` | Inicia serviços definidos no docker-compose.yml |
| `docker-compose down` | Para e remove todos os serviços |
| `docker system prune -a` | Limpa imagens e containers não usados |

---

## Exercício Prático 🎯

**Objetivo:** Criar um ambiente de desenvolvimento web completo usando Docker para uma aplicação Node.js com MongoDB.

### Passo a passo:

1. **Crie os arquivos no diretório de trabalho**:

   ```bash
   mkdir docker-exercicio-nodemon-db
   cd docker-exercicio-nodemon-db
   ```

2. **Crie o Dockerfile** (`Dockerfile`):

   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   
   RUN npm install
   RUN npm install -g nodemon
   
   COPY . .
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

3. **Crie o docker-compose.yml** (`docker-compose.yml`):

   ```yaml
   version: '3.8'
   
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
         - .:/app   # Mount para hot-reload
   
     mongo:
       image: mongo:6.0
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
   
   volumes:
     mongo_data:
   ```

4. **Crie um arquivo `package.json`** com scripts simples de testar:

   ```json
   {
     "name": "docker-exemplo",
     "version": "1.0.0",
     "scripts": {
       "start": "echo 'Node.js rodando no container!'",
       "test": "echo 'Executando teste Docker...'"
     }
   }
   ```

5. **Execute os comandos**:

   ```bash
   # Inicia o ambiente completo
   docker-compose up -d
   
   # Verifique se está rodando
   docker-compose ps
   
   # Acesse o MongoDB
   docker-compose exec mongo mongosh
   > show dbs; use minha-app
   
   # Veja os logs da aplicação
   docker-compose logs app -f
   ```

---

## Próximos Passos ✅

- [ ] Instalar Docker Desktop no seu sistema operacional
- [ ] Explorar Docker Hub para encontrar imagens oficiais de linguagens e frameworks
- [ ] Criar um container com uma aplicação Python simples (Flask/Django)
- [ ] Estudar orquestração com Kubernetes básico
- [ ] Ler a documentação oficial: [docs.docker.com](https://docs.docker.com/)

---

## Recursos Recomendados 📚

### 📖 Livros:
- *[Docker Deep Dive]*
- *[Container Security Handbook]* 

---

## Problemas Comuns e Soluções 🔧

### Problema: Container não conecta ao banco de dados

**Solução:**
1. Verifique se o container do banco está rodando antes de iniciar a aplicação
2. Use nomes de serviço (não IPs) para conexões dentro do mesmo `docker-compose`
3. Adicione `depends_on` no docker-compose.yml
4. Para produção, use variáveis de ambiente com senhas fortes

```yaml
# Exemplo correto:
environment:
  DATABASE_URL: postgres://user:password@db:5432/mydb
```

### Problema: Container roda mas a porta não responde no localhost

**Solução:**
1. Verifique o mapeamento de portas: `docker port [container]`
2. Confirme se a aplicação está escutando na porta correta dentro do container
3. Em produção, use variáveis de ambiente para definir a porta dinâmica

```dockerfile
# Melhor prática:
ENV PORT=3000
EXPOSE ${PORT}
CMD ["node", "server.js"]
```

### Problema: Imagem muito grande (>1GB)

**Solução:**
1. Use imagens base `alpine` ou `slim` ao invés de versões completas
2. Implemente builds multi-stage no Dockerfile
3. Adicione `.dockerignore` para excluir arquivos grandes
4. Execute regularmente: `docker system prune -a`

---

## Conclusão 🎉

Docker revolucionou a forma como desenvolvedores e operações implantam e gerenciam aplicações. Com containers, você garante consistência entre ambientes, elimina dependências conflitantes e escala facilmente suas aplicações.

**Dicas para dominar Docker:**
- ✅ Use sempre `docker-compose` para ambientes locais
- ✅ Publique imagens do seu projeto no Docker Hub
- ✅ Leia logs com `docker logs -f [container]` quando algo falhar
- ✅ Pratique com `docker run`, `docker exec` e `docker inspect`

A jornada de aprendizado em DevOps não termina aqui — explore Kubernetes, CI/CD pipelines e monitoramento para levar seus projetos ao próximo nível! 🚀

---

*Este material segue o padrão da pasta Ferramentas para manter consistência entre todos os tópicos do vault de estudos.* 🎯

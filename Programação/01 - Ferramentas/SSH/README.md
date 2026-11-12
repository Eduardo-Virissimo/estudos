---
nivel: escrito
revisado:
---

# SSH

> *"Um túnel seguro entre você e qualquer máquina do mundo."*

> [!tip] ⚡ Em 30 segundos
> Protocolo pra acessar outra máquina com tudo **criptografado**. No dia a dia: `ssh user@host`, chave `ed25519` em vez de senha e `~/.ssh/config` pra criar apelidos. Também é como você autentica no GitHub.
>
> **Como estudar esta nota:** tente o [[#🔨 Desafio prático|desafio]] *antes* de ler. Travou? Leia só a parte que precisa. No fim, responda o [[#🧠 Me teste|Me teste]] sem olhar.

> [!info] 📊 Nível
> Mude `nivel` nas propriedades: `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Atualize `revisado` com a data sempre que revisar.

---

## O que é SSH?

O **SSH** (*Secure Shell*) é um protocolo que permite acessar e controlar outro computador remotamente de forma **segura**. Toda a comunicação (comandos, senhas, arquivos) é **criptografada**, o que impede que alguém no meio do caminho leia ou altere os dados.

Ele é usado para administrar servidores, transferir arquivos, fazer deploys e até autenticar no GitHub.

### Uma História Breve 📜

O SSH foi criado em **1995** por **Tatu Ylönen**, na Finlândia, após um ataque de captura de senhas na rede da universidade dele. Ele substituiu protocolos inseguros como **Telnet** e **rlogin**, que enviavam tudo em texto puro. A implementação livre **OpenSSH** (projeto OpenBSD, 1999) é hoje a mais usada, e já vem incluída em Linux, macOS e Windows.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Cliente e servidor

Você usa o **cliente SSH** (`ssh`) para se conectar a um **servidor SSH** (`sshd`) rodando na máquina remota, normalmente na **porta 22**.

```bash
ssh usuario@endereco-do-servidor
```

### Conceito 2: Autenticação por par de chaves

Você gera um par de chaves:

- **Chave privada**: fica só com você. **Nunca compartilhe.**
- **Chave pública**: pode ser copiada para os servidores onde você quer entrar.

```bash
ssh-keygen -t ed25519 -C "seu@email.com"
```

Isso cria (por padrão) `~/.ssh/id_ed25519` (privada) e `~/.ssh/id_ed25519.pub` (pública).

### Conceito 3: Fingerprint e `known_hosts`

Na primeira conexão, o SSH mostra a **impressão digital** do servidor e pergunta se você confia. Se aceitar, ela é salva em `~/.ssh/known_hosts`. Se mudar depois, o SSH avisa, protegendo contra ataques de interceptação.

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

```bash
# Conectar
ssh ana@192.168.0.10

# Conectar em outra porta
ssh -p 2222 ana@192.168.0.10

# Copiar sua chave pública para o servidor
ssh-copy-id ana@192.168.0.10
```

### Exemplo 2: Caso de Uso Real

Copiar arquivos e criar um túnel:

```bash
# Enviar arquivo para o servidor
scp relatorio.pdf ana@servidor:/home/ana/

# Baixar uma pasta
scp -r ana@servidor:/var/log/app ./logs

# Túnel: acessa a porta 5432 do servidor como se fosse local na 5433
ssh -L 5433:localhost:5432 ana@servidor
```

---

## Configurações Recomendadas ⚙️

Arquivo `~/.ssh/config` para criar atalhos de conexão:

```text
Host meu-servidor
    HostName 192.168.0.10
    User ana
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

Depois basta usar:

```bash
ssh meu-servidor
```

---

## Dicas de Ouro 💎

### 1. Prefira chave a senha

Chaves são muito mais difíceis de quebrar. Em servidores, considere desativar login por senha (`PasswordAuthentication no` no `sshd_config`) depois de testar a chave.

### 2. Proteja a chave privada com passphrase

Se alguém copiar o arquivo, ainda precisará da frase-senha. Use o `ssh-agent` para não digitá-la toda hora.

### 3. Permissões importam

A pasta `~/.ssh` deve ser `700` e a chave privada `600`, senão o SSH recusa usar.

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
```

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `ssh user@host` | Conecta a um servidor |
| `ssh-keygen` | Gera par de chaves |
| `ssh-copy-id user@host` | Instala sua chave pública no servidor |
| `scp origem destino` | Copia arquivos via SSH |
| `sftp user@host` | Sessão interativa de transferência |
| `ssh -L local:host:remota` | Cria túnel (port forwarding) |
| `ssh -i caminho/chave` | Escolhe a chave a usar |
| `ssh -v` | Modo verbose para depurar |

---

## Problemas Comuns e Soluções 🔧

### Problema: "Permission denied (publickey)"

**Solução:**
1. Confirme que a chave pública está em `~/.ssh/authorized_keys` no servidor.
2. Verifique as permissões de `~/.ssh` e da chave privada.
3. Rode `ssh -v user@host` para ver qual chave está sendo tentada.

### Problema: "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!"

**Solução:**
1. Confirme se o servidor foi realmente reinstalado/alterado (não ignore o aviso às cegas).
2. Se for legítimo, remova a entrada antiga: `ssh-keygen -R endereco-do-servidor`.

---

## 🔨 Desafio prático

**Objetivo:** Configurar acesso por chave e um atalho de conexão.

```bash
# 1. Gere uma chave: ssh-keygen -t ed25519
# 2. Veja a chave pública: cat ~/.ssh/id_ed25519.pub
# 3. Se tiver acesso a um servidor (ou uma VM local), rode ssh-copy-id
# 4. Conecte sem senha
# 5. Crie um Host no ~/.ssh/config e conecte pelo apelido
# 6. Opcional: adicione a chave pública na sua conta do GitHub
#    e teste com: ssh -T git@github.com
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Qual chave vai pro servidor: a pública ou a privada?
> A **pública** (`.pub`). A privada nunca sai da sua máquina.

> [!question]- Por que não ignorar o aviso `REMOTE HOST IDENTIFICATION HAS CHANGED`?
> O fingerprint salvo em `known_hosts` mudou: pode ser um servidor reinstalado ou um ataque *man-in-the-middle*. Confirme antes de rodar `ssh-keygen -R host`.

> [!question]- O que faz `ssh -L 5433:localhost:5432 ana@servidor`?
> Cria um túnel: tudo que você mandar pra porta **5433 local** chega na porta **5432 do servidor** (ex.: acessar o Postgres remoto como se fosse local).

> [!question]- Deu `Permission denied (publickey)`. O que checar?
> 1) A pública está em `~/.ssh/authorized_keys` no servidor? 2) Permissões 700/600? 3) `ssh -v` pra ver qual chave foi tentada.

> [!question]- Pra que colocar passphrase na chave?
> Se alguém copiar o arquivo da chave, ainda vai precisar da frase. O `ssh-agent` evita digitar toda hora.

---

## 🃏 Flashcards

#flashcards/ferramentas

Porta padrão do SSH::22
`ssh-keygen -t ed25519`::gera um par de chaves moderno
`ssh-copy-id user@host`::instala sua chave pública no servidor
`scp arq user@host:/caminho`::copia arquivo via SSH
Permissões de `~/.ssh` e da chave privada::700 na pasta, 600 na chave
`ssh -T git@github.com`::testa sua autenticação SSH no GitHub

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
-

**O que me confundiu / onde eu errei:**
-

**Onde eu usei de verdade:**
-

---

## Próximos Passos ✅

- [ ] Gerar sua primeira chave e cadastrá-la no GitHub
- [ ] Criar um arquivo `~/.ssh/config` com seus servidores
- [ ] Aprender túneis (port forwarding)
- [ ] Usar a extensão Remote - SSH do [[VS Code]]

---

## Recursos Recomendados 📚

### 📖 Livros:
- *SSH Mastery* (Michael W. Lucas) - Guia prático e direto sobre OpenSSH

### 💻 Sites e Documentação:
- [OpenSSH](https://www.openssh.com/manual.html) - Manuais oficiais
- [Documentação do GitHub sobre SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh) - Configuração com GitHub

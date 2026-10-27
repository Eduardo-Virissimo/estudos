# 📚 SSH

> *"Um túnel seguro entre você e qualquer máquina do mundo."*

---

## O que é SSH?

O **SSH** (*Secure Shell*) é um protocolo que permite acessar e controlar outro computador remotamente de forma **segura**. Toda a comunicação (comandos, senhas, arquivos) é **criptografada**, o que impede que alguém no meio do caminho leia ou altere os dados.

Ele é usado para administrar servidores, transferir arquivos, fazer deploys e até autenticar no GitHub.

### Uma História Breve 📜

O SSH foi criado em **1995** por **Tatu Ylönen**, na Finlândia, após um ataque de captura de senhas na rede da universidade dele. Ele substituiu protocolos inseguros como **Telnet** e **rlogin**, que enviavam tudo em texto puro. A implementação livre **OpenSSH** (projeto OpenBSD, 1999) é hoje a mais usada, e já vem incluída em Linux, macOS e Windows.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Acesso remoto seguro**: administre servidores de qualquer lugar.
- 📦 **Transferência de arquivos**: `scp` e `sftp` usam a mesma segurança.
- 🔧 **Autenticação por chave**: sem digitar senha, e mais seguro que senha.
- 🤖 **Integração com Git e CI/CD**: clones e deploys autenticados por chave.

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

## Exercício Prático 🎯

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

## Conclusão 🎉

O SSH é uma das ferramentas mais importantes para quem trabalha com servidores, Git e infraestrutura. Entender chaves, `known_hosts` e o arquivo `config` te dá segurança e produtividade.

Pratique em uma VM ou servidor de teste antes de usar em ambientes importantes.

---



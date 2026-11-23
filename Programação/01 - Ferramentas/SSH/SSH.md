---
nivel: escrito
foco: importante
revisado:
---

# SSH

**Quanto focar: 📌 importante.** Você vai usar pra conectar no GitHub e, mais pra frente, em servidores. Saiba gerar chave e conectar; a parte avançada fica pra quando aparecer.

Em algum momento, o seu programa vai sair do seu computador e morar num servidor: uma máquina em algum datacenter, sem tela e sem teclado, que fica ligada 24 horas por dia. E aí surge a pergunta: como você entra nela? Como roda um comando, olha um log, atualiza o programa, se ela está a centenas de quilômetros?

A resposta é o **SSH** (*Secure Shell*): um jeito de abrir um terminal em outro computador, pela rede, com tudo **criptografado**. Os comandos, as senhas e os arquivos viajam embaralhados, e ninguém no meio do caminho (o Wi-Fi do café, o provedor de internet) consegue ler.

E mesmo antes de ter um servidor, você já vai usar SSH: é o jeito mais comum de se autenticar no GitHub sem digitar senha a cada `git push`.

Tudo no SSH gira em torno de uma ideia que, quando você entende, o resto fica fácil: **o par de chaves.** Uma chave privada, que nunca sai do seu computador, e uma pública, que você entrega pros lugares onde quer entrar.

## O cadeado e a chave

Em vez de senha, o SSH usa um par de chaves, que você gera no seu computador:

```bash
ssh-keygen -t ed25519 -C "seu@email.com"
```

O `ed25519` é o tipo de chave (o moderno e recomendado), e o `-C` é só um comentário pra você reconhecer a chave depois. O comando cria dois arquivos em `~/.ssh/`:

- **`id_ed25519`**, a chave **privada**.
- **`id_ed25519.pub`**, a chave **pública** (repare no `.pub`).

A melhor forma de entender a diferença entre elas é pensar em um **cadeado e a sua chave**. A chave pública é o **cadeado**: você pode fazer quantas cópias quiser e distribuir pros servidores e pro GitHub, que instalam ele na porta. A chave privada é a **única chave** que abre esses cadeados, e ela nunca sai do seu bolso. Qualquer pessoa pode ver o cadeado sem problema nenhum. Só você abre.

Com essa imagem, a pergunta clássica "qual chave vai pro servidor?" se responde sozinha: a **pública**, o `.pub`. Ela vai pro arquivo `~/.ssh/authorized_keys` do servidor, ou nas configurações de SSH do GitHub. Já a privada, se você mandar pra alguém, essa pessoa entra em tudo como se fosse você. **Nunca compartilhe, nunca cole em lugar nenhum.**

Pra instalar o seu "cadeado" num servidor, existe um comando pronto:

```bash
ssh-copy-id ana@192.168.0.10
```

Na hora de gerar a chave, o `ssh-keygen` pergunta por uma **passphrase**, uma frase-senha. Vale a pena colocar: se alguém um dia copiar o arquivo da sua chave privada, ainda vai precisar da frase pra usar. E pra você não ter que digitar essa frase a cada conexão, existe o `ssh-agent`, que guarda ela enquanto você está logado.

Tem mais um detalhe que confunde no Linux e no macOS: o SSH **se recusa a usar** uma chave que outras pessoas do computador conseguem ler. Parece implicância, mas é proteção: se outros usuários podem ler a sua chave, ela não é mais secreta. As permissões certas são estas:

```bash
chmod 700 ~/.ssh               # a pasta: só você
chmod 600 ~/.ssh/id_ed25519    # a chave privada: só você lê e escreve
```

## Conectando

Com a chave no lugar, entrar num servidor é um comando:

```bash
ssh ana@192.168.0.10           # usuário@endereço
ssh -p 2222 ana@192.168.0.10   # numa porta diferente (o padrão é a 22)
```

Você roda o **cliente** (`ssh`), que conversa com o **servidor** SSH que está rodando na outra máquina, normalmente na porta 22. Se der certo, o prompt muda, e tudo o que você digitar a partir dali roda lá.

Digitar usuário, endereço e porta toda vez cansa rápido. Pra isso existe o arquivo `~/.ssh/config`, onde você cria **apelidos**:

```text
Host meu-servidor
    HostName 192.168.0.10
    User ana
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

E a partir daí, é só `ssh meu-servidor`.

Pra testar se o GitHub reconhece a sua chave:

```bash
ssh -T git@github.com
# Hi seu-usuario! You've successfully authenticated...
```

O erro que você mais vai ver no começo é este: `Permission denied (publickey)`. Ele quer dizer que o servidor não aceitou nenhuma das suas chaves. As suspeitas, em ordem: a chave pública não está no `authorized_keys` do servidor (ou não foi cadastrada no GitHub); as permissões de `~/.ssh` estão erradas; ou o SSH está oferecendo outra chave. Pra ver o que está acontecendo, rode com `-v` (de *verbose*): `ssh -v ana@servidor` mostra cada chave que foi tentada.

## O aviso que você nunca ignora

Esta é a parte mais importante da nota do ponto de vista de segurança.

Na primeira vez que você conecta num servidor, o SSH mostra a **impressão digital** dele (o *fingerprint*, um código único daquele servidor) e pergunta se você confia. Se você responder sim, ele guarda essa impressão em `~/.ssh/known_hosts`. Nas próximas vezes, o SSH confere em silêncio se é o mesmo servidor. Até que um dia aparece isto:

```text
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

A impressão digital mudou. Isso pode significar duas coisas. Uma é inofensiva: o servidor foi reinstalado e ganhou uma identidade nova. A outra não: **alguém está se passando pelo servidor** pra interceptar a sua conexão, um ataque chamado *man-in-the-middle*. O SSH não tem como saber qual das duas é, então ele para tudo e avisa.

A tentação é pesquisar o erro, achar o comando que faz ele sumir, e seguir em frente. **Não faça isso às cegas.** Confirme com quem cuida do servidor se ele foi mesmo reinstalado. Só então remova a entrada antiga:

```bash
ssh-keygen -R endereco-do-servidor
```

## Mais coisas que passam pelo SSH

Já que existe uma conexão segura entre os dois computadores, dá pra mandar mais do que comandos por ela. O `scp` copia arquivos:

```bash
scp relatorio.pdf ana@servidor:/home/ana/   # envia um arquivo
scp -r ana@servidor:/var/log/app ./logs      # baixa uma pasta inteira
```

E existe um truque mais avançado, que parece mágica na primeira vez: o **túnel**. Ele faz uma porta do servidor aparecer como se estivesse no seu computador.

```bash
ssh -L 5433:localhost:5432 ana@servidor
```

Enquanto esse comando estiver rodando, conectar em `localhost:5433` no seu computador é o mesmo que conectar no banco de dados que está na porta 5432 do servidor, com tudo passando pela conexão criptografada. É assim que se acessa um banco de produção sem deixar ele exposto pra internet.

Por fim, num servidor que é seu, depois de testar que a chave funciona, dá pra **desligar o login por senha** (`PasswordAuthentication no` no arquivo `sshd_config`). Chaves são muito mais difíceis de quebrar que senhas, e assim quem não tem uma chave cadastrada simplesmente não entra, nem tentando milhões de senhas.

Uma curiosidade: o SSH foi criado em 1995 por Tatu Ylönen, na Finlândia, depois que um ataque roubou senhas na rede da universidade dele. Ele substituiu o Telnet, que mandava tudo, inclusive as senhas, como texto puro pela rede. Hoje a versão livre, o **OpenSSH**, já vem instalada no Linux, no macOS e no Windows.

## O essencial

1. A chave privada nunca sai do seu computador. A pública (`.pub`) é a que vai pro servidor e pro GitHub.
2. `ssh usuario@endereco` conecta; o `~/.ssh/config` cria apelidos.
3. `Permission denied (publickey)`: confira o `authorized_keys`, as permissões (700/600) e use `ssh -v`.
4. `REMOTE HOST IDENTIFICATION HAS CHANGED` é um alarme. Confirme antes de apagar a entrada.

## Agora é com você

Gere a sua chave com `ssh-keygen -t ed25519`, olhe a pública com `cat ~/.ssh/id_ed25519.pub`, cadastre no GitHub e teste com `ssh -T git@github.com`. Se tiver acesso a um servidor ou a uma máquina virtual, instale a chave com `ssh-copy-id`, conecte sem senha, e crie um apelido no `~/.ssh/config`.

Depois, um projeto que mexe no seu próprio dia a dia: **passar o vault a usar SSH no GitHub, com commits Verified.** Gere uma chave `ed25519` com passphrase e deixe o `ssh-agent` do Windows guardando ela (`Get-Service ssh-agent` mostra se ele está rodando). Cadastre a pública no GitHub e confira com `ssh -T git@github.com`. Troque o remote do vault pra SSH com `git remote set-url origin git@github.com:Eduardo-Virissimo/estudos.git`, e faça um push sair pelo plugin Git do Obsidian. Se algo estiver errado, o push simplesmente para, então você só termina quando entendeu de verdade. Pra ir além, use a mesma chave pra **assinar os commits** (`git config gpg.format ssh`, `user.signingkey` e `commit.gpgsign true`) e veja o selo **Verified** aparecer no GitHub, e atualize a seção de Git do `Configs/README.md` com o jeito novo. Você terminou quando o push sair sem pedir login e o último commit aparecer como Verified.

O próximo passo é [[GitHub e Pull Requests]].

---

## 🧠 Me teste

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

> [!question]- Porta padrão do SSH
> 22

> [!question]- `ssh-keygen -t ed25519`
> gera um par de chaves moderno

> [!question]- `ssh-copy-id user@host`
> instala sua chave pública no servidor

> [!question]- `scp arq user@host:/caminho`
> copia arquivo via SSH

> [!question]- Permissões de `~/.ssh` e da chave privada
> 700 na pasta, 600 na chave

> [!question]- `ssh -T git@github.com`
> testa sua autenticação SSH no GitHub

> [!question]+ Pra acessar um servidor sem senha, qual arquivo você copia para ele?
> - a) `~/.ssh/id_ed25519`
> - b) `~/.ssh/id_ed25519.pub`
> - c) `~/.ssh/known_hosts`
> - d) `~/.ssh/config`
>
> > [!check]- Resposta
> > **b)** Vai a **pública** (`.pub`), que entra no `authorized_keys` do servidor. A privada nunca sai do seu PC: quem tem ela entra como você.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `ssh user@host` | Conecta a um servidor |
| `ssh-keygen -t ed25519` | Gera um par de chaves |
| `ssh-copy-id user@host` | Instala sua chave pública no servidor |
| `scp origem destino` | Copia arquivos via SSH |
| `sftp user@host` | Sessão interativa de transferência |
| `ssh -L local:host:remota` | Cria um túnel |
| `ssh -i caminho/chave` | Escolhe qual chave usar |
| `ssh -v` | Mostra os detalhes, pra depurar |
| `ssh-keygen -R host` | Remove um servidor do `known_hosts` |

**Pra ler:** a [documentação do GitHub sobre SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh) está em português e leva pela mão, do gerar a chave até testar. Pra entender a fundo, *SSH Mastery*, de Michael W. Lucas, é curto e prático. E os [manuais do OpenSSH](https://www.openssh.com/manual.html) são a referência oficial.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

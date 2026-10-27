# 📚 Bash

> *"Se você faz algo duas vezes no terminal, provavelmente deveria virar um script."*

---

## O que é Bash?

O **Bash** (*Bourne-Again SHell*) é um shell e linguagem de script usado em sistemas Linux e disponível em macOS e Windows (via WSL ou Git Bash). Ele interpreta os comandos digitados no [[estudos/Programação/01 - Ferramentas/Terminal/README|Terminal]] e permite escrever **scripts** que automatizam tarefas: backups, deploys, processamento de arquivos, etc.

### Uma História Breve 📜

O Bash foi criado por **Brian Fox** em **1989** para o projeto GNU, como substituto livre do shell Bourne (`sh`) — daí o trocadilho "Bourne-Again". Tornou-se o shell padrão da maioria das distribuições Linux. No macOS, o shell padrão passou a ser o **Zsh** a partir do Catalina (2019), mas o Bash continua disponível e muito usado em scripts.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Automação rápida**: transforma tarefas repetitivas em um único comando.
- 📦 **Presente em todo lugar**: servidores, containers Docker, pipelines de CI.
- 🔧 **Cola entre ferramentas**: combina programas pequenos via pipes e redirecionamentos.
- 🤖 **Base para DevOps**: scripts de build, deploy e manutenção.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Scripts e shebang

Um script é um arquivo de texto com comandos. A primeira linha indica o interpretador.

```bash
#!/usr/bin/env bash
echo "Olá, mundo!"
```

Para executar:

```bash
chmod +x ola.sh    # dá permissão de execução
./ola.sh
```

### Conceito 2: Variáveis

```bash
nome="Ana"
echo "Olá, $nome"
echo "Arquivos aqui: $(ls | wc -l)"   # substituição de comando
```

> Sem espaços ao redor do `=` na atribuição.

### Conceito 3: Condicionais e laços

```bash
if [ -f "arquivo.txt" ]; then
    echo "Existe"
else
    echo "Não existe"
fi

for arq in *.txt; do
    echo "Processando $arq"
done
```

### Conceito 4: Pipes e redirecionamentos

```bash
cat log.txt | grep "ERRO" > erros.txt   # filtra e salva
comando >> saida.log 2>&1               # anexa saída e erros
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

```bash
#!/usr/bin/env bash
read -p "Qual seu nome? " nome
echo "Bem-vindo, $nome!"
```

### Exemplo 2: Caso de Uso Real

Backup simples com data no nome:

```bash
#!/usr/bin/env bash
set -euo pipefail

origem="$HOME/projetos"
destino="$HOME/backups/projetos_$(date +%Y%m%d).tar.gz"

mkdir -p "$HOME/backups"
tar -czf "$destino" "$origem"
echo "Backup criado em $destino"
```

---

## Configurações Recomendadas ⚙️

Arquivo `~/.bashrc` (executado ao abrir um shell interativo), onde ficam aliases e variáveis:

```bash
alias ll='ls -la'
alias gs='git status'
export EDITOR=nano
```

Aplicar sem reabrir o terminal:

```bash
source ~/.bashrc
```

---

## Dicas de Ouro 💎

### 1. Use `set -euo pipefail` em scripts

Faz o script parar em erros e em variáveis não definidas, evitando surpresas silenciosas.

### 2. Sempre coloque variáveis entre aspas

`"$arquivo"` evita bugs quando o nome contém espaços.

### 3. Teste com ShellCheck

O [ShellCheck](https://www.shellcheck.net/) analisa seus scripts e aponta erros comuns. É praticamente um [[Linter]] para Bash.

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `#!/usr/bin/env bash` | Define o interpretador do script |
| `$variavel` | Usa o valor de uma variável |
| `$(comando)` | Usa a saída de um comando |
| `if [ ... ]; then` | Condicional |
| `for x in lista; do` | Laço de repetição |
| `\|` | Pipe: saída → entrada |
| `>` / `>>` | Redireciona (sobrescreve / anexa) |
| `chmod +x` | Torna arquivo executável |
| `$1`, `$2` | Argumentos passados ao script |

---

## Exercício Prático 🎯

**Objetivo:** Criar um script que organiza arquivos por extensão.

```bash
# 1. Crie organizar.sh com shebang e permissão de execução
# 2. Percorra os arquivos da pasta atual com um for
# 3. Para cada arquivo, descubra a extensão
# 4. Crie uma pasta com o nome da extensão (mkdir -p)
# 5. Mova o arquivo para a pasta correspondente
```

---

## Próximos Passos ✅

- [ ] Escrever 3 pequenos scripts para tarefas do seu dia a dia
- [ ] Aprender funções e argumentos (`$1`, `$@`)
- [ ] Estudar `grep`, `sed` e `awk`, que combinam muito com Bash
- [ ] Rodar o ShellCheck nos seus scripts

---

## Recursos Recomendados 📚

### 📖 Livros:
- *The Linux Command Line* (William Shotts) - Inclui uma parte dedicada a shell scripting
- *Learning the bash Shell* (Cameron Newham) - Livro clássico focado em Bash

### 💻 Sites e Documentação:
- [Manual do GNU Bash](https://www.gnu.org/software/bash/manual/) - Documentação oficial
- [ShellCheck](https://www.shellcheck.net/) - Analisador de scripts

---

## Problemas Comuns e Soluções 🔧

### Problema: "Permission denied" ao executar o script

**Solução:**
1. Rode `chmod +x script.sh`.
2. Execute com `./script.sh` (o `./` indica a pasta atual).

### Problema: "command not found" com `^M` ou erros estranhos

**Solução:**
1. O arquivo pode ter finais de linha do Windows (CRLF).
2. Converta para LF no editor (VS Code: canto inferior direito) ou com `dos2unix script.sh`.

---

## Conclusão 🎉

O Bash é a linguagem de automação do dia a dia em ambientes Linux e servidores. Mesmo scripts pequenos já poupam muito tempo, e o conhecimento se aplica diretamente a CI/CD, Docker e DevOps.

Comece com tarefas simples e vá ganhando confiança antes de partir para scripts maiores.

---



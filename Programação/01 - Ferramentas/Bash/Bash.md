---
nivel: escrito
revisado:
---

# Bash

> *"Se você faz algo duas vezes no terminal, provavelmente deveria virar um script."*

> [!tip] ⚡ Em 30 segundos
> Shell padrão do Linux e linguagem pra **automatizar o terminal**. Se você digitou a mesma sequência de comandos duas vezes, ela vira script: shebang, variáveis, `if`, `for` e pipes.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever e executar um script com shebang e permissão de execução
- Usar variáveis, `if` e `for` para automatizar uma tarefa repetida
- Deixar scripts seguros com aspas e `set -euo pipefail`

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Terminal]]
- **Depois:** [[Regex]] · [[SSH]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é Bash?

O **Bash** (*Bourne-Again SHell*) é um shell e linguagem de script usado em sistemas Linux e disponível em macOS e Windows (via WSL ou Git Bash). Ele interpreta os comandos digitados no [[Terminal]] e permite escrever **scripts** que automatizam tarefas: backups, deploys, processamento de arquivos, etc.

> [!note]- 📜 Um pouco de história
> O Bash foi criado por **Brian Fox** em **1989** para o projeto GNU, como substituto livre do shell Bourne (`sh`) — daí o trocadilho "Bourne-Again". Tornou-se o shell padrão da maioria das distribuições Linux. No macOS, o shell padrão passou a ser o **Zsh** a partir do Catalina (2019), mas o Bash continua disponível e muito usado em scripts.

---

## 🧱 Conceitos-chave

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

## 🛠️ Exemplos guiados

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

## ⚙️ Configuração recomendada

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

## 💎 Boas práticas

### 1. Use `set -euo pipefail` em scripts

Faz o script parar em erros e em variáveis não definidas, evitando surpresas silenciosas.

### 2. Sempre coloque variáveis entre aspas

`"$arquivo"` evita bugs quando o nome contém espaços.

### 3. Teste com ShellCheck

O [ShellCheck](https://www.shellcheck.net/) analisa seus scripts e aponta erros comuns. É praticamente um [[Linter]] para Bash.

---

## 🔧 Erros comuns e como resolver

### Problema: "Permission denied" ao executar o script

**Solução:**
1. Rode `chmod +x script.sh`.
2. Execute com `./script.sh` (o `./` indica a pasta atual).

### Problema: "command not found" com `^M` ou erros estranhos

**Solução:**
1. O arquivo pode ter finais de linha do Windows (CRLF).
2. Converta para LF no editor (VS Code: canto inferior direito) ou com `dos2unix script.sh`.

---

## 🔨 Desafio prático

**Objetivo:** Criar um script que organiza arquivos por extensão.

```bash
# 1. Crie organizar.sh com shebang e permissão de execução
# 2. Percorra os arquivos da pasta atual com um for
# 3. Para cada arquivo, descubra a extensão
# 4. Crie uma pasta com o nome da extensão (mkdir -p)
# 5. Mova o arquivo para a pasta correspondente
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Por que `nome = "Ana"` dá erro?
> O Bash não aceita espaços ao redor do `=`. Ele entende `nome` como um comando com os argumentos `=` e `"Ana"`.

> [!question]- Qual a diferença entre `>` e `>>`?
> `>` **sobrescreve** o arquivo; `>>` **anexa** no final.

> [!question]- O que `2>&1` faz?
> Manda a saída de erro (stderr, 2) para o mesmo lugar da saída normal (stdout, 1).

> [!question]- Pra que serve `set -euo pipefail`?
> `-e` para no primeiro erro, `-u` dá erro em variável não definida, `pipefail` faz um pipe falhar se *qualquer* comando dele falhar.

> [!question]- Por que escrever `"$arquivo"` com aspas?
> Sem aspas, um nome com espaço (`meu arquivo.txt`) vira dois argumentos e o comando quebra.

> [!question]- `#!/usr/bin/env bash`
> shebang: diz qual interpretador roda o script

> [!question]- `$(comando)`
> substituição de comando: usa a saída do comando como valor

> [!question]- `$1` / `$@`
> primeiro argumento / todos os argumentos do script

> [!question]- `chmod +x script.sh`
> dá permissão de execução

> [!question]- `source ~/.bashrc`
> recarrega as configurações no shell atual

> [!question]- Erro com `^M` ou `\r`
> arquivo com quebra de linha CRLF (Windows); converter pra LF

---

## 📋 Cola rápida

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

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
-

**O que me confundiu / onde eu errei:**
-

**Onde eu usei de verdade:**
-

---

## ➡️ Próximos passos

- [ ] Escrever 3 pequenos scripts para tarefas do seu dia a dia
- [ ] Aprender funções e argumentos (`$1`, `$@`)
- [ ] Estudar `grep`, `sed` e `awk`, que combinam muito com Bash
- [ ] Rodar o ShellCheck nos seus scripts

---

## 📚 Recursos

### 📖 Livros:
- *The Linux Command Line* (William Shotts) - Inclui uma parte dedicada a shell scripting
- *Learning the bash Shell* (Cameron Newham) - Livro clássico focado em Bash

### 💻 Sites e Documentação:
- [Manual do GNU Bash](https://www.gnu.org/software/bash/manual/) - Documentação oficial
- [ShellCheck](https://www.shellcheck.net/) - Analisador de scripts

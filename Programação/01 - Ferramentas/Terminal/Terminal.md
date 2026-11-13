---
nivel: escrito
revisado:
---

# Terminal

> *"A interface gráfica mostra o que você pode fazer. O terminal permite fazer qualquer coisa."*

> [!tip] ⚡ Em 30 segundos
> A janela onde você conversa com o sistema **digitando comandos**. Terminal ≠ shell: o terminal é a janela, o shell (Bash, PowerShell) é quem interpreta. A base: navegar (`cd`, `ls`), mexer em arquivos e encadear com pipes.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Navegar entre pastas usando caminhos relativos e absolutos
- Ler qualquer comando como *comando + opções + argumentos*
- Encadear comandos com pipe (`|`) e salvar a saída com `>`

---

## 🧭 Onde isso se encaixa

- **Antes:** nada, é um ponto de partida.
- **Depois:** [[Bash]] · [[PowerShell]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é o Terminal?

O **terminal** é uma interface de **linha de comando (CLI)**: você digita comandos em texto e o sistema operacional executa. Em vez de clicar em ícones e menus, você conversa diretamente com o computador.

Três termos que costumam se confundir:

- **Terminal (emulador de terminal)**: a janela onde você digita (ex.: Windows Terminal, iTerm2, GNOME Terminal).
- **Shell**: o programa que interpreta os comandos (ex.: Bash, Zsh, PowerShell).
- **Console**: termo antigo para o terminal físico/ligado direto ao sistema; hoje costuma ser usado como sinônimo.

> [!note]- 📜 Um pouco de história
> Os terminais surgiram nos anos 1960-70 como equipamentos físicos (teletipos e depois monitores como o DEC VT100) ligados a computadores centrais. Hoje são programas que **emulam** esses aparelhos, e o padrão de funcionamento se manteve: texto entra, texto sai.

---

## 🧱 Conceitos-chave

### Conceito 1: Diretório atual e caminhos

Você sempre está "dentro" de uma pasta. Os caminhos podem ser **absolutos** (a partir da raiz) ou **relativos** (a partir de onde você está).

```bash
pwd                 # mostra a pasta atual
cd Documentos       # entra na pasta (caminho relativo)
cd ..               # sobe um nível
cd ~                # vai para a pasta do usuário
```

### Conceito 2: Comando, opções e argumentos

```bash
ls -la /home/usuario
# ls        -> comando
# -la       -> opções (flags)
# /home/... -> argumento
```

### Conceito 3: Entrada, saída e pipes

Você pode encadear comandos: a saída de um vira entrada do próximo.

```bash
ls | grep ".txt"        # lista arquivos e filtra os .txt
echo "olá" > arq.txt    # redireciona a saída para um arquivo
```

---

## 🛠️ Exemplos guiados

### Exemplo 1: Uso Básico

Criar uma estrutura de projeto:

```bash
mkdir meu-projeto
cd meu-projeto
touch index.js README.md
ls
```

### Exemplo 2: Caso de Uso Real

Procurar onde uma função é usada no projeto e contar ocorrências:

```bash
grep -rn "minhaFuncao" ./src
grep -r "TODO" ./src | wc -l
```

---

## ⚙️ Configuração recomendada

No Windows, o **Windows Terminal** permite definir o perfil padrão e a aparência em um arquivo JSON (`settings.json`):

```json
{
    "defaultProfile": "{guid-do-seu-perfil}",
    "profiles": {
        "defaults": {
            "font": { "face": "Cascadia Code", "size": 12 }
        }
    }
}
```

> O GUID do perfil aparece no próprio arquivo de configurações.

---

## 💎 Boas práticas

### 1. Use `Tab` para autocompletar

Digite o começo do nome de arquivos e comandos e aperte `Tab`. Economiza digitação e evita erros.

### 2. Setas para cima e `Ctrl + R`

`↑` recupera comandos anteriores. `Ctrl + R` (no Bash/Zsh) busca no histórico por trecho digitado.

### 3. Cuidado com comandos destrutivos

`rm` não manda para a lixeira. Confira o caminho antes de apertar Enter, principalmente com `rm -rf`.

---

## 🔧 Erros comuns e como resolver

### Problema: "command not found" / "não é reconhecido como comando"

**Solução:**
1. Verifique se digitou o nome corretamente.
2. Confirme se o programa está instalado.
3. Verifique se ele está no `PATH` do sistema e reabra o terminal.

### Problema: "Permission denied"

**Solução:**
1. Confira se você tem permissão no arquivo/pasta (`ls -l`).
2. Se necessário, use `sudo` (Linux/macOS), sabendo exatamente o que o comando faz.

---

## 🔨 Desafio prático

**Objetivo:** Navegar e manipular arquivos usando só o terminal.

```bash
# 1. Crie uma pasta chamada laboratorio e entre nela
# 2. Crie 3 arquivos: a.txt, b.txt, c.txt
# 3. Escreva "teste" dentro de a.txt usando echo e >
# 4. Copie a.txt para d.txt
# 5. Liste tudo com detalhes
# 6. Apague b.txt e c.txt
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Qual a diferença entre terminal e shell?
> O **terminal** é a janela (Windows Terminal, iTerm2). O **shell** é o programa que interpreta os comandos (Bash, Zsh, PowerShell).

> [!question]- Caminho absoluto vs relativo: dê um exemplo de cada.
> Absoluto parte da raiz: `/home/ana/projetos` ou `C:\Users\ana`. Relativo parte de onde você está: `./src`, `../docs`.

> [!question]- Em `ls -la /home`, o que é comando, opção e argumento?
> `ls` = comando · `-la` = opções · `/home` = argumento.

> [!question]- O que acontece em `ls | grep ".txt"`?
> O pipe `|` entrega a saída do `ls` como entrada do `grep`, que filtra só as linhas com `.txt`.

> [!question]- Apareceu "não é reconhecido como comando". O que checar?
> Digitação, se o programa está instalado e se ele está no `PATH`. Depois de mexer no PATH, reabra o terminal.

> [!question]- `pwd`
> mostra a pasta atual

> [!question]- `cd ..`
> sobe um nível

> [!question]- `~`
> pasta do usuário (home)

> [!question]- `Ctrl + R`
> busca no histórico de comandos (Bash/Zsh)

> [!question]- `Tab`
> autocompleta nomes de arquivos e comandos

> [!question]- `rm` manda pra lixeira?
> Não. Apaga direto, sem volta.

---

## 📋 Cola rápida

| Comando/Sintaxe | Função |
|-----------------|--------|
| `pwd` | Mostra a pasta atual |
| `ls` | Lista arquivos e pastas |
| `cd` | Muda de pasta |
| `mkdir` | Cria pasta |
| `touch` | Cria arquivo vazio |
| `cp` / `mv` | Copia / move (ou renomeia) |
| `rm` | Remove arquivos |
| `cat` | Mostra o conteúdo de um arquivo |
| `clear` | Limpa a tela |
| `man comando` | Abre o manual (Linux/macOS) |

> No PowerShell alguns desses nomes funcionam como apelidos (aliases) de cmdlets.

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

- [ ] Praticar os comandos básicos por alguns dias
- [ ] Aprender sobre pipes e redirecionamentos
- [ ] Estudar [[Bash]] ou [[PowerShell]], conforme seu sistema
- [ ] Criar seu primeiro script automatizando uma tarefa

---

## 📚 Recursos

### 📖 Livros:
- *The Linux Command Line* (William Shotts) - Introdução completa à linha de comando

### 💻 Sites e Documentação:
- [Windows Terminal (documentação)](https://learn.microsoft.com/windows/terminal/) - Configuração do Windows Terminal
- [The Linux Command Line (versão online)](https://linuxcommand.org/tlcl.php) - Livro disponível gratuitamente

---
nivel: escrito
foco: importante
revisado:
---

# Bash

**Quanto focar: 📌 importante.** Servidor, Docker e CI rodam Linux, então você vai esbarrar em Bash cedo. Saiba ler e escrever um script curto; não precisa virar especialista.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Toda sexta-feira você faz a mesma coisa: abre o terminal, cria uma pasta de backup, compacta a pasta de projetos, dá um nome com a data de hoje e confere se o arquivo apareceu. São quatro comandos. Na primeira semana você digita com cuidado. Na terceira, já no automático, esquece um pedaço da data e sobrescreve o backup da semana anterior.

Esse é o momento em que vale aprender **Bash**. Até aqui você usava o terminal como um lugar pra digitar comandos, um de cada vez. Mas o Bash, o shell padrão do Linux, também é uma pequena linguagem de programação. Os mesmos comandos que você digita podem ir pra um arquivo, e esse arquivo vira um programa que repete a tarefa sempre do mesmo jeito, sem esquecer nada.

Uma boa regra: **se você digitou a mesma sequência de comandos duas vezes, ela merece virar um script.**

No Windows, você usa o Bash pelo **Git Bash** (que vem junto com o Git) ou pelo WSL. Se o [[Terminal]] ainda parece estranho, vale passar por aquela nota primeiro.

## Seu primeiro script

Um script Bash é só um arquivo de texto com comandos, um por linha. Crie um arquivo `ola.sh` com isto:

```bash
#!/usr/bin/env bash
echo "Olá, mundo!"
```

A primeira linha tem um nome engraçado, **shebang** (de *hash* `#` + *bang* `!`), e serve pra uma coisa só: dizer ao sistema qual programa deve ler o resto do arquivo. Aqui, ela diz "procure o `bash` e entregue o arquivo pra ele".

Agora tente rodar com `./ola.sh`. A primeira coisa que você provavelmente vai ver é isto:

```
bash: ./ola.sh: Permission denied
```

Calma, não tem nada de errado com o script. Por segurança, um arquivo recém-criado não tem permissão pra ser executado como programa. Você precisa liberar uma vez:

```bash
chmod +x ola.sh    # "change mode": adiciona (+) permissão de execução (x)
./ola.sh           # agora funciona
```

E o `./` na frente não é enfeite. Sem ele, o Bash procura um comando chamado `ola.sh` nas pastas do sistema (o PATH), e não na pasta onde você está. O `./` quer dizer "este arquivo aqui, desta pasta".

Se você está no Windows e o erro for outro, algo com `^M` ou `$'\r': command not found`, o problema é invisível: o editor salvou o arquivo com as quebras de linha do Windows (CRLF), e o Bash só entende as do Linux (LF). No VS Code, clique em `CRLF` no canto inferior direito da tela e troque pra `LF`.

Com isso, o backup de sexta-feira fica assim:

```bash
#!/usr/bin/env bash
set -euo pipefail

origem="$HOME/projetos"
destino="$HOME/backups/projetos_$(date +%Y%m%d).tar.gz"

mkdir -p "$HOME/backups"
tar -czf "$destino" "$origem"
echo "Backup criado em $destino"
```

Ainda tem coisas aí que não explicamos (as aspas, o `$( )`, aquele `set` misterioso na segunda linha). Cada uma delas existe por um motivo, e o resto da nota é sobre esses motivos.

## Variáveis, e o espaço que apaga o arquivo errado

Quem vem de outra linguagem costuma escrever a primeira variável assim:

```bash
nome = "Ana"
```

E o Bash responde `nome: command not found`. Parece implicância, mas faz sentido quando você lembra que, no Bash, **a primeira palavra de uma linha é sempre um comando**. Com espaços, ele lê a linha como "rode o comando `nome` com os argumentos `=` e `"Ana"`". Pra guardar um valor, tudo tem que vir colado:

```bash
nome="Ana"
echo "Olá, $nome"
```

Repare que o `$` só aparece na hora de **ler** a variável. Na hora de guardar, ele não entra.

Também dá pra guardar o resultado de um comando. É isso que o `$(date +%Y%m%d)` do backup fazia: roda o `date`, pega o que ele imprimiu (`20261118`) e coloca no lugar.

```bash
quantos="$(ls | wc -l)"
echo "Tem $quantos arquivos aqui"
```

Agora a parte que realmente importa nesta seção, porque é onde scripts causam estrago de verdade. Imagine um arquivo chamado `meu relatório.txt`:

```bash
arquivo="meu relatório.txt"
rm $arquivo
```

Antes de rodar o `rm`, o Bash troca `$arquivo` pelo valor dela e **quebra o resultado nos espaços**. O comando que ele executa de fato é `rm meu relatório.txt`, com dois argumentos: um arquivo chamado `meu` e outro chamado `relatório.txt`. Se nenhum dos dois existir, você só ganha um erro. Se existir um arquivo chamado `meu` na pasta, ele some.

A correção é simples, e vale como hábito pra vida toda: **variável sempre entre aspas.**

```bash
rm "$arquivo"   # um argumento só: "meu relatório.txt"
```

No seu vault, onde as pastas se chamam coisas como `Inglês/01 - Técnicas`, esquecer as aspas não é um risco teórico. É o que vai acontecer no primeiro script que você escrever.

## Pra onde vai o que o comando imprime

Todo comando tem duas saídas separadas, mesmo que no terminal elas apareçam misturadas. Uma é a **saída normal** (stdout, canal 1), e a outra é a de **erros** (stderr, canal 2). Elas são separadas por um bom motivo: assim você pode guardar o resultado num arquivo e continuar vendo os erros na tela, ou o contrário.

O Bash deixa mandar cada uma pra onde você quiser:

```bash
./backup.sh > log.txt        # saída normal vai pro arquivo (apagando o que tinha)
./backup.sh >> log.txt       # saída normal vai pro FIM do arquivo
./backup.sh 2> erros.txt     # só os erros vão pro arquivo
./backup.sh >> log.txt 2>&1  # as duas vão pro fim do mesmo arquivo
```

A diferença entre `>` e `>>` é pequena na escrita e enorme no resultado. `>` **apaga** o arquivo antes de escrever. Se você agenda o backup pra rodar toda sexta com `> log.txt`, daqui a um ano o log tem uma semana só, a última. Pra log, quase sempre você quer `>>`.

O `2>&1` assusta na primeira vez, mas dá pra ler em voz alta: "mande o canal 2 pro mesmo lugar do canal 1". Como o canal 1 já está indo pro `log.txt`, os erros vão junto.

E existe o `|` (pipe), que em vez de mandar a saída pra um arquivo, manda pra **outro comando**:

```bash
cat log.txt | grep "ERRO"            # mostra só as linhas com ERRO
cat log.txt | grep "ERRO" > erros.txt   # e guarda num arquivo
```

É juntando comandos pequenos com pipe que o Bash fica poderoso. Cada comando faz uma coisa só, e você monta a sequência.

## Faça o script parar quando algo der errado

Isto aqui é a coisa mais importante da nota, e a menos óbvia. **Por padrão, quando um comando de um script falha, o Bash ignora e segue pro próximo.**

Pense no que isso significa num script assim:

```bash
cd /pasta/de/arquivos/temporarios
rm -rf *
```

Se a pasta não existir (você digitou o nome errado, ou ela foi renomeada), o `cd` falha, o Bash não liga, e o `rm -rf *` roda **na pasta onde você estava**. Que pode ser a sua pasta de projetos.

Por isso, a segunda linha de todo script seu deve ser esta:

```bash
set -euo pipefail
```

São três proteções numa linha. O `-e` faz o script parar no primeiro comando que falhar, que é exatamente o que salvaria o exemplo acima. O `-u` faz o Bash reclamar quando você usa uma variável que não existe, em vez de fingir que ela está vazia (uma variável com nome digitado errado num `rm -rf "$pasta/"` vira `rm -rf /`). E o `-o pipefail` resolve um caso mais sutil: num `comando_a | comando_b`, por padrão só o resultado do último conta, então uma falha no `comando_a` passaria despercebida.

Uma segunda rede de segurança é o [ShellCheck](https://www.shellcheck.net/). Você cola o script lá (ou instala a extensão no VS Code) e ele aponta variável sem aspas, comando que pode falhar e vários outros erros clássicos. É um [[Linter]] pro Bash, e ele pega quase tudo o que esta nota ensina a evitar.

## Decidir e repetir

Até aqui o script faz sempre a mesma coisa, em linha reta. Pra ele tomar decisões e repetir tarefas, o Bash tem `if` e `for`, com uma sintaxe que parece ter vindo de outra época (e veio):

```bash
if [ -f "arquivo.txt" ]; then
    echo "O arquivo existe"
else
    echo "Não existe"
fi
```

O `if` termina com `fi`, que é `if` de trás pra frente. Os colchetes testam alguma coisa: `-f` pergunta "isto é um arquivo que existe?", e `-d` pergunta "isto é uma pasta?". E os espaços dentro dos colchetes são obrigatórios, pelo mesmo motivo de antes: `[` é um comando, e `[-f` não é.

Pra repetir, o `for` percorre uma lista. Aqui, todos os `.txt` da pasta:

```bash
for arq in *.txt; do
    echo "Processando $arq"
done
```

Um script também pode receber informação de fora. O que você escreve depois do nome do script chega como `$1`, `$2` e assim por diante, e `$@` é a lista inteira. Se preferir perguntar na hora, existe o `read`:

```bash
echo "Primeiro argumento: $1"
read -p "Qual seu nome? " nome
echo "Bem-vindo, $nome!"
```

## O seu terminal, do seu jeito

Existe um script que você nunca roda, mas que roda sozinho toda vez que você abre o Bash: o `~/.bashrc`. É nele que ficam os atalhos que deixam o terminal com a sua cara.

```bash
alias ll='ls -la'
alias gs='git status'
export EDITOR=nano
```

Depois de editar, você não precisa fechar e abrir o terminal. `source ~/.bashrc` relê o arquivo na hora.

Uma curiosidade pra fechar: o Bash nasceu em 1989, criado por Brian Fox como uma versão livre do antigo shell Bourne (`sh`). Daí o nome, um trocadilho: *Bourne-Again SHell*, "nascido de novo". No macOS, o padrão hoje é o **Zsh**, que é muito parecido. Pra scripts, o Bash continua sendo o que você encontra em quase todo lugar.

## O essencial

Se for guardar só quatro coisas desta nota:

1. Script é uma lista de comandos num arquivo, com `#!/usr/bin/env bash` na primeira linha e `chmod +x` antes de rodar.
2. `nome="valor"` sem espaços, e `"$nome"` sempre entre aspas na hora de usar.
3. `>` apaga e escreve, `>>` acrescenta no fim, `2>&1` junta os erros com a saída normal.
4. `set -euo pipefail` no começo de todo script, porque sem ele o Bash segue em frente depois de um erro.

## Agora é com você

Comece pequeno: um `organizar.sh` que pega a pasta Downloads e separa os arquivos em pastas por extensão (`pdf/`, `png/`, `zip/`). Você vai precisar de um `for` pra percorrer os arquivos, `mkdir -p` pra criar a pasta, `mv` pra mover, e aspas em tudo, porque arquivo baixado da internet sempre tem espaço no nome. Pra pegar a extensão, pesquise `${arquivo##*.}`.

Se quiser algo maior, que você vai usar de verdade, escreva um `status-estudos.sh`: um painel do vault no terminal. Ele recebe a pasta do vault como argumento (ou usa a pasta atual se você não passar nada), conta quantas notas estão em cada `nivel` (`escrito`, `praticado`, `projeto`) usando `grep`, e lista as que ainda têm o `revisado:` vazio. É um ótimo teste de aspas, porque `Inglês/01 - Técnicas` quebra qualquer script descuidado. Você sabe que terminou quando `./status-estudos.sh` mostrar algo como `escrito: 21 · praticado: 2 · projeto: 0` e o ShellCheck não reclamar de nada. Se ainda tiver fôlego, adicione uma opção `-a Inglês` pra filtrar por área (com `getopts`) e cores na saída.

Daqui, os próximos passos naturais são [[Regex]], que você vai usar com `grep` o tempo todo, e [[SSH]], pra rodar seus scripts em outras máquinas.

---

## 🧠 Me teste

> [!question]- Por que `nome = "Ana"` dá erro?
> Porque a primeira palavra da linha é sempre um comando. Com espaços, o Bash tenta rodar o comando `nome` com os argumentos `=` e `"Ana"`.

> [!question]- Qual a diferença entre `>` e `>>`?
> `>` **apaga** o arquivo e escreve; `>>` **acrescenta** no final.

> [!question]- O que `2>&1` faz?
> Manda a saída de erro (stderr, canal 2) para o mesmo lugar da saída normal (stdout, canal 1).

> [!question]- Pra que serve `set -euo pipefail`?
> `-e` para no primeiro erro, `-u` dá erro em variável não definida, `pipefail` faz um pipe falhar se *qualquer* comando dele falhar.

> [!question]- Por que escrever `"$arquivo"` com aspas?
> Sem aspas, o Bash quebra o valor nos espaços: `meu arquivo.txt` vira dois argumentos, e o comando age nos arquivos errados.

> [!question]- O que acontece num script sem `set -e` se um `cd` falhar antes de um `rm -rf *`?
> O Bash ignora o erro e roda o `rm` na pasta onde você estava, apagando os arquivos errados.

> [!question]- Por que precisa do `./` em `./ola.sh`?
> Sem ele, o Bash procura o comando nas pastas do PATH, não na pasta atual.

> [!question]- `#!/usr/bin/env bash`
> shebang: diz qual interpretador roda o script

> [!question]- `$(comando)`
> substituição de comando: usa a saída do comando como valor

> [!question]- `$1` / `$@`
> primeiro argumento / todos os argumentos do script

> [!question]- `source ~/.bashrc`
> relê as configurações no terminal atual, sem precisar reabrir

> [!question]- Erro com `^M` ou `$'\r'`
> arquivo com quebra de linha CRLF (Windows); converter pra LF

> [!question]+ Qual destas linhas guarda "Ana" na variável `nome`?
> - a) `nome = "Ana"`
> - b) `$nome="Ana"`
> - c) `nome="Ana"`
> - d) `set nome "Ana"`
>
> > [!check]- Resposta
> > **c)** Sem espaço em volta do `=` e sem `$` na hora de guardar. O `$` só entra pra **ler** (`echo "$nome"`). Com espaço, o Bash acha que `nome` é um comando.

> [!question]+ Você roda `./backup.sh >> log.txt` duas vezes. O que acontece com `log.txt`?
> - a) Fica só com a saída da segunda execução
> - b) Fica com a saída das duas execuções, uma depois da outra
> - c) Dá erro porque o arquivo já existe
> - d) Fica vazio, porque `>>` só redireciona erros
>
> > [!check]- Resposta
> > **b)** `>>` **acrescenta** no final. Quem apaga é `>`. E os erros (stderr) não vão pro arquivo em nenhum dos dois sem `2>&1`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `#!/usr/bin/env bash` | Diz qual programa roda o script |
| `chmod +x script.sh` | Libera o arquivo pra ser executado |
| `nome="valor"` / `"$nome"` | Guarda / lê uma variável |
| `$(comando)` | Usa a saída de um comando como valor |
| `$1`, `$@` | Primeiro argumento / todos |
| `if [ -f "x" ]; then ... fi` | Condicional (`-f` arquivo, `-d` pasta) |
| `for x in *.txt; do ... done` | Repetição |
| `\|` | Manda a saída de um comando pra outro |
| `>` / `>>` / `2>&1` | Apaga e escreve / acrescenta / junta erros |
| `set -euo pipefail` | Para o script no primeiro erro |

**Pra ler:** *The Linux Command Line*, de William Shotts, tem uma parte inteira sobre scripts e é o melhor livro pra começar (e é gratuito no site do autor). O [Manual do GNU Bash](https://www.gnu.org/software/bash/manual/) é a referência oficial, pra quando você quiser a resposta exata.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

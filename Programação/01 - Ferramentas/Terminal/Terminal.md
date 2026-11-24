---
nivel: escrito
foco: essencial
revisado:
---

# Terminal

**Quanto focar: 🔥 essencial.** Você vai abrir o terminal todo dia pra rodar projeto, instalar pacote e usar o Git. Pratique até navegar e rodar comandos sem pensar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Todo tutorial de programação, cedo ou tarde, diz: "abra o terminal e rode este comando". E aí você abre uma janela preta, com um cursor piscando, sem botão nenhum, sem menu, sem dica do que fazer. É normal sentir que você voltou trinta anos no tempo.

Mas tem um motivo pra todo dev passar boa parte do dia ali. O **terminal** é onde você conversa com o computador **digitando comandos**, em vez de clicar. E digitar, depois que você pega o jeito, é mais rápido, mais preciso e, principalmente, **repetível**: um comando que você digitou pode ser copiado, colado num tutorial, salvo num script, rodado mil vezes. É ali que você roda o projeto, usa o Git, instala pacotes e automatiza tarefas.

A boa notícia é que o básico cabe numa tarde: saber **onde você está**, **andar entre pastas**, entender **a forma de um comando**, e **juntar comandos**. O resto é prática.

## A janela e quem atende

Antes de tudo, três palavras que todo mundo confunde, e que fazem diferença quando um tutorial não funciona.

O **terminal** é a **janela** onde você digita: o Windows Terminal, o iTerm2 no Mac. O **shell** é o **programa** que lê o que você digitou e executa: o Bash, o Zsh, o PowerShell. E **console** é um termo antigo, do tempo dos terminais físicos, que hoje se usa quase como sinônimo de terminal.

Uma comparação ajuda: o terminal é o telefone, e o shell é a pessoa que atende do outro lado. O mesmo telefone (Windows Terminal) pode ligar pra pessoas diferentes (PowerShell ou Git Bash), e cada uma entende os pedidos de um jeito um pouco diferente.

E é por isso que importa. Quando um tutorial diz "rode `ls -la`", ele está falando com o **Bash**. Se você digitar isso no **PowerShell**, pode dar erro, não porque você errou, mas porque falou com a pessoa errada. As notas do [[Bash]] e do [[PowerShell]] mostram as diferenças.

Uma curiosidade: os terminais nasceram nos anos 1960 e 70 como **aparelhos físicos**, teletipos e depois monitores como o DEC VT100, ligados a um computador central do tamanho de uma sala. Os terminais de hoje são programas que **imitam** esses aparelhos, e o jeito de funcionar continua o mesmo: texto entra, texto sai.

## Você está sempre em algum lugar

A coisa mais importante pra entender o terminal é esta: **você está sempre dentro de uma pasta.** É como se estivesse andando pelo explorador de arquivos, só que sem ver. Todo comando age na pasta onde você está, a menos que você diga outra.

```bash
pwd             # "onde estou?" (print working directory)
ls              # o que tem aqui?
cd Documentos   # entra na pasta Documentos
cd ..           # sobe um nível, pra pasta de cima
cd ~            # vai pra sua pasta de usuário
```

Muita confusão no começo vem de rodar um comando na pasta errada: o arquivo "não existe" porque ele está em outra pasta. Na dúvida, `pwd`.

Pra dizer onde fica um arquivo, existem dois tipos de caminho, e a melhor forma de entender é pensar em dar direções pra alguém. "Rua das Flores, 100" funciona pra qualquer pessoa, de qualquer lugar da cidade: é um caminho **absoluto**, o endereço completo desde a raiz, como `/home/ana/projetos` ou `C:\Users\ana\projetos`. Já "segunda à direita" só funciona dependendo de onde a pessoa está: é um caminho **relativo**, a partir da pasta atual, como `projetos/tarefas` ou `../fotos` (sobe um nível e entra em `fotos`).

E dois atalhos que mudam a sua vida no terminal, desde o primeiro dia. O **`Tab`** autocompleta nomes de pastas, arquivos e comandos: digite `cd Doc`, aperte `Tab`, e o resto aparece. Além de economizar digitação, evita erro de nome. E a **seta pra cima** traz de volta o último comando (no Bash, `Ctrl + R` busca no histórico por um trecho).

## A forma de um comando

Quase todo comando segue o mesmo formato, e quando você passa a enxergar ele, qualquer comando fica legível:

```bash
ls -la /home/usuario
# ls          → o comando (o que fazer)
# -la         → as opções, ou flags (como fazer)
# /home/...   → o argumento (em quê fazer)
```

Teste com um que você ainda vai usar muito: `git commit -m "mensagem"`. O comando é `git commit`, a opção é `-m` (de *message*), e `"mensagem"` é o valor dela.

Agora a parte mais poderosa do terminal: **juntar comandos**. O `|`, chamado **pipe** (cano), pega a saída de um comando e entrega como entrada pro próximo:

```bash
ls | grep ".txt"               # lista os arquivos e filtra só os .txt
grep -r "TODO" ./src | wc -l   # procura TODO no código e conta as linhas
echo "olá" > arq.txt           # o > manda a saída pra um arquivo
```

Cada comando faz uma coisa pequena e bem feita, e você monta coisas maiores encaixando eles, como peças de Lego. É uma filosofia que vem do Unix e que você vai reencontrar o tempo todo.

Uma advertência que merece ser dita com todas as letras: **no terminal, `rm` não manda pra lixeira. Ele apaga de vez.** Não tem "desfazer". Confira o caminho antes de apertar Enter, principalmente com `rm -rf`, que apaga pastas inteiras, com tudo dentro, sem perguntar nada.

## Quando o terminal não te entende

Os dois erros que você mais vai ver no começo têm causas bem previsíveis.

O primeiro é **"command not found"** (ou, no Windows, "não é reconhecido como um comando interno ou externo"). O shell procurou o programa e não achou. Confira se digitou o nome certo, e se o programa está mesmo instalado. Se estiver, o problema costuma ser o **PATH**: a lista de pastas onde o sistema procura programas. E tem uma pegadinha clássica: um programa que você acabou de instalar só aparece em terminais **abertos depois** da instalação. Antes de qualquer outra coisa, feche e abra o terminal de novo.

O segundo é **"Permission denied"**: o comando existe, mas você não tem permissão pra fazer aquilo com aquele arquivo ou pasta. `ls -l` mostra as permissões. No Linux e no macOS, o `sudo` na frente executa o comando como administrador, mas use sabendo exatamente o que o comando faz, porque como administrador você também tem permissão pra estragar coisas.

## Um pouco de dia a dia

Pra sentir como isso vira rotina, aqui está a criação de um projeto novo, inteira pelo terminal:

```bash
mkdir meu-projeto
cd meu-projeto
touch index.js README.md
ls
```

E uma das coisas mais úteis que você vai fazer: descobrir em quais arquivos uma função é usada.

```bash
grep -rn "minhaFuncao" ./src   # -r procura nas subpastas, -n mostra a linha
```

No Windows, vale configurar o **Windows Terminal**: ele deixa escolher o shell que abre por padrão (PowerShell ou Git Bash), a fonte e as cores, num arquivo `settings.json`:

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

O GUID de cada perfil aparece no próprio arquivo de configurações.

## O essencial

1. O terminal é a janela; o shell (Bash, PowerShell) é quem entende os comandos. Tutorial de Bash pode não funcionar no PowerShell.
2. Você está sempre numa pasta. `pwd` mostra onde, `cd` anda, `ls` lista.
3. Comando, opções, argumento: `ls -la /home`. E `|` junta comandos.
4. `rm` apaga de vez. "Command not found": confira o nome, a instalação, e reabra o terminal.

## Agora é com você

Faça um exercício inteiro sem abrir o Explorer nenhuma vez: crie uma pasta `laboratorio` e entre nela, crie `a.txt`, `b.txt` e `c.txt`, escreva "teste" dentro do `a.txt` com `echo` e `>`, copie o `a.txt` pra `d.txt`, liste tudo com detalhes e apague `b.txt` e `c.txt`. Você terminou quando `ls -la` mostrar só `a.txt` e `d.txt`, e `cat d.txt` mostrar `teste`.

O projeto desta nota é deixar **o seu terminal de trabalho** do jeito que você vai usar todo dia neste roadmap: abrindo no lugar certo, com os shells certos e com atalhos pros comandos que você repete. Você já fez:

- [x] Windows Terminal com 2 perfis: PowerShell e Git Bash, e o Git Bash como padrão
- [x] Um perfil "Estudos" que já abre na pasta do vault (`startingDirectory`)
- [x] 3 aliases no `~/.bashrc` pra coisas que você faz toda hora (ex: `ll`, `gs` = `git status`, `vault` = `cd` pro vault)
- [x] Saber abrir, dividir (`Alt + Shift + D`) e fechar painéis só pelo teclado

Se quiser ir além, configure um prompt que mostra a branch do Git (o Starship faz isso), crie os mesmos atalhos no `$PROFILE` do [[PowerShell]], e escolha uma fonte com ligaduras, como a Cascadia Code.

Daqui, o caminho natural é o [[Bash]] ou o [[PowerShell]], conforme o shell que você mais usa.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre terminal e shell?
> O **terminal** é a janela (Windows Terminal, iTerm2). O **shell** é o programa que interpreta os comandos (Bash, Zsh, PowerShell).

> [!question]- Caminho absoluto vs relativo: dê um exemplo de cada.
> Absoluto parte da raiz: `/home/ana/projetos` ou `C:\Users\ana`. Relativo parte de onde você está: `./src`, `../docs`.

> [!question]- Em `ls -la /home`, o que é comando, opção e argumento?
> `ls` = comando · `-la` = opções · `/home` = argumento.

> [!question]- O que acontece em `ls | grep ".txt"`?
> O pipe `|` entrega a saída do `ls` como entrada do `grep`, que filtra só as linhas com `.txt`.

> [!question]- Apareceu "não é reconhecido como comando". O que checar?
> Digitação, se o programa está instalado e se ele está no `PATH`. Depois de instalar ou mexer no PATH, reabra o terminal.

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

> [!question]+ Em `git commit -m "fix" --amend`, o que é `-m`?
> - a) O comando
> - b) Uma opção (flag)
> - c) O argumento principal
> - d) Uma variável de ambiente
>
> > [!check]- Resposta
> > **b)** `git commit` é o comando (com subcomando), `-m` e `--amend` são opções que mudam o comportamento, e `"fix"` é o valor da opção `-m`.

> [!question]+ Você está em `/home/ana/projetos` e roda `cd ../fotos`. Onde vai parar?
> - a) `/home/ana/projetos/fotos`
> - b) `/home/ana/fotos`
> - c) `/fotos`
> - d) `/home/fotos`
>
> > [!check]- Resposta
> > **b)** `..` sobe **um** nível (pra `/home/ana`) e de lá entra em `fotos`. É um caminho relativo: depende de onde você está.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `pwd` | Mostra a pasta atual |
| `ls` / `ls -la` | Lista arquivos / com detalhes e ocultos |
| `cd pasta` / `cd ..` / `cd ~` | Entra / sobe / vai pra home |
| `mkdir` / `touch` | Cria pasta / arquivo vazio |
| `cp` / `mv` | Copia / move (ou renomeia) |
| `rm` / `rm -rf` | Apaga arquivo / pasta inteira (sem volta) |
| `cat` | Mostra o conteúdo de um arquivo |
| `grep -rn "texto" .` | Procura um texto nos arquivos |
| `clear` | Limpa a tela |
| `man comando` | Abre o manual (Linux/macOS) |

No PowerShell, vários desses nomes funcionam como apelidos de cmdlets, mas com opções diferentes.

**Pra ler:** *The Linux Command Line*, de William Shotts, é o melhor livro pra começar, e o autor disponibiliza [a versão online de graça](https://linuxcommand.org/tlcl.php). Pra configurar o Windows Terminal, a [documentação da Microsoft](https://learn.microsoft.com/windows/terminal/) é bem completa.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

**Checklist de progresso:**
- [x] Praticar os comandos básicos por alguns dias
- [x] Aprender sobre pipes e redirecionamentos
- [x] Estudar [[Bash]] ou [[PowerShell]], conforme seu sistema
- [x] Criar seu primeiro script automatizando uma tarefa

---
nivel: escrito
foco: importante
revisado:
---

# PowerShell

**Quanto focar: 📌 importante.** Útil porque você está no Windows, mas a maioria dos tutoriais e servidores usa Bash. Aprenda o suficiente pro seu dia a dia e siga em frente.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Seu disco está quase cheio e você quer descobrir quais são os cinco maiores arquivos da pasta de projetos. No Linux, com Bash, a resposta envolve o `ls` imprimindo um monte de texto em colunas, e depois outros comandos recortando a coluna do tamanho, convertendo, ordenando. Funciona, mas é frágil: se a coluna mudar de lugar, tudo quebra.

No **PowerShell**, o shell da Microsoft que vem em todo Windows, é assim:

```powershell
Get-ChildItem -Recurse -File |
    Sort-Object Length -Descending |
    Select-Object -First 5 Name, Length
```

Quase dá pra ler em voz alta: "pegue os arquivos, ordene pelo tamanho, do maior pro menor, e mostre os 5 primeiros, com nome e tamanho". Não tem recorte de texto nenhum. E o motivo disso é a ideia mais importante da nota: **no PowerShell, o pipe passa objetos, não texto.**

Se você usa Windows, vale conhecer bem. É o terminal que está sempre à mão, e as ideias do [[Terminal]] valem aqui também.

## O pipe passa objetos

No Bash, quando você faz `ls | grep`, o `ls` produz **texto**, linhas e mais linhas, e o `grep` procura dentro desse texto. Um arquivo, pro Bash, é uma linha.

No PowerShell, cada comando devolve **objetos**: coisas com propriedades nomeadas. Um arquivo não é uma linha de texto, é um objeto que tem `Name`, `Length` (o tamanho), `LastWriteTime` (quando mudou pela última vez) e várias outras. Então, em vez de recortar texto, você filtra direto pela propriedade:

```powershell
Get-ChildItem | Where-Object Length -gt 1MB
```

"Dos arquivos, aqueles onde o `Length` é maior que (`-gt`, *greater than*) 1 MB."

Quando a condição fica mais complicada, você usa a forma com chaves e o `$_`, que representa "o objeto que está passando pelo pipe agora":

```powershell
Get-Process | Where-Object { $_.CPU -gt 100 } | Sort-Object CPU -Descending
```

E a pergunta natural é: como eu sei quais propriedades um objeto tem? Você pergunta pro próprio PowerShell, passando o objeto pro `Get-Member`:

```powershell
Get-ChildItem | Get-Member   # lista tudo o que um arquivo tem
```

## Você não decora, você pergunta

Os comandos do PowerShell, chamados **cmdlets**, seguem sempre o mesmo padrão: `Verbo-Substantivo`.

```powershell
Get-Process        # lista os processos
Get-ChildItem      # lista arquivos (o ls/dir)
Set-Location ..    # muda de pasta (o cd)
New-Item arq.txt   # cria um arquivo
Remove-Item a.txt  # apaga
```

Os nomes são compridos, mas o padrão compensa: dá pra **adivinhar**. Quer pegar alguma coisa? Começa com `Get-`. Criar? `New-`. Apagar? `Remove-`. E quando você não faz ideia do nome, pergunta:

```powershell
Get-Command *process*              # comandos com "process" no nome
Get-Help Get-ChildItem -Examples   # exemplos de uso
```

O segredo do PowerShell é esse: você não precisa decorar quase nada, precisa saber perguntar pra ele. `Get-Command` pra achar, `Get-Help` pra entender, `Get-Member` pra ver o que tem dentro.

Talvez você esteja pensando "mas eu digito `ls` e `cd` no PowerShell e funciona". Funciona porque eles são **aliases**, apelidos pros cmdlets de verdade: o `ls` aponta pro `Get-ChildItem`. E aqui mora uma armadilha. O `ls` existe, mas **não é o `ls` do Linux**. Um `ls -la` copiado de um tutorial dá erro, porque as opções são as do `Get-ChildItem`. Quando um comando de tutorial de Linux falhar, procure o cmdlet nativo e consulte o `Get-Help`.

## "A execução de scripts foi desabilitada"

Na primeira vez que você tentar rodar um script `.ps1`, quase certeza que vai ver isto:

```text
A execução de scripts foi desabilitada neste sistema.
```

Não é erro no seu script. É uma proteção do Windows, a *execution policy*, que bloqueia scripts por padrão pra evitar que você rode alguma coisa maliciosa sem querer. Pra liberar os seus, rode uma vez:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

O `RemoteSigned` deixa rodar os scripts criados no seu computador, mas continua exigindo assinatura nos baixados da internet. E o `-Scope CurrentUser` faz a mudança valer só pro seu usuário, sem precisar abrir o terminal como administrador.

## Ensaie antes de apagar

Este é o recurso do PowerShell que todo shell deveria ter. Muitos cmdlets aceitam `-WhatIf`, que **simula** a ação e mostra o que aconteceria, sem fazer nada de verdade:

```powershell
Remove-Item *.tmp -WhatIf
# What if: Performing the operation "Remove File" on target "a.tmp".
```

Vale como hábito: antes de qualquer comando que apaga ou move muita coisa de uma vez, rode com `-WhatIf` primeiro, leia a lista, e só depois rode de verdade.

## Variáveis, scripts e o seu perfil

Variáveis começam com `$`, e diferente do Bash, os espaços em volta do `=` são liberados:

```powershell
$nome = "Ana"
$numeros = 1, 2, 3
"Olá, $nome"       # uma string sozinha numa linha já é impressa
$env:PATH          # variáveis de ambiente ficam em $env:
```

Um script é só um arquivo `.ps1` com comandos. Este faz um backup com a data no nome:

```powershell
$origem  = "C:\Projetos"
$destino = "D:\Backup\Projetos_$(Get-Date -Format yyyyMMdd)"
Copy-Item $origem $destino -Recurse
```

E existe um script especial, o seu **perfil** (`$PROFILE`), que roda toda vez que o PowerShell abre. É lá que moram os seus atalhos e funções, e é o que transforma o terminal em uma ferramenta sua. Pra abrir: `notepad $PROFILE`.

Um detalhe de versões, que confunde no começo: o Windows vem com o **Windows PowerShell 5.1** (comando `powershell`), que não recebe mais novidades. O atual é o **PowerShell 7+** (comando `pwsh`), open source, mais rápido, e roda também em Linux e macOS. Os dois convivem no mesmo computador. Quando puder, prefira o 7.

## O essencial

1. O pipe passa objetos com propriedades: filtre com `Where-Object`, ordene com `Sort-Object`, escolha com `Select-Object`.
2. Cmdlets são `Verbo-Substantivo`. Pra descobrir: `Get-Command`, `Get-Help -Examples`, `Get-Member`.
3. Script bloqueado: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.
4. `-WhatIf` antes de apagar ou mover em massa.

## Agora é com você

Comece com o pipeline: liste os processos em execução, filtre os que usam mais de 100 MB de memória (a propriedade é `WorkingSet`), ordene do maior pro menor, mostre só o nome e a memória, e exporte o resultado pra um `processos.csv` com `Export-Csv`. Abra o CSV no Excel pra ver os objetos virarem tabela.

Depois, o projeto que faz o PowerShell valer a pena: **montar o seu `$PROFILE`**, com funções suas que carregam em todo terminal. Primeiro, cheque se ele existe com `Test-Path $PROFILE`. Se der `False`, crie com `New-Item $PROFILE -ItemType File -Force`; se der `True`, só edite, porque o `-Force` apagaria o que já está lá. Escreva uma função `vault` que entra na pasta do vault. Depois uma `Novo-Estudo "Git Básico" -Area Programação`, que copia o `Templates/Template.md` pra área certa com o nome do tópico e troca `[NOME DO TÓPICO]` pelo nome (e se a nota já existir, avisa e não sobrescreve). E uma `Backup-Obsidian`, que roda o `Configs/backup.ps1`. Você terminou quando, num terminal novo, `Novo-Estudo "Teste" -Area Programação` criar a nota e ela aparecer no Obsidian. Se quiser ir além, use `[CmdletBinding()]` e `[Parameter(Mandatory)]` nos parâmetros, escreva um comentário de ajuda pra `Get-Help Novo-Estudo` funcionar, e faça o `-Area` autocompletar com as pastas que existem (`[ValidateSet]`).

O próximo passo é o [[Bash]], pra ver a outra filosofia, a do texto.

---

## 🧠 Me teste

> [!question]- Qual a diferença principal entre o pipe do PowerShell e o do Bash?
> No PowerShell passam **objetos** com propriedades; no Bash passa **texto**. Por isso dá pra fazer `Where-Object WorkingSet -gt 100MB` sem recortar texto.

> [!question]- Como achar um comando cujo nome você não sabe?
> `Get-Command *service*` (busca por nome) e depois `Get-Help Nome-Do-Cmdlet -Examples`.

> [!question]- Como descobrir quais propriedades um objeto tem?
> Passando ele pro `Get-Member`: `Get-ChildItem | Get-Member`.

> [!question]- Pra que serve `-WhatIf`?
> Simula o comando e mostra o que **aconteceria**, sem executar. Ótimo antes de `Remove-Item`.

> [!question]- "A execução de scripts foi desabilitada neste sistema": o que é e como resolver?
> É a *execution policy*. Resolve com `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.

> [!question]- Por que `ls` funciona no PowerShell?
> É um **alias** de `Get-ChildItem`. Mas as opções são as do cmdlet, não as do `ls` do Linux.

> [!question]- Padrão de nome de cmdlet
> `Verbo-Substantivo` (ex.: `Get-Process`)

> [!question]- `Get-ChildItem`
> lista arquivos (aliases `ls`, `dir`)

> [!question]- `Where-Object`
> filtra objetos do pipeline

> [!question]- `Select-Object`
> escolhe propriedades ou os primeiros N itens

> [!question]- `Sort-Object`
> ordena objetos

> [!question]- `$env:PATH`
> lê uma variável de ambiente

> [!question]- `Export-Csv`
> salva objetos num arquivo CSV

> [!question]+ Por que `Get-ChildItem | Where-Object Length -gt 1MB` funciona sem você "recortar" texto?
> - a) Porque o PowerShell converte tudo em texto e depois lê de volta
> - b) Porque o pipe do PowerShell passa **objetos**, com propriedades como `Length`
> - c) Porque `Where-Object` usa regex por baixo
> - d) Porque `1MB` é um comando
>
> > [!check]- Resposta
> > **b)** No Bash o pipe passa texto e você precisa de `grep`/`awk`. No PowerShell passa objetos, então dá pra filtrar direto pela propriedade.

---

## Pra consultar depois

| Cmdlet | O que faz |
|---|---|
| `Get-Help nome -Examples` | Ajuda e exemplos de um cmdlet |
| `Get-Command *texto*` | Procura comandos pelo nome |
| `Get-Member` | Mostra propriedades e métodos de um objeto |
| `Get-ChildItem` | Lista arquivos e pastas |
| `Where-Object` | Filtra objetos |
| `Select-Object` | Escolhe propriedades ou os primeiros N |
| `Sort-Object` | Ordena |
| `ForEach-Object` | Faz algo pra cada objeto |
| `Export-Csv` / `Out-File` | Salva em CSV / em arquivo de texto |

**Pra ler:** *Learn PowerShell in a Month of Lunches*, de Don Jones e Jeffery Hicks, é o livro clássico: capítulos curtos, um por almoço, muito didático. A [documentação oficial](https://learn.microsoft.com/powershell/) tem a referência de cada cmdlet e tutoriais pra começar.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

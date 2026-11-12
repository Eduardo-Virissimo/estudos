---
nivel: escrito
revisado:
---

# PowerShell

> *"No PowerShell, tudo é objeto, e isso muda tudo."*

> [!tip] ⚡ Em 30 segundos
> Shell do Windows (multiplataforma no PowerShell 7) em que o pipeline passa **objetos**, não texto. Os comandos seguem `Verbo-Substantivo` e quase tudo se descobre com `Get-Help` e `Get-Command`.
>
> **Como estudar esta nota:** tente o [[#🔨 Desafio prático|desafio]] *antes* de ler. Travou? Leia só a parte que precisa. No fim, responda o [[#🧠 Me teste|Me teste]] sem olhar.

> [!info] 📊 Nível
> Mude `nivel` nas propriedades: `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Atualize `revisado` com a data sempre que revisar.

---

## O que é PowerShell?

O **PowerShell** é um shell e uma linguagem de script da Microsoft. Diferente do CMD tradicional, que trabalha só com texto, o PowerShell trabalha com **objetos**: cada comando devolve dados estruturados (com propriedades e métodos) que podem ser filtrados, ordenados e transformados no pipeline.

Ele é usado para administrar sistemas, automatizar tarefas e gerenciar serviços, inclusive na nuvem (Azure, Microsoft 365).

### Uma História Breve 📜

O projeto nasceu como "Monad" e foi lançado como **Windows PowerShell** em **2006**. A versão final do Windows PowerShell foi a **5.1**, que acompanha o Windows. A partir do **PowerShell Core 6** (2018) ele passou a ser **open source e multiplataforma**, e hoje a linha atual é chamada simplesmente de **PowerShell 7+**, funcionando em Windows, Linux e macOS.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Cmdlets (Verbo-Substantivo)

```powershell
Get-Process          # lista processos
Get-ChildItem        # lista arquivos (equivalente ao ls/dir)
Set-Location ..      # muda de pasta (equivalente ao cd)
New-Item arq.txt     # cria arquivo
```

### Conceito 2: Pipeline de objetos

```powershell
Get-Process | Where-Object { $_.CPU -gt 100 } | Sort-Object CPU -Descending
```

`$_` representa o objeto atual que está passando pelo pipeline.

### Conceito 3: Variáveis e tipos

```powershell
$nome = "Ana"
$numeros = 1, 2, 3
"Olá, $nome"
```

### Conceito 4: Aliases

Atalhos para cmdlets: `ls`, `cd`, `cat`, `dir` e `gci` apontam para cmdlets como `Get-ChildItem`.

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

```powershell
Get-Help Get-ChildItem -Examples   # ajuda com exemplos
Get-Command *process*              # descobre comandos relacionados
Get-ChildItem -Recurse -Filter *.log
```

### Exemplo 2: Caso de Uso Real

Listar os 5 arquivos maiores de uma pasta:

```powershell
Get-ChildItem -Recurse -File |
    Sort-Object Length -Descending |
    Select-Object -First 5 Name, Length
```

Script simples salvo como `backup.ps1`:

```powershell
$origem  = "C:\Projetos"
$destino = "D:\Backup\Projetos_$(Get-Date -Format yyyyMMdd)"
Copy-Item $origem $destino -Recurse
```

---

## Configurações Recomendadas ⚙️

Política de execução de scripts (necessária no Windows para rodar `.ps1`):

```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Perfil do usuário (arquivo executado ao abrir o PowerShell), onde você pode colocar aliases e funções:

```powershell
notepad $PROFILE
```

---

## Dicas de Ouro 💎

### 1. Descubra tudo com `Get-Help` e `Get-Command`

`Get-Help nome -Examples` e `Get-Member` (mostra propriedades de um objeto) são seus melhores aprendizados.

### 2. Use `-WhatIf` para testar antes

Muitos cmdlets aceitam `-WhatIf`, que simula a ação sem executar.

```powershell
Remove-Item *.tmp -WhatIf
```

### 3. Prefira PowerShell 7 quando possível

É mais moderno e multiplataforma. Ele convive com o Windows PowerShell 5.1 (executável `pwsh` vs `powershell`).

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `Get-Help` | Mostra a ajuda de um cmdlet |
| `Get-Command` | Lista/pesquisa comandos |
| `Get-Member` | Mostra propriedades e métodos de um objeto |
| `Get-ChildItem` | Lista arquivos e pastas |
| `Where-Object` | Filtra objetos |
| `Select-Object` | Escolhe propriedades |
| `Sort-Object` | Ordena objetos |
| `ForEach-Object` | Executa algo para cada objeto |
| `Out-File` | Salva a saída em arquivo |

---

## Problemas Comuns e Soluções 🔧

### Problema: "A execução de scripts foi desabilitada neste sistema"

**Solução:**
1. Abra o PowerShell.
2. Rode `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.
3. Tente executar o script novamente.

### Problema: Comando de outra plataforma não funciona

**Solução:**
1. Lembre que `ls`, `cat` etc. são aliases com comportamento diferente do Linux.
2. Use os cmdlets nativos (`Get-ChildItem`, `Get-Content`) e consulte `Get-Help`.

---

## 🔨 Desafio prático

**Objetivo:** Usar o pipeline de objetos para filtrar e organizar informações.

```powershell
# 1. Liste os processos em execução
# 2. Filtre só os que usam mais de 100 MB de memória (WorkingSet)
# 3. Ordene do maior para o menor
# 4. Exiba apenas Nome e Memória
# 5. Exporte o resultado para processos.csv com Export-Csv
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Qual a diferença principal entre o pipe do PowerShell e o do Bash?
> No PowerShell passam **objetos** com propriedades; no Bash passa **texto**. Por isso dá pra fazer `Where-Object WorkingSet -gt 100MB` sem recortar texto.

> [!question]- Como achar um comando cujo nome você não sabe?
> `Get-Command *service*` (busca por nome) e depois `Get-Help Nome-Do-Cmdlet -Examples`.

> [!question]- Pra que serve `-WhatIf`?
> Simula o comando e mostra o que **aconteceria**, sem executar. Ótimo antes de `Remove-Item`.

> [!question]- "A execução de scripts foi desabilitada neste sistema": o que é e como resolver?
> É a *execution policy*. Resolve com `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.

> [!question]- Por que `ls` funciona no PowerShell?
> É um **alias** de `Get-ChildItem`. Mas as opções são as do cmdlet, não as do `ls` do Linux.

---

## 🃏 Flashcards

#flashcards/ferramentas

Padrão de nome de cmdlet::`Verbo-Substantivo` (ex.: `Get-Process`)
`Get-ChildItem`::lista arquivos (aliases `ls`, `dir`)
`Where-Object`::filtra objetos do pipeline
`Select-Object`::escolhe propriedades ou os primeiros N itens
`Sort-Object`::ordena objetos
`$env:PATH`::lê uma variável de ambiente
`Export-Csv`::salva objetos num arquivo CSV

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

- [ ] Praticar `Get-Help` e `Get-Member` em vários cmdlets
- [ ] Escrever seu primeiro script `.ps1`
- [ ] Aprender funções, parâmetros e tratamento de erros (`try/catch`)
- [ ] Comparar com [[Bash]] para entender as diferenças de filosofia

---

## Recursos Recomendados 📚

### 📖 Livros:
- *Learn PowerShell in a Month of Lunches* (Don Jones e Jeffery Hicks) - Introdução didática

### 💻 Sites e Documentação:
- [Documentação oficial do PowerShell](https://learn.microsoft.com/powershell/) - Referência e tutoriais

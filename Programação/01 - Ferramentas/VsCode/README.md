# 🟢 Visual Studio Code (VSCode)

> *"O editor de código mais amado do mundo."*

---

## O que é o VSCode?

O **Visual Studio Code** (comumente chamado de **VSCode**) é uma ferramenta de desenvolvimento criada pela Microsoft que revolucionou a forma como programadores escrevem código. É um editor de texto inteligente que vai muito além de apenas escrever linhas de código — ele entende suas intenções e te ajuda a cada passo do caminho!

---

## Uma Breve História 📜

O VSCode foi lançado em 2015, nascendo da união entre duas tecnologias:
- **Code** (o núcleo leve do editor)
- **IntelliSense** (a tecnologia de autocompletar)

A Microsoft percebeu que os programadores precisavam de uma ferramenta poderosa, mas mais leve que o Visual Studio tradicional. E assim nasceu o VSCode! Hoje é usado por milhões em projetos que vão desde sites simples até sistemas complexos como o próprio Linux!

---

## Por que o VSCode se Torna Essencial?

### 🧠 IntelliSense - Ele te Entende

O coração do VSCode. Imagine que ele lê seu código enquanto você digita:

```javascript
// Você começa a digitar...
const minhaFuncao = 

// O IntelliSense sugere:
// [minhaFuncao, minhaVariavel, console.log, Promise.all]
```

Ele sabe o que você precisa antes mesmo de você terminar! 🤯

### 🎨 Snippets e Autocompletar Rápido

```typescript
// Digite 'func' e aperte TAB:
function minhaFuncao(parametro: string): void { // Pronto!
    console.log(parametro);
}
```

### 🔌 Extensões - Transformam o Editor em Qualquer Coisa que Você Desejar

O VSCode não é apenas um editor — é uma plataforma. Com extensões, você pode torná-lo:

| Área | Exemplo de Extensão |
|------|---------------------|
| Python | Python (Microsoft) |
| React | React Snippet Pack |
| Docker | Docker |
| Git | GitLens |
| HTML/CSS | Live Server |

### 📦 Controle de Versão Integrado

Gerencie seu Git diretamente do editor:
- Faça commits (`Ctrl + Shift + M`)
- Visualize mudanças antes de enviar
- Resolva conflitos no próprio editor

---

## Atalhos de Teclado Essenciais ⌨️

### Navegação e Produtividade

| Atalho | Função |
|--------|--------|
| `Ctrl + P` | Buscar arquivos (`Ctrl + Shift + O` para múltiplos) |
| `Ctrl + /` | Comentar/descomentar código |
| `Ctrl + K Ctrl + S` | Salvar todos os arquivos |
| `Ctrl + \` | Mostrar/esconder a interface gráfica (modo minimalista) |
| `Alt + F12` | Ir para uma função/definição |

### Manipulação de Código

| Atalho | Função |
|--------|--------|
| `Shift + Alt + ↓ / ↑` | Mover blocos de código para baixo/cima |
| `Ctrl + D` | Selecionar próxima ocorrência do mesmo texto |
| `Ctrl + W` | Fechar a aba atual (ou todas se pressionar Shift) |
| `Ctrl + B` | Mostrar/esconder as barras de rolagem laterais e verticais |

---

## Configurações Importantes 🛠️

### 1. Formatação Automática (Prettier)

Edite seu `.vscode/settings.json`:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "files.autoSave": "afterDelay"
}
```

### 2. Dicas de Linha (Problemas em Tempo Real)

Adicione ao seu `settings.json`:

```json
{
    "editor.renderWhitespace": "all",
    "problems.decorations.enabled": true,
    "editor.rulers": [80]
}
```

---

## Extensões que Você PRECISA Instalar 🚀

### 1. Prettier - Formatação Consistente

Deixe seu código sempre bonito com um toque de `Shift + Alt + F`:

> **Instalar:** Extensiones > Busque "Prettier" > Install

### 2. ESLint - Detecção de Erros

Encontre bugs antes mesmo de rodar o código:

> **Instalar:** Extensiones > Busque "ESLint" > Install

### 3. GitLens - Seu Time Machine no Código

Veja quem fez cada mudança, quando foi, e o porquê:

> **Instalar:** Extensiones > Busque "GitLens" > Install

### 4. Live Server - Servidor Local Automático

Abra seu site em uma página que se atualiza automaticamente:

> **Instalar:** Extensiones > Busque "Live Server" > Install

---

## Como Personalizar o VSCode 💎

### Tema Visual

1. Abra Extensões (`Ctrl + Shift + X`)
2. Pesquise "Theme"
3. Instale um que você goste! (Ex: One Dark, Dracula, Monokai)

Para mudar de tema rapidamente: `Ctrl + K Ctrl + T` → Selecione o tema

### Ícones do Sistema de Arquivos

1. Instale "Material Icon Theme"
2. Abra Configurações > Extensions > File Icon Theme

### Fontes de Código

```json
// Em settings.json
{
    "editor.fontFamily": "'Fira Code', 'Consolas', monospace",
    "editor.fontSize": 14,
    "editor.fontLigatures": true
}
```

---

## Fluxo de Trabalho Típico no VSCode 📋

### Criando um Novo Projeto

```bash
# 1. Abra o terminal integrado (Ctrl + `)
> mkdir meu-projeto
> cd meu-projeto

# 2. Inicie o servidor local
> npm install
> npm run dev
```

### Trabalhando com Arquivos Múltiplos

1. Pressione `Ctrl + P` para buscar arquivos
2. Digite o nome e navegue pelas sugestões
3. Aperte `Enter` para abrir

### Refatoração Segura

O VSCode ajuda você a mudar código sem quebrar nada:

- Para **renomear** uma variável ou função: `F2`
- Ele renomeia em todos os arquivos!

---

## Dicas Avançadas 🎯

### 1. Configurar Teclas Personalizadas

No `keybindings.json`:

```json
[
    {
        "key": "ctrl+shift+h",
        "command": "-editor.action.showHover",
        "when": "editorTextFocus"
    }
]
```

### 2. Usar Snippets Próprios

Crie em `%USERPROFILE%\\.vscode\\snippets\\javascript.json`:

```json
{
    "asyncPadrao": {
        "prefix": "aspad",
        "body": [
            "async function ${1:nome}() {",
            "    try {",
            "        const response = await fetch('${2:url}');",
            "        if (!response.ok) throw new Error('Erro na requisição');",
            "        return await response.json();",
            "    } catch (error) {",
            "        console.error(error);",
            "    }",
            "}"
        ],
        "description": "Função async/await básica"
    }
}
```

### 3. Trabalhar em Múltiplos Projetos Simultaneamente

Abra várias pastas: `File > Open Folder` (ou `Ctrl + K Ctrl+ O`)

---

## Integrações Comuns 🔄

### Git + VSCode

O GitLens adiciona informações do Git ao VSCode:
- Histórico de commits visível na árvore de arquivos
- Mensagens de commit sugeridas automaticamente
- Resolução de conflitos gráfica

### Docker + VSCode

Containerize e rode seus aplicativos com ease. O Docker Extension permite:
- Verificar containers no painel lateral
- Executar `docker-compose` diretamente do terminal integrado
- Inspecionar logs e métricas

---

## Problemas Comuns e Soluções 🔧

### Editor Lentos?

1. Desative extensões não usadas (`Ctrl + Shift + X`)
2. Limpe o cache: `File > Clear Cache and Restart`
3. Configure memória no VSCode (ajuste em `settings.json`):

```json
{
    "window.zoomLevel": 0,
    "editor.fontSize": 14,
    "files.autoSave": "afterDelay",
    "workbench.editor.enablePreview": true
}
```

### Extensões Não Instaladas?

Algumas extensões exigem instalação via GitHub Marketplace:
1. Abra a extensão no VSCode
2. Clique em "..." → "Install from GitHub"

---

## Próximos Passos 🚀

- [ ] Configure seu `.vscode/settings.json` personalizado
- [ ] Instale o Live Server para sua primeira página web
- [ ] Explore o modo de terminal integrado
- [ ] Aprenda a usar GitLens para entender histórico de projetos
- [ ] Crie seus próprios snippets de código

---

## Recursos Avançados para Dominar

### 1. Multi-Cursor (Produtividade Pura)

```javascript
// Digite 'console.log('
// Aperte Alt + Click para múltiplos cursos
// Digite 'error' e todos atualizam!
```

### 2. Go to Definition (`F12`)

Clique em qualquer função ou variável para ir diretamente para onde ela é declarada — o VSCode mostra a hierarquia inteira de dependências!

### 3. Source Control Visual

Veja exatamente o que mudou antes de fazer commit:
- Clique no ícone do Git no canto esquerdo
- Veja as diferenças linha por linha
- Faça commits com mensagens sugeridas

---

## Configurações Recomendadas para Iniciantes

Crie um `settings.json` no `.vscode/` de seu projeto:

```json
{
    "editor.tabSize": 2,           // Tabs de 2 espaços (padrão indústria)
    "editor.insertSpaces": true,   // Usar tabs (ou false para espaços)
    "editor.formatOnSave": true,   // Formatar automaticamente ao salvar
    "files.autoSave": "afterDelay", // Auto-salvar com pequeno atraso
    "editor.renderWhitespace": "selection", // Mostrar espaços em texto selecionado
    "terminal.integrated.profiles.windows": {
        "PowerShell": {
            "path": ["powershell.exe", "-NoExit", "-Command", "Enable-PSRemoting -Force"]
        }
    }
}
```

---

## Conclusão 🎉

O VSCode não é apenas um editor — é um **companheiro** de programação. Ele:

✅ Aprende com você (quanto mais código, melhores sugestões)  
✅ Se adapta a qualquer linguagem através de extensões  
✅ Integra ferramentas que você precisa na mesma tela  
✅ É gratuito e open-source  

Comece simples, explore gradualmente, e em pouco tempo o VSCode se tornará seu parceiro mais fiel na jornada de programação!

---

*A documentação do VSCode segue o padrão da pasta Ferramentas para manter consistência entre todas as ferramentas.* 🎯
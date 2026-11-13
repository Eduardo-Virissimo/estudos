---
nivel: escrito
revisado:
---

# VS Code

> *"O editor que cabe no seu fluxo de trabalho, não o contrário."*

> [!tip] ⚡ Em 30 segundos
> Editor leve e extensível. O que muda o jogo: **Command Palette** (`Ctrl + Shift + P`), poucos atalhos bem aprendidos, multi-cursor e configurações por workspace.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Achar qualquer ação pela Command Palette em vez de decorar menus
- Separar configurações de usuário e de workspace (projeto)
- Escolher extensões e usar multi-cursor e atalhos essenciais

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Terminal]]
- **Depois:** [[Linter]] · [[Formatter]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é VS Code?

O **Visual Studio Code** (VS Code) é um editor de código-fonte gratuito, leve e extensível, criado pela Microsoft. Ele roda em Windows, macOS e Linux e suporta praticamente qualquer linguagem através de **extensões**.

Diferente de uma IDE completa, ele começa enxuto e cresce conforme você instala o que precisa: depurador, terminal integrado, controle de versão com Git, autocomplete inteligente (IntelliSense) e muito mais.

> [!note]- 📜 Um pouco de história
> O VS Code foi lançado pela Microsoft em **2015**, construído sobre o framework **Electron** (tecnologia web empacotada como app desktop). O código-fonte base é aberto (projeto *Code - OSS*, licença MIT). Em poucos anos virou um dos editores mais usados do mundo, aparecendo no topo das pesquisas anuais de desenvolvedores do Stack Overflow.

---

## 🧱 Conceitos-chave

### Conceito 1: Command Palette

É a central de comandos do editor. Praticamente tudo que o VS Code faz pode ser acessado por ela.

```text
Ctrl + Shift + P   (Windows/Linux)
Cmd  + Shift + P   (macOS)
```

Digite o que quer fazer (ex.: "format document", "change language mode") e execute.

### Conceito 2: Workspace e Pasta

O VS Code trabalha melhor abrindo **uma pasta de projeto** (`File > Open Folder`). Cada projeto pode ter configurações próprias na pasta `.vscode/`.

### Conceito 3: Extensões

Funcionalidades extras instaladas pelo painel de extensões (`Ctrl + Shift + X`). Exemplos: Prettier, ESLint, GitLens, Live Share, Remote - SSH.

### Conceito 4: Settings (User vs Workspace)

- **User**: vale para todos os projetos.
- **Workspace**: vale só para o projeto atual (fica em `.vscode/settings.json`).

---

## 🛠️ Exemplos guiados

### Exemplo 1: Uso Básico

Abrir um projeto direto pelo terminal:

```bash
cd meu-projeto
code .
```

> Se o comando `code` não funcionar, abra a Command Palette e rode **"Shell Command: Install 'code' command in PATH"** (macOS) ou reinstale marcando a opção de adicionar ao PATH (Windows).

### Exemplo 2: Caso de Uso Real

Fluxo de um dia de estudo:

1. `Ctrl + P` para abrir um arquivo por nome.
2. `Ctrl + `` ` `` para abrir o terminal integrado e rodar o projeto.
3. `F5` para depurar com breakpoints.
4. `Ctrl + Shift + G` para revisar e commitar mudanças no Git.

---

## ⚙️ Configuração recomendada

Abra com `Ctrl + Shift + P` → **"Preferences: Open User Settings (JSON)"**:

```json
{
    "editor.formatOnSave": true,
    "editor.tabSize": 4,
    "editor.wordWrap": "on",
    "files.autoSave": "afterDelay",
    "editor.minimap.enabled": false,
    "editor.bracketPairColorization.enabled": true,
    "terminal.integrated.fontSize": 14
}
```

---

## 💎 Boas práticas

### 1. Aprenda poucos atalhos, mas bem

`Ctrl + P` (abrir arquivo), `Ctrl + Shift + P` (comandos) e `Ctrl + D` (selecionar próxima ocorrência) já te deixam muito mais rápido.

### 2. Multi-cursor

`Alt + Click` adiciona cursores extras. Perfeito para editar várias linhas ao mesmo tempo.

### 3. Use Profiles

Crie perfis (ex.: "Python", "Web") com extensões e configurações diferentes para não deixar o editor pesado.

---

## 🔧 Erros comuns e como resolver

### Problema: O comando `code .` não é reconhecido no terminal

**Solução:**
1. Reinstale o VS Code marcando "Add to PATH" (Windows) ou execute "Shell Command: Install 'code' command in PATH" (macOS).
2. Feche e reabra o terminal.

### Problema: O editor está lento

**Solução:**
1. Desative extensões que não está usando (`Extensions > Disable`).
2. Use `Help > Start Extension Bisect` para descobrir qual extensão causa o problema.

---

## 🔨 Desafio prático

**Objetivo:** Configurar um ambiente de edição confortável e usar os principais atalhos.

```text
1. Instale o VS Code e abra uma pasta de projeto vazia.
2. Instale as extensões Prettier e GitLens.
3. Ative "editor.formatOnSave" nas configurações.
4. Crie um arquivo index.js, escreva código mal formatado e salve.
5. Veja o Prettier arrumar tudo automaticamente.
6. Abra o terminal integrado e rode: node index.js
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Qual a diferença entre settings de User e de Workspace?
> **User** vale pra tudo. **Workspace** fica em `.vscode/settings.json`, vale só pro projeto e tem prioridade.

> [!question]- `code .` não é reconhecido no terminal. Como resolver?
> Command Palette → *Shell Command: Install 'code' command in PATH* (macOS) ou reinstalar marcando "Adicionar ao PATH" (Windows). Reabra o terminal.

> [!question]- Como editar várias linhas ao mesmo tempo?
> Multi-cursor: `Alt + Click`, `Ctrl + D` (próxima ocorrência) ou `Ctrl + Alt + ↑/↓`.

> [!question]- Pra que servem os Profiles?
> Conjuntos separados de extensões e configurações (ex.: um perfil pra web, outro pra Python).

> [!question]- O editor ficou lento. O que investigar?
> Extensões (*Developer: Show Running Extensions* ou *Extension Bisect*) e pastas enormes indexadas (`files.exclude`, `search.exclude`).

> [!question]- Command Palette
> `Ctrl + Shift + P`

> [!question]- Abrir arquivo por nome
> `Ctrl + P`

> [!question]- Selecionar a próxima ocorrência
> `Ctrl + D`

> [!question]- Terminal integrado
> `` Ctrl + ` ``

> [!question]- Mover linha pra cima/baixo
> `Alt + ↑/↓`

> [!question]- Renomear símbolo em todo o projeto
> `F2`

---

## 📋 Cola rápida

| Atalho (Windows/Linux) | Função |
|-----------------|--------|
| `Ctrl + P` | Abrir arquivo por nome |
| `Ctrl + Shift + P` | Command Palette |
| `` Ctrl + ` `` | Abrir/fechar terminal integrado |
| `Ctrl + B` | Mostrar/esconder barra lateral |
| `Ctrl + D` | Selecionar próxima ocorrência |
| `Alt + ↑ / ↓` | Mover linha |
| `Shift + Alt + ↓` | Duplicar linha |
| `Ctrl + /` | Comentar/descomentar |
| `F2` | Renomear símbolo em todo o projeto |

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

- [ ] Instalar o VS Code e a extensão do seu primeiro idioma de programação
- [ ] Configurar `settings.json` com formatação ao salvar
- [ ] Aprender a usar o debugger (`launch.json`)
- [ ] Explorar o Remote - SSH para editar arquivos em servidores

---

## 📚 Recursos

### 💻 Sites e Documentação:
- [Documentação oficial](https://code.visualstudio.com/docs) - Guias completos de uso
- [Atalhos de teclado (PDF oficial)](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) - Cola de atalhos para Windows
- [Marketplace de extensões](https://marketplace.visualstudio.com/vscode) - Catálogo de extensões

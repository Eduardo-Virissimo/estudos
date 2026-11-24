---
nivel: escrito
foco: essencial
revisado:
---

# VS Code

**Quanto focar: 🔥 essencial.** É onde você vai passar o dia. Atalhos, busca, terminal integrado e debugger economizam horas por semana, então vale dominar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Observe alguém experiente programando no VS Code e repare numa coisa: a pessoa quase não usa o mouse. Abre arquivos sem procurar nas pastas, renomeia uma função no projeto inteiro de uma vez, edita dez linhas ao mesmo tempo. Parece que ela conhece centenas de atalhos. Na verdade, ela conhece uns cinco muito bem, e sabe como achar o resto.

O **VS Code** é o editor de código mais usado do mundo: gratuito, leve, e que cresce conforme você instala **extensões**, uma pra cada linguagem e ferramenta. E a diferença entre quem "usa" e quem "voa" nele não é saber tudo. É dominar poucas coisas: a **Command Palette**, que dá acesso a qualquer comando, um punhado de atalhos, o **multi-cursor**, e a diferença entre as configurações do **usuário** e as do **projeto**.

## O único atalho que você precisa decorar

Se você só aprender um atalho do VS Code, que seja este:

```text
Ctrl + Shift + P   (Windows/Linux)
Cmd  + Shift + P   (macOS)
```

Ele abre a **Command Palette**: uma caixa onde você escreve, em palavras, **o que quer fazer**. "format document", "change language mode", "toggle word wrap". Praticamente tudo o que o VS Code sabe fazer está ali. Você não precisa saber em qual menu fica cada coisa, nem lembrar o atalho: digita o que quer, e ela acha.

E tem um bônus que pouca gente percebe: do lado de cada comando, a Palette mostra **o atalho dele**. É assim que se aprende atalho sem decorar lista nenhuma. Você usa um comando pela Palette algumas vezes, vê o atalho ali do lado, e um dia, sem perceber, passa a usar direto.

## Cinco atalhos e um superpoder

Estes cinco já te deixam muito mais rápido:

| Atalho | O que faz |
|---|---|
| `Ctrl + P` | abre um arquivo pelo nome (digite só um pedaço) |
| `Ctrl + Shift + P` | a Command Palette |
| `Ctrl + D` | seleciona a próxima ocorrência da palavra (repita pra pegar mais) |
| `` Ctrl + ` `` | abre e fecha o terminal integrado |
| `F2` | renomeia uma variável ou função no projeto inteiro, sem errar nenhuma |

O `F2` merece um comentário. Renomear com "buscar e substituir" é perigoso: se você renomeia `nome` pra `nomeCompleto`, o substituir também muda `sobrenome` pra `sobrenomeCompleto`. O `F2` entende o código e muda **só aquela variável**, em todos os arquivos onde ela é usada.

E o superpoder: o **multi-cursor**. `Alt + Clique` coloca cursores extras na tela, e tudo o que você digita sai em todos ao mesmo tempo. Com `Ctrl + D` repetido, você seleciona cada ocorrência de uma palavra e edita todas juntas. Na primeira vez que você transforma uma lista de vinte linhas em vinte linhas de código em dez segundos, nunca mais esquece.

Juntando tudo, um dia de estudo fica assim: `Ctrl + P` pra abrir o arquivo, `` Ctrl + ` `` pra abrir o terminal e rodar o projeto, `F5` pra depurar com breakpoints, e `Ctrl + Shift + G` pra revisar as mudanças e fazer o commit.

E um conselho: **não tente decorar todos os atalhos.** Ninguém usa todos. Pratique esses cinco até virarem automáticos, e depois acrescente um por vez, quando sentir falta.

## As suas preferências e as do projeto

Aqui está a parte que mais confunde, e que mais importa quando você começa a trabalhar em projetos com outras pessoas. O VS Code tem **dois níveis** de configuração.

As configurações de **usuário** (*User*) valem pra **todos** os projetos que você abrir. É onde vão as coisas de gosto pessoal: tamanho da fonte, tema, se o minimapa aparece.

As configurações de **projeto** (*Workspace*) valem **só pro projeto** aberto, e ficam num arquivo `.vscode/settings.json` dentro da pasta dele. É onde vão as regras do projeto: indentação de 2 espaços, qual formatador usar. Quando os dois níveis definem a mesma coisa, **o do projeto ganha**. E como esse arquivo fica dentro da pasta, ele pode ir pro Git, e todo mundo do time trabalha com as mesmas regras.

Isso tem uma consequência prática: abra sempre **a pasta do projeto** (`File > Open Folder`, ou `code .` no terminal), não arquivos soltos. É assim que o VS Code sabe qual configuração de projeto usar.

Uma boa configuração inicial de usuário fica assim (`Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"):

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

Dessas, a que mais muda o seu dia é o `formatOnSave`: o código se arruma sozinho toda vez que você salva. A nota do [[Formatter]] explica o porquê.

## Extensões, sem exagero

O VS Code começa enxuto e cresce com extensões (`Ctrl + Shift + X`). Pra quase todo projeto JavaScript e TypeScript, quatro valem a pena: **ESLint**, que aponta bugs prováveis ([[Linter]]); **Prettier**, que formata ([[Formatter]]); **Error Lens**, que escreve os erros na própria linha em vez de esconder num sublinhado; e **GitLens**, que mostra quem mudou cada linha e quando.

O problema é que extensão vicia, e um dia o editor fica lento. Quase sempre a culpa é de extensão demais. Desative as que você não usa, e se não descobrir qual é a culpada, rode `Help > Start Extension Bisect`: ele vai desligando metade das extensões de cada vez, até achar a responsável.

Pra não precisar escolher, existem os **Profiles**: conjuntos separados de extensões e configurações. Um perfil "TypeScript", outro "Python", e você troca conforme o projeto. Cada um carrega só o que precisa.

## Abrindo pelo terminal

O jeito mais rápido de abrir um projeto é pelo próprio terminal:

```bash
cd meu-projeto
code .        # o ponto quer dizer "esta pasta"
```

Se o terminal responder que `code` não é reconhecido, é porque o VS Code não está no PATH. No Windows, reinstale marcando a opção "Add to PATH". No macOS, rode "Shell Command: Install 'code' command in PATH" pela Command Palette. Depois, feche e abra o terminal de novo.

Uma curiosidade: o VS Code foi lançado pela Microsoft em 2015, feito com Electron, que é tecnologia de site empacotada como programa. Ele é um **editor**, não uma **IDE** completa como o IntelliJ ou o Visual Studio: não vem com tudo pronto, começa leve e você monta o que precisa. É por isso que ele abre rápido e serve pra qualquer linguagem.

## O essencial

1. `Ctrl + Shift + P` faz qualquer coisa, e ensina os atalhos de brinde.
2. `Ctrl + P`, `Ctrl + D`, `` Ctrl + ` `` e `F2` cobrem a maior parte do dia.
3. Configuração de usuário vale pra tudo; a de projeto (`.vscode/settings.json`) vale só ali, ganha da outra e vai pro Git.
4. Abra a pasta, não o arquivo solto. Editor lento: extensão demais.

## Agora é com você

Abra uma pasta vazia, instale o Prettier e o GitLens, ligue o `editor.formatOnSave`, e crie um `index.js` com o código mais bagunçado que conseguir. Salve e veja ele se arrumar. Depois abra o terminal integrado e rode `node index.js`. Você terminou quando fizer tudo isso sem sair do VS Code.

O projeto desta nota é deixar o **VS Code pronto pro Estágio 1**, configurado pra TypeScript, com erros aparecendo na linha, formatação ao salvar e Git na barra lateral. Você já fez:

- [x] Extensões: ESLint, Prettier, Error Lens e GitLens
- [x] `settings.json` com `editor.formatOnSave`, `editor.defaultFormatter` = Prettier e `files.autoSave` = `onFocusChange`
- [x] Um perfil (Profiles) chamado "TypeScript" só com essas extensões
- [x] Usar sem mouse: `Ctrl + P` (abrir arquivo), `Ctrl + Shift + P` (comandos), `F2` (renomear), `F12` (ir pra definição), `` Ctrl + ` `` (terminal)

Se quiser ir além, crie um snippet seu (por exemplo, `main` virando a estrutura de uma `async function main()` com `.catch`), configure o `F5` pra depurar um `.ts` com `tsx`, e ligue o Settings Sync pra levar as configurações pra qualquer computador.

Daqui, os próximos passos são o [[Linter]] e o [[Formatter]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre settings de User e de Workspace?
> **User** vale pra tudo. **Workspace** fica em `.vscode/settings.json`, vale só pro projeto e tem prioridade.

> [!question]- `code .` não é reconhecido no terminal. Como resolver?
> Command Palette → *Shell Command: Install 'code' command in PATH* (macOS) ou reinstalar marcando "Adicionar ao PATH" (Windows). Reabra o terminal.

> [!question]- Como editar várias linhas ao mesmo tempo?
> Multi-cursor: `Alt + Click`, `Ctrl + D` (próxima ocorrência) ou `Ctrl + Alt + ↑/↓`.

> [!question]- Por que usar `F2` em vez de buscar e substituir pra renomear?
> O `F2` entende o código e muda só aquele símbolo; o substituir troca qualquer texto parecido (`nome` dentro de `sobrenome`).

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

> [!question]+ Você quer que **só este projeto** use 2 espaços de indentação. Onde configurar?
> - a) Settings de User
> - b) Settings de Workspace (`.vscode/settings.json`)
> - c) Num Profile novo
> - d) Na extensão do Prettier, globalmente
>
> > [!check]- Resposta
> > **b)** Workspace vale só pra pasta aberta e pode ir pro Git, então o time todo usa igual. User vale pra todos os projetos.

---

## Pra consultar depois

| Atalho (Windows/Linux) | O que faz |
|---|---|
| `Ctrl + P` | Abre arquivo pelo nome |
| `Ctrl + Shift + P` | Command Palette |
| `` Ctrl + ` `` | Abre/fecha o terminal integrado |
| `Ctrl + B` | Mostra/esconde a barra lateral |
| `Ctrl + D` | Seleciona a próxima ocorrência |
| `Alt + ↑ / ↓` | Move a linha |
| `Shift + Alt + ↓` | Duplica a linha |
| `Ctrl + /` | Comenta/descomenta |
| `F2` | Renomeia o símbolo no projeto inteiro |
| `F12` | Vai pra definição |

**Pra ler:** a [documentação oficial](https://code.visualstudio.com/docs) tem vídeos curtos de introdução que valem muito. O [PDF de atalhos pra Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) é ótimo pra imprimir e deixar do lado do teclado por uma semana. E o [Marketplace](https://marketplace.visualstudio.com/vscode) é onde você procura extensões.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

**Checklist de progresso:**
- [x] Instalar o VS Code e a extensão do seu primeiro idioma de programação
- [x] Configurar `settings.json` com formatação ao salvar
- [x] Aprender a usar o debugger (`launch.json`)
- [x] Explorar o Remote - SSH para editar arquivos em servidores

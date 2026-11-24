---
nivel: escrito
foco: essencial
revisado:
---

# Gerenciador de Pacotes

**Quanto focar: 🔥 essencial.** Todo projeto começa com `npm install`. Entender `package.json`, dependências e scripts é obrigatório desde o primeiro projeto.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você precisa mostrar "há 3 dias" do lado de uma data no seu programa. Dá pra escrever isso do zero: calcular a diferença em milissegundos, converter pra dias, tratar horas, meses, anos, plural, fuso horário... ou dá pra usar uma biblioteca que alguém já escreveu, testou e que milhões de pessoas usam. Quase nenhum projeto de verdade é feito do zero. Ele é montado em cima de **pacotes**: código pronto pra validar dados, lidar com datas, criar servidores.

Só que pacotes trazem um problema novo. Eles têm versões, dependem de outros pacotes, que dependem de outros, e alguém precisa baixar tudo isso, na versão certa, em cada computador onde o projeto roda. Esse alguém é o **gerenciador de pacotes**: o **npm** no JavaScript, o **pip** no Python, e assim por diante.

Esta nota gira em torno de uma ideia que, quando você entende, resolve o clássico "na minha máquina funciona": **existe um arquivo que diz o que você quer, e outro que diz exatamente o que foi instalado.**

## A lista de compras e o recibo

Todo projeto JavaScript tem um `package.json`, o **manifesto**. Pense nele como uma lista de compras: o que o projeto precisa, e quais versões ele aceita.

```json
{
    "name": "meu-projeto",
    "dependencies": {
        "express": "^4.19.0"
    },
    "devDependencies": {
        "eslint": "^9.0.0"
    }
}
```

Repare no `^` antes da versão. Ele quer dizer que `^4.19.0` **não é uma versão exata**, é um intervalo: "a 4.19.0 ou qualquer uma mais nova, desde que comece com 4". As versões seguem o padrão [[Tags e Versionamento Semântico|SemVer]], `MAJOR.MINOR.PATCH`: o `^` aceita MINOR e PATCH novos, e o `~` aceita só PATCH.

E é aqui que mora o problema. Se você instala hoje, pega a 4.19.0. Um colega instala daqui a um mês e pega a 4.21.0, que saiu nesse meio tempo. Duas máquinas, duas versões, e um bug que só aparece numa delas. Nenhum dos dois fez nada errado.

Quem resolve isso é o **lockfile**, o `package-lock.json`. Se o manifesto é a lista de compras, o lockfile é o **recibo**: ele anota a versão **exata** de cada pacote que foi instalado, inclusive das dependências das dependências. Quando outra pessoa roda `npm install`, o npm segue o recibo, e todo mundo fica com as mesmas versões.

| Arquivo | Diz | Quem escreve |
|---|---|---|
| `package.json` | o que você quer (intervalos) | você (e o `npm install x`) |
| `package-lock.json` | o que foi instalado (exato) | o npm, sozinho |

Por isso, quando alguma coisa dá errado na instalação, resista à tentação de **apagar o lockfile pra "resolver"**. Funciona na hora, mas sem ele cada pessoa volta a instalar versões diferentes, e o problema que ele evitava volta junto.

Em outras linguagens a ideia é a mesma, só muda o nome dos arquivos: no Python, `requirements.txt` ou `pyproject.toml`, e com poetry existe o `poetry.lock`.

## O que o programa precisa, e o que só você precisa

Olhe de novo o `package.json`: tem duas listas. Elas existem porque nem todo pacote é igual.

As **`dependencies`** são o que o programa precisa **pra rodar**. Um servidor precisa do `express`; o programa das datas precisa do `dayjs`. Já as **`devDependencies`** são o que **você** precisa pra programar, mas o programa não precisa pra funcionar: o [[Linter]], o [[Formatter]], o TypeScript, as ferramentas de teste.

```bash
npm install dayjs        # vai pra dependencies
npm install -D eslint    # o -D manda pra devDependencies
```

Por que separar? Quando o programa vai pro servidor de produção, só as `dependencies` são instaladas. O servidor não precisa do ESLint pra rodar, e cada pacote a menos é menos coisa pra baixar e menos código de terceiros rodando lá.

## O que vai pro Git

Depois do primeiro `npm install`, aparece uma pasta `node_modules` no projeto. É onde os pacotes ficam de verdade, e ela é **enorme**, facilmente centenas de megabytes. A boa notícia é que ela pode ser recriada a qualquer momento a partir dos dois arquivos que já vimos. Então a regra é:

- `package.json` **vai** pro Git.
- `package-lock.json` **vai** pro Git.
- `node_modules/` **não vai**. Ela entra no `.gitignore`.

```gitignore
node_modules/
.venv/
```

Com isso, clonar o projeto de outra pessoa e deixar funcionando vira uma receita de quatro linhas:

```bash
git clone https://github.com/usuario/projeto.git
cd projeto
npm install        # recria o node_modules a partir do package.json e do lockfile
npm run start
```

## npm install no dia a dia, npm ci na automação

Existem dois comandos que instalam as dependências, e a diferença entre eles é exatamente a diferença entre manifesto e lockfile.

O **`npm install`** é o do dia a dia. Ele instala, e se precisar, **atualiza o lockfile**, por exemplo quando você acabou de adicionar um pacote novo.

O **`npm ci`** (de *clean install*) é pra automação, como a CI e os servidores. Ele apaga o `node_modules`, instala **exatamente** o que está no lockfile, e **falha** se o lockfile não bater com o `package.json`. Ele é mais rígido de propósito: na CI, você quer testar exatamente o que está no repositório, sem nenhuma atualização surpresa.

## Atalhos do projeto

O `package.json` guarda mais uma coisa útil: os comandos do projeto.

```json
{
    "scripts": {
        "start": "node index.js",
        "lint": "eslint .",
        "format": "prettier --write ."
    }
}
```

Você roda com `npm run lint` ou `npm run format` (o `start` e o `test` dispensam o `run`). Parece pouco, mas muda a experiência de chegar num projeto novo: ninguém precisa lembrar o comando completo de nada, é só abrir o `package.json` e ler.

E quando você quer rodar uma ferramenta sem instalar no projeto, existe o `npx`: `npx prettier --check .` baixa e roda na hora.

## Pacote é código de um estranho

Vale parar um segundo pra lembrar do óbvio: todo pacote que você instala é **código de outra pessoa rodando no seu computador**. Na maioria das vezes, tudo bem. Mas existem pacotes maliciosos publicados com nomes quase iguais aos famosos, esperando um erro de digitação. Antes de instalar algo, confira se é popular, se foi atualizado recentemente e qual a licença. E rode `npm audit` de vez em quando: ele lista vulnerabilidades conhecidas nos pacotes que você usa.

Outro problema que você vai encontrar cedo ou tarde é o **conflito de versões**: dois pacotes exigem versões incompatíveis de um terceiro, e a instalação falha. A mensagem de erro parece um muro de texto, mas ela diz quem exige o quê. Leia, e normalmente a solução é atualizar o pacote mais velho. Apagar o `node_modules` e rodar `npm install` de novo fica como último recurso.

## Fora do JavaScript

Cada linguagem tem o seu gerenciador: **pip**, **uv** e **poetry** no Python, **Maven** e **Gradle** no Java, **NuGet** no .NET, **Cargo** no Rust, **Composer** no PHP. As ideias desta nota valem pra todos.

O Python tem uma particularidade: por padrão, ele instala os pacotes **no computador inteiro**, e dois projetos que precisam de versões diferentes de uma biblioteca acabam brigando. Por isso, todo projeto Python ganha o seu **ambiente virtual**, uma pasta isolada só com os pacotes dele:

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1     # Windows (PowerShell)
source .venv/bin/activate      # Linux/macOS
pip install -r requirements.txt
```

E não confunda com os gerenciadores do **sistema operacional**, como `winget`, `apt` e `brew`. Eles instalam **programas** no computador (o Git, o Node, o VS Code), não bibliotecas de um projeto.

## O essencial

1. `package.json` diz o que você quer (intervalos); `package-lock.json` diz o que foi instalado (exato).
2. `dependencies` é o que o programa precisa pra rodar; `devDependencies` (`-D`) é o que você precisa pra programar.
3. Manifesto e lockfile vão pro Git; `node_modules` não.
4. `npm install` no dia a dia, `npm ci` na CI.

## Agora é com você

Faça o ciclo completo uma vez, com as mãos: crie uma pasta, rode `npm init -y`, instale o `dayjs` e, como dependência de desenvolvimento, o `prettier`. Escreva um `index.js` que usa o `dayjs` pra imprimir a data de hoje. Agora **apague a pasta `node_modules`**, rode `npm install` de novo e veja tudo voltar. Você terminou quando o programa funcionar depois disso e você souber explicar por que o `dayjs` está em `dependencies` e o `prettier` em `devDependencies`.

Depois, um projeto curto e satisfatório: **transformar um script seu num comando de terminal de verdade**, igual aos que você instala do npm. O `package.json` precisa de `name`, `version`, `"type": "module"` e um campo `"bin"` apontando pro seu script, que começa com `#!/usr/bin/env node`. Rode `npm link`, e o comando passa a funcionar de qualquer pasta (`ola Ana`). Inclua os scripts `dev`, `build` e `start`, e use uma dependência de verdade no código. Você terminou quando, num terminal novo, em outra pasta, digitar o nome do comando rodar o seu código. É o mesmo caminho que o [[Gerenciador de Tarefas no Terminal]] vai seguir. Se quiser ir além, rode `npm outdated` e `npm audit` e entenda a saída, experimente o `pnpm` e compare o tamanho do `node_modules`, ou publique no npm com um nome com escopo (`@seu-usuario/ola`).

Daqui, os próximos passos são o [[Linter]] e o [[Formatter]], as duas primeiras `devDependencies` que todo projeto ganha.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `package.json` e `package-lock.json`?
> O `package.json` lista as dependências e as faixas de versão aceitas. O lockfile registra a versão **exata** instalada de cada pacote (e das dependências delas).

> [!question]- O que significa `"dayjs": "^1.4.2"`?
> Aceita qualquer `1.x.x` a partir de `1.4.2` (novos MINOR e PATCH), mas nunca `2.0.0`.

> [!question]- `node_modules` vai pro Git? E o lockfile?
> `node_modules` **não** (vai no `.gitignore`). O lockfile **sim**.

> [!question]- `npm install` vs `npm ci`?
> `npm ci` instala exatamente o que está no lockfile, do zero, e falha se ele não bater com o `package.json`. É o certo pra CI.

> [!question]- Dependência de produção vs de desenvolvimento: dê exemplos.
> Produção: o que o app usa rodando (`dayjs`, `express`). Dev: só pra desenvolver (`prettier`, `eslint`), instalado com `-D`.

> [!question]- Por que apagar o lockfile não é uma boa forma de "resolver" um problema?
> Sem ele, cada pessoa volta a instalar versões diferentes, e o "na minha máquina funciona" volta.

> [!question]- `npm install -D pacote`
> instala como dependência de desenvolvimento

> [!question]- SemVer `MAJOR.MINOR.PATCH`
> MAJOR quebra compatibilidade · MINOR adiciona recurso · PATCH corrige bug

> [!question]- `~1.4.2`
> aceita só patches (`1.4.x`)

> [!question]- `python -m venv .venv`
> cria um ambiente isolado em Python

> [!question]- `pip freeze > requirements.txt`
> salva as dependências instaladas

> [!question]- `npx`
> executa um pacote sem instalá-lo globalmente

> [!question]+ O `package.json` tem `"dayjs": "^1.4.2"`. Qual versão o `npm install` **pode** instalar?
> - a) Só a `1.4.2`
> - b) `1.4.9`, mas não `1.5.0`
> - c) `1.9.0`, mas não `2.0.0`
> - d) Qualquer uma, até a `2.3.0`
>
> > [!check]- Resposta
> > **c)** `^` aceita MINOR e PATCH novos, mas não muda o MAJOR. Quem trava no MINOR (`1.4.x`) é o `~`.

> [!question]+ No pipeline de CI, qual comando usar pra instalar as dependências?
> - a) `npm install`, porque atualiza o lockfile se precisar
> - b) `npm ci`, porque instala exatamente o que está no lockfile
> - c) `npm update`, pra pegar as versões mais novas
> - d) `npx install`
>
> > [!check]- Resposta
> > **b)** `npm ci` apaga o `node_modules`, instala **exatamente** o lockfile e falha se ele não bate com o `package.json`. É o que garante que a CI testa o mesmo que você.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências do projeto |
| `npm install pacote` / `-D pacote` | Adiciona um pacote / como dependência de dev |
| `npm uninstall pacote` | Remove um pacote |
| `npm update` | Atualiza dentro das faixas permitidas |
| `npm outdated` | Mostra o que tem versão nova |
| `npm audit` | Verifica vulnerabilidades |
| `npm ci` | Instalação limpa a partir do lockfile |
| `npm run nome` | Roda um script do `package.json` |
| `pip install -r requirements.txt` | Instala a lista de pacotes Python |
| `pip freeze` | Lista as versões instaladas |

**Pra ler:** a [documentação do npm](https://docs.npmjs.com) tem uma parte "About semantic versioning" curta e clara. A [especificação do SemVer](https://semver.org/lang/pt-BR/) está em português e cabe numa leitura de dez minutos. Se for usar Python, a [documentação do pip](https://pip.pypa.io/en/stable/) cobre ambientes virtuais e `requirements.txt`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

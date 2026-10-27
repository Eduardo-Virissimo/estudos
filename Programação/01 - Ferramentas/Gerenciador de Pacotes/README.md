# 📚 Gerenciador de Pacotes

> *"Não reinvente a roda: instale-a, versione-a e atualize-a."*

---

## O que é um Gerenciador de Pacotes?

Um **gerenciador de pacotes** é uma ferramenta que **instala, atualiza e remove bibliotecas e dependências** de um projeto. Em vez de baixar arquivos manualmente, você pede o pacote pelo nome e a ferramenta busca, resolve as versões compatíveis e instala tudo, incluindo as dependências do pacote.

Exemplos por ecossistema:

- **npm**, **yarn**, **pnpm**: JavaScript/Node.js
- **pip** (e **uv**, **poetry**): Python
- **Maven**, **Gradle**: Java
- **NuGet**: .NET
- **Cargo**: Rust
- **Composer**: PHP

Também existem gerenciadores de pacotes do **sistema operacional** (`apt`, `brew`, `winget`), que instalam programas, não bibliotecas de projeto.

### Uma História Breve 📜

Gerenciadores de pacotes de sistema (como `dpkg`/`apt` no Debian) existem desde os anos 1990. Para linguagens de programação, o movimento cresceu com **CPAN** (Perl), **RubyGems**, **Maven** (Java, 2004) e **pip** (Python). O **npm** surgiu em **2010**, criado por Isaac Schlueter, e se tornou um dos maiores registros de pacotes do mundo.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Reuso de código**: milhares de bibliotecas prontas para usar.
- 📦 **Dependências organizadas**: o projeto declara o que precisa, e qualquer pessoa reproduz o ambiente.
- 🔧 **Controle de versões**: atualiza com segurança e evita conflitos.
- 🤖 **Automação**: facilita builds, CI/CD e deploys reproduzíveis.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Manifesto de dependências

Arquivo que lista o que o projeto precisa:

- npm: `package.json`
- pip: `requirements.txt` (ou `pyproject.toml`)
- Maven: `pom.xml`

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

### Conceito 2: Versionamento semântico (SemVer)

Versões no formato `MAJOR.MINOR.PATCH` (ex.: `4.19.2`):

- **MAJOR**: mudanças que quebram compatibilidade
- **MINOR**: novas funcionalidades compatíveis
- **PATCH**: correções de bugs

No npm, `^4.19.0` aceita atualizações MINOR e PATCH; `~4.19.0` aceita só PATCH.

### Conceito 3: Lockfile

Arquivo que **trava as versões exatas** instaladas, garantindo que todos tenham o mesmo resultado: `package-lock.json` (npm), `yarn.lock`, `poetry.lock`, etc. **Deve ser versionado no Git.**

### Conceito 4: Dependências de produção vs desenvolvimento

Pacotes de runtime (`dependencies`) vs ferramentas usadas só no desenvolvimento, como [[Linter]] e [[Formatter]] (`devDependencies`).

### Conceito 5: Ambientes isolados (Python)

Para não misturar pacotes entre projetos, use ambientes virtuais:

```bash
python -m venv .venv
source .venv/bin/activate      # Linux/macOS
.venv\Scripts\Activate.ps1     # Windows (PowerShell)
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

npm:

```bash
npm init -y
npm install express
npm install --save-dev eslint
```

pip:

```bash
pip install requests
pip freeze > requirements.txt
```

### Exemplo 2: Caso de Uso Real

Clonar um projeto e deixá-lo funcionando:

```bash
git clone https://github.com/usuario/projeto.git
cd projeto
npm install        # instala tudo do package.json / lockfile
npm run start
```

Em Python:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Configurações Recomendadas ⚙️

Scripts úteis no `package.json`:

```json
{
    "scripts": {
        "start": "node index.js",
        "lint": "eslint .",
        "format": "prettier --write ."
    }
}
```

`.gitignore` essencial (não versionar dependências instaladas):

```text
node_modules/
.venv/
```

---

## Dicas de Ouro 💎

### 1. Versione o lockfile, ignore a pasta de dependências

`package-lock.json` vai para o Git; `node_modules/` não.

### 2. Cuidado com pacotes desconhecidos

Confira popularidade, manutenção e licença antes de instalar. Pacotes maliciosos ou abandonados existem. Use `npm audit` para checar vulnerabilidades conhecidas.

### 3. Use `npm ci` na integração contínua

Instala exatamente o que está no lockfile, de forma limpa e reproduzível.

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `npm install` | Instala as dependências do projeto |
| `npm install pacote` | Adiciona um pacote |
| `npm install -D pacote` | Adiciona como dependência de desenvolvimento |
| `npm uninstall pacote` | Remove um pacote |
| `npm update` | Atualiza dentro das faixas permitidas |
| `npm audit` | Verifica vulnerabilidades |
| `npm ci` | Instalação limpa a partir do lockfile |
| `pip install pacote` | Instala pacote Python |
| `pip install -r requirements.txt` | Instala lista de pacotes |
| `pip freeze` | Lista versões instaladas |
| `mvn install` | Compila e instala (Maven) |

---

## Exercício Prático 🎯

**Objetivo:** Criar um projeto, instalar dependências e reproduzi-lo do zero.

```bash
# 1. mkdir pacotes-teste && cd pacotes-teste && npm init -y
# 2. Instale a biblioteca dayjs: npm install dayjs
# 3. Instale prettier como dependência de dev: npm install -D prettier
# 4. Crie index.js usando dayjs para imprimir a data de hoje
# 5. Apague a pasta node_modules
# 6. Rode npm install de novo e execute o index.js
# 7. Olhe o package.json e o package-lock.json gerados
```

---

## Próximos Passos ✅

- [ ] Praticar npm (ou pip) em um projeto pequeno
- [ ] Entender SemVer e a diferença entre `^` e `~`
- [ ] Aprender ambientes virtuais em Python
- [ ] Conhecer alternativas modernas (pnpm, yarn, uv, poetry)

---

## Recursos Recomendados 📚

### 💻 Sites e Documentação:
- [Documentação do npm](https://docs.npmjs.com) - Guia oficial
- [pip](https://pip.pypa.io/en/stable/) - Documentação oficial do pip
- [Maven](https://maven.apache.org/guides/) - Guias oficiais do Maven
- [Semantic Versioning](https://semver.org/lang/pt-BR/) - Especificação do SemVer

---

## Problemas Comuns e Soluções 🔧

### Problema: Conflito de versões entre dependências

**Solução:**
1. Leia a mensagem de erro para ver qual pacote exige qual versão.
2. Atualize ou fixe as versões compatíveis.
3. Como último recurso, reinstale do zero (apague `node_modules` e rode `npm install`).

### Problema: "command not found: npm" / "pip não é reconhecido"

**Solução:**
1. Instale o Node.js (que traz o npm) ou o Python (que traz o pip).
2. Verifique se estão no `PATH` e reabra o [[Terminal]].

---

## Conclusão 🎉

Gerenciadores de pacotes são a base do desenvolvimento moderno: eles dão acesso ao trabalho de milhões de pessoas e garantem que seu projeto seja reproduzível em qualquer máquina. Entender manifesto, versões e lockfile evita muitos dos problemas clássicos de "na minha máquina funciona".

Pratique com projetos pequenos e crie o hábito de gerenciar dependências com cuidado.

---

*Este material segue o padrão da pasta Ferramentas para manter consistência entre todos os tópicos do vault de estudos.* 🎯

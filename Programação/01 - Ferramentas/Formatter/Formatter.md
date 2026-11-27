---
nivel: escrito
foco: importante
revisado:
---

# Formatter

**Quanto focar: 📌 importante.** Configura uma vez e esquece. Saiba ligar o Prettier e o formatar ao salvar; é meia hora de estudo, não mais.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 10 min no Me teste e 20 min no desafio. O projeto maior do fim do desafio fica fora dessa conta.

**🔁 Pra rever: cerca de 20 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você abre um pull request pra corrigir um bug de uma linha. Quando o colega vai revisar, o Git mostra **duzentas linhas mudadas**. O que aconteceu? O seu editor usa 4 espaços, o dele usa 2, você prefere aspas duplas, ele simples, e ao salvar o arquivo, o seu editor "arrumou" tudo do seu jeito. A linha que importa está escondida no meio de cento e noventa e nove que só mudaram de aparência.

Esse problema tem uma solução tão simples que parece trapaça: deixar um programa decidir a aparência do código por todo mundo. Esse programa é o **formatter**. Ele reescreve espaços, aspas, quebras de linha e ponto e vírgula num padrão fixo, e **nunca muda o que o código faz**, só como ele parece. Em JavaScript e TypeScript, o mais usado é o **Prettier**.

A ideia que vale levar desta nota: **você configura uma vez, o editor formata ao salvar, e você nunca mais pensa em formatação.** Nem você, nem ninguém do time.

## O que muda (e o que não muda)

Olhe o mesmo código antes e depois do Prettier:

```javascript
// Antes
const soma = (a,b)=>{return a+b}
if(x==1){console.log('ok')}

// Depois (Prettier, configuração padrão)
const soma = (a, b) => {
  return a + b;
};
if (x == 1) {
  console.log("ok");
}
```

Ficou bem mais legível: espaços em volta dos operadores, cada coisa na sua linha, aspas padronizadas. Mas repare num detalhe: o `==` continua lá. Em JavaScript, `==` é uma comparação traiçoeira (o certo quase sempre é `===`), e o formatter nem pisca. **Ele não corrige erros.** Achar o `==` suspeito é trabalho do [[Linter]]. Vale fixar a divisão: o formatter cuida da forma, o linter cuida do conteúdo.

Cada linguagem tem o seu formatter: **Prettier** pra JavaScript, TypeScript, CSS, HTML, JSON e Markdown; **Black** ou **Ruff** pra Python; **gofmt** pra Go; **rustfmt** pra Rust. A ideia é a mesma em todos.

## O jeito certo de usar: não pensar nele

Se você precisa lembrar de rodar o formatter, um dia vai esquecer. O jeito certo é o editor formatar **toda vez que você salva**. Primeiro, instale o Prettier no projeto:

```bash
npm install --save-dev prettier
```

Depois, no [[VS Code]], instale a extensão Prettier e coloque isto no `settings.json`:

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
}
```

A partir daí, você escreve do jeito que sair, aperta `Ctrl + S`, e o código se arruma sozinho. É uma sensação libertadora na primeira semana: você para de alinhar chaves e contar espaços.

Se um dia salvar e nada acontecer, as suspeitas são sempre as mesmas: não tem um formatter padrão definido (aquele `editor.defaultFormatter`), a extensão não está instalada ou não suporta esse tipo de arquivo, o arquivo está listado no `.prettierignore`, ou tem um erro de sintaxe que impede o Prettier de entender o código.

Também dá pra rodar pelo terminal, o que é útil pra formatar um projeto inteiro de uma vez:

```bash
npx prettier --write .    # formata tudo
npx prettier --check .    # só confere, sem mudar nada
```

O `--check` parece inútil à primeira vista, mas é ele que vai na **CI** (o robô que testa o código a cada push): ele falha se algum arquivo não estiver formatado, sem alterar nada. Assim, código fora do padrão nem chega na branch principal.

## A configuração mora no repositório

Agora vem a parte que faz isso funcionar num time. Se cada pessoa configurar o Prettier no próprio editor, cada uma vai formatar de um jeito, e voltamos às duzentas linhas do começo. Por isso, a configuração vai num arquivo `.prettierrc` **dentro do projeto, versionado no Git**:

```json
{
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "printWidth": 80
}
```

Repare como ela é pequena. Os formatters modernos são **opinativos** (*opinionated*) de propósito: têm poucas opções, justamente pra ninguém reabrir a discussão de "tab ou espaço". Você escolhe uma vez, e a conversa acabou.

Pelo mesmo motivo, fixe a versão do Prettier no `package.json` como `devDependency` (o `npm install --save-dev` já faz isso). Versões diferentes às vezes formatam um pouco diferente, e aí o problema volta pela porta dos fundos.

E crie um `.prettierignore` pra ele pular o que não é seu, como pastas geradas:

```text
node_modules
dist
build
```

## Ligando num projeto que já existe

Num projeto novo, o formatter entra desde o primeiro dia e ninguém sofre. Num projeto antigo, a primeira vez que você rodar `prettier --write .`, ele vai mudar **centenas de arquivos**. Tudo bem, desde que isso vá num **commit separado**, só de formatação, com uma mensagem tipo `style: formata o projeto com Prettier`. Se você misturar isso com uma mudança de lógica, ninguém mais acha a mudança real no meio de mil linhas reformatadas (nem você, daqui a seis meses, usando `git blame`).

E se o projeto já tem um linter, desligue as regras de estilo dele que fazem o mesmo trabalho do formatter. Senão os dois brigam: um formata de um jeito, o outro reclama daquele jeito. No ESLint, quem faz isso é o pacote `eslint-config-prettier`.

Uma curiosidade pra fechar: antes dos formatters, times perdiam horas de verdade discutindo estilo em code review. Quem mudou isso foi o **gofmt**, da linguagem Go, que trouxe a ideia de um formato oficial e único. No JavaScript, o Prettier (por volta de 2017) virou o padrão, e no Python o Black fez o mesmo, com o lema "o formatador sem concessões".

## O essencial

1. O formatter muda só a aparência. Nunca o comportamento, e nunca corrige bug (isso é o linter).
2. Configure pra formatar ao salvar e esqueça que ele existe.
3. O `.prettierrc` e a versão do Prettier vão pro repositório, pra todo mundo formatar igual.
4. `--check` na CI, `--write` pra formatar tudo, e formatação de projeto antigo num commit só dela.

## Agora é com você

Comece sentindo o efeito: com a extensão instalada e o formatar ao salvar ligado, crie um `.js` bem bagunçado (sem espaços, aspas misturadas, tudo numa linha) e salve. Depois crie um `.prettierrc`, mude o `tabWidth` pra 4, salve de novo e veja tudo se reajustar. Termine rodando `npx prettier --check .` pra ver como a CI enxergaria o projeto.

Depois, feche a sequência [[Gerenciador de Pacotes]] → [[Linter]] → Formatter montando o seu **kit inicial de projeto JS**: um repositório `kit-js` que você reaproveita em todo projeto novo. Ele precisa de um `package.json` com os scripts `lint`, `format` e `check` (lint + `prettier --check`), ESLint e Prettier convivendo sem brigar, um `.editorconfig` e um `.vscode/settings.json` com formatar ao salvar, e um README curto explicando como começar a partir dele. Você terminou quando criar um projeto novo a partir do kit e estiver tudo funcionando em menos de 2 minutos. Se quiser ir além, marque o repositório como **Template repository** no GitHub, rode o `check` antes de cada commit com `husky` + `lint-staged`, e adicione TypeScript quando chegar em [[TypeScript]].

O próximo passo é o [[Git Básico]], onde você vai ver na prática por que diffs limpos importam tanto.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre formatter e linter?
> O **formatter** cuida da aparência. O **linter** aponta problemas de qualidade e bugs prováveis (variável não usada, `==`).

> [!question]- Por que a configuração do formatter vai pro repositório?
> Pra todo mundo formatar igual. Sem isso, cada commit vira uma guerra de diffs de estilo.

> [!question]- Por que formatar o projeto inteiro num commit separado?
> Pra não misturar mudança de lógica com mudança de estilo. O review e o `git blame` ficam limpos.

> [!question]- O arquivo não formata ao salvar. O que checar?
> `editor.formatOnSave` ligado, o Prettier definido como formatter padrão, extensão instalada, se o arquivo está no `.prettierignore` e se tem erro de sintaxe.

> [!question]- O que faz `npx prettier --check .`?
> Verifica se está tudo formatado **sem alterar nada**. Ideal pra CI.

> [!question]- `editor.formatOnSave`
> config do VS Code que formata ao salvar

> [!question]- `.prettierrc`
> arquivo de configuração do Prettier

> [!question]- `prettier --write .`
> formata todos os arquivos

> [!question]- Formatter "opinionated"
> poucas opções de propósito, pra ninguém discutir estilo

> [!question]- `eslint-config-prettier`
> desliga as regras de estilo do ESLint que brigam com o Prettier

> [!question]- Formatter muda o comportamento do código?
> Não. Só a aparência.

> [!question]+ Qual destas coisas é trabalho do **formatter**, e não do linter?
> - a) Avisar que uma variável foi declarada e nunca usada
> - b) Trocar aspas simples por duplas e quebrar linhas longas
> - c) Proibir `==` no lugar de `===`
> - d) Detectar um `await` esquecido
>
> > [!check]- Resposta
> > **b)** O formatter só mexe na **aparência** (espaços, aspas, quebras) e não muda o comportamento. As outras são regras de **qualidade**, trabalho do linter.

---

## Pra consultar depois

| Comando / arquivo | O que faz |
|---|---|
| `npx prettier --write .` | Formata todos os arquivos suportados |
| `npx prettier --check .` | Só verifica, sem alterar |
| `black .` / `black --check .` | Formata / verifica um projeto Python |
| `gofmt -w .` | Formata código Go |
| `.prettierrc` | Configuração do Prettier |
| `.prettierignore` | O que não deve ser formatado |

**Pra ler:** a [documentação do Prettier](https://prettier.io/docs/en/) é curta; a página "Rationale" explica por que ele tem tão poucas opções e vale a leitura. Pra Python, o [Black](https://black.readthedocs.io) é o clássico e o [Ruff Formatter](https://docs.astral.sh/ruff/formatter/) é a alternativa mais rápida.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

**Checklist de progresso:**
- [x] Instalar o formatter da sua linguagem principal
- [x] Ativar formatação ao salvar no editor
- [x] Adicionar `format:check` na integração contínua
- [x] Combinar com um [[Linter]] no mesmo projeto

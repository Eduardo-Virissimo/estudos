---
nivel: escrito
foco: importante
revisado:
---

# Linter

**Quanto focar: 📌 importante.** Todo projeto profissional tem um, e ele pega bug antes de você rodar. Saiba configurar e entender o que ele aponta; os detalhes das regras você consulta.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 15 min de leitura, 10 min no Me teste e 25 min no desafio. O projeto maior do fim do desafio fica fora dessa conta.

**🔁 Pra rever: cerca de 20 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Olhe estas duas linhas e tente achar o problema:

```javascript
const nome = "Ana";
if (idade == "18") { }
```

Nenhuma delas dá erro. O programa roda. Mas a primeira declara uma variável que nunca é usada (você esqueceu de alguma coisa?), e a segunda usa `==`, que em JavaScript converte os tipos antes de comparar, então `"18" == 18` dá `true` e um monte de bug passa escondido. Código assim é **certo e suspeito ao mesmo tempo**: o compilador não reclama, porque não tem nada errado na escrita, mas provavelmente não faz o que você queria.

É pra esse tipo de coisa que existe o **linter**: um programa que lê o seu código **sem rodar** e aponta bugs prováveis e más práticas. É como ter um revisor que nunca cansa, lendo cada linha enquanto você digita. Em JavaScript e TypeScript, o mais usado é o **ESLint**.

O caminho pra usar bem é curto: **comece com as regras recomendadas, deixe os avisos aparecerem no editor, e rode também na CI, pra nada passar.**

## Como ele funciona

O que o linter faz se chama **análise estática**: ele lê o código como texto, sem executar nada, e compara com uma lista de **regras**. "Variável declarada e nunca usada" é uma regra. "Não use `==`" é outra. "Promise sem `await`" é outra.

O nome tem uma história curiosa. Nos anos 70, nos Bell Labs, criaram um programa chamado **lint** pra achar problemas em código C que o compilador deixava passar. *Lint* é aquela pelugem que gruda na roupa e que você tira com uma escovinha. O programa tirava a "pelugem" do código.

Cada linguagem tem os seus: **ESLint** pra JavaScript e TypeScript, **Ruff**, **Pylint** e **Flake8** pra Python, **Checkstyle** pra Java, e o **ShellCheck** pro [[Bash]].

Pra começar com o ESLint:

```bash
npm install --save-dev eslint @eslint/js
npx eslint .           # aponta os problemas
npx eslint . --fix     # corrige sozinho o que for seguro corrigir
```

Mas o passo que mais faz diferença é outro: instalar a **extensão do ESLint no [[VS Code]]**. Com ela, os problemas aparecem sublinhados **enquanto você digita**. Isso importa porque o custo de corrigir um bug cresce com o tempo: no momento em que você escreve, é um segundo; depois que foi pro ar, pode ser uma tarde inteira.

## Linter não é formatter

Os dois vivem sendo confundidos, porque andam juntos. Mas fazem trabalhos bem diferentes.

O **linter** cuida da **qualidade**: "essa variável nunca é usada", "esse `==` pode dar bug". O [[Formatter]] cuida da **aparência**: espaços, aspas, quebras de linha. O formatter nunca muda o que o código faz; o linter aponta o que pode estar errado no que ele faz. Você quer os dois.

Só tem um ponto de atrito. O ESLint também tem algumas regras de estilo, e às vezes elas discordam do Prettier: um formata, o outro reclama da formatação, e você fica no meio. A solução é dar a cada um o seu trabalho: o pacote `eslint-config-prettier` desliga as regras de estilo do ESLint, e o estilo fica só com o formatter.

## Regras e configuração

Cada regra pode estar em três níveis: **desligada** (`off`), **aviso** (`warn`, sublinhado amarelo) ou **erro** (`error`, sublinhado vermelho, e o comando falha). No ESLint moderno, da versão 9 em diante, a configuração fica num arquivo `eslint.config.js`:

```javascript
// eslint.config.js
import js from "@eslint/js";

export default [
    js.configs.recommended,     // o conjunto de regras recomendado
    {
        rules: {
            "no-unused-vars": "warn",
            "eqeqeq": "error"      // proíbe == e exige ===
        }
    }
];
```

O `js.configs.recommended` é um conjunto de regras escolhido pela própria equipe do ESLint. **Comece por ele** e só mude uma regra quando tiver um motivo. (Em tutoriais mais antigos você vai ver um arquivo `.eslintrc`: era o formato das versões anteriores.)

Uma tentação que aparece logo: a regra reclama, você não entende por quê, e desliga. Resista. Quase toda regra existe porque alguém já perdeu horas com aquele bug. Entenda o motivo primeiro. Se for mesmo um caso pontual e justificado, desligue **só naquela linha**, com um comentário dizendo por quê:

```javascript
// eslint-disable-next-line no-console -- log de diagnóstico, removido depois do deploy
console.log(dados);
```

## Rodando em todo lugar

O linter só protege se ele roda. Coloque os comandos no `package.json`:

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

E faça ele rodar em três momentos: **no editor**, enquanto você digita; **antes do commit**, com [[Git Hooks]]; e **na CI**, a cada pull request. A CI é a garantia final: mesmo quem não configurou o editor não consegue juntar código que quebra as regras.

No VS Code, dá pra fazer o ESLint corrigir o que for automático toda vez que você salva:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

E se você ligar o linter num projeto antigo e aparecerem **3.000 avisos**? Não tente corrigir tudo de uma vez, porque você vai desistir na metade. Comece só com as regras de erro, rode `--fix` no que for seguro, e vá ligando o resto aos poucos, pasta por pasta.

No Python, o equivalente moderno é o **Ruff**: `pip install ruff` e `ruff check .`. Ele é absurdamente rápido e ainda formata o código.

## O essencial

1. O linter lê o código sem rodar e aponta o que é provavelmente um bug ou uma má prática.
2. Linter cuida da qualidade; formatter cuida da aparência. Use os dois, com `eslint-config-prettier` pra não brigarem.
3. Comece com as regras recomendadas. Regra desligada, só numa linha e com motivo.
4. Rode no editor, antes do commit e na CI.

## Agora é com você

Crie um projeto (`npm init -y`), instale `eslint` e `@eslint/js`, e monte o `eslint.config.js` com as regras recomendadas. Escreva um `index.js` cheio de pecados: uma variável que nunca é usada, um `==` no lugar de `===`. Rode `npx eslint .`, leia as mensagens com calma, e corrija (algumas com `--fix`). Você terminou quando o comando passar sem nenhum erro nem aviso, e você souber explicar o que cada regra que disparou estava protegendo.

Depois, ligue o linter de verdade no **projeto modelo TypeScript**, aquele que você vai copiar pros próximos. Use `@eslint/js` junto com `typescript-eslint` no modo `recommendedTypeChecked`, e ligue as regras que pegam os bugs que as notas do Estágio 1 avisam: `eqeqeq`, `@typescript-eslint/no-explicit-any` e `@typescript-eslint/no-floating-promises` (que pega o `await` esquecido de [[Async e Await]]). Crie o script `"lint": "eslint ."` e deixe o projeto passando com zero erros. Você terminou quando `npm run lint` passar, e um `async` sem `await` ou um `==` colocado de propósito fizerem o lint falhar. Se quiser ir além, rode o lint só nos arquivos do commit com lint-staged ([[Git Hooks]]) e a cada PR no [[GitHub Actions]].

O próximo passo é o [[Formatter]], o parceiro do linter.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre linter e formatter?
> O **linter** acha problemas de qualidade e bugs prováveis. O **formatter** só arruma a aparência.

> [!question]- Por que `==` costuma ser marcado como erro em JS?
> Ele faz coerção de tipo: `0 == ""` dá `true`. `===` compara valor **e** tipo.

> [!question]- Projeto antigo com milhares de avisos: por onde começar?
> Rodar `--fix` no que for automático, tratar as regras mais graves primeiro e exigir lint limpo só nos arquivos que você mexer.

> [!question]- Por que rodar o linter na CI?
> Garante que código com problema não entra, mesmo se alguém do time não tiver a extensão instalada.

> [!question]- Quando é aceitável desativar uma regra?
> Com um motivo real, de forma localizada (`// eslint-disable-next-line regra -- motivo`), nunca por preguiça.

> [!question]- `npx eslint .`
> analisa o projeto inteiro

> [!question]- `npx eslint . --fix`
> corrige automaticamente o que for possível

> [!question]- `eslint.config.js`
> arquivo de configuração (flat config)

> [!question]- Níveis de uma regra
> `"off"`, `"warn"`, `"error"`

> [!question]- `no-unused-vars`
> acusa variável declarada e nunca usada

> [!question]- O linter executa o código?
> Não. A análise é estática.

> [!question]+ Por que o ESLint costuma marcar `if (idade == "18")`?
> - a) Porque `==` é mais lento que `===`
> - b) Porque `==` converte os tipos antes de comparar e esconde bugs
> - c) Porque comparar com string é proibido em JavaScript
> - d) Porque falta ponto e vírgula
>
> > [!check]- Resposta
> > **b)** `==` faz coerção: `0 == ""` e `"18" == 18` dão `true`. `===` compara valor **e** tipo, então o erro aparece em vez de passar escondido.

---

## Pra consultar depois

| Comando | O que faz |
|---|---|
| `npx eslint .` | Analisa o projeto (JavaScript/TypeScript) |
| `npx eslint . --fix` | Corrige o que for possível automaticamente |
| `// eslint-disable-next-line regra -- motivo` | Ignora a regra só na próxima linha |
| `ruff check .` | Analisa um projeto Python com Ruff |
| `pylint arquivo.py` | Analisa um arquivo Python com Pylint |
| `shellcheck script.sh` | Analisa scripts Bash |

**Pra ler:** a [documentação do ESLint](https://eslint.org/docs/latest/) tem a lista de regras, e cada uma explica o bug que evita com exemplos; abrir as regras que dispararem no seu código é a melhor forma de aprender. Pra Python, o [Ruff](https://docs.astral.sh/ruff/). E o livro *Clean Code*, de Robert C. Martin, discute muitas das práticas que os linters reforçam.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

---
nivel: escrito
foco: importante
revisado:
---

# Regex

**Quanto focar: 📌 importante.** Aparece em validação, busca no editor e tratamento de texto. Entenda o básico (classes, quantificadores, grupos) e consulte o resto quando precisar.

Você tem um formulário com um campo de CEP e precisa checar se o que a pessoa digitou parece mesmo um CEP. Ou tem 300 arquivos onde as datas estão como `2026-10-27` e precisa trocar todas pra `27/10/2026`. Ou quer achar, num log enorme, todas as linhas com um número de pedido. Em nenhum desses casos você está procurando um **texto exato**. Você está procurando **qualquer coisa que se pareça com um padrão**.

É pra isso que existe a **regex** (expressão regular): uma mini-linguagem pra descrever padrões de texto. Com ela você busca, valida e substitui em massa, no código, no editor e no terminal.

E sim, à primeira vista ela parece um gato que andou no teclado. Mas tem um segredo: um padrão de regex se monta como uma frase. Pro CEP `88000-000`, você diria: "do começo, cinco dígitos, um hífen, três dígitos, e acabou". Em regex:

```regex
^\d{5}-\d{3}$
```

Cada pedaço é uma tradução direta daquela frase. E quase tudo o que você vai fazer no dia a dia cabe em **quatro peças**: as que dizem **que tipo** de caractere, as que dizem **quantas vezes**, as que marcam **começo e fim**, e as que **capturam** pedaços. Vamos uma por uma.

Uma dica antes de começar: deixe o [regex101.com](https://regex101.com) aberto enquanto lê. Ele explica cada parte do padrão em tempo real e mostra o que casou.

## Que tipo de caractere

Letras e números comuns casam com eles mesmos: `abc` encontra "abc". A primeira peça, as **classes**, servem pra dizer "um caractere **deste tipo**", sem dizer qual:

```text
\d       um dígito (0 a 9)            \D  qualquer coisa que NÃO seja dígito
\w       letra, número ou _           \W  o oposto
\s       espaço, tab ou quebra        \S  o oposto
.        QUALQUER caractere (menos quebra de linha)
[abc]    a, b ou c
[a-z]    qualquer letra minúscula
[^0-9]   qualquer coisa que NÃO seja dígito (o ^ dentro dos colchetes inverte)
```

Repare no padrão das letras: minúscula é a classe, maiúscula é o contrário dela.

O ponto merece atenção, porque ele engana todo mundo. Você quer achar `site.com` e escreve exatamente isso. Funciona... mas também acha "siteXcom", porque o `.` não é um ponto, é "**qualquer caractere**". Pra dizer "um ponto de verdade", você **escapa** com uma barra: `site\.com`. O mesmo vale pra todos os símbolos que têm significado especial na regex: `\(`, `\$`, `\?`, `\+`.

## Quantas vezes

A segunda peça vem logo depois de um caractere ou classe e diz **quantas vezes** ele aparece:

```text
*      zero ou mais
+      um ou mais
?      zero ou um (ou seja, opcional)
{3}    exatamente 3
{2,5}  de 2 a 5
```

Então `\d{5}` é "cinco dígitos", `\d+` é "um ou mais dígitos", e `-?` é "um hífen, se tiver".

Os quantificadores têm uma personalidade que você precisa conhecer: eles são **gulosos**. O `.*` ("qualquer coisa, quantas vezes for") tenta pegar **o máximo possível**. Olhe o que acontece neste texto:

```text
<b>um</b> e <b>dois</b>
```

Você quer pegar cada trecho em negrito e escreve `<b>.*</b>`. Mas o resultado é o texto **inteiro**, do primeiro `<b>` até o último `</b>`, porque o `.*` foi comendo tudo até onde dava. Pra ele parar na primeira oportunidade, use a versão **preguiçosa**, com um `?` depois: `<b>.*?</b>` casa `<b>um</b>` e `<b>dois</b>` separadamente.

## Começo e fim

A terceira peça são as **âncoras**. Elas não casam nenhum caractere: marcam **posições**.

```text
^    início do texto (ou da linha)
$    fim do texto (ou da linha)
\b   borda de palavra
```

Parece um detalhe, mas este é o erro mais comum de validação com regex, e por isso é a coisa mais importante desta nota. Olhe:

```javascript
/\d{5}-\d{3}/.test("abc88000-000xyz");    // true  😱
/^\d{5}-\d{3}$/.test("abc88000-000xyz");  // false ✅
```

Sem as âncoras, a regex procura o padrão **em qualquer lugar** do texto, e "abc88000-000xyz" tem um CEP ali no meio. Pra buscar, isso é o que você quer. Mas pra **validar** um campo, você quer que o texto **inteiro** seja o padrão. Toda regex de validação começa com `^` e termina com `$`.

## Capturar e reorganizar

A quarta peça são os parênteses, que fazem duas coisas: **agrupam** (pra aplicar um quantificador a vários caracteres de uma vez) e **capturam** (guardam o pedaço que casou, pra você usar depois).

```text
(abc)     agrupa e captura
(?:abc)   agrupa SEM capturar
a|b       a OU b
```

É aqui que a regex fica poderosa de verdade. Lembra das datas `2026-10-27` que precisavam virar `27/10/2026`?

```javascript
const texto = "Entrega em 2026-10-27";
const resultado = texto.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
console.log(resultado); // "Entrega em 27/10/2026"
```

Cada par de parênteses vira um grupo numerado, na ordem em que aparece: `$1` é o ano, `$2` o mês, `$3` o dia. Na substituição, você monta os pedaços na ordem que quiser. E isso funciona também no "substituir" do [[VS Code]], em milhares de arquivos de uma vez. É o tipo de coisa que economiza uma tarde inteira.

O `(?:...)` existe pra quando você só precisa dos parênteses pra agrupar, sem guardar o pedaço. Por exemplo, `(?:ab)+` pra "ab repetido", quando você não vai usar o "ab" depois.

## Usando de verdade

No JavaScript, a regex se escreve entre barras, e depois da barra final vêm as **flags**, que mudam o comportamento:

```javascript
const cep = /^\d{5}-\d{3}$/;
cep.test("88000-000");  // true
cep.test("8800-0000");  // false
```

```text
i   ignora maiúsculas e minúsculas
g   global: todas as ocorrências, não só a primeira
m   multilinha: ^ e $ valem pra cada linha
```

Se você precisar montar a regex a partir de uma string, com `new RegExp("\\d+")`, a barra tem que ser **dobrada**, porque a própria string também usa `\` pra coisas especiais. Com a forma literal (`/\d+/`), não precisa. Esse detalhe causa muita confusão quando alguém copia uma regex de um lugar pro outro.

No VS Code, aperte `Ctrl + F` e clique no ícone `.*` (ou `Alt + R`) pra buscar e substituir com regex.

E um conselho de método: **não escreva o padrão inteiro de uma vez.** Comece com o pedaço mais simples, teste, e vá acrescentando. Uma validação simples de e-mail, montada aos poucos, fica assim:

```regex
^[\w.+-]+@[\w-]+\.[\w.-]+$
```

Lendo como frase: "do começo, letras, pontos, mais ou hífens; um arroba; um nome; um ponto; o resto; e fim". Ela é boa pra aprender, mas e-mail de verdade tem regras tão complicadas que, na prática, o melhor é validar o básico e mandar um e-mail de confirmação.

Uma curiosidade pra fechar: a teoria por trás das expressões regulares vem do matemático Stephen Kleene, nos anos 1950. Ken Thompson levou a ideia pras ferramentas do Unix, e o `grep` do terminal ganhou esse nome por causa de um comando de editor: `g/re/p`, *global / regular expression / print*.

## O essencial

1. Quatro peças: classes (`\d`, `[a-z]`, `.`), quantificadores (`+`, `*`, `?`, `{n}`), âncoras (`^`, `$`) e grupos (`( )`).
2. Pra validar, sempre `^` no começo e `$` no fim.
3. O `.` é qualquer caractere; pra um ponto de verdade, `\.`.
4. `.*` é guloso; `.*?` para no primeiro.
5. Grupos viram `$1`, `$2`... na substituição.

## Agora é com você

No regex101, escreva um padrão pra cada item: um telefone no formato `(48) 99999-9999`, uma placa de carro antiga `ABC-1234`, uma hora `HH:MM` de 00:00 a 23:59, todas as palavras que começam com maiúscula, e uma URL que começa com `http://` ou `https://`.

Depois, um projeto que conversa com o seu próprio vault: o **caçador de perguntas**. É exatamente o que o plugin Estudos RPG faz por baixo dos panos, e agora você faz a sua versão. Escreva um script (PowerShell com `Select-String`, ou Node) que lê todos os `.md` do vault, usa uma regex pra extrair o título de cada `> [!question]- ...`, e lista quantas perguntas cada nota tem, da maior pra menor. A parte difícil vem depois: outra regex que acha sobras de template, como `[NOME DO TÓPICO]`, **sem** pegar `[[wikilinks]]` nem `[links](url)`. Você terminou quando o total de perguntas que o seu script conta bater com o que a Ficha do herói mostra. Se quiser ir além, capture também a resposta (as linhas `> ` logo abaixo) com grupos, e compare a sua regex com a do plugin em `.sistema/estudos-rpg/src/domain/parse.ts`: o que a dele trata que a sua não trata?

O próximo passo é o [[Bash]], onde `grep` e regex andam sempre juntos.

---

## 🧠 Me teste

> [!question]- Qual a diferença entre `.*` e `.*?`?
> `.*` é **guloso**: casa o máximo possível. `.*?` é **preguiçoso**: casa o mínimo. Em `<b>um</b> e <b>dois</b>`, `<b>.*</b>` pega tudo de uma vez; `<b>.*?</b>` pega cada trecho.

> [!question]- Por que `^\d{5}-\d{3}$` precisa do `^` e do `$`?
> Sem as âncoras, o padrão casaria um CEP no meio de qualquer texto (`abc88000-000xyz`). Com elas, a string **inteira** precisa ser o CEP.

> [!question]- Como casar um ponto literal, tipo em `site.com`?
> Escapando: `\.`. O `.` sozinho casa *qualquer* caractere.

> [!question]- O que `(?:abc)` faz de diferente de `(abc)`?
> Agrupa **sem capturar**: serve pra aplicar quantificador ou `|`, mas não vira `$1` na substituição.

> [!question]- Escreva um padrão para hora `HH:MM` de 00:00 a 23:59.
> `^([01]\d|2[0-3]):[0-5]\d$`

> [!question]- `\d`
> qualquer dígito (0-9)

> [!question]- `\w`
> letra, número ou `_`

> [!question]- `\s`
> espaço em branco (espaço, tab, quebra de linha)

> [!question]- `+` vs `*`
> `+` = um ou mais · `*` = zero ou mais

> [!question]- `[^0-9]`
> qualquer caractere que **não** seja dígito

> [!question]- `\b`
> limite de palavra

> [!question]- Flag `i`
> ignora maiúsculas/minúsculas

> [!question]+ No texto `<b>um</b> e <b>dois</b>`, o que `<b>.*</b>` casa?
> - a) `<b>um</b>`
> - b) `<b>um</b> e <b>dois</b>` inteiro
> - c) `um` e `dois` separados
> - d) Nada, porque `.` não casa `<`
>
> > [!check]- Resposta
> > **b)** `.*` é **guloso**: pega o máximo possível e vai até o último `</b>`. Pra parar no primeiro, use o preguiçoso `.*?`.

> [!question]+ Qual padrão casa **só** a string `site.com`, e não `siteXcom`?
> - a) `site.com`
> - b) `site\.com`
> - c) `site[.]*com`
> - d) `site?com`
>
> > [!check]- Resposta
> > **b)** O `.` sozinho casa qualquer caractere, então `site.com` também casa `siteXcom`. Escapado (`\.`) vira ponto literal.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `.` | Qualquer caractere |
| `\d` / `\w` / `\s` | Dígito / letra-número-_ / espaço |
| `[a-z]` / `[^0-9]` | Um caractere da lista / fora da lista |
| `^` / `$` / `\b` | Início / fim / borda de palavra |
| `*` `+` `?` | Zero ou mais / um ou mais / opcional |
| `{n}` / `{n,m}` | Exatamente n / de n a m |
| `( )` / `(?: )` | Grupo que captura / que não captura |
| `\|` | Ou |
| `.*?` | Versão preguiçosa |

**Pra ler:** o [RegexOne](https://regexone.com) ensina com lições interativas curtas, ótimo pra fixar as quatro peças. O [guia de expressões regulares do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions) é a referência pro JavaScript. E se um dia você quiser ir fundo, *Mastering Regular Expressions*, de Jeffrey Friedl, é o livro definitivo.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

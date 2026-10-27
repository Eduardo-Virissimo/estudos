# 📚 Regex

> *"Descreva o padrão uma vez e encontre-o em qualquer lugar."*

---

## O que é Regex?

**Regex** (*regular expression*, ou expressão regular) é uma sequência de caracteres que descreve um **padrão de texto**. Em vez de procurar uma palavra exata, você procura "qualquer coisa que se pareça com isto": um e-mail, um CPF, um número de telefone, uma data.

É usada em buscas, validação de formulários, substituições em massa, análise de logs e extração de dados.

### Uma História Breve 📜

A base teórica vem do matemático **Stephen Kleene**, que nos anos 1950 formalizou as "linguagens regulares". Nos anos 1960-70, **Ken Thompson** levou a ideia para ferramentas Unix como editores de texto e o `grep` (nome vem de `g/re/p`: *global / regular expression / print*). Hoje quase toda linguagem de programação tem suporte a regex, com pequenas variações de sintaxe entre elas.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Busca poderosa**: acha padrões que a busca simples não consegue.
- 📦 **Validação**: confere formato de e-mails, telefones, senhas, etc.
- 🔧 **Substituição em massa**: renomeia e reformata texto em segundos (no [[VS Code]], por exemplo).
- 🤖 **Processamento de logs e dados**: extrai pedaços relevantes de grandes volumes de texto.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Literais e metacaracteres

Letras e números casam com eles mesmos. Alguns símbolos têm significado especial:

```text
.    qualquer caractere (exceto quebra de linha)
^    início da linha
$    fim da linha
\    escapa um metacaractere (\. casa com ponto literal)
```

### Conceito 2: Classes de caracteres

```text
[abc]    a, b ou c
[a-z]    qualquer letra minúscula
[^0-9]   qualquer coisa que NÃO seja dígito
\d       dígito         \D  não-dígito
\w       letra/número/_ \W  oposto
\s       espaço/tab/quebra de linha
```

### Conceito 3: Quantificadores

```text
*      zero ou mais
+      um ou mais
?      zero ou um (opcional)
{3}    exatamente 3
{2,5}  de 2 a 5
```

### Conceito 4: Grupos e alternância

```text
(abc)     agrupa e captura
(?:abc)   agrupa sem capturar
a|b       a OU b
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

Casar um CEP brasileiro no formato `88000-000`:

```regex
^\d{5}-\d{3}$
```

Em JavaScript:

```javascript
const cep = /^\d{5}-\d{3}$/;
console.log(cep.test("88000-000")); // true
console.log(cep.test("8800-0000")); // false
```

### Exemplo 2: Caso de Uso Real

Extrair e reorganizar datas de `2026-10-27` para `27/10/2026` usando grupos:

```javascript
const texto = "Entrega em 2026-10-27";
const resultado = texto.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
console.log(resultado); // "Entrega em 27/10/2026"
```

Uma validação simples de e-mail (didática, não cobre todos os casos possíveis):

```regex
^[\w.+-]+@[\w-]+\.[\w.-]+$
```

---

## Configurações Recomendadas ⚙️

**Flags** comuns (variam por linguagem):

```text
i   ignora maiúsculas/minúsculas
g   global (todas as ocorrências)
m   multilinha (^ e $ valem por linha)
```

No VS Code, ative a busca com regex em `Ctrl + F` e clique no ícone `.*` (ou `Alt + R`).

---

## Dicas de Ouro 💎

### 1. Teste em tempo real

Use o [regex101.com](https://regex101.com), que explica cada parte do padrão e mostra os grupos capturados.

### 2. Comece simples e vá refinando

Construa o padrão aos poucos, testando a cada pedaço, em vez de escrever tudo de uma vez.

### 3. Cuidado com o "guloso" (greedy)

`.*` tenta casar o máximo possível. Para casar o mínimo, use `.*?` (preguiçoso).

```text
Texto: <b>um</b> e <b>dois</b>
<b>.*</b>    casa tudo de uma vez
<b>.*?</b>   casa cada trecho separadamente
```

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `.` | Qualquer caractere |
| `\d` / `\w` / `\s` | Dígito / palavra / espaço |
| `[a-z]` | Classe de caracteres |
| `^` / `$` | Início / fim |
| `*` `+` `?` | Quantificadores |
| `{n,m}` | Quantidade exata ou faixa |
| `( )` | Grupo de captura |
| `\|` | Alternância (ou) |
| `\b` | Limite de palavra |

---

## Exercício Prático 🎯

**Objetivo:** Escrever padrões para casos reais e testá-los.

```text
Crie uma expressão regular para cada item e teste no regex101.com:

1. Um telefone no formato (48) 99999-9999
2. Uma placa de carro no formato antigo: ABC-1234
3. Uma hora no formato HH:MM (00:00 a 23:59)
4. Todas as palavras que começam com maiúscula
5. Uma URL que começa com http:// ou https://
```

---

## Próximos Passos ✅

- [ ] Resolver os exercícios acima no regex101
- [ ] Praticar com [RegexOne](https://regexone.com) (tutorial interativo)
- [ ] Aprender lookahead e lookbehind
- [ ] Usar regex em buscas e substituições no seu editor

---

## Recursos Recomendados 📚

### 📖 Livros:
- *Mastering Regular Expressions* (Jeffrey Friedl) - Referência aprofundada sobre o tema

### 💻 Sites e Documentação:
- [regex101](https://regex101.com) - Testador com explicação detalhada
- [RegexOne](https://regexone.com) - Lições interativas
- [MDN: Expressões regulares](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions) - Guia para JavaScript

---

## Problemas Comuns e Soluções 🔧

### Problema: O padrão casa mais do que deveria

**Solução:**
1. Verifique se `.*` está "guloso" demais e troque por `.*?`.
2. Use âncoras `^` e `$` para exigir correspondência completa.

### Problema: Um caractere especial não é encontrado

**Solução:**
1. Escape com barra invertida: `\.`, `\(`, `\$`.
2. Lembre que em strings de algumas linguagens a barra precisa ser dobrada (`"\\d"`).

---

## Conclusão 🎉

Regex parece enigmático no começo, mas é um dos recursos mais reutilizáveis que existem: funciona em editores, terminais e praticamente toda linguagem. Aprenda os blocos básicos, teste muito e consulte a referência quando precisar.

Com prática, padrões que pareciam ilegíveis passam a ser leitura natural.

---

*Este material segue o padrão da pasta Ferramentas para manter consistência entre todos os tópicos do vault de estudos.* 🎯

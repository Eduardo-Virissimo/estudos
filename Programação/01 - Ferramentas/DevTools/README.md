# 📚 DevTools

> *"O navegador é também o seu laboratório."*

---

## O que são as DevTools?

As **DevTools** (*Developer Tools*, ferramentas do desenvolvedor) são um conjunto de ferramentas **embutidas no navegador** para inspecionar, depurar e analisar páginas web. Com elas você vê o HTML e o CSS em tempo real, executa JavaScript no console, acompanha requisições de rede, mede performance e muito mais.

Estão disponíveis no Chrome, Edge, Firefox, Safari e outros, com pequenas diferenças de nomes e recursos.

### Uma História Breve 📜

Antes das DevTools modernas, o **Firebug** (extensão do Firefox, meados dos anos 2000) popularizou a inspeção de páginas. Depois, navegadores passaram a trazer ferramentas nativas: o Chrome, por exemplo, incorporou as suas desde as primeiras versões, e elas evoluíram muito até hoje.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Depuração rápida**: encontre erros de layout e JavaScript direto na página.
- 📦 **Visibilidade da rede**: veja cada requisição, resposta, tempo e erro.
- 🔧 **Experimentação ao vivo**: altere CSS e HTML sem mexer no código-fonte.
- 🤖 **Análise de performance e acessibilidade**: identifique gargalos e melhorias.

---

## Conceitos Fundamentais 🎯

### Como abrir

```text
F12
Ctrl + Shift + I   (Windows/Linux)
Cmd + Option + I   (macOS)
Botão direito na página → Inspecionar
```

### Conceito 1: Elements (Elementos)

Mostra a árvore do **DOM** e os estilos CSS aplicados. Você pode editar texto, atributos e regras de estilo e ver o resultado na hora.

### Conceito 2: Console

Exibe mensagens (`console.log`, erros e avisos) e permite executar JavaScript na página.

```javascript
console.log("Olá das DevTools");
document.querySelectorAll("a").length;
```

### Conceito 3: Sources (Fontes)

Permite ver os arquivos carregados, colocar **breakpoints** e depurar passo a passo.

### Conceito 4: Network (Rede)

Lista todas as requisições da página, com método, status, tamanho, tempo e conteúdo da resposta.

### Conceito 5: Application

Mostra armazenamento do navegador: `localStorage`, `sessionStorage`, cookies, service workers e cache.

### Conceito 6: Performance e Lighthouse

Analisam desempenho de carregamento e execução, e geram relatórios de performance, acessibilidade e boas práticas.

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

Testar uma mudança de estilo sem editar o código:

```text
1. Abra qualquer site e pressione F12
2. Na aba Elements, clique no ícone de seleção (seta) e escolha um elemento
3. No painel Styles, altere uma cor ou tamanho
4. Veja a mudança instantânea (recarregar a página desfaz)
```

### Exemplo 2: Caso de Uso Real

Descobrir por que uma chamada de API falha:

```text
1. Abra a aba Network e recarregue a página
2. Use o filtro Fetch/XHR para ver só as chamadas de API
3. Clique na requisição com erro (status 4xx/5xx em vermelho)
4. Veja Headers, Payload e Response para entender o problema
5. Se preciso, clique com o botão direito → Copy → Copy as cURL
```

---

## Configurações Recomendadas ⚙️

Atalhos e ajustes úteis (no ícone de engrenagem das DevTools → Settings):

```json
{
    "Tema": "Dark ou conforme o sistema",
    "Disable cache (while DevTools is open)": true,
    "Preserve log": true,
    "Device Toolbar": "Ctrl + Shift + M para simular celulares"
}
```

> Os nomes exatos das opções podem mudar entre versões do navegador.

---

## Dicas de Ouro 💎

### 1. Use o modo responsivo

`Ctrl + Shift + M` (Device Toolbar) simula telas de celular e tablet para testar layout.

### 2. Marque "Disable cache" na aba Network

Evita que arquivos antigos em cache atrapalhem seus testes enquanto desenvolve.

### 3. Conheça `$0`, `$_` e `copy()` no console

`$0` é o último elemento selecionado em Elements. `copy(objeto)` copia dados para a área de transferência.

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `F12` | Abre/fecha as DevTools |
| `Ctrl + Shift + C` | Seleciona elemento na página |
| `console.log()` | Imprime no console |
| `console.table()` | Mostra dados em formato de tabela |
| `debugger;` | Pausa a execução no código |
| `$0` | Referência ao elemento selecionado |
| `Ctrl + Shift + M` | Alterna modo dispositivo |

---

## Exercício Prático 🎯

**Objetivo:** Praticar inspeção, console e rede em um site real.

```text
1. Abra um site e inspecione o título principal (Elements)
2. Mude o texto e a cor dele pelas DevTools
3. No Console, conte quantos links existem:
   document.querySelectorAll("a").length
4. Na aba Network, descubra qual arquivo carregado é o maior
5. Rode o Lighthouse e anote uma sugestão de melhoria
```

---

## Próximos Passos ✅

- [ ] Explorar cada aba das DevTools do seu navegador principal
- [ ] Aprender a usar breakpoints na aba Sources
- [ ] Rodar o Lighthouse em um projeto seu
- [ ] Ler a documentação oficial do Chrome DevTools

---

## Recursos Recomendados 📚

### 💻 Sites e Documentação:
- [Chrome DevTools](https://developer.chrome.com/docs/devtools) - Documentação oficial do Chrome
- [Firefox Developer Tools](https://firefox-source-docs.mozilla.org/devtools-user/) - Documentação do Firefox
- [MDN Web Docs](https://developer.mozilla.org/pt-BR/) - Referência geral de desenvolvimento web

---

## Problemas Comuns e Soluções 🔧

### Problema: Minha alteração no CSS sumiu ao recarregar

**Solução:**
1. As edições nas DevTools são temporárias.
2. Copie as mudanças para o seu código-fonte antes de recarregar.

### Problema: A página continua mostrando a versão antiga

**Solução:**
1. Ative "Disable cache" na aba Network (com as DevTools abertas).
2. Faça um recarregamento forçado: `Ctrl + Shift + R`.

---

## Conclusão 🎉

As DevTools são uma das ferramentas mais valiosas do desenvolvimento web: elas encurtam o ciclo entre ter uma dúvida e ver a resposta. Dominar Elements, Console e Network já resolve a maioria dos problemas do dia a dia.

Abra-as com frequência, mesmo em sites de terceiros, para aprender como as coisas funcionam por dentro.

---



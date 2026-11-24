---
nivel: escrito
foco: essencial
revisado:
---

# DevTools

**Quanto focar: 🔥 essencial.** É a ferramenta número um pra depurar qualquer coisa na web: console, rede, elementos. Quem trabalha com front usa todo dia.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você clica no botão "Salvar" de um site e nada acontece. Nenhuma mensagem, nenhum erro, a página só fica ali parada. De fora, não dá pra saber se o botão está quebrado, se o servidor caiu ou se os dados foram salvos e a tela é que não atualizou.

Só que todo navegador traz, escondida, uma caixa de ferramentas pra olhar a página **por dentro**. São as **DevTools**, e elas abrem com `F12` (ou `Ctrl + Shift + I`, ou botão direito em qualquer coisa → **Inspecionar**). Com elas você vê o HTML e o CSS de cada pedaço da tela, as mensagens e os erros do JavaScript, cada conversa que a página tem com o servidor, e o que o site guardou no seu navegador.

A primeira vez assusta, porque são dezenas de abas e botões. A boa notícia é que **três abas resolvem quase tudo**: Elements, Console e Network. O resto você aprende quando precisar.

## Elements: mexer na página sem tocar no código

A aba **Elements** mostra a página como o navegador a enxerga: uma árvore de elementos HTML (o **DOM**), e, do lado, o CSS que está sendo aplicado em cada um.

Clique no ícone da setinha no canto superior esquerdo das DevTools (ou `Ctrl + Shift + C`) e depois em qualquer coisa da página, um título, por exemplo. A árvore pula direto pro elemento, e o painel **Styles** mostra cada regra de CSS que ele recebe. Agora mude a cor ali, ou o tamanho da fonte. A página muda na hora.

É o jeito mais rápido de testar uma ideia de visual. Em vez de editar o arquivo, salvar e recarregar dez vezes, você ajusta ao vivo até ficar bom.

O painel Styles também responde uma pergunta que todo mundo faz um dia: "por que meu CSS não está funcionando?". Se a sua regra aparece **riscada**, é porque outra regra, mais específica ou declarada depois, ganhou dela. Você vê exatamente qual.

Só tem um detalhe que pega todo mundo na primeira vez: você passa vinte minutos acertando o visual, recarrega a página pra conferir e... tudo sumiu. **O que você muda nas DevTools é temporário.** Vale naquela aba até recarregar. Antes de recarregar, copie as mudanças pro seu código.

E já que estamos aqui, `Ctrl + Shift + M` liga o **modo responsivo**, que simula a tela de um celular ou tablet. É assim que se testa um site no celular sem sair do computador.

## Console: onde o JavaScript fala com você

Voltando ao botão "Salvar" que não fazia nada. O primeiro lugar pra olhar é o **Console**.

Ele mostra tudo o que o JavaScript da página escreveu: os `console.log` que os desenvolvedores deixaram, os avisos em amarelo e, principalmente, os **erros em vermelho**. Quando uma página "não faz nada", quase sempre tem um erro aqui explicando o porquê, com o arquivo e a linha onde ele aconteceu. A nota [[Ler Mensagens de Erro]] ensina a ler esse tipo de mensagem.

O Console também funciona ao contrário: você pode **digitar JavaScript** e ele roda dentro da página, na hora.

```javascript
document.querySelectorAll("a").length   // quantos links tem nesta página?
document.title = "Mudei o título"       // e funciona
```

Dois atalhos deixam isso muito mais útil. O `$0` é o último elemento que você selecionou na aba Elements: selecione um botão e digite `$0.textContent` pra ver o texto dele. E o `copy(qualquerCoisa)` copia um valor pra sua área de transferência, ótimo pra tirar dados de uma página.

## Network: cada conversa com o servidor

Agora imagine o outro cenário: o Console está limpo, sem nenhum erro, mas a lista de produtos que deveria aparecer está vazia. O JavaScript rodou direitinho. Então o problema provavelmente está nos **dados**, e quem mostra os dados é a aba **Network**.

Ela lista **toda requisição** que a página faz: o HTML, as imagens, os scripts e, o que mais importa, as chamadas de API, que é onde a página pede os dados pro servidor. Pra investigar:

1. Abra a Network e recarregue a página (ela só grava o que acontece com ela aberta).
2. Clique no filtro **Fetch/XHR**, que esconde imagens e scripts e deixa só as chamadas de API.
3. Procure a requisição suspeita. Ela está em vermelho? Nem aparece na lista?
4. Clique nela. Em **Headers** você vê o que foi pedido, em **Payload** os dados que foram enviados, e em **Response** o que o servidor respondeu.

O número do **status** já diz muito. Se começa com 4 (404, 401...), o erro foi de quem pediu: rota errada, falta de login, dados inválidos. Se começa com 5, o servidor quebrou. E se a requisição nem aparece, o JavaScript nunca chegou a pedir. A nota do [[Postman]] explica esses códigos com calma.

Esta é a parte das DevTools que vale mais a pena dominar, porque é o raciocínio que você vai usar o resto da vida: **erro no Console é problema no código; Console limpo com tela errada é hora de olhar os dados na Network.**

Antes de sair da Network, ligue duas opções que estão no topo dela. A **Disable cache** impede o navegador de usar arquivos antigos guardados. Sem ela, você muda o código, recarrega, e o navegador mostra a versão de ontem, e você fica achando que sua mudança não funcionou (ela só vale com as DevTools abertas; pra forçar uma vez, `Ctrl + Shift + R`). A **Preserve log** mantém a lista quando a página muda de endereço, pra você não perder a requisição que aconteceu bem no momento do clique.

E um truque que você vai usar muito: botão direito numa requisição → **Copy → Copy as cURL** copia ela como um comando de terminal, que você pode repetir, ajustar ou mandar pra alguém.

## Quando o console.log não basta

Às vezes você quer ver o código acontecendo, passo a passo. Pra isso existe a aba **Sources**, que mostra os arquivos de JavaScript da página. Clique no número de uma linha e ela ganha um **breakpoint**: quando o código passar por ali, ele **pausa**, e você vê o valor de cada variável naquele instante. Daí avança uma linha por vez. Na primeira vez que você usar, vai se perguntar por que passou tanto tempo espalhando `console.log` pelo código. Uma linha `debugger;` no seu próprio código faz a mesma coisa.

A aba **Application** é o lado oposto: mostra o que o site **guardou** no seu navegador. `localStorage`, `sessionStorage` e **cookies** ficam ali. É onde você confere se o login foi salvo, ou apaga tudo pra testar o site como um visitante novo.

Duas abas pra só saber que existem: **Performance** grava o que a página fez durante alguns segundos, pra descobrir o que está lento, e **Lighthouse** gera um relatório com nota de desempenho, acessibilidade e boas práticas, com sugestões do que melhorar.

Uma curiosidade: quem popularizou a ideia de inspecionar páginas foi a extensão **Firebug**, do Firefox, em meados dos anos 2000. Ela fez tanto sucesso que todo navegador passou a trazer ferramentas próprias, que viraram as DevTools de hoje.

## O essencial

1. `F12` abre. Elements, Console e Network resolvem quase tudo.
2. Tudo o que você muda nas DevTools some ao recarregar. Copie pro código antes.
3. Erro em vermelho no Console é problema no JavaScript.
4. Console limpo e tela errada: abra a Network, filtre por Fetch/XHR, veja o status e a Response.
5. Ligue "Disable cache" quando estiver desenvolvendo.

## Agora é com você

Abra um site qualquer e faça uma visita guiada: inspecione o título principal e mude o texto e a cor dele; no Console, descubra quantos links a página tem; na Network, ache o maior arquivo carregado; e rode o Lighthouse pra anotar uma sugestão de melhoria.

Depois, um passeio mais divertido: **abrir o capô do próprio Obsidian.** Ele é feito com Electron, que é um Chrome por dentro, então `Ctrl + Shift + I` abre as DevTools nele também. Em Elements, ache o painel da Ficha do herói (classe `erpg-host`) e mude uma cor da paleta ao vivo, como `--ouro`. No Console, rode `app.vault.getMarkdownFiles().length` e explore `app.plugins.plugins["estudos-rpg"]`. Em Sources, abra o `main.js` do plugin e ponha um breakpoint no código que roda ao clicar em "Lembrei". Você terminou quando conseguir explicar qual função roda nesse clique, porque viu ela parar no breakpoint. Se quiser ir além, grave a abertura da Ficha na aba Performance, ou leve uma mudança de CSS que você gostou pro `styles.css` em `.sistema/estudos-rpg/`.

Daqui, os próximos passos são [[HTTP]], pra entender de verdade o que a Network mostra, e [[Debugging]].

---

## 🧠 Me teste

> [!question]- Os dados da API não aparecem na tela. Qual aba você abre primeiro e o que olha?
> **Network**: a requisição saiu? Qual o status (200, 404, 500)? O que veio no *Response*? Depois o **Console**, pra ver erros de JS.

> [!question]- Por que a alteração de CSS feita nas DevTools sumiu ao recarregar?
> Edições nas DevTools são **temporárias**. Copie a mudança pro arquivo (ou use *Local Overrides*).

> [!question]- Pra que serve marcar "Disable cache"?
> Desliga o cache enquanto as DevTools estão abertas, pra não ver a versão antiga dos arquivos.

> [!question]- Uma regra de CSS aparece riscada no painel Styles. O que isso quer dizer?
> Que outra regra, mais específica ou declarada depois, sobrescreveu ela.

> [!question]- O que é `$0` no Console?
> O elemento selecionado por último na aba Elements.

> [!question]- Onde ver localStorage e cookies?
> Na aba **Application**.

> [!question]- Abrir DevTools
> `F12` ou `Ctrl + Shift + I`

> [!question]- Selecionar elemento na página
> `Ctrl + Shift + C`

> [!question]- Aba pra breakpoints em JS
> Sources

> [!question]- Aba pra ver requisições HTTP
> Network

> [!question]- Lighthouse
> auditoria de performance, acessibilidade e SEO

> [!question]- Modo responsivo
> `Ctrl + Shift + M`: simula telas de celular

> [!question]+ A lista de produtos não aparece na tela e o Console está limpo. Qual o primeiro lugar pra olhar?
> - a) Aba Elements, procurando a `<div>` da lista
> - b) Aba Network: a requisição da API, o status e a resposta
> - c) Lighthouse, pra ver a performance
> - d) Aba Application, apagando o localStorage
>
> > [!check]- Resposta
> > **b)** Se não tem erro de JS, a suspeita é o dado: a requisição falhou (4xx/5xx), nem foi feita ou voltou vazia. A Network mostra isso. Elements mostraria só que a lista está vazia, sem dizer por quê.

---

## Pra consultar depois

| Atalho / comando | O que faz |
|---|---|
| `F12` | Abre e fecha as DevTools |
| `Ctrl + Shift + C` | Seleciona um elemento na página |
| `Ctrl + Shift + M` | Modo responsivo (celular, tablet) |
| `Ctrl + Shift + R` | Recarrega ignorando o cache |
| `console.log()` / `console.table()` | Imprime no Console / em forma de tabela |
| `debugger;` | Pausa o código naquela linha |
| `$0` | O elemento selecionado em Elements |
| `copy(valor)` | Copia um valor pra área de transferência |

**Pra ler:** a [documentação do Chrome DevTools](https://developer.chrome.com/docs/devtools) é ótima e cheia de exemplos, vale abrir a parte de Network. Se você usa Firefox, a [documentação dele](https://firefox-source-docs.mozilla.org/devtools-user/) cobre o mesmo. E o [MDN](https://developer.mozilla.org/pt-BR/) é a referência pra qualquer dúvida de HTML, CSS ou JavaScript que aparecer no caminho.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

**Checklist de progresso:**
- [x] Explorar cada aba das DevTools do seu navegador principal
- [x] Aprender a usar breakpoints na aba Sources
- [x] Rodar o Lighthouse em um projeto seu
- [x] Ler a documentação oficial do Chrome DevTools

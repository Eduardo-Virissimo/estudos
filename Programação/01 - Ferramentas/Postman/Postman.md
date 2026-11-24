---
nivel: escrito
foco: importante
revisado:
---

# Postman

**Quanto focar: 📌 importante.** Você vai testar API o tempo todo no back-end. Saiba montar requisição, headers e body; o resto da ferramenta é bônus.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você está construindo o back-end de um app e acabou de escrever a rota que cadastra usuários. Como saber se ela funciona? A tela de cadastro ainda não existe. Dá pra escrever um código só pra chamar a rota, ou instalar o front-end inteiro e clicar nos botões... ou dá pra **conversar direto com o servidor**, sem tela nenhuma.

É isso que o **Postman** faz. Você monta o pedido (o que quer, pra onde, com quais dados), clica em **Send**, e vê exatamente o que o servidor respondeu. Ele serve pra testar a API que você está construindo, e também pra explorar APIs dos outros antes de usar no seu código.

Pra usar bem, você precisa de duas coisas que não são do Postman, são da web: entender as **partes de uma requisição HTTP** e ler os **códigos de status**. Isso vale pra qualquer ferramenta, inclusive o [[Insomnia]], e é o que mais importa nesta nota. Depois vêm as duas ideias do próprio Postman que organizam o trabalho: **coleções** e **ambientes**. Se quiser a base teórica antes, veja [[HTTP]].

## Uma requisição é uma carta

Toda conversa com uma API é um **pedido** (a requisição) e uma **resposta**. Por baixo dos panos, o pedido é só um texto assim:

```http
POST /usuarios HTTP/1.1
Host: api.exemplo.com
Content-Type: application/json

{"nome": "Ana", "email": "ana@exemplo.com"}
```

Ele tem quatro partes, e uma analogia ajuda a não esquecer: pense numa carta pra uma empresa.

O **método** é o tipo do pedido, como "quero comprar" ou "quero cancelar". `GET` busca algo, `POST` cria, `PUT` e `PATCH` atualizam, `DELETE` apaga. A **URL** é o endereço do departamento: `/usuarios` pra lista, `/usuarios/42` pra um usuário específico. Os **headers** (cabeçalhos) são o envelope: dizem quem está mandando (`Authorization`) e em que formato está o conteúdo (`Content-Type`). E o **body** (corpo) é o texto da carta, os dados em si. Num `POST` que cria um usuário, vão o nome e o e-mail. Um `GET` normalmente não tem corpo, porque você só está pedindo pra ver.

Faça a primeira agora, numa API pública de treino: crie uma requisição, escolha `GET`, cole `https://jsonplaceholder.typicode.com/posts/1` e clique em **Send**. Aparece o número **200** e um JSON com um post. Você acabou de conversar com um servidor.

## O primeiro dígito conta a história

Repare naquele 200. Toda resposta vem com um número de três dígitos, o **status**, que diz como foi. Você não precisa decorar dezenas deles, porque **o primeiro dígito já conta a história**:

| Faixa | Quer dizer | Exemplos |
|---|---|---|
| **2xx** | deu certo | `200 OK`, `201 Created` |
| **3xx** | vá pra outro lugar (redirecionamento) | `301`, `304` |
| **4xx** | **você** pediu errado | `400` dados inválidos, `401` não autenticado, `403` sem permissão, `404` não existe |
| **5xx** | o **servidor** falhou | `500` erro interno, `503` fora do ar |

Se for guardar uma coisa só desta seção, guarde a diferença entre 4 e 5. Com **4xx**, o problema está no seu pedido: a rota, o token, os dados. É você quem conserta. Com **5xx**, o servidor quebrou, e o problema está do lado dele. Essa distinção economiza muito tempo de investigação.

O 4xx que mais aparece no dia a dia é o **401 Unauthorized**: o servidor não sabe quem você é. Quando ele aparecer, confira se o token está na aba **Authorization** (ou no header certo), se a variável do token foi mesmo preenchida, e se ele não expirou. E não confunda com o **403**: no 403, o servidor sabe muito bem quem você é, mas você não tem permissão pra fazer aquilo.

E se nem chegar resposta nenhuma, só um erro de conexão? Aí o problema vem antes do HTTP: o servidor não está rodando, a porta está errada, ou você usou `https://` num servidor local que só fala `http://localhost:PORTA`.

## Coleções e ambientes: organizar o trabalho

Depois de algumas requisições, a bagunça começa. As **coleções** resolvem isso: são pastas que agrupam as requisições de uma API ("Usuários", "Pedidos"). E elas podem ser exportadas e compartilhadas, então uma coleção bem feita vira uma documentação viva de como usar a API.

O segundo problema é mais sutil. A mesma API roda no seu computador (`http://localhost:3000`) e em produção (`https://api.meusite.com`). Se o endereço estiver escrito em cada requisição, você vai, cedo ou tarde, testar uma coisa em produção achando que estava no local. Os **ambientes** evitam isso: guardam as variáveis que mudam, e você usa nas requisições com chaves duplas.

```text
{{base_url}}/usuarios
Authorization: Bearer {{token}}
```

Você cria um ambiente "Dev" com `base_url = http://localhost:3000`, e outro "Prod" com o endereço de produção. Trocar de um pro outro é um clique no seletor, e todas as requisições mudam juntas.

Um cuidado importante ao compartilhar: **não salve tokens reais em coleções que outras pessoas vão ver**, principalmente de produção. Deixe o valor da variável vazio, e cada pessoa preenche no próprio ambiente.

## Testes e o token que se preenche sozinho

Cada requisição tem uma aba **Tests** (ou **Scripts**, nas versões mais novas) onde você escreve pequenos testes em JavaScript, que rodam depois que a resposta chega:

```javascript
pm.test("Status é 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Resposta contém id", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
});
```

Com alguns testes assim e o **Collection Runner**, que roda a coleção inteira de uma vez, você ganha uma pequena bateria de testes da sua API. Mudou o código? Roda tudo e vê se continua verde.

Os scripts têm um uso ainda mais prático no dia a dia. Toda API com login devolve um token, e todas as outras requisições precisam dele. Em vez de copiar e colar o token a cada login, coloque isto na aba de testes da requisição de login:

```javascript
const json = pm.response.json();
pm.environment.set("token", json.token);
```

Agora você faz login uma vez, e o `{{token}}` de todas as outras requisições fica preenchido sozinho.

Falando em login: a aba **Authorization** de cada requisição (ou da coleção inteira, pra todas herdarem) já sabe montar os tipos de autenticação mais comuns. O que você vai usar quase sempre é o **Bearer Token**, mas também tem Basic Auth, API Key e OAuth 2.0.

Uma curiosidade: o Postman nasceu em 2012 como uma extensão do Chrome, criada por Abhinav Asthana pra facilitar o próprio trabalho testando APIs. Cresceu até virar um programa e uma plataforma enorme. Se um dia ele parecer pesado demais, o [[Insomnia]] tem a mesma ideia numa interface mais leve.

## O essencial

1. Uma requisição tem método, URL, headers e body.
2. Status: 2xx deu certo, 4xx você pediu errado, 5xx o servidor falhou.
3. 401 é "não sei quem você é" (confira o token); 403 é "sei, mas você não pode".
4. Coleções organizam; ambientes guardam o que muda (`{{base_url}}`, `{{token}}`). Nada de token real em coleção compartilhada.

## Agora é com você

Use o JSONPlaceholder pra montar uma coleção "Estudo API" com `GET /posts`, `GET /posts/1` e um `POST /posts` com body JSON. Crie um ambiente com `base_url`, troque todas as URLs por `{{base_url}}`, escreva um teste de status em cada requisição, e rode tudo no Collection Runner.

Depois, troque a API de mentira por uma de verdade, de algo que você curte: a [PokéAPI](https://pokeapi.co), ou a [Jikan](https://jikan.moe) pra animes. APIs reais têm paginação, erro e dados aninhados, e é aí que se aprende. Monte uma coleção com pelo menos 5 requisições em pastas, com ambiente. Faça um **encadeamento**: uma requisição guarda um valor da resposta com `pm.environment.set`, e a próxima usa esse valor. Escreva um teste de status e de um campo do JSON em cada uma. Você terminou quando o Runner passar em tudo e outra pessoa conseguir importar a sua coleção e usar sem te perguntar nada. Se quiser ir além, rode a coleção pelo terminal com o **Newman**, provoque um erro de propósito (um 404, um parâmetro inválido) e escreva o teste dele, ou refaça tudo no [[Insomnia]] pra comparar.

Daqui, siga pro [[Insomnia]] ou aprofunde em [[Status Codes]].

---

## 🧠 Me teste

> [!question]- Quais partes formam uma requisição HTTP?
> Método (GET, POST...), URL (com query params), headers e body.

> [!question]- Qual a diferença entre coleção e ambiente?
> **Coleção** agrupa requisições (a API organizada). **Ambiente** guarda variáveis (`base_url`, `token`) que mudam entre dev e produção.

> [!question]- Deu `401 Unauthorized`. O que significa e o que checar?
> Falta autenticação ou ela é inválida. Cheque o header `Authorization`, se o token expirou e se o ambiente certo está ativo.

> [!question]- Qual a diferença entre 401 e 403?
> 401: o servidor não sabe quem você é. 403: sabe, mas você não tem permissão.

> [!question]- Erro de conexão ao chamar uma API local. O que checar?
> O servidor está rodando? Porta certa? `http` vs `https`? `localhost` vs `127.0.0.1`?

> [!question]- Escreva um teste que verifica se o status é 200.
> `pm.test("Status 200", () => pm.response.to.have.status(200));`

> [!question]- Sintaxe de variável no Postman
> `{{nome}}`

> [!question]- GET vs POST
> GET busca dados · POST envia/cria

> [!question]- Status 2xx / 4xx / 5xx
> sucesso / erro do cliente / erro do servidor

> [!question]- Status 404
> recurso não encontrado

> [!question]- Salvar o token via script
> `pm.environment.set("token", valor)`

> [!question]+ A requisição voltou `401 Unauthorized`. Qual a causa mais provável?
> - a) A rota não existe
> - b) O servidor caiu
> - c) O token está ausente, expirado ou no header errado
> - d) O corpo JSON tem um campo a mais
>
> > [!check]- Resposta
> > **c)** 401 é sobre **autenticação**: o servidor não sabe quem você é. Rota inexistente é 404, servidor com problema é 5xx, e corpo inválido costuma ser 400/422.

> [!question]+ Qual faixa de status indica erro **do cliente** (do seu lado da requisição)?
> - a) 2xx
> - b) 3xx
> - c) 4xx
> - d) 5xx
>
> > [!check]- Resposta
> > **c)** 4xx = você mandou algo errado (rota, token, dados). 5xx = o servidor falhou. 2xx = deu certo. 3xx = redirecionamento.

---

## Pra consultar depois

| Recurso | O que faz |
|---|---|
| `{{variavel}}` | Usa uma variável de ambiente ou coleção |
| `pm.test()` / `pm.expect()` | Define um teste / faz uma verificação |
| `pm.response.json()` | Lê o corpo da resposta como JSON |
| `pm.environment.set()` | Salva uma variável de ambiente |
| **Collection Runner** | Roda a coleção inteira |

**Pra ler:** o [Postman Learning Center](https://learning.postman.com) tem tutoriais curtos pra cada recurso; a parte de "Writing tests" vale uma leitura. O [JSONPlaceholder](https://jsonplaceholder.typicode.com) é a API falsa pra treinar à vontade.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

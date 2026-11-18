---
nivel: escrito
revisado:
---

# Insomnia

Se você já passou pela nota do [[Postman]], conhece a ideia: em vez de escrever código só pra ver se uma API responde, você usa um programa onde monta a requisição, aperta **Send** e vê a resposta. O **Insomnia** faz exatamente isso, e a pergunta honesta é: por que aprender um segundo?

Porque cada um tem o seu jeito, e você vai encontrar os dois por aí. O Insomnia aposta numa interface mais enxuta, com menos botões e menos coisa no caminho, e trabalha bem com **REST**, **GraphQL** e outros protocolos. Muita gente prefere ele justamente por isso.

Esta nota não repete o básico (método, URL, headers, body, códigos de status como 401 e 404): isso está no [[Postman]] e vale igual aqui. O que importa no Insomnia são três coisas: os **ambientes**, o **encadeamento** de respostas, e a aba **Timeline**, que é onde você descobre o que deu errado.

Pra se situar, faça a primeira requisição: clique em **New Request**, escolha `GET`, cole `https://jsonplaceholder.typicode.com/posts/1` e clique em **Send**. A resposta aparece do lado, nas abas **Preview**, **Header** e **Timeline**. Conforme a coleção crescer, organize em **pastas**, uma pra cada parte da API.

## Ambientes: a mesma requisição em lugares diferentes

Uma API costuma existir em mais de um lugar: no seu computador enquanto você desenvolve, num servidor de testes, e em produção. As requisições são as mesmas, só muda o endereço (e o token). Escrever a URL inteira em cada requisição significa editar todas elas quando você troca de lugar.

O Insomnia resolve isso com **ambientes**. Um ambiente é um JSON com os valores que mudam:

```json
{
    "base_url": "http://localhost:3000",
    "token": "meu-token-de-teste"
}
```

E nas requisições, você usa as variáveis com esta sintaxe, que tem um detalhe esquisito, o `_.` antes do nome:

```text
{{ _.base_url }}/usuarios
Authorization: Bearer {{ _.token }}
```

Crie um ambiente pra cada lugar (local, testes, produção) e troque no seletor no topo da tela. Todas as requisições mudam de uma vez. Num campo qualquer, digitar `_.` ou apertar `Ctrl + Espaço` mostra as variáveis disponíveis.

Quando uma variável aparece vazia, quase sempre é uma destas duas coisas: o ambiente certo não está selecionado lá no topo, ou o JSON do ambiente tem um erro bobo, como uma vírgula sobrando no último item. Comece olhando por aí.

## Encadeamento: o token que se renova sozinho

Este é o recurso que faz você gostar do Insomnia. O cenário é clássico: você faz login, a API devolve um token, e todas as outras requisições precisam dele. O token expira, você faz login de novo, copia, cola no ambiente... e repete isso vinte vezes por dia.

O Insomnia deixa uma requisição **puxar um valor direto da resposta de outra**, usando as **Response tags**:

1. Crie o `POST {{ _.base_url }}/login`, com o e-mail e a senha no body.
2. Na próxima requisição, vá em **Auth** e escolha **Bearer Token**.
3. No campo do token, em vez de colar um valor, insira a tag **Response → Body Attribute**, apontando pra requisição de login e pro campo `token` da resposta dela.
4. Envie `GET {{ _.base_url }}/perfil`.

Agora o token vem sempre fresco do último login, e você nunca mais copia nada.

## Timeline: o que realmente aconteceu

Quando um erro não faz sentido, a aba **Timeline** é onde você olha. Ela mostra a requisição crua, do jeito que aconteceu: tudo o que foi enviado, cada cabeçalho, os redirecionamentos, a conexão segura (TLS) e a resposta sem nenhum enfeite. Coisas que as outras abas escondem aparecem ali. O caso típico é o servidor redirecionando você pra outro endereço sem você perceber, e a resposta que chega não é a que você esperava.

Um erro comum ao testar uma API rodando no seu computador é o de **certificado SSL**. Em desenvolvimento, prefira simplesmente `http://localhost`. Se precisar mesmo de HTTPS local, configure o certificado, ou desligue a validação nas preferências **só pra testes locais**. Nunca faça isso pra testar uma API real, porque é justamente essa validação que garante que você está falando com o servidor certo.

## GraphQL, e trazer coleções prontas

Um dos pontos fortes do Insomnia é o editor de **GraphQL**. No GraphQL, em vez de várias URLs, a API tem uma só, e você escreve exatamente quais campos quer na resposta:

```graphql
query {
  usuario(id: 1) {
    nome
    email
  }
}
```

O Insomnia lê o schema da API e **autocompleta os campos** enquanto você digita, o que transforma explorar uma API GraphQL desconhecida numa coisa fácil.

E se você já tem uma coleção no Postman, ou a API tem uma especificação **OpenAPI**, dá pra importar: as requisições chegam prontas.

Uma curiosidade: o Insomnia foi criado por Gregory Schier por volta de 2015, como projeto de código aberto, com a proposta de ser mais simples e rápido que as alternativas. Depois foi comprado pela Kong, uma empresa de ferramentas de API.

## O essencial

1. É a mesma ideia do Postman; o que muda é a interface e a sintaxe.
2. Variáveis de ambiente se escrevem `{{ _.nome }}`. Variável vazia: confira o ambiente selecionado e o JSON.
3. Response tags puxam valores (como o token) da resposta de outra requisição.
4. Erro estranho? Olhe a Timeline.

## Agora é com você

Refaça no Insomnia o que você fez no Postman, pra comparar de verdade: crie uma coleção "Estudo API", um ambiente com `base_url = https://jsonplaceholder.typicode.com`, e as requisições `GET /posts`, `GET /posts/1` e `POST /posts`, todas usando `{{ _.base_url }}`. Você terminou quando as três funcionarem sem nenhuma URL escrita à mão e você tiver anotado pelo menos uma diferença real entre as duas ferramentas.

Depois, explore uma **API real e autenticada**: a do GitHub. É um ótimo treino antes de construir a sua no Estágio 4, porque tem tokens, paginação e erros de verdade. Crie uma coleção "GitHub" com um ambiente contendo `base_url = https://api.github.com` e um `token` (gerado em Settings → Developer settings, só com permissão de leitura). Monte as requisições do seu usuário (`GET /user`), dos seus repositórios (`GET /user/repos?per_page=5&page=1`) e das issues de um repositório seu. Provoque erros de propósito, com um token errado (401) e um repositório que não existe (404). Por fim, exporte a coleção **sem o token** e guarde no repositório de um projeto. Você terminou quando a coleção funcionar trocando só o token no ambiente e o arquivo exportado não tiver nenhum segredo dentro (veja [[Gestão de Secrets]]). Se quiser ir além, encadeie o `login` que vem de `/user` na URL da próxima requisição, crie uma issue com `POST` num repositório de teste, e leia o header `x-ratelimit-remaining` pra entender o [[Rate Limiting]].

O próximo passo natural é o [[GraphQL]].

---

## 🧠 Me teste

> [!question]- Pra que servem os ambientes?
> Pra trocar entre dev/produção (URL, token) sem editar requisição por requisição.

> [!question]- Como reaproveitar o token do login numa requisição seguinte?
> Com **encadeamento**: uma *template tag* (Response) que lê um campo da resposta do login, ou salvando o token numa variável de ambiente.

> [!question]- Uma variável aparece vazia. O que checar?
> Se o ambiente certo está **selecionado**, se o nome está escrito igual, se a sintaxe é `{{ _.nome }}` e se o JSON do ambiente não tem erro.

> [!question]- Erro de certificado SSL ao testar um servidor local. O que fazer?
> Usar `http://localhost`, ou desativar a validação de certificado nas preferências, **só** para desenvolvimento local.

> [!question]- Pra que serve a aba Timeline?
> Mostra a requisição crua: headers enviados, redirecionamentos e a resposta. É onde se depura.

> [!question]- Sintaxe de variável no Insomnia
> `{{ _.nome }}`

> [!question]- Ambiente
> conjunto de variáveis (JSON) que você troca com um clique

> [!question]- Header de token
> `Authorization: Bearer <token>`

> [!question]- Insomnia suporta GraphQL?
> Sim, com autocompletar a partir do schema

> [!question]- Status 401
> não autenticado: token ausente, inválido ou expirado

> [!question]+ Você tem a URL da API local e a de produção. Qual o jeito certo de alternar entre as duas?
> - a) Duplicar todas as requisições, uma pasta pra cada servidor
> - b) Criar uma variável `base_url` em dois ambientes e trocar o ambiente
> - c) Editar a URL de cada requisição antes de usar
> - d) Salvar as duas URLs num header
>
> > [!check]- Resposta
> > **b)** Ambientes guardam os valores que mudam (URL, token). As requisições usam `{{ _.base_url }}` e você só troca o ambiente no seletor.

---

## Pra consultar depois

| Recurso | O que faz |
|---|---|
| `{{ _.variavel }}` | Usa uma variável do ambiente |
| **New Request** / **Send** | Cria / envia uma requisição |
| **Environments** | Gerencia os ambientes |
| **Response tags** | Usa dados da resposta de outra requisição |
| **Timeline** | Mostra a requisição e a resposta cruas |
| **Import / Export** | Move coleções entre ferramentas |

**Pra ler:** a [documentação do Insomnia](https://docs.insomnia.rest) é curta e direta; a parte de "Environments" e "Template tags" é a que mais vale. E o [JSONPlaceholder](https://jsonplaceholder.typicode.com) é uma API falsa e gratuita, perfeita pra treinar sem medo de quebrar nada.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

# 📚 Insomnia

> *"Menos cerimônia, mais requisições."*

---

## O que é Insomnia?

O **Insomnia** é um cliente de APIs usado para **enviar requisições e inspecionar respostas**, sendo uma alternativa ao [[Postman]]. Tem interface limpa e direta, e suporta **REST**, **GraphQL**, **gRPC**, WebSocket e outros protocolos.

Como no Postman, você organiza requisições em coleções, usa variáveis de ambiente, configura autenticação e compartilha o trabalho com o time.

### Uma História Breve 📜

O Insomnia foi criado por **Gregory Schier** por volta de **2015**, inicialmente como projeto de código aberto. Mais tarde foi adquirido pela **Kong** (empresa de API gateways), que mantém o desenvolvimento. O foco sempre foi oferecer uma experiência mais simples e rápida para testar APIs.

---

## Por que é Importante? 💡

### Vantagens Principais

- 🚀 **Interface enxuta**: fácil de aprender, com pouca distração.
- 📦 **Suporte a vários protocolos**: REST, GraphQL, gRPC e mais, na mesma ferramenta.
- 🔧 **Ambientes e variáveis**: reutilize URLs, tokens e valores entre requisições.
- 🤖 **Integração com specs**: trabalha com OpenAPI para projetar e testar APIs.

---

## Conceitos Fundamentais 🎯

### Conceito 1: Requisições e pastas

Cada requisição define método, URL, headers, body e autenticação. Você pode agrupá-las em pastas dentro de uma coleção.

### Conceito 2: Ambientes

Definidos em JSON, permitem variar valores conforme o contexto (local, staging, produção).

```json
{
    "base_url": "http://localhost:3000",
    "token": "meu-token-de-teste"
}
```

Uso na URL e nos headers:

```text
{{ _.base_url }}/usuarios
Authorization: Bearer {{ _.token }}
```

### Conceito 3: Encadeamento de requisições

É possível usar dados da resposta de uma requisição em outra (ex.: pegar o token do login e usar nas demais) com as **Response tags** (`Response → Body Attribute`).

### Conceito 4: GraphQL

O Insomnia tem um editor de queries com autocompletar a partir do schema.

```graphql
query {
  usuario(id: 1) {
    nome
    email
  }
}
```

---

## Como Usar na Prática 🛠️

### Exemplo 1: Uso Básico

```text
1. Crie uma nova requisição (New Request)
2. Escolha GET e cole: https://jsonplaceholder.typicode.com/posts/1
3. Clique em Send
4. Inspecione a resposta nas abas Preview, Header e Timeline
```

### Exemplo 2: Caso de Uso Real

Fluxo de login + rota protegida:

```text
1. POST {{ _.base_url }}/login com body JSON {"email": "...", "senha": "..."}
2. Na requisição seguinte, em Auth escolha Bearer Token
3. No campo do token, use a tag de resposta apontando para o campo "token"
   do login (Response → Body Attribute)
4. Envie GET {{ _.base_url }}/perfil
```

---

## Configurações Recomendadas ⚙️

Ajustes úteis nas preferências do app (Preferences):

```json
{
    "Tema": "claro/escuro conforme preferência",
    "Seguir redirecionamentos": true,
    "Validar certificados SSL": true,
    "Timeout de requisição": "ajuste conforme sua API"
}
```

> Nomes das opções podem variar entre versões. Confira em *Preferences*.

---

## Dicas de Ouro 💎

### 1. Aprenda o autocompletar de variáveis

Digite `_.` ou use `Ctrl + Espaço` nos campos para ver as variáveis disponíveis.

### 2. Importe de outras ferramentas

O Insomnia consegue importar coleções (por exemplo, exportadas do Postman) e specs OpenAPI, o que facilita a migração.

### 3. Use a aba Timeline para depurar

Ela mostra detalhes da requisição e da resposta, útil para entender erros de header, redirecionamento ou TLS.

---

## Comandos e Sintaxe Essenciais 📋

| Comando/Sintaxe | Função |
|-----------------|--------|
| `{{ _.variavel }}` | Usa variável do ambiente |
| **New Request** | Cria uma requisição |
| **Send** | Envia a requisição |
| **Environments** | Gerencia ambientes |
| **Response tags** | Usa dados de respostas anteriores |
| **Import / Export** | Move coleções entre ferramentas |

---

## Exercício Prático 🎯

**Objetivo:** Reproduzir no Insomnia o fluxo que você fez no Postman e comparar.

```text
1. Crie uma coleção "Estudo API"
2. Cadastre um ambiente com base_url = https://jsonplaceholder.typicode.com
3. Crie requisições GET /posts, GET /posts/1 e POST /posts
4. Use {{ _.base_url }} nas URLs
5. Anote o que achou mais simples ou mais confuso em relação ao Postman
```

---

## Próximos Passos ✅

- [ ] Instalar o Insomnia e testar uma API pública
- [ ] Experimentar uma query GraphQL
- [ ] Importar uma coleção do [[Postman]] e comparar
- [ ] Decidir qual ferramenta usar no seu fluxo diário

---

## Recursos Recomendados 📚

### 💻 Sites e Documentação:
- [Documentação do Insomnia](https://docs.insomnia.rest) - Guias oficiais
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) - API falsa para treinar

---

## Problemas Comuns e Soluções 🔧

### Problema: Erro de certificado SSL ao testar um servidor local

**Solução:**
1. Prefira usar `http://localhost` em desenvolvimento, se possível.
2. Se precisar de HTTPS local, configure o certificado ou desative a validação **só para testes** nas preferências.

### Problema: Variável de ambiente aparece vazia

**Solução:**
1. Confirme se o ambiente correto está selecionado no topo.
2. Verifique a sintaxe do JSON do ambiente (vírgulas e aspas).

---

## Conclusão 🎉

O Insomnia é uma ótima opção para quem quer uma ferramenta de APIs direta e confortável. Conhecer mais de um cliente ajuda a entender os conceitos de HTTP independentemente da ferramenta.

Teste os dois e use o que combinar melhor com o seu estilo de trabalho.

---

*Este material segue o padrão da pasta Ferramentas para manter consistência entre todos os tópicos do vault de estudos.* 🎯

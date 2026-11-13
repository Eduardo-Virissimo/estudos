---
nivel: escrito
revisado:
---

# Postman

> *"Teste a API antes de escrever uma linha do código que a consome."*

> [!tip] ⚡ Em 30 segundos
> Ferramenta pra testar e explorar APIs: você monta a requisição (método, URL, headers, body), envia e vê a resposta. Organize em **coleções**, use **ambientes** pras variáveis e escreva testes simples.
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Montar uma requisição HTTP completa (método, headers, body)
- Organizar requisições em coleções com ambientes e variáveis
- Escrever testes automáticos simples nas respostas

---

## 🧭 Onde isso se encaixa

- **Antes:** [[HTTP]]
- **Depois:** [[Insomnia]] · [[Status Codes]]
- **Trilha:** [[Roadmap]]

---

## 💡 O que é Postman?

O **Postman** é uma plataforma para **testar, explorar e documentar APIs** sem precisar escrever código. Você monta requisições HTTP (GET, POST, PUT, DELETE...), envia para um servidor e vê a resposta (status, cabeçalhos, corpo) numa interface gráfica.

Além do teste manual, permite organizar requisições em **coleções**, usar **variáveis**, escrever **testes automatizados** e compartilhar com o time.

> [!note]- 📜 Um pouco de história
> O Postman começou em **2012** como uma extensão do Chrome criada por **Abhinav Asthana** para facilitar o teste de APIs. Cresceu até virar um aplicativo desktop próprio e hoje é uma plataforma completa para o ciclo de vida de APIs (design, testes, documentação, monitoramento).

---

## 🧱 Conceitos-chave

### Conceito 1: Requisição HTTP

Uma requisição tem **método**, **URL**, **headers** e, às vezes, **body**.

```http
POST /usuarios HTTP/1.1
Host: api.exemplo.com
Content-Type: application/json

{"nome": "Ana", "email": "ana@exemplo.com"}
```

### Conceito 2: Coleções

Pastas que agrupam requisições relacionadas (ex.: "API de Usuários"). Podem ser exportadas e compartilhadas.

### Conceito 3: Ambientes e variáveis

Variáveis usam chaves duplas e evitam repetir valores:

```text
{{base_url}}/usuarios
Authorization: Bearer {{token}}
```

Você cria ambientes (ex.: Dev e Prod) com valores diferentes para `base_url` e `token`.

### Conceito 4: Autenticação

Aba **Authorization** suporta Bearer Token, Basic Auth, API Key, OAuth 2.0, entre outros.

---

## 🛠️ Exemplos guiados

### Exemplo 1: Uso Básico

Testar uma API pública de exemplo (JSONPlaceholder):

```text
1. Crie uma nova requisição
2. Método: GET
3. URL: https://jsonplaceholder.typicode.com/posts/1
4. Clique em Send
5. Veja o status 200 e o JSON da resposta
```

### Exemplo 2: Caso de Uso Real

Criar um recurso com POST e validar a resposta com um teste (aba **Tests**):

```javascript
pm.test("Status é 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Resposta contém id", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
});
```

Guardar um token retornado pelo login em uma variável:

```javascript
const json = pm.response.json();
pm.environment.set("token", json.token);
```

---

## ⚙️ Configuração recomendada

Exemplo da estrutura de um ambiente (exportado em JSON):

```json
{
    "name": "Dev",
    "values": [
        { "key": "base_url", "value": "http://localhost:3000", "enabled": true },
        { "key": "token", "value": "", "enabled": true }
    ]
}
```

> Evite salvar segredos reais (tokens de produção) em coleções compartilhadas.

---

## 💎 Boas práticas

### 1. Use ambientes desde o início

Trocar entre local, staging e produção fica trivial e evita testar na URL errada.

### 2. Escreva testes simples nas requisições

Verificar status e campos básicos transforma a coleção em uma pequena suíte de testes.

### 3. Documente suas coleções

Adicione descrições e exemplos. A coleção vira documentação viva para o time.

---

## 🔧 Erros comuns e como resolver

### Problema: Erro de conexão ao chamar uma API local

**Solução:**
1. Verifique se o servidor está rodando e a porta está correta.
2. Use `http://localhost:PORTA` (e não `https`, a não ser que haja certificado).

### Problema: 401 Unauthorized

**Solução:**
1. Confira se o token está na aba **Authorization** ou no header correto.
2. Verifique se a variável `{{token}}` foi realmente preenchida e não expirou.

---

## 🔨 Desafio prático

**Objetivo:** Montar uma coleção pequena com testes automáticos.

```text
Usando https://jsonplaceholder.typicode.com:

1. Crie uma coleção "Estudo API"
2. Adicione uma requisição GET /posts e outra GET /posts/1
3. Crie uma requisição POST /posts com body JSON
4. Crie uma variável de ambiente base_url e use {{base_url}} nas URLs
5. Adicione um teste de status em cada requisição
6. Rode tudo com o Collection Runner
```

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa.

> [!question]- Quais partes formam uma requisição HTTP?
> Método (GET, POST...), URL (com query params), headers e body.

> [!question]- Qual a diferença entre coleção e ambiente?
> **Coleção** agrupa requisições (a API organizada). **Ambiente** guarda variáveis (`base_url`, `token`) que mudam entre dev e produção.

> [!question]- Deu `401 Unauthorized`. O que significa e o que checar?
> Falta autenticação ou ela é inválida. Cheque o header `Authorization`, se o token expirou e se o ambiente certo está ativo.

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

---

## 📋 Cola rápida

| Comando/Sintaxe | Função |
|-----------------|--------|
| `{{variavel}}` | Usa uma variável de ambiente/coleção |
| `pm.test()` | Define um teste |
| `pm.response.json()` | Lê o corpo da resposta como JSON |
| `pm.environment.set()` | Salva variável de ambiente |
| `pm.expect()` | Faz asserções (estilo Chai) |
| **Send** | Envia a requisição |
| **Collection Runner** | Executa uma coleção inteira |

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
-

**O que me confundiu / onde eu errei:**
-

**Onde eu usei de verdade:**
-

---

## ➡️ Próximos passos

- [ ] Instalar o Postman e criar uma conta (ou usar o modo offline, se disponível)
- [ ] Testar uma API real que você use ou esteja estudando
- [ ] Aprender a exportar e importar coleções
- [ ] Comparar com o [[Insomnia]] e ver qual combina mais com você

---

## 📚 Recursos

### 💻 Sites e Documentação:
- [Postman Learning Center](https://learning.postman.com) - Documentação e tutoriais oficiais
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) - API falsa gratuita para praticar

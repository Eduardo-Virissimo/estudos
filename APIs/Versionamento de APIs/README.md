# 🔄 Versionamento de APIs

O versionamento de APIs é a prática de gerenciar mudanças em uma API ao longo do tempo sem quebrar os clientes que já dependem dela.  
_Parece simples, mas é um dos maiores pontos de dor em projetos que crescem de verdade._

---

### 📌 Por que versionar?:

Quando uma API evolui — novos campos, endpoints removidos, comportamentos alterados — os clientes existentes podem parar de funcionar. O versionamento cria um contrato estável: quem usa a `v1` continua funcionando mesmo depois que a `v2` for lançada.

---

### 🧭 Estratégias de versionamento:

**1. Via URL (Path Versioning)**  
A versão fica explícita no caminho da URL. É a abordagem mais comum e mais fácil de testar no navegador.

```
GET /api/v1/usuarios
GET /api/v2/usuarios
```

_Vantagem: óbvio e simples. Desvantagem: viola levemente o princípio REST (a URL deveria identificar o recurso, não a versão)._

---

**2. Via Query String**  
A versão é passada como parâmetro na URL.

```
GET /api/usuarios?version=1
GET /api/usuarios?version=2
```

_Menos comum. Pode causar problemas com cache e não é tão legível._

---

**3. Via Header (Header Versioning)**  
A versão é enviada em um cabeçalho HTTP customizado.

```
GET /api/usuarios
Accept-Version: v1
```

_Mantém a URL limpa, mas torna o versionamento menos visível — cliente precisa saber que o header existe._

---

**4. Via Media Type (Content Negotiation)**  
Usa o cabeçalho `Accept` com um tipo de mídia customizado.

```
Accept: application/vnd.minhaapi.v1+json
```

_É o mais "correto" no sentido REST, mas é o mais complexo de implementar e documentar._

---

### ⚠️ Boas práticas:

- **Nunca quebre a versão atual sem avisar** — comunique deprecação com antecedência (ex: header `Deprecation: true`).
- **Documente cada versão separadamente** — Swagger/OpenAPI por versão ajuda muito.
- **Defina um ciclo de vida claro** — quanto tempo cada versão ficará ativa antes de ser descontinuada.
- **Mantenha compatibilidade retroativa sempre que possível** — adicionar campos não quebra; remover, sim.
- **Evite versionar demais** — muitas versões em paralelo viram pesadelo de manutenção.

---

### 🗑️ Deprecação:

Quando uma versão vai ser descontinuada, o recomendado é:

1. Anunciar com antecedência (mínimo 3–6 meses em APIs públicas).
2. Retornar headers de aviso nas respostas:
```
 Deprecation: trueSunset: Sat, 31 Dec 2025 23:59:59 GMT
```
  
3. Redirecionar para a nova versão quando possível.
4. Só então remover.

---

### 🔗 Referências:

- [REST API Versioning – restfulapi.net](https://restfulapi.net/versioning/)
- [Microsoft API Guidelines](https://github.com/microsoft/api-guidelines)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning) _(ótimo exemplo real)_
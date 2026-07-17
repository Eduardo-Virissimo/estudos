## tags: [materia/backend, tipo/estudo, status/revisado] data: 2026-07-16

# Versionamento de APIs

Prática de gerenciar mudanças em uma API ao longo do tempo sem quebrar os clientes que já dependem dela. É um dos pontos que mais gera dor em projetos que crescem — vale entender bem antes de bater de frente com o problema em produção.

## Por que versionar

Quando uma API evolui (novos campos, endpoints removidos, comportamentos alterados), os clientes existentes podem parar de funcionar. Versionar cria um contrato estável: quem usa a `v1` continua funcionando mesmo depois do lançamento da `v2`.

## Estratégias

### 1. Path Versioning (via URL)

A versão fica explícita no caminho da URL.

```
GET /api/v1/usuarios
GET /api/v2/usuarios
```

**Vantagem:** simples, óbvio, fácil de testar direto no navegador. **Desvantagem:** viola levemente o princípio REST — a URL deveria identificar o recurso, não a versão.

### 2. Query String Versioning

```
GET /api/usuarios?version=1
```

Menos comum. Pode causar problemas de cache e é menos legível.

### 3. Header Versioning

```
GET /api/usuarios
Accept-Version: v1
```

Mantém a URL limpa, mas o versionamento fica "escondido" — o cliente precisa saber que o header existe.

### 4. Content Negotiation (Media Type)

```
GET /api/usuarios
Accept: application/vnd.minhaapi.v1+json
```

É a abordagem mais correta do ponto de vista REST, mas também a mais complexa de implementar e documentar.

## Boas práticas

- Nunca quebrar a versão atual sem aviso prévio — comunicar deprecação com antecedência.
- Documentar cada versão separadamente (ex: OpenAPI/Swagger por versão).
- Definir um ciclo de vida claro: quanto tempo cada versão fica ativa antes de ser descontinuada.
- Manter compatibilidade retroativa sempre que possível — adicionar campo não quebra; remover, sim.
- Evitar versionar demais — muitas versões em paralelo viram pesadelo de manutenção.

## Deprecação

1. Anunciar com antecedência (mínimo 3–6 meses em APIs públicas).
    
2. Retornar headers de aviso nas respostas:
    
    ```
    Deprecation: true
    Sunset: Sat, 31 Dec 2025 23:59:59 GMT
    ```
    
3. Redirecionar para a nova versão quando possível.
    
4. Remover somente depois de cumprido o prazo.
    

## Notas relacionadas

- [[MOC - Backend]]
- [[REST - Principios]]
- [[Design de APIs - Boas Praticas]]

## Referências

- [REST API Versioning – restfulapi.net](https://restfulapi.net/versioning/)
- [Microsoft API Guidelines](https://github.com/microsoft/api-guidelines)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning)
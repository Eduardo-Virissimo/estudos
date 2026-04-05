# 📚 Módulo 05: Camadas 0 a 3 da Infraestrutura de Big Data

Este módulo cobre as camadas de base da arquitetura: da infraestrutura física até a organização de dados para consumo analítico.

## 🧰 Camada 0 — Elementos físicos (hardware e rede)

### Princípios de projeto

- **Desempenho** (latência e tempo de resposta);
- **Disponibilidade** (tempo de atividade);
- **Escalabilidade** (crescimento futuro);
- **Flexibilidade** (adaptação rápida);
- **Custo** (equilíbrio técnico-financeiro).

### Conceitos-chave

- **Resiliência:** capacidade de se recuperar de falhas.
- **Redundância:** recursos extras para evitar interrupção.
- **Eliminação de ponto único de falha:** requisito de arquitetura.

### Atenções práticas

- rede deve suportar aumento de volume e velocidade;
- servidores e armazenamento precisam acompanhar o desempenho da rede;
- monitoramento contínuo é obrigatório para elasticidade e prevenção de falhas.

## 🛡️ Camada 1 — Segurança

Objetivo: proteger dados contra acesso indevido, uso não autorizado e vazamento.

Pilares:

- controle de acesso por necessidade de negócio;
- identidade federada entre camadas/sistemas;
- proteção de dados em trânsito e em repouso;
- abordagem de segurança em múltiplas camadas.

### Criptografia e desempenho

No Big Data, criptografar tudo pode elevar custo computacional. Estratégia comum:

- priorizar criptografia de dados mais sensíveis;
- equilibrar segurança e performance operacional.

## 💾 Camada 2 — Armazenamento de dados

Os bancos operacionais devem ser:

- rápidos;
- escaláveis;
- confiáveis.

Não existe um único motor ideal para todos os casos. Frequentemente usa-se combinação de tecnologias (SQL + NoSQL + armazenamento distribuído).

### ACID em contexto operacional

- **Atomicidade** — tudo ou nada.
- **Consistência** — apenas dados válidos.
- **Isolamento** — transações simultâneas sem interferência.
- **Durabilidade** — persistência após gravação.

## 🗂️ Camada 3 — Organização dos dados

Responsável por capturar, validar, transformar e reunir dados em coleções úteis ao negócio.

Funções comuns:

- integração;
- tradução;
- normalização;
- escalabilidade do processamento.

Tecnologias típicas:

- sistemas de arquivos distribuídos;
- serviços de serialização;
- serviços de coordenação para aplicações distribuídas;
- ferramentas ETL;
- orquestração/fluxo de trabalho;
- modelos de processamento como **MapReduce**.

---

## ✅ Checklist rápido

- Entendi diferenças entre resiliência e redundância.
- Sei quando combinar SQL, NoSQL e armazenamento distribuído.
- Consigo listar tecnologias centrais da camada de organização.

⬅️ [Voltar para o índice principal](../README.md)

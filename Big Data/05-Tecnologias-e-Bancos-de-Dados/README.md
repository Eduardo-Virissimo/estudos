# 📚 Módulo 05: Camadas 0 a 3 da Infraestrutura de Big Data

Este módulo cobre as camadas de base da arquitetura: infraestrutura, segurança, armazenamento e organização dos dados.

## 🧰 Camada 0 — Elementos físicos e infraestrutura

É a base operacional da plataforma: servidores, rede, armazenamento, nuvem e capacidade computacional.

### Princípios de projeto

- **desempenho** para atender carga e latência esperadas;
- **disponibilidade** para manter a operação acessível;
- **escalabilidade** para crescer sem redesenho constante;
- **flexibilidade** para acomodar novas demandas;
- **custo** compatível com o valor gerado.

### Conceitos-chave

- **Resiliência**: capacidade de continuar operando ou se recuperar rapidamente.
- **Redundância**: existência de recursos extras para evitar indisponibilidade.
- **Eliminação de ponto único de falha**: princípio essencial em ambientes distribuídos.

## 🛡️ Camada 1 — Segurança

Segurança em Big Data deve ser transversal e não um item adicionado só no final.

Pontos centrais:

- controle de acesso baseado em papéis e necessidade de negócio;
- autenticação e identidade federada;
- proteção de dados em trânsito e em repouso;
- trilhas de auditoria;
- políticas de retenção e privacidade.

### Segurança x desempenho

Em ambientes de grande escala, proteção e performance precisam ser equilibradas. A decisão correta não é "criptografar tudo sem critério", mas proteger de forma proporcional ao risco e à criticidade do dado.

## 💾 Camada 2 — Armazenamento de dados

O armazenamento precisa atender diferentes perfis de uso.

Tecnologias comuns:

- **SQL** para dados estruturados e consistência forte;
- **NoSQL** para flexibilidade, escala horizontal ou alta taxa de escrita;
- **armazenamento distribuído ou object storage** para grandes volumes e dados diversos.

### ACID e consistência

Em bancos transacionais, propriedades **ACID** continuam importantes:

- **Atomicidade**
- **Consistência**
- **Isolamento**
- **Durabilidade**

Em Big Data, porém, nem todas as cargas exigem o mesmo nível de consistência. Por isso, arquiteturas modernas frequentemente combinam motores diferentes conforme o caso de uso.

## 🗂️ Camada 3 — Organização dos dados

É a camada responsável por transformar dados dispersos em dados prontos para consumo.

Funções comuns:

- ingestão;
- validação;
- padronização;
- enriquecimento;
- integração;
- catalogação;
- orquestração de fluxos.

### Operações típicas

- ETL ou ELT;
- processamento em lote;
- processamento em fluxo;
- particionamento e organização por domínio;
- gestão de metadados e qualidade.

### Tecnologias associadas

- sistemas de arquivos distribuídos;
- mensageria e streaming;
- ferramentas de transformação;
- orquestradores de pipeline;
- processamento distribuído, como MapReduce e abordagens mais modernas equivalentes.

## 🎯 Ideia central do módulo

As camadas 0 a 3 sustentam tudo o que vem depois. Se essa base falha, a análise até pode existir, mas vira algo caro, instável e difícil de governar.

---

## ✅ Checklist rápido

- Entendi a diferença entre resiliência, redundância e disponibilidade.
- Sei por que uma arquitetura costuma combinar tecnologias de armazenamento.
- Consigo explicar o papel da organização dos dados antes da análise.

⬅️ [Voltar para o índice principal](../README.md)

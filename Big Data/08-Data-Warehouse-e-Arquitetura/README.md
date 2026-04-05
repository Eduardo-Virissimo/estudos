# 📚 Módulo 08: Data Warehouse e Arquitetura Analítica

Depois de entender SQL e NoSQL, o próximo passo é estudar o **Data Warehouse**, uma tecnologia fundamental para consolidar dados e apoiar decisões estratégicas.

## 🏢 1) O que é Data Warehouse

Segundo a formulação clássica associada a William Inmon, um Data Warehouse é um repositório de dados:

- **orientado por assunto**;
- **integrado**;
- **variante no tempo**;
- **não volátil**;
- voltado ao **suporte à decisão gerencial**.

Em termos práticos, ele reúne dados de várias fontes em um ambiente preparado para análise.

Historicamente, essa abordagem ganhou força a partir da década de 1980, quando as organizações passaram a precisar consolidar grandes volumes de dados de fontes diferentes para análise.

## 🧭 2) Características fundamentais

### Orientado por assunto

Os dados são organizados por temas de negócio, como:

- vendas;
- clientes;
- estoque;
- finanças.

### Integrado

O Data Warehouse consolida dados de diferentes sistemas em uma estrutura padronizada.

### Variante no tempo

O histórico é preservado, permitindo comparar períodos e analisar evolução.

### Não volátil

Os dados analíticos não sofrem o mesmo padrão de atualização frequente dos sistemas operacionais. O foco é consulta, histórico e análise.

### Informações consolidadas e confiáveis

O Data Warehouse é pensado para entregar dados:

- consolidados;
- resumidos quando necessário;
- consistentes;
- confiáveis para apoiar decisão.

## 🔄 3) Data Warehouse x banco operacional

| Aspecto | Banco operacional | Data Warehouse |
| --- | --- | --- |
| Finalidade | Registrar operações do dia a dia | Apoiar análise e decisão |
| Tipo de carga | Transações em tempo real | Consultas analíticas |
| Horizonte temporal | Estado atual e operação corrente | Histórico consolidado |
| Otimização | Escrita e atualização | Leitura, agregação e análise |

Por isso, não faz sentido tratar Data Warehouse como simples "banco maior". A função dele é diferente.

## 🧱 4) Arquitetura típica de um Data Warehouse

Uma arquitetura típica inclui os seguintes elementos:

- **fontes de dados**;
- **processo ETL**;
- **staging area**;
- **armazenamento central**;
- **data marts**;
- **camadas de acesso analítico**, como OLAP e data mining.

Dependendo do cenário, outras arquiteturas podem incluir ainda:

- metadados;
- gerenciamento de dados;
- mecanismos de segurança;
- auditoria;
- escalabilidade e alta disponibilidade.

## 🛠️ 5) Camadas principais da arquitetura

### Fontes de dados

Podem incluir:

- sistemas operacionais;
- bancos transacionais;
- arquivos;
- planilhas;
- aplicações externas.

### Processo ETL

O ETL faz três movimentos principais:

1. **extrair** os dados das fontes;
2. **transformar** os dados com limpeza, filtro, agregação e ajuste de formato;
3. **carregar** os dados no repositório analítico.

### Staging area

É uma área intermediária usada para preparar, validar ou reorganizar dados antes da carga final.

### Armazenamento de dados

Pode seguir:

- abordagem relacional;
- abordagem dimensional;
- combinação de tecnologias conforme o caso.

### Acesso aos dados

O consumo final pode ocorrer por:

- relatórios;
- dashboards;
- consultas;
- OLAP;
- data mining;
- ferramentas de BI.

Esse acesso deve respeitar permissões e mecanismos de segurança, para que cada usuário veja apenas as informações autorizadas.

## 🧮 6) Data Mart, OLAP e Data Mining

### Data Mart

É um subconjunto temático do ambiente analítico, geralmente voltado a uma área ou necessidade específica.

### OLAP

Permite análise multidimensional, com foco em exploração de medidas e dimensões.

### Data Mining

Busca padrões, relações e descobertas relevantes dentro dos dados armazenados.

## 🧰 7) Tecnologias usadas para implementar Data Warehouse

Exemplos de SGBDs e plataformas usadas nesse contexto:

- Microsoft SQL Server;
- Oracle Database;
- Amazon Redshift;
- Snowflake;
- Teradata;
- IBM Db2 Warehouse.

A escolha depende de:

- volume de dados;
- complexidade das consultas;
- infraestrutura disponível;
- preferência por nuvem ou ambiente local;
- custo e escalabilidade.

## 📋 8) Passos importantes de implementação

Passos essenciais:

1. definir objetivos e requisitos;
2. fazer a modelagem dimensional com tabelas fato e dimensão;
3. escolher a arquitetura;
4. selecionar ferramentas de ETL;
5. implementar segurança e governança;
6. dimensionar infraestrutura;
7. desenvolver camadas de transformação e acesso;
8. monitorar e otimizar desempenho.

Exemplos de ferramentas de ETL:

- Talend;
- Informatica PowerCenter;
- Microsoft SQL Server Integration Services.

## 🎯 9) Ideia central do módulo

O Data Warehouse é uma peça analítica. Ele existe para transformar dados dispersos em visão consolidada, histórica e confiável para apoiar decisão.

---

## ✅ Checklist rápido

- Sei definir Data Warehouse pelas suas características centrais.
- Consigo diferenciar Data Warehouse de banco operacional.
- Entendo os principais componentes da arquitetura analítica.

⬅️ [Voltar para o índice principal](../README.md)

# 📚 Módulo 02: Tipos de Dados no Big Data

Entender o tipo de dado é essencial para escolher corretamente **armazenamento**, **processamento**, **integração** e **ferramentas analíticas**.

## 🧱 1) Dados estruturados

São dados organizados em um esquema fixo, normalmente em linhas e colunas.

Características:

- formato padronizado;
- regras de validação mais claras;
- consulta direta, geralmente com SQL;
- alto controle sobre consistência.

Exemplos:

- bancos relacionais;
- planilhas;
- cadastros;
- transações de vendas.

## 🏷️ 2) Dados semiestruturados

Não seguem um esquema rígido como uma tabela relacional, mas carregam marcações ou metadados que ajudam na interpretação.

Características:

- estrutura flexível;
- presença de chaves, tags ou hierarquias;
- boa adaptação a integrações entre sistemas.

Exemplos:

- JSON;
- XML;
- logs;
- mensagens de eventos;
- documentos com metadados.

## 🌪️ 3) Dados não estruturados

São dados cujo conteúdo principal não está organizado em um modelo tabular ou em um esquema simples de consulta.

Características:

- interpretação mais complexa;
- necessidade frequente de técnicas como NLP, visão computacional ou processamento de sinais;
- maior custo para extração de valor.

Exemplos:

- textos livres;
- imagens;
- áudios;
- vídeos;
- e-mails;
- publicações em redes sociais.

> É comum encontrar estimativas dizendo que a maior parte dos dados gerados no mundo é não estruturada, mas o percentual exato varia conforme a fonte e o setor.

## 🔁 4) A classificação depende do contexto

O mesmo ativo pode conter mais de um tipo de dado.

Exemplo:

- um PDF pode ser **não estruturado** como conteúdo textual;
- os campos de autor, data e título desse PDF podem ser **estruturados**;
- um log em JSON é **semiestruturado**, mas pode ser transformado em tabela para análise.

Isso é importante porque, em Big Data, parte do trabalho está justamente em transformar dados de um formato em outro para viabilizar análise.

## 📊 5) Comparativo rápido

| Tipo | Estrutura | Armazenamento comum | Dificuldade de análise |
| --- | --- | --- | --- |
| Estruturado | Esquema fixo | Bancos relacionais e data warehouses | Baixa |
| Semiestruturado | Esquema flexível | NoSQL, arquivos JSON/XML, filas e eventos | Média |
| Não estruturado | Conteúdo livre | Data lakes, object storage, sistemas distribuídos | Alta |

## 🧠 6) Impacto na arquitetura

Os tipos de dados influenciam diretamente:

- a forma de ingestão;
- o custo de armazenamento;
- o tipo de processamento;
- o tempo para gerar insight;
- a escolha entre schema-on-write e schema-on-read.

Em resumo: **quanto maior a variedade, maior a necessidade de arquitetura flexível**.

---

## ✅ Checklist rápido

- Identifico a diferença entre dados estruturados, semiestruturados e não estruturados.
- Entendo que a classificação depende do uso e do contexto.
- Consigo relacionar tipo de dado com armazenamento e análise.

⬅️ [Voltar para o índice principal](../README.md)

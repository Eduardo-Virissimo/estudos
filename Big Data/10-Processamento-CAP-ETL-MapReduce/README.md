# 📚 Módulo 10: Processamento de Big Data — CAP, ETL e MapReduce

> **Foco do módulo:** entender como processar grandes volumes de dados em ambientes distribuídos, equilibrando consistência, disponibilidade e desempenho.

## ⚙️ 1) O que é processamento de Big Data

Processamento de Big Data é o conjunto de técnicas e tecnologias para lidar com dados em escala, marcados por:

- **volume** elevado;
- **complexidade** de fontes e formatos;
- **variedade** de dados estruturados, semiestruturados e não estruturados.

Para isso, o ecossistema costuma combinar:

- particionamento e clusterização;
- replicação de dados;
- armazenamento distribuído (ex.: HDFS);
- processamento distribuído (ex.: MapReduce e Spark);
- técnicas analíticas para gerar insights.

## 🧭 2) Teorema CAP na prática

O **Teorema CAP** afirma que, em sistemas distribuídos, não é possível garantir simultaneamente os três atributos em todos os cenários:

Também chamado de **Teorema de Brewer**, foi apresentado por Eric Brewer em 2000 e se tornou uma referência para decisões de arquitetura distribuída.

| Atributo                       | Significado                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| **Consistência (C)**           | Todos os nós enxergam a mesma versão dos dados.                 |
| **Disponibilidade (A)**        | O sistema responde às requisições mesmo diante de falhas.       |
| **Tolerância a partições (P)** | O sistema continua operando quando há falhas de rede entre nós. |

Quando ocorre partição de rede, o sistema precisa priorizar:

- **CP**: mantém consistência, podendo sacrificar disponibilidade temporariamente;
- **AP**: mantém disponibilidade, aceitando inconsistência temporária.

> Em cenários reais de Big Data, a tolerância a partições é obrigatória, então a decisão prática normalmente acontece entre consistência e disponibilidade.

### Exemplo de decisão por contexto

- **E-commerce:** costuma priorizar disponibilidade para não interromper operações.
- **Financeiro:** costuma priorizar consistência para evitar inconsistências críticas.

### CAP no contexto de NoSQL

Em bancos NoSQL distribuídos, o CAP costuma aparecer de forma prática como escolha entre:

- maior consistência em cenários críticos; ou
- maior disponibilidade com inconsistência temporária (consistência eventual).

Não existe uma regra única para todos os bancos NoSQL: o comportamento varia conforme a tecnologia e a configuração adotada.

## 🗃️ 3) Topologias de replicação e trade-offs

As topologias de replicação ajudam a materializar escolhas do CAP:

| Topologia          | Característica                                      | Tendência comum                        |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| **Mestre-escravo** | Escrita centralizada no mestre, leitura distribuída | Mais foco em consistência              |
| **Em cascata**     | Replicação em níveis hierárquicos                   | Mais foco em consistência              |
| **Mestre-mestre**  | Escrita em múltiplos mestres                        | Mais foco em disponibilidade           |
| **Em anel**        | Nós replicam em sequência circular                  | Depende da estratégia de reconciliação |

A escolha depende dos requisitos do negócio, dos riscos aceitos e do tipo de carga analítica/operacional.

## 🔄 4) ETL em ambientes de Big Data

**ETL (Extract, Transform, Load)** organiza o fluxo de dados para análise confiável.

### Extract (extração)

Coleta dados de fontes como:

- bancos transacionais;
- sistemas legados;
- arquivos e planilhas;
- APIs e serviços web.

### Transform (transformação)

Prepara os dados com:

- limpeza e remoção de duplicidades;
- padronização de formatos;
- enriquecimento com dados externos;
- derivação de novas métricas;
- filtragem conforme regras de negócio.

### Load (carga)

Carrega os dados no destino analítico (Data Warehouse, Data Lakehouse, plataformas distribuídas).

Tipos comuns de carga:

| Tipo                     | Como funciona                                        | Quando usar                                 |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| **Completa (Full Load)** | Recarrega todo o conjunto de dados                   | Bases menores ou recargas totais planejadas |
| **Incremental**          | Carrega apenas registros alterados                   | Operação contínua e eficiente               |
| **Delta**                | Carrega inclusões e remoções desde a última execução | Cenários com rastreio detalhado de mudanças |

Durante a carga, é recomendável aplicar verificações de qualidade para garantir integridade dos dados:

- regras de integridade;
- validação de formato;
- verificação de duplicidades.

### Ferramentas de ETL: categorias e critérios

Categorias recorrentes:

- **Comerciais** (ex.: Informatica, IBM DataStage, SSIS);
- **Código aberto** (ex.: Apache NiFi, Talend Open Studio, Pentaho, Spark);
- **Linguagens de programação** com bibliotecas (ex.: Python e R).

Critérios práticos de escolha:

- suporte às fontes e à plataforma;
- capacidade de paralelismo e distribuição;
- facilidade de depuração e agendamento;
- reutilização da lógica de transformação.

## 🧠 5) MapReduce

O **MapReduce** é um modelo de processamento distribuído popularizado pelo Google para lidar com grandes volumes de dados em paralelo.

Fluxo simplificado:

1. dividir dados de entrada em partes (splits);
2. aplicar função **Map** para gerar pares chave-valor;
3. agrupar/intercalar resultados por chave;
4. aplicar função **Reduce** para consolidar o resultado final.

Exemplo clássico: contagem de palavras em uma coleção de documentos.

Vantagens principais:

- alta escalabilidade;
- tolerância a falhas;
- bom desempenho em processamento em lote.

Aplicações comuns:

- processamento de logs;
- indexação de mecanismos de busca;
- análise de dados em larga escala;
- aprendizado de máquina em pipelines distribuídos.

> O modelo MapReduce é base histórica do ecossistema Hadoop para processamento distribuído em Big Data.

## 🚀 6) Boas práticas de desempenho

Três frentes são decisivas para performance de processamento distribuído:

- **Hardware e rede:** topologia adequada e largura de banda sustentada.
- **Sincronização:** entrega eficiente da saída de Map para os nós de Reduce.
- **Sistema de arquivos distribuído:** organização dos dados e metadados para leitura/escrita em escala.

## 🔗 7) Como os conceitos se conectam

No ambiente de Big Data:

- o **CAP** orienta escolhas arquiteturais em sistemas distribuídos;
- o **ETL** garante qualidade e preparo dos dados;
- o **MapReduce** acelera o processamento em larga escala.

Em projetos reais, o ETL não encerra o fluxo: depois da carga, os dados ainda passam por análise, visualização e tomada de decisão.

A combinação desses três elementos sustenta pipelines analíticos robustos, escaláveis e aderentes ao contexto de negócio.

---

## ✅ Checklist rápido

- Sei explicar o trade-off do Teorema CAP em partições de rede.
- Consigo diferenciar carga full, incremental e delta no ETL.
- Entendo o fluxo Map → Shuffle/Sort → Reduce.

⬅️ [Voltar para o índice principal](../README.md)

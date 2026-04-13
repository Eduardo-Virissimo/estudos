# 📚 Módulo 11: Ecossistema Hadoop — Componentes e Ferramentas

> **Foco do módulo:** entender como o Hadoop organiza armazenamento, processamento, ingestão, análise e governança em ambientes de Big Data.

## 🌐 1) Por que o Hadoop ganhou destaque no Big Data

Com o crescimento acelerado dos dados, soluções tradicionais passaram a enfrentar limitações de custo e escalabilidade. Nesse contexto, o Hadoop se consolidou por combinar:

- código aberto;
- execução em clusters distribuídos;
- uso de hardware commodity;
- capacidade de processar dados em escala de petabytes e exabytes.

Em termos práticos, ele permite armazenar, processar e analisar grandes volumes de dados de forma mais acessível e escalável.

## 🧱 2) Componentes centrais do Hadoop

A base do ecossistema Hadoop é formada por quatro componentes principais:

| Componente | Papel no ecossistema |
| --- | --- |
| **HDFS** | Armazenamento distribuído de dados em blocos com replicação. |
| **MapReduce** | Processamento distribuído em etapas de Map e Reduce. |
| **YARN** | Gerenciamento de recursos e execução de aplicações no cluster. |
| **Hadoop Common** | Bibliotecas e utilitários compartilhados entre os componentes. |

### HDFS (armazenamento distribuído)

No HDFS, os arquivos são quebrados em blocos e distribuídos entre vários nós. A replicação aumenta disponibilidade e tolerância a falhas.

Conceitos importantes:

- **NameNode:** gerencia metadados e localização dos blocos;
- **DataNodes:** armazenam blocos e atendem operações de leitura/escrita.

### YARN (gerência de recursos)

O YARN permite múltiplas aplicações no mesmo cluster, distribuindo CPU e memória de forma controlada.

Elementos de referência:

- **ResourceManager:** coordena a alocação de recursos;
- **NodeManagers:** executam e monitoram tarefas em cada nó;
- **ApplicationMaster:** negocia recursos para cada aplicação.

## ⚙️ 3) Processamento no ecossistema: MapReduce e Spark

O Hadoop nasceu fortemente apoiado em MapReduce para processamento em lote. Com a evolução do ecossistema, o Spark passou a complementar esse modelo.

| Tecnologia | Força principal | Perfil de uso |
| --- | --- | --- |
| **MapReduce** | Robustez em processamento distribuído em lote | Jobs grandes e pipeline clássico no Hadoop |
| **Spark** | Processamento em memória (maior velocidade em muitos cenários) | Batch, streaming, machine learning e grafos |

O Spark é frequentemente usado junto ao Hadoop, aproveitando o armazenamento no HDFS e ampliando as opções de processamento.

## 🧩 4) Ferramentas por função no ecossistema Hadoop

### Ferramentas de análise

- **Hive:** consultas em linguagem semelhante a SQL (HiveQL) para dados no HDFS.
- **Pig:** scripts de transformação de dados com Pig Latin.
- **HBase:** banco NoSQL orientado a colunas para alta escala e baixa latência.
- **Oozie:** orquestração e agendamento de workflows de dados.

### Ferramentas de ingestão

- **Flume:** coleta e transporte distribuído de eventos e logs.
- **Sqoop:** importação/exportação entre bancos relacionais e Hadoop.
- **Kafka:** ingestão e transmissão de dados em tempo real (pub/sub).

### Coordenação, operação e segurança

- **ZooKeeper:** coordenação distribuída (configuração, sincronização, eleição de líder).
- **Ambari:** instalação, configuração e monitoramento de clusters Hadoop.
- **Ranger:** políticas centralizadas de segurança e controle de acesso.
- **Mahout:** biblioteca de machine learning distribuído no contexto do ecossistema.

## 🎯 5) Casos de uso em que Hadoop aparece com frequência

- processamento de logs em grande escala;
- ingestão de dados de sensores e eventos;
- integração de múltiplas fontes de dados para análise;
- pipelines analíticos batch e near real time;
- preparação de dados para BI e aplicações de machine learning.

## 🛠️ 6) Boas práticas de adoção

- Começar por caso de uso e requisitos de negócio, não por ferramenta isolada.
- Definir estratégia de ingestão (batch, streaming ou híbrida).
- Tratar segurança e governança desde o início (acesso, auditoria e políticas).
- Dimensionar cluster e monitorar continuamente desempenho e falhas.
- Em ambiente de estudo, usar distribuições ou ambientes pré-configurados pode acelerar o aprendizado.

## 🔗 7) Conexão com os módulos anteriores

- O **Módulo 10** trouxe CAP, ETL e MapReduce.
- Este módulo mostra como esses conceitos se materializam no ecossistema Hadoop.
- Nos próximos estudos, a decisão arquitetural deve combinar tipo de dado, latência esperada, custo operacional e requisitos de segurança e governança.

---

## ✅ Checklist rápido

- Sei explicar os quatro componentes centrais do Hadoop.
- Consigo diferenciar funções de Hive, Pig, HBase e Oozie.
- Entendo quando usar ferramentas de ingestão como Flume, Sqoop e Kafka.
- Consigo relacionar Hadoop com os conceitos de CAP, ETL e processamento distribuído.

⬅️ [Voltar para o índice principal](../README.md)

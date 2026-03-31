# 📚 Módulo 05: Tecnologias e Bancos de Dados

Este módulo aprofunda as camadas finais da arquitetura de Big Data, focando em como os dados são tecnicamente armazenados e organizados para gerar valor.

## 💾 Camada 2: Detalhes de Armazenamento

Para que o armazenamento seja eficiente em Big Data, não basta apenas ter espaço; é preciso velocidade e confiabilidade. Aqui entram dois grandes modelos:

### RDBMS (Bancos de Dados Relacionais)
* **Linguagem:** SQL (*Structured Query Language*).
* **Características:** São os bancos tradicionais, excelentes para dados estruturados onde a consistência é crítica (ex: transações bancárias).
* **Limitação:** Têm dificuldade em escalar horizontalmente (adicionar muitos servidores) e não lidam bem com dados desestruturados (vídeos, posts).

### NoSQL (Não Relacionais)
* **Conceito:** Surgiu para resolver as limitações do SQL no Big Data.
* **Vantagens:** * **Alta Escalabilidade:** Permite distribuir os dados por centenas de servidores comuns.
    * **Flexibilidade:** Aceita dados sem um esquema fixo (esquema dinâmico).
* **Tipos principais:** Documentos (JSON), Chave-Valor, Grafos e Família de Colunas.

---

## 🗃️ Camada 3: Organização e Processamento

Esta camada é o "cérebro" que coordena como os dados são lidos e transformados. O conceito principal aqui é o **Processamento Paralelo Distribuído**.

### Hadoop e MapReduce
O ecossistema Hadoop é um dos pilares do Big Data. O seu funcionamento baseia-se no modelo **MapReduce**:

1. **Map (Mapear):** O sistema divide o grande problema em partes menores e distribui-as por vários computadores. Cada um processa a sua parte simultaneamente.
2. **Reduce (Reduzir):** O sistema recolhe os resultados de todos os computadores, combina-os e entrega a resposta final consolidada.

**Por que isso é importante?**
* Permite processar petabytes de dados em minutos em vez de dias.
* Se um computador falhar durante o processo, outro assume a tarefa automaticamente (Tolerância a falhas).

---

## 🏁 Conclusão do Estudo

O Big Data não é apenas "ter muitos dados", mas sim a capacidade de:
1. **Capturar** (Interfaces e APIs).
2. **Proteger** (Segurança e Encriptação).
3. **Armazenar** (SQL vs NoSQL).
4. **Processar** (MapReduce/Hadoop).
5. **Gerar Insight** (Metodologia CRISP-DM).

---
### 📚 Referências Principais
* **Taurion (2013/2021):** Definição dos 5 V's e o impacto nos negócios.
* **Davenport & Prusak (1998):** Gestão do conhecimento e distinção entre dado e informação.
* **CRISP-DM SIG (1999):** Standard para mineração e análise de dados.

⬅️ [Voltar para o Índice Principal](../README.md)
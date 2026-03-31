# 📚 Módulo 04: Arquitetura e Camadas de Infraestrutura

Implementar uma solução de Big Data exige compreender o risco, o volume, a conformidade legal e as necessidades de processamento em tempo real da empresa. Uma boa arquitetura garante que dados massivos sejam recolhidos, partilhados e processados de forma eficiente e segura, utilizando interfaces e APIs.

A infraestrutura moderna divide-se tipicamente nas seguintes camadas fundamentais:

## 🛠️ Camada 0 | Elementos Físicos (Hardware e Rede)
É a base de tudo, onde os servidores e cabos habitam.
* **Foco Principal:** A **resiliência** (capacidade do sistema se recuperar rapidamente a falhas) e a **redundância** (ter recursos extra/duplicados para evitar interrupções no serviço).
* Exige um constante equilíbrio entre custos operacionais, escalabilidade (capacidade de adicionar mais poder de computação rapidamente) e o desempenho bruto das redes e processadores.

## 🛡️ Camada 1 | Segurança
Protege o ativo mais valioso: a informação.
* Foca na proteção dos dados em repouso e em trânsito através de criptografia e num controlo rígido de acesso (ex: gestão de identidade federada).
* **Nota Técnica:** Como o processo de criptografia exige muito processamento e pode reduzir o desempenho do sistema, a recomendação padrão em Big Data é criptografar apenas dados considerados *altamente sensíveis* (como dados pessoais ou financeiros).

## 💾 Camada 2 | Armazenamento de Dados
Onde os dados residem antes e depois de serem processados.
* Requer motores de bases de dados extremamente rápidos, escaláveis e fiáveis (sejam eles SQL tradicionais ou sistemas NoSQL modernos).
* Sistemas robustos utilizam os **Princípios ACID** para garantir a segurança matemática das transações no banco de dados:
  * **A - Atomicidade:** Uma transação é executada como "tudo ou nada" (se falhar a meio, nada é gravado).
  * **C - Consistência:** A base de dados só aceita e grava dados que sejam válidos segundo as suas regras.
  * **I - Isolamento:** Múltiplas transações simultâneas não interferem umas com as outras.
  * **D - Durabilidade:** Uma vez gravados, os dados estão permanentes, mesmo em caso de falha de energia.

## 🗃️ Camada 3 | Organização dos Dados
Onde o dado bruto ganha forma para análise.
* Utiliza ferramentas e serviços (como o modelo de programação *MapReduce*, *Hadoop* ou *Spark*) para capturar, validar e processar conjuntos massivos de dados de forma contínua e em paralelo.

⬅️ [Voltar para o Índice Principal](../README.md)
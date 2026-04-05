# 📚 Módulo 09: Normalização, Modelagem e Revisão Final

Armazenamento em Big Data não depende só da tecnologia escolhida. A forma de **modelar e organizar** os dados também determina qualidade, consistência e desempenho.

## 🧼 1) O que é normalização

Normalização é o processo de estruturar dados para:

- eliminar redundâncias;
- evitar anomalias;
- melhorar consistência;
- facilitar manutenção.

Ela é tradicionalmente associada a bancos relacionais, mas continua relevante no contexto de Data Warehouse e Big Data quando o objetivo é manter qualidade e organização adequadas.

A normalização também pode ser associada à melhoria de:

- performance;
- escalabilidade;
- segurança dos dados.

## ✅ 2) Benefícios da normalização

Quatro benefícios principais:

- **eliminar redundâncias**;
- **garantir consistência**;
- **facilitar manutenção**;
- **melhorar a qualidade dos dados**.

Além disso, a normalização se relaciona à economia de espaço e à melhora da eficiência das consultas, já que menos dados redundantes precisam ser acessados.

Quando dados são duplicados sem controle, aumentam os riscos de:

- divergência entre registros;
- erros analíticos;
- custos maiores de manutenção;
- baixa confiabilidade nos relatórios.

## 📐 3) Formas normais mais importantes

### 1FN — Primeira Forma Normal

Exige:

- valores atômicos;
- ausência de valores repetitivos ou grupos repetidos;
- identificação única dos registros.

### 2FN — Segunda Forma Normal

Além da 1FN, exige que atributos não chave dependam da chave completa, e não apenas de parte dela.

### 3FN — Terceira Forma Normal

Além da 2FN, elimina dependências transitivas entre atributos não chave.

Em resumo:

- 1FN remove repetições e valores não atômicos;
- 2FN remove dependências parciais;
- 3FN remove dependências transitivas.

## 🧩 4) Normalização x modelagem dimensional

Em **Data Warehouse**, nem sempre a solução ideal é maximizar normalização.

Isso acontece porque ambientes analíticos priorizam:

- desempenho de consulta;
- leitura agregada;
- análise multidimensional.

Por isso, é comum usar **modelagem dimensional**, que organiza os dados com:

- **tabelas fato**: medidas numéricas do negócio;
- **tabelas dimensão**: contexto descritivo, como tempo, produto e local;
- **hierarquias**: níveis de análise, como dia → mês → ano.

Na prática, isso pode envolver alguma **desnormalização controlada** para facilitar análise.

Ainda assim, a normalização continua podendo ser aplicada em partes do Data Warehouse, como na estruturação de tabelas e na preservação da integridade dos dados.

## ⚖️ 5) O equilíbrio correto

Uma conclusão importante:

- normalização ajuda muito na integridade e organização;
- modelagem dimensional ajuda muito na análise;
- a escolha correta depende do objetivo do ambiente.

Ou seja, não existe regra única. O projeto precisa equilibrar:

- consistência;
- desempenho;
- flexibilidade;
- facilidade de consulta.

## 🔁 6) Revisão integrada

### Armazenamento em Big Data

- Big Data exige armazenar dados com volume, variedade e velocidade elevados.
- A tecnologia precisa acompanhar o tipo de dado e o tipo de análise.

### SQL

- ideal para dados estruturados;
- trabalha bem com integridade, relações e transações.

### NoSQL

- útil para escala horizontal e maior flexibilidade;
- aparece com força em logs, IoT, redes sociais e recomendação.

### Data Warehouse

- integra dados de várias fontes;
- preserva histórico;
- organiza dados para análise e decisão.

### Arquitetura analítica

- envolve fontes, ETL, staging, armazenamento e acesso analítico.

### Normalização e modelagem

- garantem organização, qualidade e desempenho adequado ao contexto.
- exigem equilíbrio entre estruturação dos dados e desempenho das consultas.

## 📚 7) Referências

- COSTA, Maria Inês Peixoto da. _Etiquetagem e rastreio de fontes de dados num big data warehouse_. 2019.
- HURWITZ, Judith; NUGENT, Alan; HALPER, Fern; KAUFMAN, Marcia. _Big Data For Dummies_. 2013.
- INMON, William H. _Building the Data Warehouse_. 2005.
- PINTO, Marcos Vinícius. _Data Warehouse: a metodologia definitiva para projetos bem-sucedidos_. 2021.
- PINTO, Marcos Vinícius. _Simplificando o Big Data em 7 capítulos_. 2021.
- TAURION, Carlos. _Big Data_. 2021.

## 🎯 Fechamento da trilha

Com os módulos 07 a 09, a trilha deixa de tratar Big Data apenas no nível conceitual e passa a cobrir uma parte essencial da implementação: como os dados são modelados, armazenados, integrados e preparados para análise.

---

## ✅ Checklist rápido

- Sei explicar por que normalização continua importante.
- Entendo a diferença entre normalização e modelagem dimensional.
- Consigo relacionar SQL, NoSQL e Data Warehouse com seus casos de uso.

⬅️ [Voltar para o índice principal](../README.md)

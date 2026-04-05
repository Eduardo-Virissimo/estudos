# 📚 Módulo 07: Armazenamento de Dados em Big Data — SQL e NoSQL

Este módulo foca no problema central do armazenamento em Big Data: como guardar, organizar e recuperar grandes volumes de dados com formatos e ritmos de geração muito diferentes.

## 🧠 1) Por que armazenamento é tão importante em Big Data

No contexto de Big Data, o armazenamento deixa de ser apenas uma questão de "onde salvar os dados" e passa a envolver:

- capacidade de lidar com grande volume;
- variedade de formatos;
- velocidade de geração e atualização;
- suporte à análise posterior;
- escolha da tecnologia adequada ao tipo de uso.

As bases relacionais tradicionais continuam importantes, mas muitas vezes não bastam sozinhas quando o cenário exige flexibilidade estrutural e escala horizontal.

## 🧱 2) Bases de dados relacionais (SQL)

Bases relacionais organizam dados estruturados em **tabelas** compostas por linhas e colunas.

### Elementos centrais

- **chave primária**: identifica cada registro de forma única;
- **chave estrangeira**: relaciona tabelas entre si;
- **esquema rígido**: a estrutura precisa ser definida previamente;
- **SQL**: linguagem usada para consulta e manipulação dos dados.

### Propriedades importantes

- modelo baseado em tabelas e relacionamentos;
- forte controle de integridade;
- suporte a consultas complexas;
- aderência a transações com propriedades **ACID**.

### ACID

- **Atomicidade**: a transação acontece por completo ou não acontece.
- **Consistência**: o banco preserva regras válidas de integridade.
- **Isolamento**: transações concorrentes não devem interferir indevidamente umas nas outras.
- **Durabilidade**: dados confirmados persistem mesmo após falhas.

### Quando SQL costuma ser mais adequado

- sistemas financeiros;
- RH;
- estoque;
- e-commerce transacional;
- cenários com estrutura estável e alta exigência de consistência.

## 🧩 3) Modelagem em bases relacionais

No modelo relacional, a organização dos dados costuma envolver:

- definição de tabelas;
- definição de chaves primárias e estrangeiras;
- eliminação de redundâncias;
- uso de normalização.

Esse modelo é especialmente útil quando a aplicação exige:

- consistência;
- integridade;
- rastreabilidade;
- operações transacionais confiáveis.

## 🌪️ 4) Bases de dados não relacionais (NoSQL)

Bases NoSQL foram projetadas para lidar melhor com cenários de:

- grandes volumes de dados;
- dados não estruturados ou semiestruturados;
- alta taxa de escrita;
- escalabilidade horizontal;
- mudanças frequentes de estrutura.

### Características principais

- estrutura mais flexível;
- esquema dinâmico ou menos rígido;
- distribuição entre vários nós de um cluster ou entre diferentes servidores;
- possibilidade de alta escalabilidade horizontal;
- diferentes modelos de dados conforme o problema.

### Modelos mais comuns

- **chave-valor**: rápido e simples para recuperação direta;
- **documentos**: organiza dados em documentos como JSON ou XML;
- **famílias de colunas**: útil para dados com atributos variáveis;
- **grafos**: adequado para relacionamentos complexos.

### Consistência e CAP

Em muitos sistemas distribuídos, NoSQL aparece associado à ideia de consistência eventual. De forma mais precisa:

- nem todo banco NoSQL funciona da mesma maneira;
- vários sistemas priorizam disponibilidade e escalabilidade;
- em ambientes distribuídos com particionamento de rede, surgem trade-offs entre **consistência** e **disponibilidade**.

Essa é a leitura prática do **Teorema CAP** no contexto de Big Data. Na formulação técnica mais comum, o termo usado é **tolerância a partições de rede**.

### Quando NoSQL costuma ser mais adequado

- redes sociais;
- logs e eventos;
- análise de registros;
- sistemas de recomendação;
- IoT;
- aplicações com dados variáveis e crescimento acelerado.

## ⚖️ 5) SQL x NoSQL

| Critério | SQL | NoSQL |
| --- | --- | --- |
| Estrutura | Tabelas com esquema fixo | Estrutura flexível |
| Tipo de dado mais comum | Estruturado | Semiestruturado e não estruturado |
| Escalabilidade típica | Mais comum em escala vertical, embora existam exceções | Forte foco em escala horizontal |
| Consistência | Forte em muitos cenários transacionais | Varia conforme o sistema e o caso de uso |
| Consultas complexas | Muito forte | Depende do modelo adotado |
| Mudança de esquema | Mais custosa | Geralmente mais simples |

## 🎯 6) Ideia central do módulo

Não existe tecnologia única para todo cenário de Big Data. A escolha entre SQL e NoSQL depende de:

- tipo de dado;
- volume e velocidade;
- necessidade de consistência;
- padrão de consulta;
- custo de crescimento;
- objetivo analítico ou operacional.

---

## ✅ Checklist rápido

- Sei explicar por que Big Data exige novas estratégias de armazenamento.
- Consigo diferenciar bancos SQL e NoSQL.
- Entendo os principais modelos NoSQL e os critérios básicos de escolha.

⬅️ [Voltar para o índice principal](../README.md)

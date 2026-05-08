# 📚 Módulo 19: Algoritmos de Machine Learning

> **Foco do módulo:** organizar os principais algoritmos por função, sem se perder em nomes soltos.

## 🧭 1) Como o livro organiza os algoritmos

O livro agrupa os algoritmos por **função**, o que facilita muito a escolha prática.

## 🗂️ 2) Famílias principais

| Família                         | Para que serve                              | Exemplos citados no livro                                  |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| Deep Learning                  | visão, texto, padrões complexos             | CNN, DBM, DBN, autocodificadores empilhados                |
| Ensemble                       | melhorar desempenho combinando modelos      | Random Forest, GBM, AdaBoost, Bagging, Stacking, GBRT      |
| Redes Neurais                  | classificação, regressão, padrões           | Perceptron, RBFN, backpropagation, Hopfield                |
| Regularização                  | reduzir overfitting e controlar complexidade| Ridge, LASSO, Elastic Net, LARS                            |
| Sistema de Regras              | previsões interpretáveis por regras         | Cubist, OneR, ZeroR, RIPPER                                |
| Regressão                      | prever valores numéricos ou probabilidades  | Linear, OLS, Stepwise, MARS, LOESS, Logística              |
| Bayesiano                      | classificação probabilística                | Naive Bayes, Gaussian NB, Multinomial NB, redes bayesianas |
| Árvore de Decisão              | classificação e regressão interpretáveis    | CART, ID3, C4.5, C5.0, CHAID, M5                           |
| Redução de Dimensionalidade    | simplificar variáveis e preservar estrutura | PCA, PLSR, MDS, PCR, LDA, QDA, RDA, FDA, MDA              |
| Baseado na Instância           | decidir por similaridade                    | kNN, LVQ, SOM, LWL                                         |
| Clusterização                  | agrupar dados semelhantes                   | k-means, k-medians, EM, agrupamento hierárquico            |

## 🎯 3) Critério rápido por objetivo

- **Quero prever um número:** regressão.
- **Quero classificar casos:** árvores, regressão logística, redes neurais, bayesianos.
- **Quero agrupar perfis:** clusterização.
- **Quero reduzir variáveis e ruído:** redução de dimensionalidade.
- **Quero melhorar desempenho geral:** ensemble.
- **Quero interpretabilidade alta:** árvores, regras ou regressões simples.

## ⚠️ 4) Pontos que mais aparecem

- **Ensemble** costuma melhorar desempenho, mas perde interpretabilidade.
- **Regularização** ajuda a evitar overfitting.
- **Árvores** são fáceis de interpretar, mas podem superajustar.
- **kNN** é simples, mas sofre com alta dimensionalidade.
- **PCA** é um dos nomes mais clássicos em redução de dimensionalidade.
- **k-means** é um dos algoritmos mais lembrados em clusterização.

## 🧠 5) Dica de estudo

Não é necessário decorar todos os detalhes de todos os algoritmos de uma vez. Primeiro, fixe:

- a **família**;
- o **objetivo**;
- 1 ou 2 **exemplos clássicos** de cada grupo.

---

## ✅ Checklist rápido

- Sei organizar algoritmos por família.
- Sei dizer para que serve ensemble, regressão, árvore, cluster e PCA.
- Sei citar exemplos clássicos de algoritmos por função.
- Sei relacionar objetivo do problema com família de algoritmo.

⬅️ [Voltar para o índice principal](../README.md)

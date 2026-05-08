# 📚 Módulo 20: Avaliação de Modelos e Ferramentas

> **Foco do módulo:** saber como escolher, avaliar e implementar modelos de machine learning com as ferramentas mais importantes.

## 🧭 1) Como escolher o algoritmo correto

A escolha do algoritmo depende de:

- problema que será resolvido;
- tipo e qualidade dos dados;
- objetivo da análise;
- necessidade de interpretabilidade;
- desempenho esperado;
- experimentação prática.

Não existe algoritmo universalmente melhor.

## 📏 2) Métricas principais de classificação

### Precisão

Mede quantas previsões positivas do modelo estavam certas.

`Precisão = TP / (TP + FP)`

Uso típico: quando falsos positivos custam caro.

### Recall

Mede quantos casos positivos reais o modelo conseguiu encontrar.

`Recall = TP / (TP + FN)`

Uso típico: quando falsos negativos custam caro.

### F1-score

É o equilíbrio entre precisão e recall.

`F1 = 2 * (Precisão * Recall) / (Precisão + Recall)`

Uso típico: quando queremos uma visão balanceada do desempenho.

### Matriz de confusão

Organiza:

- **TP:** verdadeiro positivo;
- **TN:** verdadeiro negativo;
- **FP:** falso positivo;
- **FN:** falso negativo.

Ela mostra onde o modelo está errando.

## 🔁 3) Validação cruzada

A **cross-validation** estima melhor a capacidade de generalização do modelo.

No caso mais comum, o **k-fold**:

1. divide os dados em `k` partes;
2. treina o modelo `k` vezes;
3. em cada rodada, usa uma parte para teste e as demais para treino;
4. combina os resultados ao final.

Isso reduz a dependência de uma única divisão treino/teste.

## 🧰 4) Ferramentas principais de machine learning

### Bibliotecas e frameworks

- **scikit-learn:** referência para machine learning clássico em Python.
- **TensorFlow:** plataforma completa para ML e deep learning.
- **PyTorch:** muito forte em deep learning e pesquisa aplicada.
- **Caffe:** framework de deep learning citado no livro, especialmente ligado a visão computacional.

### Plataformas educacionais ou de interface pronta

- **Weka:** ambiente de aprendizado de máquina com foco didático e mineração de dados.

### Plataformas em nuvem e escala

- **Microsoft Azure Machine Learning:** desenvolvimento, treino e deploy na nuvem.
- **Google Cloud AI:** integração com serviços Google e suporte a AutoML.
- **Amazon SageMaker:** ambiente gerenciado com treino distribuído e automação.
- **H2O.ai:** plataforma escalável com AutoML e suporte a vários algoritmos.

## 🎯 5) Leitura prática das ferramentas

- Se você quer **começar em Python**, pense primeiro em `scikit-learn`.
- Se o foco é **deep learning**, `TensorFlow` e `PyTorch` são centrais.
- Se o foco é **produção em nuvem**, Azure, Google Cloud AI e SageMaker entram com força.
- Se o foco é **aprendizado guiado ou interface pronta**, Weka e H2O ajudam bastante.

## 📚 6) Referências-chave do livro

- Mitchell (1997)
- Bishop (2006)
- Grus (2016)
- Pierson (2019)

---

## ✅ Checklist rápido

- Sei explicar precisão, recall, F1 e matriz de confusão.
- Sei dizer quando cross-validation é útil.
- Sei diferenciar bibliotecas locais de plataformas em nuvem.
- Sei apontar as ferramentas mais importantes para ML clássico e deep learning.

⬅️ [Voltar para o índice principal](../README.md)

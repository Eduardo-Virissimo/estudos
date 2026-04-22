# 📚 Módulo 12: Testes de Hipóteses na Prática

> **Foco do módulo:** aprender a lógica dos testes e escolher o teste certo conforme tipo de dado e amostra.

## 🧪 1) Estrutura do teste de hipótese

- **H0 (hipótese nula):** cenário base (sem efeito/diferença relevante).
- **H1 (hipótese alternativa):** cenário que queremos investigar.
- **Nível de significância (α):** tolerância de erro (comum: 0,05).
- **Valor p:** evidência contra H0.

Observação útil: em muitos problemas, H0 representa a negação do efeito que se deseja comprovar.

Regra prática:

- Se valor p < α, rejeita H0.
- Se valor p >= α, não há evidência suficiente para rejeitar H0.

Exemplos simples:

- Se α = 0,05 e valor p = 0,03, rejeitamos H0.
- Se α = 0,05 e valor p = 0,12, não rejeitamos H0.

Também é possível decidir por comparação com valor crítico, conforme o teste escolhido.

Exemplo simples por valor crítico:

- Em um teste z bilateral com α = 0,05, o valor crítico é aproximadamente ±1,96.
- Se z calculado = 2,10, rejeitamos H0 (pois 2,10 > 1,96).

## 🧭 2) Escolha do teste (resumo direto)

| Teste                                | Quando usar                                      |
| ------------------------------------ | ------------------------------------------------ |
| t de Student                         | comparar médias de 2 grupos independentes        |
| ANOVA                                | comparar médias de 3 ou mais grupos              |
| Qui-quadrado                         | associação entre variáveis categóricas           |
| Mann-Whitney / Wilcoxon              | comparação sem suposição de normalidade          |
| Shapiro-Wilk / Kolmogorov-Smirnov    | verificar normalidade                            |
| Fisher                               | associação em tabelas pequenas/categóricas       |
| Teste de proporção                   | comparar proporções                              |
| Teste de homogeneidade de variâncias | verificar igualdade de variâncias                |
| Testes de correlação                 | medir força e direção da relação entre variáveis |
| Teste de hipótese em regressão       | avaliar se coeficientes são significativos       |

## 🧭 2.1) Critério rápido de escolha

- **Dados categóricos:** Qui-quadrado, Fisher, proporção.
- **Comparação de médias:** t de Student (2 grupos) ou ANOVA (3+ grupos).
- **Sem normalidade:** Mann-Whitney/Wilcoxon.
- **Modelos explicativos:** testes de regressão.
- **Antes de escolher:** valide normalidade e variâncias.

## 👥 3) Tipos de amostra que mais caem

- **Independentes:** grupos sem relação direta.
- **Pareadas:** antes/depois ou pares do mesmo indivíduo.
- **Categóricas:** frequências em categorias.
- **Regressão:** variável dependente explicada por independentes.

## ⚠️ 4) Erro comum em prova

Escolher teste sem checar tipo de variável, normalidade e estrutura da amostra.

---

## ✅ Checklist rápido

- Sei definir H0, H1, α e valor p.
- Sei aplicar a regra de decisão do valor p.
- Sei escolher um teste apropriado em cenários básicos.

⬅️ [Voltar para o índice principal](../README.md)

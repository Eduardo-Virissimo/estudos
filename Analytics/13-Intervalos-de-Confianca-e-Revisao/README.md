# 📚 Módulo 13: Intervalos de Confiança e Revisão Final da Trilha

> **Foco do módulo:** fechar a trilha com inferência aplicada e revisão final para prova.

## 📏 1) O que é intervalo de confiança

É uma faixa de valores plausíveis para um parâmetro populacional (como média ou proporção), com um nível de confiança definido (90%, 95%, 99%).

## 🧠 2) Interpretação correta

Um intervalo de confiança de 95% significa que, em repetições do processo amostral, cerca de 95% dos intervalos conteriam o verdadeiro parâmetro.

## 🧮 3) Fórmula clássica para média (amostras grandes)

Intervalo de Confiança = X̄ ± (Z \* σ / √n)

Onde:

- X̄ = média amostral
- Z = valor crítico do nível de confiança
- σ = desvio padrão
- n = tamanho da amostra

Exemplo simples:

Se X̄ = 170, Z = 1,96, σ = 5 e n = 100:

IC = 170 ± (1,96 \* 5 / √100) = 170 ± 0,98

Logo, o intervalo aproximado é [169,02; 170,98].

## ⚖️ 4) Nível de confiança x largura do intervalo

- **90%:** intervalo mais estreito, menor confiança.
- **95%:** equilíbrio mais usado na prática.
- **99%:** maior confiança, intervalo mais largo.

## 🧰 4.1) Métodos comuns por parâmetro

| Parâmetro                 | Método comum                       | Condição principal                           |
| ------------------------- | ---------------------------------- | -------------------------------------------- |
| Média                     | IC para média (normal/t)           | amostra adequada e suposição de distribuição |
| Proporção                 | IC para proporção                  | amostra suficientemente grande               |
| Coeficientes de regressão | IC na regressão                    | suposições do modelo (ex.: resíduos)         |
| Percentis/mediana         | IC não paramétrico ou reamostragem | quando a distribuição não é bem comportada   |

## 🔍 5) Como escolher o nível de confiança

- Importância da precisão desejada.
- Tamanho da amostra disponível.
- Risco aceitável no contexto (negócio, saúde, pesquisa).

## ⚠️ 5.1) Cuidado de prova

Antes de escolher a fórmula, confirme:

- qual parâmetro será estimado (média, proporção, etc.);
- tamanho da amostra;
- suposições sobre distribuição e variância.

## 🔗 6) Conexão final: teste de hipótese + intervalo

- Teste de hipótese responde: há evidência de efeito/diferença?
- Intervalo de confiança responde: qual faixa plausível do efeito?

## 📝 7) Revisão final em 20 minutos

1. **5 min:** módulos 08 e 09 (base conceitual).
2. **5 min:** módulo 10 (métricas e interpretação).
3. **5 min:** módulos 11 e 12 (probabilidade e testes).
4. **5 min:** este módulo (intervalos + visão integrada).

## 📚 8) Referências-chave do livro 2

- Barbetta (2007)
- Moore (2011)

---

## ✅ Checklist final de Estatística

- Sei diferenciar estatística descritiva e inferencial.
- Sei interpretar medidas de centro e dispersão.
- Sei aplicar a lógica de teste de hipóteses e intervalo de confiança.
- Sei escolher o tipo de intervalo de confiança conforme parâmetro e contexto.

⬅️ [Voltar para o índice principal](../README.md)

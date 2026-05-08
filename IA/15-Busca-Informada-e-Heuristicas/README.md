# 📚 Módulo 15: Busca Informada e Heurísticas

> **Foco do módulo:** entender como a heurística orienta a busca e torna a exploração mais eficiente.

## 🧠 1) O que é busca informada

Busca informada usa conhecimento adicional do domínio para orientar a exploração.

Esse conhecimento aparece em uma **função heurística**, que estima o custo ou a qualidade de um estado.

## 🧭 2) Diferença em relação à busca não informada

| Tipo de busca     | Base da exploração                  |
| ----------------- | ----------------------------------- |
| Não informada     | explora sem orientação extra        |
| Informada         | usa heurística para priorizar nós   |

Na prática, a busca informada tende a ser mais eficiente quando a heurística é boa.

## 📏 3) O que é heurística

Heurística é uma estimativa de quão promissor é um caminho ou quão distante um estado está do objetivo.

Ela ajuda o sistema a:

- evitar caminhos pouco úteis;
- priorizar alternativas mais promissoras;
- reduzir esforço computacional.

## ✅ 4) Busca Gulosa

A Busca Gulosa escolhe, a cada passo, o nó que parece mais promissor segundo a heurística.

### Características

- prioriza a menor estimativa heurística;
- tende a ser rápida;
- não considera bem o custo total já percorrido.

### Aplicações comuns

- navegação em mapas;
- otimização;
- quebra-cabeças;
- recomendação de conteúdo;
- otimização de consultas.

### Limitação principal

- pode encontrar uma solução, mas não necessariamente a melhor.

## 🎯 5) Heurística admissível

Uma heurística admissível não superestima o custo real até o objetivo.

Essa ideia é importante porque afeta a qualidade e as garantias do algoritmo de busca.

## 📌 6) Ideia central do módulo

Heurística boa não resolve o problema sozinha, mas pode transformar uma busca inviável em uma busca prática.

---

## ✅ Checklist rápido

- Sei definir busca informada.
- Sei explicar o papel da função heurística.
- Sei resumir como funciona a busca gulosa.
- Sei dizer por que heurística admissível é importante.

⬅️ [Voltar para o índice principal](../README.md)

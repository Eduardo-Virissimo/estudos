---
nivel: escrito
foco: importante
projeto:
revisado:
---

# [NOME DO TÓPICO]

%%
COMO ESCREVER ESTA NOTA (este bloco some no modo leitura; apague quando terminar)

Esta nota é um CAPÍTULO, não uma ficha. Ela se lê de cima a baixo, como um bom livro ou artigo.
Exemplo pronto pra copiar o tom: [[Bash]].

- Comece por um problema ou cena real ("toda sexta você faz X... na terceira semana, erra"). Nada de "X é...".
  Diga já no começo por que vale aprender isso, e cite a nota pré-requisito no meio do texto, se houver.
- Títulos (##) contam a história e só aparecem quando o assunto muda de verdade. Sem emoji, sem selo.
  Bom: "Variáveis, e o espaço que apaga o arquivo errado". Ruim: "🔴 Variáveis".
- Prioridade vai no TEXTO: "isto é o mais importante da nota", "se esquecer tudo, lembre disto", "curiosidade, pode pular".
- O porquê antes do como. Analogia quando ajudar. Código no meio da conversa, sempre comentado em volta.
- O erro comum entra na história, no momento em que você cometeria ("aí você roda e aparece Permission denied. Calma...").
  Caixa ([!warning]) só pra coisa perigosa de verdade (perder dados, apagar arquivo).
- Escreva como quem conversa com um amigo: frases curtas, segunda pessoa, sem lista onde caberia um parágrafo.
- Use exemplos que voltam: um caso do começo que a nota vai resolvendo aos poucos.
- Feche com "O essencial" (3 a 5 itens) e "Agora é com você" (desafio e, se fizer sentido, um projeto, em texto corrido).
- Logo abaixo do título, uma linha "Quanto focar": 🔥 essencial / 📌 importante / 💤 bom saber (o mesmo do Roadmap
  e do `foco:` no topo), com 1-2 frases dizendo por quê e até onde ir ("domine", "pratique uma vez", "conheça a ideia").
- Logo abaixo do "Quanto focar", a linha "⏱️ Quanto tempo", com o TOTAL dentro do negrito (destacado como o "Quanto focar")
  e as partes logo depois: leitura, exercícios (se tiver), Me teste e o desafio até o "Você terminou quando".
  Leitura: umas 150 palavras por minuto, mais um pouco por linha de código. Me teste: 1 min por pergunta.
  Desafio de vários dias: "**⏱️ Quanto tempo: cerca de X no primeiro dia, depois N dias de uns Y min.** No primeiro dia: ...".
  Se o desafio termina com um projeto maior, avise: "O projeto maior do fim do desafio fica fora dessa conta."
- Logo abaixo, a linha "🔁 Pra rever", pra quem já estudou: Me teste (1 min por pergunta) + "O essencial" (2 min) + reler
  ~1/4 da leitura onde errar (+ ~1/3 dos exercícios, se tiver). Arredonde pra 5 min. Fica entre 10 e 25 min.
- Depois do "Quanto tempo", uma linha "Onde praticar": 🏋️ exercícios (se tiver) · 🧪 o desafio de "Agora é com você"
  · 🧩 o projeto de estágio que usa o tópico (veja "Tópicos que entram aqui" nas notas de Ideias de Projetos; o mesmo vai
  em `projeto:` no topo; apague o campo se nenhum usar). No Roadmap, ponha os mesmos ícones depois do 🔥📌💤.
- Fixo em toda nota: o 🧠 Me teste (a Ficha do herói lê as perguntas de lá). O resto é opcional.
%%

**Quanto focar: 📌 importante.** [Por que esse nível, e até onde ir.]

**⏱️ Quanto tempo: cerca de [total].** Uns [X] min de leitura, [Y] min no Me teste e [Z] min no desafio.

**🔁 Pra rever: cerca de [N] min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Projeto do estágio]], projeto do Estágio N.

[Abertura: a cena ou o problema. Por que isso importa. Uma ideia-chave que a pessoa leva da nota.]

## [Título que conta o primeiro passo]

[Texto explicando, com exemplo comentado.]

```[linguagem]
// o exemplo mais simples que mostra a ideia
```

## [Título que conta o próximo passo]

[Texto.]

## O essencial

Se for guardar só [N] coisas desta nota:

1. [ideia]
2. [ideia]
3. [ideia]

## Agora é com você

[Um desafio de 20-40 min, em texto corrido: o que fazer, o que vai precisar usar, como saber que terminou.
Se fizer sentido, um projeto maior que você usaria de verdade.
Diga onde fazer: 📁 `Programação/Práticas/[NOME]/` no vault · 🧪 `~/lab/nome` · 📦 repo próprio.
Termine apontando os próximos passos: [[próxima nota]].]

---

## 🧠 Me teste

%% Perguntas abertas na maioria (tirar da cabeça fixa mais). 1 ou 2 de múltipla escolha nas pegadinhas: erradas que você cometeria de verdade, letra certa variando, e a letra certa no começo da resposta (é assim que a Ficha corrige). %%

> [!question]- [Pergunta aberta: "qual a diferença entre X e Y?"]
> [Resposta]

> [!question]- [Pergunta aberta: "deu o erro Z. O que checar?"]
> [Resposta]

> [!question]+ [Pergunta de múltipla escolha sobre a pegadinha]
> - a) [erro comum]
> - b) [certa]
> - c) [outra confusão comum]
> - d) [outra confusão comum]
>
> > [!check]- Resposta
> > **b)** [por que a b) está certa e por que a confusão mais comum está errada]

---

## Pra consultar depois

%% Opcional. Tabela só em notas de comando ou sintaxe, onde você volta pra consultar.
Leituras: 2 a 4, em texto, dizendo POR QUE vale. Só link que foi aberto e conferido. %%

| Sintaxe | O que faz |
|---|---|
| `exemplo` | |

**Pra ler:** [Recurso, e por que vale.]

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

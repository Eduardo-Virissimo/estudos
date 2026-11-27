---
nivel: escrito
foco: essencial
revisado:
---

# Nomes e Comentários

**Quanto focar: 🔥 essencial.** Você vai ler código muito mais do que escrever. Nome bom é a forma mais barata de código bom, e reviewer repara.

**⏱️ Quanto tempo: cerca de 45 min.** Uns 20 min de leitura, 5 min no Me teste e 20 min no desafio.

**🔁 Pra rever: cerca de 15 min.** Se você já estudou, faça o Me teste primeiro, releia "O essencial" e volte no texto só onde errar.

**Onde praticar:** 🧪 o desafio de "Agora é com você".

Você abre um código que escreveu há três meses e dá de cara com isto:

```ts
const d = 7;
const l = u.filter((x) => x.a);
```

O que é `d`? Sete o quê? E `l`, `u`, `x.a`? Você escreveu isso, você sabia na hora o que era, e agora precisa ler o arquivo inteiro pra lembrar. Agora compare com esta versão, que faz exatamente a mesma coisa:

```ts
const diasAteRevisao = 7;
const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo);
```

A linha se explica sozinha. Nenhum comentário, nenhum documento externo: só nomes.

Existe uma verdade sobre código que muda o jeito de escrever quando você aceita ela: **código é lido muitas vezes mais do que é escrito.** Por você daqui a três meses, por um colega, por quem vai revisar seu pull request. Um **nome bom** diz o que a coisa é ou faz sem precisar abrir. E um **comentário** serve pro que o código não consegue dizer sozinho: o **porquê** de uma decisão, nunca o **o quê**, porque isso o código já mostra. Nomear bem é metade de escrever código limpo.

## Nomes que contam o que são

Algumas regras resolvem quase todos os casos, e todas têm o mesmo objetivo: fazer o nome responder a pergunta antes de alguém precisar fazer ela.

**Variável é substantivo, função é verbo.** `tarefa`, `precoTotal` são coisas; `salvarTarefa()`, `calcularPreco()` são ações. Só de olhar você sabe se está diante de um valor ou de algo que faz alguma coisa.

**Booleano é uma pergunta de sim ou não**: `estaAtivo`, `temPermissao`, `podeEditar`. Assim o `if` fica natural de ler: `if (podeEditar)`. Já um `if (status)` deixa a dúvida: status de quê? É texto? Número?

**Lista no plural, item no singular**: `for (const tarefa of tarefas)`. Lê-se sozinho.

**A unidade vai no nome**, quando houver uma: `tempoMs`, `pesoKg`, `precoCentavos`. Isso mata de vez a dúvida "isso está em segundos ou em milissegundos?", que já causou bug em muito sistema.

**O tamanho do nome acompanha o alcance.** Um `i` num laço de três linhas é perfeito: todo mundo sabe o que é, e ele morre ali. Uma variável usada no arquivo inteiro precisa de um nome completo.

**Nada de abreviação inventada.** `qtdUsrAtv` economiza letras e custa tempo de quem lê. Escreva `quantidadeUsuariosAtivos`; o editor autocompleta pra você.

**Um nome por conceito.** Se você usa `buscar` num lugar, `pegar` em outro e `obter` num terceiro, pra mesma ideia, quem lê vai achar que são três coisas diferentes.

E fuja dos nomes genéricos: `data`, `info`, `valor`, `temp`, `manager`, `handler`. Eles não dizem nada. Pergunte "dados **de quê**?", e use a resposta como nome.

Agora, o pior tipo de nome: **o nome que mente.** Imagine uma função `getUsuario()` que, além de buscar o usuário, também salva alguma coisa no banco. Quem lê o nome nunca imagina esse efeito escondido, e um dia chama a função "só pra ler" e altera dados sem querer. O nome tem que dizer **tudo** o que a função faz. E se, pra dizer tudo, o nome ficar comprido e cheio de "e" no meio, o problema não é o nome: a função está fazendo coisa demais.

## O jeito da comunidade

Cada linguagem tem o seu estilo de escrever nomes. Seguir o estilo da comunidade faz o seu código parecer "normal" pra qualquer pessoa que leia, e em TypeScript ele é assim:

| O quê | Estilo | Exemplo |
|---|---|---|
| variáveis e funções | `camelCase` | `totalXp`, `calcularMedia()` |
| tipos, interfaces, classes | `PascalCase` | `Tarefa`, `UsuarioAdmin` |
| constantes fixas de configuração | `UPPER_SNAKE_CASE` | `MAX_TENTATIVAS` |
| arquivos | `kebab-case` ou `camelCase` (escolha um e mantenha) | `tarefa-repo.ts` |

O `camelCase` começa minúsculo e cada palavra nova começa com maiúscula, como as corcovas de um camelo. O `PascalCase` começa já maiúsculo. A vantagem prática é que só de bater o olho você sabe que `Tarefa` é um tipo e `tarefa` é uma variável.

Sobre português ou inglês: escolha um e seja consistente. Em projetos públicos e no mercado, inglês é o padrão. Neste vault, português ajuda a aprender. O que não dá é misturar sem regra, tipo `getTarefas` e `salvarUser` no mesmo arquivo.

## Comentário bom explica o porquê

O erro mais comum com comentários é usar eles pra repetir o código:

```ts
// ❌ repete o código: não ajuda em nada
// soma 1 no contador
contador++;
```

Qualquer pessoa que sabe ler código já viu que isso soma 1. O comentário não acrescentou nada, só ocupou espaço. O comentário útil explica justamente o que o código **não consegue** dizer: uma decisão, um motivo, um perigo.

```ts
// ✅ explica uma decisão que o código não mostra
// A API do banco limita 100 itens por página; acima disso ela ignora o resto.
const TAMANHO_PAGINA = 100;

// ✅ avisa de uma armadilha
// Não trocar por toISOString(): ele converte pra UTC e muda o dia depois das 21h no Brasil.
const hoje = dataLocal(new Date());
```

O segundo exemplo é ouro: ele impede que alguém, daqui a seis meses, "simplifique" o código e crie um bug que só aparece de noite.

E muitas vezes, o melhor comentário é aquele que **vira código**. Olhe esta função:

```ts
// ❌ o comentário explica um código obscuro
// verifica se o usuário pode receber bônus (ativo e mais de 30 dias)
function check(u: any) {
  return u.s === 1 && (Date.now() - u.c) / 86400000 > 30;
}
```

O comentário está tentando compensar nomes ruins. Com nomes bons, ele simplesmente deixa de ser necessário:

```ts
// ✅ o comentário virou código
const UM_DIA_MS = 86_400_000;
const DIAS_MINIMOS_PARA_BONUS = 30;

function diasDesde(data: number): number {
  return (Date.now() - data) / UM_DIA_MS;
}

function podeReceberBonus(usuario: Usuario): boolean {
  return usuario.ativo && diasDesde(usuario.criadoEm) > DIAS_MINIMOS_PARA_BONUS;
}
```

Existe ainda um motivo mais sutil pra preferir menos comentários. O código muda, e o comentário fica pra trás. A partir desse momento, ele **mente**: diz uma coisa enquanto o código faz outra. E comentário mentiroso é pior que nenhum comentário. Menos comentário é menos coisa pra mentir.

## Números mágicos, documentação e lixo

Repare no `86400000` do exemplo anterior. Um número solto no código, sem explicação, tem nome: **número mágico**. Funciona "por mágica", e ninguém sabe por quê.

```ts
// ❌ o que é 86400000?
if (agora - ultimoAcesso > 86400000) { }

// ✅
const UM_DIA_MS = 24 * 60 * 60 * 1000;
if (agora - ultimoAcesso > UM_DIA_MS) { }
```

Dar nome ao número explica o que ele é, e de bônus deixa um lugar só pra mudar, se um dia precisar.

Existe um tipo de comentário que vale a pena escrever: o de **documentação**, em funções que outras partes do código usam. Um comentário `/** */` em cima da função aparece no autocomplete do [[VS Code]] pra quem for chamar ela:

```ts
/**
 * Calcula o próximo intervalo de revisão.
 * @param acertou se a pessoa lembrou da resposta
 * @returns dias até a próxima revisão
 */
export function proximoIntervalo(atual: number, acertou: boolean): number { /* ... */ }
```

E por fim, uma regra simples: **código comentado é código apagado.** Não deixe blocos de código comentados "pra caso precise depois". Eles poluem o arquivo, e ninguém sabe se ainda valem ou por que estão ali. O [[Git Básico|Git]] guarda todo o histórico: se precisar, você recupera de lá.

## O essencial

1. Variável é substantivo, função é verbo, booleano é pergunta (`estaAtivo`).
2. O nome diz tudo o que a coisa faz. Se precisar de "e", a função faz coisa demais.
3. `camelCase` pra variáveis e funções, `PascalCase` pra tipos, `UPPER_SNAKE_CASE` pra constantes.
4. Comentário explica o porquê, nunca o quê. Muitas vezes, um nome melhor substitui o comentário.
5. Número solto vira constante com nome. Código comentado vai embora.

## Agora é com você

Pegue esta função e reescreva **só os nomes** (e extraia constantes, se fizer sentido), sem mudar a lógica:

```ts
function f(a: number[], b: number) {
  let r = 0;
  for (const x of a) if (x > b) r++;
  return r / a.length * 100;
}
```

Escreva no máximo um comentário, e só se for um "porquê". Depois mostre só a assinatura da função pra alguém (ou pra uma IA) e peça pra dizer o que ela faz. Você terminou quando der pra entender a função lendo só a assinatura, algo como `porcentagemAcimaDe(notas, notaMinima)`.

Daqui, siga pra [[Nomeação]], [[Legibilidade]] e [[Clean Code]].

---

## 🧠 Me teste

> [!question]- Qual convenção de nome usar pra variáveis, tipos e constantes em TypeScript?
> `camelCase` pra variáveis e funções, `PascalCase` pra tipos/classes/interfaces, `UPPER_SNAKE_CASE` pra constantes de configuração.

> [!question]- Como nomear um booleano?
> Como uma pergunta de sim/não: `estaAtivo`, `temPermissao`, `podeEditar`.

> [!question]- Quando um comentário é útil?
> Quando explica o porquê de uma decisão ou avisa de uma armadilha, coisas que o código não consegue mostrar.

> [!question]- Por que um comentário desatualizado é pior que nenhum?
> Porque ele mente: diz uma coisa enquanto o código faz outra.

> [!question]- O que é um número mágico e como resolver?
> Um número solto no código sem explicação (`86400000`). Resolve dando nome numa constante (`UM_DIA_MS`).

> [!question]- Por que não deixar código comentado no arquivo?
> Polui, confunde e envelhece. O Git guarda o histórico se precisar voltar.

> [!question]+ Qual o melhor nome pra um booleano que diz se a tarefa terminou?
> - a) `status`
> - b) `concluida` ou `estaConcluida`
> - c) `flag`
> - d) `checkConcluida`
>
> > [!check]- Resposta
> > **b)** Booleano se lê como pergunta de sim/não (`if (estaConcluida)`). `status` parece texto, `flag` não diz nada e `check...` parece função.

---

## Pra consultar depois

| Coisa | Nome bom |
|---|---|
| Variável | Substantivo: `tarefaAtual` |
| Função | Verbo: `salvarTarefa()` |
| Booleano | Pergunta: `estaConcluida` |
| Lista | Plural: `tarefas` |
| Unidade | `tempoMs`, `precoCentavos` |
| Constante | `MAX_TENTATIVAS` |
| Comentário | `// por quê: ...` |

**Pra ler:** *Clean Code*, de Robert C. Martin, tem dois capítulos que valem o livro: o 2, sobre nomes, e o 4, sobre comentários. E o [guia de estilo de TypeScript do Google](https://google.github.io/styleguide/tsguide.html#naming) mostra, na parte de nomes, como uma empresa grande padroniza tudo isso.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

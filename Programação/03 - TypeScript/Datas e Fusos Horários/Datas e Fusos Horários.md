---
nivel: escrito
revisado:
---

# Datas e Fusos Horários

Seu diário de estudos registra a data de cada sessão. Tudo funciona perfeitamente durante o dia. Mas um dia você estuda até tarde, termina às 22h, e o diário grava a sessão como sendo do dia **seguinte**. Você confere o código, e a linha parece inocente: `new Date().toISOString().slice(0, 10)`. Não tem erro nenhum. Só que o resultado está errado, e só nas últimas três horas de cada dia.

Datas parecem simples até o primeiro bug de fuso. E a ideia que resolve quase todos eles é esta: **um instante no tempo é um só, no mundo inteiro.** O que muda é como cada lugar **mostra** esse instante. Quando são 14h30 em Brasília, são 17h30 em Londres, e é exatamente o mesmo momento.

Daí sai a regra de ouro desta nota: **guarde e calcule em UTC** (no formato ISO, como `2026-11-15T14:30:00Z`), e **converta pro fuso de quem vai ler só na hora de mostrar.** E fique de olho nas armadilhas famosas do `Date` do JavaScript: o mês que começa em 0, e o `toISOString()` que muda o dia depois das 21h no Brasil, o bug do diário. Ajuda ter passado por [[Objetos e Arrays no JavaScript]] e [[Variáveis e Tipos de Dados]].

## Um Date é só um número

Por dentro, um `Date` guarda **um número só**: quantos milissegundos se passaram desde 1º de janeiro de 1970, à meia-noite, em UTC. Esse número se chama *timestamp*.

```ts
const agora = new Date();
agora.getTime();     // 1794763800000 (o número)
Date.now();          // o mesmo número, sem criar um objeto
agora.toISOString(); // "2026-11-15T17:30:00.000Z"
```

Repare numa coisa importante: o `Date` **não sabe** em que fuso está. Ele é só um número. O fuso só entra na história quando você pede pra **mostrar** a data. Pense num jogo de futebol transmitido ao vivo pro mundo todo. O gol acontece num instante só, mas no Brasil o relógio marcava 14h30, e em Lisboa, 17h30. O instante é um; os relógios é que mostram diferente.

O **UTC** é o relógio de referência do mundo: sem fuso, sem horário de verão. E o `Z` no fim de `17:30:00Z` quer dizer exatamente isso: "este horário está em UTC".

Como no fundo é tudo um número, comparar e calcular datas é só fazer conta:

```ts
const inicio = new Date("2026-11-15T10:00:00Z");
const fim = new Date("2026-11-15T12:30:00Z");

fim > inicio;                                                // true
const minutos = (fim.getTime() - inicio.getTime()) / 60_000; // 150

const UM_DIA_MS = 24 * 60 * 60 * 1000;
const amanha = new Date(inicio.getTime() + UM_DIA_MS);
```

Só não compare com `===`. `inicio === new Date(inicio)` dá `false`, mesmo sendo o mesmo instante, porque são **dois objetos diferentes** (lembra das referências de [[Objetos e Arrays no JavaScript]]?). Pra saber se duas datas são o mesmo instante, compare os números: `a.getTime() === b.getTime()`.

## Guarde em ISO, mostre no fuso de quem lê

Pra escrever uma data como texto, existe um formato padrão, o **ISO 8601**:

```text
2026-11-15                    só a data
2026-11-15T14:30:00Z          um instante em UTC
2026-11-15T14:30:00-03:00     o mesmo tipo de instante, dito no horário de Brasília (= 17:30Z)
```

Ele tem três virtudes: ordena certo como texto (a ordem alfabética é a ordem cronológica), todo banco de dados e toda linguagem entendem, e não é ambíguo. **É ele que vai pro JSON e pro banco.**

Na hora de **mostrar** pra uma pessoa, aí sim você converte pro fuso e pro idioma dela, com o `Intl.DateTimeFormat`:

```ts
const data = new Date("2026-11-15T17:30:00Z");

new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
}).format(data);
// "15 de novembro de 2026 às 14:30"

data.toLocaleDateString("pt-BR"); // "15/11/2026" (atalho, usa o fuso do computador)
```

E pra frases como "há 2 dias" ou "em 3 horas", existe o `Intl.RelativeTimeFormat`:

```ts
const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
rtf.format(-1, "day");  // "ontem"
rtf.format(3, "hour");  // "em 3 horas"
```

O fluxo completo, juntando tudo: a data **entra** em ISO com fuso, o **cálculo** é feito em milissegundos, e só a **saída** é "humana".

```ts
function descrever(dataISO: string, agora = new Date()): string {
  const dias = Math.ceil((new Date(dataISO).getTime() - agora.getTime()) / 86_400_000);
  return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(dias, "day");
}
descrever("2026-11-18T12:00:00-03:00"); // "em 3 dias" (se hoje for 15)
```

Duas tentações pra evitar. A primeira é **guardar a data já formatada**, como `"15/11/2026"`. Parece prático, mas não ordena (como texto, "05/12" vem antes de "15/11"), não dá pra calcular nada, e é ambíguo: `05/11/2026` é 5 de novembro no Brasil e 11 de maio nos Estados Unidos. A segunda é **montar a data na mão**, com `d.getDate() + "/" + d.getMonth()`. Além de feio, erra o mês, por causa da primeira armadilha, logo abaixo.

## As três armadilhas do Date

O `Date` foi criado às pressas em 1995, copiando uma biblioteca do Java que já tinha problemas, e carrega essas decisões até hoje. Três delas pegam todo mundo.

**A primeira: o mês começa em zero.**

```ts
new Date(2026, 10, 15); // 15 de NOVEMBRO, não de outubro
new Date().getMonth();  // em novembro, devolve 10
```

Janeiro é 0, dezembro é 11. E só o mês: o dia começa em 1, normalmente. É uma inconsistência que todo mundo erra pelo menos uma vez, e não tem truque: é decorar.

**A segunda: o "hoje" do `toISOString` muda de dia à noite.** Este é o bug do diário:

```ts
// Às 22h do dia 15 no Brasil, em UTC já é 1h do dia 16:
new Date().toISOString().slice(0, 10); // "2026-11-16" 😱
```

O `toISOString` sempre mostra o instante em UTC, que está 3 horas à frente do Brasil. Então, entre 21h e meia-noite, ele já está no dia seguinte. Pra pegar o "hoje" no horário local, monte a data com as peças locais:

```ts
function hojeLocal(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// atalho: new Intl.DateTimeFormat("sv-SE").format(d) → "2026-11-15" (o sueco usa o formato ISO)
```

(Repare no `getMonth() + 1`: é a primeira armadilha aparecendo de novo.)

**A terceira: texto sem fuso é ambíguo.**

```ts
new Date("2026-11-15T14:30:00Z");      // ✅ exato, em UTC
new Date("2026-11-15T14:30:00-03:00"); // ✅ exato, com fuso
new Date("2026-11-15");                // meia-noite UTC = 21h do dia 14 no Brasil 😱
new Date("2026-11-15T10:00");          // sem Z: horário LOCAL do computador
```

Olhe a inconsistência: uma data sozinha é tratada como UTC, mas data e hora sem o `Z` é tratada como horário local. Ninguém consegue lembrar disso de cabeça, então a solução é não depender: **sempre escreva o fuso**, com `Z` ou `-03:00`.

## Quando chamar ajuda

Pra cálculos sérios, como somar meses, criar recorrências ou lidar com fusos de vários lugares, use uma biblioteca: **date-fns** ou **Luxon**. Um exemplo de por que vale: em lugares com horário de verão, somar 24 horas **não é** o mesmo que somar um dia, porque no dia da mudança o dia tem 23 ou 25 horas.

E o futuro nativo do JavaScript é a API **`Temporal`**, criada justamente pra corrigir os problemas do `Date`. Confira se a sua versão do Node já tem, antes de usar.

## O essencial

1. Um `Date` é só um número (milissegundos desde 1970 em UTC). O fuso só existe na hora de mostrar.
2. Guarde e calcule em UTC, no formato ISO. Mostre com `Intl.DateTimeFormat`, no fuso de quem lê.
3. O mês começa em 0.
4. `toISOString()` dá o dia em UTC: depois das 21h no Brasil, já é amanhã.
5. Sempre escreva o fuso nas datas em texto (`Z` ou `-03:00`).

## Agora é com você

Faça uma **calculadora de prazos** no terminal. Ela recebe uma data ISO por argumento (`npx tsx prazo.ts 2026-12-25T00:00:00-03:00`) e mostra três coisas: a data por extenso em português, quantos dias faltam, e o relativo ("em 40 dias", ou "há 2 dias" se já passou). Valide a entrada: uma data inválida tem `getTime()` igual a `NaN`, e deve mostrar um erro. E pra fechar, mostre o mesmo instante em Tóquio (`timeZone: "Asia/Tokyo"`). Você terminou quando funcionar com uma data futura, uma passada e uma inválida, e o horário em Tóquio sair 12 horas à frente de Brasília.

Daqui, siga pra [[JSON]], [[Ler e Escrever Arquivos]], e mais adiante [[PostgreSQL]], onde as colunas `timestamptz` seguem exatamente essa regra de ouro.

---

## 🧠 Me teste

> [!question]- Qual a regra de ouro pra guardar datas?
> Guardar e calcular em UTC (formato ISO 8601) e converter pro fuso do usuário só na hora de mostrar.

> [!question]- O que um `Date` guarda por dentro?
> Um número: os milissegundos desde 1/1/1970 00:00 UTC. O fuso só é aplicado na exibição.

> [!question]- Por que `new Date().toISOString().slice(0, 10)` pode dar o dia errado?
> Porque converte pra UTC: depois das 21h no Brasil (UTC-3), em UTC já é o dia seguinte.

> [!question]- Que mês é `new Date(2026, 10, 15)`?
> Novembro. Os meses do `Date` começam em 0.

> [!question]- Como comparar se duas datas são o mesmo instante?
> Comparando os números: `a.getTime() === b.getTime()`. `===` direto compara os objetos.

> [!question]- Por que não guardar a data formatada como `"15/11/2026"`?
> Não ordena, não dá pra calcular e é ambígua (no formato americano, seria outro dia).

> [!question]- Como mostrar uma data em português com fuso de São Paulo?
> `new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(data)`.

> [!question]+ Que data é `new Date(2026, 10, 15)`?
> - a) 15 de outubro de 2026
> - b) 15 de novembro de 2026
> - c) 10 de novembro de 2026
> - d) 15 de dezembro de 2026
>
> > [!check]- Resposta
> > **b)** No `Date`, o mês começa em **0** (janeiro = 0). Então 10 é novembro. O dia começa em 1 normalmente.

> [!question]+ Às 22h de 15/11 em São Paulo, `new Date().toISOString().slice(0, 10)` dá o quê?
> - a) `"2026-11-15"`
> - b) `"2026-11-16"`
> - c) `"15/11/2026"`
> - d) Depende do idioma do sistema
>
> > [!check]- Resposta
> > **b)** `toISOString` usa **UTC**, que está 3h à frente de São Paulo: lá já é 01h do dia 16. Pra "hoje" no fuso local, monte a data com `getFullYear`/`getMonth`/`getDate`.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `Date.now()` | Timestamp atual (ms) |
| `new Date(isoComFuso)` | Cria a partir de um ISO |
| `d.toISOString()` | ISO em UTC (pra guardar) |
| `d.getTime()` | O número, pra comparar e calcular |
| `(b - a) / 60_000` | Diferença em minutos |
| `new Intl.DateTimeFormat("pt-BR", {...}).format(d)` | Mostrar |
| `new Intl.RelativeTimeFormat("pt-BR").format(-1, "day")` | "Há 1 dia" |
| `Number.isNaN(d.getTime())` | A data é inválida? |

**Pra ler:** o capítulo [Date and time](https://javascript.info/date) do javascript.info cobre o `Date` inteiro com exercícios, incluindo as armadilhas. A [referência do Intl.DateTimeFormat no MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) mostra todas as opções de formatação. E quando precisar de cálculos de verdade, o [date-fns](https://date-fns.org/) tem locale `pt-BR` e funções pequenas, uma pra cada coisa.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

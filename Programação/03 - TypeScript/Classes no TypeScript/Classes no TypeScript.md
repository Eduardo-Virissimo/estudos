---
nivel: escrito
foco: importante
projeto:
  - "[[Estruturas de Dados do Zero]]"
revisado:
---

# Classes no TypeScript

**Quanto focar: 📌 importante.** Frameworks e bibliotecas usam, mas muito código moderno prefere funções. Entenda bem a sintaxe; a teoria vem em OO no Estágio 3.

**Quanto tempo:** cerca de 1h30: 25 min de leitura, 5 min no Me teste e 1h no desafio.

**Onde praticar:** 🧪 o desafio de "Agora é com você" · 🧩 [[Estruturas de Dados do Zero]], projeto do Estágio 2.

Pense na planta de uma casa. A planta em si não é uma casa: você não mora nela. Mas com uma planta só você constrói quantas casas quiser, todas com a mesma estrutura, e cada uma com os seus próprios móveis, as suas cores, os seus moradores.

Uma **classe** é essa planta, só que pra objetos. É um molde pra criar objetos que têm **dados e comportamento juntos**: um personagem com a sua vida e o método de receber dano, uma conta bancária com o seu saldo e o método de depositar. Em TypeScript, você declara as propriedades com tipo, prepara o objeto no `constructor`, escreve métodos que usam `this`, e protege os dados com `private` e `readonly`.

Esta nota é sobre a **sintaxe**: como escrever uma classe e não tropeçar nela. O porquê e o quando usar (encapsulamento, herança, composição) vem no Estágio 3, na nota [[Classes]]. Ajuda já conhecer [[Interfaces e Type Aliases]], [[Funções]] e os [[Paradigmas de Programação]].

## A planta e as casas

```ts
class Personagem {
  nome: string;           // propriedade com tipo
  vida: number;

  constructor(nome: string, vida = 100) {  // roda quando você faz "new"
    this.nome = nome;
    this.vida = vida;
  }

  receberDano(dano: number): void {         // método
    this.vida = Math.max(0, this.vida - dano);
  }

  estaVivo(): boolean {
    return this.vida > 0;
  }
}

const heroi = new Personagem("Ana");  // cria uma instância
const vilao = new Personagem("Zé", 150);
heroi.receberDano(30);
heroi.vida;  // 70
vilao.vida;  // 150: cada objeto tem os próprios dados
```

Três ideias moram neste exemplo. A primeira é a diferença entre **classe e instância**: `Personagem` é a planta; `heroi` e `vilao` são as casas construídas com ela, chamadas de **instâncias**. Cada `new` cria um objeto novo e independente, por isso o dano no herói não mexe na vida do vilão.

A segunda é o **`constructor`**: a função que roda no momento do `new`, pra preparar o objeto recém-criado com os valores iniciais.

E a terceira, a mais importante, é o **`this`**. Dentro de um método, `this` quer dizer "este objeto aqui". Em `heroi.receberDano(30)`, o `this` é o `heroi`; em `vilao.receberDano(30)`, é o `vilao`. É assim que um mesmo método, escrito uma vez só, mexe nos dados do objeto certo.

Esquecer o `this` é o erro mais comum de quem está começando. Escrever `vida -= dano` dentro do método procura uma variável solta chamada `vida`, que não existe. A propriedade do objeto é `this.vida`.

E com o modo `strict` do TypeScript ligado, você vai ver uma mensagem como "Property 'vida' has no initializer". Ela quer dizer que toda propriedade precisa receber um valor, seja na declaração (`vida = 100`), seja no `constructor`.

## Dados que se protegem

Aqui está a grande vantagem de uma classe, a que justifica usar uma: ela pode **proteger** os próprios dados. Pense numa conta bancária. Não faz sentido qualquer parte do código poder escrever `conta.saldo = 1000000`.

```ts
class Conta {
  readonly id: string;        // definido no constructor, nunca mais muda
  private saldo = 0;          // só os métodos da própria classe acessam
  #historico: number[] = [];  // privado DE VERDADE (também quando roda)

  constructor(id: string) {
    this.id = id;
  }

  depositar(valor: number) {
    if (valor <= 0) throw new Error("Valor inválido");
    this.saldo += valor;
    this.#historico.push(valor);
  }

  get saldoAtual(): number {   // getter: lido como se fosse propriedade
    return this.saldo;
  }
}

const c = new Conta("001");
c.depositar(50);
c.saldoAtual;   // 50
c.saldo = 1e6;  // ❌ Property 'saldo' is private
```

Por que isso importa? A regra "não aceita depósito negativo" está dentro do `depositar`. Se qualquer pessoa pudesse mexer no `saldo` diretamente, essa regra seria inútil: bastaria pular o método. Com o `private`, a **única** porta de entrada pro saldo é o método, e a regra fica garantida. E o `get saldoAtual` deixa todo mundo **ler** o saldo, como se fosse uma propriedade, sem poder **escrever** nele.

Existem quatro níveis de acesso, e um detalhe importante sobre eles:

| Modificador | Quem acessa | Protege quando roda? |
|---|---|---|
| nenhum (`public`) | todo mundo | – |
| `private` | só a classe | ❌ só o TypeScript confere |
| `protected` | a classe e as filhas | ❌ só o TypeScript confere |
| `#campo` | só a classe | ✅ JavaScript de verdade |

O detalhe é a última coluna. O `private` e o `protected` são conferidos **só pelo TypeScript**, na hora de compilar. Quando o código vira JavaScript e roda, eles desaparecem, e um `(c as any).saldo` acessa o campo sem problema nenhum. Já o `#`, com o jogo da velha na frente do nome, é privacidade real do próprio JavaScript. Pra dados que precisam mesmo ficar escondidos, use `#`.

Juntando tudo, uma lista de tarefas que garante as próprias regras:

```ts
class ListaDeTarefas {
  #tarefas: Tarefa[] = [];
  #proximoId = 1;

  adicionar(titulo: string): Tarefa {
    const limpo = titulo.trim();
    if (!limpo) throw new Error("Título vazio");
    if (this.#tarefas.some((t) => t.titulo === limpo)) throw new Error("Tarefa repetida");
    const tarefa = { id: this.#proximoId++, titulo: limpo, concluida: false };
    this.#tarefas.push(tarefa);
    return tarefa;
  }

  get pendentes(): Tarefa[] {
    return this.#tarefas.filter((t) => !t.concluida);
  }
}
```

Nenhum código de fora consegue criar uma tarefa com título vazio ou id repetido. As regras moram junto com os dados, e não tem como dar a volta nelas.

## O this que se perde

Este é o bug mais confuso das classes, e vale entender o porquê, não só a solução. O `this` **não é fixo**: ele depende de **como** a função é chamada. Em `heroi.receberDano(10)`, o que vem antes do ponto (`heroi`) vira o `this`. Agora olhe isto:

```ts
const atacar = heroi.receberDano;
atacar(10); // ❌ this é undefined: não tem nada antes do ponto
```

Você pegou só o método, separado do objeto. Quando ele roda, não tem nada antes do ponto, e ele não sabe de quem é. O `this` vira `undefined`, e o `this.vida` explode.

Parece um caso raro, mas acontece o tempo todo, sem você perceber, quando passa um método como callback:

```ts
botao.onclick = heroi.receberDano;          // ❌ perde o this
botao.onclick = () => heroi.receberDano(10); // ✅ a arrow chama com o objeto
```

A arrow function resolve porque, quando o clique acontece, ela chama `heroi.receberDano(...)` do jeito normal, com o objeto antes do ponto.

## Contratos, membros da classe e atalhos

Uma `interface` pode descrever o que uma classe precisa ter, e o `implements` obriga a classe a cumprir esse contrato:

```ts
interface Repositorio {
  listar(): string[];
  adicionar(item: string): void;
}

class RepositorioEmMemoria implements Repositorio {
  #itens: string[] = [];
  listar() { return [...this.#itens]; }  // devolve cópia: ninguém altera por fora
  adicionar(item: string) { this.#itens.push(item); }
}
```

Se faltar um método, o TypeScript acusa. Mas o ganho real é outro: amanhã você cria um `RepositorioEmArquivo` com a mesma interface, troca um pelo outro, e o resto do programa nem percebe. (Repare também no `listar` devolvendo uma **cópia** da lista: se devolvesse a própria, qualquer um poderia dar `push` nela por fora e furar a proteção.)

Às vezes você quer algo que pertence **à classe**, e não a cada objeto: um contador compartilhado, ou um jeito alternativo de criar objetos. Pra isso existe o `static`:

```ts
class Tarefa {
  static #proximoId = 1;
  readonly id = Tarefa.#proximoId++;
  constructor(public titulo: string) {}

  static deTexto(texto: string): Tarefa {
    return new Tarefa(texto.trim());
  }
}
Tarefa.deTexto("  Estudar  "); // chamado na classe, não num objeto
```

E repare no `constructor(public titulo: string) {}`. Isso é um atalho do TypeScript: declara a propriedade e atribui o valor de uma vez, sem precisar escrever `this.titulo = titulo`. É curto e prático, mas é sintaxe **exclusiva** do TypeScript: o Node, quando roda arquivos `.ts` direto, sem compilar, não aceita esse atalho. Se o seu projeto roda assim, use a forma longa.

Por último, a **herança**: uma classe pode **estender** outra e herdar tudo dela.

```ts
class Mago extends Personagem {
  constructor(nome: string, public mana = 50) {
    super(nome, 80);          // chama o constructor do pai
  }
  lancarFeitico(alvo: Personagem) {
    if (this.mana < 10) return;
    this.mana -= 10;
    alvo.receberDano(25);
  }
}
```

O `Mago` tem tudo o que o `Personagem` tem (vida, receber dano), mais a mana e o feitiço. Herança é poderosa, e por isso mesmo fácil de abusar. Quando usar e quando preferir a [[Composição]] é assunto do Estágio 3. E um conselho geral: não use classe pra tudo. Uma função pura resolve a maioria dos cálculos. Classe vale a pena quando existem **estado e regras** que precisam andar juntos.

## O essencial

1. A classe é o molde; cada `new` cria uma instância independente.
2. `this` é "este objeto". Dentro do método, é sempre `this.propriedade`.
3. Proteja os dados: `private` (só o TypeScript confere) ou `#` (privado de verdade). A regra mora no método.
4. Método passado como callback perde o `this`. Use uma arrow: `() => obj.metodo()`.
5. Classe vale quando há estado e regras juntos; pra cálculo, função.

## Agora é com você

Crie uma classe `Cronometro` pras suas sessões de estudo, com os métodos `iniciar()`, `pausar()`, `retomar()` e `parar()`, que devolve os minutos totais. Guarde o estado em campos privados com `#`: o momento de início, o tempo acumulado e um status `"parado" | "rodando" | "pausado"`. Aplique as regras: não dá pra pausar um cronômetro parado, nem iniciar um que já está rodando (lance um `Error` com uma mensagem clara). Exponha o `status` com um getter só de leitura. E pra conseguir testar sem esperar minutos de verdade, aceite no constructor uma função `relogio = () => Date.now()`, que nos testes você troca por um relógio falso. Você terminou quando a sequência iniciar → pausar → retomar → parar der o total certo com um relógio simulado, e as chamadas fora de ordem derem erro.

Daqui, siga pras [[Promises]], ou adiante pro Estágio 3, com [[Classes]], [[Encapsulamento]] e [[Herança]].

---

## 🧠 Me teste

> [!question]- Qual a diferença entre classe e objeto (instância)?
> A classe é o molde; o objeto é cada coisa criada com `new` a partir dela, com seus próprios dados.

> [!question]- O que é `this` dentro de um método?
> O objeto em que o método foi chamado.

> [!question]- Qual a diferença entre `private` e `#campo`?
> `private` é checado só pelo TypeScript (some no JS); `#campo` é privado de verdade, também em execução.

> [!question]- O que faz `implements` numa classe?
> Obriga a classe a ter todos os métodos e propriedades de uma interface; o TS acusa se faltar algo.

> [!question]- O que é um membro `static`?
> Algo que pertence à classe, não a cada instância: acessado como `Classe.membro`.

> [!question]- Por que `obj.metodo` passado como callback pode perder o `this`?
> Porque a função é chamada sem o objeto na frente; o `this` vira `undefined`. Use uma arrow function que chama `obj.metodo()`.

> [!question]+ Você passa `botao.onclick = contador.incrementar` e dá erro com `this`. Por quê?
> - a) Métodos não podem ser passados como callback
> - b) Ao passar só o método, ele perde o objeto: `this` vira `undefined`
> - c) `this` só existe em arrow functions
> - d) Faltou `static`
>
> > [!check]- Resposta
> > **b)** `this` depende de **como** a função é chamada. Solta, ela não sabe de quem é. Use `() => contador.incrementar()` ou um método em arrow function.

---

## Pra consultar depois

| Sintaxe | O que faz |
|---|---|
| `class X { a: T; constructor() {} }` | O molde |
| `new X()` | Cria uma instância |
| `private a` / `#a` | Privado (só TS / de verdade) |
| `readonly a` | Não muda depois de criado |
| `get a() {}` | Getter |
| `static f()` | Da classe, não da instância |
| `class Y extends X` + `super()` | Herança |
| `class X implements I` | Cumprir uma interface |

**Pra ler:** a parte de [classes do TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/classes.html) é completa e cheia de exemplos. Do lado do JavaScript, os capítulos [Classes](https://javascript.info/class) e [Private and protected](https://javascript.info/private-protected-properties-methods) do javascript.info explicam bem o `#` e por que ele é diferente do `private`.

## Minhas anotações

**O que eu entendi, com as minhas palavras:**
- 

**Onde eu travei:**
- 

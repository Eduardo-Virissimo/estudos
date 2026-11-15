---
nivel: escrito
revisado:
---

# Classes no TypeScript

> *"Classe é um molde. Objeto é o biscoito."*

> [!tip] ⚡ Em 30 segundos
> Uma **classe** é um molde pra criar objetos que têm **dados e comportamento juntos**. Em TypeScript você declara as propriedades com tipo, inicializa no `constructor`, escreve métodos que usam `this`, e controla o acesso com `private` (só a própria classe mexe) e `readonly` (não muda depois de criado). Esta nota é a **sintaxe**; o porquê e quando usar (encapsulamento, herança, composição) vem no Estágio 3, em [[Classes]].
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Escrever uma classe com propriedades tipadas, `constructor` e métodos
- Proteger o estado interno com `private`/`#privado` e `readonly`
- Usar getters, métodos estáticos e `implements` com uma interface

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Interfaces e Type Aliases]] · [[Funções]] · [[Paradigmas de Programação]]
- **Depois:** [[Promises]] · [[Classes]] · [[Encapsulamento]] · [[Herança]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Anatomia

```ts
class Personagem {
  nome: string;           // propriedade com tipo
  vida: number;

  constructor(nome: string, vida = 100) {  // roda no "new"
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
heroi.receberDano(30);
heroi.vida;       // 70
heroi.estaVivo(); // true
```

`this` = "este objeto aqui". Cada `new` cria um objeto independente com seus próprios dados.

### 2. `private`, `readonly` e `#`

```ts
class Conta {
  readonly id: string;        // definido no constructor, nunca mais muda
  private saldo = 0;          // só métodos da própria classe acessam
  #historico: number[] = [];  // privado DE VERDADE (também em execução)

  constructor(id: string) {
    this.id = id;
  }

  depositar(valor: number) {
    if (valor <= 0) throw new Error("Valor inválido");
    this.saldo += valor;
    this.#historico.push(valor);
  }

  get saldoAtual(): number {   // getter: lê como propriedade
    return this.saldo;
  }
}

const c = new Conta("001");
c.depositar(50);
c.saldoAtual;    // 50
c.saldo = 1e6;   // ❌ Property 'saldo' is private
```

| Modificador | Quem acessa | Checado em execução? |
|---|---|---|
| (nenhum) / `public` | todo mundo | – |
| `private` | só a classe | ❌ só o TypeScript |
| `protected` | a classe e as filhas | ❌ só o TypeScript |
| `#campo` | só a classe | ✅ JavaScript de verdade |

O ponto do `private`: a regra "não aceita depósito negativo" fica **garantida**, porque ninguém de fora consegue mexer no saldo direto.

### 3. Atalho no constructor (*parameter properties*)

```ts
class Ponto {
  constructor(public x: number, public y: number) {} // declara e atribui de uma vez
}
```

Curto, mas é sintaxe exclusiva do TypeScript (o Node rodando `.ts` direto não aceita). Use a forma longa se o projeto roda TS sem compilar.

### 4. Estático: pertence à classe, não à instância

```ts
class Tarefa {
  static #proximoId = 1;
  readonly id = Tarefa.#proximoId++;
  constructor(public titulo: string) {}

  static deTexto(texto: string): Tarefa {  // "construtor alternativo"
    return new Tarefa(texto.trim());
  }
}
Tarefa.deTexto("  Estudar  ");
```

### 5. `implements`: cumprir um contrato

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

Se faltar um método do contrato, o TS acusa. Amanhã um `RepositorioEmArquivo` implementa a mesma interface e o resto do código nem percebe a troca.

### 6. Herança (o básico)

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

Herança é poderosa e fácil de abusar. Quando usar e quando preferir [[Composição]] está no Estágio 3.

---

## 🛠️ Exemplo guiado

Uma lista de tarefas que se protege:

```ts
interface Tarefa { readonly id: number; titulo: string; concluida: boolean }

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

  concluir(id: number): void {
    const t = this.#tarefas.find((t) => t.id === id);
    if (!t) throw new Error(`Tarefa ${id} não existe`);
    t.concluida = true;
  }

  get pendentes(): Tarefa[] {
    return this.#tarefas.filter((t) => !t.concluida);
  }
}
```

Nenhum código de fora consegue criar tarefa com título vazio ou id repetido: as regras moram junto com os dados.

---

## 🔧 Pegadinhas

- **Esquecer o `this`.** `vida -= dano` dentro do método procura uma variável `vida` solta. É `this.vida`.
- **Perder o `this` ao passar o método.** `botao.onclick = heroi.receberDano` chama sem o objeto: `this` vira `undefined`. Use arrow: `() => heroi.receberDano(10)`.
- **`Property 'x' has no initializer`.** Com `strict`, toda propriedade precisa de valor no constructor ou na declaração.
- **Achar que `private` protege em execução.** `(c as any).saldo` acessa. Pra privacidade real, `#`.
- **Classe pra tudo.** Função pura resolve a maioria dos cálculos. Classe vale quando há **estado + regras** que precisam andar juntos.

---

## 🔨 Desafio prático

**Objetivo:** uma classe `Cronometro` pra sessões de estudo.

1. Métodos `iniciar()`, `pausar()`, `retomar()` e `parar(): number` (minutos totais).
2. Estado privado com `#`: momento de início, tempo acumulado e um status `"parado" | "rodando" | "pausado"`.
3. Regras: não dá pra pausar parado, nem iniciar rodando (lance `Error` com mensagem clara).
4. Getter `status` só de leitura.
5. Teste usando `Date.now()` falso: aceite no constructor uma função `relogio = () => Date.now()` pra conseguir simular o tempo.

**Pronto quando:** uma sequência iniciar → pausar → retomar → parar dá o total certo com um relógio simulado, e chamadas fora de ordem dão erro.

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

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

---

## 📋 Cola rápida

| Sintaxe | O que faz |
|---|---|
| `class X { a: T; constructor() {} }` | molde |
| `new X()` | criar instância |
| `private a` / `#a` | privado (TS / real) |
| `readonly a` | não muda depois de criado |
| `get a() {}` | getter |
| `static f()` | da classe, não da instância |
| `class Y extends X` + `super()` | herança |
| `class X implements I` | cumprir interface |

---

## 🛠️ Exemplo meu

```ts

```

---

## 📓 Diário de bordo

> Esta parte é **sua**. Escreva com as suas palavras, depois de praticar. Nota curta e feia que você escreveu vale mais que nota bonita copiada.

**Explicando pra um amigo** (3 linhas, sem olhar a nota):
- 

**O que me confundiu / onde eu errei:**
- 

**Onde eu usei de verdade:**
- 

---

## 📚 Recursos

- [TypeScript Handbook · Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [javascript.info · Classes](https://javascript.info/class) e [Private and protected](https://javascript.info/private-protected-properties-methods)

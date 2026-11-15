---
nivel: escrito
revisado:
---

# Nomes e Comentários

> *"Só existem duas coisas difíceis em ciência da computação: invalidar cache e dar nome às coisas."* (Phil Karlton)

> [!tip] ⚡ Em 30 segundos
> Código é lido muito mais vezes do que escrito. Um **nome bom** diz o que a coisa é ou faz sem precisar abrir: `tarefasPendentes` em vez de `lista2`, `calcularFrete()` em vez de `processa()`. **Comentário** serve pro que o código não consegue dizer: o **porquê** de uma decisão, não o **o quê** (isso o código já mostra).
>
> **Como estudar esta nota:** ① tente o [[#🔨 Desafio prático|desafio]] *antes* de ler (errar primeiro fixa mais) → ② leia só o que precisar → ③ responda o [[#🧠 Me teste|Me teste]] sem olhar → ④ escreva o 📓 Diário de bordo com as suas palavras.

> [!info] 📊 Nível
> `escrito` → `praticado` (fez o desafio) → `projeto` (fez o [[#🚀 Projeto|projeto]] ou usou de verdade). Mude em `nivel` nas propriedades. A data de revisão é marcada sozinha pela Ficha do herói (painel **Revisar**).

---

## 🎯 Objetivos

Ao terminar esta nota, você consegue:

- Dar nomes que revelam a intenção, seguindo as convenções do TypeScript
- Distinguir comentário útil (porquê) de comentário inútil (o quê)
- Reescrever um trecho confuso trocando comentários por nomes melhores

---

## 🧭 Onde isso se encaixa

- **Antes:** [[Funções]] · [[Variáveis e Tipos de Dados]]
- **Depois:** [[Nomeação]] · [[Legibilidade]] · [[Clean Code]]
- **Trilha:** [[Roadmap]]

---

## 🧱 O mínimo pra usar

### 1. Convenções do TypeScript/JavaScript

| O quê | Estilo | Exemplo |
|---|---|---|
| variáveis e funções | `camelCase` | `totalXp`, `calcularMedia()` |
| tipos, interfaces, classes | `PascalCase` | `Tarefa`, `UsuarioAdmin` |
| constantes fixas de configuração | `UPPER_SNAKE_CASE` | `MAX_TENTATIVAS` |
| arquivos | `kebab-case` ou `camelCase` (escolha um e mantenha) | `tarefa-repo.ts` |

### 2. Nomes que revelam intenção

```ts
// ❌
const d = 7;
const l = u.filter((x) => x.a);

// ✅
const diasAteRevisao = 7;
const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo);
```

### 3. Regras práticas

- **Variável = substantivo:** `tarefa`, `precoTotal`. **Função = verbo:** `salvarTarefa()`, `calcularPreco()`.
- **Booleano = pergunta:** `estaAtivo`, `temPermissao`, `podeEditar`.
- **Listas no plural:** `tarefas`; um item no singular: `tarefa`.
- **Unidade no nome quando houver:** `tempoMs`, `pesoKg`, `precoCentavos`.
- **Tamanho proporcional ao escopo:** `i` num laço de 3 linhas é ok; uma variável usada no arquivo inteiro precisa de nome completo.
- **Sem abreviação inventada:** `qtdUsrAtv` → `quantidadeUsuariosAtivos`.
- **Um nome por conceito:** não alterne `buscar`, `pegar` e `obter` pra mesma coisa.

### 4. Números mágicos

```ts
// ❌ o que é 86400000?
if (agora - ultimoAcesso > 86400000) { }

// ✅
const UM_DIA_MS = 24 * 60 * 60 * 1000;
if (agora - ultimoAcesso > UM_DIA_MS) { }
```

### 5. Comentário: o porquê, não o o quê

```ts
// ❌ repete o código
// soma 1 no contador
contador++;

// ✅ explica uma decisão que o código não mostra
// A API do banco limita 100 itens por página; acima disso ela ignora o resto.
const TAMANHO_PAGINA = 100;

// ✅ avisa de uma armadilha
// Não trocar por toISOString(): ele converte pra UTC e muda o dia depois das 21h no Brasil.
const hoje = dataLocal(new Date());
```

### 6. Comentário de documentação (JSDoc)

Em funções públicas, um comentário `/** */` aparece no autocomplete do [[VS Code]]:

```ts
/**
 * Calcula o próximo intervalo de revisão.
 * @param acertou se a pessoa lembrou da resposta
 * @returns dias até a próxima revisão
 */
export function proximoIntervalo(atual: number, acertou: boolean): number { /* ... */ }
```

### 7. Código comentado = código apagado

Não deixe blocos de código comentados "pra caso precise". O [[Git Básico|Git]] guarda o histórico.

---

## 🛠️ Exemplo guiado

Trocando comentários por nomes:

```ts
// ❌
// verifica se o usuário pode receber bônus (ativo e mais de 30 dias)
function check(u: any) {
  return u.s === 1 && (Date.now() - u.c) / 86400000 > 30;
}

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

---

## 🔧 Pegadinhas

- **Comentário desatualizado.** O código muda, o comentário não, e passa a mentir. Menos comentário = menos mentira.
- **Nome que mente.** `getUsuario()` que também salva no banco. O nome tem que dizer tudo o que a função faz.
- **Nomes genéricos:** `data`, `info`, `valor`, `temp`, `manager`. Pergunte "dados *de quê*?".
- **Misturar idiomas sem regra.** Escolha: tudo em português ou tudo em inglês. Em projetos públicos e no mercado, inglês é o padrão; neste vault, português ajuda a aprender. O importante é ser consistente.

---

## 🔨 Desafio prático

**Objetivo:** renomear um código ruim.

1. Copie este código e reescreva **só os nomes** (e extraia constantes), sem mudar a lógica:
   ```ts
   function f(a: number[], b: number) {
     let r = 0;
     for (const x of a) if (x > b) r++;
     return r / a.length * 100;
   }
   ```
2. Escreva no máximo 1 comentário, e só se for um "porquê".
3. Peça pra alguém (ou uma IA) dizer o que a função faz só lendo o seu nome.

**Pronto quando:** dá pra entender o que a função faz lendo só a assinatura (ex: `porcentagemAcimaDe(notas, notaMinima)`).

---

## 🧠 Me teste

> Responda em voz alta (ou no papel) **antes** de abrir. Errou? Ótimo, é aí que fixa. Estas perguntas aparecem na **revisão** da Ficha do herói.

> [!question]- Qual convenção de nome usar pra variáveis, tipos e constantes em TypeScript?
> `camelCase` pra variáveis e funções, `PascalCase` pra tipos/classes/interfaces, `UPPER_SNAKE_CASE` pra constantes de configuração.

> [!question]- Como nomear um booleano?
> Como uma pergunta de sim/não: `estaAtivo`, `temPermissao`, `podeEditar`.

> [!question]- Quando um comentário é útil?
> Quando explica o porquê de uma decisão ou avisa de uma armadilha, coisas que o código não consegue mostrar.

> [!question]- O que é um número mágico e como resolver?
> Um número solto no código sem explicação (`86400000`). Resolve dando nome numa constante (`UM_DIA_MS`).

> [!question]- Por que não deixar código comentado no arquivo?
> Polui, confunde e envelhece. O Git guarda o histórico se precisar voltar.

---

## 📋 Cola rápida

| Coisa | Nome bom |
|---|---|
| variável | substantivo: `tarefaAtual` |
| função | verbo: `salvarTarefa()` |
| booleano | pergunta: `estaConcluida` |
| lista | plural: `tarefas` |
| unidade | `tempoMs`, `precoCentavos` |
| constante | `MAX_TENTATIVAS` |
| comentário | `// por quê: ...` |

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

- *Clean Code* (Robert C. Martin): capítulos 2 (nomes) e 4 (comentários)
- [Google TypeScript Style Guide · Naming](https://google.github.io/styleguide/tsguide.html#naming)

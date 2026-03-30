No JavaScript, **valores** são os dados (a informação) e **variáveis** são os nomes que damos a esses dados para que possamos guardá-los e usá-los depois.

Imagine a variável como uma **etiqueta** colada em uma **caixa**: a etiqueta é o nome da variável e o que está dentro da caixa é o valor.

---

1. Como declarar variáveis (As 3 formas)

Existem três palavras-chave para criar variáveis. A escolha depende de como você pretende usar esse dado:

- **`const` (Constante):** Use para valores que **nunca mudam**. Uma vez definido, o valor é fixo.
    - _Exemplo:_ CPF, Data de Nascimento.
- **`let` (Variável de Bloco):** Use para valores que **podem mudar**. É a forma moderna e segura de criar variáveis que evoluem.
    - _Exemplo:_ Pontuação de um jogo, preço com desconto.
- **`var` (O jeito antigo):** Foi a única forma por muitos anos. Ela é "bagunçada" porque não respeita os limites do código (escopo). **Evite usar em projetos novos!**

---

2. Tipos de Dados (Valores)

No JavaScript, não precisamos dizer se um número é inteiro ou quebrado; ele entende quase tudo como um único tipo, mas existem outros valores importantes:

**Os Primitivos (Simples)**

|Tipo|Nome Técnico|O que é?|Exemplo|
|---|---|---|---|
|**Texto**|`String`|Textos entre aspas ou crase.|`"Olá"`, `'JS'`, `` `ID: 1` ``|
|**Número**|`Number`|**Inclui Inteiros e Floats** (decimais).|`42` ou `19.99`|
|**Numerão**|`BigInt`|Números inteiros gigantescos.|`9007199254740991n`|
|**Lógico**|`Boolean`|Verdadeiro ou Falso.|`true` ou `false`|
|**Vazio**|`null`|Valor "vazio" por escolha sua.|`let sala = null;`|
|**Indefinido**|`undefined`|Variável sem valor definido.|`let x;`|
|**Símbolo**|`Symbol`|Identificador único (avançado).|`Symbol('id')`|
💡 **Nota sobre o `Float`:** No JavaScript, não existe um tipo chamado "Float" separado. Tudo o que é número (com ou sem vírgula) entra na categoria **`Number`**. Ele usa um padrão internacional (IEEE 754) para cuidar dos decimais automaticamente para você.

---

**Os Tipos Estruturais (Complexos)**

Diferente dos anteriores, estes guardam "coleções" de dados:

- **Objetos (`Object`):** Guardam várias informações de uma vez usando etiquetas (chaves).

```
const usuario = { nome: "Ana", idade: 25 };
```

- **Arrays (Listas):** Guardam uma fila de valores em ordem.

```
const frutas = ["Maçã", "Banana", "Uva"];
```


- **Funções (`Function`):** Sim, no JS, funções também são valores que você pode guardar em variáveis!

---

🔍 Como saber o tipo de uma variável?

Você pode usar o comando `typeof` para o JavaScript te dizer o que tem dentro da caixa:

```
let preco = 10.50;
console.log(typeof preco); // Resultado: "number"

let nome = "Edu";
console.log(typeof nome);  // Resultado: "string"
```
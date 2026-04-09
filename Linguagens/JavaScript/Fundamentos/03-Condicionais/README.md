# Condicionais

## `if`, `else if` e `else`

Servem para tomar decisoes.

```js
const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
} else if (nota >= 5) {
  console.log("Recuperacao");
} else {
  console.log("Reprovado");
}
```

## Operador ternario

Bom para decisoes curtas.

```js
const mensagem = idade >= 18 ? "Maior de idade" : "Menor de idade";
```

## `switch`

Fica bom quando voce compara varios casos do mesmo valor.

```js
const dia = 2;

switch (dia) {
  case 1:
    console.log("Domingo");
    break;
  case 2:
    console.log("Segunda");
    break;
  default:
    console.log("Outro dia");
}
```

## Quando usar cada um

- `if`: condicoes flexiveis
- ternario: retorno simples
- `switch`: muitos casos fixos

## Boas praticas

- evite condicionais gigantes
- extraia regras para funcoes com nomes claros
- use variaveis com nomes que expressem a regra

## Erros comuns

- esquecer `break` no `switch`
- aninhar `if` demais
- escrever condicoes confusas

## Checklist de revisao

- sei usar `if`, `else if` e `else`
- sei quando usar ternario
- sei montar um `switch`


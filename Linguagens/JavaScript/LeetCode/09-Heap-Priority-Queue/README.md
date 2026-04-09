# Heap / Priority Queue

## O que e

Heap e uma estrutura para pegar rapidamente o menor ou maior elemento.
Priority Queue e a interface de uso dessa ideia.

## Intuicao

Pense em fila de atendimento por prioridade:

- nao importa ordem de chegada
- importa quem tem maior prioridade

## Tipos

- Min-heap: menor valor no topo
- Max-heap: maior valor no topo

## Operacoes mais comuns

- inserir elemento
- consultar topo
- remover topo

## Complexidade sem misterio

- inserir: O(log n)
- remover topo: O(log n)
- ver topo: O(1)

## Onde aparece muito

- Top K elementos
- tarefas com prioridade
- stream de dados

## Exemplo conceitual em JS

`js
// minHeap aqui e uma implementacao de heap ja pronta.
function keepTopK(nums, k, minHeap) {
  for (const n of nums) {
    minHeap.push(n);

    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }

  return minHeap;
}
`

Por que funciona?

- Mantemos so k elementos.
- Quando passa de k, removemos o menor do grupo.
- No fim ficam os k maiores.

## Erros comuns de iniciante

- Inverter min-heap e max-heap.
- Ordenar array inteiro sem precisar.
- Esquecer que JS nao tem heap nativo no core da linguagem.

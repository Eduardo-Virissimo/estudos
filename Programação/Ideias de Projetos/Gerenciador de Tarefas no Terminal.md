# Gerenciador de Tarefas no Terminal

O projeto do **Estágio 1** do [[Roadmap]]. Um programa de linha de comando (CLI), em TypeScript, pra adicionar, listar, concluir e remover tarefas, salvando tudo num arquivo JSON. É pequeno o bastante pra terminar e grande o bastante pra usar **todos** os tópicos do estágio juntos.

```bash
tarefas add "Estudar Promises" --prioridade alta
tarefas list
#  [ ] 1. Estudar Promises        (alta)
#  [x] 2. Configurar o tsconfig   (média)
tarefas done 1
tarefas remove 2
tarefas stats
#  2 tarefas · 1 concluída (50%)
```

## Por que este projeto

- Usa o que você estudou: [[Entrada e Saída]] (argumentos), [[Estruturas Condicionais]] (comandos), [[Funções]] e [[Modularização]], [[Interfaces e Type Aliases]], [[Union Types e Narrowing]], [[Async e Await]] e [[Ler e Escrever Arquivos]].
- Vive no [[Git Básico|Git]] desde o primeiro arquivo e termina publicado no [[GitHub e Pull Requests|GitHub]].
- Vira peça de portfólio e a base de projetos maiores: a mesma lógica ganha uma API no Estágio 4.

## Funcionalidades

**O mínimo (versão 1.0.0):**
- [ ] `add "<título>"`: cria uma tarefa (recusa título vazio ou repetido)
- [ ] `list`: mostra todas, com `[ ]` ou `[x]`
- [ ] `done <id>` e `remove <id>`: concluir e remover, com erro claro se o id não existir
- [ ] Salva em `tarefas.json` e carrega ao abrir; funciona no primeiro uso (arquivo ainda não existe)
- [ ] `help` (e comando desconhecido) mostra como usar
- [ ] Código de saída `1` quando algo dá errado

**Depois (versões 1.x):**
- [ ] `--prioridade baixa|média|alta` no `add` e filtro no `list` (`1.1.0`)
- [ ] `stats`: total, concluídas e porcentagem (`1.2.0`)
- [ ] `edit <id> "<novo título>"`
- [ ] Prazo (`--prazo 2026-12-01`) e aviso de tarefas atrasadas, com datas em ISO ([[Datas e Fusos Horários]])
- [ ] Escrita atômica do JSON (não corrompe se o programa cair)

## Requisitos técnicos

- **TypeScript com `strict: true`**, sem `any` ([[Configurando um Projeto TypeScript]]).
- **Separação em módulos** ([[Modularização]] · [[Módulos ES (import e export)]]):

```text
src/
  tipos.ts        → type Tarefa, type Comando (união discriminada)
  regras.ts       → adicionar, concluir, remover, filtrar: funções puras, sem console nem fs
  armazenamento.ts→ carregar() e salvar(): o único arquivo que usa fs
  cli.ts          → interpreta process.argv e transforma em Comando
  formatar.ts     → texto pra mostrar no terminal
  main.ts         → junta tudo
```

- **Regras sem efeito colateral**: `regras.ts` recebe e devolve listas novas ([[Objetos e Arrays no JavaScript]]).
- **Comandos como união discriminada** com `switch` exaustivo ([[Union Types e Narrowing]]).
- **Validação do JSON lido**: arquivo corrompido gera mensagem clara, não crash.
- **Scripts**: `dev`, `check`, `build`, `start` no `package.json`.

## Git e GitHub

- [ ] Repositório criado antes do primeiro código, com `.gitignore` certo
- [ ] Commits pequenos no padrão [[Conventional Commits]]
- [ ] Cada funcionalidade das versões 1.x numa branch própria, entrando por PR ([[GitHub e Pull Requests]])
- [ ] Tags `v1.0.0`, `v1.1.0`... com [[Tags e Versionamento Semântico|SemVer]] e um `CHANGELOG.md`
- [ ] README com: o que é, como instalar, todos os comandos com exemplo, e um GIF ou print
- [ ] (Extra) Husky rodando `check` antes de cada commit ([[Git Hooks]])

## Pronto quando

O ✅ do Estágio 1: você criou o projeto do zero, ele usa condições, laços e funções, está no GitHub, e **você usa de verdade** pra organizar a semana por pelo menos 7 dias.

## Se quiser ir além

- Comando global: `"bin"` no `package.json` + `npm link`, pra digitar só `tarefas` em qualquer pasta
- Cores no terminal (`node:util` → `styleText`)
- Testes das regras com `node --test` (preview do Estágio 3)
- Modo interativo com `readline` quando roda sem argumentos

## Próximos Passos

- [ ] Ler o enunciado inteiro e desenhar os comandos em [[Lógica de Programação|pseudocódigo]]
- [ ] Criar o repositório e o projeto TypeScript
- [ ] Fazer as regras puras ([[Funções#🚀 Projeto|o núcleo]]) e testar no `main`
- [ ] Ligar o armazenamento em JSON
- [ ] Ligar a CLI
- [ ] Publicar a `v1.0.0` no GitHub

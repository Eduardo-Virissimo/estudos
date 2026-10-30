# Site de Roadmap para o Vault de Estudos

Criar um site simples e visual que transforme o conteúdo do vault de Estudos em um roadmap navegável. A página deve mostrar o que já foi estudado, o que está em andamento e quais são os próximos assuntos, usando os arquivos Markdown como fonte de verdade.

## Objetivo

Ter uma visão pública, rápida e fácil de atualizar do progresso nos estudos, sem precisar manter uma segunda lista de tarefas manualmente. A cada alteração no vault, uma nova versão do site pode ser gerada automaticamente.

## Funcionalidades do MVP

- Listar as principais áreas de estudo, começando por Programação;
- Ler títulos, subtítulos e checklists dos arquivos Markdown;
- Mostrar o progresso de cada trilha e o progresso geral;
- Separar itens concluídos, em andamento e planejados;
- Permitir abrir a nota correspondente no GitHub ou em outro endereço público;
- Ter um layout responsivo para celular e desktop;
- Gerar uma versão estática que possa ser publicada no GitHub Pages.

## Estrutura da página

### Visão geral

- Nome do vault ou da trilha;
- Percentual geral concluído;
- Quantidade de tópicos estudados;
- Última atualização;
- Atalhos para as principais áreas.

### Roadmap

Cada etapa pode ser exibida como um card ou uma coluna:

1. **Fundamentos** — assuntos essenciais;
2. **Ferramentas** — ferramentas e ambiente de desenvolvimento;
3. **Desenvolvimento** — APIs, aplicações e práticas;
4. **DevOps** — automação, containers e entrega;
5. **Projetos** — ideias e projetos para consolidar o aprendizado.

### Detalhes da trilha

- Lista de tópicos com status;
- Descrição curta extraída da nota;
- Link para a nota original;
- Indicador de quantidade de subtarefas concluídas;
- Filtro por status ou área.

## Como os dados seriam obtidos

O site não deve depender da API do Obsidian em produção. Um script de build pode:

1. Ler uma cópia autorizada das notas Markdown;
2. Ignorar configurações, arquivos privados e rascunhos;
3. Interpretar headings e checklists;
4. Gerar um arquivo `roadmap.json`;
5. Renderizar a interface a partir desse arquivo.

O formato de checklist já usado no vault pode ser a regra inicial:

```markdown
- [x] Tópico concluído
- [ ] Próximo tópico
```

No futuro, notas podem receber metadados opcionais para maior controle:

```yaml
---
status: em-andamento
area: programação
ordem: 2
publicar: true
---
```

## Stack sugerida

- **Frontend:** HTML, CSS e JavaScript ou Astro;
- **Parser:** `gray-matter` e uma biblioteca Markdown;
- **Dados:** JSON gerado no build;
- **Publicação:** GitHub Pages;
- **Automação:** GitHub Actions para atualizar o site quando o conteúdo público mudar.

Para o primeiro protótipo, HTML, CSS e JavaScript puros são suficientes. Um framework só deve ser introduzido quando houver necessidade real de rotas, busca ou componentes mais complexos.

## Direção visual

- Interface escura, inspirada no dashboard atual do vault;
- Tipografia simples e bastante espaço entre as etapas;
- Cards com bordas discretas e estados bem visíveis;
- Uma cor de destaque para progresso e links;
- Nada de excesso de animações: o conteúdo e a evolução devem ser o foco.

## Cuidados

- Não publicar notas pessoais, credenciais, anotações privadas ou arquivos de configuração;
- Manter uma pasta ou exportação específica com o conteúdo público;
- Não expor o caminho local dos arquivos;
- Usar links públicos estáveis para as notas;
- Tratar arquivos inválidos com uma mensagem clara durante o build;
- Definir como o site vai lidar com checklists dentro de exemplos de código ou citações.

## Roadmap do projeto

### Fase 1 — Protótipo visual

- [ ] Criar uma página estática com dados fictícios;
- [ ] Reproduzir a identidade visual do dashboard do vault;
- [ ] Montar cards para áreas, progresso e próximos tópicos;
- [ ] Validar a leitura em celular.

### Fase 2 — Dados reais

- [ ] Separar o conteúdo público do restante do vault;
- [ ] Criar o parser de Markdown;
- [ ] Calcular progresso por pasta e por nota;
- [ ] Gerar `roadmap.json`;
- [ ] Renderizar o roadmap usando os dados reais.

### Fase 3 — Publicação

- [ ] Criar o repositório ou subpasta do site;
- [ ] Configurar o GitHub Pages;
- [ ] Adicionar uma GitHub Action de build;
- [ ] Adicionar data de atualização e link para o repositório;
- [ ] Testar o site com uma atualização real do vault.

### Fase 4 — Evolução

- [ ] Adicionar busca por tópico;
- [ ] Adicionar filtros por área e status;
- [ ] Permitir expandir uma etapa sem sair da página;
- [ ] Criar uma página individual para cada trilha;
- [ ] Adicionar histórico de progresso;

## Critério de sucesso

Uma alteração em uma checklist pública do vault deve ser suficiente para atualizar o progresso exibido no site, sem editar manualmente componentes da interface. O visitante deve conseguir entender em poucos segundos o que já foi estudado e qual é o próximo passo.

## Próximo passo

- [ ] Criar o protótipo visual da página inicial;
- [ ] Escolher quais notas de `Programação` serão públicas;
- [ ] Definir a primeira versão do formato `roadmap.json`.

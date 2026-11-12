# Graph Report - estudos  (2026-11-11)

## Corpus Check
- Corpus is ~30,349 words - fits in a single context window. You may not need a graph.

## Summary
- 257 nodes · 312 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.79)
- Token cost: 288,836 input · 0 output

## Community Hubs (Navigation)
- Homepage RPG e sistema de estudo
- Seções do Roadmap
- Formatação e pacotes
- Shells: Bash e PowerShell
- DevTools e clientes de API
- Docker e containers
- Plugins e configs do Obsidian
- VS Code e PATH
- SSH e acesso remoto
- Regex
- Plugin Estudos Dashboard
- Manifesto do plugin
- Site de Roadmap (build)
- Ideia: app para TVs
- Ideia: SaaS de RPG

## God Nodes (most connected - your core abstractions)
1. `Roadmap — Tudo que Todo Programador Deve Saber` - 35 edges
2. `VS Code` - 16 edges
3. `Terminal` - 14 edges
4. `Linter` - 13 edges
5. `PowerShell` - 12 edges
6. `Regex` - 12 edges
7. `SSH (Secure Shell)` - 12 edges
8. `Extensões utilizadas (plugins da comunidade)` - 11 edges
9. `Formatter` - 11 edges
10. `Bash` - 10 edges

## Surprising Connections (you probably didn't know these)
- `XP, níveis e metas de leitura` --semantically_similar_to--> `Sistema de XP e níveis`  [INFERRED] [semantically similar]
  Programação/Ideias de Projetos/Desenvolvimento de Aplicativo para Leitura e Aprendizado Interativo.md → Homepage.md
- `Script de build (parser Markdown → roadmap.json)` --semantically_similar_to--> `parseRoadmap()`  [INFERRED] [semantically similar]
  Programação/Ideias de Projetos/Site de Roadmap para o Vault de Estudos.md → Homepage.md
- `Roadmap — Tudo que Todo Programador Deve Saber` --references--> `Homepage — Estudos modo RPG (dataviewjs)`  [EXTRACTED]
  Programação/00 - Roadmap 🗺️/Roadmap.md → Homepage.md
- `Site de Roadmap para o Vault de Estudos` --references--> `Homepage — Estudos modo RPG (dataviewjs)`  [EXTRACTED]
  Programação/Ideias de Projetos/Site de Roadmap para o Vault de Estudos.md → Homepage.md
- `Conquistas (achievements)` --references--> `Plataforma de Matchmaking para Duos em Jogos (Duo Finder)`  [INFERRED]
  Homepage.md → Programação/Ideias de Projetos/Plataforma de Matchmaking para Duos em Jogos.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Cálculo de XP da Homepage a partir do vault** — homepage_stats, homepage_levelfor, homepage_diarydates, homepage_nivelof, homepage_revisadoof, homepage_parseroadmap, homepage_parseguia [EXTRACTED 1.00]
- **Ciclo de estudo do vault (Homepage, Roadmap, Template, Diário, Projeto-guia)** — homepage_homepage_rpg_dashboard, programação_00___roadmap____roadmap_roadmap, programação_template_template_template_nota, programação_template_diário_diario_template, homepage_projeto_guia, readme_metodo_de_estudo [INFERRED 0.85]
- **Pipeline de build do site de roadmap** — programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_build_script, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_roadmap_json, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_github_actions, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_github_pages [EXTRACTED 1.00]
- **Toolchain de qualidade de código (linter + formatter + devDependencies)** — programação_01___ferramentas_linter_readme, programação_01___ferramentas_formatter_readme, programação_01___ferramentas_gerenciador_de_pacotes_readme_dependencies_vs_devdependencies, programação_01___ferramentas_formatter_readme_eslint_config_prettier [INFERRED 0.85]
- **Clientes de API para testar requisições** — programação_01___ferramentas_postman_readme, programação_01___ferramentas_insomnia_readme, programação_01___ferramentas_postman_readme_jsonplaceholder, programação_01___ferramentas_insomnia_readme_ambientes, programação_01___ferramentas_postman_readme_ambientes_e_variaveis [INFERRED 0.85]
- **Redução de tamanho de imagem Docker** — programação_25___devops_docker_readme_multi_stage_build, programação_25___devops_docker_readme_dockerignore, programação_25___devops_docker_readme_layer_cache, programação_25___devops_docker_readme_imagem [EXTRACTED 1.00]
- **Fluxo de autenticação SSH por chave** — programação_01___ferramentas_ssh_readme_par_de_chaves, programação_01___ferramentas_ssh_readme_ssh_agent_passphrase, programação_01___ferramentas_ssh_readme_permissoes_700_600, programação_01___ferramentas_ssh_readme_ssh_config, programação_01___ferramentas_ssh_readme_known_hosts [EXTRACTED 1.00]
- **Sintaxe essencial de Regex (80% do uso)** — programação_01___ferramentas_regex_readme_classes_de_caracteres, programação_01___ferramentas_regex_readme_quantificadores, programação_01___ferramentas_regex_readme_ancoras, programação_01___ferramentas_regex_readme_grupos_e_alternancia [EXTRACTED 1.00]

## Communities (15 total, 2 thin omitted)

### Community 0 - "Homepage RPG e sistema de estudo"
Cohesion: 0.07
Nodes (29): Conquistas (achievements), Homepage — Estudos modo RPG (dataviewjs), loadQuestions(), Mapa do mundo (regiões do Roadmap), Missões de revisão (revisão semanal), nivelOf(), openDiary(), parseGuia() (+21 more)

### Community 1 - "Seções do Roadmap"
Cohesion: 0.06
Nodes (35): 5. Algoritmos, 23. Arquitetura de Computadores, 19. Arquitetura de Software, 13. Banco de Dados, 7. Clean Code, 24. Compiladores, 6. Complexidade, 28. Conceitos Gerais (+27 more)

### Community 2 - "Formatação e pacotes"
Cohesion: 0.08
Nodes (24): Formatter, Black, eslint-config-prettier, Formatar ao salvar (editor.formatOnSave), gofmt, Prettier, .prettierrc / .prettierignore, Gerenciador de Pacotes (+16 more)

### Community 3 - "Shells: Bash e PowerShell"
Cohesion: 0.09
Nodes (24): Bash, ~/.bashrc (aliases e variáveis), Brian Fox (criador do Bash, 1989, GNU), Finais de linha CRLF vs LF, Pipes e redirecionamentos, Shebang (#!/usr/bin/env bash), ShellCheck, Variáveis e substituição de comando $(...) (+16 more)

### Community 4 - "DevTools e clientes de API"
Cohesion: 0.09
Nodes (23): DevTools, Aba Application (localStorage, cookies), Aba Console, Device Toolbar (modo responsivo), Aba Elements (DOM e CSS), Firebug, Performance e Lighthouse, Aba Network (+15 more)

### Community 5 - "Docker e containers"
Cohesion: 0.13
Nodes (12): Docker, Container Docker, docker-compose.yml, Docker Hub, Dockerfile, .dockerignore, Imagem Docker, Kubernetes (orquestração) (+4 more)

### Community 6 - "Plugins e configs do Obsidian"
Cohesion: 0.14
Nodes (15): Banners (obsidian-banners), Editing Toolbar, Excalidraw (obsidian-excalidraw-plugin), Extensões utilizadas (plugins da comunidade), Hider (obsidian-hider), Homepage plugin, Iconize (obsidian-icon-folder), Kanban (obsidian-kanban) (+7 more)

### Community 7 - "VS Code e PATH"
Cohesion: 0.15
Nodes (14): $PROFILE (perfil do usuário), PATH (command not found), VS Code, Comando code . no PATH, Command Palette (Ctrl+Shift+P), Debugger (F5, launch.json), Electron, Extension Bisect (+6 more)

### Community 8 - "SSH e acesso remoto"
Cohesion: 0.16
Nodes (13): SSH (Secure Shell), Cliente ssh e servidor sshd (porta 22), Autenticação SSH no GitHub, Fingerprint e known_hosts, OpenSSH, Permissões ~/.ssh 700 / chave 600, Túnel / port forwarding (ssh -L), scp / sftp (transferência de arquivos) (+5 more)

### Community 9 - "Regex"
Cohesion: 0.18
Nodes (11): Regex, Padrão de CEP ^\d{5}-\d{3}$, Classes de caracteres (\d \w \s [a-z]), Flags (i, g, m), Grupos e alternância ((), (?:), |), Mastering Regular Expressions (Jeffrey Friedl), Literais e metacaracteres (. ^ $ \), Quantificadores (* + ? {n,m}) (+3 more)

### Community 10 - "Plugin Estudos Dashboard"
Cohesion: 0.39
Nodes (7): getDashboardData(), makeLink(), onload(), { Plugin, TFolder }, refreshAll(), renderDashboard(), scheduleRefresh()

### Community 11 - "Manifesto do plugin"
Cohesion: 0.25
Nodes (7): author, description, id, isDesktopOnly, minAppVersion, name, version

### Community 12 - "Site de Roadmap (build)"
Cohesion: 0.32
Nodes (8): parseRoadmap(), 25. DevOps, Script de build (parser Markdown → roadmap.json), GitHub Actions (build automático), GitHub Pages, gray-matter, roadmap.json, Site de Roadmap para o Vault de Estudos

## Knowledge Gaps
- **116 isolated node(s):** `Banners (obsidian-banners)`, `Editing Toolbar`, `Excalidraw (obsidian-excalidraw-plugin)`, `Git (obsidian-git)`, `Hider (obsidian-hider)` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `VS Code` connect `VS Code e PATH` to `SSH e acesso remoto`, `Regex`, `Formatação e pacotes`, `Shells: Bash e PowerShell`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `VS Code` (e.g. with `Formatter` and `Linter`) actually correct?**
  _`VS Code` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Banners (obsidian-banners)`, `Editing Toolbar`, `Excalidraw (obsidian-excalidraw-plugin)` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage RPG e sistema de estudo` be split into smaller, more focused modules?**
  _Cohesion score 0.07357357357357357 - nodes in this community are weakly interconnected._
- **Why does `SSH (Secure Shell)` connect `SSH e acesso remoto` to `VS Code e PATH`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Terminal` (e.g. with `Permissões ~/.ssh 700 / chave 600` and `Terminal integrado (Ctrl+`)`) actually correct?**
  _`Terminal` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Seções do Roadmap` be split into smaller, more focused modules?**
  _Cohesion score 0.06218487394957983 - nodes in this community are weakly interconnected._
# Graph Report - estudos  (2026-11-19)

## Corpus Check
- 183 files · ~269,557 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 8, (none) 6)

## Summary
- 1403 nodes · 2571 edges · 80 communities (77 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 158 edges (avg confidence: 0.83)
- Token cost: 1,147,141 input · 0 output

## Community Hubs (Navigation)
- Gerador do site (build.ts)
- Plugin: modelo de dados
- Plugin: dependências e build
- Estudos RPG: conceitos
- Inglês: tempos verbais e artigos
- Projeto Gerenciador de Tarefas
- Busca binária e linear
- Workflow deploy.yml
- Workflow site.yml
- Plugin: componentes de UI
- Plugin: parser das notas
- Arrays e filas
- Plugin: classe principal
- Inglês para devs
- Grafos e caminhos mínimos
- Plugin: utilitários de data
- DevTools do navegador
- Plugin: ações da ficha
- Plugin compilado (main.js)
- Plugin: desenho da ficha
- Formatter
- Entrada e saída
- Datas e fusos horários
- Pilhas e deques
- Heap e BST
- Pronúncia e shadowing
- null, undefined e tipos
- Matrizes e backtracking
- Site: dependências npm
- PowerShell
- Ler mensagens de erro
- Funções e modularização
- Branches e merge
- Git básico
- Interfaces e type aliases
- Configurar projeto TypeScript
- Ler e escrever arquivos
- Conventional Commits
- Plugin: leitura de frontmatter
- Imperativo e pedir ajuda
- Roadmap de programação
- Condicionais e operadores
- Módulos ES
- tsconfig do plugin
- Plural e contáveis
- Bash
- Gerenciador de pacotes
- Promises
- Union-Find e BFS
- Estruturas de Dados do Zero
- Classes e orientação a objetos
- Async e await
- SSH
- Strings e Trie
- Docker e memoization
- Escopo e closures
- Repetição e paradigmas
- Generics
- Plugin: textos da ficha
- Manifest do plugin (Configs)
- Tags e SemVer
- Regex
- Ideias: apps de TV e leitura
- Manifest do plugin (fonte)
- Plugin: progresso e sequência
- Trilha de Inglês
- Nomes e comentários
- Desfazer mudanças no Git
- Rebase e cherry-pick
- Template das notas
- Configs e backup
- Stash
- Plugin: configurações
- Configuração do Obsidian
- Ideia: matchmaking de duos
- Ideia: SaaS de RPG
- Números e datas em inglês
- Tipos de SVG

## God Nodes (most connected - your core abstractions)
1. `Estruturas de Dados do Zero (projeto do Estágio 2)` - 32 edges
2. `EstudosRPG` - 31 edges
3. `Callout [!question] com múltipla escolha [!check]` - 20 edges
4. `Nível A1–A2 · Base` - 20 edges
5. `Linter` - 20 edges
6. `Bash` - 18 edges
7. `Objetos e Arrays no JavaScript` - 18 edges
8. `Verbo To Be` - 17 edges
9. `Ler Documentação` - 17 edges
10. `Siglas Técnicas` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Nível da nota: escrito → praticado → projeto` --semantically_similar_to--> `Níveis CEFR (A1 → C2)`  [INFERRED] [semantically similar]
  Programação/00 - Roadmap 🗺️/Roadmap.md → Inglês/Inglês.md
- `Anki (flashcards com revisão espaçada)` --semantically_similar_to--> `Revisão espaçada (Leitner)`  [INFERRED] [semantically similar]
  Inglês/01 - Técnicas/Sentence Mining.md → .sistema/estudos-rpg/README.md
- `Trilha (nota tipo: trilha) com checklists de tópicos` --semantically_similar_to--> `Script de build que lê headings e checklists`  [INFERRED] [semantically similar]
  README.md → Programação/Ideias de Projetos/Site de Roadmap para o Vault de Estudos.md
- `Artigos (a, an, the)` --implements--> `Callout [!question] com múltipla escolha [!check]`  [INFERRED]
  Inglês/02 - Base (A1-A2)/Artigos (a, an, the).md → .sistema/estudos-rpg/README.md
- `Futuro com Will e Going To` --implements--> `Callout [!question] com múltipla escolha [!check]`  [INFERRED]
  Inglês/02 - Base (A1-A2)/Futuro com Will e Going To.md → .sistema/estudos-rpg/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ciclo de aquisição: input, mineração, output e correção** — inglês_00___método_como_aprender_inglês_ciclo_de_aprendizado, inglês_01___técnicas_input_compreensível, inglês_01___técnicas_leitura_extensiva, inglês_01___técnicas_sentence_mining, inglês_01___técnicas_shadowing, inglês_01___técnicas_output_com_correção [EXTRACTED 1.00]
- **Perguntas Me teste lidas pela Ficha para revisão espaçada** — _sistema_specs_2026_11_17_template_notas_design_me_teste, _sistema_estudos_rpg_readme_callout_question_check, _sistema_specs_2026_11_17_template_notas_plano_parseperguntas, _sistema_estudos_rpg_readme_revisao_espacada_leitner, _sistema_estudos_rpg_readme_ficha_do_heroi [INFERRED 0.85]
- **Backup e restauração do Obsidian com o plugin próprio** — configs_readme_backup_ps1, configs_restaurar, configs_extensões, _sistema_estudos_rpg_readme [EXTRACTED 1.00]
- **Auxiliar carrega pergunta e negativa (be, do/does/did)** — inglês_02___base__a1_a2__perguntas_e_negativas_verbo_auxiliar_do_does_did, inglês_02___base__a1_a2__verbo_to_be_pergunta_e_negativa_sem_do, inglês_02___base__a1_a2__presente_simples_vai_e_volta_do_s, inglês_02___base__a1_a2__present_continuous_be_ing [INFERRED 0.85]
- **Toolchain inicial de projeto JS (npm, devDependencies, Prettier, CI)** — programação_01___ferramentas_gerenciador_de_pacotes_gerenciador_de_pacotes_npm, programação_01___ferramentas_gerenciador_de_pacotes_gerenciador_de_pacotes_dependencies_vs_devdependencies, programação_01___ferramentas_formatter_formatter_prettier, programação_01___ferramentas_formatter_formatter_format_on_save, programação_01___ferramentas_formatter_formatter_prettier_check_na_ci, programação_01___ferramentas_gerenciador_de_pacotes_gerenciador_de_pacotes_npm_ci [INFERRED 0.85]
- **Pronúncia pelo dicionário: IPA, schwa e sílaba forte** — inglês_02___base__a1_a2__sons_do_inglês_e_ipa_ipa, inglês_02___base__a1_a2__sons_do_inglês_e_ipa_schwa, inglês_02___base__a1_a2__word_stress_sílaba_forte, inglês_02___base__a1_a2__word_stress_marca_de_stress_no_dicionário, inglês_02___base__a1_a2__sons_do_inglês_e_ipa_cambridge_dictionary [INFERRED 0.85]
- **Sequência, decisão e repetição viram código** — programação_02___fundamentos_lógica_de_programação_lógica_de_programação_sequencia_decisao_repeticao, programação_02___fundamentos_estruturas_condicionais_estruturas_condicionais_if_else_if, programação_02___fundamentos_estruturas_de_repetição_estruturas_de_repetição_for_of, programação_02___fundamentos_estruturas_de_repetição_estruturas_de_repetição_while [EXTRACTED 1.00]
- **Separar regras puras dos efeitos (I/O nas bordas)** — programação_02___fundamentos_funções_funções_funcao_pura, programação_02___fundamentos_modularização_modularização_regras_sem_io, programação_02___fundamentos_modularização_modularização_main_orquestra, programação_02___fundamentos_paradigmas_de_programação_paradigmas_de_programação_funcional [INFERRED 0.85]
- **Armadilhas de coerção de tipos em JavaScript** — programação_02___fundamentos_operadores_e_expressões_operadores_e_expressões_igualdade_estrita, programação_02___fundamentos_operadores_e_expressões_operadores_e_expressões_truthy_falsy, programação_02___fundamentos_variáveis_e_tipos_de_dados_variáveis_e_tipos_de_dados_coercao_concatenacao, programação_02___fundamentos_entrada_e_saída_entrada_e_saída_entrada_e_texto, programação_01___ferramentas_linter_linter_eqeqeq [INFERRED 0.85]
- **Ferramentas para lidar com null/undefined** — programação_03___typescript_null_e_undefined_null_e_undefined_strictnullchecks, programação_03___typescript_null_e_undefined_null_e_undefined_optional_chaining, programação_03___typescript_null_e_undefined_null_e_undefined_nullish_coalescing, programação_03___typescript_null_e_undefined_null_e_undefined_non_null_assertion, programação_03___typescript_configurando_um_projeto_typescript_configurando_um_projeto_typescript_strict_true [EXTRACTED 1.00]
- **Pipeline de hooks com Husky, lint-staged e commitlint** — programação_04___git_git_hooks_git_hooks_husky, programação_04___git_git_hooks_git_hooks_lint_staged, programação_04___git_git_hooks_git_hooks_commitlint, programação_04___git_git_hooks_git_hooks_pre_commit [EXTRACTED 1.00]
- **Fluxos de branches: GitHub Flow, Git Flow, Trunk-Based** — programação_04___git_git_flow_git_flow_github_flow, programação_04___git_git_flow_git_flow, programação_04___git_git_flow_git_flow_trunk_based [EXTRACTED 1.00]
- **Evitar shift O(n): filas e deques eficientes** — programação_05___estruturas_de_dados_filas_filas_fila_com_indice_de_inicio, programação_05___estruturas_de_dados_deque_deque_buffer_circular, programação_05___estruturas_de_dados_arrays_arrays_custo_shift_unshift, programação_05___estruturas_de_dados_arrays_arrays_array_dinamico [INFERRED 0.85]
- **Travessias de grafo apoiadas em Set de visitados e fila** — programação_06___algoritmos_bfs__busca_em_largura__bfs__busca_em_largura__bfs, programação_05___estruturas_de_dados_set_set_set_de_visitados, programação_05___estruturas_de_dados_grafos_grafos_lista_de_adjacencia, programação_06___algoritmos_bfs__busca_em_largura__bfs__busca_em_largura__marcar_ao_enfileirar [INFERRED 0.85]
- **Árvore binária, BST e árvores balanceadas** — programação_05___estruturas_de_dados_árvore_binária_árvore_binária, programação_05___estruturas_de_dados_árvore_binária_de_busca__bst__árvore_binária_de_busca__bst_, programação_05___estruturas_de_dados_árvores_balanceadas__avl_e_rubro_negra__árvores_balanceadas__avl_e_rubro_negra_, programação_05___estruturas_de_dados_árvores_balanceadas__avl_e_rubro_negra__árvores_balanceadas__avl_e_rubro_negra__rotacao, programação_05___estruturas_de_dados_árvore_binária_de_busca__bst__árvore_binária_de_busca__bst__degeneracao [EXTRACTED 1.00]
- **Ordenações por comparação (limitadas a O(n log n))** — programação_06___algoritmos_ordenações_simples__bubble__selection__insertion__ordenações_simples__bubble__selection__insertion__bubble_sort, programação_06___algoritmos_ordenações_simples__bubble__selection__insertion__ordenações_simples__bubble__selection__insertion__selection_sort, programação_06___algoritmos_ordenações_simples__bubble__selection__insertion__ordenações_simples__bubble__selection__insertion__insertion_sort, programação_06___algoritmos_merge_sort_merge_sort, programação_06___algoritmos_quick_sort_quick_sort, programação_06___algoritmos_heap_sort_heap_sort, programação_06___algoritmos_ordenações_sem_comparação__counting__radix__ordenações_sem_comparação__counting__radix__limite_inferior_o_n_log_n__para_ordenação_por_comparação [INFERRED 0.85]
- **Algoritmos gulosos com prova de otimalidade** — programação_06___algoritmos_árvore_geradora_mínima__kruskal_e_prim__árvore_geradora_mínima__kruskal_e_prim__kruskal, programação_06___algoritmos_árvore_geradora_mínima__kruskal_e_prim__árvore_geradora_mínima__kruskal_e_prim__prim, programação_06___algoritmos_dijkstra_dijkstra, programação_06___algoritmos_greedy_greedy_agenda_de_reuniões__termina_mais_cedo_primeiro_, programação_06___algoritmos_greedy_greedy_argumento_de_troca, programação_06___algoritmos_árvore_geradora_mínima__kruskal_e_prim__árvore_geradora_mínima__kruskal_e_prim__propriedade_do_corte [EXTRACTED 1.00]
- **Instâncias de dividir e conquistar** — programação_06___algoritmos_busca_binária_busca_binária, programação_06___algoritmos_merge_sort_merge_sort, programação_06___algoritmos_quick_sort_quick_sort, programação_06___algoritmos_divide_and_conquer_divide_and_conquer_potência_rápida, programação_06___algoritmos_divide_and_conquer_divide_and_conquer_receita__caso_base__dividir__combinar [EXTRACTED 1.00]
- **Estruturas mínimas do Estágio 2 implementadas do zero** — programação_ideias_de_projetos_estruturas_de_dados_do_zero_pilha, programação_ideias_de_projetos_estruturas_de_dados_do_zero_fila, programação_ideias_de_projetos_estruturas_de_dados_do_zero_tabelahash, programação_ideias_de_projetos_estruturas_de_dados_do_zero_arvorebusca [EXTRACTED 1.00]
- **Pipeline Markdown, parser, roadmap.json, GitHub Pages** — programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_script_build_parser, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_roadmap_json, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_github_pages_actions, programação_ideias_de_projetos_site_de_roadmap_para_o_vault_de_estudos_frontmatter_status_publicar [EXTRACTED 1.00]
- **Ciclo de estudo: recuperação ativa, repetição espaçada, Feynman, Ficha** — readme_recuperacao_ativa, readme_repeticao_espacada, readme_tecnica_feynman, readme_ficha_do_heroi_estudos_rpg, templates_template_me_teste_callouts [INFERRED 0.85]

## Communities (80 total, 3 thin omitted)

### Community 0 - "Gerador do site (build.ts)"
Cohesion: 0.06
Nodes (55): acharArquivo(), acharPagina(), anotarQuebrado(), Arquivo, arquivos, arvore, blockquote(), cadernos (+47 more)

### Community 1 - "Plugin: modelo de dados"
Cohesion: 0.07
Nodes (15): obsidian, Conquista, Progresso, NotaEstudo, Topico, Dados, ConquistasModal, Acoes (+7 more)

### Community 2 - "Plugin: dependências e build"
Cohesion: 0.06
Nodes (32): esbuild, @hackernoon/pixel-icon-library, @types/node, typescript, backupDir, here, pluginDir, watch (+24 more)

### Community 3 - "Estudos RPG: conceitos"
Cohesion: 0.10
Nodes (34): Estudos RPG plugin README, Callout [!question] com múltipla escolha [!check], Conquistas (CONQUISTAS em progress.ts), Cronômetro de sessão de estudo, Ficha do herói, Nota de trilha (tipo: trilha), Diário 2026-11-19, Como Aprender Inglês (+26 more)

### Community 4 - "Inglês: tempos verbais e artigos"
Cohesion: 0.08
Nodes (40): Artigos (a, an, the), A ou an pelo som, Pergunta: quem ouve sabe exatamente qual? (the / a / nada), Futuro com Will e Going To, Will × going to (quando você decidiu?), Passado Simples, Did leva o passado (marca uma vez só), Pronúncia do -ed (/t/, /d/, /ɪd/) (+32 more)

### Community 5 - "Projeto Gerenciador de Tarefas"
Cohesion: 0.07
Nodes (35): Testes com node:test e node:assert, Gerenciador de Tarefas no Terminal (projeto do Estágio 1), armazenamento.ts: carregar/salvar tarefas.json, Comando como união discriminada com switch exaustivo, Comandos add/list/done/remove/stats, Conventional Commits, Escrita atômica do JSON, regras.ts: funções puras sem efeito colateral (+27 more)

### Community 6 - "Busca binária e linear"
Cohesion: 0.09
Nodes (30): Busca Binária, git bisect, Lower bound (achar a fronteira), Busca Linear, Métodos de array como busca linear (includes, find, some, filter), Divide and Conquer, Teorema Mestre, Heap Sort (+22 more)

### Community 7 - "Workflow deploy.yml"
Cohesion: 0.05
Nodes (38): defaults, permissions, runs-on, steps, concurrency, cancel-in-progress, group, run (+30 more)

### Community 8 - "Workflow site.yml"
Cohesion: 0.06
Nodes (35): defaults, runs-on, steps, concurrency, cancel-in-progress, group, run, environment (+27 more)

### Community 9 - "Plugin: componentes de UI"
Cohesion: 0.13
Nodes (31): Atalho, barra(), botao(), icone(), ornamento(), painel(), TECLAS, Variante (+23 more)

### Community 10 - "Plugin: parser das notas"
Cohesion: 0.12
Nodes (23): alternarCheckbox(), juntar(), limparTitulo(), parsePerguntas(), parseTrilha(), PerguntaLida, aposLembrar(), caixaMax() (+15 more)

### Community 11 - "Arrays e filas"
Cohesion: 0.10
Nodes (29): Arrays, Array dinâmico (dobra capacidade), Custo O(n) de shift/unshift, Memória contígua e acesso O(1), Erro off-by-one, Filas, FIFO, Fila com duas pilhas (+21 more)

### Community 12 - "Plugin: classe principal"
Cohesion: 0.17
Nodes (3): EstudosRPG, AbaConfig, Writer

### Community 13 - "Inglês para devs"
Cohesion: 0.11
Nodes (25): Simples (sempre) × continuous (agora/temporário), Presente simples na documentação técnica (map returns...), Inglês em Commits, Issues e PRs, Descrição de PR: What, Why, How to test, Issue de feature: Problem, Proposal, Alternatives, Ler Documentação, Como ler uma API Reference (assinatura, Parameters, Return value, Exceptions), Changelog / breaking changes (+17 more)

### Community 14 - "Grafos e caminhos mínimos"
Cohesion: 0.11
Nodes (24): Grafos, DAG (grafo dirigido acíclico), Grafo escondido no problema, Lista de adjacência, Matriz de adjacência, Dirigido, peso, ciclo, componentes, grau, Bellman-Ford e Floyd-Warshall, bellmanFord() (+16 more)

### Community 15 - "Plugin: utilitários de data"
Cohesion: 0.17
Nodes (24): addDias(), diaDaSemana(), diffDias(), hojeISO(), parseISO(), relativo(), toISO(), avaliarConquistas() (+16 more)

### Community 16 - "DevTools do navegador"
Cohesion: 0.10
Nodes (24): DevTools, Aba Application (localStorage, cookies), Aba Console, Copy as cURL, Disable cache / Preserve log, Edições nas DevTools são temporárias, Aba Elements (DOM e Styles), Lighthouse (+16 more)

### Community 17 - "Plugin: ações da ficha"
Cohesion: 0.14
Nodes (25): abrirFicha(), abrirNoCentro(), anunciar(), aposEsquecer(), aposLembrar(), atualizarAgora(), atualizarStatus(), avaliarConquistas() (+17 more)

### Community 18 - "Plugin compilado (main.js)"
Cohesion: 0.12
Nodes (15): alternarCheckbox(), alternarLinha(), arquivo(), attr(), caminhos(), desenharPixel(), diario(), display() (+7 more)

### Community 19 - "Plugin: desenho da ficha"
Cohesion: 0.15
Nodes (24): atalho(), barra(), botao(), descConquista(), desenhar(), desenharLista(), ficha(), icone() (+16 more)

### Community 20 - "Formatter"
Cohesion: 0.11
Nodes (20): Formatter, Black / Ruff (Python), eslint-config-prettier, Formatter opinativo (poucas opções de propósito), Formatter (forma) × linter (conteúdo), gofmt, Prettier, Linter (+12 more)

### Community 21 - "Entrada e saída"
Cohesion: 0.10
Nodes (20): Entrada e Saída, Number() e Number.isNaN, process.argv.slice(2), readline/promises (rl.question, rl.close), stdout vs stderr (console.log / console.error), if / else if / else (primeiro verdadeiro vence), 0.1 + 0.2 !== 0.3, while / do...while (+12 more)

### Community 22 - "Datas e fusos horários"
Cohesion: 0.10
Nodes (18): Datas e Fusos Horários, Bug do toISOString após 21h, Date como timestamp (ms desde 1970 UTC), Intl.DateTimeFormat / RelativeTimeFormat, ISO 8601, Mês do Date começa em 0, Temporal API / date-fns / Luxon, Texto de data sem fuso é ambíguo (+10 more)

### Community 23 - "Pilhas e deques"
Cohesion: 0.12
Nodes (21): Deque, Buffer circular, Máximo da janela deslizante com deque, Padrão "os últimos N", Pilhas, Call stack e recursão como pilha explícita, LIFO, Parênteses balanceados (+13 more)

### Community 24 - "Heap e BST"
Cohesion: 0.14
Nodes (21): Heap (Estrutura de Dados), Árvore completa guardada em array, Fila de prioridade, Os K maiores com min-heap de tamanho K, MinHeap, Árvore Binária de Busca (BST), ArvoreBusca, Degeneração da BST com inserção ordenada (+13 more)

### Community 25 - "Pronúncia e shadowing"
Cohesion: 0.12
Nodes (18): Quatro etapas do shadowing (ouvir → ler → sombrear → gravar), Pares Mínimos, Contraste /r/ × /h/ (r de rato soa como h), Sons do Inglês e IPA, Cambridge Dictionary, Vício do "i" extra no fim das palavras (Facebook-i), IPA (Alfabeto Fonético Internacional), R de "rato" soa como h (red → head) (+10 more)

### Community 26 - "null, undefined e tipos"
Cohesion: 0.14
Nodes (18): null e undefined, Non-null assertion (!), null, Optional chaining (?.), Tipos Básicos do TypeScript, as const + (typeof LISTA)[number], string / number / boolean, Tupla (+10 more)

### Community 27 - "Matrizes e backtracking"
Cohesion: 0.14
Nodes (19): Matrizes, Armadilha do Array.fill com arrays, Jogo da Vida de Conway, m[linha][coluna], Transpor e girar 90°, Vizinhos com array de direções e checagem de borda, Backtracking, Árvore de escolhas (+11 more)

### Community 28 - "Site: dependências npm"
Cohesion: 0.13
Nodes (19): @fontsource/caveat, @fontsource-variable/jetbrains-mono, @fontsource-variable/literata, highlight.js, marked, dependencies, @fontsource/caveat@5.2.5, @fontsource-variable/jetbrains-mono@5.2.5 (+11 more)

### Community 29 - "PowerShell"
Cohesion: 0.13
Nodes (14): PowerShell, Aliases (ls → Get-ChildItem), Cmdlets Verbo-Substantivo, Execution Policy (RemoteSigned), Get-Command / Get-Help / Get-Member, $PROFILE, grep (g/re/p), Terminal (+6 more)

### Community 30 - "Ler mensagens de erro"
Cohesion: 0.14
Nodes (14): Palavras das mensagens de erro (timed out, unexpected token, not found), for clássico e off-by-one, for...of, Ler Mensagens de Erro, Erros comuns (TypeError, ReferenceError, RangeError, ENOENT...), Erros do TypeScript (TS2345), Roteiro para quando travar, Pilha de chamadas no erro (stack trace) (+6 more)

### Community 31 - "Funções e modularização"
Cohesion: 0.14
Nodes (13): Funções, Arrow function e retorno implícito, Parâmetro vs argumento, Parâmetros padrão e opcionais / objeto de opções, Uma função, uma tarefa, Modularização, Import circular, Interface pública vs detalhes escondidos (+5 more)

### Community 32 - "Branches e merge"
Cohesion: 0.15
Nodes (12): Branches, Merge e Conflitos, Branch (ponteiro para commit), Merge fast-forward, git merge --abort, Merge commit, git reflog, Git Flow, Feature flag (+4 more)

### Community 33 - "Git básico"
Cohesion: 0.14
Nodes (14): Conflito de merge e marcadores, git restore, Git Básico, Commit, Commit bom, Git (controle de versão distribuído), git config inicial, .gitignore (+6 more)

### Community 34 - "Interfaces e type aliases"
Cohesion: 0.16
Nodes (13): Interfaces e Type Aliases, Declaration merging, interface, Propriedade opcional (?), readonly, Record<K, V>, Tipagem estrutural, type alias (+5 more)

### Community 35 - "Configurar projeto TypeScript"
Cohesion: 0.15
Nodes (12): Configurando um Projeto TypeScript, Dependência de desenvolvimento (-D), noUncheckedIndexedAccess, @types/node, JavaScript e TypeScript, Inferência de tipos, tsc (compilador), Tipos são apagados na compilação (+4 more)

### Community 36 - "Ler e escrever arquivos"
Cohesion: 0.16
Nodes (14): Ler e Escrever Arquivos, ENOENT (arquivo não existe), node:fs/promises, path.join, Versões síncronas (readFileSync), writeFile vs appendFile, Node.js, Versão LTS (+6 more)

### Community 37 - "Conventional Commits"
Cohesion: 0.16
Nodes (12): Conventional Commits, BREAKING CHANGE / tipo!, Corpo do commit explica o porquê, feat vs fix, Formato tipo(escopo): descrição, release-please / semantic-release, Git Hooks, commitlint (+4 more)

### Community 38 - "Plugin: leitura de frontmatter"
Cohesion: 0.18
Nodes (13): construir(), fm(), hojeISO(), limparTitulo(), normalizar2(), num(), parseISO(), parsePerguntas() (+5 more)

### Community 39 - "Imperativo e pedir ajuda"
Cohesion: 0.18
Nodes (8): Imperativo, Mensagens de commit no imperativo, Do imperativo direto ao Could you...?, Pedir Ajuda e Esclarecimento, Sorry, could you say that again?, What does X mean? × What do you mean by X?, Issue de bug: Steps to reproduce, Expected, Actual, Environment, Sorry, what does X stand for?

### Community 40 - "Roadmap de programação"
Cohesion: 0.18
Nodes (10): Roadmap de Programação, Estágio 1 · Primeiros passos, Estágio 2 · Pensar como programador, Estágio 3 · Código profissional, Estágio 4 · Web: front-end e back-end, Estágio 5 · Colocar em produção, Estágio 6 · Sistemas maiores, Estágio 7 · Por baixo dos panos (+2 more)

### Community 41 - "Condicionais e operadores"
Cohesion: 0.18
Nodes (9): Regra eqeqeq, Estruturas Condicionais, Objeto de consulta (mapa[chave] ?? padrão), &&, ||, !, Operadores e Expressões, Operador % (resto), Precedência de operadores, Ternário (+1 more)

### Community 42 - "Módulos ES"
Cohesion: 0.15
Nodes (10): Scripts dev/check/build/start, Caminho relativo a process.cwd() / import.meta.dirname, Módulos ES (import e export), Arquivo índice (reexport), CommonJS (require/module.exports), ES Modules (import/export), Import em círculo, import type (+2 more)

### Community 43 - "tsconfig do plugin"
Cohesion: 0.15
Nodes (13): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleResolution, noEmit, noImplicitOverride (+5 more)

### Community 44 - "Plural e contáveis"
Cohesion: 0.21
Nodes (11): Plural e Contáveis × Incontáveis, A few × few / a little × little, Contável × incontável, Data tratado como incontável (data is), Incontáveis traiçoeiros de dev (code, feedback, information, advice, software), Much × many × a lot of, Plurais irregulares (children, people, criteria), Its × it's (o apóstrofo esconde um verbo) (+3 more)

### Community 45 - "Bash"
Cohesion: 0.18
Nodes (10): Bash, Atribuição sem espaços (nome="valor"), ~/.bashrc (aliases e configuração), chmod +x (permissão de execução), Quebra de linha CRLF × LF (erro ^M), Pipe (|), Redirecionamento (> apaga, >> acrescenta, 2>&1), Shebang (#!/usr/bin/env bash) (+2 more)

### Community 46 - "Gerenciador de pacotes"
Cohesion: 0.23
Nodes (10): prettier --check na CI, Gerenciador de Pacotes, Ambiente virtual Python (venv), node_modules fora do Git (.gitignore), npm, npm audit e pacotes maliciosos, npm ci (clean install a partir do lockfile), npm scripts (npm run) (+2 more)

### Community 47 - "Promises"
Cohesion: 0.17
Nodes (12): Parâmetro de tipo <T>, Promises, Pirâmide de callbacks, Estados: pendente/resolvida/rejeitada, Ordem: código síncrono, microtasks, timers, Promise, Promise.all, Promise.allSettled / race / any (+4 more)

### Community 48 - "Union-Find e BFS"
Cohesion: 0.23
Nodes (11): Union-Find (Disjoint Set), Compressão de caminho, Detecção de ciclo com Union-Find, Inversa de Ackermann α(n), União por tamanho, UnionFind, BFS (Busca em Largura), bfs() (+3 more)

### Community 49 - "Estruturas de Dados do Zero"
Cohesion: 0.23
Nodes (11): Estruturas de Dados do Zero (projeto do Estágio 2), ArvoreBusca (BST), benchmark.ts: Fila vs array.shift(), Fila<T> em O(1) sem shift, Grafo com BFS, DFS e Dijkstra (bônus), ListaLigada<T> com inverter (bônus), MinHeap e fila de prioridade (bônus), Pilha<T> (+3 more)

### Community 50 - "Classes e orientação a objetos"
Cohesion: 0.18
Nodes (10): Orientação a objetos, Classes no TypeScript, Classe vs instância, constructor, Getter (get), Herança (extends / super), implements interface, Parameter properties (constructor(public x)) (+2 more)

### Community 51 - "Async e await"
Cohesion: 0.20
Nodes (7): Regra no-floating-promises, Código de saída (process.exitCode), Async e Await, await esquecido (Promise truthy), await pausa só a função, forEach não espera async, Top-level await / main().catch

### Community 52 - "SSH"
Cohesion: 0.22
Nodes (8): SSH, Assinatura de commits com SSH (Verified), authorized_keys, scp, ssh-agent e passphrase, ~/.ssh/config (apelidos), ssh-keygen -t ed25519, Túnel SSH (ssh -L)

### Community 53 - "Strings e Trie"
Cohesion: 0.24
Nodes (10): Strings, Contagem de frequência com Map, Imutabilidade de strings, localeCompare pt-BR, Normalização (NFD, sem acentos), length conta unidades UTF-16, Trie, Trie (árvore de prefixos) (+2 more)

### Community 54 - "Docker e memoization"
Cohesion: 0.20
Nodes (9): Top-down com memoization, Docker, .dockerignore, Docker Compose, Dockerfile, Imagem vs container, Mapeamento de portas (-p PC:CONTAINER), Multi-stage build (+1 more)

### Community 55 - "Escopo e closures"
Cohesion: 0.22
Nodes (6): Escopo, Closure, Escopo de bloco (let/const), Shadowing, Zona morta temporal, Callback

### Community 56 - "Repetição e paradigmas"
Cohesion: 0.25
Nodes (7): Estruturas de Repetição, break e continue, for...in vs for...of, Laço infinito, Paradigmas de Programação, Paradigma declarativo, Paradigma imperativo

### Community 57 - "Generics"
Cohesion: 0.22
Nodes (7): Generics, keyof e T[K], RepositorioMemoria<T> (classe genérica), Restrição <T extends X>, Resultado<T>, Map, Tipos literais

### Community 58 - "Plugin: textos da ficha"
Cohesion: 0.32
Nodes (8): alternativas(), dicaCaixa(), diffDias(), infoRevisao(), md(), ornamento(), relativo(), revisao()

### Community 59 - "Manifest do plugin (Configs)"
Cohesion: 0.25
Nodes (7): author, description, id, isDesktopOnly, minAppVersion, name, version

### Community 60 - "Tags e SemVer"
Cohesion: 0.43
Nodes (8): Intervalos de versão ^ e ~ (SemVer), Tags e Versionamento Semântico, Tag anotada (git tag -a), GitHub Release, Intervalos ^ e ~ do npm, npm version patch/minor/major, Versionamento Semântico (SemVer), Versão 0.x e pré-lançamento

### Community 61 - "Regex"
Cohesion: 0.25
Nodes (6): Regex, Classes de caracteres (\d, \w, ., [a-z]), Flags i/g/m, Grupos de captura ($1, $2), Quantificadores (gulosos vs preguiçosos), regex101.com

### Community 62 - "Ideias: apps de TV e leitura"
Cohesion: 0.25
Nodes (7): Plataforma de Gerenciamento de Conteúdo para Televisões, Pareamento de televisões, Playlists e agendamento de conteúdo, Reprodutor com cache offline, Aplicativo de Leitura e Aprendizado Interativo, Flashcards e revisão baseada em erros, XP, níveis e metas de leitura

### Community 63 - "Manifest do plugin (fonte)"
Cohesion: 0.25
Nodes (7): author, description, id, isDesktopOnly, minAppVersion, name, version

### Community 64 - "Plugin: progresso e sequência"
Cohesion: 0.43
Nodes (7): addDias(), calcularProgresso(), cronica(), diaDaSemana(), maiorSequencia(), nivelPara(), sequencia()

### Community 65 - "Trilha de Inglês"
Cohesion: 0.38
Nodes (6): Trilha de Inglês, Nível B1 · Independente, Nível B2+ · Fluência, Níveis CEFR (A1 → C2), Em paralelo (Matemática e Soft Skills), Nível da nota: escrito → praticado → projeto

### Community 66 - "Nomes e comentários"
Cohesion: 0.33
Nodes (5): Nomes e Comentários, camelCase / PascalCase / UPPER_SNAKE_CASE, Comentário de documentação /** */, Número mágico, Regras de nomes (substantivo/verbo, booleano como pergunta, unidade no nome)

### Community 67 - "Desfazer mudanças no Git"
Cohesion: 0.38
Nodes (6): Desfazendo Mudanças (Reset e Revert), git commit --amend, git clean, git reset (--soft/--mixed/--hard), git revert, git reflog

### Community 68 - "Rebase e cherry-pick"
Cohesion: 0.48
Nodes (6): Rebase e Cherry Pick, git cherry-pick, fixup / --autosquash, git push --force-with-lease, git rebase, Rebase interativo (rebase -i)

### Community 69 - "Template das notas"
Cohesion: 0.47
Nodes (5): Template novo das notas: design, Seção 🧠 Me teste, Seções opcionais (Pratique, Projeto, Consulta rápida, Pra ir além, Diário), Template novo das notas: plano, parsePerguntas (parser do plugin)

### Community 70 - "Configs e backup"
Cohesion: 0.40
Nodes (5): Extensões e configurações, Snippet estudos-rpg-notas.css, Configs: backup e restauração do Obsidian, backup.ps1, Git Credential Manager

### Community 71 - "Stash"
Cohesion: 0.60
Nodes (6): Stash, git stash, git stash branch, Pilha de stashes (stash@{n}), stash pop vs apply, git stash push -u

### Community 72 - "Plugin: configurações"
Cohesion: 0.53
Nodes (4): DEFAULT_SETTINGS, listaDe(), mergeSettings(), XPConfig

### Community 73 - "Configuração do Obsidian"
Cohesion: 0.40
Nodes (4): alwaysUpdateLinks, newFileLocation, promptDelete, showUnsupportedFiles

### Community 74 - "Ideia: matchmaking de duos"
Cohesion: 0.50
Nodes (5): Plataforma de Matchmaking para Duos em Jogos, Avaliação, denúncia e bloqueio, Chat entre jogadores, Compatibilidade entre perfis (rank, função, região, horário), Sistema de curtidas e matches

### Community 75 - "Ideia: SaaS de RPG"
Cohesion: 0.40
Nodes (5): Plataforma SaaS para Criação de RPGs Personalizados, Colaboração e histórico de versões, Editor visual no-code de mundos, cenas e diálogos, Regras de dados e combate personalizáveis, Stack: Next.js, Node.js, PostgreSQL, WebSocket

### Community 76 - "Números e datas em inglês"
Cohesion: 0.50
Nodes (3): Números, Datas e Horas, Data americana (mês/dia/ano) e ISO 8601, -teen × -ty pela sílaba forte

## Ambiguous Edges - Review These
- `Aplicativo de Leitura e Aprendizado Interativo` → `Reprodutor com cache offline`  [AMBIGUOUS]
  Programação/Ideias de Projetos/Desenvolvimento de Aplicativo para Gerenciamento de Conteúdo em Televisões.md · relation: conceptually_related_to
- `Montar heap de baixo pra cima em O(n)` → `Amortizado vs médio vs pior caso`  [AMBIGUOUS]
  Programação/06 - Algoritmos/Heap Sort/Heap Sort.md · relation: conceptually_related_to

## Knowledge Gaps
- **300 isolated node(s):** `Diário 2026-11-19`, `Seções opcionais (Pratique, Projeto, Consulta rápida, Pra ir além, Diário)`, `Git Credential Manager`, `Ciclo input → noticing → output → correção → revisão`, `Proporção 70/20/10` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 516 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Inglês em Commits, Issues e PRs` connect `Inglês para devs` to `Git básico`, `Estudos RPG: conceitos`, `Projeto Gerenciador de Tarefas`, `Conventional Commits`, `Imperativo e pedir ajuda`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `Callout [!question] com múltipla escolha [!check]` (e.g. with `parsePerguntas (parser do plugin)` and `Como Aprender Inglês`) actually correct?**
  _`Callout [!question] com múltipla escolha [!check]` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Diário 2026-11-19`, `Seções opcionais (Pratique, Projeto, Consulta rápida, Pra ir além, Diário)`, `Git Credential Manager` to the rest of the system?**
  _300 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Gerador do site (build.ts)` be split into smaller, more focused modules?**
  _Cohesion score 0.061581920903954805 - nodes in this community are weakly interconnected._
- **Why does `Gerenciador de Tarefas no Terminal (projeto do Estágio 1)` connect `Projeto Gerenciador de Tarefas` to `Roadmap de programação`, `Inglês para devs`, `Gerenciador de pacotes`, `Funções e modularização`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Aplicativo de Leitura e Aprendizado Interativo` and `Reprodutor com cache offline`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Montar heap de baixo pra cima em O(n)` and `Amortizado vs médio vs pior caso`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
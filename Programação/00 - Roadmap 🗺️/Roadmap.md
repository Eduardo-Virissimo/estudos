# 🗺️ Roadmap — Tudo que Todo Programador Deve Saber

> Marque os conteúdos conforme for estudando. Cada item tem uma explicação curta do "porquê" ao lado.

---

# 🟢 Fundamentos

- [ ] [[Lógica de Programação]] — raciocínio para transformar um problema em passos que o computador executa.
- [ ] [[Pseudocódigo]] — escrever a solução em "português estruturado" antes de codar, pra organizar o raciocínio.
- [ ] [[Variáveis]] — espaços na memória que guardam valores que podem mudar durante a execução.
- [ ] [[Constantes]] — valores guardados na memória que **não** podem ser alterados depois de definidos.
- [ ] [[Tipos de Dados]] — categorias de valores (número, texto, booleano...) que definem o que pode ser feito com eles.
- [ ] [[Operadores]] — símbolos que fazem operações: `+`, `-`, `==`, `&&`, etc. (aritméticos, lógicos, relacionais).
- [ ] [[Conversão de Tipos]] — transformar um tipo em outro (ex: texto "10" virar número 10), implícita ou explícita.
- [ ] [[Entrada e Saída]] — como o programa recebe dados (input) e mostra resultados (output) pro usuário.
- [ ] [[Expressões]] — combinações de valores, variáveis e operadores que resultam em um valor.
- [ ] [[Estruturas Condicionais]] — `if/else/switch`, permitem que o código tome decisões diferentes dependendo da situação.
- [ ] [[Estruturas de Repetição]] — `for/while/do-while`, repetem um bloco de código várias vezes sem reescrevê-lo.
- [ ] [[Funções]] — blocos de código reutilizáveis que executam uma tarefa específica quando chamados.
- [ ] [[Parâmetros]] — valores que uma função recebe de fora para trabalhar com eles internamente.
- [ ] [[Retorno]] — valor que uma função devolve depois de terminar sua execução.
- [ ] [[Escopo]] — define onde uma variável "existe" e pode ser acessada (local, global, de bloco).
- [ ] [[Recursão]] — função que chama a si mesma para resolver um problema quebrando-o em partes menores.
- [ ] [[Modularização]] — dividir o código em arquivos/módulos menores e organizados por responsabilidade.
- [ ] [[Comentários]] — texto explicativo no código que não é executado, serve pra documentar decisões.
- [ ] [[Boas Práticas de Nomenclatura]] — dar nomes claros a variáveis/funções, facilitando a leitura do código.
- [ ] [[Paradigmas de Programação]] — os "estilos" de programar: imperativo, orientado a objetos, funcional, declarativo.

---

# 🟢 Estruturas de Dados

> Formas de organizar dados na memória para acessá-los e manipulá-los de forma eficiente.

- [ ] [[Arrays]] — lista de elementos armazenados em posições contíguas de memória, acessados por índice.
- [ ] [[Matrizes]] — "array de arrays", útil para representar tabelas, grades e imagens.
- [ ] [[Strings]] — sequência de caracteres, tratada como um tipo especial de array na maioria das linguagens.
- [ ] [[Listas Ligadas]] — elementos (nós) conectados por ponteiros, permite inserção/remoção rápida sem realocar memória.
- [ ] [[Pilhas]] — estrutura LIFO (último a entrar, primeiro a sair), usada em undo, chamadas de função, etc.
- [ ] [[Filas]] — estrutura FIFO (primeiro a entrar, primeiro a sair), usada em filas de processamento e buffers.
- [ ] [[Deque]] — fila de duas pontas, permite inserir/remover tanto no início quanto no fim.
- [ ] [[Hash Table]] — armazena pares chave-valor com acesso quase instantâneo via função de hash.
- [ ] [[Set]] — coleção de valores únicos, sem duplicatas, ótima pra checar existência rapidamente.
- [ ] [[Árvore Binária]] — cada nó tem no máximo 2 filhos, base para várias estruturas mais avançadas.
- [ ] [[Árvore Binária de Busca (BST)]] — árvore binária ordenada, onde busca, inserção e remoção são eficientes.
- [ ] [[Árvore AVL]] — árvore binária de busca que se auto-balanceia para manter buscas rápidas sempre.
- [ ] [[Árvore Rubro-Negra]] — outra árvore auto-balanceada, usada internamente em várias bibliotecas (ex: `TreeMap` do Java).
- [ ] [[Heap]] — árvore especial usada para sempre acessar rapidamente o maior/menor elemento (filas de prioridade).
- [ ] [[Trie]] — árvore especializada em armazenar strings, muito usada em autocomplete e correção ortográfica.
- [ ] [[Union-Find (Disjoint Set)]] — estrutura que gerencia grupos de elementos e verifica conexões, usada em grafos.
- [ ] [[Grafos]] — conjunto de nós (vértices) conectados por arestas, modela redes, mapas, relações sociais, etc.

---

# 🟢 Algoritmos

> Sequências de passos bem definidos para resolver um problema específico.

- [ ] [[Busca Linear]] — percorre elemento por elemento até encontrar o que procura; simples, mas lenta em listas grandes.
- [ ] [[Busca Binária]] — divide a busca ao meio repetidamente em listas ordenadas; muito mais rápida que a linear.
- [ ] [[Bubble Sort]] — algoritmo de ordenação simples que "borbulha" o maior valor a cada passagem (didático, pouco eficiente).
- [ ] [[Selection Sort]] — seleciona repetidamente o menor elemento e o coloca na posição correta.
- [ ] [[Insertion Sort]] — insere cada elemento na posição correta da parte já ordenada; bom para listas pequenas/quase ordenadas.
- [ ] [[Merge Sort]] — divide a lista, ordena as partes e depois junta tudo (divide e conquista); estável e previsível.
- [ ] [[Quick Sort]] — escolhe um "pivô" e particiona a lista ao redor dele; rápido na prática, muito usado.
- [ ] [[Heap Sort]] — usa a estrutura Heap para ordenar; garante desempenho consistente mesmo no pior caso.
- [ ] [[Counting Sort]] — conta ocorrências de valores para ordenar sem comparações; rápido quando o intervalo de valores é pequeno.
- [ ] [[Radix Sort]] — ordena números processando dígito por dígito; útil para grandes volumes de inteiros.
- [ ] [[DFS (Busca em Profundidade)]] — explora um grafo/árvore indo o mais fundo possível antes de voltar.
- [ ] [[BFS (Busca em Largura)]] — explora um grafo/árvore nível por nível, útil pra achar o caminho mais curto sem peso.
- [ ] [[Dijkstra]] — encontra o caminho mais curto entre nós em grafos com pesos positivos (ex: rotas no GPS).
- [ ] [[Bellman-Ford]] — como o Dijkstra, mas funciona mesmo com pesos negativos no grafo.
- [ ] [[Floyd-Warshall]] — calcula o caminho mais curto entre **todos** os pares de nós de um grafo.
- [ ] [[Kruskal]] — algoritmo guloso para montar a árvore geradora mínima de um grafo (menor custo total).
- [ ] [[Prim]] — outro algoritmo para árvore geradora mínima, expandindo a árvore a partir de um nó inicial.
- [ ] [[Divide and Conquer]] — estratégia de quebrar o problema em subproblemas menores, resolver e combinar os resultados.
- [ ] [[Backtracking]] — tenta soluções, e "volta atrás" quando percebe que o caminho não vai dar certo (ex: sudoku, N-rainhas).
- [ ] [[Programação Dinâmica]] — resolve problemas guardando resultados de subproblemas já calculados, evitando recomputação.
- [ ] [[Greedy]] — algoritmos gulosos, tomam sempre a melhor decisão local, esperando chegar a um bom resultado global.
- [ ] [[Sliding Window]] — técnica de manter uma "janela" que desliza sobre os dados, útil em problemas de subarray/substring.
- [ ] [[Two Pointers]] — usa dois ponteiros percorrendo a estrutura, muito usado em arrays ordenados e strings.
- [ ] [[Manipulação de Bits]] — operações de baixo nível (AND, OR, XOR, shifts) usadas para otimização e truques de performance.

---

# 🟢 Complexidade

> Como medir o custo (tempo e memória) de um algoritmo conforme a entrada cresce.

- [ ] [[Big O]] — notação que descreve o crescimento do custo de um algoritmo no pior caso (ex: O(n), O(log n)).
- [ ] [[Complexidade Temporal]] — quanto tempo um algoritmo leva para rodar em função do tamanho da entrada.
- [ ] [[Complexidade Espacial]] — quanta memória um algoritmo consome em função do tamanho da entrada.
- [ ] [[Complexidade Amortizada]] — custo médio de uma operação ao longo de várias execuções (ex: array dinâmico que redimensiona).
- [ ] [[Análise Assintótica]] — estudo do comportamento de um algoritmo quando a entrada tende ao infinito.
- [ ] [[Trade-offs Tempo x Espaço]] — decidir entre usar mais memória para ganhar velocidade, ou vice-versa.

---

# 🟢 Git

> Sistema de controle de versão: registra o histórico de mudanças do código e permite trabalho em equipe.

- [ ] [[Git]] — ferramenta de controle de versão distribuído, rastreia todas as mudanças feitas no código.
- [ ] [[GitHub]] — plataforma online que hospeda repositórios Git e adiciona colaboração (PRs, issues, etc).
- [ ] [[Repositórios]] — pasta do projeto onde o Git guarda todo o histórico de versões.
- [ ] [[Commit]] — um "ponto de salvamento" com uma mensagem descrevendo o que mudou no código.
- [ ] [[Branch]] — linha paralela de desenvolvimento, permite trabalhar em algo sem afetar o código principal.
- [ ] [[Merge]] — junta as mudanças de uma branch em outra.
- [ ] [[Rebase]] — reaplica commits de uma branch sobre outra, mantendo o histórico mais limpo/linear.
- [ ] [[Cherry Pick]] — pega um commit específico de outra branch e aplica na branch atual.
- [ ] [[Stash]] — guarda temporariamente mudanças não commitadas para trocar de branch sem perder o trabalho.
- [ ] [[Reset]] — desfaz commits, movendo o ponteiro da branch para trás (pode apagar histórico).
- [ ] [[Revert]] — cria um novo commit que desfaz as mudanças de um commit anterior, sem apagar histórico.
- [ ] [[Tags]] — marca um commit específico como importante (ex: uma versão de release, `v1.0.0`).
- [ ] [[Git Flow]] — modelo de organização de branches (main, develop, feature, release, hotfix) para times.
- [ ] [[Pull Request]] — pedido formal para juntar suas mudanças ao repositório principal, geralmente com revisão de código.
- [ ] [[Conflitos]] — quando duas mudanças concorrentes no mesmo trecho de código precisam ser resolvidas manualmente.
- [ ] [[.gitignore]] — arquivo que define quais arquivos/pastas o Git deve ignorar (ex: `node_modules`, `.env`).
- [ ] [[Git Hooks]] — scripts automáticos disparados em eventos do Git (ex: rodar testes antes de um commit).
- [ ] [[Versionamento Semântico (SemVer)]] — convenção `MAJOR.MINOR.PATCH` para numerar versões de forma que todos entendam o impacto da mudança.

---

# 🟢 Banco de Dados

> Como armazenar, consultar e manter dados de forma organizada e confiável.

- [ ] [[SQL]] — linguagem padrão para consultar e manipular bancos de dados relacionais.
- [ ] [[CRUD]] — as quatro operações básicas de qualquer sistema: Criar, Ler, Atualizar e Deletar dados.
- [ ] [[SELECT]] — comando SQL para buscar/ler dados de uma ou mais tabelas.
- [ ] [[INSERT]] — comando SQL para adicionar novos registros em uma tabela.
- [ ] [[UPDATE]] — comando SQL para modificar registros já existentes.
- [ ] [[DELETE]] — comando SQL para remover registros de uma tabela.
- [ ] [[JOIN]] — combina dados de duas ou mais tabelas relacionadas em uma única consulta.
- [ ] [[GROUP BY]] — agrupa linhas com valores iguais para aplicar funções de agregação (soma, média, contagem).
- [ ] [[HAVING]] — filtra os resultados **depois** de um `GROUP BY` (o `WHERE` filtra antes de agrupar).
- [ ] [[UNION]] — combina o resultado de duas consultas SQL em uma lista só, removendo duplicatas.
- [ ] [[Views]] — consulta salva que se comporta como uma "tabela virtual", simplificando consultas complexas.
- [ ] [[Stored Procedures]] — bloco de código SQL salvo no banco para ser reutilizado/executado sob demanda.
- [ ] [[Triggers]] — código que executa automaticamente quando um evento acontece (ex: antes de um INSERT).
- [ ] [[Índices]] — estrutura que acelera buscas no banco, funciona como o "índice" de um livro.
- [ ] [[Constraints]] — regras que garantem a integridade dos dados (ex: não permitir valores nulos ou duplicados).
- [ ] [[Chave Primária]] — coluna (ou conjunto) que identifica unicamente cada registro de uma tabela.
- [ ] [[Chave Estrangeira]] — coluna que referencia a chave primária de outra tabela, criando relacionamentos.
- [ ] [[Normalização]] — organizar os dados em tabelas para eliminar redundância e evitar inconsistências.
- [ ] [[Desnormalização]] — introduzir redundância de propósito para melhorar performance de leitura.
- [ ] [[Transações]] — conjunto de operações que devem ser executadas todas juntas, ou nenhuma (tudo ou nada).
- [ ] [[ACID]] — garantias de uma transação confiável: Atomicidade, Consistência, Isolamento e Durabilidade.
- [ ] [[Locks]] — travas que impedem que duas operações concorrentes bagunçem os mesmos dados ao mesmo tempo.
- [ ] [[NoSQL]] — bancos de dados não-relacionais, mais flexíveis para dados sem estrutura fixa (documentos, chave-valor, grafos).
- [ ] [[MongoDB]] — banco NoSQL orientado a documentos (JSON/BSON), muito usado por sua flexibilidade de schema.
- [ ] [[Redis]] — banco de dados em memória, super rápido, usado para cache, filas e sessões.
- [ ] [[CAP Theorem]] — teorema que diz que um sistema distribuído só pode garantir 2 de 3: Consistência, Disponibilidade e Tolerância a Partição.
- [ ] [[Replicação]] — manter cópias dos dados em vários servidores para disponibilidade e desempenho.
- [ ] [[Sharding]] — dividir o banco em pedaços (shards) espalhados em servidores diferentes, pra escalar horizontalmente.
- [ ] [[Connection Pooling]] — reutilizar conexões abertas com o banco em vez de abrir/fechar uma nova a cada requisição.
- [ ] [[ORM]] — camada que traduz objetos do código em registros do banco (ex: Prisma, Sequelize, Hibernate).

---

# 🟢 Orientação a Objetos

> Paradigma que organiza o código em torno de "objetos" que combinam dados e comportamento.

- [ ] [[Classes]] — o "molde" que define quais atributos e métodos um objeto terá.
- [ ] [[Objetos]] — instâncias concretas criadas a partir de uma classe.
- [ ] [[Atributos]] — as variáveis que guardam o estado/dados de um objeto.
- [ ] [[Métodos]] — as funções que pertencem a uma classe e definem o comportamento do objeto.
- [ ] [[Construtores]] — método especial chamado automaticamente ao criar um objeto, usado pra inicializar seus dados.
- [ ] [[Encapsulamento]] — esconder os detalhes internos de um objeto, expondo só o que é necessário usar.
- [ ] [[Herança]] — uma classe pode reaproveitar atributos/métodos de outra, criando uma relação de "é um".
- [ ] [[Polimorfismo]] — objetos de classes diferentes respondem de formas diferentes ao mesmo método chamado.
- [ ] [[Abstração]] — focar no que um objeto faz, ignorando os detalhes de como ele faz.
- [ ] [[Interfaces]] — contrato que define quais métodos uma classe deve implementar, sem dizer como.
- [ ] [[Classes Abstratas]] — classe que não pode ser instanciada diretamente, serve de base para outras classes.
- [ ] [[Composição]] — construir objetos combinando outros objetos ("tem um"), em vez de usar herança.
- [ ] [[Agregação]] — tipo de composição mais "solta", onde as partes podem existir independente do todo.

---

# 🟢 Clean Code

> Práticas para escrever código legível, simples e fácil de manter.

- [ ] [[Clean Code]] — conjunto de práticas para escrever código claro, simples e fácil de entender por outras pessoas.
- [ ] [[DRY]] ("Don't Repeat Yourself") — evite duplicar lógica; centralize em um único lugar.
- [ ] [[KISS]] ("Keep It Simple, Stupid") — prefira a solução mais simples possível, evite complexidade desnecessária.
- [ ] [[YAGNI]] ("You Aren't Gonna Need It") — não implemente funcionalidades "pro futuro" que ainda não são necessárias.
- [ ] [[Code Smells]] — sinais de que algo no código pode estar mal projetado, mesmo funcionando (ex: função gigante).
- [ ] [[Refatoração]] — melhorar a estrutura interna do código sem mudar seu comportamento externo.
- [ ] [[Responsabilidade Única]] — cada função/classe deve fazer só uma coisa, e fazer bem feito.
- [ ] [[Nomeação]] — escolher nomes que expliquem a intenção sem precisar de comentário extra.
- [ ] [[Legibilidade]] — o quanto o código é fácil de ler e entender por outra pessoa (ou você no futuro).

---

# 🟢 Design de Software

> Padrões e princípios reutilizáveis para estruturar soluções de forma flexível e manutenível.

- [ ] [[SOLID]] — 5 princípios (S-O-L-I-D) para deixar o código orientado a objetos mais flexível e fácil de manter.
- [ ] [[Singleton]] — garante que uma classe tenha só uma instância em todo o sistema.
- [ ] [[Factory]] — centraliza a criação de objetos, escondendo a lógica de "qual classe instanciar".
- [ ] [[Abstract Factory]] — cria famílias de objetos relacionados sem especificar suas classes concretas.
- [ ] [[Builder]] — constrói objetos complexos passo a passo, separando construção de representação.
- [ ] [[Prototype]] — cria novos objetos clonando um objeto existente, em vez de criar do zero.
- [ ] [[Strategy]] — permite trocar o algoritmo/comportamento de um objeto em tempo de execução.
- [ ] [[Observer]] — um objeto notifica automaticamente outros quando seu estado muda (base de eventos e pub/sub).
- [ ] [[Repository]] — abstrai o acesso a dados, separando a lógica de negócio de como os dados são armazenados.
- [ ] [[Facade]] — fornece uma interface simples para esconder a complexidade de um sistema maior.
- [ ] [[Adapter]] — faz duas interfaces incompatíveis funcionarem juntas, "traduzindo" uma pra outra.
- [ ] [[Decorator]] — adiciona comportamentos extras a um objeto dinamicamente, sem alterar sua classe.
- [ ] [[Composite]] — trata objetos individuais e grupos de objetos de forma uniforme (ex: árvore de componentes).
- [ ] [[Command]] — transforma uma ação em um objeto, permitindo enfileirar, desfazer ou logar comandos.
- [ ] [[Chain of Responsibility]] — passa uma requisição por uma cadeia de handlers até alguém tratá-la.
- [ ] [[Template Method]] — define o esqueleto de um algoritmo, deixando partes específicas para subclasses.
- [ ] [[Iterator]] — permite percorrer os elementos de uma coleção sem expor sua estrutura interna.
- [ ] [[Dependency Injection]] — fornece as dependências de um objeto de fora, em vez de ele criá-las sozinho.

---

# 🟢 Debugging

> Processo de encontrar e corrigir erros no código.

- [ ] [[Debugging]] — processo de identificar, isolar e corrigir defeitos (bugs) no código.
- [ ] [[Breakpoints]] — pontos marcados no código onde a execução pausa para você inspecionar o estado do programa.
- [ ] [[Watch]] — funcionalidade do debugger que monitora o valor de uma variável específica em tempo real.
- [ ] [[Logs]] — registros de eventos/informações gerados pelo programa durante sua execução, úteis para investigar problemas.
- [ ] [[Stack Trace]] — o "caminho" de chamadas de funções que levou até um erro, mostrado quando algo quebra.
- [ ] [[Profiling]] — análise de onde o programa gasta mais tempo/memória, pra encontrar gargalos de performance.
- [ ] [[Debugger]] — ferramenta que permite pausar, inspecionar e controlar a execução do programa passo a passo.

---

# 🟢 Tratamento de Erros

> Como lidar com falhas de forma previsível, sem quebrar o sistema inteiro.

- [ ] [[Exceptions]] — objetos que representam um erro, "lançados" quando algo inesperado acontece na execução.
- [ ] [[try/catch]] — bloco que tenta executar um código e "captura" o erro caso ele aconteça, evitando o crash.
- [ ] [[Logging]] — prática de registrar eventos e erros do sistema para análise posterior.
- [ ] [[Retry]] — tentar novamente uma operação que falhou (útil para falhas temporárias, ex: rede instável).
- [ ] [[Fallback]] — comportamento alternativo executado quando a operação principal falha.
- [ ] [[Validação]] — checar se os dados recebidos estão corretos/esperados antes de processá-los.
- [ ] [[Tratamento Global de Erros]] — um ponto central que captura erros não tratados em qualquer parte da aplicação.

---

# 🟢 HTTP e APIs

> Como sistemas diferentes se comunicam pela rede.

- [ ] [[HTTP]] — protocolo usado para transferir dados entre cliente e servidor na web.
- [ ] [[HTTPS]] — versão do HTTP com criptografia (TLS), protegendo os dados em trânsito.
- [ ] [[REST]] — estilo arquitetural para APIs baseado em recursos e verbos HTTP (GET, POST, PUT, DELETE).
- [ ] [[GraphQL]] — linguagem de consulta que permite ao cliente pedir exatamente os dados que precisa, em uma única requisição.
- [ ] [[gRPC]] — protocolo de comunicação de alta performance baseado em Protocol Buffers, comum entre microsserviços.
- [ ] [[JSON]] — formato leve de troca de dados baseado em texto, o mais usado em APIs modernas.
- [ ] [[XML]] — formato de dados baseado em tags, mais verboso que JSON, ainda usado em sistemas legados.
- [ ] [[YAML]] — formato de dados legível por humanos, muito usado em arquivos de configuração.
- [ ] [[Headers]] — metadados enviados junto com uma requisição/resposta HTTP (ex: tipo de conteúdo, autenticação).
- [ ] [[Cookies]] — pequenos dados guardados no navegador para lembrar informações entre requisições (ex: login).
- [ ] [[Sessions]] — forma de manter o estado de um usuário entre requisições no servidor.
- [ ] [[JWT]] — token assinado usado para autenticar usuários sem precisar guardar sessão no servidor.
- [ ] [[OAuth]] — protocolo padrão para autorização, permite logar em um app usando conta de outro serviço (ex: "Entrar com Google").
- [ ] [[CORS]] — mecanismo de segurança do navegador que controla quais domínios podem acessar recursos de uma API.
- [ ] [[Status Codes]] — códigos numéricos que indicam o resultado de uma requisição HTTP (200 OK, 404 Not Found, etc).
- [ ] [[Idempotência]] — propriedade de uma operação que dá o mesmo resultado não importa quantas vezes seja repetida.
- [ ] [[Webhooks]] — forma de um sistema "avisar" outro automaticamente quando um evento acontece, via HTTP.
- [ ] [[WebSockets]] — conexão persistente entre cliente e servidor, permite comunicação em tempo real nos dois sentidos.
- [ ] [[Rate Limiting]] — limita quantas requisições um cliente pode fazer em um período, evitando abuso/sobrecarga.
- [ ] [[Versionamento de API]] — estratégias (ex: `/v1/`, headers) para evoluir uma API sem quebrar quem já a usa.

---

# 🟢 Segurança

> Práticas para proteger dados, usuários e sistemas contra ataques.

- [ ] [[SQL Injection]] — ataque que injeta comandos SQL maliciosos através de entradas não validadas.
- [ ] [[XSS]] (Cross-Site Scripting) — ataque que injeta scripts maliciosos em páginas vistas por outros usuários.
- [ ] [[CSRF]] — ataque que engana o usuário autenticado para executar uma ação indesejada sem saber.
- [ ] [[Clickjacking]] — engana o usuário fazendo-o clicar em algo diferente do que ele acha que está clicando.
- [ ] [[Hash]] — transformação irreversível de um dado em uma sequência fixa, usada pra guardar senhas com segurança.
- [ ] [[Salt]] — valor aleatório adicionado à senha antes do hash, pra evitar ataques com tabelas pré-computadas.
- [ ] [[Sanitização]] — limpar/filtrar dados de entrada para remover conteúdo perigoso antes de usá-los.
- [ ] [[Autenticação]] — processo de confirmar **quem** o usuário é (login, senha, biometria).
- [ ] [[Autorização]] — processo de definir **o que** o usuário autenticado tem permissão de fazer.
- [ ] [[OWASP Top 10]] — lista das 10 vulnerabilidades de segurança mais críticas em aplicações web, mantida pela OWASP.
- [ ] [[Criptografia]] — técnicas para proteger informações transformando-as em algo ilegível sem a chave correta.
- [ ] [[Princípio do Menor Privilégio]] — cada usuário/serviço deve ter apenas o acesso mínimo necessário para funcionar.
- [ ] [[Gestão de Secrets]] — como armazenar senhas, chaves de API e tokens de forma segura (nunca no código-fonte).

---

# 🟢 Programação Funcional

> Paradigma que trata a computação como avaliação de funções, evitando estado mutável.

- [ ] [[map]] — transforma cada elemento de uma coleção aplicando uma função, retornando uma nova coleção.
- [ ] [[filter]] — cria uma nova coleção contendo só os elementos que satisfazem uma condição.
- [ ] [[reduce]] — combina todos os elementos de uma coleção em um único valor acumulado.
- [ ] [[Imutabilidade]] — dados que não podem ser alterados depois de criados, evitando efeitos colaterais inesperados.
- [ ] [[Closures]] — função que "lembra" o ambiente/variáveis onde foi criada, mesmo depois desse ambiente terminar.
- [ ] [[Higher Order Functions]] — funções que recebem outras funções como parâmetro ou retornam uma função.
- [ ] [[Currying]] — transforma uma função com vários argumentos em uma sequência de funções de um argumento só.
- [ ] [[Memoization]] — guarda o resultado de chamadas de função pra não recalcular o mesmo valor de novo.
- [ ] [[Funções Puras]] — funções que sempre retornam o mesmo resultado para a mesma entrada e não têm efeitos colaterais.

---

# 🟢 Concorrência

> Como executar múltiplas tarefas "ao mesmo tempo", de forma correta e eficiente.

- [ ] [[Concorrência]] — gerenciar múltiplas tarefas que progridem intercaladamente, mesmo sem serem literalmente simultâneas.
- [ ] [[Paralelismo]] — executar múltiplas tarefas literalmente ao mesmo tempo, em núcleos de CPU diferentes.
- [ ] [[Threads]] — unidades de execução dentro de um processo, compartilham a mesma memória.
- [ ] [[Processos]] — instâncias independentes de um programa em execução, com sua própria memória isolada.
- [ ] [[Mutex]] — trava que garante que só uma thread acesse um recurso compartilhado por vez.
- [ ] [[Semáforos]] — mecanismo que controla o acesso de várias threads a um número limitado de recursos.
- [ ] [[Deadlock]] — situação onde duas ou mais tarefas ficam travadas esperando uma pela outra pra sempre.
- [ ] [[Race Condition]] — bug que ocorre quando o resultado depende da ordem/tempo imprevisível de execuções concorrentes.
- [ ] [[Atomicidade]] — garantia de que uma operação acontece por completo, sem ser interrompida no meio.
- [ ] [[Async/Await]] — sintaxe que simplifica a escrita de código assíncrono, deixando-o parecido com código síncrono.
- [ ] [[Event Loop]] — mecanismo (ex: no JavaScript) que gerencia a execução de código assíncrono numa única thread.
- [ ] [[Promises/Futures]] — representam um valor que ainda não existe, mas vai existir quando uma operação assíncrona terminar.

---

# 🟢 Testes de Software

> Garantir que o código funciona como esperado, agora e depois de mudanças futuras.

- [ ] [[Testes Unitários]] — testam uma unidade isolada de código (uma função, um método) sem depender de outras partes.
- [ ] [[Testes de Integração]] — testam se diferentes partes do sistema funcionam corretamente juntas (ex: código + banco de dados).
- [ ] [[Testes E2E (Ponta a Ponta)]] — simulam o uso real do sistema inteiro, do início ao fim, como o usuário faria.
- [ ] [[TDD (Test Driven Development)]] — escrever o teste antes do código, e implementar só o suficiente pra ele passar.
- [ ] [[BDD (Behavior Driven Development)]] — escreve os testes em linguagem próxima da natural, descrevendo comportamentos esperados.
- [ ] [[Mocks e Stubs]] — objetos "falsos" que simulam dependências reais durante os testes (ex: simular uma API externa).
- [ ] [[Test Coverage]] — métrica de quanto do código está sendo exercitado pelos testes.
- [ ] [[Testes de Regressão]] — testes que garantem que uma funcionalidade que já funcionava não quebrou depois de uma mudança.

---

# 🟢 Engenharia de Software

> Processos e práticas para planejar, construir e entregar software de forma organizada.

- [ ] [[Requisitos]] — o que o sistema precisa fazer, levantado junto com quem vai usá-lo.
- [ ] [[Casos de Uso]] — descrição de como um usuário interage com o sistema pra atingir um objetivo.
- [ ] [[User Stories]] — descrição curta de uma funcionalidade do ponto de vista do usuário ("Como X, quero Y, para Z").
- [ ] [[Scrum]] — framework ágil que organiza o trabalho em ciclos curtos (sprints) com papéis e cerimônias bem definidos.
- [ ] [[Kanban]] — método visual de gestão de fluxo de trabalho usando um quadro com colunas (a fazer, fazendo, feito).
- [ ] [[Sprint]] — período de tempo fixo (geralmente 1-4 semanas) onde um time entrega um incremento do produto.
- [ ] [[Backlog]] — lista priorizada de tudo que precisa ser feito no projeto.
- [ ] [[Estimativas]] — previsão do esforço/tempo necessário para entregar uma tarefa.
- [ ] [[Documentação]] — registros escritos que explicam como o sistema funciona, pra outros devs (e você mesmo) entenderem depois.
- [ ] [[Metodologias Ágeis]] — abordagens (Scrum, Kanban, XP) que priorizam entregas incrementais e adaptação a mudanças.

---

# 🟢 Arquitetura de Software

> Como organizar as peças de um sistema em larga escala.

- [ ] [[MVC]] (Model-View-Controller) — separa a aplicação em dados (Model), interface (View) e lógica de controle (Controller).
- [ ] [[Arquitetura em Camadas]] — organiza o sistema em camadas (apresentação, negócio, dados), cada uma com sua responsabilidade.
- [ ] [[Clean Architecture]] — organiza o código em círculos concêntricos, mantendo as regras de negócio independentes de frameworks e UI.
- [ ] [[Arquitetura Hexagonal]] — isola o núcleo da aplicação do mundo externo (banco, UI, APIs) através de "portas e adaptadores".
- [ ] [[Monólito]] — aplicação construída como uma única unidade grande, mais simples de começar, mais difícil de escalar.
- [ ] [[Microsserviços]] — divide a aplicação em serviços pequenos e independentes que se comunicam entre si.
- [ ] [[DDD]] (Domain-Driven Design) — abordagem que modela o software em torno das regras e linguagem do negócio real.
- [ ] [[Event Driven]] — arquitetura onde componentes reagem a eventos, em vez de chamadas diretas entre si.
- [ ] [[CQRS]] — separa as operações de leitura das operações de escrita em modelos diferentes, otimizando cada uma.
- [ ] [[API Gateway]] — ponto único de entrada que roteia, autentica e agrega requisições para os microsserviços.

---

# 🟢 Sistemas Operacionais

> O software que gerencia o hardware e serve de base para todos os programas.

- [ ] [[Kernel]] — núcleo do sistema operacional, gerencia o hardware e os recursos do computador.
- [ ] [[Processos]] — programas em execução, cada um com sua própria memória isolada.
- [ ] [[Threads]] — linhas de execução dentro de um processo, mais leves que processos.
- [ ] [[Escalonamento]] — como o SO decide qual processo/thread executa em qual momento na CPU.
- [ ] [[Stack]] — memória usada para chamadas de função e variáveis locais, organizada como uma pilha.
- [ ] [[Heap]] — memória usada para alocação dinâmica, gerenciada manualmente ou por garbage collector.
- [ ] [[Garbage Collector]] — mecanismo automático que libera memória de objetos que não são mais usados.
- [ ] [[Sistema de Arquivos]] — como o SO organiza e armazena arquivos e pastas no disco.
- [ ] [[Permissões]] — regras que controlam quem pode ler, escrever ou executar um arquivo/recurso.
- [ ] [[IPC (Comunicação entre Processos)]] — mecanismos para processos diferentes trocarem dados entre si (pipes, sockets, memória compartilhada).
- [ ] [[Virtualização]] — criar "computadores virtuais" dentro de um físico, isolando ambientes de execução.

---

# 🟢 Redes

> Como computadores se conectam e trocam dados entre si.

- [ ] [[Modelo TCP/IP]] — modelo prático de 4 camadas que descreve como a internet funciona.
- [ ] [[Modelo OSI]] — modelo teórico de 7 camadas que descreve a comunicação em redes.
- [ ] [[IP]] — endereço único que identifica um dispositivo em uma rede.
- [ ] [[IPv4]] — versão mais antiga e comum do endereçamento IP (ex: `192.168.0.1`).
- [ ] [[IPv6]] — versão mais nova do IP, criada pra resolver o esgotamento de endereços do IPv4.
- [ ] [[DNS]] — traduz nomes de domínio (ex: `google.com`) para endereços IP.
- [ ] [[DHCP]] — protocolo que atribui automaticamente endereços IP aos dispositivos numa rede.
- [ ] [[TCP]] — protocolo confiável de transporte, garante entrega ordenada dos dados (usado na maioria das aplicações).
- [ ] [[UDP]] — protocolo de transporte mais rápido, mas sem garantia de entrega (usado em streaming, jogos).
- [ ] [[SSL]] — versão antiga do protocolo de criptografia para conexões seguras (substituído pelo TLS).
- [ ] [[TLS]] — protocolo que criptografa a comunicação entre cliente e servidor (base do HTTPS).
- [ ] [[Portas]] — números que identificam qual serviço/aplicação deve receber os dados em um dispositivo (ex: 80, 443).
- [ ] [[NAT]] — técnica que permite vários dispositivos numa rede local compartilharem um único IP público.
- [ ] [[Load Balancer]] — distribui o tráfego entre vários servidores, evitando sobrecarga e aumentando disponibilidade.
- [ ] [[CDN]] — rede de servidores espalhados geograficamente que entrega conteúdo mais rápido, perto do usuário.
- [ ] [[Proxy Reverso]] — servidor que fica na frente de outros servidores, recebendo requisições e redirecionando internamente.

---

# 🟢 DevOps

> Práticas que unem desenvolvimento e operações para entregar software mais rápido e com mais qualidade.

- [ ] [[Docker]] — ferramenta que empacota uma aplicação e suas dependências em containers isolados e portáveis.
- [ ] [[Containers]] — ambientes isolados e leves que rodam uma aplicação de forma consistente em qualquer máquina.
- [ ] [[Images]] — "moldes" imutáveis usados para criar containers.
- [ ] [[Dockerfile]] — arquivo de instruções que define como construir uma imagem Docker.
- [ ] [[Docker Compose]] — ferramenta para definir e rodar múltiplos containers juntos com um único arquivo de configuração.
- [ ] [[Volumes]] — mecanismo do Docker para persistir dados fora do ciclo de vida do container.
- [ ] [[Networks]] — configuração de rede entre containers, permitindo que eles se comuniquem.
- [ ] [[CI/CD]] — automação que integra (CI), testa e entrega (CD) código continuamente, reduzindo erros manuais.
- [ ] [[GitHub Actions]] — ferramenta de automação de workflows (CI/CD) integrada ao GitHub.
- [ ] [[Deploy]] — processo de colocar uma nova versão do software em produção.
- [ ] [[Pipelines]] — sequência automatizada de etapas (build, teste, deploy) que o código passa até chegar em produção.
- [ ] [[Rollback]] — reverter para uma versão anterior do sistema quando um deploy dá problema.
- [ ] [[Kubernetes]] — orquestrador de containers, gerencia escala, disponibilidade e deploy de aplicações em containers automaticamente.
- [ ] [[Infraestrutura como Código (IaC)]] — definir servidores/infraestrutura em arquivos de código (ex: Terraform), em vez de configurar manualmente.
- [ ] [[Cloud Computing]] — usar servidores e serviços de terceiros (AWS, Azure, GCP) sob demanda, em vez de infraestrutura própria.

---

# 🟢 Observabilidade

> Capacidade de entender o que está acontecendo dentro de um sistema em produção.

- [ ] [[Logs]] — registros textuais de eventos que aconteceram no sistema.
- [ ] [[Métricas]] — valores numéricos coletados ao longo do tempo (ex: uso de CPU, tempo de resposta).
- [ ] [[Tracing]] — rastreia uma requisição através de vários serviços, mostrando onde o tempo foi gasto.
- [ ] [[Monitoramento]] — observação contínua da saúde e desempenho do sistema.
- [ ] [[Alertas]] — notificações automáticas disparadas quando algo sai do esperado (ex: erro acima do normal).

---

# 🟢 Ferramentas

> O ferramental do dia a dia de quem programa.

- [ ] [[VS Code]] — editor de código leve e extensível, um dos mais usados atualmente.
- [ ] [[Terminal]] — interface de linha de comando pra interagir diretamente com o sistema operacional.
- [ ] [[PowerShell]] — shell e linguagem de script do Windows, mais poderoso que o CMD tradicional.
- [ ] [[Bash]] — shell padrão em sistemas Linux/macOS, usado pra automatizar tarefas via linha de comando.
- [ ] [[SSH]] — protocolo para acessar e controlar remotamente outro computador de forma segura.
- [ ] [[Regex]] — linguagem para descrever padrões de texto, usada em buscas e validações complexas.
- [ ] [[Postman]] — ferramenta para testar e explorar APIs sem precisar escrever código.
- [ ] [[Insomnia]] — alternativa ao Postman, também usada para testar requisições de API.
- [ ] [[DevTools]] — ferramentas embutidas no navegador para inspecionar, depurar e analisar performance de páginas web.
- [ ] [[Linter]] — ferramenta que analisa o código em busca de erros e problemas de estilo automaticamente.
- [ ] [[Formatter]] — ferramenta que formata o código automaticamente seguindo um padrão (ex: Prettier).
- [ ] [[Gerenciador de Pacotes]] — ferramenta que instala e gerencia bibliotecas/dependências do projeto (ex: npm, pip, Maven).

---

# 🟢 Fundamentos da Computação

> Como o computador realmente representa e processa informação por baixo dos panos.

- [ ] [[Bits]] — a menor unidade de informação, representa 0 ou 1.
- [ ] [[Bytes]] — grupo de 8 bits, unidade básica de armazenamento.
- [ ] [[Binário]] — sistema numérico de base 2, a linguagem "nativa" dos computadores.
- [ ] [[Octal]] — sistema numérico de base 8, menos comum hoje em dia.
- [ ] [[Hexadecimal]] — sistema numérico de base 16, usado para representar cores, memória e bytes de forma compacta.
- [ ] [[ASCII]] — tabela que mapeia caracteres (letras, números, símbolos) para números, um dos primeiros padrões.
- [ ] [[Unicode]] — padrão moderno que representa praticamente todos os caracteres de todos os idiomas do mundo.
- [ ] [[UTF-8]] — forma de codificar Unicode em bytes, o padrão mais usado na web hoje.
- [ ] [[Ponto Flutuante]] — forma de representar números decimais no computador, com limitações de precisão.
- [ ] [[Complemento de Dois]] — técnica usada para representar números negativos em binário.

---

# 🟢 Arquitetura de Computadores

> Como os componentes físicos do computador funcionam e se comunicam.

- [ ] [[CPU]] — o "cérebro" do computador, executa as instruções dos programas.
- [ ] [[Registradores]] — memória pequena e extremamente rápida dentro da CPU, usada para cálculos imediatos.
- [ ] [[Clock]] — o "relógio" que sincroniza os ciclos de execução da CPU (medido em Hz/GHz).
- [ ] [[Pipeline]] — técnica que executa partes de várias instruções simultaneamente pra aumentar a performance da CPU.
- [ ] [[RAM]] — memória volátil de acesso rápido, onde ficam os dados que o programa usa em execução.
- [ ] [[Cache]] — memória pequena e muito rápida, guarda dados usados com frequência pra evitar acessar a RAM toda hora.
- [ ] [[SSD]] — armazenamento persistente baseado em memória flash, muito mais rápido que HDs tradicionais.
- [ ] [[Barramentos]] — "estradas" que conectam e transportam dados entre os componentes do computador.

---

# 🟢 Compiladores

> Como o código que você escreve vira algo que o computador executa.

- [ ] [[Lexer]] — quebra o código-fonte em "tokens" (palavras-chave, símbolos, identificadores).
- [ ] [[Parser]] — organiza os tokens em uma estrutura (árvore) que representa a gramática da linguagem.
- [ ] [[AST]] (Árvore Sintática Abstrata) — representação em árvore da estrutura do código, usada por compiladores e ferramentas.
- [ ] [[Compilação]] — traduz o código-fonte inteiro para código de máquina antes de executar.
- [ ] [[Interpretação]] — executa o código linha por linha, sem gerar um arquivo compilado antes.
- [ ] [[Bytecode]] — código intermediário entre o código-fonte e o código de máquina (ex: usado pela JVM).
- [ ] [[Máquina Virtual]] — programa que simula um computador, executando bytecode de forma portátil (ex: JVM, CLR).
- [ ] [[Linkagem]] — etapa que junta diferentes módulos/bibliotecas compilados em um único executável final.

---

# 🟢 Serialização

> Como transformar dados em memória em um formato que pode ser salvo ou transmitido.

- [ ] [[JSON]] — formato leve e legível, o mais comum para troca de dados entre sistemas.
- [ ] [[XML]] — formato baseado em tags, mais verboso, ainda comum em sistemas corporativos legados.
- [ ] [[YAML]] — formato legível, muito usado em arquivos de configuração (ex: Docker, CI/CD).
- [ ] [[CSV]] — formato simples de tabela separada por vírgulas, usado para exportar/importar dados tabulares.
- [ ] [[BSON]] — versão binária do JSON, usada internamente pelo MongoDB pra ser mais compacta e rápida.
- [ ] [[Protocol Buffers]] — formato binário compacto e rápido do Google, muito usado com gRPC.

---

# 🟢 Matemática

> A base teórica que sustenta algoritmos, estruturas de dados e ciência da computação.

- [ ] [[Lógica Booleana]] — álgebra de verdadeiro/falso (AND, OR, NOT), base de toda decisão computacional.
- [ ] [[Conjuntos]] — coleções de elementos únicos e as operações entre eles (união, interseção, diferença).
- [ ] [[Combinatória]] — estudo de contagem de arranjos e combinações possíveis, base de análise de algoritmos.
- [ ] [[Probabilidade]] — chance de eventos ocorrerem, base para algoritmos randomizados e machine learning.
- [ ] [[Estatística]] — coleta e interpretação de dados, essencial em análise de dados e ML.
- [ ] [[Álgebra Linear]] — vetores e matrizes, base fundamental para computação gráfica e machine learning.
- [ ] [[Matemática Discreta]] — o "guarda-chuva" que cobre lógica, grafos e combinatória, base teórica da ciência da computação.

---

# 🟢 Conceitos Gerais

> Termos que aparecem em praticamente qualquer discussão técnica de sistemas.

- [ ] [[Acoplamento]] — o quanto um componente depende de outro; quanto menor, mais fácil de manter e testar.
- [ ] [[Coesão]] — o quanto os elementos de um módulo estão relacionados entre si; alta coesão é desejável.
- [ ] [[Escalabilidade]] — capacidade de um sistema lidar com o aumento de carga/usuários.
- [ ] [[Disponibilidade]] — o quanto do tempo um sistema está funcionando e acessível (ex: "99.9% de uptime").
- [ ] [[Consistência]] — garantia de que todos os nós/réplicas de um sistema mostram os mesmos dados.
- [ ] [[Estado]] — a condição/dados atuais que um sistema ou componente mantém em um dado momento.
- [ ] [[Dependência]] — quando um componente precisa de outro para funcionar.
- [ ] [[Serialização]] — converter uma estrutura de dados/objeto em um formato que pode ser armazenado ou transmitido.
- [ ] [[Desserialização]] — o processo inverso: transformar dados serializados de volta em objetos usáveis.
- [ ] [[Cache]] — armazenar temporariamente um resultado pra evitar recalcular/rebuscar o mesmo dado repetidamente.
- [ ] [[Lazy Loading]] — carregar dados/recursos só quando realmente são necessários, economizando recursos.
- [ ] [[Eager Loading]] — carregar todos os dados relacionados de uma vez, evitando múltiplas idas ao banco.

---

# 🟢 Inglês Técnico

> A maior parte da documentação, discussões e vagas de programação são em inglês.

- [ ] [[Glossário de Programação]] — vocabulário essencial de termos técnicos usados no dia a dia.
- [ ] [[Siglas Técnicas]] — abreviações comuns na área (API, SDK, CLI, IDE, etc.) e o que significam.
- [ ] [[Vocabulário Técnico]] — palavras frequentes em código e documentação (fetch, parse, render, deploy...).
- [ ] [[Ler Documentação]] — habilidade de entender documentação oficial em inglês, essencial pra resolver problemas por conta própria.

---

# 🟢 Soft Skills

> Habilidades comportamentais que fazem tanta diferença quanto o conhecimento técnico.

- [ ] [[Comunicação]] — habilidade de explicar ideias técnicas de forma clara pra times e pessoas não-técnicas.
- [ ] [[Code Review]] — revisar o código de outra pessoa, dando feedback construtivo antes de ele ir pra produção.
- [ ] [[Feedback]] — dar e receber retorno sobre o trabalho de forma construtiva.
- [ ] [[Trabalho em Equipe]] — colaborar bem com outras pessoas em prol de um objetivo comum.
- [ ] [[Gestão de Tempo]] — organizar prioridades e prazos de forma eficiente.
- [ ] [[Pensamento Crítico]] — analisar problemas e informações antes de tirar conclusões ou tomar decisões.
- [ ] [[Resolução de Problemas]] — capacidade de investigar, quebrar e resolver problemas complexos de forma estruturada.
- [ ] [[Ética Profissional]] — agir com integridade, responsabilidade e respeito no ambiente de trabalho.
- [ ] [[Gestão de Carreira]] — planejar seu crescimento profissional, buscar aprendizado contínuo e networking na área.
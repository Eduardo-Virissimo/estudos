# Plataforma de Gerenciamento de Conteúdo para Televisões

Criar uma plataforma para controlar remotamente o conteúdo exibido em televisões, painéis e monitores. O administrador gerencia tudo por um painel web, enquanto um aplicativo instalado na televisão baixa e exibe os materiais.

## Funcionalidades

- Cadastro e pareamento de televisões;
- Upload de imagens, vídeos, textos e PDFs;
- Criação de playlists;
- Agendamento por data e horário;
- Organização por grupos de telas;
- Atualização automática;
- Funcionamento offline com os últimos conteúdos baixados;
- Status online ou offline de cada televisão;
- Permissões para administradores e editores.

## Público-Alvo

Lojas, restaurantes, escolas, hospitais, academias, empresas e agências de publicidade.

## Diferencial

Centralizar várias telas em um único lugar, permitindo atualizar campanhas e comunicados sem acessar cada televisão individualmente.

## Possíveis Tecnologias

React ou Next.js, Node.js, PostgreSQL, armazenamento S3 e um aplicativo para Android TV ou modo kiosk.

## Tópicos que entram aqui

Estes tópicos do [[Roadmap]] têm 🧩 lá: é aqui, no projeto do Estágio 6, que eles saem da teoria. Estude a nota, faça o desafio dela e depois traga pra cá.

- **HTTP e APIs:** [[WebSockets]], [[Server-Sent Events]], [[Idempotência]]
- **Tratamento de Erros:** [[Retry]], [[Backoff Exponencial]]
- **Concorrência:** [[Event Loop]], [[Race Condition]]
- **Arquitetura de Software:** [[Arquitetura em Camadas]], [[Monólito]], [[Microsserviços]], [[Event Driven]], [[Filas de Mensagens]], [[Background Jobs]], [[Object Storage]], [[Upload em Partes]]
- **Conceitos Gerais:** [[Escalabilidade]], [[Disponibilidade]], [[Consistência Eventual]], [[Cache]], [[Estratégias de Cache]]

## Próximos Passos

- [ ] Criar protótipo do painel;
- [ ] Implementar pareamento de telas;
- [ ] Criar playlists e agendamento;
- [ ] Desenvolver o reprodutor com cache offline;
- [ ] Testar em diferentes televisões.

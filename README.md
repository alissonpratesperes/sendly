<p align="center">
  <img src="./github/sendly-logo.png" alt="inhouse-logo" width="50%"/>
</p>

---

<br/>

<p align="center">
  <a href="#sobre">SOBRE</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#tecnologias">TECNOLOGIAS</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#features">FEATURES</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#valor">VALOR</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#execute">EXECUTE</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#licença">LICENÇA</a>
</p>

<br/>

## SOBRE

A **sendly** é uma Aplicação desenvolvida para o gerenciamento de _listas de contatos_, _templates de mensagens_ e _lotes de envios_ de campanhas de marketing através do WhatsApp.

## TECNOLOGIAS

<details>
  <summary><strong>Tooling</strong></summary>

  <ul>
    <li><a href="https://www.postman.com/">Postman</a></li>
    <li><a href="https://code.visualstudio.com/">VS Code</a></li>
  </ul>
</details>

<details>
  <summary><strong>Database</strong></summary>

  <ul>
    <li><a href="https://www.prisma.io/orm">Prisma ORM</a></li>
    <li><a href="https://www.mysql.com/">My SQL</a></li>
    <li><a href="https://redis.io/">Redis</a></li>
  </ul>
</details>

<details>
  <summary><strong>Integration</strong></summary>

  <ul>
    <li><a href="https://nodemailer.com/">Nodemailer</a></li>
    <li><a href="https://swagger.io/">Swagger</a></li>
    <li><a href="https://bullmq.io/">Bull MQ</a></li>
    <li><a href="https://github.com/whiskeysockets/Baileys">Baileys</a></li>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

<details>
  <summary><strong>Back-End</strong></summary>

  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://nestjs.com/">NestJS</a></li>
  </ul>
</details>

<details>
  <summary><strong>Front-End</strong></summary>

  <ul>
    <li><a href="https://styled-components.com/">Styled Components</a></li>
    <li><a href="https://react.dev/">React JS</a></li>
    <li><a href="https://axios.rest/">Axios</a></li>
    <li><a href="https://zod.dev/">Zod</a></li>
  </ul>
</details>

## FEATURES

- **BANCO DE DADOS**: Abordagem Database First, com definição do esquema por meio de um script SQL previamente elaborado, permitindo a preparação da estrutura do banco de dados antes da integração com a aplicação;
- **BACK-END**: Desenvolvido com NestJS, aproveitando sua arquitetura modular e opinativa, em conjunto com o Prisma ORM para introspecção do banco de dados existente e integração entre a camada de aplicação e a persistência de dados;
- **AUTENTICAÇÃO**: Implementação de um fluxo baseado em JWT e Refresh Tokens, com renovação de sessões, gerenciamento do ciclo de vida dos tokens e mecanismos para reforçar a segurança da autenticação;
- **HIERARQUIA E PERMISSÕES**: Estrutura hierárquica para gerenciamento de cadastros específicos, organização de níveis de acesso e segregação de funcionalidades conforme o perfil do usuário;
- **MULTI-TENANT**: Arquitetura Multi-Tenant que permite a utilização da plataforma por múltiplas empresas em uma única infraestrutura de banco de dados, com mecanismos centralizados de validação e isolamento dos dados por organização;
- **INTEGRAÇÃO**: Adoção do Facade Pattern para disponibilizar uma API interna coesa e extensível, simplificando a comunicação entre os componentes e permitindo o gerenciamento das integrações diretamente pela interface da aplicação;
- **DOCUMENTAÇÃO**: Integração com Swagger para documentação interativa da API, facilitando a exploração dos endpoints, a validação de requisições e futuras integrações com serviços externos;
- **FRONT-END**: Interface componentizada, com foco em reutilização, consistência visual e produtividade operacional. Utiliza Styled Components na abordagem CSS-in-JS, além de uma estrutura inicial de Design System para padronização dos componentes;
- **LISTAS E CONTATOS**: Gerenciamento intuitivo de listas e contatos, com recursos de ativação e inativação para controle dos destinatários e maior organização das ações de comunicação;
- **TEMPLATES**: Criação e gerenciamento de modelos reutilizáveis de mensagens para campanhas, com suporte a cabeçalho, corpo, rodapé e imagem, além da interpolação de dados dos contatos para personalização do conteúdo;
- **LOTES DE ENVIO**: Criação de lotes de campanhas direcionadas a listas com múltiplos contatos ativos, com processamento automatizado e desacoplado das operações realizadas na interface;
- **PROCESSAMENTO ASSÍNCRONO**: Utilização do BullMQ para gerenciamento de filas e execução de tarefas em segundo plano, com estratégias de distribuição variável dos intervalos de envio, aplicação de jitter e políticas de retentativa com atrasos progressivos em caso de falhas;
- **RASTREABILIDADE**: Estrutura inicial dividida em duas frentes: monitoramento operacional das filas por meio do Bull Board, com acesso restrito a usuários autorizados, e acompanhamento individual dos envios por meio de logs, incluindo tentativas de processamento, erros e retornos disponibilizados pela integração com o WhatsApp. Esses registros facilitam o diagnóstico de problemas e a análise do histórico de execução das campanhas;

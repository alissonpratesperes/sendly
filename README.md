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
- **RASTREABILIDADE**: Estrutura inicial dividida em duas frentes: monitoramento operacional das filas por meio do Bull Board, com acesso restrito a usuários autorizados, e acompanhamento individual dos envios por meio de logs, incluindo tentativas de processamento, erros e retornos disponibilizados pela integração com o WhatsApp. Esses registros facilitam o diagnóstico de problemas e a análise do histórico de execução das campanhas.

## VALOR

_O sistema transforma um processo de disparos de marketing via WhatsApp, antes totalmente manual, em uma operação centralizada e automatizada. Por meio do cadastro ou da importação em massa de contatos, da organização em listas de distribuição e do uso de templates personalizados, a plataforma permite configurar campanhas cujos lotes de envio são processados automaticamente em segundo plano, sem a necessidade de acompanhamento individual de cada disparo._

_Além de reduzir tarefas manuais e repetitivas, a solução oferece recursos de monitoramento, registro de ocorrências e retentativas automáticas, facilitando o diagnóstico de falhas e o controle operacional. Dessa forma, contribui para aumentar a eficiência operacional e estabelece uma base tecnológica preparada para escalar as operações de comunicação e marketing._

## EXECUTE

    - Instalar o NodeJS para a execução da aplicação
    - Instalar o Docker para a execução dos containers
    - Clonar esse repositório

    Preparando o Docker para os containers dos Bancos de Dados

    >_ Docker
      |- Executar o Comando: "docker pull mysql:latest" para baixar a Imagem do Banco de Dados MYSQL
      |- Executar o Comando: "docker network create sendly_databases_network" para criar a Rede interna, porque serão utilizados dois Bancos de Dados
      |- Executar o Comando: "docker volume create sendly_mysql_data" para criar o Volume do primeiro Banco de Dados
      |- Executar o Comando: "docker run -d --name sendly_mysql_database --network sendly_databases_network -p 3306:3306 -e 'MYSQL_ROOT_PASSWORD=<SENHA>' -v sendly_mysql_data:/var/lib/mysql mysql:latest" para criar o Container do primeiro Banco de Dados
      |- Executar o Comando: "docker volume create sendly_redis_data" para criar o Volume do segundo Banco de Dados
      |- Executar o Comando: "docker run -d --name sendly_redis_database --network sendly_databases_network -p 6379:6379 -v sendly_redis_data:/data redis:7-alpine redis-server --requirepass '<SENHA>'" para criar o Container do segundo Banco de Dados
      |- Executar o Comando: "CREATE DATABASE sendly" dentro de um cliente MySQL para criar o primeiro Banco de Dados
      >_ Executar o Script SQL: acessar "./backend/scripts/Database.sql" e implementar o esquema no primeiro Banco de Dados

    Preparando e executando a Aplicação

    >_ Acessar o Back-End: "./backend"
      |- Criar a Variável de Ambiente: ".env" e preencher os dados utilizando o arquivo ".env.example" como modelo
      |- Executar o Comando: "npm install --force" para instalar as dependências
      |- Executar o Comando: "npm run prisma:introspect" para introspectar o esquema do primeiro Banco de Dados
      |- Executar o Comando: "npm run prisma:generate" para criar o Client do Prisma ORM
      |- Executar o Comando: "npm run prisma:seed" para gerar o Usuário Root que nascerá na primeira execução
      >_ Executar o Comando: "npm run start:dev" para iniciar o Back-End

    >_ Acessar o Front-End: "./frontend"
      |- Criar a Variável de Ambiente: ".env" e preencher os dados utilizando o arquivo ".env.example" como modelo
      |- Executar o Comando: "npm install --force" para instalar as dependências
      >_ Executar o Comando: "npm run start" para iniciar o Front-End

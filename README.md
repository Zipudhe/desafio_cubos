# Desafio Cubos

Este é um projeto desenvolvido com TypeScript e Node.js, usando TypeORM para manipulação e gestão do banco de dados. A aplicação é uma API construída com Express, voltada para cumprir um desafio técnico. Este projeto fornece funcionalidades de autenticação e acesso a dados armazenados em um banco PostgreSQL.
Tecnologias utilizadas

    Node.js: Plataforma de desenvolvimento JavaScript para o backend.
    TypeScript: Superset de JavaScript que adiciona tipagem estática e auxilia no desenvolvimento escalável.
    Express: Framework para criar servidores HTTP e APIs REST.
    TypeORM: ORM (Object-Relational Mapping) para simplificar a manipulação de dados no banco de dados.
    PostgreSQL: Banco de dados relacional usado para armazenamento de dados.

# Pré-requisitos

## Certifique-se de ter os seguintes requisitos instalados:

  - Node.js: Versão 14 ou superior
  - npm: Gerenciador de pacotes do Node.js
  - PostgreSQL: Banco de dados para armazenamento de dados

## Configuração do Ambiente

### Clone o repositório:

```bash
git clone https://github.com/Zipudhe/desafio_cubos.git
cd desafio_cubos
```

## Instale as dependências:

```bash
npm install
```

Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente, substituindo os valores entre {} pelos valores corretos:

```plaintext
PORT=3000

    DB_HOST=localhost
    DB_PORT={DB_PORT}
    DB_USER={DB_USER}
    DB_PASSWORD={DB_PASSWORD}
    DB_NAME={DB_NAME}

    SERVICE_MAIL={VALID_COMPLIANCE_MAIL}
    SERVICE_PASSWORD={VALID_COMPLIANCE_PASSWORD}

        PORT: Porta na qual o servidor irá rodar (default: 3000).
        DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: Credenciais de acesso ao banco de dados PostgreSQL.
        SERVICE_MAIL, SERVICE_PASSWORD: Credenciais de serviço de e-mail para uso em notificações (se aplicável).
```


## Configuração do Banco de Dados

    Crie um banco de dados no PostgreSQL com o nome especificado em DB_NAME.

    Execute as migrations para configurar as tabelas:

    ```bash
        npm run migration:run
    ```


# Rodando o Projeto

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```


A aplicação estará disponível em http://localhost:3000.
Scripts Disponíveis

```
npm run dev: Executa o servidor em modo de desenvolvimento com recarga automática.
npm run migration:generate: Gera uma nova migration com base nas entidades modificadas.
npm run migration:run: Executa as migrations no banco de dados.
npm run migration:revert: Reverte a última migration aplicada.
npm run migration:create: Cria uma nova migration vazia.
npm run db:drop: Exclui o esquema atual do banco de dados.
```

# Testando a API

 Após iniciar o servidor, você pode testar os endpoints da API usando ferramentas como Postman ou Insomnia para realizar requisições HTTP à aplicação.

# Estrutura do Projeto

A estrutura principal dos arquivos está organizada da seguinte maneira:

    src: Contém o código-fonte do projeto.
        db: Configuração e conexões do banco de dados.
        entities: Definição das entidades utilizadas pelo TypeORM.
        migrations: Scripts de migração para o banco de dados.
        controllers e services: Lógica de negócios e manipulação de requisições.

# Licença

Este projeto é apenas para fins educacionais e de desafio técnico.

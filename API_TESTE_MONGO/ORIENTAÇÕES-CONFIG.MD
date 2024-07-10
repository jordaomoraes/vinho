# Orientações Gerais de Configuração

* Instalar e Configurar SQLServer
* Instalar Node.js LTS
* Criar o banco
* Acessar pasta API E WEB, e dar comando npm i, para instalar as dependências.
* Criar user para FrontEnd - via insomnia

### Exemplo JSON API

    Usar https://hoppscotch.io
    http://localhost:3000/user/adicionar

    {
    "username": "Guilherme",
    "name":"Guilherme",
    "email": "joao@example.com",
    "password": "123456"
    }


### Criar user para API

    USE master;
    GO
    -- Crie o login --
    CREATE LOGIN APIUSER_GUAXUPE WITH PASSWORD = 'PiLDC2023@';
    GO

    -- Adicione o login como administrador do servidor --
    ALTER SERVER ROLE sysadmin ADD MEMBER APIUSER_GUAXUPE;
    GO

    -- Criando usuário --
    USE DBGuaxupe;
    GO

    CREATE USER APIUSER_GUAXUPE FOR LOGIN APIUSER_GUAXUPE;

    GO
    -- Adicionando permisão de ADM --
    USE DBGuaxupe;
    GRANT CONTROL TO APIUSER_GUAXUPE;

### EDITAR O CAMPO .ENV COM A STRING DE CONEXÃO PASSADA.
    * Editar
    [] sqlserver
    [] database
    [] user
    [] password

    DATABASE_URL="sqlserver://LUIZMORAES-PC\WINCC:1434;database=DBSmartBag;user=lgjm;password=1234;encrypt=false;trustServerCertificate=true"


### PARA CRIAR O BANCO
    * npx prisma migrate dev ( vai criar o banco de acordo com o que está no schema.prisma)

### CONFIGURAÇÃO SOCKETS

    * Chamadas da funções do arquivo server.js

### ALTERAR ARQUIVO .ENV
    * Nesse arquivo que se encontram as configurações de conexão com o CLP, configurar para cada CLP.

    [] OPCUA_SERVER1 = 'opc.tcp://192.168.0.1:4840'
    [] NODEID_BATELADAS_SERVER1 = 'ns=4;i=4'
    [] PORT= 3001
    [] SOCKET_SERVER1 = '127.0.0.1'
    [] SOCKET_PORT1 = 4001


### INICIAR API E FRONTEND COM O WINDOWS

    * Verificar arquivo Configurar-arquivo-bat.doc
    * Arquivo "iniciar_aplicacao.bat"  -- Inicia o Servidor / API e a Páginas WEB.

### POSSIVEIS PROBLEMAS

    * Problema de conexão seja OPCUA ou via SOCKET geralmente está no IP, tanto da maquina quanto do CLP.
    * Configurar a REDE para o IP do roteador


### IP USADOS

    plc1 = 10.10.0.145
    plc2 = 10.10.0.147
    plc3= 10.10.0.149

    ihm1 =10.10.0.146
    ihm2 = 10.10.0.148
    ihm3= 10.10.0.150


USE master;
GO
-- Crie o login --
CREATE LOGIN API_DB001 WITH PASSWORD = 'DB001Pa$$';
GO

-- Adicione o login como administrador do servidor --
ALTER SERVER ROLE sysadmin ADD MEMBER API_DB001;
GO

-- Criando usuário --
USE DB0001;
GO

CREATE USER USER_API_DB001 FOR LOGIN API_DB001;

GO
-- Adicionando permisão de ADM --
USE DB0001;
GRANT CONTROL TO USER_API_DB001;
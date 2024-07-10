
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
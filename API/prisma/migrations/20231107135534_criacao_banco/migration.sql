BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[lotes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [endMaquina] NVARCHAR(1000),
    [modoOperacao] INT,
    [docReferencia] NVARCHAR(1000) NOT NULL,
    [operador] NVARCHAR(1000) CONSTRAINT [lotes_operador_df] DEFAULT 'Sem Informações',
    [pesoLoteProgramado] FLOAT(53) NOT NULL,
    [dataHoraInicioLote] DATETIME2,
    [dataHoraFinalLote] DATETIME2,
    [pesoLote] FLOAT(53),
    [pesoSaco] FLOAT(53),
    [qtdSaco] INT,
    [idPlc] INT,
    [consumed] BIT CONSTRAINT [lotes_consumed_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [lotes_status_df] DEFAULT 'Aguardando Processamento',
    [dataCadastro] DATETIME2 NOT NULL CONSTRAINT [lotes_dataCadastro_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [lotes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[bateladas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idLote] INT NOT NULL,
    [dataBatelada] DATETIME2 NOT NULL,
    [idPlc] INT NOT NULL,
    [pesoBatelada] FLOAT(53) NOT NULL,
    CONSTRAINT [bateladas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[loteAtual] (
    [id] INT NOT NULL IDENTITY(1,1),
    [idLote] INT,
    [pesoLote] FLOAT(53),
    [pesoAtual] FLOAT(53),
    [producaoHoje] FLOAT(53),
    [producaoTotal] FLOAT(53),
    [modoOperacao] INT NOT NULL,
    [statusEquipamento] NVARCHAR(1000) NOT NULL CONSTRAINT [loteAtual_statusEquipamento_df] DEFAULT 'Parado',
    [docReferencia] NVARCHAR(1000) NOT NULL CONSTRAINT [loteAtual_docReferencia_df] DEFAULT ' -- ',
    CONSTRAINT [loteAtual_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [dataCadastro] DATETIME2 NOT NULL CONSTRAINT [user_dataCadastro_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[bateladas] ADD CONSTRAINT [bateladas_idLote_fkey] FOREIGN KEY ([idLote]) REFERENCES [dbo].[lotes]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

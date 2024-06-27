/*
  Warnings:

  - You are about to drop the `bateladas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loteAtual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[bateladas] DROP CONSTRAINT [bateladas_idLote_fkey];

-- DropTable
DROP TABLE [dbo].[bateladas];

-- DropTable
DROP TABLE [dbo].[loteAtual];

-- DropTable
DROP TABLE [dbo].[lotes];

-- DropTable
DROP TABLE [dbo].[user];

-- CreateTable
CREATE TABLE [dbo].[usuarios] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [nome] VARCHAR(100) NOT NULL,
    [email] VARCHAR(100) NOT NULL,
    [senha] VARCHAR(100) NOT NULL,
    [tipo] INT CONSTRAINT [usuarios_tipo_df] DEFAULT 0,
    CONSTRAINT [usuarios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[areas] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [idUser] BIGINT NOT NULL,
    [tamanho] DECIMAL(18,2) NOT NULL CONSTRAINT [areas_tamanho_df] DEFAULT 0,
    [descricao] VARCHAR(200) NOT NULL,
    [latitude] VARCHAR(50) NOT NULL,
    [longitude] VARCHAR(50) NOT NULL,
    CONSTRAINT [areas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[culturas] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [idUser] BIGINT NOT NULL,
    [descricao] VARCHAR(200) NOT NULL,
    CONSTRAINT [culturas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[plantacoes] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [idUser] BIGINT NOT NULL,
    [idArea] BIGINT,
    [idCultura] BIGINT,
    [dataPlantacao] DATETIME2,
    [quantidade] DECIMAL(18,2) NOT NULL CONSTRAINT [plantacoes_quantidade_df] DEFAULT 0,
    CONSTRAINT [plantacoes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sensores] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [idUser] BIGINT NOT NULL,
    [idArea] BIGINT,
    [latitude] VARCHAR(50) NOT NULL,
    [longitude] VARCHAR(50) NOT NULL,
    [descricao] VARCHAR(50) NOT NULL,
    [tipo] VARCHAR(50) NOT NULL,
    [dataInstalacao] DATETIME2,
    CONSTRAINT [sensores_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[leituras] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [idUser] BIGINT NOT NULL,
    [idSensor] BIGINT NOT NULL,
    [umidadeMedida] DECIMAL(18,2) NOT NULL CONSTRAINT [leituras_umidadeMedida_df] DEFAULT 0,
    [dataMedicao] DATETIME2 NOT NULL CONSTRAINT [leituras_dataMedicao_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [leituras_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[areas] ADD CONSTRAINT [areas_idUser_fkey] FOREIGN KEY ([idUser]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[culturas] ADD CONSTRAINT [culturas_idUser_fkey] FOREIGN KEY ([idUser]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[plantacoes] ADD CONSTRAINT [plantacoes_idUser_fkey] FOREIGN KEY ([idUser]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[plantacoes] ADD CONSTRAINT [plantacoes_idArea_fkey] FOREIGN KEY ([idArea]) REFERENCES [dbo].[areas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[plantacoes] ADD CONSTRAINT [plantacoes_idCultura_fkey] FOREIGN KEY ([idCultura]) REFERENCES [dbo].[culturas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sensores] ADD CONSTRAINT [sensores_idUser_fkey] FOREIGN KEY ([idUser]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sensores] ADD CONSTRAINT [sensores_idArea_fkey] FOREIGN KEY ([idArea]) REFERENCES [dbo].[areas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[leituras] ADD CONSTRAINT [leituras_idUser_fkey] FOREIGN KEY ([idUser]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[leituras] ADD CONSTRAINT [leituras_idSensor_fkey] FOREIGN KEY ([idSensor]) REFERENCES [dbo].[sensores]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

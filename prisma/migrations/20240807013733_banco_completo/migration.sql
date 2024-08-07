-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" INTEGER DEFAULT 0,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "tamanho" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "descricao" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "culturas" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "culturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantacoes" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idArea" TEXT,
    "idCultura" TEXT,
    "dataPlantacao" TIMESTAMP(3),
    "quantidade" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "plantacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensores" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idArea" TEXT,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataInstalacao" TIMESTAMP(3),

    CONSTRAINT "sensores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leituras" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idSensor" TEXT NOT NULL,
    "umidadeMedida" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataMedicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leituras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "culturas" ADD CONSTRAINT "culturas_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantacoes" ADD CONSTRAINT "plantacoes_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantacoes" ADD CONSTRAINT "plantacoes_idArea_fkey" FOREIGN KEY ("idArea") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantacoes" ADD CONSTRAINT "plantacoes_idCultura_fkey" FOREIGN KEY ("idCultura") REFERENCES "culturas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensores" ADD CONSTRAINT "sensores_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensores" ADD CONSTRAINT "sensores_idArea_fkey" FOREIGN KEY ("idArea") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras" ADD CONSTRAINT "leituras_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras" ADD CONSTRAINT "leituras_idSensor_fkey" FOREIGN KEY ("idSensor") REFERENCES "sensores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

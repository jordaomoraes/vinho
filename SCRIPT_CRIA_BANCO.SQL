-- ============================
-- TABELA USUARIOS
-- ============================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo INT DEFAULT 0
);

-- ============================
-- TABELA AREAS
-- ============================
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    idUser INT NOT NULL,
    tamanho FLOAT DEFAULT 0,
    descricao VARCHAR(255) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    CONSTRAINT fk_area_usuario FOREIGN KEY (idUser) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_areas_user ON areas(idUser);

-- ============================
-- TABELA CULTURAS
-- ============================
CREATE TABLE culturas (
    id SERIAL PRIMARY KEY,
    idUser INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    CONSTRAINT fk_cultura_usuario FOREIGN KEY (idUser) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_culturas_user ON culturas(idUser);

-- ============================
-- TABELA PLANTACOES
-- ============================
CREATE TABLE plantacoes (
    id SERIAL PRIMARY KEY,
    idUser INT NOT NULL,
    idArea INT,
    idCultura INT,
    dataPlantacao TIMESTAMP,
    quantidade FLOAT DEFAULT 0,
    CONSTRAINT fk_plantacao_usuario FOREIGN KEY (idUser) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_plantacao_area FOREIGN KEY (idArea) REFERENCES areas(id) ON DELETE SET NULL,
    CONSTRAINT fk_plantacao_cultura FOREIGN KEY (idCultura) REFERENCES culturas(id) ON DELETE SET NULL
);

CREATE INDEX idx_plantacoes_user ON plantacoes(idUser);
CREATE INDEX idx_plantacoes_area ON plantacoes(idArea);
CREATE INDEX idx_plantacoes_cultura ON plantacoes(idCultura);

-- ============================
-- TABELA SENSORES
-- ============================
CREATE TABLE sensores (
    id SERIAL PRIMARY KEY,
    idUser INT NOT NULL,
    idArea INT,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    dataInstalacao TIMESTAMP,
    CONSTRAINT fk_sensor_usuario FOREIGN KEY (idUser) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_sensor_area FOREIGN KEY (idArea) REFERENCES areas(id) ON DELETE SET NULL
);

CREATE INDEX idx_sensores_user ON sensores(idUser);
CREATE INDEX idx_sensores_area ON sensores(idArea);

-- ============================
-- TABELA LEITURAS
-- ============================
CREATE TABLE leituras (
    id SERIAL PRIMARY KEY,
    idUser INT NOT NULL,
    idSensor INT NOT NULL,
    umidadeMedida FLOAT DEFAULT 0,
    dataMedicao TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_leitura_usuario FOREIGN KEY (idUser) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_leitura_sensor FOREIGN KEY (idSensor) REFERENCES sensores(id) ON DELETE CASCADE
);

CREATE INDEX idx_leituras_user ON leituras(idUser);
CREATE INDEX idx_leituras_sensor ON leituras(idSensor);

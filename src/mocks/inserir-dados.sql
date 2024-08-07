INSERT INTO usuarios (nome, email, senha, tipo)
VALUES
  ('Guilherme', 'gui@example.com', 'senha1', 0),
  ('Fabiano', 'fabiano@example.com', 'senha2', 1);

INSERT INTO areas (idUser, tamanho, descricao, latitude, longitude)
VALUES
  (1, 100.5, 'Quadrante A', '10.0000', '-20.0000'),
  (2, 200.75, 'Quadrante B', '11.0000', '-21.0000');

INSERT INTO culturas (idUser, descricao)
VALUES
  (1, 'Uva Branca'),
  (2, 'Uva verde');

INSERT INTO plantacoes (idUser, idArea, idCultura, dataPlantacao, quantidade)
VALUES
  (1, 1, 1, '2024-01-01T00:00:00.000Z', 50.5),
  (2, 2, 2, '2024-01-02T00:00:00.000Z', 75.75);

INSERT INTO sensores (idUser, idArea, latitude, longitude, descricao, tipo, dataInstalacao)
VALUES
  (1, 1, '10.0001', '-20.0001', 'Umidade', 'Tipo 1', '2024-02-01T00:00:00.000Z'),
  (2, 2, '11.0001', '-21.0001', 'Temperatura', 'Tipo 2', '2024-02-02T00:00:00.000Z');


INSERT INTO leituras (idUser, idSensor, umidadeMedida, dataMedicao)
VALUES
  (1, 1, 30.5, '2024-03-01T00:00:00.000Z'),
  (2, 2, 40.75, '2024-03-02T00:00:00.000Z');

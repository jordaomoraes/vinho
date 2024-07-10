-- CriA uma stored procedure para inserir dados em docReferencia e pesoLoteProgramado
CREATE PROCEDURE InsertOS
  @docReferencia VARCHAR(255),
  @pesoLoteProgramado FLOAT
AS
BEGIN
  INSERT INTO Lotes (docReferencia, pesoLoteProgramado)
  VALUES (@docReferencia, @pesoLoteProgramado);
END;


-- Exmplos de uso e inserção de dados na Store procedure criada.

EXEC InsertOS 'Doc001', 220.0;
EXEC InsertOS 'Doc002', 215.0;
EXEC InsertOS 'Doc003', 212.0;
EXEC InsertOS 'Doc004', 216.0;
EXEC InsertOS 'Doc005', 220.0;
EXEC InsertOS 'Doc006', 215.0;
EXEC InsertOS 'Doc007', 212.0;
EXEC InsertOS 'Doc008', 216.0;


INSERT INTO [DBGuaxupe].[dbo].[loteAtual] ([idLote], [pesoLote], [pesoAtual], [producaoHoje], [producaoTotal], [modoOperacao], [statusEquipamento], [docReferencia])
VALUES (0, 0, 0, 0, 0, 0, '--', '--');
INSERT INTO [DBGuaxupe].[dbo].[loteAtual] ([idLote], [pesoLote], [pesoAtual], [producaoHoje], [producaoTotal], [modoOperacao], [statusEquipamento], [docReferencia])
VALUES (0, 0, 0, 0, 0, 0, '--', '--');
INSERT INTO [DBGuaxupe].[dbo].[loteAtual] ([idLote], [pesoLote], [pesoAtual], [producaoHoje], [producaoTotal], [modoOperacao], [statusEquipamento], [docReferencia])
VALUES (0, 0, 0, 0, 0, 0, '--', '--');
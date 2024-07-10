const { DataType, VariantArrayType } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");

const opcuaConnection = new OPCUAConnection();
const escreveStatusLoteFinalizado = async ({ servidor: idServidor, idLote:id }) => {
  // descomentar e indicar nodeID do CLP
  // const nodeId = 'ns=4;i=2';
  const nodeId = "ns=4;s=Demo.Static.Scalar.Boolean";
  let serverOPCUA = 'opc.tcp://192.168.0.1:4840';
  var idSemEspacos = idServidor.replace(/\0/g, '');

  if (idSemEspacos === '1') {
    serverOPCUA = process.env.OPCUA_SERVER1;
  } else if (idSemEspacos === '2') {
    serverOPCUA = process.env.OPCUA_SERVER2;
  } else if (idSemEspacos ==='3')
    serverOPCUA = process.env.OPCUA_SERVER3;
  else {
    console.log(`Server de dados --> ${idSemEspacos} <-- não informado ou não localizado`);
    return ({ message: 'Servidor de DADOS não informado / localizado' })
  }

  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);
    const value = {
      dataType: DataType.Boolean,
      arrayType: VariantArrayType.Boolean,
      value: true
    };
    await opcuaConnection.session.writeSingleNode(nodeId, value);
    console.log(`Status do lote ${id} finalizado com sucesso na SmartSac ${idSemEspacos}.`);

    return ({ message: "Status atualizado com sucesso" });

  } catch (err) {
    console.error(`Erro ao finalizado o lote ${id} na SmartSac ${idSemEspacos}.`, err.message);
    res.status(500).json({ error: `Erro ao atualizar status de PLC online, SmartSac ${idSemEspacos}.` });
  } finally {
    // await opcuaConnection.disconnectFromOPCUAServer(serverOPCUA);
  }
};

module.exports = escreveStatusLoteFinalizado;

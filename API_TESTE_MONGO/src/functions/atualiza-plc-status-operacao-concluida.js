const { DataType, VariantArrayType } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");

const opcuaConnection = new OPCUAConnection();
const atualizaStatusOperacaoClp = async ({ servidor: idServidor }) => {
  const nodeId = `ns=4;i=3`;
  let serverOPCUA = '';
  var idSemEspacos = idServidor.replace(/\0/g, '');

  if (idSemEspacos === '1') {
    serverOPCUA = process.env.OPCUA_SERVER1;
  } else if (idSemEspacos === '2') {
    serverOPCUA = process.env.OPCUA_SERVER2;
  } else if (idSemEspacos === '3')
    serverOPCUA = process.env.OPCUA_SERVER3;
  else {
    return ({ message: 'Server OPC-UA não informado / localizado' })
  }

  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);
    const value = {
      dataType: DataType.Boolean,
      arrayType: VariantArrayType.Boolean,
      value: true
    };
    await opcuaConnection.session.writeSingleNode(nodeId, value);

    return ({ message: "Status PLC Online atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar status PLC Online:", err.message);
    res.status(500).json({ error: "Erro ao atualizar valor no OPC UA, plc Online" });
  }finally {
    // await opcuaConnection.disconnectFromOPCUAServer(serverOPCUA);
  }
};

module.exports = atualizaStatusOperacaoClp;

const { DataType, Variant, VariantArrayType } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");
const opcuaConnection = new OPCUAConnection();

const getServerUrl = (idServidor) => {
  const idSemEspacos = idServidor.replace(/\0/g, '');
  switch (idSemEspacos) {
    case '1':
      return process.env.OPCUA_SERVER1;
    case '2':
      return process.env.OPCUA_SERVER2;
    case '3':
      return process.env.OPCUA_SERVER3;
    case '4':
      return process.env.OPCUA_SERVER4;
    default:
      throw new Error('Server OPC-UA não informado / localizado');
  }
};
const escreveUnicoRegistro = async ({ dados: data,
  servidor: idServidor,
  nodeCompleto: nodeIdCompleto
}) => {

  let serverOPCUA = '';
  // var idSemEspacos = idServidor.replace(/\0/g, '');
  try {
    serverOPCUA = getServerUrl(idServidor);
  } catch (error) {
    return { message: error.message };
  }
  // DESCOMENTAR PARA LER OS VALORES DO PLC
  const nodeId = nodeIdCompleto

  //AQUI VAI ESCREVER NO SIMULADOR
 // const nodeId = "ns=4;s=Demo.Static.Arrays.String";

  const arrayConvertido = data.map(element => String(element));

  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);

    const value = new Variant({
      dataType: DataType.String,
      arrayType: VariantArrayType.Array,
      value: arrayConvertido,
    });
    await opcuaConnection.session.writeSingleNode(nodeId, value);

    return ({ message: "Valor escrito com sucesso" });

  } catch (err) {
    console.error("Erro:", err);
    return ({ error: "Erro ao escrever o valor no OPC UA" });
  } finally {
    // await opcuaConnection.disconnectFromOPCUAServer(serverOPCUA);
  }
};

module.exports = escreveUnicoRegistro;

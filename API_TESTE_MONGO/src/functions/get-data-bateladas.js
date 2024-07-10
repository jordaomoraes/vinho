const { resolveNodeId, AttributeIds } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");
const exampleRetorno5Bateladas = require('../mocks/retorno-plc-5-bateladas.json')

const opcuaConnection = new OPCUAConnection();

const getDataBatelada = async ({ idPlc: idServidor }) => {

  let serverOPCUA = process.env.OPCUA_SERVER1;
  let nodeIdConsultar = ''
  const idSemEspacos = idServidor.replace(/\0/g, '');
  let statusLeituraPLC = false

  if (idSemEspacos === '1') {
    serverOPCUA = process.env.OPCUA_SERVER1;
    nodeIdConsultar = process.env.NODEID_BATELADAS_SERVER1;
  } else if (idSemEspacos === '2') {
    serverOPCUA = process.env.OPCUA_SERVER2;
    nodeIdConsultar = process.env.NODEID_BATELADAS_SERVER2;
  } else if (idSemEspacos === '3') {
    serverOPCUA = process.env.OPCUA_SERVER3;
    nodeIdConsultar = process.env.NODEID_BATELADAS_SERVER3;
  } else if (idSemEspacos === '4') {
    serverOPCUA = process.env.OPCUA_SERVER4;
    nodeIdConsultar = process.env.NODEID_BATELADAS_SERVER4;
  }
  else {
    return ({ message: 'Server OPC-UA não informado / localizado' })
  }

  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);

    // DESCOMENTAR PARA LER OS VALORES DO PLC

    const dadosLidosPLC = await opcuaConnection.session.read({
      nodeId: resolveNodeId(nodeIdConsultar),
      attributeId: AttributeIds.String,
    });

    // AQUI VAI LER OS VALORES DO MOCK
    // const dadosLidosPLC = exampleRetorno5Bateladas;

    const dadosPlc = dadosLidosPLC.value.value;

    return { dadosPlc };

  } catch (err) {
    console.error(`Ocorreu um erro : ${err.message}.`);
    return { statusLeituraPLC };
  }
  finally {
    // await opcuaConnection.disconnectFromOPCUAServer(serverOPCUA);
  }
};

module.exports = getDataBatelada;

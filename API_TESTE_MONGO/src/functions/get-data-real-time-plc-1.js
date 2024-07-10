const { resolveNodeId, AttributeIds } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");
const exampleRetorno5Bateladas = require('../mocks/retorno-plc-5-bateladas.json')

const opcuaConnection = new OPCUAConnection();

const getDataRealTimePLC1 = async () => {

  let serverOPCUA = process.env.OPCUA_SERVER1;
  let nodeIdConsultar = ''

   nodeIdConsultar = process.env.NODEID_BATELADAS_SERVER1;
  //nodeIdConsultar = "ns=4;s=Demo.Static.Arrays.String";
  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);
    const dadosLidosPLC = await opcuaConnection.session.read({
      nodeId: resolveNodeId(nodeIdConsultar),
      attributeId: AttributeIds.String,
    });

    // AQUI VAI LER OS VALORES DO MOCK
    // const dadosLidosPLC = exampleRetorno5Bateladas;

    const dadosPlc = dadosLidosPLC.value.value;
    console.log(dadosPlc);
    return { dadosPlc };

  } catch (err) {
    console.error(`Ocorreu um erro : ${err.message}.`);
    return { statusLeituraPLC };
  }
};

module.exports = getDataRealTimePLC1;

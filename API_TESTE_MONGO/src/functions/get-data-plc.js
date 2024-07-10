const { AttributeIds } = require("node-opcua");
const OPCUAConnection = require("../utils/conect-opcua-server");
const escreveUnicoRegistro = require('./escreve-plc-unico-registro');
const opcuaConnection = new OPCUAConnection();

const getDataPLC = async (data, smartsSelecionadas) => {
  const hasSmart1 = smartsSelecionadas[0]
  const hasSmart2 = smartsSelecionadas[1]
  const hasSmart3 = smartsSelecionadas[2]

  const nodeIdEnds = [
    "ns=4;i=1675",
    "ns=4;i=1682",
    "ns=4;i=1689",
    "ns=4;i=1696",
    "ns=4;i=1703",
    "ns=4;i=1710",
    "ns=4;i=1717",
    "ns=4;i=1724",
    "ns=4;i=1731",
    "ns=4;i=1738"
  ];

  if (hasSmart1) {
    console.log("*** Enviando dados para a SmartBag 1 ***");
    const serverOPCUA1 = process.env.OPCUA_SERVER1;
    const idServidor = '1';
    await enviaDadosPLC(serverOPCUA1, nodeIdEnds, idServidor, data);
  }
  if (hasSmart2) {
    console.log("*** Enviando dados para a SmartBag 2 ***");
    const serverOPCUA2 = process.env.OPCUA_SERVER2;
    const idServidor = '2';
    await enviaDadosPLC(serverOPCUA2, nodeIdEnds, idServidor, data);
  }
  if (hasSmart3) {
    console.log("*** Enviando dados para a SmartBag 3 **8");
    const serverOPCUA3 = process.env.OPCUA_SERVER3;
    const idServidor = '3';
    await enviaDadosPLC(serverOPCUA3, nodeIdEnds, idServidor, data);
  }
};

const enviaDadosPLC = async (serverOPCUA, nodeIdEnds, idServidor, data) => {

  let dadosPlc1 = []

  try {
    await opcuaConnection.connectToOPCUAServer(serverOPCUA);

    let tentativas = 0;
    for (let i = 0; i < nodeIdEnds.length; i++) {
      const dadosLidosPLC = await opcuaConnection.session.read({
        nodeId: nodeIdEnds[i],
        attributeId: AttributeIds.String,
      });
      // informar aqui o nodeID novo do PLC, para enviar um unico registro
      //modelo 'ns=4;i=4'
      nodeIdCompleto = nodeIdEnds[i];
      // nodeIdCompleto = process.env.NODEID_GRAVAR_ORDEM;
      dadosPlc1 = dadosLidosPLC.value.value ? dadosLidosPLC.value.value : 0;

    //DESCOMENTAR O IF PARA LER OS VALORES DO PLC

      // if (dadosPlc1[0] == 0) {
      //  await opcuaConnection.disconnectFromOPCUAServer();
        await escreveUnicoRegistro({ dados: data, nodeCompleto: nodeIdCompleto, servidor: idServidor });
        break;
      // } else {
      //   tentativas++;
      //   console.log(`Node Id ${nodeIdCompleto} do server ${idServidor} ocupado`);
      // }
    }
    return { numTentativas: tentativas };
  } catch (err) {
    console.error("Erro:", err.message);
    throw new Error("Erro ao ler os valores do OPC UA");
  }
};

module.exports = getDataPLC;

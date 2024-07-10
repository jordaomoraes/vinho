require('dotenv').config();
const opcua = require("node-opcua");

class OPCUAConnection {
  constructor() {
    this.client = null;
    this.session = null;
    this.serverOPCUA = null;
  }

  async connectToOPCUAServer(serverOPCUA) {

    if (this.isConnected(serverOPCUA)) {
      console.log(`Conectado ao servidor no endereço      --> ${serverOPCUA} <-- Realizando operações de escrita e leitura.`);
      return;
    }
    console.log(`Iniciando a conexão ao PLC no endereço --> ${serverOPCUA}.`);

    try {
      if (this.client) {
        await this.disconnectFromOPCUAServer();
      }

      this.client = opcua.OPCUAClient.create({
        endpointMustExist: false,
        keepSessionAlive: true,
        connectionStrategy: {
          maxRetry: 2,
          initialDelay: 2000,
          maxDelay: 10 * 1000
        }
      });
      await this.client.connect(serverOPCUA);
      this.session = await this.client.createSession();
      this.serverOPCUA = serverOPCUA;

      console.log(`Conectado com sucesso no endereço      --> ${serverOPCUA}.`);
    } catch (error) {
      console.error(`Erro ao conectar ao servidor no endereço --> ${serverOPCUA}.`);
    }
  }

  async disconnectFromOPCUAServer(serverOPCUA) {
    try {
      if (this.session) {
        await this.session.close();
        this.session = null;
        console.log(`Sessão encerrada com sucesso no endereço ${serverOPCUA}.`);
      }

      if (this.client) {
        await this.client.disconnect();
        this.client = null;
        this.serverOPCUA = null;
        console.log(`Desconectado com sucesso no endereço ${serverOPCUA}.`);
      }
    } catch (error) {
      console.error(`Erro ao desconectar no endereço ${serverOPCUA}.`, error);
    }
  }
  isConnected(serverOPCUA) {
    return this.client && this.session && this.serverOPCUA === serverOPCUA;
  }
}

module.exports = OPCUAConnection;
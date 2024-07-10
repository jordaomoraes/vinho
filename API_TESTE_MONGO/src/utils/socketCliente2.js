const net = require('net');
const readLine = require('readline');
const processaParametroPLC = require('../functions/processa-parametros-plc')

class SocketClient2 {
  constructor() {
    this.serverHost = process.env.SOCKET_SERVER2 || '127.0.0.1';;
    this.serverPort = process.env.SOCKET_PORT2 || 2000;
    this.rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.connectSocket();
  }
  async connectSocket() {
    try {
      this.socketClient = net.createConnection({ host: this.serverHost, port: this.serverPort }, () => {
        console.log('Conexão de socket estabelecida com o servidor remoto 2.');

        this.rl.addListener('line', line => {
          this.socketClient.write(line);
        });
      });

    } catch (error) {
      console.error('Erro ao se conectar com o servidor remoto 2:', error);
      setTimeout(() => this.reconnect(), 5000);
    }

    await this.socketClient.on('data', data => {
      console.log('Dados recebidos do servidor remoto 2:', data.toString());

      const dadosRecebido = data.toString();
      processaParametroPLC(dadosRecebido)
    });

    this.socketClient.on('close', () => {
      console.log('Conexão de socket fechada pelo servidor remoto 2.');
      setTimeout(() => this.reconnect(), 5000);
    });

    try {
      this.socketClient.on('error', error => {
        console.error('Erro na conexão do servidor de socket remoto 2:', error);
      });

    } catch (error) {
    }
  }
  reconnect() {
    this.socketClient.end();
    console.log('Tentando reconectar...');
    this.socketClient.connect(this.serverPort, this.serverHost);
  }
}

module.exports = SocketClient2;

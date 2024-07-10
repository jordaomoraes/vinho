const net = require('net');
const readLine = require('readline');
const processaParametroPLC = require('../functions/processa-parametros-plc')

class SocketClient {
  constructor() {
    this.serverHost = process.env.SOCKET_SERVER1 || '127.0.0.1';;
    this.serverPort = process.env.SOCKET_PORT1 || 4001;
    this.rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.connectSocket();
  }
  async connectSocket() {
    try {
      this.socketClient = net.createConnection({ host: this.serverHost, port: this.serverPort }, () => {
        console.log('Conexão de socket estabelecida com o servidor remoto 1.');

        this.rl.addListener('line', line => {
          this.socketClient.write(line);
        });
      });

    } catch (error) {
      console.error('Erro ao se conectar com o servidor remoto 1:', error);
      setTimeout(() => this.reconnect(), 5000);
    }

    try {
      await this.socketClient.on('data', data => {
        console.log('Dados recebidos do servidor remoto 1:', data.toString());

        const dadosRecebido = data.toString();
        processaParametroPLC(dadosRecebido)
      });

    } catch (error) {
      console.error('Erro ao receber dados do servidor 1:', error);
    }


    this.socketClient.on('close', () => {
      console.log('Conexão de socket fechada pelo servidor remoto 1.');
      setTimeout(() => this.reconnect(), 5000);
    });

    try {
      this.socketClient.on('error', error => {
        console.error('Erro na conexão do servidor de socket remoto 1:', error);
      });

    } catch (error) {
    }

    this.rl.on('line', (line) => {
      this.socketClient.write(line);
    });

  }

  reconnect() {
    this.socketClient.end();
    console.log('Tentando reconectar...');
    this.socketClient.connect(this.serverPort, this.serverHost);
  }
}

module.exports = SocketClient;

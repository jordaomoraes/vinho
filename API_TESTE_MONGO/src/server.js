const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const rotasLotes = require('../src/controllers/lotes');
const rotasLoteAtual = require('../src/controllers/loteatual');
const rotasBateladas = require('../src/controllers/bateladas');
const rotasUsuarios = require('../src/controllers/users');
const rotasPlc1 = require('../src/controllers/escreve-dados-plc');
const SocketClient1 = require('../src/utils/socketCliente1');
const SocketClient2 = require('../src/utils/socketCliente2');
const SocketClient3 = require('../src/utils/socketCliente3');
const SocketClient4 = require('../src/utils/socketCliente4');
const GetdataRealTimePLC1 = require('../src/functions/get-data-real-time-plc-1');
const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://jordao:jordao123@cluster0.kifw479.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);


// const intervalTime = 100; // Intervalo em milissegundos (5 segundos)
// let isReading = false;
// let contador = 0;

// async function loopReadPLC() {
//   if (isReading) {
//     console.warn('Leitura em andamento, aguardando próxima execução.');
//     return;
//   }

//   isReading = true;
//   try {
//     await GetdataRealTimePLC1();
//     contador++;
//     console.log("Leitura --> " + contador);
//   } catch (error) {
//     console.error('Erro iniciar leitura PLC 1, Cliente 1.', error);
//   } finally {
//     isReading = false;
//   }
// }

// // Inicia o loop com setInterval
// setInterval(loopReadPLC, intervalTime);

// try {
//   new SocketClient1(); // Cria uma instância de SocketClient
// } catch (error) {
//   console.error('Erro connectar no socket remoto, Cliente 1.', error);
// }

//  try {
//   new SocketClient2(); // Cria uma instância de SocketClient
// } catch (error) {
//   console.error('Erro connectar no socket remoto, Cliente 2.', error);
// }

// try {
//   new SocketClient3(); // Cria uma instância de SocketClient
// } catch (error) {
//   console.error('Erro connectar no socket remoto, Cliente 3.', error);
// }

// try {
//   new SocketClient4(); // Cria uma instância de SocketClient
// } catch (error) {
//   console.error('Erro connectar no socket remoto, Cliente 3.', error);
// }


app.use(express.json());
app.use(cors());
app.use(rotasPlc1);
app.use(rotasLotes);
app.use(rotasLoteAtual);
app.use(rotasBateladas);
app.use(rotasUsuarios);

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

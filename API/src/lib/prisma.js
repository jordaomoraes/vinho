const { PrismaClient } = require('@prisma/client');
const retry = require('retry');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
});
async function connectWithRetry() {
  const operation = retry.operation({
    retries: 5,            // Número máximo de tentativas
    factor: 2,             // Fator de multiplicação para o intervalo de tempo
    minTimeout: 2000,      // Tempo mínimo de espera entre tentativas (em milissegundos)
    maxTimeout: 30000,     // Tempo máximo de espera entre tentativas (em milissegundos)
  });
  const uri = "mongodb+srv://jordao:jordao123@cluster0.kifw479.mongodb.net/DbTest?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      console.log(`Iniciando conexão com o banco de dados. Tentativa ${currentAttempt}.`);
      try {
        await client.connect();
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
        console.log();
        resolve();
      } catch (e) {
        if (operation.retry(e)) {
          console.log(`Tentativa ${currentAttempt} falhou. Tentando novamente...`);
          return;
        }
        reject(operation.mainError());
      }
    });
  });
}

async function main() {
  try {
    await connectWithRetry();
    // Coloque aqui o resto do seu código, por exemplo, suas operações de banco de dados
  } catch (e) {
    console.error("Falha ao conectar ao banco de dados após várias tentativas:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
module.exports = prisma;
const { Router } = require('express');
const getDataBatelada = require('../functions/get-data-bateladas');
const getDataPLC = require('../functions/get-data-plc');
const LoteController = require('../classes/lote-controller');
const loteController = new LoteController();
const prisma = require('../lib/prisma');

const escrevePlcUnicoRegistro = require('../functions/escreve-plc-unico-registro');
const escreveStatusLoteFinalizado = require('../functions/escreve-status-lote-finalizado');

const router = Router();

// rotas para escrever no PLC a partir de chamadas HTTP(Insominia Ou FrontEnd)
router.get("/", (req, res) => {
  res.json({ message: "Sucesso" });
});

router.post("/verificaplc", async (req, res) => {

  const { data, idServidor } = req.body;
  const hasSmart1 = idServidor.SmartSac1 == true ? true : false
  const hasSmart2 = idServidor.SmartSac2 == true ? true : false
  const hasSmart3 = idServidor.SmartSac3 == true ? true : false
  console.log();
  console.log("Dados a serem enviados a SmartBag      --> " + data)

  const smartsSelecionadas = [hasSmart1, hasSmart2, hasSmart3];

  try {
    const valoresPLC1 = await getDataPLC(data, smartsSelecionadas);
    res.json(valoresPLC1);

  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro durante a operação" });
  }
});
// rota usada para finalizar o lote no banco de dados e CLP
router.post("/finalizalote", async (req, res) => {
  const { id } = req.query;

  try {
    const balancasSelecionadas = await prisma.$queryRaw`
      SELECT endMaquina
      FROM lotes
      WHERE id = ${Number(id)}
    `;
    if (balancasSelecionadas.length > 0) {
      const endMaquinaString = balancasSelecionadas[0].endMaquina;
      const maquinas = endMaquinaString.split(',');

      for (const maquina of maquinas) {
        if (maquina === '1') {
          console.log("*** Finalizando lote na SmartBag 1 ***");
          const idServidor = '1';
          await escreveStatusLoteFinalizado({ servidor: idServidor, idLote: id });
        } else if (maquina === '2') {
          console.log("*** Finalizando lote na SmartBag 2 ***");
          const idServidor = '2';
          await escreveStatusLoteFinalizado({ servidor: idServidor, idLote: id });
        } else if (maquina === '3') {
          console.log("*** Finalizando lote na SmartBag 3 ***");
          const idServidor = '3';
          await escreveStatusLoteFinalizado({ servidor: idServidor, idLote: id });
        }
      }
      await loteController.finalizaLote({ id: id});
    } else {
      console.log("Nenhuma balança selecionada encontrada para o id fornecido.");
      return res.status(400).json({ message: "Nenhuma balança selecionada encontrada para o id fornecido." });
    }
    return res.status(200).json({ message: 'Lote finalizado com sucesso' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao finalizar o lote', description: error });
  }
});

//rota usada pelo frontEnd para enviar dados, quando o Lote é selecionado individualmente
router.post("/adicionaloteplc", async (req, res) => {

  const { data, idServidor, ns, tipoIdentificador, valorIdentificador } = req.body;

  try {
    await escrevePlcUnicoRegistro({
      dados: data,
      servidor: idServidor,
      nsIndex: ns,
      tipo: tipoIdentificador,
      identificador: valorIdentificador
    });

    res.json({ message: "Valor escrito com sucesso" });

  } catch (err) {
    console.error("Erro:", err.message);
    res.status(500).json({ error: "Erro ao escrever o valor no OPC UA" });
  }
});

router.get("/valorbateladaplc1", async (req, res) => {
  try {
    const valoresPLC = await getDataBatelada();
    res.json({ data: valoresPLC });

  } catch (error) {
    console.error("Erro:", error.message);
    res.status(500).json({ error: "Erro durante a operação" });
  }
});

module.exports = router;
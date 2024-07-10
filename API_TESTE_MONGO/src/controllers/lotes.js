const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const moment = require('moment');
const { startOfDay, endOfDay } = require('date-fns');

const router = Router();

//rota para listar todos os lotes
router.get('/lotes/listartodos', async (req, res) => {
  try {
      const todosOsLotes = await prisma.lote.findMany({
      where: {
        consumed: false,
      },
    });
    return res.status(200).json(todosOsLotes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar os lotes', description: error });
  }
});
//rota para listar todos os lotes de acordo com o PLC
router.get('/lotes/listartodosclp', async (req, res) => {
  const { endMaquina } = req.query;
  try {
    const todosOsLotes = await prisma.lote.findMany({
      where: {
        endMaquina: endMaquina,
      },
    });
    return res.status(200).json(todosOsLotes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar os lotes', description: error });
  }
});
//rota pra listar unico lote
router.get('/lote/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lote = await prisma.lote.findUnique({
      where: { id: parseInt(id) },
    });

    if (!lote) {
      return res.status(404).json({ error: 'Lote não encontrado' });
    }

    return res.status(200).json(lote);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar lote', description: error });
  }
});
//rota listar lotes já enviados ao plc
router.get('/lote/enviadoclp/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lote.update({
      where: { id: Number(id) },
      data: {
        status: 'Enviado CLP'
      },
    });

    return res.status(200).json({ message: 'Lote alterado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao alterar o lote', description: error });
  }
});

//rota alterar status para enviado PLC
router.put('/lote/alterarstatus', async (req, res) => {
  const { id } = req.query;

  const registerBodySchema = z.object({
    endMaquina: z.string()
  });

  const { endMaquina } = registerBodySchema.parse(req.body);

  try {
    await prisma.lote.update({
      where: { id: Number(id) },
      data: {
        status: 'Enviado PLC',
        endMaquina: endMaquina
      },
    });

    return res.status(200).json({ message: 'Status do lote alterado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao alterar o lote', description: error });
  }
});
//rota para consultar por status
router.get('/lotes/consultarstatus', async (req, res) => {
  const { status } = req.body;

  try {
    const lotes = await prisma.lote.findMany({
      where: { status },
    });

    return res.status(200).json(lotes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao consultar os lotes', description: error });
  }
});

router.get('/lotes/consultarstatuspordata', async (req, res) => {
  const { status, data_inicio, data_fim  } = req.query;
  const startDate = data_inicio ? startOfDay(new Date(data_inicio)) : startOfDay(new Date());
  const endDate = data_fim ? endOfDay(new Date(data_fim)) : endOfDay(new Date());

  try {
    const lotes = await prisma.lote.findMany({
      where: {
        AND: [
          {
            dataCadastro: {
              gte: startDate.toISOString(),
              lte: endDate.toISOString(),
            },
          },
          { status }
        ]
      },
    });

    return res.status(200).json(lotes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao consultar os lotes', description: error });
  }
});

//rota que retorna a soma dos valores das bateladas e quantidade de acordo com um lote
router.get('/lotes/somavalores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await prisma.$queryRaw`
      SELECT COUNT(*) AS quantidadeBateladas, ROUND(SUM(pesoBatelada), 2) AS pesoTotal
      FROM bateladas
      WHERE idLote = ${Number(id)}
    `;
    const { quantidadeBateladas, pesoTotal } = resultado[0];

    return res.status(200).json({
      quantidadeBateladas: Number(quantidadeBateladas),
      pesoTotal: Number(pesoTotal)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar as bateladas', description: error });
  }
});

//rota para deletar lote
router.delete('/lote', async (req, res) => {
  const { id } = req.query;

  try {
    const lote = await prisma.lote.findUnique({
      where: { id: parseInt(id) },
    });

    if (!lote) {
      return res.status(404).json({ error: 'Lote não encontrado' });
    }

    await prisma.lote.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Lote deletado com sucesso' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao deletar o lote', description: error });
  }
});

module.exports = router;

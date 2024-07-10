const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { startOfDay, endOfDay } = require('date-fns');

const router = Router();

//rota que adiciona um lote
router.post('/batelada/adicionar', async (req, res) => {
  const registerBodySchema = z.object({
    idLote: z.number().int(),
    idPlc: z.number().int(),
    bateladas: z.array(z.number()),
  });

  const { idLote, bateladas, idPlc } = registerBodySchema.parse(req.body);

  try {
    for (const pesoBatelada of bateladas) {
      if (pesoBatelada !== 0) {
        await prisma.batelada.create({
          data: {
            pesoBatelada,
            idPlc,
            dataBatelada: new Date(),
            lote: {
              connect: {
                id: idLote
              }
            }
          },
        });
      }
    }

    return res.status(201).json({ message: 'Bateladas criadas com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao criar as bateladas', description: error });
  }
});

//rota para listas as bateladas de um lote
router.get('/batelada/buscarporlote', async (req, res) => {
  const { id } = req.query;

  try {
    const bateladas = await prisma.batelada.findMany({
      where: { idLote: Number(id) },
    });

    return res.status(200).json(bateladas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar as bateladas', description: error });
  }
});

router.get('/batelada/buscarpordata', async (req, res) => {
  const { data_inicio, data_fim, idPlc } = req.query;

  const startDate = data_inicio ? startOfDay(new Date(data_inicio)) : startOfDay(new Date());
  const endDate = data_fim ? endOfDay(new Date(data_fim)) : endOfDay(new Date());

  try {
    const resultado = await prisma.$queryRaw`
    SELECT COUNT(*) AS quantidadeBateladas, ROUND(SUM(pesoBatelada), 2) AS pesoTotal
    FROM bateladas
    WHERE idPlc = ${Number(idPlc)}
    AND dataBatelada BETWEEN ${startDate} AND ${endDate};
  `;

    const totalGeral = await prisma.$queryRaw`
    SELECT ROUND(SUM(pesoBatelada), 2) AS pesoTotalGeral
      FROM bateladas
      WHERE idPlc = ${Number(idPlc)}
  `;

    const pesoTotalGeral = totalGeral[0].pesoTotalGeral ? totalGeral[0].pesoTotalGeral.toString() : 0;
    const pesoTotalDia = resultado[0].pesoTotal ? resultado[0].pesoTotal.toString() : 0;
    const quantidadeBateladas = resultado[0].quantidadeBateladas ? resultado[0].quantidadeBateladas.toString() : 0;

    return res.json({ quantidadeBateladas, pesoTotalDia, pesoTotalGeral });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar as bateladas', description: error });
  }
});

module.exports = router;

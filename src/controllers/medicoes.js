const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');

const router = Router();

//rota para adicionar novos usuários
router.post('/medicoes/add', async (req, res) => {

  const registerQuerySchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    medicao: z.string().regex(/^\d+(\.\d+)?$/).transform(Number),
  });

  const { id, medicao } = registerQuerySchema.parse(req.query);

  try {
    await prisma.leituras.create({
      data: {
        idSensor : id,
        umidadeMedida : medicao,
        idUser : 1
      },
    });
    return res.status(201).json({ message: 'User criado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao criar o usuário', description: error });
  }
});

module.exports = router;

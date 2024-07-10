const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

//rota pra listar unico lote
router.get('/loteatual/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lote = await prisma.loteAtual.findUnique({
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

module.exports = router;

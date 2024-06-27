const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = Router();

router.get ('/', async (req, res) => {
  return res.json({ message: "Api vinho on line"});
});

//rota para adicionar novos usuários
router.post('/user/adicionar', async (req, res) => {
  const registerBodySchema = z.object({
    username: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });

  const { username, name, email, password } = registerBodySchema.parse(req.body);

  try {
    // Gerar um hash seguro da senha
    const saltRounds = 10; // Número de salt rounds para o bcrypt (aumente para maior segurança)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword, // Salvar o hash da senha no banco de dados
      },
    });

    return res.status(201).json({ message: 'User criado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao criar o usuário', description: error });
  }
});

//rota para logar usuários
router.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  // Encontre o usuário no banco de dados com base no username
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verifique a senha fornecida com a senha armazenada (hash)
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Se as credenciais estiverem corretas, crie um token JWT
  const token = jwt.sign({ userId: user.id }, 'suaChaveSecreta', { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;

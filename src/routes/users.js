// routes/users.js
import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Rota teste
router.get("/", (req, res) => {
  return res.json({ message: "API vinho online" });
});

// POST /users/add -> cria usuário
router.post("/add", async (req, res) => {
  const registerBodySchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const supabase = req.supabase; // Igual à primeira rota

  if (!supabase) {
    return res.status(500).json({ error: "Supabase não configurado no request" });
  }

  try {
    const { nome, email, senha } = registerBodySchema.parse(req.body);

    // Verifica se o usuário já existe
    const { data: existingUser, error: selectError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      return res.status(500).json({ error: selectError.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir no Supabase
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha: hashedPassword }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Usuário criado com sucesso", user: data });
  } catch (err) {
    return res.status(400).json({ error: "Dados inválidos", description: err.message });
  }
});

// POST /users/login -> login de usuário
router.post("/login", async (req, res) => {
  const loginBodySchema = z.object({
    email: z.string().email(),
    senha: z.string(),
  });

  const supabase = req.supabase; // Igual à primeira rota

  if (!supabase) {
    return res.status(500).json({ error: "Supabase não configurado no request" });
  }

  try {
    const { email, senha } = loginBodySchema.parse(req.body);

    // Buscar usuário
    const { data: user, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "apiChaveVinho",
      { expiresIn: "1h" }
    );

    return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (err) {
    return res.status(400).json({ error: "Dados inválidos", description: err.message });
  }
});

export default router;

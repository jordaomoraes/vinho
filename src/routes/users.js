import express from "express";
const router = express.Router();

// GET /users
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("usuarios").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// POST /users/add
router.post("/add", async (req, res) => {
  try {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ error: "nome e email são obrigatórios" });

    const { data, error } = await req.supabase.from("usuarios").insert([{ nome, email }]);
    if (error) throw error;

    res.status(201).json({ message: "Usuário adicionado", user: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar usuário" });
  }
});

export default router;

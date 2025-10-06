import express from "express";
const router = express.Router();

// POST /clientes -> grava dados no banco
router.post("/", async (req, res) => {
  const { nome, email } = req.body;
  const supabase = req.supabase;

  if (!nome || !email) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, email" });
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert([{ nome, email }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data[0]);
});

// GET /clientes -> lista todos os clientes
router.get("/", async (req, res) => {
  const supabase = req.supabase;
  const { data, error } = await supabase.from("clientes").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;

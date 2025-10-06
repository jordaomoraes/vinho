import express from "express";
const router = express.Router();

// GET /areas
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("areas").select("*");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar áreas" });
  }
});

// POST /areas/add
router.post("/add", async (req, res) => {
  try {
    const { idUser, tamanho, descricao, latitude, longitude } = req.body;

    // validações básicas
    if (!idUser || !descricao || !latitude || !longitude) {
      return res.status(400).json({
        error: "Campos obrigatórios: idUser, descricao, latitude e longitude",
      });
    }

    const { data, error } = await req.supabase.from("areas").insert([
      {
        idUser,
        tamanho: tamanho || 0,
        descricao,
        latitude,
        longitude,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Área adicionada com sucesso", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar área" });
  }
});

export default router;

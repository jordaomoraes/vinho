import express from "express";
const router = express.Router();

// GET /sensores
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("sensores").select("*");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar sensores" });
  }
});

// GET /sensores/user/:idUser → lista sensores de um usuário específico
router.get("/user/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const { data, error } = await req.supabase
      .from("sensores")
      .select("*")
      .eq("idUser", idUser);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar sensores do usuário" });
  }
});

// POST /sensores/add
router.post("/add", async (req, res) => {
  try {
    const { idUser, idArea, latitude, longitude, descricao, tipo, dataInstalacao } = req.body;

    // Validação básica
    if (!idUser || !latitude || !longitude || !descricao || !tipo) {
      return res.status(400).json({
        error: "Campos obrigatórios: idUser, latitude, longitude, descricao e tipo",
      });
    }

    const { data, error } = await req.supabase.from("sensores").insert([
      {
        idUser,
        idArea: idArea || null,
        latitude,
        longitude,
        descricao,
        tipo,
        dataInstalacao: dataInstalacao || new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Sensor adicionado com sucesso", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar sensor" });
  }
});

// PUT /sensores/:id → atualizar sensor
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { idArea, latitude, longitude, descricao, tipo, dataInstalacao } = req.body;

    const { data, error } = await req.supabase
      .from("sensores")
      .update({ idArea, latitude, longitude, descricao, tipo, dataInstalacao })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Sensor atualizado com sucesso", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar sensor" });
  }
});

// DELETE /sensores/:id → excluir sensor
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase.from("sensores").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Sensor removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover sensor" });
  }
});

export default router;

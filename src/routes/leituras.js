import express from "express";
const router = express.Router();


// GET /leituras → lista todas as leituras
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("leituras").select("*");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar leituras" });
  }
});


// GET /leituras/user/:idUser → lista leituras de um usuário
router.get("/user/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    const { data, error } = await req.supabase
      .from("leituras")
      .select("*")
      .eq("idUser", idUser);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar leituras do usuário" });
  }
});


// GET /leituras/sensor/:idSensor → lista leituras de um sensor específico
router.get("/sensor/:idSensor", async (req, res) => {
  try {
    const { idSensor } = req.params;
    const { data, error } = await req.supabase
      .from("leituras")
      .select("*")
      .eq("idSensor", idSensor);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar leituras do sensor" });
  }
});


// POST /leituras/add → adiciona nova leitura
router.post("/add", async (req, res) => {
  try {
    const { idUser, idSensor, umidadeMedida, dataMedicao } = req.body;

    // validação básica
    if (!idUser || !idSensor) {
      return res.status(400).json({
        error: "Campos obrigatórios: idUser e idSensor",
      });
    }

    const { data, error } = await req.supabase.from("leituras").insert([
      {
        idUser,
        idSensor,
        umidadeMedida: umidadeMedida || 0,
        dataMedicao: dataMedicao || new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Leitura adicionada com sucesso", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar leitura" });
  }
});


// PUT /leituras/:id → atualiza leitura
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { umidadeMedida, dataMedicao } = req.body;

    const { data, error } = await req.supabase
      .from("leituras")
      .update({
        umidadeMedida,
        dataMedicao,
      })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Leitura atualizada com sucesso", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar leitura" });
  }
});


// DELETE /leituras/:id → remove leitura
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase.from("leituras").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Leitura removida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover leitura" });
  }
});

export default router;

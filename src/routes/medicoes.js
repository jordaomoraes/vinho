// routes/medicoes.js
import { Router } from "express";
import { z } from "zod";

const router = Router();

// POST /medicoes/add -> adiciona nova medição
router.post("/add", async (req, res) => {
  const supabase = req.supabase; // Pega o Supabase do middleware
  if (!supabase) {
    return res.status(500).json({ error: "Supabase não configurado no request" });
  }

  const registerQuerySchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    medicao: z.string().regex(/^\d+(\.\d+)?$/).transform(Number),
  });

  try {
    const { id, medicao } = registerQuerySchema.parse(req.query);

    const { data, error } = await supabase
      .from("leituras")
      .insert([
        {
          idSensor: id,
          umidadeMedida: medicao,
          idUser: 1, // Ajuste conforme necessário
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao criar a medição", description: error.message });
    }

    return res.status(201).json({ message: "Medição criada com sucesso", medicao: data });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Dados inválidos", description: err.message });
  }
});

export default router;

import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("medicoes").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar medições" });
  }
});

export default router;

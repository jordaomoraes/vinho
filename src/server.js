import express from "express";
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";
import clientesRouter from "./routes/clientes.js";
import usersRouter from "./routes/users.js";
import medicoesRouter from "./routes/medicoes.js";

dotenv.config();

const app = express();
app.use(express.json());


// Verifica se variáveis de ambiente estão definidas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("❌ SUPABASE_URL ou SUPABASE_KEY não definidas!");
  process.exit(1);
}

// Cria client Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware para passar client Supabase
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Rotas
app.use("/clientes", clientesRouter);
app.use("/users", usersRouter);
app.use("/medicoes", medicoesRouter);

// Rota raiz de teste
app.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase.from("usuarios").select("*").limit(1);
    if (error) throw error;
    res.json({ status: "ok", sampleUser: data[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao conectar com Supabase" });
  }
});

// Porta correta para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));

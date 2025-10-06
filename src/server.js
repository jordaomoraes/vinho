import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import clientesRouter from "./routes/clientes.js";
import usersRouter from "./routes/users.js";
import medicoesRouter from "./routes/medicoes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("❌ SUPABASE_URL ou SUPABASE_KEY não estão definidas!");
  process.exit(1); // Encerra o app se faltar
}

// Conexão com Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware para disponibilizar o client Supabase em todas as rotas
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Rotas
app.use("/clientes", clientesRouter);
app.use("/users", usersRouter);
app.use("/medicoes", medicoesRouter);

// Rota teste para verificar se a API e o Supabase estão funcionando
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando em http://localhost:${PORT}`));

import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import clientesRouter from "./routes/clientes.js";
import usersRouter from "./routes/users.js";
import medicoesRouter from "./routes/medicoes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Conexão com Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Disponibiliza o client Supabase em todas as rotas
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Rotas
app.use("/clientes", clientesRouter);
app.use("/users", usersRouter);
app.use("/medicoes", medicoesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando em http://localhost:${PORT}`));

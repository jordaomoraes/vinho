const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const rotasUsuarios = require('../src/controllers/users');
const rotasMedicoes = require('../src/controllers/medicoes');


app.use(express.json());
app.use(cors());
app.use(rotasUsuarios);
app.use(rotasMedicoes);

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Importar as rotas que agora usam o mock controller
const mapRoutes = require('./src/routes/mapRoutes');

// Usar as Rotas
app.use('/api/map', mapRoutes);

app.listen(port, () => {
  console.log(`Servidor OncoMap (MODO DEMO) rodando na porta ${port}`);
});
const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/clientes', clientesRoutes);

// Tratamento de erro centralizado
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;

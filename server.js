const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Redirecionar todas as requisições não-API para o index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
});

// Importar e usar as rotas do backend
const backendApp = require('./backend/dist/index.js');
app.use(backendApp);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
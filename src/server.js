const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const usuarioRoutes = require('./routes/usuarioRoutes'); 
const eventoRoutes = require('./routes/eventoRoutes');
const feedRoutes = require('./routes/feedRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/feed', feedRoutes); 

app.get('/', (req, res) => {
    res.json({ status: 'ok', mensagem: '🔥 Bem-vindo à API do Bassgunça!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});
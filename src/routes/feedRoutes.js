const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM postagens ORDER BY data_criacao DESC');
        res.json(posts);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar o feed.' });
    }
});

router.post('/', async (req, res) => {
    const { autor_vulgo, texto } = req.body;
    try {
        await pool.query('INSERT INTO postagens (autor_vulgo, texto) VALUES (?, ?)', [autor_vulgo, texto]);
        res.status(201).json({ mensagem: 'Visão mandada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao postar na cena.' });
    }
});

module.exports = router;
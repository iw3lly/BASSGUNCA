const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

router.post('/', async (req, res) => {
  const { nome, vulgo, cidade, redes_sociais, email, senha, funcoes } = req.body;

  const query = `
    INSERT INTO usuarios (nome, vulgo, cidade, redes_sociais, email, senha, funcoes) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const valores = [nome, vulgo, cidade, redes_sociais, email, senha, funcoes];

  try {
    await pool.query(query, valores); 
    res.status(201).json({ mensagem: "Conta criada com sucesso na cena!" });
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
  }
});


module.exports = router;
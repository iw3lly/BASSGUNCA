const express = require("express");

const router = express.Router();

const pool = require("../config/db");

// ==========================================
// GET FEED
// ==========================================
router.get("/", async (req, res) => {
  try {
    const [posts] = await pool.query(
      `
      SELECT *
      FROM postagens
      ORDER BY data_criacao DESC
      `,
    );

    res.json(posts);
  } catch (erro) {
    console.error("Erro ao buscar feed:", erro);

    res.status(500).json({
      erro: "Erro ao buscar o feed.",
    });
  }
});

// ==========================================
// POST FEED
// ==========================================
router.post("/", async (req, res) => {
  const { autor_vulgo, texto } = req.body;

  try {
    // INSERE
    const [resultado] = await pool.query(
      `
      INSERT INTO postagens
      (autor_vulgo, texto)
      VALUES (?, ?)
      `,
      [autor_vulgo, texto],
    );

    // BUSCA O POST CRIADO
    const [novoPost] = await pool.query(
      `
      SELECT *
      FROM postagens
      WHERE id = ?
      `,
      [resultado.insertId],
    );

    // RETORNA O POST COMPLETO
    res.status(201).json(novoPost[0]);
  } catch (erro) {
    console.error("Erro ao postar no feed:", erro);

    res.status(500).json({
      erro: "Erro ao postar na cena.",
    });
  }
});

// ==========================================
// EDITAR POST
// ==========================================
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { texto } = req.body;

  try {
    await pool.query(
      `
      UPDATE postagens
      SET texto = ?, editado = 1
      WHERE id = ?
      `,
      [texto, id],
    );

    const [postAtualizado] = await pool.query(
      `
      SELECT *
      FROM postagens
      WHERE id = ?
      `,
      [id],
    );

    res.json(postAtualizado[0]);
  } catch (erro) {
    console.error("Erro ao editar post:", erro);

    res.status(500).json({
      erro: "Erro ao editar postagem.",
    });
  }
});

// ==========================================
// DELETE POST
// ==========================================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `
      DELETE FROM postagens
      WHERE id = ?
      `,
      [id],
    );

    res.json({
      sucesso: true,
    });
  } catch (erro) {
    console.error("Erro ao deletar post:", erro);

    res.status(500).json({
      erro: "Erro ao apagar postagem.",
    });
  }
});

module.exports = router;

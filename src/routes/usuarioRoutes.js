const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.listarUsuarios);
router.post("/", usuarioController.criarUsuario);
router.post("/login", usuarioController.login);
router.get("/buscar/:vulgo", usuarioController.buscarPorVulgo);

module.exports = router;

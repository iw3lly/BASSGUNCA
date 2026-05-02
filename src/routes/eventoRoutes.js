const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');


router.get('/', eventoController.listarEventos);
router.post('/', eventoController.criarEvento);
router.post('/:id/interesse', eventoController.toggleInteresse);
router.put('/:id', eventoController.atualizarEvento);

module.exports = router;
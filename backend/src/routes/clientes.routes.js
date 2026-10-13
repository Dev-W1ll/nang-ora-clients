const { Router } = require('express');
const controller = require('../controllers/clientes.controller');

const router = Router();

router.get('/', controller.listar);   // GET  /api/clientes
router.post('/', controller.criar);   // POST /api/clientes

module.exports = router;

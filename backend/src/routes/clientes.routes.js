const { Router } = require('express');
const controller = require('../controllers/clientes.controller');

const router = Router();

router.get('/', controller.listar);   // GET  /api/clientes
router.post('/', controller.criar);   // POST /api/clientes
router.put('/:id', controller.atualizar); // PUT /api/clientes/:id
router.delete('/:id', controller.excluir); // DELETE /api/clientes/:id

module.exports = router;

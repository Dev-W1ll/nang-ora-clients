const repo = require('../repositories/clientes.repository');

function listar(_req, res) {
  res.json(repo.listar());
}

function criar(req, res) {
  const { nome, email } = req.body || {};

  const erroValidacao = validarDados({ nome, email });
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  const cliente = repo.criar({ nome: nome.trim(), email: email.trim() });
  res.status(201).json(cliente);
}

function atualizar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const { nome, email } = req.body || {};
  const erroValidacao = validarDados({ nome, email });
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  const cliente = repo.atualizar(id, { nome: nome.trim(), email: email.trim() });
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });

  res.json(cliente);
}

function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  if (!repo.excluir(id)) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.status(204).end();
}

function validarDados({ nome, email }) {
  if (typeof nome !== 'string' || !nome.trim() || typeof email !== 'string' || !email.trim()) {
    return 'Campos "nome" e "email" são obrigatórios';
  }
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'E-mail inválido';
  return null;
}

module.exports = { listar, criar, atualizar, excluir };

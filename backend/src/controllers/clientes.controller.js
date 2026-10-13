const repo = require('../repositories/clientes.repository');

function listar(_req, res) {
  res.json(repo.listar());
}

function criar(req, res) {
  const { nome, email } = req.body || {};

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Campos "nome" e "email" são obrigatórios' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ erro: 'E-mail inválido' });
  }

  const cliente = repo.criar({ nome: nome.trim(), email: email.trim() });
  res.status(201).json(cliente);
}

module.exports = { listar, criar };

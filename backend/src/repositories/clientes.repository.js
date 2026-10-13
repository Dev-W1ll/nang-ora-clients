// Repositório em memória: permite rodar o projeto sem banco.
// Para usar Oracle, basta reimplementar as operações com node-oracledb
// mantendo a mesma assinatura (ver database/ e README).

const clientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria@exemplo.com', status: 'ATIVO' },
  { id: 2, nome: 'João Souza', email: 'joao@exemplo.com', status: 'INATIVO' },
];

let proximoId = clientes.length + 1;

function listar() {
  return clientes;
}

function criar({ nome, email }) {
  const cliente = { id: proximoId++, nome, email, status: 'ATIVO' };
  clientes.push(cliente);
  return cliente;
}

function atualizar(id, { nome, email }) {
  const cliente = clientes.find((item) => item.id === id);
  if (!cliente) return null;

  cliente.nome = nome;
  cliente.email = email;
  return cliente;
}

function excluir(id) {
  const indice = clientes.findIndex((item) => item.id === id);
  if (indice === -1) return false;

  clientes.splice(indice, 1);
  return true;
}

module.exports = { listar, criar, atualizar, excluir };

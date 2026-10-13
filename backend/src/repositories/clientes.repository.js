// Repositório em memória: permite rodar o projeto sem banco.
// Para usar Oracle, basta reimplementar listar() e criar() com node-oracledb
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

module.exports = { listar, criar };

export type StatusCliente = 'ATIVO' | 'INATIVO';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  status: StatusCliente;
}

export type NovoCliente = Pick<Cliente, 'nome' | 'email'>;

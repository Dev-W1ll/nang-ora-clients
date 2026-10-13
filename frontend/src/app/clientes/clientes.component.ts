import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  private readonly service = inject(ClienteService);

  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly idEmEdicao = signal<number | null>(null);

  protected nome = '';
  protected email = '';

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.service.listar().subscribe({
      next: (dados) => {
        this.clientes.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os clientes. A API está rodando?');
        this.carregando.set(false);
      },
    });
  }

  protected salvar(): void {
    this.erro.set(null);
    const id = this.idEmEdicao();
    const operacao = id === null
      ? this.service.criar({ nome: this.nome, email: this.email })
      : this.service.atualizar(id, { nome: this.nome, email: this.email });

    operacao.subscribe({
      next: (clienteSalvo) => {
        if (id === null) {
          this.clientes.update((lista) => [...lista, clienteSalvo]);
        } else {
          this.clientes.update((lista) =>
            lista.map((cliente) => cliente.id === id ? clienteSalvo : cliente),
          );
        }
        this.cancelarEdicao();
      },
      error: (e: HttpErrorResponse) => {
        this.erro.set(e.error?.erro ?? 'Erro ao salvar cliente.');
      },
    });
  }

  protected editar(cliente: Cliente): void {
    this.idEmEdicao.set(cliente.id);
    this.nome = cliente.nome;
    this.email = cliente.email;
    this.erro.set(null);
  }

  protected cancelarEdicao(): void {
    this.idEmEdicao.set(null);
    this.nome = '';
    this.email = '';
  }

  protected excluir(cliente: Cliente): void {
    if (!window.confirm(`Excluir o cliente ${cliente.nome}?`)) return;

    this.erro.set(null);
    this.service.excluir(cliente.id).subscribe({
      next: () => {
        this.clientes.update((lista) => lista.filter((item) => item.id !== cliente.id));
        if (this.idEmEdicao() === cliente.id) this.cancelarEdicao();
      },
      error: (e: HttpErrorResponse) => {
        this.erro.set(e.error?.erro ?? 'Erro ao excluir cliente.');
      },
    });
  }
}

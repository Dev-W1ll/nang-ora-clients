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

  protected adicionar(): void {
    this.erro.set(null);

    this.service.criar({ nome: this.nome, email: this.email }).subscribe({
      next: (novo) => {
        this.clientes.update((lista) => [...lista, novo]);
        this.nome = '';
        this.email = '';
      },
      error: (e: HttpErrorResponse) => {
        this.erro.set(e.error?.erro ?? 'Erro ao cadastrar cliente.');
      },
    });
  }
}

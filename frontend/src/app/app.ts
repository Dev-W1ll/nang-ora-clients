import { Component } from '@angular/core';
import { ClientesComponent } from './clientes/clientes.component';

@Component({
  selector: 'app-root',
  imports: [ClientesComponent],
  template: '<app-clientes />',
})
export class App {}

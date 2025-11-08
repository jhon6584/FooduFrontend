import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Pedido {
  id: number;
  hora: string;
  estado: string;
  cliente: string;
  total: number;
}

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.html',
  styleUrls: ['./restaurante.css'],
})
export class Restaurante {
  
  selectedTab: 'mostrador' | 'domicilio' = 'mostrador';
  mostrarNuevoPedido = false;

  columnas: string[] = ['id', 'hora', 'estado', 'cliente', 'total'];

  // DATOS DE EJEMPLO PARA MOSTRADOR
  pendientes = new MatTableDataSource<Pedido>([
  
  ]);
  
  enCurso = new MatTableDataSource<Pedido>([
    
  ]);
  
  cerradas = new MatTableDataSource<Pedido>([
   
  ]);

  // DATOS DE EJEMPLO PARA DOMICILIO
  pendientesDomicilio = new MatTableDataSource<Pedido>([
  
  ]);
  
  enPreparacion = new MatTableDataSource<Pedido>([
  
  ]);
  
  enviados = new MatTableDataSource<Pedido>([
   
  ]);
  
  cerradosDomicilio = new MatTableDataSource<Pedido>([
    
  ]);

  selectTab(tab: 'mostrador' | 'domicilio') {
    this.selectedTab = tab;
  }

  toggleNuevoPedido() {
    this.mostrarNuevoPedido = !this.mostrarNuevoPedido;
  }

  crearPedido() {
    // Lógica para crear pedido
    console.log('Creando nuevo pedido...');
    this.mostrarNuevoPedido = false;
  }
}
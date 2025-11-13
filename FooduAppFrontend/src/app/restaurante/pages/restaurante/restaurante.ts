import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Pedido {
  id: number;
  hora: string;
  estado: string;
  cliente: string;
  total: number;
  direccion?: string;
  telefono?: string;
  repartidor?: string;
  tiempo?: string;
}

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.html',
  styleUrls: ['./restaurante.css'],
  standalone: false,
})
export class Restaurante implements OnInit {
  selectedTab: 'mostrador' | 'domicilio' = 'mostrador';
  mostrarModalNuevoPedido = false;

  // 🔥 CORREGIDO: Definir columnas separadas para cada tipo
  columnasMostrador: string[] = ['id', 'hora', 'estado', 'cliente', 'total', 'acciones'];
  
  // 🔥 CORREGIDO: Columnas para domicilio sin estado (ya que tenemos columnas específicas)
  columnasDomicilioPendientes: string[] = ['id', 'hora', 'direccion', 'telefono', 'cliente', 'repartidor', 'tiempo', 'total', 'acciones'];
  columnasDomicilioGenerales: string[] = ['id', 'hora', 'estado', 'cliente', 'total', 'acciones'];
  columnasSoloLectura: string[] = ['id', 'hora', 'estado', 'cliente', 'total'];

  pendientes = new MatTableDataSource<Pedido>([]);
  enCurso = new MatTableDataSource<Pedido>([]);
  cerradas = new MatTableDataSource<Pedido>([]);
  pendientesDomicilio = new MatTableDataSource<Pedido>([]);
  enPreparacion = new MatTableDataSource<Pedido>([]);
  enviados = new MatTableDataSource<Pedido>([]);
  cerradosDomicilio = new MatTableDataSource<Pedido>([]);

  constructor() { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  selectTab(tab: 'mostrador' | 'domicilio') {
    this.selectedTab = tab;
  }

  abrirModalNuevoPedido() {
    this.mostrarModalNuevoPedido = true;
  }

  cerrarModalNuevoPedido() {
    this.mostrarModalNuevoPedido = false;
  }

  onPedidoCreado(pedidoData: any) {
    console.log('Pedido creado desde modal:', pedidoData);
    this.procesarNuevoPedido(pedidoData);
    this.cerrarModalNuevoPedido();
  }

  // 🔥 MÉTODO: Enviar pedido a la tabla de enviados
  enviarPedido(pedido: Pedido, tablaOrigen: string) {
    const pedidoEnviado: Pedido = {
      ...pedido,
      estado: 'Enviado',
      hora: new Date().toLocaleTimeString()
    };

    // Agregar a la tabla de enviados
    const datosEnviados = this.enviados.data;
    this.enviados.data = [...datosEnviados, pedidoEnviado];

    // Remover de la tabla de origen
    this.removerDeTablaOrigen(pedido.id, tablaOrigen);

    console.log(`Pedido ${pedido.id} enviado a la tabla de enviados`);
  }

  // 🔥 MÉTODO: Remover pedido de la tabla de origen
  private removerDeTablaOrigen(id: number, tablaOrigen: string) {
    switch (tablaOrigen) {
      case 'pendientesDomicilio':
        this.pendientesDomicilio.data = this.pendientesDomicilio.data.filter(p => p.id !== id);
        break;
      case 'enPreparacion':
        this.enPreparacion.data = this.enPreparacion.data.filter(p => p.id !== id);
        break;
      case 'pendientes':
        this.pendientes.data = this.pendientes.data.filter(p => p.id !== id);
        break;
      case 'enCurso':
        this.enCurso.data = this.enCurso.data.filter(p => p.id !== id);
        break;
    }
  }

  private procesarNuevoPedido(pedidoData: any) {
    const nuevoPedido: Pedido = {
      id: this.generarId(),
      hora: new Date().toLocaleTimeString(),
      estado: 'Pendiente',
      cliente: pedidoData.data.cliente || 'Cliente',
      total: pedidoData.data.total || 0
    };

    if (pedidoData.tipo === 'mostrador') {
      this.agregarPedidoMostrador(nuevoPedido);
    } else {
      // Para domicilio, agregar campos adicionales
      const pedidoDomicilio: Pedido = {
        ...nuevoPedido,
        direccion: pedidoData.data.direccion || 'Sin dirección',
        telefono: pedidoData.data.telefono || 'Sin teléfono',
        repartidor: 'Asignar',
        tiempo: '30 min'
      };
      this.agregarPedidoDomicilio(pedidoDomicilio);
    }
  }

  private agregarPedidoMostrador(pedido: Pedido) {
    const datosActuales = this.pendientes.data;
    this.pendientes.data = [...datosActuales, pedido];
  }

  private agregarPedidoDomicilio(pedido: Pedido) {
    const datosActuales = this.pendientesDomicilio.data;
    this.pendientesDomicilio.data = [...datosActuales, pedido];
  }

  private generarId(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }

  private cargarDatosIniciales() {
    // Datos de ejemplo para testing - MOSTRADOR
    this.pendientes.data = [
      { id: 2001, hora: '14:20', estado: 'Pendiente', cliente: 'Cliente Mostrador 1', total: 25000 },
      { id: 2002, hora: '14:25', estado: 'Pendiente', cliente: 'Cliente Mostrador 2', total: 18000 }
    ];

    this.enCurso.data = [
      { id: 2003, hora: '14:15', estado: 'En preparación', cliente: 'Cliente Mostrador 3', total: 32000 }
    ];

    this.cerradas.data = [
      { id: 2000, hora: '14:00', estado: 'Completado', cliente: 'Cliente Mostrador 0', total: 28000 }
    ];

    // Datos de ejemplo para testing - DOMICILIO
    this.pendientesDomicilio.data = [
      {
        id: 1001,
        hora: '14:30',
        estado: 'Pendiente',
        cliente: 'Juan Pérez',
        total: 45000,
        direccion: 'Calle 123 #45-67',
        telefono: '3001234567',
        repartidor: 'Carlos López',
        tiempo: '25 min'
      }
    ];

    this.enPreparacion.data = [
      {
        id: 1003,
        hora: '14:15',
        estado: 'En preparación',
        cliente: 'Roberto Silva',
        total: 28000,
        direccion: 'Carrera 56 #12-34',
        telefono: '3155558888',
        repartidor: 'Pedro Rodríguez',
        tiempo: '15 min'
      }
    ];

    this.enviados.data = [
      {
        id: 1000,
        hora: '13:45',
        estado: 'Enviado',
        cliente: 'Cliente Enviado',
        total: 35000,
        direccion: 'Av. Siempre Viva 742',
        telefono: '3001112233',
        repartidor: 'Ana Gómez',
        tiempo: 'Entregado'
      }
    ];

    this.cerradosDomicilio.data = [
      {
        id: 999,
        hora: '13:30',
        estado: 'Entregado',
        cliente: 'Cliente Cerrado',
        total: 42000,
        direccion: 'Calle Falsa 123',
        telefono: '3004445566',
        repartidor: 'Luis Martínez',
        tiempo: 'Completado'
      }
    ];
  }
}
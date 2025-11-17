import { Component, OnInit, OnDestroy } from '@angular/core';
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
  tiempoTranscurrido?: number; // Nuevo: para llevar el conteo en minutos
  tiempoInterval?: any; // Nuevo: para el intervalo del cronómetro
}

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.html',
  styleUrls: ['./restaurante.css'],
  standalone: false,
})
export class Restaurante implements OnInit, OnDestroy {
  selectedTab: 'mostrador' | 'domicilio' = 'mostrador';
  mostrarModalNuevoPedido = false;

  columnasMostrador: string[] = ['id', 'hora', 'estado', 'cliente', 'total', 'acciones'];
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

  ngOnInit(): void { }

  ngOnDestroy(): void {
    // Limpiar todos los intervalos al destruir el componente
    this.limpiarTodosLosIntervalos();
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
    // Detener el cronómetro del pedido
    if (pedido.tiempoInterval) {
      clearInterval(pedido.tiempoInterval);
    }

    const pedidoEnviado: Pedido = {
      ...pedido,
      estado: 'Enviado',
      hora: new Date().toLocaleTimeString(),
      tiempoInterval: undefined // Limpiar el intervalo
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
      cliente: pedidoData.data.nombre || 'Cliente',
      total: pedidoData.data.total || 0,
      tiempoTranscurrido: 0, // Iniciar en 0 minutos
      tiempo: '0 min' // Tiempo inicial formateado
    };

    if (pedidoData.tipo === 'mostrador') {
      this.agregarPedidoMostrador(nuevoPedido);
    } else {
      // Para domicilio, agregar campos adicionales
      const pedidoDomicilio: Pedido = {
        ...nuevoPedido,
        direccion: pedidoData.data.direccion || 'Sin dirección',
        telefono: pedidoData.data.celular || 'Sin teléfono',
        repartidor: pedidoData.data.repartidor || 'Asignar'
      };
      this.agregarPedidoDomicilio(pedidoDomicilio);
    }

    // Iniciar cronómetro para el nuevo pedido
    this.iniciarCronometro(nuevoPedido);
  }

  private agregarPedidoMostrador(pedido: Pedido) {
    const datosActuales = this.pendientes.data;
    this.pendientes.data = [...datosActuales, pedido];
  }

  private agregarPedidoDomicilio(pedido: Pedido) {
    const datosActuales = this.pendientesDomicilio.data;
    this.pendientesDomicilio.data = [...datosActuales, pedido];
  }

  // Método para iniciar el cronómetro de un pedido
  private iniciarCronometro(pedido: Pedido): void {
    const intervalo = setInterval(() => {
      // Encontrar el pedido en todas las tablas y actualizar su tiempo
      this.actualizarTiempoPedido(pedido.id);
    }, 60000); // Actualizar cada minuto

    // Guardar la referencia del intervalo en el pedido
    pedido.tiempoInterval = intervalo;
  }

  // Método para actualizar el tiempo de un pedido específico
  private actualizarTiempoPedido(pedidoId: number): void {
    // Buscar y actualizar en todas las tablas
    this.actualizarTiempoEnTabla(this.pendientes, pedidoId);
    this.actualizarTiempoEnTabla(this.pendientesDomicilio, pedidoId);
    this.actualizarTiempoEnTabla(this.enPreparacion, pedidoId);
    this.actualizarTiempoEnTabla(this.enCurso, pedidoId);
  }

  // Método genérico para actualizar tiempo en una tabla
  private actualizarTiempoEnTabla(tabla: MatTableDataSource<Pedido>, pedidoId: number): void {
    const pedidosActualizados = tabla.data.map(pedido => {
      if (pedido.id === pedidoId) {
        const nuevoTiempo = (pedido.tiempoTranscurrido || 0) + 1;
        return {
          ...pedido,
          tiempoTranscurrido: nuevoTiempo,
          tiempo: this.formatearTiempo(nuevoTiempo)
        };
      }
      return pedido;
    });

    tabla.data = [...pedidosActualizados];
  }

  // Método para formatear el tiempo (minutos a texto)
  private formatearTiempo(minutos: number): string {
    if (minutos < 60) {
      return `${minutos} min`;
    } else {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return `${horas}h ${mins}min`;
    }
  }

  // Método para limpiar todos los intervalos al destruir el componente
  private limpiarTodosLosIntervalos(): void {
    const todasLasTablas = [
      this.pendientes,
      this.pendientesDomicilio,
      this.enPreparacion,
      this.enCurso,
      this.enviados,
      this.cerradas,
      this.cerradosDomicilio
    ];

    todasLasTablas.forEach(tabla => {
      tabla.data.forEach(pedido => {
        if (pedido.tiempoInterval) {
          clearInterval(pedido.tiempoInterval);
        }
      });
    });
  }

  private generarId(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }
}
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { Pedido } from '../../interfaces/pedido';
import { RestauranteServices } from '../../servicios/restaurante.service';
import { ApiResponse } from '../../../interfaces/api-response';

@Component({
  selector: 'app-modal-listado-cliente',
  templateUrl: './modal-listado-cliente.html',
  styleUrls: ['./modal-listado-cliente.css'],
  standalone: false,
})
export class ModalListadoCliente implements OnInit, OnChanges {
  
  @Input() mostrar: boolean = false;
  @Input() tipoPedido: 'mostrador' | 'domicilio' = 'mostrador';
  
  @Output() pedidoCreado = new EventEmitter<any>();
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() clienteSeleccionado = new EventEmitter<Cliente>();

  formulario!: FormGroup;
  cargando: boolean = false;
  buscando: boolean = false;

  // Variables para gestión de clientes
  clientes: Cliente[] = [];
  clienteEncontrado: Cliente | null = null;
  clienteActual: Cliente | null = null;
  telefonoIngresado: string = '';
  modoBusqueda: boolean = true;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteServices
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mostrar'] && changes['mostrar'].currentValue && this.formulario) {
      this.resetearFormulario();
      this.cargarClientes();
    }
  }

  private inicializarFormulario(): void {
    const baseForm = {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['']
    };

    const camposPedido: any = {
      observacion: ['']
    };
    
    if (this.tipoPedido === 'domicilio') {
      camposPedido.repartidor = [''];
      camposPedido.tiempoEstimado = [30, [Validators.min(1)]];
      camposPedido.costoEnvio = [0, [Validators.min(0)]];
    }
    
    this.formulario = this.fb.group({
      ...baseForm,
      ...camposPedido
    });
  }

  private resetearFormulario(): void {
    if (!this.formulario) {
      console.warn('Formulario no inicializado en resetearFormulario');
      return;
    }
    
    this.clienteActual = null;
    this.clienteEncontrado = null;
    this.telefonoIngresado = '';
    this.modoBusqueda = true;
    this.esEdicion = false;
    this.formulario.reset();
  }

  cargarClientes(): void {
    this.buscando = true;
    this.restauranteService.lista().subscribe({
      next: (response: ApiResponse) => {
        this.buscando = false;
        if (response.isExitoso && response.resultado) {
          this.clientes = response.resultado;
        } else {
          this.clientes = [];
        }
      },
      error: (error: any) => {
        this.buscando = false;
        console.error('Error al cargar clientes:', error);
        this.clientes = [];
      }
    });
  }

  // Nueva función: Buscar específicamente por teléfono
  buscarClientePorTelefono(termino: string): void {
    this.telefonoIngresado = termino.trim();
    this.clienteEncontrado = null;

    if (!this.telefonoIngresado) {
      return;
    }

    // Solo buscar si es un número de teléfono completo (10 dígitos)
    if (/^[0-9]{10}$/.test(this.telefonoIngresado)) {
      this.buscando = true;
      
      // Buscar en la lista de clientes cargados
      const clienteExistente = this.clientes.find(cliente => 
        cliente.celular === this.telefonoIngresado
      );

      setTimeout(() => {
        this.buscando = false;
        if (clienteExistente) {
          this.clienteEncontrado = clienteExistente;
        }
      }, 500);
    }
  }

  seleccionarCliente(cliente: Cliente): void {
    this.clienteActual = cliente;
    this.modoBusqueda = false;
    
    if (this.formulario) {
      this.formulario.patchValue({
        nombre: cliente.nombre,
        celular: cliente.celular,
        direccion: cliente.direccion || ''
      });
    }

    this.clienteSeleccionado.emit(cliente);
  }

  nuevoCliente(): void {
    this.clienteActual = null;
    this.modoBusqueda = false;
    this.esEdicion = false;
    if (this.formulario) {
      this.formulario.reset();
    }
  }

  editarCliente(): void {
    if (this.clienteActual) {
      this.esEdicion = true;
    }
  }

  cancelarEdicion(): void {
    if (this.clienteActual && this.formulario) {
      this.esEdicion = false;
      this.formulario.patchValue({
        nombre: this.clienteActual.nombre,
        celular: this.clienteActual.celular,
        direccion: this.clienteActual.direccion || ''
      });
    }
  }

  volverABusqueda(): void {
    this.modoBusqueda = true;
    this.clienteActual = null;
    this.clienteEncontrado = null;
    this.telefonoIngresado = '';
    this.esEdicion = false;
    if (this.formulario) {
      this.formulario.reset();
    }
  }

  guardarCliente(): void {
    if (this.formulario && this.formulario.valid) {
      this.cargando = true;

      // Siempre usar buscarOCrear para manejar automáticamente la creación/actualización
      this.buscarOCrearCliente();
    } else {
      console.log('Formulario inválido o no inicializado');
      if (this.formulario) {
        Object.keys(this.formulario.controls).forEach(key => {
          this.formulario.get(key)?.markAsTouched();
        });
      }
    }
  }

  private buscarOCrearCliente(): void {
    if (!this.formulario) return;

    const clienteData: Cliente = {
      nombre: this.formulario.value.nombre,
      celular: this.formulario.value.celular,
      direccion: this.formulario.value.direccion
    };

    // Si estamos editando un cliente existente, incluir el ID
    if (this.clienteActual?.clienteID) {
      clienteData.clienteID = this.clienteActual.clienteID;
    }

    this.restauranteService.buscarOCrear(clienteData).subscribe({
      next: (response: ApiResponse) => {
        this.cargando = false;
        if (response.isExitoso && response.resultado) {
          const clienteProcesado: Cliente = response.resultado;
          
          const pedido: Pedido = {
            clienteID: clienteProcesado.clienteID,
            nombre: this.formulario.value.nombre,
            celular: this.formulario.value.celular,
            direccion: this.formulario.value.direccion,
            observacion: this.formulario.value.observacion || ''
          };

          if (this.tipoPedido === 'domicilio') {
            pedido.repartidor = this.formulario.value.repartidor || '';
            pedido.tiempoEstimado = this.formulario.value.tiempoEstimado || 30;
            pedido.costoEnvio = this.formulario.value.costoEnvio || 0;
          }

          const clienteExistente = !!clienteProcesado.clienteID;
          this.emitirPedidoCreado(pedido, clienteExistente);
          
        } else {
          alert('Error al procesar cliente: ' + response.mensaje);
        }
      },
      error: (error: any) => {
        this.cargando = false;
        console.error('Error:', error);
        alert('Error de conexión al servidor');
      }
    });
  }

  private emitirPedidoCreado(pedido: Pedido, clienteExistente: boolean): void {
    this.pedidoCreado.emit({ 
      tipo: this.tipoPedido, 
      data: pedido,
      clienteExistente: clienteExistente
    });

    if (this.formulario) {
      this.formulario.reset();
    }
    this.volverABusqueda();
  }

  cancelar(): void {
    this.cerrarModal.emit();
    this.volverABusqueda();
  }

  get mostrarCamposDomicilio(): boolean {
    return this.tipoPedido === 'domicilio';
  }

  get textoBotonPrincipal(): string {
    if (this.cargando) return 'Creando Pedido...';
    
    if (this.esEdicion) return 'Actualizar y Crear Pedido';
    if (this.clienteActual) return 'Usar Cliente para Pedido';
    return 'Crear Cliente y Pedido';
  }

  get mostrarFormulario(): boolean {
    return !this.modoBusqueda || this.clienteActual !== null;
  }
}
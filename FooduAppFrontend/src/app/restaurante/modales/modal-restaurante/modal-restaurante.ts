import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { RestauranteServices } from '../../servicios/restaurante.service';
import { Cliente } from '../../interfaces/cliente';

@Component({
  selector: 'app-modal-restaurante',
  templateUrl: './modal-restaurante.html',
  styleUrls: ['./modal-restaurante.css'],
  standalone: false,
})
export class ModalRestaurante {
  @Output() pedidoCreado = new EventEmitter<any>();
  @Output() cerrarModal = new EventEmitter<void>();
  @Input() mostrar: boolean = false;
  @Input() tipoPedido: 'mostrador' | 'domicilio' = 'mostrador';

  mensaje = '';
  formMostrador!: FormGroup;
  formDomicilio!: FormGroup;
  clientesEncontrados: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  clienteExiste = false;

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteServices
  ) {
    this.inicializarFormularios();
  }

  private inicializarFormularios() {
    // Formulario Mostrador
    this.formMostrador = this.fb.group({
      cliente: ['', Validators.required],
      tipoEntrega: ['tienda', Validators.required],
      observacion: [''],
      guardarCliente: [true],
    });

    // Formulario Domicilio
    this.formDomicilio = this.fb.group({
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      cliente: ['', Validators.required],
      calle: ['', Validators.required],
      observacion: [''],
      guardarCliente: [true],
    });

    // Búsqueda activa de cliente para domicilio
    this.formDomicilio.get('telefono')?.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        filter((tel) => tel && tel.length === 10)
      )
      .subscribe((telefono) => this.buscarCliente(telefono));
  }

  async crearPedido() {
    if (this.tipoPedido === 'mostrador') {
      this.crearPedidoMostrador();
    } else {
      await this.crearPedidoDomicilio();
    }
  }

  private crearPedidoMostrador() {
    if (this.formMostrador.valid) {
      this.pedidoCreado.emit({
        tipo: 'mostrador',
        data: this.formMostrador.value
      });
      this.limpiarFormularios();
    }
  }

  private async crearPedidoDomicilio() {
    const formValue = this.formDomicilio.value;

    if (!formValue.telefono || !formValue.cliente || !formValue.calle) {
      this.mostrarMensaje('Debe completar todos los campos obligatorios', 3000);
      return;
    }

    try {
      if (formValue.guardarCliente) {
        await this.gestionarCliente();
      }

      this.pedidoCreado.emit({
        tipo: 'domicilio',
        data: formValue
      });
      this.limpiarFormularios();
      
    } catch (error) {
      this.mostrarMensaje('❌ Error al procesar el pedido', 4000);
    }
  }

  private async gestionarCliente(): Promise<void> {
    const formValue = this.formDomicilio.value;
    
    const cliente: Cliente = {
      nombre: formValue.cliente,
      celular: formValue.telefono,
      direccion: formValue.calle,
    };

    if (this.clienteExiste && this.clienteSeleccionado?.clienteID) {
      cliente.clienteID = this.clienteSeleccionado.clienteID;
      await this.actualizarCliente(cliente);
    } else {
      await this.crearCliente(cliente);
    }
  }

  buscarCliente(telefono: string) {
    const request: Cliente = {
      celular: telefono,
      nombre: '',
      direccion: ''
    };

    this.restauranteService.buscarOCrear(request).subscribe({
      next: (res) => {
        if (res.isExitoso && res.resultado) {
          const cliente = res.resultado as Cliente;
          
          if (cliente.clienteID && cliente.nombre) {
            this.clienteExiste = true;
            this.clientesEncontrados = [cliente];
            this.clienteSeleccionado = cliente;
            this.mensaje = `✅ Cliente encontrado: ${cliente.nombre}`;
          } else {
            this.clienteNoEncontrado();
          }
        } else {
          this.clienteNoEncontrado();
        }
        setTimeout(() => (this.mensaje = ''), 4000);
      },
      error: (err) => {
        console.error('Error buscando cliente:', err);
        this.clienteExiste = false;
        this.clientesEncontrados = [];
        this.mensaje = '❌ Error al conectar con el servidor';
        setTimeout(() => (this.mensaje = ''), 4000);
      },
    });
  }

  private clienteNoEncontrado() {
    this.clienteExiste = false;
    this.clientesEncontrados = [];
    this.clienteSeleccionado = null;
    this.formDomicilio.patchValue({
      cliente: '',
      calle: '',
      guardarCliente: true
    });
    this.mensaje = '📝 Cliente no encontrado. Complete los datos para crearlo.';
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.clienteExiste = true;
    this.formDomicilio.patchValue({
      cliente: cliente.nombre,
      calle: cliente.direccion || '',
      telefono: cliente.celular,
      guardarCliente: true
    });
    this.clientesEncontrados = [];
    this.mensaje = `✅ Cliente seleccionado: ${cliente.nombre}`;
    setTimeout(() => (this.mensaje = ''), 3000);
  }

  limpiarFormularios() {
    this.clientesEncontrados = [];
    this.clienteSeleccionado = null;
    this.clienteExiste = false;
    
    this.formMostrador.reset({
      cliente: '',
      tipoEntrega: 'tienda',
      observacion: '',
      guardarCliente: true
    });

    this.formDomicilio.reset({
      telefono: '',
      cliente: '',
      calle: '',
      observacion: '',
      guardarCliente: true
    });

    this.mensaje = '🔄 Formulario limpiado';
    setTimeout(() => (this.mensaje = ''), 3000);
  }

  onCerrar() {
    this.cerrarModal.emit();
    this.limpiarFormularios();
  }

  private crearCliente(cliente: Cliente): Promise<void> {
    return new Promise((resolve, reject) => {
      this.restauranteService.crear(cliente).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Cliente guardado correctamente', 2000);
          resolve();
        },
        error: () => {
          this.mostrarMensaje('❌ Error al guardar cliente', 4000);
          reject();
        },
      });
    });
  }

  private actualizarCliente(cliente: Cliente): Promise<void> {
    return new Promise((resolve, reject) => {
      this.restauranteService.editar(cliente).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Cliente actualizado correctamente', 2000);
          resolve();
        },
        error: () => {
          this.mostrarMensaje('❌ Error al actualizar cliente', 4000);
          reject();
        },
      });
    });
  }

  private mostrarMensaje(texto: string, duracion: number = 3000) {
    this.mensaje = texto;
    setTimeout(() => (this.mensaje = ''), duracion);
  }
}
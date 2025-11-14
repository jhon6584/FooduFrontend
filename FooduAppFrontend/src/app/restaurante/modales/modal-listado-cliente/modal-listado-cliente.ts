import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../interfaces/cliente';
import { RestauranteServices } from '../../servicios/restaurante.service';

@Component({
  selector: 'app-modal-listado-cliente',
  templateUrl: './modal-listado-cliente.html',
  styleUrls: ['./modal-listado-cliente.css'],
  standalone: false,
})
export class ModalListadoCliente implements OnInit {
  
  formulario: FormGroup;
  esEdicion: boolean = false;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteServices,
    public dialogRef: MatDialogRef<ModalListadoCliente>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null
  ) {
    this.esEdicion = !!data;
    
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    if (this.esEdicion && this.data) {
      this.cargarDatosCliente();
    }
  }

  private cargarDatosCliente(): void {
    if (this.data) {
      this.formulario.patchValue({
        nombre: this.data.nombre,
        celular: this.data.celular,
        direccion: this.data.direccion || ''
      });
    }
  }

  guardarCliente(): void {
    if (this.formulario.valid) {
      this.cargando = true;
      
      const cliente: Cliente = this.formulario.value;
      
      if (this.esEdicion && this.data?.clienteID) {
        cliente.clienteID = this.data.clienteID;
        this.actualizarCliente(cliente);
      } else {
        this.crearCliente(cliente);
      }
    }
  }

  private crearCliente(cliente: Cliente): void {
    this.restauranteService.crear(cliente).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.isExitoso) {
          this.dialogRef.close(true);
        } else {
          alert('Error al crear cliente: ' + response.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error:', error);
        alert('Error de conexión al servidor');
      }
    });
  }

  private actualizarCliente(cliente: Cliente): void {
    this.restauranteService.editar(cliente).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.isExitoso) {
          this.dialogRef.close(true);
        } else {
          alert('Error al actualizar cliente: ' + response.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error:', error);
        alert('Error de conexión al servidor');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
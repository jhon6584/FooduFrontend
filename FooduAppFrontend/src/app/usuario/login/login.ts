import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material-module';
import { UsuarioService } from '../servicios/usuario.service';
import { CompartidosService } from '../../compartidos/compartidos.service';
import { Login } from '../interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
     ReactiveFormsModule,
    MaterialModule
  ]
})
export class LoginComponent {
  formLogin: FormGroup;
  ocultarPassword = true;
  mostrarLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private compartidosService: CompartidosService
  ) {
    this.formLogin = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasena: ['', [Validators.required, Validators.minLength(3)]],
      // recordarUsuario: [false]
    });
  }

  iniciarSesion() {
    if (this.formLogin.invalid) return;

    this.mostrarLoading = true;
    const request: Login = this.formLogin.value;

    this.usuarioService.iniciarSesion(request).subscribe({
      next: (response) => {
        this.compartidosService.guardarSesion(response);
        this.router.navigate(['/layout']);
      },
      complete: () => (this.mostrarLoading = false),
      error: (error) => {
        this.mostrarLoading = false;
        this.compartidosService.mostrarAlerta(
          error.error,
          'Error al iniciar sesión. Verifique sus credenciales.'
        );
      }
    });
  }
}

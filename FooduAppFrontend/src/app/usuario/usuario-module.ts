import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidosModule } from '../compartidos/compartidos-module';
import { UsuarioService } from './servicios/usuario.service';
import { LoginComponent } from './login/login';
import { MaterialModule } from '../material/material-module';
// ✅ Angular Material imports
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    CompartidosModule,
    MaterialModule,
    LoginComponent,     MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    UsuarioService
  ]
})
export class UsuarioModule { }

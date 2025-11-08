import { HttpClient } from '@angular/common/http';
import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  title: String = ('FooduApp');
  usuarios: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.http.get('http://localhost:5216/api/Usuario').subscribe({
    //   next: respose => this.usuarios = respose,
    //   error: error => console.log(error),
    //   complete: () => console.log('Completado')   
    // });
  }
}

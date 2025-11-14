import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCliente } from './listado-cliente';

describe('ListadoCliente', () => {
  let component: ListadoCliente;
  let fixture: ComponentFixture<ListadoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListadoCliente } from './modal-listado-cliente';

describe('ModalListadoCliente', () => {
  let component: ModalListadoCliente;
  let fixture: ComponentFixture<ModalListadoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalListadoCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListadoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

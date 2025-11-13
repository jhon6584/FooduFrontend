import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRestaurante } from './modal-restaurante';

describe('ModalRestaurante', () => {
  let component: ModalRestaurante;
  let fixture: ComponentFixture<ModalRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

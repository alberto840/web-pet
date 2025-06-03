import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarOfertaProductoComponent } from './actualizar-oferta-producto.component';

describe('ActualizarOfertaProductoComponent', () => {
  let component: ActualizarOfertaProductoComponent;
  let fixture: ComponentFixture<ActualizarOfertaProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarOfertaProductoComponent]
    });
    fixture = TestBed.createComponent(ActualizarOfertaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

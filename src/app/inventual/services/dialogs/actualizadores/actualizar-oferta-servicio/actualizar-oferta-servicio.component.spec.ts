import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarOfertaServicioComponent } from './actualizar-oferta-servicio.component';

describe('ActualizarOfertaServicioComponent', () => {
  let component: ActualizarOfertaServicioComponent;
  let fixture: ComponentFixture<ActualizarOfertaServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarOfertaServicioComponent]
    });
    fixture = TestBed.createComponent(ActualizarOfertaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

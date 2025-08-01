import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioUbicacionComponent } from './servicio-ubicacion.component';

describe('ServicioUbicacionComponent', () => {
  let component: ServicioUbicacionComponent;
  let fixture: ComponentFixture<ServicioUbicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicioUbicacionComponent]
    });
    fixture = TestBed.createComponent(ServicioUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

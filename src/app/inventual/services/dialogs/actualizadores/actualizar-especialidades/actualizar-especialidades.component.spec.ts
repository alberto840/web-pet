import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarEspecialidadesComponent } from './actualizar-especialidades.component';

describe('ActualizarEspecialidadesComponent', () => {
  let component: ActualizarEspecialidadesComponent;
  let fixture: ComponentFixture<ActualizarEspecialidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarEspecialidadesComponent]
    });
    fixture = TestBed.createComponent(ActualizarEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

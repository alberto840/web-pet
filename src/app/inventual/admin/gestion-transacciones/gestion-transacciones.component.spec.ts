import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTransaccionesComponent } from './gestion-transacciones.component';

describe('GestionTransaccionesComponent', () => {
  let component: GestionTransaccionesComponent;
  let fixture: ComponentFixture<GestionTransaccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionTransaccionesComponent]
    });
    fixture = TestBed.createComponent(GestionTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

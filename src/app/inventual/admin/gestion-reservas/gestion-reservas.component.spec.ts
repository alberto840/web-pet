import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReservasComponent } from './gestion-reservas.component';

describe('GestionReservasComponent', () => {
  let component: GestionReservasComponent;
  let fixture: ComponentFixture<GestionReservasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionReservasComponent]
    });
    fixture = TestBed.createComponent(GestionReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

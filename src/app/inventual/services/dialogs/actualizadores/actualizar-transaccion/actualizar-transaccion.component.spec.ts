import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarTransaccionComponent } from './actualizar-transaccion.component';

describe('ActualizarTransaccionComponent', () => {
  let component: ActualizarTransaccionComponent;
  let fixture: ComponentFixture<ActualizarTransaccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarTransaccionComponent]
    });
    fixture = TestBed.createComponent(ActualizarTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

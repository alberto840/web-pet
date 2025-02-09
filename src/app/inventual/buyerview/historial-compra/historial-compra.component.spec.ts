import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCompraComponent } from './historial-compra.component';

describe('HistorialCompraComponent', () => {
  let component: HistorialCompraComponent;
  let fixture: ComponentFixture<HistorialCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialCompraComponent]
    });
    fixture = TestBed.createComponent(HistorialCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

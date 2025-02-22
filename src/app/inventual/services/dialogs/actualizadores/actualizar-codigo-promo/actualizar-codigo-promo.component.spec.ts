import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCodigoPromoComponent } from './actualizar-codigo-promo.component';

describe('ActualizarCodigoPromoComponent', () => {
  let component: ActualizarCodigoPromoComponent;
  let fixture: ComponentFixture<ActualizarCodigoPromoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarCodigoPromoComponent]
    });
    fixture = TestBed.createComponent(ActualizarCodigoPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

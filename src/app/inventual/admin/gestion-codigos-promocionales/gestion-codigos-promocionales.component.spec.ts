import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCodigosPromocionalesComponent } from './gestion-codigos-promocionales.component';

describe('GestionCodigosPromocionalesComponent', () => {
  let component: GestionCodigosPromocionalesComponent;
  let fixture: ComponentFixture<GestionCodigosPromocionalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCodigosPromocionalesComponent]
    });
    fixture = TestBed.createComponent(GestionCodigosPromocionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

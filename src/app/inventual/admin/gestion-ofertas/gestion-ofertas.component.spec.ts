import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOfertasComponent } from './gestion-ofertas.component';

describe('GestionOfertasComponent', () => {
  let component: GestionOfertasComponent;
  let fixture: ComponentFixture<GestionOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionOfertasComponent]
    });
    fixture = TestBed.createComponent(GestionOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

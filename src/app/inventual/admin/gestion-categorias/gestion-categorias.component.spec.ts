import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCategoriasComponent } from './gestion-categorias.component';

describe('GestionCategoriasComponent', () => {
  let component: GestionCategoriasComponent;
  let fixture: ComponentFixture<GestionCategoriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCategoriasComponent]
    });
    fixture = TestBed.createComponent(GestionCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

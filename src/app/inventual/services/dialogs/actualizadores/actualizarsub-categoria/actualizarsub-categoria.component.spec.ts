import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarsubCategoriaComponent } from './actualizarsub-categoria.component';

describe('ActualizarsubCategoriaComponent', () => {
  let component: ActualizarsubCategoriaComponent;
  let fixture: ComponentFixture<ActualizarsubCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarsubCategoriaComponent]
    });
    fixture = TestBed.createComponent(ActualizarsubCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

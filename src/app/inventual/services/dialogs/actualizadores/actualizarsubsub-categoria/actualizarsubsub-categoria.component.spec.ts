import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarsubsubCategoriaComponent } from './actualizarsubsub-categoria.component';

describe('ActualizarsubsubCategoriaComponent', () => {
  let component: ActualizarsubsubCategoriaComponent;
  let fixture: ComponentFixture<ActualizarsubsubCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarsubsubCategoriaComponent]
    });
    fixture = TestBed.createComponent(ActualizarsubsubCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

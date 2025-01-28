import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasPageComponent } from './categorias-page.component';

describe('CategoriasPageComponent', () => {
  let component: CategoriasPageComponent;
  let fixture: ComponentFixture<CategoriasPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasPageComponent]
    });
    fixture = TestBed.createComponent(CategoriasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

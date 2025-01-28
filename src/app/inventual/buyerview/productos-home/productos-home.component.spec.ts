import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosHomeComponent } from './productos-home.component';

describe('ProductosHomeComponent', () => {
  let component: ProductosHomeComponent;
  let fixture: ComponentFixture<ProductosHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosHomeComponent]
    });
    fixture = TestBed.createComponent(ProductosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

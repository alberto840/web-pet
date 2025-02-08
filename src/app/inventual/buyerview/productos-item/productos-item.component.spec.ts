import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosItemComponent } from './productos-item.component';

describe('ProductosItemComponent', () => {
  let component: ProductosItemComponent;
  let fixture: ComponentFixture<ProductosItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosItemComponent]
    });
    fixture = TestBed.createComponent(ProductosItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

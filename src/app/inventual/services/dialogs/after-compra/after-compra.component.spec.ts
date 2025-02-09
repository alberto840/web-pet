import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterCompraComponent } from './after-compra.component';

describe('AfterCompraComponent', () => {
  let component: AfterCompraComponent;
  let fixture: ComponentFixture<AfterCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterCompraComponent]
    });
    fixture = TestBed.createComponent(AfterCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

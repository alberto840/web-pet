import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnsComponent } from './purchase-returns.component';

describe('PurchaseReturnsComponent', () => {
  let component: PurchaseReturnsComponent;
  let fixture: ComponentFixture<PurchaseReturnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseReturnsComponent]
    });
    fixture = TestBed.createComponent(PurchaseReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

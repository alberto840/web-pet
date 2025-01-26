import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosAddPaymentComponent } from './pos-add-payment.component';

describe('PosAddPaymentComponent', () => {
  let component: PosAddPaymentComponent;
  let fixture: ComponentFixture<PosAddPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosAddPaymentComponent]
    });
    fixture = TestBed.createComponent(PosAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

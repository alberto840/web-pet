import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInvoicePopupComponent } from './success-invoice-popup.component';

describe('SuccessInvoicePopupComponent', () => {
  let component: SuccessInvoicePopupComponent;
  let fixture: ComponentFixture<SuccessInvoicePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessInvoicePopupComponent]
    });
    fixture = TestBed.createComponent(SuccessInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

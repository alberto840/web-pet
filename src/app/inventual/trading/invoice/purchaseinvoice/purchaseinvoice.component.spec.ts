import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseinvoiceComponent } from './purchaseinvoice.component';

describe('PurchaseinvoiceComponent', () => {
  let component: PurchaseinvoiceComponent;
  let fixture: ComponentFixture<PurchaseinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

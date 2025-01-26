import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaselistinvoiveComponent } from './purchaselistinvoive.component';

describe('PurchaselistinvoiveComponent', () => {
  let component: PurchaselistinvoiveComponent;
  let fixture: ComponentFixture<PurchaselistinvoiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaselistinvoiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaselistinvoiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenselistinvoiceComponent } from './expenselistinvoice.component';

describe('ExpenselistinvoiceComponent', () => {
  let component: ExpenselistinvoiceComponent;
  let fixture: ComponentFixture<ExpenselistinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenselistinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenselistinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

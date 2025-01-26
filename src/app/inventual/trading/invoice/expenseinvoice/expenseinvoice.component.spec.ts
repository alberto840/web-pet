import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseinvoiceComponent } from './expenseinvoice.component';

describe('ExpenseinvoiceComponent', () => {
  let component: ExpenseinvoiceComponent;
  let fixture: ComponentFixture<ExpenseinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

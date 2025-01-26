import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreportComponent } from './customerreport.component';

describe('CustomerreportComponent', () => {
  let component: CustomerreportComponent;
  let fixture: ComponentFixture<CustomerreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerreportComponent]
    });
    fixture = TestBed.createComponent(CustomerreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

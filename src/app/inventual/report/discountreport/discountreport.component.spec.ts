import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountreportComponent } from './discountreport.component';

describe('DiscountreportComponent', () => {
  let component: DiscountreportComponent;
  let fixture: ComponentFixture<DiscountreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

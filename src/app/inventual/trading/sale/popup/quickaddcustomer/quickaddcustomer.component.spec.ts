import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickaddcustomerComponent } from './quickaddcustomer.component';

describe('QuickaddcustomerComponent', () => {
  let component: QuickaddcustomerComponent;
  let fixture: ComponentFixture<QuickaddcustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickaddcustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickaddcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

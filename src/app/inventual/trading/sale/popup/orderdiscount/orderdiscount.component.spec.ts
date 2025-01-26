import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdiscountComponent } from './orderdiscount.component';

describe('OrderdiscountComponent', () => {
  let component: OrderdiscountComponent;
  let fixture: ComponentFixture<OrderdiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdiscounttwoComponent } from './orderdiscounttwo.component';

describe('OrderdiscounttwoComponent', () => {
  let component: OrderdiscounttwoComponent;
  let fixture: ComponentFixture<OrderdiscounttwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdiscounttwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdiscounttwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

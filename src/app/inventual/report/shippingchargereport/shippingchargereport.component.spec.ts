import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingchargereportComponent } from './shippingchargereport.component';

describe('ShippingchargereportComponent', () => {
  let component: ShippingchargereportComponent;
  let fixture: ComponentFixture<ShippingchargereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingchargereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingchargereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereturnsComponent } from './purchasereturns.component';

describe('PurchasereturnsComponent', () => {
  let component: PurchasereturnsComponent;
  let fixture: ComponentFixture<PurchasereturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasereturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasereturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandPopupComponent } from './brand-popup.component';

describe('BrandPopupComponent', () => {
  let component: BrandPopupComponent;
  let fixture: ComponentFixture<BrandPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandPopupComponent]
    });
    fixture = TestBed.createComponent(BrandPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

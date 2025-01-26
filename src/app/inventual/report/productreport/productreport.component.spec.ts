import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductreportComponent } from './productreport.component';

describe('ProductreportComponent', () => {
  let component: ProductreportComponent;
  let fixture: ComponentFixture<ProductreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

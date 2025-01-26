import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxreportComponent } from './taxreport.component';

describe('TaxreportComponent', () => {
  let component: TaxreportComponent;
  let fixture: ComponentFixture<TaxreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

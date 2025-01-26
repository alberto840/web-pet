import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousereportComponent } from './warehousereport.component';

describe('WarehousereportComponent', () => {
  let component: WarehousereportComponent;
  let fixture: ComponentFixture<WarehousereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousereportComponent]
    });
    fixture = TestBed.createComponent(WarehousereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

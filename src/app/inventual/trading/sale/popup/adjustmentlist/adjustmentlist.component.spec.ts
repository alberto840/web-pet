import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentlistComponent } from './adjustmentlist.component';

describe('AdjustmentlistComponent', () => {
  let component: AdjustmentlistComponent;
  let fixture: ComponentFixture<AdjustmentlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

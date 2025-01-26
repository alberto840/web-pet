import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddadjustmentComponent } from './addadjustment.component';

describe('AddadjustmentComponent', () => {
  let component: AddadjustmentComponent;
  let fixture: ComponentFixture<AddadjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddadjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddadjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

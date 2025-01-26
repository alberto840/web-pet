import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereturnsComponent } from './salereturns.component';

describe('SalereturnsComponent', () => {
  let component: SalereturnsComponent;
  let fixture: ComponentFixture<SalereturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalereturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalereturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

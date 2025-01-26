import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossaleComponent } from './possale.component';

describe('PossaleComponent', () => {
  let component: PossaleComponent;
  let fixture: ComponentFixture<PossaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PossaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PossaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

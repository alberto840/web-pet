import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagesaleComponent } from './managesale.component';

describe('ManagesaleComponent', () => {
  let component: ManagesaleComponent;
  let fixture: ComponentFixture<ManagesaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagesaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

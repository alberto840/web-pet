import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbillerComponent } from './addbiller.component';

describe('AddbillerComponent', () => {
  let component: AddbillerComponent;
  let fixture: ComponentFixture<AddbillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

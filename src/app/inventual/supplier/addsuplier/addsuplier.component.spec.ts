import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsuplierComponent } from './addsuplier.component';

describe('AddsuplierComponent', () => {
  let component: AddsuplierComponent;
  let fixture: ComponentFixture<AddsuplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsuplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsuplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

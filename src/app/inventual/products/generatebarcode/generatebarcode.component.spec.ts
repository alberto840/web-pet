import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratebarcodeComponent } from './generatebarcode.component';

describe('GeneratebarcodeComponent', () => {
  let component: GeneratebarcodeComponent;
  let fixture: ComponentFixture<GeneratebarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratebarcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratebarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

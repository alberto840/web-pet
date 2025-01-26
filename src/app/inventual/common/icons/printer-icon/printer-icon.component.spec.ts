import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterIconComponent } from './printer-icon.component';

describe('PrinterIconComponent', () => {
  let component: PrinterIconComponent;
  let fixture: ComponentFixture<PrinterIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrinterIconComponent]
    });
    fixture = TestBed.createComponent(PrinterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

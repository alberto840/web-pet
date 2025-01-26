import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfIconComponent } from './pdf-icon.component';

describe('PdfIconComponent', () => {
  let component: PdfIconComponent;
  let fixture: ComponentFixture<PdfIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfIconComponent]
    });
    fixture = TestBed.createComponent(PdfIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

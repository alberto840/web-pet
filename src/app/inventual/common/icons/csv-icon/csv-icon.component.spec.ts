import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvIconComponent } from './csv-icon.component';

describe('CsvIconComponent', () => {
  let component: CsvIconComponent;
  let fixture: ComponentFixture<CsvIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsvIconComponent]
    });
    fixture = TestBed.createComponent(CsvIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleinvoiceComponent } from './saleinvoice.component';

describe('SaleinvoiceComponent', () => {
  let component: SaleinvoiceComponent;
  let fixture: ComponentFixture<SaleinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

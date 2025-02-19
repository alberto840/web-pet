import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterAgendarComponent } from './after-agendar.component';

describe('AfterAgendarComponent', () => {
  let component: AfterAgendarComponent;
  let fixture: ComponentFixture<AfterAgendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterAgendarComponent]
    });
    fixture = TestBed.createComponent(AfterAgendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

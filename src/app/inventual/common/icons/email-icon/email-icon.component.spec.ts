import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailIconComponent } from './email-icon.component';

describe('EmailIconComponent', () => {
  let component: EmailIconComponent;
  let fixture: ComponentFixture<EmailIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailIconComponent]
    });
    fixture = TestBed.createComponent(EmailIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

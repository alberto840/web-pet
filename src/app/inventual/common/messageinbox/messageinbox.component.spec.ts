import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageinboxComponent } from './messageinbox.component';

describe('MessageinboxComponent', () => {
  let component: MessageinboxComponent;
  let fixture: ComponentFixture<MessageinboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageinboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageinboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

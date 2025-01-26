import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagetrashComponent } from './messagetrash.component';

describe('MessagetrashComponent', () => {
  let component: MessagetrashComponent;
  let fixture: ComponentFixture<MessagetrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagetrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagetrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

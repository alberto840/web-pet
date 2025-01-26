import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesentComponent } from './messagesent.component';

describe('MessagesentComponent', () => {
  let component: MessagesentComponent;
  let fixture: ComponentFixture<MessagesentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

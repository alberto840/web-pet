import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagedraftComponent } from './messagedraft.component';

describe('MessagedraftComponent', () => {
  let component: MessagedraftComponent;
  let fixture: ComponentFixture<MessagedraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagedraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagedraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

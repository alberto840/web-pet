import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerlistComponent } from './billerlist.component';

describe('BillerlistComponent', () => {
  let component: BillerlistComponent;
  let fixture: ComponentFixture<BillerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillerlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

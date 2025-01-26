import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowtwoComponent } from './rolerowtwo.component';

describe('RolerowtwoComponent', () => {
  let component: RolerowtwoComponent;
  let fixture: ComponentFixture<RolerowtwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowtwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowtwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

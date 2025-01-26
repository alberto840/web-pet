import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowfiveComponent } from './rolerowfive.component';

describe('RolerowfiveComponent', () => {
  let component: RolerowfiveComponent;
  let fixture: ComponentFixture<RolerowfiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowfiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowfiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

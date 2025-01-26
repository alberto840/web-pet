import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowfourComponent } from './rolerowfour.component';

describe('RolerowfourComponent', () => {
  let component: RolerowfourComponent;
  let fixture: ComponentFixture<RolerowfourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowfourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowfourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowsixComponent } from './rolerowsix.component';

describe('RolerowsixComponent', () => {
  let component: RolerowsixComponent;
  let fixture: ComponentFixture<RolerowsixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowsixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowsixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowsevenComponent } from './rolerowseven.component';

describe('RolerowsevenComponent', () => {
  let component: RolerowsevenComponent;
  let fixture: ComponentFixture<RolerowsevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowsevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowsevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

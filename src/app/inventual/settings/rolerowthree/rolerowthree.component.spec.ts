import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerowthreeComponent } from './rolerowthree.component';

describe('RolerowthreeComponent', () => {
  let component: RolerowthreeComponent;
  let fixture: ComponentFixture<RolerowthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolerowthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerowthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

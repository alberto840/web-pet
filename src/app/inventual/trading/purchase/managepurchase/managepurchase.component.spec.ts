import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepurchaseComponent } from './managepurchase.component';

describe('ManagepurchaseComponent', () => {
  let component: ManagepurchaseComponent;
  let fixture: ComponentFixture<ManagepurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

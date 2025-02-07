import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosItemComponent } from './servicios-item.component';

describe('ServiciosItemComponent', () => {
  let component: ServiciosItemComponent;
  let fixture: ComponentFixture<ServiciosItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiciosItemComponent]
    });
    fixture = TestBed.createComponent(ServiciosItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosPageComponent } from './servicios-page.component';

describe('ServiciosPageComponent', () => {
  let component: ServiciosPageComponent;
  let fixture: ComponentFixture<ServiciosPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiciosPageComponent]
    });
    fixture = TestBed.createComponent(ServiciosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

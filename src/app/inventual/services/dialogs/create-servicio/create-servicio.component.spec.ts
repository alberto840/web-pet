import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicioComponent } from './create-servicio.component';

describe('CreateServicioComponent', () => {
  let component: CreateServicioComponent;
  let fixture: ComponentFixture<CreateServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateServicioComponent]
    });
    fixture = TestBed.createComponent(CreateServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

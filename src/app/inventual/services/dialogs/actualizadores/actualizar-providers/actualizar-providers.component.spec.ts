import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarProvidersComponent } from './actualizar-providers.component';

describe('ActualizarProvidersComponent', () => {
  let component: ActualizarProvidersComponent;
  let fixture: ComponentFixture<ActualizarProvidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarProvidersComponent]
    });
    fixture = TestBed.createComponent(ActualizarProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

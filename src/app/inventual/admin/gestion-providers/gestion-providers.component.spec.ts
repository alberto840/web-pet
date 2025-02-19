import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProvidersComponent } from './gestion-providers.component';

describe('GestionProvidersComponent', () => {
  let component: GestionProvidersComponent;
  let fixture: ComponentFixture<GestionProvidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionProvidersComponent]
    });
    fixture = TestBed.createComponent(GestionProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

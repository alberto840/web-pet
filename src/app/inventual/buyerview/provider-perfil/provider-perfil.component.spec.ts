import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPerfilComponent } from './provider-perfil.component';

describe('ProviderPerfilComponent', () => {
  let component: ProviderPerfilComponent;
  let fixture: ComponentFixture<ProviderPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderPerfilComponent]
    });
    fixture = TestBed.createComponent(ProviderPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

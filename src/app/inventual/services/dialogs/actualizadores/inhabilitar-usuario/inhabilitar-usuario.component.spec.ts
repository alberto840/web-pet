import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InhabilitarUsuarioComponent } from './inhabilitar-usuario.component';

describe('InhabilitarUsuarioComponent', () => {
  let component: InhabilitarUsuarioComponent;
  let fixture: ComponentFixture<InhabilitarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InhabilitarUsuarioComponent]
    });
    fixture = TestBed.createComponent(InhabilitarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

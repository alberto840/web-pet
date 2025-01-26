import { TestBed } from '@angular/core/testing';

import { UsuarioPuntosService } from './usuario-puntos.service';

describe('UsuarioPuntosService', () => {
  let service: UsuarioPuntosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioPuntosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

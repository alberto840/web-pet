import { TestBed } from '@angular/core/testing';

import { EspecialidadProveedorService } from './especialidad-proveedor.service';

describe('EspecialidadProveedorService', () => {
  let service: EspecialidadProveedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialidadProveedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

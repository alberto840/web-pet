import { TestBed } from '@angular/core/testing';

import { ConvertirRutaAImagenService } from './convertir-ruta-aimagen.service';

describe('ConvertirRutaAImagenService', () => {
  let service: ConvertirRutaAImagenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertirRutaAImagenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

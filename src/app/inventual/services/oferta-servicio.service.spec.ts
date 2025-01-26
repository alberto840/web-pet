import { TestBed } from '@angular/core/testing';

import { OfertaServicioService } from './oferta-servicio.service';

describe('OfertaServicioService', () => {
  let service: OfertaServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OfertaProductoService } from './oferta-producto.service';

describe('OfertaProductoService', () => {
  let service: OfertaProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

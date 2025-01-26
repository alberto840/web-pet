import { TestBed } from '@angular/core/testing';

import { CodigoDescuentoService } from './codigo-descuento.service';

describe('CodigoDescuentoService', () => {
  let service: CodigoDescuentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigoDescuentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

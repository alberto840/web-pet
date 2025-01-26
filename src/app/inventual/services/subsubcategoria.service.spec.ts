import { TestBed } from '@angular/core/testing';

import { SubsubcategoriaService } from './subsubcategoria.service';

describe('SubsubcategoriaService', () => {
  let service: SubsubcategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsubcategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

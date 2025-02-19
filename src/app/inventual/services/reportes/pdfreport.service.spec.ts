import { TestBed } from '@angular/core/testing';

import { PdfreportService } from './pdfreport.service';

describe('PdfreportService', () => {
  let service: PdfreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

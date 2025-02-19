import { TestBed } from '@angular/core/testing';

import { CsvreportService } from './csvreport.service';

describe('CsvreportService', () => {
  let service: CsvreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

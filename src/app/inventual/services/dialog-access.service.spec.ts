import { TestBed } from '@angular/core/testing';

import { DialogAccessService } from './dialog-access.service';

describe('DialogAccessService', () => {
  let service: DialogAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

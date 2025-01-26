import { TestBed } from '@angular/core/testing';

import { JwtdecoderService } from './jwtdecoder.service';

describe('JwtdecoderService', () => {
  let service: JwtdecoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtdecoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

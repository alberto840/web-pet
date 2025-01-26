import { TestBed } from '@angular/core/testing';

import { NotificacionMasivaService } from './notificacion-masiva.service';

describe('NotificacionMasivaService', () => {
  let service: NotificacionMasivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionMasivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

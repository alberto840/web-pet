import { TestBed } from '@angular/core/testing';

import { NotificacionCrearService } from './notificacion-crear.service';

describe('NotificacionCrearService', () => {
  let service: NotificacionCrearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionCrearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

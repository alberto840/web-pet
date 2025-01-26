import { TestBed } from '@angular/core/testing';

import { VacunaHorarioService } from './vacuna-horario.service';

describe('VacunaHorarioService', () => {
  let service: VacunaHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacunaHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

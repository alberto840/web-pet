import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmarAgendaComponent } from './comfirmar-agenda.component';

describe('ComfirmarAgendaComponent', () => {
  let component: ComfirmarAgendaComponent;
  let fixture: ComponentFixture<ComfirmarAgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComfirmarAgendaComponent]
    });
    fixture = TestBed.createComponent(ComfirmarAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

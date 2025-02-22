import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarTicketComponent } from './actualizar-ticket.component';

describe('ActualizarTicketComponent', () => {
  let component: ActualizarTicketComponent;
  let fixture: ComponentFixture<ActualizarTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarTicketComponent]
    });
    fixture = TestBed.createComponent(ActualizarTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

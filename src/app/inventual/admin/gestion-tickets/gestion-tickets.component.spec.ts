import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTicketsComponent } from './gestion-tickets.component';

describe('GestionTicketsComponent', () => {
  let component: GestionTicketsComponent;
  let fixture: ComponentFixture<GestionTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionTicketsComponent]
    });
    fixture = TestBed.createComponent(GestionTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

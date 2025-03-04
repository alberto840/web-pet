import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCarouselComponent } from './gestion-carousel.component';

describe('GestionCarouselComponent', () => {
  let component: GestionCarouselComponent;
  let fixture: ComponentFixture<GestionCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCarouselComponent]
    });
    fixture = TestBed.createComponent(GestionCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

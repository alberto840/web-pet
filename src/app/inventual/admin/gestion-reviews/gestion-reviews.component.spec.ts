import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReviewsComponent } from './gestion-reviews.component';

describe('GestionReviewsComponent', () => {
  let component: GestionReviewsComponent;
  let fixture: ComponentFixture<GestionReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionReviewsComponent]
    });
    fixture = TestBed.createComponent(GestionReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

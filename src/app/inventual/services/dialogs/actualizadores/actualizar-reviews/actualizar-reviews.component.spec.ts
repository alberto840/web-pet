import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarReviewsComponent } from './actualizar-reviews.component';

describe('ActualizarReviewsComponent', () => {
  let component: ActualizarReviewsComponent;
  let fixture: ComponentFixture<ActualizarReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarReviewsComponent]
    });
    fixture = TestBed.createComponent(ActualizarReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

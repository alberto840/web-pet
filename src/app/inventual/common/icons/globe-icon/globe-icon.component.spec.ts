import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeIconComponent } from './globe-icon.component';

describe('GlobeIconComponent', () => {
  let component: GlobeIconComponent;
  let fixture: ComponentFixture<GlobeIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobeIconComponent]
    });
    fixture = TestBed.createComponent(GlobeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

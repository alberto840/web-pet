import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMastcotaComponent } from './create-mastcota.component';

describe('CreateMastcotaComponent', () => {
  let component: CreateMastcotaComponent;
  let fixture: ComponentFixture<CreateMastcotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMastcotaComponent]
    });
    fixture = TestBed.createComponent(CreateMastcotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

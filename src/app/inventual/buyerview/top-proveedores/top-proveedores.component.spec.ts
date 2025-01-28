import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProveedoresComponent } from './top-proveedores.component';

describe('TopProveedoresComponent', () => {
  let component: TopProveedoresComponent;
  let fixture: ComponentFixture<TopProveedoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopProveedoresComponent]
    });
    fixture = TestBed.createComponent(TopProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

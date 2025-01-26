import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithTotalComponent } from './table-with-total.component';

describe('TableWithTotalComponent', () => {
  let component: TableWithTotalComponent;
  let fixture: ComponentFixture<TableWithTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithTotalComponent]
    });
    fixture = TestBed.createComponent(TableWithTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

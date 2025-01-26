import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithoutCheckboxComponent } from './table-without-checkbox.component';

describe('TableWithoutCheckboxComponent', () => {
  let component: TableWithoutCheckboxComponent;
  let fixture: ComponentFixture<TableWithoutCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithoutCheckboxComponent]
    });
    fixture = TestBed.createComponent(TableWithoutCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithCheckboxComponent } from './table-with-checkbox.component';

describe('TableWithCheckboxComponent', () => {
  let component: TableWithCheckboxComponent;
  let fixture: ComponentFixture<TableWithCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithCheckboxComponent]
    });
    fixture = TestBed.createComponent(TableWithCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

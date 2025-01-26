import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithSearchResultComponent } from './table-with-search-result.component';

describe('TableWithSearchResultComponent', () => {
  let component: TableWithSearchResultComponent;
  let fixture: ComponentFixture<TableWithSearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithSearchResultComponent]
    });
    fixture = TestBed.createComponent(TableWithSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

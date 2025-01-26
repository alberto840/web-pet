import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterfaceData, userData } from 'src/app/inventual/data/userData';

@Component({
  selector: 'app-table-without-checkbox',
  templateUrl: './table-without-checkbox.component.html',
  styleUrls: ['./table-without-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableWithoutCheckboxComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'id', 'name', 'phone', 'email', 'role', 'status', 'address', 'action'];
  dataSource: MatTableDataSource<UserInterfaceData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(userData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

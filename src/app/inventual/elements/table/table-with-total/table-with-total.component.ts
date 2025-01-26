import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterfaceData, userData } from 'src/app/inventual/data/userData';

@Component({
  selector: 'app-table-with-total',
  templateUrl: './table-with-total.component.html',
  styleUrls: ['./table-with-total.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableWithTotalComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'role', 'price'];
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

  getTotalPrice() {
    // Access the array of data using this.dataSource.data
    return this.dataSource.data
      // Use map to extract the price from each item
      .map((t: UserInterfaceData) => t.price)
      // Use reduce to sum up the prices
      .reduce((acc: number, value: number) => acc + value, 0);
  }
}
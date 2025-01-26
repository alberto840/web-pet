import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ShippingChargeInterfaceData,
  shippingChargeReportData,
} from '../../data/shippingChargeReportData';

@Component({
  selector: 'app-shippingchargereport',
  templateUrl: './shippingchargereport.component.html',
  styleUrls: ['./shippingchargereport.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShippingchargereportComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'warehouse',
    'product',
    'invoiceNo',
    'amount',
  ];
  dataSource: MatTableDataSource<ShippingChargeInterfaceData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(shippingChargeReportData);
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

  getAmount(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ShippingChargeInterfaceData) => t.amount)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    } else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end

  ngOnInit(): void {}
}

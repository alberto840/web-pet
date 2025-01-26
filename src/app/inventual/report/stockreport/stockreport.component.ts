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
  StockReportInterfaceData,
  stockReportData,
} from '../../data/stockReportData';

@Component({
  selector: 'app-stockreport',
  templateUrl: './stockreport.component.html',
  styleUrls: ['./stockreport.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StockreportComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'name',
    'warehouse',
    'unit',
    'openingStock',
    'received',
    'totalStock',
    'sales',
    'closingStock',
  ];
  dataSource: MatTableDataSource<StockReportInterfaceData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(stockReportData);
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
  getOpeningStock(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: StockReportInterfaceData) => t.openingStock)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getReceived(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: StockReportInterfaceData) => t.received)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getTotalStock(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: StockReportInterfaceData) => t.totalStock)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getSales(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: StockReportInterfaceData) => t.sales)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }

  getClosingStock(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: StockReportInterfaceData) => t.closingStock)
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

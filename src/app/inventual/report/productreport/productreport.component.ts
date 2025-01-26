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
  ProductReportInterfaceData,
  productReportData,
} from '../../data/productReportData';

@Component({
  selector: 'app-productreport',
  templateUrl: './productreport.component.html',
  styleUrls: ['./productreport.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductreportComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'name',
    'warehouse',
    'purchasedQty',
    'purchasedAmount',
    'soldQty',
    'soldAmount',
    'prQty',
    'prAmount',
    'srQty',
    'srAmount',
  ];
  dataSource: MatTableDataSource<ProductReportInterfaceData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(productReportData);
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

  getPurchasedQty(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.purchasedQty)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getPurchasedAmount(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.purchasedAmount)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getSoldQty(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.soldQty)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getSoldAmount(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.soldAmount)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getPrQty(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.prQty)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getPrAmount(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.prAmount)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getSrQty(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.srQty)
        // Use reduce to sum up the prices
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getSrAmount(): number {
    // Access the filtered data using this.dataSource.filteredData
    return (
      this.dataSource.filteredData
        // Use map to extract the price from each item
        .map((t: ProductReportInterfaceData) => t.srAmount)
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

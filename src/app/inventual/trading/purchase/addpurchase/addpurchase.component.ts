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
  ProductInterfaceData,
  productData,
} from 'src/app/inventual/data/productData';

@Component({
  selector: 'app-addpurchase',
  templateUrl: './addpurchase.component.html',
  styleUrls: ['./addpurchase.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddpurchaseComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'image',
    'name',
    'code',
    'unit',
    'price',
    'quantity',
    'tax',
    'discount',
    'subTotal',
    'action',
  ];
  dataSource: MatTableDataSource<ProductInterfaceData> =
    new MatTableDataSource<ProductInterfaceData>([]);
  totalAmount: number = 0;
  totalDiscount: number = 0;
  totalTax: number = 0;
  shippingValue: number = 0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Assign an empty array to the data source initially
    this.dataSource = new MatTableDataSource<ProductInterfaceData>([]);
    this.calculateSubtotals();
    this.calculateTotalAmount();
    this.calculateTotalDiscount();
    this.calculateTotalTax();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addProductToTable(product: ProductInterfaceData) {
    this.dataSource.data = [product]; // Set the table data to contain only the selected product
    this.updateValues(); // Recalculate totals
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateSubtotal(product: ProductInterfaceData): number {
    const price = product.price || 0;
    const quantity = product.quantity || 0;
    const tax = product.tax || 0;
    const discount = product.discount || 0;

    return (
      price * quantity +
      (price * quantity * tax) / 100 -
      (price * quantity * discount) / 100
    );
  }

  calculateSubtotals() {
    this.dataSource.data.forEach((product) => {
      product.subTotal = this.calculateSubtotal(product);
    });
  }
  calculateTotalAmount() {
    this.totalAmount = this.dataSource.data.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }

  calculateTotalDiscount() {
    this.totalDiscount = this.dataSource.data.reduce(
      (acc, product) =>
        acc + (product.discount / 100) * product.price * product.quantity,
      0
    );
  }

  calculateTotalTax() {
    this.totalTax = this.dataSource.data.reduce(
      (acc, product) =>
        acc + (product.tax / 100) * product.price * product.quantity,
      0
    );
  }

  increaseQuantity(product: ProductInterfaceData) {
    product.quantity += 1;
    this.updateValues();
  }

  decreaseQuantity(product: ProductInterfaceData) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.updateValues();
    }
  }

  updateValues() {
    this.calculateSubtotals();
    this.calculateTotalAmount();
    this.calculateTotalDiscount();
    this.calculateTotalTax();
  }
  removeProduct(product: ProductInterfaceData) {
    const index = this.dataSource.data.indexOf(product);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data]; // Triggering change detection
      this.updateValues();
    }
  }

  ngOnInit(): void {}

  searchResults: ProductInterfaceData[] = [];

  updateSearchResults(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.searchResults = productData.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  // Function to toggle selected state of a product
  toggleSelected(product: ProductInterfaceData) {
    product.selected = !product.selected;
    if (product.selected) {
      // Add the product to the table data if selected
      this.dataSource.data.push(product);
    } else {
      // Remove the product from the table data if deselected
      const index = this.dataSource.data.indexOf(product);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
      }
    }
    this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
    this.updateValues(); // Recalculate totals
  }

  // Function to add selected products to the table data
  addSelectedProductsToTable() {
    this.dataSource.data = [
      ...this.searchResults.filter((product) => product.selected),
    ];
    this.updateValues(); // Recalculate totals
  }

  // Function to hide the search results section
  hideSearchResults() {
    this.searchResults = []; // Clear the search results array
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
}

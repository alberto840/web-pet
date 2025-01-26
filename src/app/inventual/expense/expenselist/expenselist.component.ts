import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AddpaymentComponent } from '../../trading/sale/popup/addpayment/addpayment.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewpaymentComponent } from '../../trading/sale/popup/viewpayment/viewpayment.component';
import { ExpenseInterfaceData, expenseData } from '../../data/expenseData';


@Component({
  selector: 'app-expenselist',
  templateUrl: './expenselist.component.html',
  styleUrls: ['./expenselist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpenselistComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'date',
    'voucherNo',
    'name',
    'category',
    'amount',
    'expenseType',
    'warehouse',
    'status',
    'action',
  ];
  dataSource: MatTableDataSource<ExpenseInterfaceData>;
  selection = new SelectionModel<ExpenseInterfaceData>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog) {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(expenseData);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ExpenseInterfaceData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  //sidebar menu activation start
  menuSidebarActive:boolean=false;
  myfunction(){
    if(this.menuSidebarActive==false){
      this.menuSidebarActive=true;
    }
    else {
      this.menuSidebarActive=false;
    }
  }
  //sidebar menu activation end
  addPayment() {
    this.dialog.open(AddpaymentComponent);
  }

  viewPayment() {
    this.dialog.open(ViewpaymentComponent);
  }

  ngOnInit(): void {}

}

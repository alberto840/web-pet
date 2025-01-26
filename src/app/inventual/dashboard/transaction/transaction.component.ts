import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardSaleInterfaceData, dashboardSaleData } from '../../data/dashboardSaleData';
import { DashboardPurchaseInterfaceData, dashboardPurchaseData } from '../../data/dashboardPurchaseData';
import { DashboardPaymentInterfaceData, dashboardPaymentData } from '../../data/dashboardPaymentData';
import { DashboardReturnsInterfaceData, dashboardReturnsData } from '../../data/dashboardReturnsData';
import { DashboardExpenseInterfaceData, dashboardExpenseData } from '../../data/dashboardExpenseData';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent  {

  displayedColumns: string[] = [ 'date', 'reference', 'customer', 'payment', 'status', 'amount'];
  displayedColumnsA: string[] = [ 'date', 'reference', 'supplier', 'payment', 'status', 'amount'];
  displayedColumnsB: string[] = [ 'date', 'reference', 'payment', 'status', 'amount'];
  displayedColumnsC: string[] = [ 'date', 'voucher', 'customer', 'biller', 'remark', 'amount'];
  displayedColumnsD: string[] = [ 'date', 'voucher', 'name', 'category', 'status', 'amount'];

  dataSource: MatTableDataSource<DashboardSaleInterfaceData>;
  dataSourceA: MatTableDataSource<DashboardPurchaseInterfaceData>;
  dataSourceB: MatTableDataSource<DashboardPaymentInterfaceData>;
  dataSourceC: MatTableDataSource<DashboardReturnsInterfaceData>;
  dataSourceD: MatTableDataSource<DashboardExpenseInterfaceData>;

  constructor() {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(dashboardSaleData);
    this.dataSourceA = new MatTableDataSource(dashboardPurchaseData);
    this.dataSourceB = new MatTableDataSource(dashboardPaymentData);
    this.dataSourceC = new MatTableDataSource(dashboardReturnsData);
    this.dataSourceD = new MatTableDataSource(dashboardExpenseData);
  }

}

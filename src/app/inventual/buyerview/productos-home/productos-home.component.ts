import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardExpenseInterfaceData, dashboardExpenseData } from '../../data/dashboardExpenseData';
import { DashboardPaymentInterfaceData, dashboardPaymentData } from '../../data/dashboardPaymentData';
import { DashboardPurchaseInterfaceData, dashboardPurchaseData } from '../../data/dashboardPurchaseData';
import { DashboardReturnsInterfaceData, dashboardReturnsData } from '../../data/dashboardReturnsData';
import { DashboardSaleInterfaceData, dashboardSaleData } from '../../data/dashboardSaleData';
import { Observable } from 'rxjs';
import { ServicioModel, ProductoModel } from '../../models/producto.model';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetNewProductos } from '../../state-management/producto/producto.action';
import { GetNewServicios } from '../../state-management/servicio/servicio.action';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { UtilsService } from '../../utils/utils.service';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';

@Component({
  selector: 'app-productos-home',
  templateUrl: './productos-home.component.html',
  styleUrls: ['./productos-home.component.scss']
})
export class ProductosHomeComponent implements OnInit {
  servicios$: Observable<ServicioModel[]>;
  productos$: Observable<ProductoModel[]>;
  providers$: Observable<ProveedorModel[]>;
  servicios: ServicioModel[] = [];
  productos: ProductoModel[] = [];
  providers: ProveedorModel[] = [];


  displayedColumns: string[] = ['date', 'reference', 'customer', 'payment', 'status', 'amount'];
  displayedColumnsA: string[] = ['date', 'reference', 'supplier', 'payment', 'status', 'amount'];
  displayedColumnsB: string[] = ['date', 'reference', 'payment', 'status', 'amount'];
  displayedColumnsC: string[] = ['date', 'voucher', 'customer', 'biller', 'remark', 'amount'];
  displayedColumnsD: string[] = ['date', 'voucher', 'name', 'category', 'status', 'amount'];

  dataSource: MatTableDataSource<DashboardSaleInterfaceData>;
  dataSourceA: MatTableDataSource<DashboardPurchaseInterfaceData>;
  dataSourceB: MatTableDataSource<DashboardPaymentInterfaceData>;
  dataSourceC: MatTableDataSource<DashboardReturnsInterfaceData>;
  dataSourceD: MatTableDataSource<DashboardExpenseInterfaceData>;

  constructor(private _liveAnnouncer: LiveAnnouncer, private store: Store, public pdfreportService: PdfreportService, private _snackBar: MatSnackBar, public csvreportService: CsvreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    // Assign your data array to the data source
    this.dataSource = new MatTableDataSource(dashboardSaleData);
    this.dataSourceA = new MatTableDataSource(dashboardPurchaseData);
    this.dataSourceB = new MatTableDataSource(dashboardPaymentData);
    this.dataSourceC = new MatTableDataSource(dashboardReturnsData);
    this.dataSourceD = new MatTableDataSource(dashboardExpenseData);
    this.servicios$ = this.store.select(ServicioState.getNewServicios);
    this.productos$ = this.store.select(ProductoState.getNewProductos);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
  }
  ngOnInit(): void {
    this.store.dispatch([new GetNewProductos, new GetNewServicios(), new GetProveedor()]);
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
  }

}

import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, map } from 'rxjs';
import { ServicioModel, ProductoModel, TransaccionModelString, TransaccionModel } from '../../models/producto.model';
import { UsuarioModel } from '../../models/usuario.model';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { GetServicioById } from '../../state-management/servicio/servicio.action';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { GetTransaccion, GetTransaccionByProvider } from '../../state-management/transaccion/transaccion.action';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';

@Component({
  selector: 'app-gestion-transacciones',
  templateUrl: './gestion-transacciones.component.html',
  styleUrls: ['./gestion-transacciones.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GestionTransaccionesComponent implements AfterViewInit, OnDestroy {
  providerId: string = localStorage.getItem('providerId') || '';
  serviciosMap: Map<number, ServicioModel> = new Map();
  productosMap: Map<number, ProductoModel> = new Map();
  displayedColumns: string[] = ['select', 'imagen', 'totalAmount', 'status', 'userId', 'createdAt'];
  dataSource: MatTableDataSource<TransaccionModelString> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<TransaccionModelString>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  transacciones$: Observable<TransaccionModel[]>;
  transacciones: TransaccionModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, private csv: CsvreportService, private pdf: PdfreportService, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public dialogsService: DialogAccessService) {
    this.transacciones$ = this.store.select(TransactionHistoryState.getTransactions);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.productos$ = this.store.select(ProductoState.getProductos);
    this.servicios$ = this.store.select(ServicioState.getServicios);
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch([new GetTransaccion(), new GetUsuario()]);
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.transacciones$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transacciones) => {
        this.transacciones = transacciones;
        transacciones.forEach((transaccion) => {
          if (transaccion.serviceId) {
            this.store.dispatch([new GetServicioById(transaccion.serviceId)]);
          }
          if (transaccion.productId) {
            this.store.dispatch([new GetProductoById(transaccion.productId)]);
          }
        });

        // Escuchar cambios en los servicios y productos
        this.store.select(ServiceByIdState.getServiceById)
          .pipe(takeUntil(this.destroy$))
          .subscribe((servicio) => {
            if (servicio) {
              this.serviciosMap.set((servicio.serviceId ?? 0), servicio);
            }
          });

        this.store.select(ProductByIdState.getProductById)
          .pipe(takeUntil(this.destroy$))
          .subscribe((producto) => {
            if (producto) {
              this.productosMap.set((producto.productId ?? 0), producto);
            }
          });
      });

    (await this.transformarDatosTransaccionesString()).subscribe((transaccion) => {
      this.dataSource.data = transaccion; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetTransaccion(), new GetUsuario()]);
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
  checkboxLabel(row?: TransaccionModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const transaccionId = row.transactionHistoryId ?? 0;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${transaccionId + 1}`;
  }

  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

  generarPDF() {
    const headers = [
      'Servicio',
      'Producto',
      'Monto total',
      'Estado',
      'Usuario',
      'Creado en',
    ];

    const fields: (keyof TransaccionModelString)[] = [
      'serviceIdstring',
      'productIdstring',
      'totalAmount',
      'status',
      'userIdstring',
      'createdAt',
    ]
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Transacciones.pdf',
      fields,
      'Informe de Transacciones generadas: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Servicio',
      'Producto',
      'Monto total',
      'Estado',
      'Usuario',
      'Creado en',
    ];

    const fields: (keyof TransaccionModelString)[] = [
      'serviceId',
      'productId',
      'totalAmount',
      'status',
      'userId',
      'createdAt',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Transacciones.csv', fields);
  }
  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];
  getUserName(id: number): string {
    if (!this.usuarios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  productos$: Observable<ProductoModel[]>;
  servicios$: Observable<ServicioModel[]>;
  productos: ProductoModel[] = [];
  servicios: ServicioModel[] = [];
  getProductName(id: number): string {
    const producto = this.productosMap.get(id);
    return producto ? producto.name : 'Sin producto';
  }
  getServiceName(id: number): string {
    const servicio = this.serviciosMap.get(id);
    return servicio ? servicio.serviceName : 'Sin servicio';
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
  async transformarDatosTransaccionesString() {
    const listaActual$: Observable<TransaccionModel[]> = this.transacciones$;
    const listaModificada$: Observable<TransaccionModelString[]> = listaActual$.pipe(
      map((objetos: TransaccionModel[]) =>
        objetos.map((objeto: TransaccionModel) => ({
          transactionHistoryId: objeto.transactionHistoryId,
          totalAmount: objeto.totalAmount,
          status: objeto.status,
          userId: objeto.userId,
          serviceId: objeto.serviceId,
          productId: objeto.productId,
          userIdstring: this.getUserName(objeto.userId),
          serviceIdstring: this.getServiceName(objeto.serviceId || 0),
          productIdstring: this.getProductName(objeto.productId || 0),
          createdAt: objeto.createdAt,
          amountPerUnit: objeto.amountPerUnit ?? 0,
          quantity: objeto.quantity ?? 0,
        }))
      )
    );
    return listaModificada$;
  }
}

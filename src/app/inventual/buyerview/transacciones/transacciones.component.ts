import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductoModel, ServicioModel, TransaccionModel, TransaccionModelString } from '../../models/producto.model';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { GetTransaccion } from '../../state-management/transaccion/transaccion.action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { GetServicioById } from '../../state-management/servicio/servicio.action';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { UsuarioModel } from '../../models/usuario.model';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { GetResena } from '../../state-management/resena/resena.action';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransaccionesComponent implements AfterViewInit, OnDestroy {
  serviciosMap: Map<number, ServicioModel> = new Map();
  productosMap: Map<number, ProductoModel> = new Map();
  displayedColumns: string[] = ['select', 'imagen', 'totalAmount', 'status', 'userId', 'createdAt'];
  dataSource: MatTableDataSource<TransaccionModel> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<TransaccionModel>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  transacciones$: Observable<TransaccionModel[]>;
  transacciones: TransaccionModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService) {
    this.transacciones$ = this.store.select(TransactionHistoryState.getTransactions);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
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

    (await this.transformarDatosTransaccionesString()).subscribe((transaccion) => {
      this.dataSource.data = transaccion; // Asigna los datos al dataSource
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
  checkboxLabel(row?: TransaccionModel): string {
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
    //const bonosSeleccionados = this.selection.selected;
    //this.pdfreportService.bonospdf(bonosSeleccionados);
  }

  generarCSV() {
    //const bonosSeleccionados = this.selection.selected;
    //this.csvreportService.bonoscsv(bonosSeleccionados);
  }
  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];
  getUserName(id: number): string {
    if (!this.usuarios.length) {
      this.store.dispatch([new GetResena(), new GetProveedor(), new GetUsuario()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
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
          status:     objeto.status,
          userId:      objeto.userId,
          serviceId:   objeto.serviceId,
          productId:  objeto.productId,
          userIdstring:      this.getUserName(objeto.userId),
          serviceIdstring:   "string",
          productIdstring:   "string",
          createdAt:   objeto.createdAt
        }))
      )
    );
    return listaModificada$;
  }
}
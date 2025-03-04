import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodigoDescuentoModel, CodigoDescuentoModelString } from '../../models/producto.model';
import { AddCodigoDescuento, DeleteCodigoDescuento, getCodigoDescuento, UpdateCodigoDescuento } from '../../state-management/codigoDescuento/codigoDescuento.action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { CodigoDescuentoState } from '../../state-management/codigoDescuento/codigoDescuento.state';
import { TicketModelString } from '../../models/ticket.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { FormControl } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-gestion-codigos-promocionales',
  templateUrl: './gestion-codigos-promocionales.component.html',
  styleUrls: ['./gestion-codigos-promocionales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionCodigosPromocionalesComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(CodigoDescuentoState.isLoading);
  isLoadingprov$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];
  codigoPromocion: CodigoDescuentoModel = {
    code: '',
    description: '',
    discountType: '',
    discountValue: 0,
    maxUses: 0,
    startDate: new Date(),
    endDate: new Date(),
    active: true,
    providerId: 0
  };

  agregarCodigoPromocion() {
    if (this.codigoPromocion.code == '' || this.codigoPromocion.description == '' || this.codigoPromocion.discountType == '' || this.codigoPromocion.discountValue == 0 || this.codigoPromocion.maxUses == 0 || this.codigoPromocion.startDate == new Date() || this.codigoPromocion.endDate == new Date() || this.codigoPromocion.active == false || this.codigoPromocion.providerId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddCodigoDescuento(this.codigoPromocion)).subscribe({
      next: () => {
        console.log('Código de promoción agregado exitosamente');
        this.openSnackBar('Código de promoción agregado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregar código de promoción:', error);
        this.openSnackBar('El código de promoción no se pudo agregar', 'Cerrar');
      }
    });
    this.codigoPromocion = {
      code: '',
      description: '',
      discountType: '',
      discountValue: 0,
      maxUses: 0,
      startDate: new Date(),
      endDate: new Date(),
      active: true,
      providerId: 0
    };
  }

  actualizarCodigoPromocion(codigoPromocion: CodigoDescuentoModel) {
    this.store.dispatch(new UpdateCodigoDescuento(codigoPromocion));
  }

  codigosPromocion$: Observable<CodigoDescuentoModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  displayFnProveedor(proveedor: ProveedorModel): any {
    return proveedor && proveedor.name ? proveedor.name : "";
  }

  // Table configuration  
  filteredProveedor!: Observable<ProveedorModel[]>;
  myControlProveedores = new FormControl('');
  displayedColumns: string[] = ['select', 'code', 'description', 'discountType', 'discountValue', 'maxUses', 'currentUses', 'startDate', 'endDate', 'active', 'providerId', 'createdAt', 'accion'];
  dataSource: MatTableDataSource<CodigoDescuentoModelString> = new MatTableDataSource();
  selection = new SelectionModel<CodigoDescuentoModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService) {
    this.codigosPromocion$ = this.store.select(CodigoDescuentoState.getCodigosDescuento);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: CodigoDescuentoModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${(row.promoId ?? 0) + 1}`;
  }

  generarPDF() {
    const headers = [
      'Promo Id',
      'Código',
      'Descripción',
      'Tipo de Descuento',
      'Valor del Descuento',
      'Usos Máximos',
      'Fecha de Inicio',
      'Fecha de Fin',
      'Activo',
      'Provider Id',
      'Proveedor',
      'Creado',
      'Usos Actuales',
    ];

    const fields: (keyof CodigoDescuentoModelString)[] = [
      'promoId',
      'code',
      'description',
      'discountType',
      'discountValue',
      'maxUses',
      'startDate',
      'endDate',
      'active',
      'providerId',
      'providerIdstring',
      'createdAt',
      'currentUses',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_CodigosPromocion.pdf',
      fields,
      'Informe de CodigosPromocion generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const headers = [
      'Promo Id',
      'Código',
      'Descripción',
      'Tipo de Descuento',
      'Valor del Descuento',
      'Usos Máximos',
      'Fecha de Inicio',
      'Fecha de Fin',
      'Activo',
      'Provider Id',
      'Proveedor',
      'Creado',
      'Usos Actuales',
    ];

    const fields: (keyof CodigoDescuentoModelString)[] = [
      'promoId',
      'code',
      'description',
      'discountType',
      'discountValue',
      'maxUses',
      'startDate',
      'endDate',
      'active',
      'providerId',
      'providerIdstring',
      'createdAt',
      'currentUses',
    ];
    const seleccionados = this.selection.selected;
    this.csv.generateCSV(seleccionados, headers, 'Reporte_CodigosPromocion.csv', fields);
  }

  ngOnInit(): void {
    // Despacha la acción para obtener los códigos de promoción
    this.store.dispatch([new getCodigoDescuento(), new GetProveedor()]);

    this.filteredProveedor = this.myControlProveedores.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterProveedor(value || '')),
    );
    this.transformarDatosCodigosPromoString().subscribe((proveedor) => {
      this.dataSource.data = proveedor; // Asigna los datos al dataSource
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
  }

  private _filterProveedor(value: string): Observable<ProveedorModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.providers$.pipe(
      map((proveedores: ProveedorModel[]) =>
        proveedores.filter(proveedor => proveedor.name.toLowerCase().includes(filterValue))
      )
    );
  }

  selectProveedor(proveedor: ProveedorModel) {
    this.codigoPromocion.providerId = (proveedor.providerId ?? 0);
  }

  getProviderName(id: number): string {
    if (!this.providers.length) {
      this.store.dispatch([new getCodigoDescuento(), new GetProveedor()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const provider = this.providers.find((r) => r.providerId === id);
    return provider ? provider.name : 'Sin provider';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  transformarDatosCodigosPromoString() {
    const listaActual$: Observable<CodigoDescuentoModel[]> = this.codigosPromocion$;
    const listaModificada$: Observable<CodigoDescuentoModelString[]> = listaActual$.pipe(
      map((objetos: CodigoDescuentoModel[]) =>
        objetos.map((objeto: CodigoDescuentoModel) => ({
          promoId: objeto.promoId,
          code: objeto.code,
          description: objeto.description,
          discountType: objeto.discountType,
          discountValue: objeto.discountValue,
          maxUses: objeto.maxUses,
          startDate:  objeto.startDate,
          endDate: objeto.endDate,
          startDatestring: format(new Date(objeto.startDate), 'dd-MM-yyyy'),
          endDatestring: format(new Date(objeto.endDate), 'dd-MM-yyyy'),
          active: objeto.active,
          providerId: objeto.providerId,
          providerIdstring: this.getProviderName(objeto.providerId),
          createdAt: objeto.createdAt,
          createdAtstring: format(new Date(objeto.createdAt ?? new Date()), 'dd-MM-yyyy'),
          currentUses: objeto.currentUses,
        }))
      )
    );
    return listaModificada$;
  }
}
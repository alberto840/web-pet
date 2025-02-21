import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { ServicioModel, ServicioModelString } from '../../models/producto.model';
import { AddServicio, DeleteServicio, GetServicio, UpdateServicio } from '../../state-management/servicio/servicio.action';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { CategoriaModel } from '../../models/categoria.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';

@Component({
  selector: 'app-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.scss']
})
export class GestionServiciosComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicio: ServicioModel = {
    serviceId: 0,
    serviceName: '',
    price: 0,
    duration: 0,
    description: '',
    status: true,
    providerId: 0,
    imageId: null,
    imageUrl: '',
    cantidad: 0,
    tipoAtencion: ''
  };

  agregarServicio() {
    if (
      this.servicio.serviceName === '' ||
      this.servicio.description === '' ||
      this.servicio.price <= 0 ||
      this.servicio.duration <= 0 ||
      this.servicio.providerId <= 0 ||
      this.servicio.tipoAtencion === ''
    ) {
      this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
      return;
    }
    //this.store.dispatch(new AddServicio(this.servicio)).subscribe({
    //  next: () => {
    //    console.log('Servicio agregado exitosamente');
    //    this.openSnackBar('Servicio agregado correctamente', 'Cerrar');
    //  },
    //  error: (error) => {
    //    console.error('Error al agregar servicio:', error);
    //    this.openSnackBar('El servicio no se pudo agregar', 'Cerrar');
    //  }
    //});
    this.servicio = {
      serviceId: 0,
      serviceName: '',
      price: 0,
      duration: 0,
      description: '',
      status: true,
      providerId: 0,
      imageId: null,
      imageUrl: '',
      cantidad: 0,
      tipoAtencion: ''
    };
  }

  eliminarServicio(id: number) {
    this.store.dispatch(new DeleteServicio(id)).subscribe({
      next: () => {
        console.log('Servicio eliminado exitosamente');
        this.openSnackBar('Servicio eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.openSnackBar('El servicio no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarServicio(servicio: ServicioModel) {
    //  this.store.dispatch(new UpdateServicio(servicio));
  }

  servicios$: Observable<ServicioModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'serviceName', 'description', 'price', 'duration', 'status', 'providerId', 'tipoAtencion', 'createdAt', 'accion'];
  dataSource: MatTableDataSource<ServicioModelString> = new MatTableDataSource();
  selection = new SelectionModel<ServicioModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
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

  checkboxLabel(row?: ServicioModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.serviceId}`;
  }

  generarPDF() {
    const headers = [
    'Service Id',
    'Nombre del Servicio',
    'Precio',
    'Duración',
    'Descripción',
    'Estado',
    'Provider Id',
    //'Categoría Id',
    'Proveedor',
    'Categoría',
    'Creado',
    'Cantidad',
    'Tipo de Atención',
  ];
  
  const fields: (keyof ServicioModelString)[] = [
    'serviceId',
    'serviceName',
    'price',
    'duration',
    'description',
    'status',
    'providerId',
    //'categoryId',
    'providerIdstring',
    'categoryIdstring',
    'createdAt',
    'cantidad',
    'tipoAtencion',
  ];
    const seleccionados = this.selection.selected;this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Servicios.pdf',
      fields,
      'Informe de Servicios generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const headers = [
      'Service Id',
      'Nombre del Servicio',
      'Precio',
      'Duración',
      'Descripción',
      'Estado',
      'Provider Id',
      //'Categoría Id',
      'Proveedor',
      'Categoría',
      'Creado',
      'Cantidad',
      'Tipo de Atención',
    ];
    
    const fields: (keyof ServicioModelString)[] = [
      'serviceId',
      'serviceName',
      'price',
      'duration',
      'description',
      'status',
      'providerId',
      //'categoryId',
      'providerIdstring',
      'categoryIdstring',
      'createdAt',
      'cantidad',
      'tipoAtencion',
    ];
    const seleccionados = this.selection.selected;
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Servicios.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los servicios
    this.store.dispatch([new GetServicio(), new getCategorias(), new GetProveedor()]);

    (await this.transformarDatosServicioString()).subscribe((servicio) => {
      this.dataSource.data = servicio; // Asigna los datos al dataSource
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
    this.categorias$.subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  getProviderName(id: number): string {
    if (!this.providers.length) {
      this.store.dispatch([new GetServicio(), new GetProveedor()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const provider = this.providers.find((r) => r.providerId === id);
    return provider ? provider.name : 'Sin provider';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  categorias$: Observable<CategoriaModel[]>;
  categorias: CategoriaModel[] = [];

  getCategoriaName(id: number): string {
    if (!this.categorias.length) {
      this.store.dispatch([new GetServicio(), new getCategorias()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const categoria = this.categorias.find((r) => r.categoryId === id);
    return categoria ? categoria.nameCategory : 'Sin categoria';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosServicioString() {
    const listaActual$: Observable<ServicioModel[]> = this.servicios$;
    const listaModificada$: Observable<ServicioModelString[]> = listaActual$.pipe(
        map((objetos: ServicioModel[]) =>
            objetos.map((objeto: ServicioModel) => ({
                serviceId: objeto.serviceId,
                serviceName: objeto.serviceName,
                price: objeto.price,
                duration: objeto.duration,
                description: objeto.description,
                status: objeto.status,
                providerId: objeto.providerId,
                providerIdstring: this.getProviderName(objeto.providerId), // Método para obtener el nombre del proveedor
                categoryIdstring: "aun no", // Método para obtener el nombre de la categoría
                imageId: objeto.imageId,
                imageUrl: objeto.imageUrl,
                createdAt: objeto.createdAt,
                cantidad: objeto.cantidad,
                tipoAtencion: objeto.tipoAtencion,
            }))
        )
    );
    return listaModificada$;
}
}
import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel, ServicioModelString } from '../../models/producto.model';
import { GetServicio, GetServiciosByProvider } from '../../state-management/servicio/servicio.action';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DialogAccessService } from '../../services/dialog-access.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CarritoService } from '../../services/carrito.service';
import { CategoriaModel, SubSubCategoriaModel } from '../../models/categoria.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ServiceByProviderState } from '../../state-management/servicio/servicioByProvider.state';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { format } from 'date-fns';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyServicesComponent implements AfterViewInit, OnInit {
  providerId: number = Number(localStorage.getItem('providerId')) || 0;
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
    tipoAtencion: '',
    categoryId: 0,
    onSale: false,
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
      tipoAtencion: '',
      categoryId: 0,
      onSale: false,
    };
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
  displayedColumns: string[] = ['select', 'imageUrl', 'serviceName', 'description', 'price', 'duration', 'status', 'tipoAtencion', 'createdAt', 'onSale','accion'];
  dataSource: MatTableDataSource<ServicioModelString> = new MatTableDataSource();
  selection = new SelectionModel<ServicioModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService) {
    this.servicios$ = this.store.select(ServiceByProviderState.getServiciosByProvider);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetServiciosByProvider(this.providerId), new getCategorias(), new GetProveedor(), new GetServicio(), new GetSubsubcategoria()]);
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
    const seleccionados = this.selection.selected; this.pdf.generatePDF(
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
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Servicios.csv', fields);
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
    this.store.dispatch([new GetServiciosByProvider(this.providerId), new getCategorias(), new GetProveedor(), new GetServicio(), new GetSubsubcategoria()]);

    (await this.transformarDatosServicioString()).subscribe((servicio) => {
      this.dataSource.data = servicio; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
    this.categorias$.subscribe((categorias) => {
      this.categorias = categorias;
    });
    this.subsubcategorias$.subscribe((subsubcategorias) => {
      this.subsubcategorias = subsubcategorias;
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

  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  subsubcategorias: SubSubCategoriaModel[] = [];

  getSubSubCategoriaName(id: number): string {
    if (!this.subsubcategorias.length) {
      this.store.dispatch([new GetServicio(), new GetSubsubcategoria(), new GetProveedor()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const subsubcategoria = this.subsubcategorias.find((r) => r.subSubCategoriaId === id);
    return subsubcategoria ? subsubcategoria.nameSubSubCategoria : 'Sin subsub categoria';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
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
          categoryId: objeto.categoryId,
          providerIdstring: this.getProviderName(objeto.providerId), // Método para obtener el nombre del proveedor
          categoryIdstring: this.getCategoriaName(objeto.categoryId), // Método para obtener el nombre de la categoría
          imageId: objeto.imageId,
          imageUrl: objeto.imageUrl,
          createdAt: objeto.createdAt,
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible',
          cantidad: objeto.cantidad,
          tipoAtencion: objeto.tipoAtencion,
          subSubCategoriaId: objeto.subSubCategoriaId,
          subSubCategoriaIdstring: this.getSubSubCategoriaName(objeto.subSubCategoriaId || 0),
          onSale: objeto.onSale,
        }))
      )
    );
    return listaModificada$;
  }
}

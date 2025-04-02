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
import { CategoriaModel, SubSubCategoriaModel } from '../../models/categoria.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { format } from 'date-fns';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { UtilsService } from '../../utils/utils.service';

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
    tipoAtencion: '',
    categoryId: 0,
    isOnSale: false
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
      isOnSale: false
    };
  }
  servicios$: Observable<ServicioModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'serviceName', 'description', 'price', 'duration', 'status', 'providerId', 'tipoAtencion', 'createdAt', 'isOnSale','accion'];
  dataSource: MatTableDataSource<ServicioModelString> = new MatTableDataSource();
  selection = new SelectionModel<ServicioModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetServicio(), new getCategorias(), new GetProveedor()]);
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
    this.store.dispatch([new GetServicio(), new getCategorias(), new GetProveedor()]);

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
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const provider = this.providers.find((r) => r.providerId === id);
    return provider ? provider.name : 'Sin provider';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  categorias$: Observable<CategoriaModel[]>;
  categorias: CategoriaModel[] = [];

  getCategoriaName(id: number): string {
    if (!this.categorias.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const categoria = this.categorias.find((r) => r.categoryId === id);
    return categoria ? categoria.nameCategory : 'Sin categoria';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  subsubcategorias: SubSubCategoriaModel[] = [];

  getSubSubCategoriaName(id: number): string {
    if (!this.subsubcategorias.length) {
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
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible', // Formatea la fecha
          cantidad: objeto.cantidad,
          tipoAtencion: objeto.tipoAtencion,
          subSubCategoriaId: objeto.subSubCategoriaId,
          subSubCategoriaIdstring: this.getSubSubCategoriaName(objeto.subSubCategoriaId || 0),
          isOnSale: objeto.isOnSale
        }))
      )
    );
    return listaModificada$;
  }
}
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { OfertaModel, OfertaProductoModel, OfertaServicioModel, ProductoModel, ServicioModel, OfertaProductoModelString, OfertaServicioModelString } from '../../models/producto.model';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { AddOferta, GetOferta } from '../../state-management/oferta/oferta.action';
import { OfertaState } from '../../state-management/oferta/oferta.state';
import { AddOfertaProducto, GetOfertaProducto } from '../../state-management/ofertaProducto/ofertaProducto.action';
import { OfertaProductoState } from '../../state-management/ofertaProducto/ofertaProducto.state';
import { AddOfertaServicio, GetOfertaServicio } from '../../state-management/ofertaServicio/ofertaServicio.action';
import { OfertaServicioState } from '../../state-management/ofertaServicio/ofertaServicio.state';
import { GetProducto, GetProductoById, GetProductosByProvider, UpdateProducto } from '../../state-management/producto/producto.action';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { ProductoByProviderState } from '../../state-management/producto/productoByProvider.state';
import { GetServicio, GetServicioById, GetServiciosByProvider, UpdateServicio } from '../../state-management/servicio/servicio.action';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { ServiceByProviderState } from '../../state-management/servicio/servicioByProvider.state';
import { UtilsService } from '../../utils/utils.service';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ServicioState } from '../../state-management/servicio/servicio.state';

@Component({
  selector: 'app-gestion-ofertas',
  templateUrl: './gestion-ofertas.component.html',
  styleUrls: ['./gestion-ofertas.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GestionOfertasComponent implements AfterViewInit, OnInit {
  providerId: string = localStorage.getItem('providerId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(OfertaState.isLoading);
  isLoadingOfferServicios$: Observable<boolean> = inject(Store).select(OfertaServicioState.isLoading);
  isLoadingOfferProductos$: Observable<boolean> = inject(Store).select(OfertaProductoState.isLoading);
  oferta: OfertaModel = {
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    active: false,
  }
  ofertas: OfertaModel[] = [];
  ofertaProducto: OfertaProductoModel = {
    offersProductsId: 0,
    offerId: 0,
    productId: 0
  }
  ofertasServicio: OfertaServicioModel[] = [];
  ofertaServicios: OfertaServicioModel = {
    offersServicesId: 0,
    serviceId: 0,
    offerId: 0
  }
  ofertasProductos: OfertaProductoModel[] = [];

  agregarOferta() {
    if (this.oferta.name == '' || this.oferta.description == '' || this.oferta.discountValue == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddOferta(this.oferta)).subscribe({
      next: () => {
        console.log('oferta agregada exitosamente');
        this.openSnackBar('oferta agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada oferta:', error);
        this.openSnackBar('La oferta no se pudo agregada', 'Cerrar');
      }
    });
    this.oferta = {
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      active: false,
    }
  }

  async agregarServicioOferta() {
    if (this.ofertaServicios.serviceId == 0 || this.ofertaServicios.offerId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    await this.store.dispatch([new GetServicioById(this.ofertaServicios.serviceId)]);
    this.store.dispatch(new AddOfertaServicio(this.ofertaServicios)).subscribe({
      next: () => {
        console.log('oferta servicio agregada exitosamente');
        this.store.select(ServiceByIdState.getServiceById)
          .pipe()
          .subscribe(async (servicio) => {
            if (servicio) {
              await this.actualizarServicio(servicio);
            }
          });
        this.openSnackBar('oferta servicio agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada oferta servicio:', error);
        this.openSnackBar('La oferta servicio no se pudo agregada', 'Cerrar');
      }
    });
    this.ofertaServicios = {
      offersServicesId: 0,
      serviceId: 0,
      offerId: 0
    }
  }

  async agregarProductoOferta() {
    if (this.ofertaProducto.productId == 0 || this.ofertaProducto.offerId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    await this.store.dispatch([new GetProductoById(this.ofertaProducto.productId)]);
    this.store.dispatch(new AddOfertaProducto(this.ofertaProducto)).subscribe({
      next: () => {
        console.log('oferta producto agregada exitosamente');
        this.store.select(ProductByIdState.getProductById)
          .pipe()
          .subscribe(async (producto) => {
            if (producto) {
              await this.actualizarProducto(producto);
            }
          });
        this.openSnackBar('oferta producto agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada oferta producto:', error);
        this.openSnackBar('La oferta producto no se pudo agregada', 'Cerrar');
      }
    });
    this.ofertaProducto = {
      offersProductsId: 0,
      offerId: 0,
      productId: 0
    }
  }

  ofertas$: Observable<OfertaModel[]>;
  ofertasServicio$: Observable<OfertaServicioModel[]>;
  ofertasProductos$: Observable<OfertaProductoModel[]>;

  productos$: Observable<ProductoModel[]>;
  servicios$: Observable<ServicioModel[]>;

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  //sidebar menu activation end

  displayedColumns: string[] = ['name', 'description', 'discountValue', 'startDate', 'endDate', 'accion'];
  displayedColumnsProductoOferta: string[] = ['offerId', 'productId', 'accion'];
  displayedColumnsServicioOferta: string[] = ['offerId', 'serviceId', 'accion'];
  dataSource: MatTableDataSource<OfertaModel> = new MatTableDataSource();
  selection = new SelectionModel<OfertaModel>(true, []);
  dataSourceOfferProduct: MatTableDataSource<OfertaProductoModelString> = new MatTableDataSource();
  selectionOfferProduct = new SelectionModel<OfertaProductoModelString>(true, []);
  dataSourcesOfferService: MatTableDataSource<OfertaServicioModelString> = new MatTableDataSource();
  selectionOfferService = new SelectionModel<OfertaServicioModelString>(true, []);


  @ViewChild('MatPaginator')
  paginator!: MatPaginator;
  @ViewChild('MatSort')
  sort!: MatSort;

  @ViewChild('MatPaginatorsub')
  paginatorsub!: MatPaginator;
  @ViewChild('MatSortsub')
  sortsub!: MatSort;

  @ViewChild('MatPaginatorsubsub')
  paginatorsubsub!: MatPaginator;
  @ViewChild('MatSortsubsub')
  sortsubsub!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer, private store: Store, public pdfreportService: PdfreportService, private _snackBar: MatSnackBar, public csvreportService: CsvreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.ofertas$ = this.store.select(OfertaState.getOfertas);
    this.ofertasProductos$ = this.store.select(OfertaProductoState.getOfertasProducto);
    this.ofertasServicio$ = this.store.select(OfertaServicioState.getOfertasServicio);

    this.productos$ = this.store.select(ProductoState.getProductos);
    this.servicios$ = this.store.select(ServicioState.getServicios);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async ngAfterViewInit() {
    await this.store.dispatch([new GetOferta(), new GetOfertaProducto(), new GetOfertaServicio(), new GetProducto(), new GetServicio()]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceOfferProduct.paginator = this.paginatorsub;
    this.dataSourceOfferProduct.sort = this.sortsub;
    this.dataSourcesOfferService.paginator = this.paginatorsubsub;
    this.dataSourcesOfferService.sort = this.sortsubsub;
  }

  generarPDF() {
    const seleccionados = this.dataSource.data;
    const seleccionadossub = this.dataSourceOfferProduct.data;
    const seleccionadossubsub = this.dataSourcesOfferService.data;
    //this.csvreportService.ubicacionescsv(seleccionados, seleccionadossub, seleccionadossubsub);
  }

  generarCSV() {
    const seleccionados = this.dataSource.data;
    const seleccionadossub = this.dataSourceOfferProduct.data;
    const seleccionadossubsub = this.dataSourcesOfferService.data;
    //this.pdfreportService.categoriaspdf(seleccionados, seleccionadossub, seleccionadossubsub);
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener las empresas
    await this.store.dispatch([new GetOferta(), new GetOfertaProducto(), new GetOfertaServicio(), new GetProducto(), new GetServicio()]);
    // Suscríbete al observable para actualizar el dataSource
    this.ofertas$.subscribe((ofertas) => {
      this.dataSource.data = ofertas; // Asigna los datos al dataSource
      this.ofertas = ofertas;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    // Suscríbete al observable para actualizar el dataSource
    this.ofertasProductos$.subscribe((ofertasProductos) => {
      this.ofertasProductos = ofertasProductos;
    });
    // Suscríbete al observable para actualizar el dataSource
    this.ofertasServicio$.subscribe((ofertasServicio) => {
      this.ofertasServicio = ofertasServicio;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });

    (await this.transformarDatosOfertaProductoString()).subscribe((data) => {
      this.dataSourceOfferProduct.data = data; // Asigna los datos al dataSource    this.dataSource.paginator = this.paginator;
      this.dataSourceOfferProduct.paginator = this.paginatorsub;
      this.dataSourceOfferProduct.sort = this.sortsub;
    });
    (await this.transformarDatosOfertaServicioString()).subscribe((data) => {
      this.dataSourcesOfferService.data = data;
      this.dataSourcesOfferService.paginator = this.paginatorsubsub;
      this.dataSourcesOfferService.sort = this.sortsubsub;
    });
  }

  //CONVERTIR A STRING
  productos: ProductoModel[] = [];
  servicios: ServicioModel[] = [];
  getProductoName(id: number): string {
    if (!this.productos.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const producto = this.productos.find((r) => r.productId === id);
    return producto ? producto.name : 'Sin Producto';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  getServicioName(id: number): string {
    if (!this.servicios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const servicio = this.servicios.find((r) => r.serviceId === id);
    return servicio ? servicio.serviceName : 'Sin Servicio';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  getOfertaName(id: number): string {
    if (!this.ofertas.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const oferta = this.ofertas.find((r) => r.offerId === id);
    return oferta ? oferta.name : 'Sin Oferta';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  transformarDatosOfertaProductoString() {
    const listaActual$: Observable<OfertaProductoModel[]> = this.ofertasProductos$;
    const listaModificada$: Observable<OfertaProductoModelString[]> = listaActual$.pipe(
      map((objetos: OfertaProductoModel[]) =>
        objetos.map((objeto: OfertaProductoModel) => ({
          offersProductsId: objeto.offersProductsId,
          offerId: objeto.offerId,
          productId: objeto.productId,
          offerIdstring: this.getOfertaName(objeto.offerId),
          productIdstring: this.getProductoName(objeto.productId),
        }))
      )
    );
    return listaModificada$;
  }

  transformarDatosOfertaServicioString() {
    const listaActual$: Observable<OfertaServicioModel[]> = this.ofertasServicio$;
    const listaModificada$: Observable<OfertaServicioModelString[]> = listaActual$.pipe(
      map((objetos: OfertaServicioModel[]) =>
        objetos.map((objeto: OfertaServicioModel) => ({
          offersServicesId: objeto.offersServicesId,
          serviceId: objeto.serviceId,
          offerId: objeto.offerId,
          offerIdstring: this.getOfertaName(objeto.offerId),
          serviceIdstring: this.getServicioName(objeto.serviceId),
        }))
      )
    );
    return listaModificada$;
  }

  async actualizarProducto(producto: ProductoModel) {
    let auxProducto: ProductoModel = {
      productId: producto.productId,
      name: producto.name,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
      status: true,
      providerId: producto.providerId,
      categoryId: producto.categoryId,
      subSubCategoriaId: producto.subSubCategoriaId,
      isOnSale: true
    }
    let file: File | null = null;
    await this.utils.urlToFile((producto.imageUrl || ''), 'default' + producto.productId).then((file) => {
      file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });

    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateProducto(auxProducto, file)).subscribe({
      next: () => {
        console.log('Producto actualizado correctamente:', auxProducto);
        this.openSnackBar('Producto actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar Producto:', error);
        this.openSnackBar('Error en el actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  async actualizarServicio(servicio: ServicioModel) {
    let auxServicio: ServicioModel = {
      serviceId: servicio.serviceId,
      serviceName: servicio.serviceName,
      price: servicio.price,
      duration: servicio.duration,
      description: servicio.description,
      status: true,
      providerId: servicio.providerId,
      imageId: servicio.imageId,
      tipoAtencion: servicio.tipoAtencion,
      categoryId: servicio.categoryId,
      subSubCategoriaId: servicio.subSubCategoriaId,
      onSale: true
    }
    let file: File | null = null;
    await this.utils.urlToFile((servicio.imageUrl || ''), 'default' + servicio.imageId).then((file) => {
      file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });


    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateServicio(auxServicio, file)).subscribe({
      next: () => {
        console.log('Servicio registrado correctamente:', auxServicio);
        this.openSnackBar('Servicio registrado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al registrar Servicio:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

}

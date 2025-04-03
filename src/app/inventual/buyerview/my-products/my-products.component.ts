import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductoModel, ProductoModelString } from '../../models/producto.model';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { map, Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoState } from '../../state-management/producto/producto.state';
import { GetProducto, GetProductosByProvider } from '../../state-management/producto/producto.action';
import { CategoriaModel, SubSubCategoriaModel } from '../../models/categoria.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ProductoByProviderState } from '../../state-management/producto/productoByProvider.state';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyProductsComponent implements AfterViewInit, OnInit {
  providerId: number = Number(localStorage.getItem('providerId')) || 0;
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  producto: ProductoModel = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    status: true,
    providerId: 0,
    categoryId: 0,
    imageUrl: '',
    cantidad: 0,
    isOnSale: false,
  };

  agregarProducto() {
    if (
      this.producto.name === '' ||
      this.producto.description === '' ||
      this.producto.price <= 0 ||
      this.producto.stock < 0 ||
      this.producto.providerId <= 0 ||
      this.producto.categoryId <= 0
    ) {
      this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
      return;
    }
    //this.store.dispatch(new AddProducto(this.producto, )).subscribe({
    //  next: () => {
    //    console.log('Producto agregado exitosamente');
    //    this.openSnackBar('Producto agregado correctamente', 'Cerrar');
    //  },
    // error: (error) => {
    //    console.error('Error al agregar producto:', error);
    //    this.openSnackBar('El producto no se pudo agregar', 'Cerrar');
    //  }
    //});
    this.producto = {
      productId: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      status: true,
      providerId: 0,
      categoryId: 0,
      imageUrl: '',
      cantidad: 0,
      isOnSale: false,
    };
  }

  actualizarProducto(producto: ProductoModel) {
    //this.store.dispatch(new UpdateProducto(producto));
  }

  productos$: Observable<ProductoModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'name', 'description', 'price', 'stock', 'status', 'categoryId', 'createdAt', 'isOnSale','action'];
  dataSource: MatTableDataSource<ProductoModelString> = new MatTableDataSource();
  selection = new SelectionModel<ProductoModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService) {
    this.productos$ = this.store.select(ProductoByProviderState.getProductosByProvider);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetProductosByProvider(this.providerId), new getCategorias(), new GetProducto(), new GetProveedor(), new GetSubsubcategoria()]);
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

  checkboxLabel(row?: ProductoModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.productId}`;
  }

  generarPDF() {
    const headers = [
      'Product Id',
      'Nombre',
      'Descripción',
      'Precio',
      'Stock',
      'Creado',
      'Estado',
      'Provider Id',
      'Categoría Id',
      'Proveedor',
      'Categoría',
      'Cantidad',
    ];

    const fields: (keyof ProductoModelString)[] = [
      'productId',
      'name',
      'description',
      'price',
      'stock',
      'createdAt',
      'status',
      'providerId',
      'categoryId',
      'providerIdstring',
      'categoryIdstring',
      'cantidad',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Productos.pdf',
      fields,
      'Informe de Productos generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Product Id',
      'Nombre',
      'Descripción',
      'Precio',
      'Stock',
      'Creado',
      'Estado',
      'Provider Id',
      'Categoría Id',
      'Proveedor',
      'Categoría',
      'Cantidad',
    ];

    const fields: (keyof ProductoModelString)[] = [
      'productId',
      'name',
      'description',
      'price',
      'stock',
      'createdAt',
      'status',
      'providerId',
      'categoryId',
      'providerIdstring',
      'categoryIdstring',
      'cantidad',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Productos.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los productos
    this.store.dispatch([new GetProductosByProvider(this.providerId), new getCategorias(), new GetProducto(), new GetProveedor(), new GetSubsubcategoria()]);
    this.categorias$.subscribe((categorias) => {
      this.categorias = categorias;
    });
    this.subsubcategorias$.subscribe((subsubcategorias) => {
      this.subsubcategorias = subsubcategorias;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });

    (await this.transformarDatosProductoString()).subscribe((producto) => {
      this.dataSource.data = producto; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  async transformarDatosProductoString() {
    const listaActual$: Observable<ProductoModel[]> = this.productos$;
    const listaModificada$: Observable<ProductoModelString[]> = listaActual$.pipe(
      map((objetos: ProductoModel[]) =>
        objetos.map((objeto: ProductoModel) => ({
          productId: objeto.productId,
          name: objeto.name,
          description: objeto.description,
          price: objeto.price,
          stock: objeto.stock,
          createdAt: objeto.createdAt,
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : '', 
          status: objeto.status,
          providerId: objeto.providerId,
          categoryId: objeto.categoryId,
          providerIdstring: this.getProviderName(objeto.providerId), // Método para obtener el nombre del proveedor
          categoryIdstring: this.getCategoriaName(objeto.categoryId), // Método para obtener el nombre de la categoría
          imageUrl: objeto.imageUrl,
          cantidad: objeto.cantidad,
          subSubCategoriaId: objeto.subSubCategoriaId,
          subSubCategoriaIdstring: this.getSubSubCategoriaName(objeto.subSubCategoriaId || 0), // Método para obtener el nombre de la subcategoría 
          isOnSale: objeto.isOnSale,
        }))
      )
    );
    return listaModificada$;
  }

}

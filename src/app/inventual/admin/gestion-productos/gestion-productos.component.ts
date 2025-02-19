import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { AddProducto, DeleteProducto, GetProducto, UpdateProducto } from '../../state-management/producto/producto.action';
import { ProductoState } from '../../state-management/producto/producto.state';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements AfterViewInit, OnInit {
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
    cantidad: 0
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
      cantidad: 0
    };
  }

  eliminarProducto(id: number) {
    this.store.dispatch(new DeleteProducto(id)).subscribe({
      next: () => {
        console.log('Producto eliminado exitosamente');
        this.openSnackBar('Producto eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.openSnackBar('El producto no se pudo eliminar', 'Cerrar');
      }
    });
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
  displayedColumns: string[] = ['select', 'imageUrl', 'name', 'description', 'price', 'stock', 'status', 'providerId', 'categoryId', 'createdAt', 'action'];
  dataSource: MatTableDataSource<ProductoModel> = new MatTableDataSource();
  selection = new SelectionModel<ProductoModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.productos$ = this.store.select(ProductoState.getProductos);
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

  checkboxLabel(row?: ProductoModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.productId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
  }

  generarCSV() {    
    const seleccionados = this.selection.selected;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    // Despacha la acción para obtener los productos
    this.store.dispatch(new GetProducto());

    // Suscríbete al observable para actualizar el dataSource
    this.productos$.subscribe((productos) => {
      this.dataSource.data = productos;
    });
  }
}
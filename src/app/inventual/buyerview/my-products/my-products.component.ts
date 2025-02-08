import { AfterViewInit, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoState } from '../../state-management/producto/producto.state';
import { GetProducto } from '../../state-management/producto/producto.action';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyProductsComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'imagen', 'nombre', 'precio', 'stock', 'categoria', 'descripcion', 'estado', 'fechaCreacion', 'action'];
  dataSource: MatTableDataSource<ProductoModel> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<ProductoModel>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  productos$: Observable<ProductoModel[]>;
  productosLista: ProductoModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService) {
    this.productos$ = this.store.select(ProductoState.getProductos);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetProducto()]);
    this.productos$.subscribe((producto) => {
      this.productosLista = producto;
    });

    // Suscríbete al observable para actualizar el dataSource
    this.productos$.subscribe((productos) => {
      this.dataSource.data = productos; // Asigna los datos al dataSource
    });
  }

  ngAfterViewInit() {
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
  checkboxLabel(row?: ProductoModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const productId = row.productId ?? 0; // Provide a default value of 0 if productId is undefined
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${productId + 1}`;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 2000});
  }

}

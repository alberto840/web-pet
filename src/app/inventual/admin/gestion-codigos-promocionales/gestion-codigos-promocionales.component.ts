import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodigoDescuentoModel } from '../../models/producto.model';
import { AddCodigoDescuento, DeleteCodigoDescuento, getCodigoDescuento, UpdateCodigoDescuento } from '../../state-management/codigoDescuento/codigoDescuento.action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CodigoDescuentoState } from '../../state-management/codigoDescuento/codigoDescuento.state';

@Component({
  selector: 'app-gestion-codigos-promocionales',
  templateUrl: './gestion-codigos-promocionales.component.html',
  styleUrls: ['./gestion-codigos-promocionales.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GestionCodigosPromocionalesComponent implements AfterViewInit {
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

  eliminarCodigoPromocion(id: number) {
    this.store.dispatch(new DeleteCodigoDescuento(id)).subscribe({
      next: () => {
        console.log('Código de promoción eliminado exitosamente');
        this.openSnackBar('Código de promoción eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar código de promoción:', error);
        this.openSnackBar('El código de promoción no se pudo eliminar', 'Cerrar');
      }
    });
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

  // Table configuration
  displayedColumns: string[] = ['select', 'code', 'description', 'discountType', 'discountValue', 'maxUses', 'currentUses', 'startDate', 'endDate', 'active', 'providerId', 'createdAt','accion'];
  dataSource: MatTableDataSource<CodigoDescuentoModel> = new MatTableDataSource();
  selection = new SelectionModel<CodigoDescuentoModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.codigosPromocion$ = this.store.select(CodigoDescuentoState.getCodigosDescuento);
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

  checkboxLabel(row?: CodigoDescuentoModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${(row.promoId ?? 0) + 1}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
  }

  generarCSV() {    
    const seleccionados = this.selection.selected;
  }

  ngOnInit(): void {
    // Despacha la acción para obtener los códigos de promoción
    this.store.dispatch(new getCodigoDescuento());

    // Suscríbete al observable para actualizar el dataSource
    this.codigosPromocion$.subscribe((codigosPromocion) => {
      this.dataSource.data = codigosPromocion;
    });
  }
}
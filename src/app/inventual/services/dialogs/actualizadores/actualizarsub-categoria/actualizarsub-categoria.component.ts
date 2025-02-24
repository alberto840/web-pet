import { Component, inject, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoriaModel, SubCategoriaModel } from 'src/app/inventual/models/categoria.model';
import { UpdateSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { SubcategoriaState } from 'src/app/inventual/state-management/subcategoria/subcategoria.state';
import { ActualizarCategoriaComponent } from '../actualizar-categoria/actualizar-categoria.component';
import { CategoriaState } from 'src/app/inventual/state-management/categoria/categoria.state';
import { getCategorias } from 'src/app/inventual/state-management/categoria/categoria.action';

@Component({
  selector: 'app-actualizarsub-categoria',
  templateUrl: './actualizarsub-categoria.component.html',
  styleUrls: ['./actualizarsub-categoria.component.scss'],
        encapsulation: ViewEncapsulation.None
})
export class ActualizarsubCategoriaComponent implements OnInit {
  categorias$: Observable<CategoriaModel[]>;
  categorias: CategoriaModel[] = [];
  isLoading$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  subcategoria: SubCategoriaModel = {
    nameSubCategoria: '',
    categoryId: 0
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  constructor(private store: Store, private dialog: MatDialog,
    public dialogRef: MatDialogRef<ActualizarCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public subcategory: SubCategoriaModel, private _snackBar: MatSnackBar) {
      this.categorias$ = this.store.select(CategoriaState.getCategorias);
      this.categorias$.subscribe({
        next: (categorias) => {
          this.categorias = categorias;
        }
      });
      if (this.subcategory) {
        this.subcategoria = { ...this.subcategory };
      }
  }

  ngOnInit(): void {
    this.store.dispatch(new getCategorias());
  }

  hide = true;
  actualizarSubCategoria() {
    if(this.subcategoria.nameSubCategoria === '' || this.subcategoria.categoryId === 0){
      this.openSnackBar('Todos los campos son requeridos', 'Cerrar');
      return;
    }
    this.store.dispatch(new UpdateSubcategoria(this.subcategoria)).subscribe({
      next: () => {
        console.log('subcategoria Actualizado exitosamente');
        this.openSnackBar('subcategoria Actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar subcategoria:', error);
        this.openSnackBar('El subcategoria no se pudo actualizar', 'Cerrar');
      }
    });
    this.subcategoria = {
      nameSubCategoria: '',
      categoryId: 0
    };
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }

}

import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubCategoriaModel, SubSubCategoriaModel } from 'src/app/inventual/models/categoria.model';
import { GetSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { SubcategoriaState } from 'src/app/inventual/state-management/subcategoria/subcategoria.state';
import { UpdateSubsubcategoria } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.state';

@Component({
  selector: 'app-actualizarsubsub-categoria',
  templateUrl: './actualizarsubsub-categoria.component.html',
  styleUrls: ['./actualizarsubsub-categoria.component.scss']
})
export class ActualizarsubsubCategoriaComponent implements OnInit {
  subcategorias$: Observable<SubCategoriaModel[]>;
  subcategorias: SubCategoriaModel[] = [];
  isLoading$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  subsubcategoria: SubSubCategoriaModel = {
    nameSubSubCategoria: '',
    subCategoriaId: 0
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  constructor(private store: Store, private dialog: MatDialog,
    public dialogRef: MatDialogRef<ActualizarsubsubCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public subsubcategory: SubSubCategoriaModel, private _snackBar: MatSnackBar) {
      this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
      this.subcategorias$.subscribe({
        next: (subcategorias) => {
          this.subcategorias = subcategorias;
        }
      });
      if (this.subsubcategory) {
        this.subsubcategoria = { ...this.subsubcategory };
      }
  }

  ngOnInit(): void {
    this.store.dispatch(new GetSubcategoria());
  }

  hide = true;
  actualizarSubSubCategoria() {
    this.store.dispatch(new UpdateSubsubcategoria(this.subsubcategoria)).subscribe({
      next: () => {
        console.log('subsubcategoria Actualizado exitosamente');
        this.openSnackBar('subsubcategoria Actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar subsubcategoria:', error);
        this.openSnackBar('El subsubcategoria no se pudo actualizar', 'Cerrar');
      }
    });
    this.subsubcategoria = {
      nameSubSubCategoria: '',
      subCategoriaId: 0
    };
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }

}

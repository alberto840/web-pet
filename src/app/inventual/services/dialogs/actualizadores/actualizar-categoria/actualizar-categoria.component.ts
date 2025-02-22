import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoriaModel } from 'src/app/inventual/models/categoria.model';
import { UpdateCategoria } from 'src/app/inventual/state-management/categoria/categoria.action';
import { CategoriaState } from 'src/app/inventual/state-management/categoria/categoria.state';

@Component({
  selector: 'app-actualizar-categoria',
  templateUrl: './actualizar-categoria.component.html',
  styleUrls: ['./actualizar-categoria.component.scss']
})
export class ActualizarCategoriaComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  categoria: CategoriaModel = {
    nameCategory: '',
    icono: ''
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  constructor(private store: Store, private dialog: MatDialog,
    public dialogRef: MatDialogRef<ActualizarCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public category: CategoriaModel, private _snackBar: MatSnackBar) {
    this.categoria = {
      nameCategory: '',
      icono: ''
    };
  }

  ngOnInit(): void {
    if (this.category) {
      this.categoria = { ...this.category };
    }
  }

  hide = true;
  actualizarCategoria() {
    this.store.dispatch(new UpdateCategoria(this.categoria)).subscribe({
      next: () => {
        console.log('categoria Actualizado exitosamente');
        this.openSnackBar('categoria Actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar categoria:', error);
        this.openSnackBar('El categoria no se pudo actualizar', 'Cerrar');
      }
    });
    this.categoria = {
      nameCategory: '',
      icono: ''
    };
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }

}

import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ResenaModel } from 'src/app/inventual/models/proveedor.model';
import { UpdateResena } from 'src/app/inventual/state-management/resena/resena.action';
import { ResenaState } from 'src/app/inventual/state-management/resena/resena.state';

@Component({
  selector: 'app-actualizar-reviews',
  templateUrl: './actualizar-reviews.component.html',
  styleUrls: ['./actualizar-reviews.component.scss']
})
export class ActualizarReviewsComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ResenaState.isLoading);
  selectedStars: number = 0;
  rate(stars: number) {
    this.selectedStars = stars;
  }
  resena: ResenaModel = {
    rating: 0,
    comment: '',
    userId: 0,
    providerId: 0,
  };

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ActualizarReviewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResenaModel,
    private _snackBar: MatSnackBar
  ) {
    if (data) {
      this.resena = { ...data };
    }
  }

  ngOnInit(): void {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  actualizarResena() {
    this.store.dispatch(new UpdateResena(this.resena)).subscribe({
      next: () => {
        this.openSnackBar('Reseña actualizada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar reseña:', error);
        this.openSnackBar('Error al actualizar reseña', 'Cerrar');
      },
    });
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialogRef.close();
  }
}

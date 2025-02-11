import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ResenaModel } from 'src/app/inventual/models/proveedor.model';
import { AddResena } from 'src/app/inventual/state-management/resena/resena.action';
import { ResenaState } from 'src/app/inventual/state-management/resena/resena.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { CreateMastcotaComponent } from '../create-mastcota/create-mastcota.component';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit  {
  selectedStars: number = 0;
  rate(stars: number) {
    this.selectedStars = stars;
  }
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ResenaState.isLoading);
  resena: ResenaModel = {
    rating: 0,
    comment: '',
    userId: 0,
    providerId: 0
  }

  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store,private dialogRef: MatDialogRef<CreateMastcotaComponent>) {

  }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarResena() {
    this.resena.rating = this.selectedStars;
    this.resena.userId = parseInt(this.userId);
    if (this.resena.rating === 0 || this.resena.comment === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    // Enviar usuario y archivo al store
    this.store.dispatch(new AddResena(this.resena)).subscribe({
      next: () => {
        console.log('Resena registrada correctamente:', this.resena);
        this.openSnackBar('Reseña registrada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar resena:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
  
  // Reiniciar formulario
  resetForm() {
    this.resena = {
      rating: 0,
      comment: '',
      userId: 0,
      providerId: 0
    };
  }

}

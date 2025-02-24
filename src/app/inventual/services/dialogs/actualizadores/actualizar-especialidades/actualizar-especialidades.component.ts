import { Component, inject, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EspecialidadModel } from 'src/app/inventual/models/especialidad.model';
import { UpdateEspecialidad } from 'src/app/inventual/state-management/especialidad/especialidad.action';
import { SpecialityState } from 'src/app/inventual/state-management/especialidad/especialidad.state';

@Component({
  selector: 'app-actualizar-especialidades',
  templateUrl: './actualizar-especialidades.component.html',
  styleUrls: ['./actualizar-especialidades.component.scss'],
        encapsulation: ViewEncapsulation.None
})
export class ActualizarEspecialidadesComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(SpecialityState.isLoading);
  especialidad: EspecialidadModel = {
    specialtyId: 0,
    nameSpecialty: '',
  };

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ActualizarEspecialidadesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EspecialidadModel,
    private _snackBar: MatSnackBar
  ) {
    if (data) {
      this.especialidad = { ...data };
    }
  }

  ngOnInit(): void {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  actualizarEspecialidad() {
    if(this.especialidad.nameSpecialty === ''){
      this.openSnackBar('Todos los campos son requeridos', 'Cerrar');
      return;
    }
    this.store.dispatch(new UpdateEspecialidad(this.especialidad)).subscribe({
      next: () => {
        this.openSnackBar('Especialidad actualizada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar especialidad:', error);
        this.openSnackBar('Error al actualizar especialidad', 'Cerrar');
      },
    });
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialogRef.close();
  }

}

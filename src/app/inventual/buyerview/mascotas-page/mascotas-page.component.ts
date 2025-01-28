import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MascotaModel } from '../../models/mascota.model';
import { MascotaState } from '../../state-management/mascota/mascota.state';
import { getMascota } from '../../state-management/mascota/mascote.action';

@Component({
  selector: 'app-mascotas-page',
  templateUrl: './mascotas-page.component.html',
  styleUrls: ['./mascotas-page.component.scss']
})
export class MascotasPageComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(MascotaState.isLoading);
  mascotas$: Observable<MascotaModel[]>;
  mascotasLista: MascotaModel[] = [];

  constructor(public router: Router, private store: Store) {
    this.mascotas$ = this.store.select(MascotaState.getMascotas);
  }

  ngOnInit(): void {
    this.store.dispatch([new getMascota()]);
    this.mascotas$.subscribe((mascotas) => {
      this.mascotasLista = mascotas;
    });
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

}

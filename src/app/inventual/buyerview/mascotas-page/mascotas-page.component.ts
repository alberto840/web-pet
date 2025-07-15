import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MascotaModel } from '../../models/mascota.model';
import { MascotaState } from '../../state-management/mascota/mascota.state';
import { getMascota, GetMascotasByUser } from '../../state-management/mascota/mascote.action';
import { DialogAccessService } from '../../services/dialog-access.service';
import { MascotasByUserState } from '../../state-management/mascota/mascotaByUserId.state';

@Component({
  selector: 'app-mascotas-page',
  templateUrl: './mascotas-page.component.html',
  styleUrls: ['./mascotas-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MascotasPageComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(MascotaState.isLoading);
  mascotas$: Observable<MascotaModel[]>;
  mascotasLista: MascotaModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService) {
    this.mascotas$ = this.store.select(MascotasByUserState.getMascotasByUser);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetMascotasByUser(this.userId ? parseInt(this.userId) : 0)]);
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

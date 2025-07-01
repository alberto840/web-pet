import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogAccessService } from '../../services/dialog-access.service';
import { ReservacionModel, ReservacionModelString } from '../../models/producto.model';
import { ReservaState } from '../../state-management/reserva/reserva.state';
import { GetReserva } from '../../state-management/reserva/reserva.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
      encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  reservas$: Observable<ReservacionModel[]>;
  reservasLista: ReservacionModel[] = [];

  

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService) {
    this.reservas$ = this.store.select(ReservaState.getReservas);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetReserva()]);
    this.reservas$.subscribe((reservas) => {
      this.reservasLista = reservas;
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
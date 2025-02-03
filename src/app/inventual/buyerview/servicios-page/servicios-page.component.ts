import { Component, inject, OnInit } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel } from '../../models/producto.model';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-servicios-page',
  templateUrl: './servicios-page.component.html',
  styleUrls: ['./servicios-page.component.scss']
})
export class ServiciosPageComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicios: ServicioModel[] = [];
  servicios$: Observable<ServicioModel[]>;

  menuSidebarActive:boolean=false;
  constructor(public router: Router, private store: Store){
    this.servicios$ = this.store.select(ServicioState.getServicios);
  }
  ngOnInit(): void {
      this.store.dispatch([new GetServicio()]);   
  }
  myfunction(){
    if(this.menuSidebarActive==false){
      this.menuSidebarActive=true;
    }
    else {
      this.menuSidebarActive=false;
    }
  }

}

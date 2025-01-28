import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios-page',
  templateUrl: './servicios-page.component.html',
  styleUrls: ['./servicios-page.component.scss']
})
export class ServiciosPageComponent {

  menuSidebarActive:boolean=false;
  myfunction(){
    if(this.menuSidebarActive==false){
      this.menuSidebarActive=true;
    }
    else {
      this.menuSidebarActive=false;
    }
  }

}

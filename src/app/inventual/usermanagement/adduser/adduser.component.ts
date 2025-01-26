import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdduserComponent implements OnInit {

//sidebar menu activation start
menuSidebarActive:boolean=false;
myfunction(){
  if(this.menuSidebarActive==false){
    this.menuSidebarActive=true;
  }
  else {
    this.menuSidebarActive=false;
  }
}
//sidebar menu activation end

hide = true;

  constructor() { }

  ngOnInit(): void {}

}

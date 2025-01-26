import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-newmessage',
  templateUrl: './newmessage.component.html',
  styleUrls: ['./newmessage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewmessageComponent implements OnInit {
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
  constructor() { }
  ngOnInit(): void {}

}

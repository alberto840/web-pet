import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  images: string[] = [
    'assets/img/logo/PetWise_FinalLogo_TRANSPARENTE.PNG',
    'assets/img/logo/PetWise_FinalLogo_TRANSPARENTE.PNG',
    'assets/img/logo/PetWise_FinalLogo_TRANSPARENTE.PNG',
  ];
  currentIndex: number = 0;

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
  
  constructor(public carritoService: CarritoService) { }

  ngOnInit(): void {}

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

}

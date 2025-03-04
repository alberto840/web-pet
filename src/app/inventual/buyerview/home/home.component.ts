import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Observable } from 'rxjs';
import { CarouselModel } from '../../models/carousel.model';
import { Store } from '@ngxs/store';
import { CarouselState } from '../../state-management/carousel/carousel.state';
import { getCarousel } from '../../state-management/carousel/carousel.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  carousel$: Observable<CarouselModel[]>;
  carouselItems: CarouselModel[] = [];
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

  constructor(public carritoService: CarritoService, private store: Store) {
    this.carousel$ = this.store.select(CarouselState.getItems);
  }

  ngOnInit(): void {

    this.store.dispatch([new getCarousel()]);
    this.carousel$.subscribe((carousel) => {
      this.carouselItems = carousel;
    });
  }

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end

}

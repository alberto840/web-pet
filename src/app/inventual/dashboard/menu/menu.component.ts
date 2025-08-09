import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { navbarDataVendedor } from './nav_data_vendedor';
import { navbarDataAdmin } from './nav-data-admin';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  rol: number = Number(localStorage.getItem('rolId')) || 0;
  userId: number = Number(localStorage.getItem('userId')) || 0;
  providerId: number = Number(localStorage.getItem('providerId')) || 0;
  userRol: string = localStorage.getItem('rolId') || '0';

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.userRol === '2') {
      this.navData = navbarDataVendedor;
    }
    if (this.userRol === '1') {
      this.navData = navbarDataAdmin;
    }
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  logout() {
    localStorage.removeItem('rolId');
    localStorage.removeItem('userId');
    localStorage.removeItem('idioma');
    localStorage.removeItem('correo');
    localStorage.removeItem('nombre');
    localStorage.removeItem('providerId');  
    localStorage.setItem('isLoggedIn', false.toString());
    this.router.navigate(['/']);
  }
}

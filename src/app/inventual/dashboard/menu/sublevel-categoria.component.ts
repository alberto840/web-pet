import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';

@Component({
  selector: 'app-sublevel-categoria',
  template: `
    <ul *ngIf="data.items && data.items.length > 0"
    [@submenu]="expanded
      ? {value: 'visible', 
          params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
      : {value: 'hidden', 
          params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
      class="sublevel-nav"
    >
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
          <a class="sublevel-nav-link"
            *ngIf="item.items && item.items.length > 0"
            [ngClass]="getActiveClass(item)"
          >
            <i class="sublevel-link-icon">
                      <div class="inventual-checkbox-field-style mb-5 pb-0.5">
                        <input type="checkbox" name="expired" id="expired">
                      </div>
                    </i>
            <span class="sublevel-link-text" @fadeInOut 
          (click)="handleClick(item)"
                >{{item.label}}</span>
            <i *ngIf="item.items" class="menu-collapse-icon"
          (click)="handleClick(item)"
              [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"
            ></i>
          </a>
          <a class="sublevel-nav-link"
            *ngIf="!item.items || (item.items && item.items.length === 0)"
          >
            <i class="sublevel-link-icon">
                      <div class="inventual-checkbox-field-style mb-5 pb-0.5">
                        <input type="checkbox" name="expired" id="expired">
                      </div>
                    </i>
            <span class="sublevel-link-text" @fadeInOut 
               >{{item.label}}</span>
          </a>
          <div *ngIf="item.items && item.items.length > 0">
            <app-sublevel-categoria
              [data]="item"
              [collapsed]="collapsed"
              [multiple]="multiple"
              [expanded]="item.expanded"
            ></app-sublevel-categoria>
          </div>
      </li>
    </ul>
  `,
  styleUrls: ['./menu.component.scss'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }),
      animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelCategoriaComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  handleClick(item: any): void {

    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(item: INavbarData): string {
    return item.expanded && this.router.url.includes(item.routeLink)
      ? 'active-sublevel'
      : '';
  }

}

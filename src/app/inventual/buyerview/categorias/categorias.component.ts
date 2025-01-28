import { Component, inject, OnInit } from '@angular/core';
import { fadeInOut, INavbarData } from '../../dashboard/menu/helper';
import { Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { CategoriaModel, mapCategoriesToNavbar, SubCategoriaModel, SubSubCategoriaModel } from '../../models/categoria.model';
import { Store } from '@ngxs/store';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { UtilsService } from '../../utils/utils.service';
import { SubcategoriaState } from '../../state-management/subcategoria/subcategoria.state';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { GetSubcategoria } from '../../state-management/subcategoria/subcategoria.action';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
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
})
export class CategoriasComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  subCatIsLoading$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  subSubCatIsLoading$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  categorias$: Observable<CategoriaModel[]>;
  subcategorias$: Observable<SubCategoriaModel[]>;
  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  categories: CategoriaModel[] = [];
  subcategories: SubCategoriaModel[] = [];
  subsubcategories: SubSubCategoriaModel[] = [];
  navData: INavbarData[] = [];
  multiple: boolean = false;

  constructor(public router: Router, private store: Store, public util: UtilsService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }
  ngOnInit(): void {
    this.store.dispatch([new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria()]);    
    combineLatest([this.categorias$, this.subcategorias$, this.subsubcategorias$])
      .pipe(
        map(([categorias, subcategorias, subsubcategorias]) => {
          this.categories = categorias;
          this.subcategories = subcategorias;
          this.subsubcategories = subsubcategorias;
          return mapCategoriesToNavbar(categorias, subcategorias, subsubcategorias);
        })
      )
      .subscribe((navData) => {
        this.navData = navData;
      });
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

}

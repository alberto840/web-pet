import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { tap, catchError, throwError, finalize } from "rxjs";
import { CarouselService } from "../../services/carousel.service";
import { AddCarousel, getCarousel } from "./carousel.action";
import { CarouselModel } from "../../models/carousel.model";

export interface CarouselStateModel {
    items: CarouselModel[];
    loading: boolean;
    error: string | null;
}
@State<CarouselStateModel>({
    name: 'carousel',
    defaults: {
        items: [],
        loading: false,
        error: null,
    },
})
@Injectable()
export class CarouselState {
    constructor(private carouselService: CarouselService) { }

    @Selector()
    static getItems(state: CarouselStateModel) {
        return state.items;
    }

    @Selector()
    static isLoading(state: CarouselStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: CarouselStateModel) {
        return state.error;
    }

    @Action(getCarousel)
    loadCarouselItems({ patchState }: StateContext<CarouselStateModel>) {
        patchState({ loading: true, error: null });

        return this.carouselService.getAllImages().pipe(
            tap((response) => {
                patchState({ items: response });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load carousel items: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }

    @Action(AddCarousel)
    addCarouselItem({ getState, patchState }: StateContext<CarouselStateModel>, { payload }: AddCarousel) {
        patchState({ loading: true, error: null });

        return this.carouselService.addImage(payload).pipe(
            tap((response) => {
                const state = getState();
                patchState({
                    items: [...state.items, response],
                });
            }),
            catchError((error) => {
                patchState({ error: `Failed to add carousel item: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}
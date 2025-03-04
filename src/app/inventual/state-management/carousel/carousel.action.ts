export class getCarousel {
    static readonly type = '[Carousel] Get Carousel';
}
export class AddCarousel {
    static readonly type = '[Carousel] Add Carousel';
    constructor(public payload: any) {}
}
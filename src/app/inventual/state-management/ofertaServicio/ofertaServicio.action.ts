export class GetOfertaServicio {
    static readonly type = '[OfertaServicio] Get OfertaServicio';
}

export class AddOfertaServicio {
    static readonly type = '[OfertaServicio] Add OfertaServicio';
    constructor(public payload: any) {}
}

export class UpdateOfertaServicio {
    static readonly type = '[OfertaServicio] Update OfertaServicio';
    constructor(public payload: any) {}
}

export class DeleteOfertaServicio {
    static readonly type = '[OfertaServicio] Delete OfertaServicio';
    constructor(public id: number) {}
}
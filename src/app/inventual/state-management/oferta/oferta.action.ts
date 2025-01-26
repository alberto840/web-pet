export class GetOferta {
    static readonly type = '[Oferta] Get Oferta';
}

export class AddOferta {
    static readonly type = '[Oferta] Add Oferta';
    constructor(public payload: any) {}
}

export class UpdateOferta {
    static readonly type = '[Oferta] Update Oferta';
    constructor(public payload: any) {}
}

export class DeleteOferta {
    static readonly type = '[Oferta] Delete Oferta';
    constructor(public id: number) {}
}
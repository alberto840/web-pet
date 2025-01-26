export class getCodigoDescuento {
    static readonly type = '[CodigoDescuento] Get CodigoDescuento';
}

export class AddCodigoDescuento {
    static readonly type = '[CodigoDescuento] Add CodigoDescuento';
    constructor(public payload: any) {}
}

export class UpdateCodigoDescuento {
    static readonly type = '[CodigoDescuento] Update CodigoDescuento';
    constructor(public payload: any) {}
}

export class DeleteCodigoDescuento {
    static readonly type = '[CodigoDescuento] Delete CodigoDescuento';
    constructor(public id: number) {}
}
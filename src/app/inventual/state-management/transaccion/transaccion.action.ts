export class GetTransaccion {
    static readonly type = '[Transaccion] Get Transaccion';
}

export class AddTransaccion {
    static readonly type = '[Transaccion] Add Transaccion';
    constructor(public payload: any) {}
}

export class UpdateTransaccion {
    static readonly type = '[Transaccion] Update Transaccion';
    constructor(public payload: any) {}
}

export class DeleteTransaccion {
    static readonly type = '[Transaccion] Delete Transaccion';
    constructor(public id: number) {}
}

export class GetTransaccionByProvider {
    static readonly type = '[Transaccion] Get Transaccion By Provider';
    constructor(public providerId: number) {}
}

export class GetTransaccionByUser {
    static readonly type = '[Transaccion] Get Transaccion By Usuario';
    constructor(public userId: number) {}
}
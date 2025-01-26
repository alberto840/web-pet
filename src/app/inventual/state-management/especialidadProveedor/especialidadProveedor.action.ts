export class GetEspecialidadProveedor {
    static readonly type = '[EspecialidadProveedor] Get EspecialidadProveedor';
}

export class AddEspecialidadProveedor {
    static readonly type = '[EspecialidadProveedor] Add EspecialidadProveedor';
    constructor(public payload: any) {}
}

export class UpdateEspecialidadProveedor {
    static readonly type = '[EspecialidadProveedor] Update EspecialidadProveedor';
    constructor(public payload: any) {}
}

export class DeleteEspecialidadProveedor {
    static readonly type = '[EspecialidadProveedor] Delete EspecialidadProveedor';
    constructor(public id: number) {}
}
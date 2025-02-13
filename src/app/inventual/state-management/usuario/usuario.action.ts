export class GetUsuario {
    static readonly type = '[Usuario] Get Usuario';
}

export class AddUsuario {
    static readonly type = '[Usuario] Add Usuario';
    constructor(public payload: any, public img: any) {}
}

export class UpdateUsuario {
    static readonly type = '[Usuario] Update Usuario';
    constructor(public payload: any, public img: any) {}
}

export class DeleteUsuario {
    static readonly type = '[Usuario] Delete Usuario';
    constructor(public id: number) {}
}

export class GetUsuarioById {
    static readonly type = '[Usuario] Get Usuario By Id';
    constructor(public id: number) {}
}   
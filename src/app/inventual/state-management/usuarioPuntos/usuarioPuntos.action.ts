export class getUsuarioPuntos {
    static readonly type = '[UsuarioPuntos] Get UsuarioPuntos';
}

export class addUsuarioPuntos {
    static readonly type = '[UsuarioPuntos] Add UsuarioPuntos';
    constructor(public payload: any) {}
}

export class updateUsuarioPuntos {
    static readonly type = '[UsuarioPuntos] Update UsuarioPuntos';
    constructor(public payload: any) {}
}

export class deleteUsuarioPuntos {
    static readonly type = '[UsuarioPuntos] Delete UsuarioPuntos';
    constructor(public id: number) {}
}
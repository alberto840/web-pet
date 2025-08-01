export class getMascota {
    static readonly type = '[Mascota] Get Mascota';
}

export class AddMascota {
    static readonly type = '[Mascota] Add Mascota';
    constructor(public payload: any, public img: any) {}
}

export class UpdateMascota {
    static readonly type = '[Mascota] Update Mascota';
    constructor(public payload: any, public img: any) {}
}

export class DeleteMascota {
    static readonly type = '[Mascota] Delete Mascota';
    constructor(public id: number) {}
}

export class GetMascotasByUser {
    static readonly type = '[Mascota] Get Mascota By User';
    constructor(public userId: number) {}
}
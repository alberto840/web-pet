export class GetSubsubcategoria {
    static readonly type = '[Subsubcategoria] Get Subsubcategoria';
}

export class AddSubsubcategoria {
    static readonly type = '[Subsubcategoria] Add Subsubcategoria';
    constructor(public payload: any) {}
}

export class UpdateSubsubcategoria {
    static readonly type = '[Subsubcategoria] Update Subsubcategoria';
    constructor(public payload: any) {}
}

export class DeleteSubsubcategoria {
    static readonly type = '[Subsubcategoria] Delete Subsubcategoria';
    constructor(public id: number) {}
}
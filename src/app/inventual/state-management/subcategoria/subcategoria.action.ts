export class GetSubcategoria {
    static readonly type = '[Subcategoria] Get Subcategoria';
}

export class AddSubcategoria {
    static readonly type = '[Subcategoria] Add Subcategoria';
    constructor(public payload: any) {}
}

export class UpdateSubcategoria {
    static readonly type = '[Subcategoria] Update Subcategoria';
    constructor(public payload: any) {}
}

export class DeleteSubcategoria {
    static readonly type = '[Subcategoria] Delete Subcategoria';
    constructor(public id: number) {}
}
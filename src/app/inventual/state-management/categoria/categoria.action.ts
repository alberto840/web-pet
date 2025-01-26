export class getCategorias {
    static readonly type = '[Categoria] Get Categorias';
}
export class AddCategoria {
    static readonly type = '[Categoria] Add Categoria';
    constructor(public payload: any) {}
}
export class UpdateCategoria {
    static readonly type = '[Categoria] Update Categoria';
    constructor(public payload: any) {}
}
export class DeleteCategoria {
    static readonly type = '[Categoria] Delete Categoria';
    constructor(public id: number) {}
}
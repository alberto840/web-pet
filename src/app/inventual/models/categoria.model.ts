export interface CategoriaModel {
    categoryId: number;
    nameCategory: string;
}

export interface SubSubCategoriaModel {
    subSubCategoriaId: number;
    nameSubSubCategoria: string;
    subCategoriaId:      number;
}

export interface SubCategoriaModel {
    subCategoriaId: number;
    nameSubCategoria: string;
    categoryId:      number;
}

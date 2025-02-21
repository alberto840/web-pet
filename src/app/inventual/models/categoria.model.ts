import { INavbarData } from "../dashboard/menu/helper";

export interface CategoriaModelString {
    categoryId?: number;
    nameCategory: string;
    icono: string;
}

export interface SubSubCategoriaModelString {
    subSubCategoriaId?: number;
    nameSubSubCategoria: string;
    subCategoriaId:      number;
    subCategoriaIdString:      string;
}

export interface SubCategoriaModelString {
    subCategoriaId?: number;
    nameSubCategoria: string;
    categoryId:      number;
    categoryIdString: string;
}

export interface CategoriaModel {
    categoryId?: number;
    nameCategory: string;
    icono: string;
}

export interface SubSubCategoriaModel {
    subSubCategoriaId?: number;
    nameSubSubCategoria: string;
    subCategoriaId:      number;
}

export interface SubCategoriaModel {
    subCategoriaId?: number;
    nameSubCategoria: string;
    categoryId:      number;
}

export function mapCategoriesToNavbar(
  categories: CategoriaModel[],
  subcategorias: SubCategoriaModel[],
  subsubcategorias: SubSubCategoriaModel[]
): INavbarData[] {
  // Mapear las categorías
  return categories.map((category) => {
    // Filtrar las subcategorías que pertenecen a esta categoría
    const subcategoriasFiltradas = subcategorias.filter(
      (subcategoria) => subcategoria.categoryId === category.categoryId
    );

    // Mapear las subcategorías a la estructura INavbarData
    const subcategoriasMapeadas = subcategoriasFiltradas.map((subcategoria) => {
      // Filtrar las subsubcategorías que pertenecen a esta subcategoría
      const subsubcategoriasFiltradas = subsubcategorias.filter(
        (subsubcategoria) => subsubcategoria.subCategoriaId === subcategoria.subCategoriaId
      );

      // Mapear las subsubcategorías a la estructura INavbarData
      const subsubcategoriasMapeadas = subsubcategoriasFiltradas.map((subsubcategoria) => ({
        routeLink: `${subsubcategoria.subSubCategoriaId}`, // Ruta única para la subsubcategoría
        label: subsubcategoria.nameSubSubCategoria, // Nombre de la subsubcategoría
      }));

      // Retornar la subcategoría con sus subsubcategorías
      return {
        routeLink: `${subcategoria.subCategoriaId}`, // Ruta única para la subcategoría
        label: subcategoria.nameSubCategoria, // Nombre de la subcategoría
        items: subsubcategoriasMapeadas.length > 0 ? subsubcategoriasMapeadas : undefined, // Subsubcategorías
      };
    });

    // Retornar la categoría con sus subcategorías
    return {
      routeLink: `${category.categoryId}`, // Ruta única para la categoría
      icon: category.icono, // Ícono de la categoría
      label: category.nameCategory, // Nombre de la categoría
      items: subcategoriasMapeadas.length > 0 ? subcategoriasMapeadas : undefined, // Subcategorías
    };
  });
}
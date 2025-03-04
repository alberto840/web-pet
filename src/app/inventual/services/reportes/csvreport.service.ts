import { Injectable } from '@angular/core';
import { CategoriaModel, SubCategoriaModelString, SubSubCategoriaModelString } from '../../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CsvreportService {

  constructor() { }

  ubicacionescsv(
    categorias: CategoriaModel[],
    subcategorias: SubCategoriaModelString[],
    subsubcategorias: SubSubCategoriaModelString[]
  ) {
    // Agregar el BOM (Byte Order Mark) para asegurar que el archivo sea UTF-8
    const BOM = "\uFEFF";
    // Definir los encabezados del CSV
    const headers = [
      'Categoría',
      'Subcategoría',
      'Subsubcategoría',
      'Icono',
    ];
  
    // Crear el contenido del CSV
    const csvData = [headers.join(',')];
  
    // Recorrer las categorías
    categorias.forEach(categoria => {
      // Filtrar las subcategorías que pertenecen a esta categoría
      const subcategoriasFiltradas = subcategorias.filter(sub => sub.categoryId === categoria.categoryId);
      if (subcategoriasFiltradas.length === 0) {
        // Si no hay subcategorías, agregar una fila con la categoría y campos vacíos
        csvData.push([
          categoria.nameCategory,
          '', // Subcategoría vacía
          '', // Subsubcategoría vacía
          categoria.icono,
        ].join(','));
      } else {
        // Recorrer las subcategorías filtradas
        subcategoriasFiltradas.forEach(subcategoria => {
          // Filtrar las subsubcategorías que pertenecen a esta subcategoría
          const subsubcategoriasFiltradas = subsubcategorias.filter(subsub => subsub.subCategoriaId === subcategoria.subCategoriaId);
          if (subsubcategoriasFiltradas.length === 0) {
            // Si no hay subsubcategorías, agregar una fila con la categoría, subcategoría y campos vacíos
            csvData.push([
              categoria.nameCategory,
              subcategoria.nameSubCategoria,
              '', // Subsubcategoría vacía
              categoria.icono,
            ].join(','));
          } else {
            // Recorrer las subsubcategorías filtradas
            subsubcategoriasFiltradas.forEach(subsubcategoria => {
              // Agregar una fila con la categoría, subcategoría y subsubcategoría
              csvData.push([
                categoria.nameCategory,
                subcategoria.nameSubCategoria,
                subsubcategoria.nameSubSubCategoria,
                categoria.icono,
              ].join(','));
            });
          }
        });
      }
    });

    // Agregar el BOM al inicio del contenido del CSV
    const csvContent = BOM + csvData;
  
    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categorias.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  generateCSV<T>(
    list: T[],
    headers: string[],
    fileName: string,
    fields: (keyof T)[]
  ): void {
    // Agregar el BOM (Byte Order Mark) para asegurar que el archivo sea UTF-8
    const BOM = "\uFEFF";
    const csvData = [
      headers.join(','),
      ...list.map((objeto) => {
        return fields
          .map((field) => {
            const value = objeto[field];
            return value === null || value === undefined ? '' : value;
          })
          .join(',');
      }),
    ].join('\n');

    // Agregar el BOM al inicio del contenido del CSV
    const csvContent = BOM + csvData;

    // Crear el Blob con el tipo correcto
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

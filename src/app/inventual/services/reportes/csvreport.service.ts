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
  
    // Crear y descargar el archivo CSV
    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
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
  
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

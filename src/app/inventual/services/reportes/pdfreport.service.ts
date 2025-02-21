import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable, { CellInput } from 'jspdf-autotable';
import { CategoriaModel, SubCategoriaModelString, SubSubCategoriaModelString } from '../../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class PdfreportService {

  constructor() { }  

categoriaspdf(
  categorias: CategoriaModel[],
  subcategorias: SubCategoriaModelString[],
  subsubcategorias: SubSubCategoriaModelString[]
) {
  // Crear una instancia de jsPDF
  const doc = new jsPDF('l', 'mm', [297, 210]);
  doc.text('Informe de Categorías generado: ' + new Date().toLocaleString(), 10, 10);

  // Definir las columnas para cada tabla
  const categoriaColumns = ['ID', 'Nombre', 'Icono'];
  const subcategoriaColumns = ['ID', 'Nombre', 'Categoría'];
  const subsubcategoriaColumns = ['ID', 'Nombre', 'Subcategoría'];

  // Mapear los datos para cada tabla
  const categoriaData = categorias.map((categoria) => [
    categoria.categoryId ?? '',
    categoria.nameCategory ?? '',
    categoria.icono ?? '',
  ]);

  const subcategoriaData = subcategorias.map((subcategoria) => {
    const categoria = categorias.find(cat => cat.categoryId === subcategoria.categoryId);
    return [
      subcategoria.subCategoriaId ?? '',
      subcategoria.nameSubCategoria ?? '',
      categoria ? categoria.nameCategory : 'Sin Categoría',
    ];
  });

  const subsubcategoriaData = subsubcategorias.map((subsubcategoria) => {
    const subcategoria = subcategorias.find(sub => sub.subCategoriaId === subsubcategoria.subCategoriaId);
    return [
      subsubcategoria.subSubCategoriaId ?? '',
      subsubcategoria.nameSubSubCategoria ?? '',
      subcategoria ? subcategoria.nameSubCategoria : 'Sin Subcategoría',
    ];
  });

  // Posición inicial para la primera tabla
  let yOffset = 20;

  // Tabla de Categorías
  doc.text('Categorías', 10, yOffset);
  autoTable(doc, {
    head: [categoriaColumns],
    body: categoriaData,
    startY: yOffset + 5,
  });

  // Actualizar la posición Y para la siguiente tabla
  yOffset = (doc as any).autoTable.previous.finalY + 10;

  // Tabla de Subcategorías
  doc.text('Subcategorías', 10, yOffset);
  autoTable(doc, {
    head: [subcategoriaColumns],
    body: subcategoriaData,
    startY: yOffset + 5,
  });

  // Actualizar la posición Y para la siguiente tabla
  yOffset = (doc as any).autoTable.previous.finalY + 10;

  // Tabla de Subsubcategorías
  doc.text('Subsubcategorías', 10, yOffset);
  autoTable(doc, {
    head: [subsubcategoriaColumns],
    body: subsubcategoriaData,
    startY: yOffset + 5,
  });

  // Guardar el PDF
  doc.save('informe-categorias.pdf');
}
generatePDF<T>(
  list: T[],
  columns: string[],
  fileName: string,
  fields: (keyof T)[],
  title ?: string,
  orientation: 'p' | 'l' = 'p',
    pageSize: [number, number] = [297, 210]
  ): void {
  // Crear una instancia de jsPDF
  const doc = new jsPDF(orientation, 'mm', pageSize);

  // Agregar un título al PDF (si se proporciona)
  if(title) {
    doc.text(title, 10, 10);
  }

    // Mapear los datos de la lista a un formato compatible con autoTable
    const data = list.map((item) => {
    return fields.map((field) => item[field] as CellInput);
  });

  // Generar la tabla con autoTable
  autoTable(doc, {
    head: [columns], // Encabezados de la tabla
    body: data, // Datos de la tabla
  });

    // Guardar el PDF
    doc.save(fileName);
}
}

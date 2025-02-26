import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';
import { EspecialidadProveedorModel, ProveedorModel } from '../models/proveedor.model';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { EspecialidadModel } from '../models/especialidad.model';
import { CategoriaModel } from '../models/categoria.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private http: HttpClient, public router: Router) { }
  //String a icono
  getIconByName(str: string): string {
    const icon = StringToIcons.find((item: Icons) => item.name === str);
    return icon ? icon.icon : '';
  }

  getBestProvidersServices(providers: ProveedorModel[]): ProveedorModel[] {
    // Ordenar de mayor a menor rating
    return providers.sort((a, b) => b.rating - a.rating);
  }

  getImgUrlProvider(providers: ProveedorModel[], serviceId: number): string {
    const provider = providers.find(provider => provider.providerId === serviceId);
    return provider ? provider.imageUrl ?? '' : '';
  }

  getCategory(categories: CategoriaModel[], categoryId: number): CategoriaModel {
    if(categoryId === 0){
      throw new Error(`Category Id not found`);
    }
    if(categories.length === 0){
      throw new Error('Categories not found');
    }
    const category = categories.find(category => category.categoryId === categoryId);
    if (!category) {
      throw new Error(`Category Id ${categoryId} not found`);
    }
    return category;
    
    
  }

  getUsuarioLocationByServiceId(providers: ProveedorModel[], usuarios: UsuarioModel[], providerIdByServicio: number): string {
    const provider = providers.find(provider => provider.providerId === providerIdByServicio);
    const usuario = usuarios.find(usuario => usuario.userId === provider?.userId);
    return usuario ? usuario.location : "";
  }

  getUsuarioLocationByProductId(providers: ProveedorModel[], usuarios: UsuarioModel[], providerIdByProducto: number): string {
    const provider = providers.find(provider => provider.providerId === providerIdByProducto);
    const usuario = usuarios.find(usuario => usuario.userId === provider?.userId);
    return usuario ? usuario.location : "";
  }

  getSpecialityByProviderId(providersSpeciality: EspecialidadProveedorModel[], providerId: number, especialidades: EspecialidadModel[]): string {
    const relation = providersSpeciality.find(relation => relation.providerId === providerId);
    const especialidad = especialidades.find(especialidad => especialidad.specialtyId === relation?.specialtyId);
    return especialidad ? especialidad.nameSpecialty : '';
  }

  getRolNameById(rolId: number): string {
    switch (rolId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Proveedor';
      case 3:
        return 'Cliente';
      default:
        return '';
    }
  }

  async urlToFile(url: string, fileName: string): Promise<File> {
    // Realiza una solicitud HTTP para obtener el contenido del archivo
    const response = await this.http.get(url, { responseType: 'blob' }).toPromise();

    // Verifica que la respuesta no sea undefined
    if (!response) {
      throw new Error('No se pudo obtener el archivo desde la URL.');
    }

    // Crea un objeto File a partir del Blob
    const file = new File([response], fileName, { type: 'image/*' });

    return file; // Retorna el archivo directamente
  }

  navigateToProductDetail(productId: number) {
    this.router.navigate(['/producto', productId]);
  }
  navigateToServiceDetail(serviceId: number) {
    this.router.navigate(['/servicio', serviceId]);
  }
  navigatetoProviderDetail(providerId: number) {
    this.router.navigate(['/perfilprovider', providerId]);
  }
  navigateToProfile(userId: number) {
    this.router.navigate(['/perfil', userId]);
  }

}

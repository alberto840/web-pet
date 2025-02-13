import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';
import { ProveedorModel } from '../models/proveedor.model';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private http: HttpClient) { }
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

}

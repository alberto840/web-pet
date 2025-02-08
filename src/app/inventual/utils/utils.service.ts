import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';
import { ProveedorModel } from '../models/proveedor.model';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

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

}

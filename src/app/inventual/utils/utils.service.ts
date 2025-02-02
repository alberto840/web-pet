import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';
import { ProveedorModel } from '../models/proveedor.model';

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


}

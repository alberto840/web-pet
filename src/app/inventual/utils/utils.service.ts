import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  //String a icono
  getIconByName(str: string): string {
    const icon = StringToIcons.find((item: Icons) => item.name === str);
    return icon ? icon.icon : '';
  }


}

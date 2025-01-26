import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtdecoderService {

  constructor() { }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);  // Decodifica el payload del JWT
    } catch (Error) {
      console.error('Error decodificando el token', Error);
      return null;
    }
  }
}

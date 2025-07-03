import { Injectable } from '@angular/core';
import { Icons, StringToIcons } from './icon_data';
import { EspecialidadProveedorModel, ProveedorModel } from '../models/proveedor.model';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { EspecialidadModel } from '../models/especialidad.model';
import { CategoriaModel } from '../models/categoria.model';
import { Router } from '@angular/router';
import { NotificacionModel } from '../models/notificacion.model';
import { AddNotificacion } from '../state-management/notificacion/notificacion.action';
import { Store } from '@ngxs/store';
import { ActividadesModel } from '../models/actividades.model';
import { AddActividad } from '../state-management/actividad/actividad.action';
import { firstValueFrom, Observable } from 'rxjs';
import { ProviderByIdState } from '../state-management/proveedor/proveedorById.state';
import { GetProveedorById } from '../state-management/proveedor/proveedor.action';
import { UsuarioByIdState } from '../state-management/usuario/usuarioById.state';
import { GetServicioById } from '../state-management/servicio/servicio.action';
import { ServiceByIdState } from '../state-management/servicio/servicioById.state';
import { ProductoModel, ServicioModel } from '../models/producto.model';
import { ProductByIdState } from '../state-management/producto/productoById.state';
import { GetProductoById } from '../state-management/producto/producto.action';
import { GetUsuarioById } from '../state-management/usuario/usuario.action';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  userId = localStorage.getItem('userId') || '';
  constructor(private http: HttpClient, public router: Router, private store: Store) { }

  // Obtener la dirección IP
  async getIPAddress(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ip: string}>("https://api.ipify.org/?format=json")
      );
      return response.ip;
    } catch (error) {
      console.error('Error al obtener la IP:', error);
      return '0.0.0.0'; // Valor por defecto en caso de error
    }
  }

  getProviderRating(providerId: number): number {
    const provider = this.store.selectSnapshot(ProviderByIdState.getProveedorById);
    if (provider && provider.providerId === providerId) {
      return provider.rating;
    }
    return 0; // Valor por defecto si no se encuentra el proveedor
  }
    

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

  getVerifiedProvider(providers: ProveedorModel[], serviceId: number): boolean {
    const provider = providers.find(provider => provider.providerId === serviceId);
    return provider ? (provider.verified ?? false) : false;
  }

  getCategory(categories: CategoriaModel[], categoryId: number): CategoriaModel {
    if (categoryId === 0) {
      throw new Error(`Category Id not found`);
    }
    if (categories.length === 0) {
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

  /// Notificaciones
  enviarNotificacion(message: string, notificationType: string, userId: number) {
    const notificacion: NotificacionModel = {
      message: message,
      notificationType: notificationType,
      isRead: false,
      userId: userId
    };
    this.store.dispatch(new AddNotificacion(notificacion)).subscribe({
      next: () => {
        console.log('Notificacion enviada:', notificacion);
      },
      error: (error) => {
        console.error('Error al enviar notificacion:', error);
      },
    });
  }

  /// Registro Actividades
  async registrarActividad(action: string, description: string) {
    const actividad: ActividadesModel = {
      userId: Number(this.userId),
      action: action,
      description: description,
      ip: await this.getIPAddress(),
      createdAt: new Date()
    }
    this.store.dispatch(new AddActividad(actividad)).subscribe({
      next: () => {
        console.log('Actividad registrada correctamente:', actividad);
      },
      error: (error) => {
        console.error('Error al registrar actividad:', error);
      },
    });
  }

  // Get Provider
  getProviderById(providerId: number): Observable<ProveedorModel>{
    this.store.dispatch(new GetProveedorById(providerId));
    return this.store.select(ProviderByIdState.getProveedorById);
  }

  // Get User
  getUserById(userId: number): Observable<UsuarioModel>{
    this.store.dispatch(new GetUsuarioById(userId));
    return this.store.select(UsuarioByIdState.getUsuarioById);
  }

  // Get Service
  getServiceById(serviceId: number): Observable<ServicioModel>{
    this.store.dispatch(new GetServicioById(serviceId));
    return this.store.select(ServiceByIdState.getServiceById);
  }

  // Get Product
  getProductById(productId: number): Observable<ProductoModel> {
    this.store.dispatch(new GetProductoById(productId));
    return this.store.select(ProductByIdState.getProductById);
  }
}

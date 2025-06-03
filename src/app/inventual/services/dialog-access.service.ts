import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateMastcotaComponent } from './dialogs/create-mastcota/create-mastcota.component';
import { CreateProductComponent } from './dialogs/create-product/create-product.component';
import { RegistroProveedorComponent } from './dialogs/registro-proveedor/registro-proveedor.component';
import { DeleteConfirmComponent } from './dialogs/delete-confirm/delete-confirm.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { CreateServicioComponent } from './dialogs/create-servicio/create-servicio.component';
import { ConfirmarCompraComponent } from './dialogs/confirmar-compra/confirmar-compra.component';
import { AfterCompraComponent } from './dialogs/after-compra/after-compra.component';
import { ReporteComponent } from './dialogs/reporte/reporte.component';
import { CalificacionComponent } from './dialogs/calificacion/calificacion.component';
import { CodigoDescuentoModel, ProductoModel, ServicioModel, TransaccionModel } from '../models/producto.model';
import { AgendarComponent } from './dialogs/agendar/agendar.component';
import { AfterAgendarComponent } from './dialogs/after-agendar/after-agendar.component';
import { ComfirmarAgendaComponent } from './dialogs/comfirmar-agenda/comfirmar-agenda.component';
import { CategoriaModel, SubCategoriaModel, SubSubCategoriaModel } from '../models/categoria.model';
import { ActualizarCategoriaComponent } from './dialogs/actualizadores/actualizar-categoria/actualizar-categoria.component';
import { ActualizarProductosComponent } from './dialogs/actualizadores/actualizar-productos/actualizar-productos.component';
import { ActualizarServicioComponent } from './dialogs/actualizadores/actualizar-servicio/actualizar-servicio.component';
import { ActualizarsubCategoriaComponent } from './dialogs/actualizadores/actualizarsub-categoria/actualizarsub-categoria.component';
import { ActualizarsubsubCategoriaComponent } from './dialogs/actualizadores/actualizarsubsub-categoria/actualizarsubsub-categoria.component';
import { ActualizarCodigoPromoComponent } from './dialogs/actualizadores/actualizar-codigo-promo/actualizar-codigo-promo.component';
import { EspecialidadModel } from '../models/especialidad.model';
import { ActualizarEspecialidadesComponent } from './dialogs/actualizadores/actualizar-especialidades/actualizar-especialidades.component';
import { ProveedorModel, ResenaModel } from '../models/proveedor.model';
import { ActualizarProvidersComponent } from './dialogs/actualizadores/actualizar-providers/actualizar-providers.component';
import { ActualizarReviewsComponent } from './dialogs/actualizadores/actualizar-reviews/actualizar-reviews.component';
import { TicketModel } from '../models/ticket.model';
import { ActualizarTicketComponent } from './dialogs/actualizadores/actualizar-ticket/actualizar-ticket.component';
import { UsuarioModel } from '../models/usuario.model';
import { ActualizarUsuarioComponent } from './dialogs/actualizadores/actualizar-usuario/actualizar-usuario.component';
import { InhabilitarUsuarioComponent } from './dialogs/actualizadores/inhabilitar-usuario/inhabilitar-usuario.component';
import { ActualizarOfertaProductoComponent } from './dialogs/actualizadores/actualizar-oferta-producto/actualizar-oferta-producto.component';
import { ActualizarOfertaServicioComponent } from './dialogs/actualizadores/actualizar-oferta-servicio/actualizar-oferta-servicio.component';
import { ActualizarTransaccionComponent } from './dialogs/actualizadores/actualizar-transaccion/actualizar-transaccion.component';
export interface DialogData {
}
@Injectable({
  providedIn: 'root'
})
export class DialogAccessService {

  constructor(public dialog: MatDialog) {}

  createMascota(): void {
    this.dialog.open(CreateMastcotaComponent, {
    });
  }

  createProduct(): void {
    this.dialog.open(CreateProductComponent, {
    });
  }

  createServicio(): void {
    this.dialog.open(CreateServicioComponent, {
    });
  }

  registroProveedor(): void {
    this.dialog.open(RegistroProveedorComponent, {
    });
  }

  confirmarCompra(): void {
    this.dialog.open(ConfirmarCompraComponent, {
    });
  }

  confirmarAgenda(service: ServicioModel): void {
    this.dialog.open(ComfirmarAgendaComponent, {      
      data: service,
    });
  }

  afterCompra(): void {
    this.dialog.open(AfterCompraComponent, {
    });
  } 

  afterAgendar() {
    this.dialog.open(AfterAgendarComponent, {
    });
  }

  logOut(): void {
    this.dialog.open(LogoutComponent, {
    });
  }

  crearTicket(): void {
    this.dialog.open(ReporteComponent, {
    });
  }

  crearReview(providerId: number, transaccion: TransaccionModel): void {
    this.dialog.open(CalificacionComponent, {
      data: {providerId, transaccion},
    });
  }

  agendar(servicio: ServicioModel): void {
    this.dialog.open(AgendarComponent, {
      data: servicio,
    });
  }  

  //Funciones para eliminar
  eliminarElemento(idelemento: number, tipo: string, idAux?: number): void {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        idelemento,
        tipo,
        idAux
      },
    });
  }

  //funciones para actualizar
  actualizarCategoria(categoria: CategoriaModel): void {
    this.dialog.open(ActualizarCategoriaComponent, {
      data: categoria
    });
  }

  actualizarsubCategoria(subcategoria: SubCategoriaModel): void {
    this.dialog.open(ActualizarsubCategoriaComponent, {
      data: subcategoria
    });
  }

  actualizarsubsubCategoria(subsubcategoria: SubSubCategoriaModel): void {
    this.dialog.open(ActualizarsubsubCategoriaComponent, {
      data: subsubcategoria
    });
  }

  actualizarProducto(producto: ProductoModel): void {
    this.dialog.open(ActualizarProductosComponent, {
      data: producto
    });
  }

  actualizarServicio(servicio: ServicioModel): void {
    this.dialog.open(ActualizarServicioComponent, {
      data: servicio
    });
  }

  actualizarCodigo(codigo: CodigoDescuentoModel): void {
    this.dialog.open(ActualizarCodigoPromoComponent, {
      data: codigo
    });
  }

  actualizarEspecialidad(especialidad: EspecialidadModel): void {
    this.dialog.open(ActualizarEspecialidadesComponent, {
      data: especialidad
    });
  }

  actualizarProveedor(proveedor: ProveedorModel): void {
    this.dialog.open(ActualizarProvidersComponent, {
      data: proveedor
    });
  }

  actualizarReviews(review: ResenaModel): void {
    this.dialog.open(ActualizarReviewsComponent, {
      data: review
    });
  }

  actualizarTickets(ticket: TicketModel, status: string): void {
    let ticketAux: TicketModel = ticket;
    ticketAux.status = status;
    this.dialog.open(ActualizarTicketComponent, 
      {
      data: ticketAux
    });
  }

  actualizarTransaccion(transaccion: TransaccionModel, status: string): void {
    let transaccionAux: TransaccionModel = transaccion;
    transaccionAux.status = status;
    this.dialog.open(ActualizarTransaccionComponent, {
      data: transaccionAux
    });
  }

  actualizarUsuario(usuario: UsuarioModel): void {
    this.dialog.open(ActualizarUsuarioComponent, {
      data: usuario
    });
  }

  actualizarOfertaProducto(producto: ProductoModel, estado: boolean): void {
    let productoAux: ProductoModel = producto;
    productoAux.isOnSale = estado;
    this.dialog.open(ActualizarOfertaProductoComponent, {
      data: productoAux
    });
  }

  actualizarOfertaServicio(servicio: ServicioModel, estado: boolean): void {
    let servicioAux: ServicioModel = servicio;
    servicioAux.onSale = estado;
    this.dialog.open(ActualizarOfertaServicioComponent, {
      data: servicioAux
    });
  }

  inhabilitarUsuario(usuario: UsuarioModel): void {
    this.dialog.open(InhabilitarUsuarioComponent, {
      data: usuario
    });
  }
}

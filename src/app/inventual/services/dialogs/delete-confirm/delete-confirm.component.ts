import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { DialogAccessService, DialogData } from '../../dialog-access.service';
import { DeleteCodigoDescuento } from 'src/app/inventual/state-management/codigoDescuento/codigoDescuento.action';
import { DeleteEspecialidad } from 'src/app/inventual/state-management/especialidad/especialidad.action';
import { DeleteProducto, GetProductoById, UpdateProducto } from 'src/app/inventual/state-management/producto/producto.action';
import { DeleteProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { DeleteResena } from 'src/app/inventual/state-management/resena/resena.action';
import { DeleteServicio, GetServicioById, UpdateServicio } from 'src/app/inventual/state-management/servicio/servicio.action';
import { DeleteTicket } from 'src/app/inventual/state-management/ticket/ticket.action';
import { DeleteUsuario } from 'src/app/inventual/state-management/usuario/usuario.action';
import { DeleteCategoria } from 'src/app/inventual/state-management/categoria/categoria.action';
import { DeleteSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { DeleteSubsubcategoria } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.action';
import { DeleteOferta } from 'src/app/inventual/state-management/oferta/oferta.action';
import { DeleteOfertaProducto } from 'src/app/inventual/state-management/ofertaProducto/ofertaProducto.action';
import { DeleteOfertaServicio } from 'src/app/inventual/state-management/ofertaServicio/ofertaServicio.action';
import { ProductByIdState } from 'src/app/inventual/state-management/producto/productoById.state';
import { ServiceByIdState } from 'src/app/inventual/state-management/servicio/servicioById.state';
import { ProductoModel, ServicioModel } from 'src/app/inventual/models/producto.model';
import { UtilsService } from 'src/app/inventual/utils/utils.service';
import { DeleteReserva } from 'src/app/inventual/state-management/reserva/reserva.action';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(private store: Store, private dialog: MatDialog, private utils: UtilsService,
    public dialogRef: MatDialogRef<DeleteConfirmComponent>, public dialogsService: DialogAccessService,
    @Inject(MAT_DIALOG_DATA) public data: { idelemento: number, tipo: string, idAux?: number }, private _snackBar: MatSnackBar) { }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
  ngOnInit(): void {
  }

  eliminarElemento(id: number, tipo: string, idAux?: number) {
    switch (tipo) {
      case 'Usuario':
        this.eliminarUsuario(id);
        break;
      case 'Producto':
        this.eliminarProducto(id);
        break;
      case 'Proveedor':
        this.eliminarProveedor(id);
        break;
      case 'Review':
        this.eliminarReview(id);
        break;
      case 'Servicio':
        this.eliminarServicio(id);
        break;
      case 'Ticket':
        this.eliminarTicket(id);
        break;
      case 'Especialidad':
        this.eliminarEspecialidad(id);
        break;
      case 'Categoria':
        this.eliminarCategoria(id);
        break;
      case 'SubCategoria':
        this.eliminarSubCategoria(id);
        break;
      case 'SubSubCategoria':
        this.eliminarSubSubCategoria(id);
        break;
      case 'CodigoPromocion':
        this.eliminarCodigoPromocion(id);
        break;
      case 'Oferta':
        this.eliminarOferta(id);
        break;
      case 'OfertaProducto':
        this.eliminarOfertaProducto(id, (idAux ?? 0));
        break;
      case 'OfertaServicio':
        this.eliminarOfertaServicio(id, (idAux ?? 0));
        break;
      case 'Reserva':
        this.eliminarReserva(id);
        break;
      default:
        break;
    }
    this.cerrarDialog();
  }

  cancelar() {
    this.cerrarDialog();
    this.openSnackBar('Operación cancelada', 'Cerrar');
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }

  eliminarCodigoPromocion(id: number) {
    this.store.dispatch(new DeleteCodigoDescuento(id)).subscribe({
      next: () => {
        console.log('Código de promoción eliminado exitosamente');
        this.openSnackBar('Código de promoción eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar código de promoción:', error);
        this.openSnackBar('El código de promoción no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarEspecialidad(id: number) {
    this.store.dispatch(new DeleteEspecialidad(id)).subscribe({
      next: () => {
        console.log('Especialidad eliminada exitosamente');
        this.openSnackBar('Especialidad eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar especialidad:', error);
        this.openSnackBar('La especialidad no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarProducto(id: number) {
    this.store.dispatch(new DeleteProducto(id)).subscribe({
      next: () => {
        console.log('Producto eliminado exitosamente');
        this.openSnackBar('Producto eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.openSnackBar('El producto no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarProveedor(id: number) {
    this.store.dispatch(new DeleteProveedor(id)).subscribe({
      next: () => {
        console.log('Proveedor eliminado exitosamente');
        this.openSnackBar('Proveedor eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar proveedor:', error);
        this.openSnackBar('El proveedor no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarReview(id: number) {
    this.store.dispatch(new DeleteResena(id)).subscribe({
      next: () => {
        console.log('Review eliminado exitosamente');
        this.openSnackBar('Review eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar review:', error);
        this.openSnackBar('El review no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarServicio(id: number) {
    this.store.dispatch(new DeleteServicio(id)).subscribe({
      next: () => {
        console.log('Servicio eliminado exitosamente');
        this.openSnackBar('Servicio eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.openSnackBar('El servicio no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarTicket(id: number) {
    this.store.dispatch(new DeleteTicket(id)).subscribe({
      next: () => {
        console.log('Ticket eliminado exitosamente');
        this.openSnackBar('Ticket eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar ticket:', error);
        this.openSnackBar('El ticket no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarUsuario(id: number) {
    this.store.dispatch(new DeleteUsuario(id)).subscribe({
      next: () => {
        console.log('Usuario eliminado exitosamente');
        this.openSnackBar('Usuario eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.openSnackBar('El usuario no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarCategoria(id: number) {
    this.store.dispatch(new DeleteCategoria(id)).subscribe({
      next: () => {
        console.log('Categoria eliminada exitosamente');
        this.openSnackBar('Categoria eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar categoria:', error);
        this.openSnackBar('La categoria no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarSubCategoria(id: number) {
    this.store.dispatch(new DeleteSubcategoria(id)).subscribe({
      next: () => {
        console.log('SubCategoria eliminada exitosamente');
        this.openSnackBar('SubCategoria eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar subcategoria:', error);
        this.openSnackBar('La subcategoria no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarSubSubCategoria(id: number) {
    this.store.dispatch(new DeleteSubsubcategoria(id)).subscribe({
      next: () => {
        console.log('SubSubCategoria eliminada exitosamente');
        this.openSnackBar('SubSubCategoria eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar subsubcategoria:', error);
        this.openSnackBar('La subsubcategoria no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarOferta(id: number) {
    this.store.dispatch(new DeleteOferta(id)).subscribe({
      next: () => {
        console.log('Oferta eliminada exitosamente');
        this.openSnackBar('Oferta eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar oferta:', error);
        this.openSnackBar('La oferta no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarReserva(id: number) {
    this.store.dispatch(new DeleteReserva(id)).subscribe({
      next: () => {
        console.log('Reserva eliminada exitosamente');
        this.openSnackBar('Reserva eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar reserva:', error);
        this.openSnackBar('La reserva no se pudo eliminar', 'Cerrar');
      }
    });
  }

  async eliminarOfertaProducto(id: number, productoId: number) {
    let auxProducto: ProductoModel;
    console.log('Eliminando ofertaProducto con id:', id);
    console.log('ProductoId:', productoId);
    await this.store.dispatch([new GetProductoById(productoId)]);
    this.store.dispatch(new DeleteOfertaProducto(id)).subscribe({
      next: async () => {
        console.log('OfertaProducto eliminada exitosamente');
        await this.store.select(ProductByIdState.getProductById)
          .pipe()
          .subscribe(async (producto) => {
              console.log('Producto encontrado:', producto);
              auxProducto = producto;
          });
        await this.actualizarProducto(auxProducto);
        this.openSnackBar('OfertaProducto eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar ofertaProducto:', error);
        this.openSnackBar('La ofertaProducto no se pudo eliminar', 'Cerrar');
      }
    });
  }

  async eliminarOfertaServicio(id: number, servicioId: number) {
    let auxServicio: ServicioModel;
    await this.store.dispatch([new GetServicioById(servicioId)]);
    this.store.dispatch(new DeleteOfertaServicio(id)).subscribe({
      next: async () => {
        console.log('OfertaServicio eliminada exitosamente');
        this.store.select(ServiceByIdState.getServiceById)
          .pipe()
          .subscribe(async (servicio) => {
            console.log('Servicio encontrado:', servicio);
            auxServicio = servicio;
          });
        await this.actualizarServicio(auxServicio);
        this.openSnackBar('OfertaServicio eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar ofertaServicio:', error);
        this.openSnackBar('La ofertaServicio no se pudo eliminar', 'Cerrar');
      }
    });
  }

  async actualizarProducto(producto: ProductoModel) {
    let auxProducto: ProductoModel = {
      productId: producto.productId,
      name: producto.name,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
      status: true,
      providerId: producto.providerId,
      categoryId: producto.categoryId,
      subSubCategoriaId: producto.subSubCategoriaId,
      isOnSale: false
    }
    console.log('Producto a actualizar:', auxProducto);
    let file: File | null = null;
    await this.utils.urlToFile((producto.imageUrl || ''), 'default' + producto.productId).then((file) => {
      file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });

    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateProducto(auxProducto, file)).subscribe({
      next: () => {
        console.log('Producto actualizado correctamente:', auxProducto);
        this.openSnackBar('Producto actualizado correctamente', 'Cerrar');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al actualizar Producto:', error);
        this.openSnackBar('Error en el actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  async actualizarServicio(servicio: ServicioModel) {
    let auxServicio: ServicioModel = {
      serviceId: servicio.serviceId,
      serviceName: servicio.serviceName,
      price: servicio.price,
      duration: servicio.duration,
      description: servicio.description,
      status: true,
      providerId: servicio.providerId,
      imageId: servicio.imageId,
      tipoAtencion: servicio.tipoAtencion,
      categoryId: servicio.categoryId,
      onSale: false,
    }
    let file: File | null = null;
    await this.utils.urlToFile((servicio.imageUrl || ''), 'default' + servicio.imageId).then((file) => {
      file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });


    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateServicio(auxServicio, file)).subscribe({
      next: () => {
        console.log('Servicio registrado correctamente:', servicio);
        this.openSnackBar('Servicio registrado correctamente', 'Cerrar');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al registrar Servicio:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
}

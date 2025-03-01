import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { DialogData } from '../../dialog-access.service';
import { DeleteCodigoDescuento } from 'src/app/inventual/state-management/codigoDescuento/codigoDescuento.action';
import { DeleteEspecialidad } from 'src/app/inventual/state-management/especialidad/especialidad.action';
import { DeleteProducto } from 'src/app/inventual/state-management/producto/producto.action';
import { DeleteProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { DeleteResena } from 'src/app/inventual/state-management/resena/resena.action';
import { DeleteServicio } from 'src/app/inventual/state-management/servicio/servicio.action';
import { DeleteTicket } from 'src/app/inventual/state-management/ticket/ticket.action';
import { DeleteUsuario } from 'src/app/inventual/state-management/usuario/usuario.action';
import { DeleteCategoria } from 'src/app/inventual/state-management/categoria/categoria.action';
import { DeleteSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { DeleteSubsubcategoria } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.action';
import { DeleteOferta } from 'src/app/inventual/state-management/oferta/oferta.action';
import { DeleteOfertaProducto } from 'src/app/inventual/state-management/ofertaProducto/ofertaProducto.action';
import { DeleteOfertaServicio } from 'src/app/inventual/state-management/ofertaServicio/ofertaServicio.action';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(private store: Store, private dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idelemento: number, tipo: string }, private _snackBar: MatSnackBar) { }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
  ngOnInit(): void {
  }

  eliminarElemento(id: number, tipo: string) {
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
        this.eliminarOfertaProducto(id);
        break;
      case 'OfertaServicio':
        this.eliminarOfertaServicio(id);
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

  eliminarOfertaProducto(id: number) {
    this.store.dispatch(new DeleteOfertaProducto(id)).subscribe({
      next: () => {
        console.log('OfertaProducto eliminada exitosamente');
        this.openSnackBar('OfertaProducto eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar ofertaProducto:', error);
        this.openSnackBar('La ofertaProducto no se pudo eliminar', 'Cerrar');
      }
    });
  }

  eliminarOfertaServicio(id: number) {
    this.store.dispatch(new DeleteOfertaServicio(id)).subscribe({
      next: () => {
        console.log('OfertaServicio eliminada exitosamente');
        this.openSnackBar('OfertaServicio eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar ofertaServicio:', error);
        this.openSnackBar('La ofertaServicio no se pudo eliminar', 'Cerrar');
      }
    });
  }
}

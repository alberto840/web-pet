import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TransaccionModel } from '../../models/producto.model';
import { TransaccionService } from '../../services/transaccion.service';
import { AddTransaccion, DeleteTransaccion, GetTransaccion, UpdateTransaccion } from './transaccion.action';
import { UtilsService } from '../../utils/utils.service';

export interface TransactionHistoryStateModel {
  transactions: TransaccionModel[]; // Lista de transacciones
  loading: boolean; // Indica si se está cargando
  error: string | null; // Mensaje de error
}

@State<TransactionHistoryStateModel>({
  name: 'transactionHistory',
  defaults: {
    transactions: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class TransactionHistoryState {
  constructor(private transactionService: TransaccionService, private utilService: UtilsService) {}

  @Selector()
  static getTransactions(state: TransactionHistoryStateModel) {
    return state.transactions;
  }

  @Selector()
  static isLoading(state: TransactionHistoryStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: TransactionHistoryStateModel) {
    return state.error;
  }

  @Action(GetTransaccion)
  getTransactions({ patchState }: StateContext<TransactionHistoryStateModel>) {
    patchState({ loading: true, error: null });

    return this.transactionService.getAllTransaccions().pipe(
      tap((response) => {
        patchState({ transactions: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load transactions: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddTransaccion)
  addTransaction({ getState, patchState }: StateContext<TransactionHistoryStateModel>, { payload }: AddTransaccion) {
    patchState({ loading: true, error: null });

    return this.transactionService.addTransaccion(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          transactions: [...state.transactions, response.data],
        });
        this.utilService.getServiceById(payload.userId).subscribe((user) => {
          this.utilService.getUserById(payload.userId).subscribe((user) => {
            this.utilService.enviarNotificacion('Registraste el ticket correctamente, PetWise se comunicará con usted.', 'Ticket registrado', (user.userId ?? 0));
          });
        });
        this.utilService.registrarActividad('Transacciones', 'Agregó un nuevo item a Transacciones id:'+response.data.transactionHistoryId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add transaction: ${error.message}` });
        this.utilService.registrarActividad('Transacciones', 'No pudo agregar un nuevo item a Transacciones');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateTransaccion)
  updateTransaction({ getState, setState, patchState }: StateContext<TransactionHistoryStateModel>, { payload }: UpdateTransaccion) {
    patchState({ loading: true, error: null });

    return this.transactionService.updateTransaccion(payload).pipe(
      tap((response) => {
        const state = getState();
        const transactions = [...state.transactions];
        const index = transactions.findIndex((transaction) => transaction.transactionHistoryId === payload.transactionHistoryId);
        transactions[index] = response.data;
        setState({
          ...state,
          transactions,
        });
        this.utilService.getServiceById(payload.reservationId).subscribe((servicio) => {
          this.utilService.getProviderById(servicio.providerId).subscribe((provider) => {
            this.utilService.getUserById(provider.userId).subscribe((user) => {
              this.utilService.enviarNotificacion('Una transaccion para '+servicio.serviceName+'fue actualizada, revisa tus transacciones.', 'Transaccion actualizada', (user.userId ?? 0));
            });
          });
        });
        this.utilService.registrarActividad('Transacciones', 'Actualizó un item de Transacciones id:'+response.data.transactionHistoryId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update transaction: ${error.message}` });
        this.utilService.registrarActividad('Transacciones', 'No pudo actualizar un item de Transacciones id:'+payload.transactionHistoryId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteTransaccion)
  deleteTransaction({ getState, setState, patchState }: StateContext<TransactionHistoryStateModel>, { id }: DeleteTransaccion) {
    patchState({ loading: true, error: null });

    return this.transactionService.deleteTransaccion(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.transactions.filter((transaction) => transaction.transactionHistoryId !== id);
        setState({
          ...state,
          transactions: filteredArray,
        });
        this.utilService.registrarActividad('Transacciones', 'Eliminó un item de Transacciones id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete transaction: ${error.message}` });
        this.utilService.registrarActividad('Transacciones', 'No pudo eliminar un item de Transacciones id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TransaccionModel } from '../../models/producto.model';
import { TransaccionService } from '../../services/transaccion.service';
import { AddTransaccion, DeleteTransaccion, GetTransaccion, UpdateTransaccion } from './transaccion.action';

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
  constructor(private transactionService: TransaccionService) {}

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
      }),
      catchError((error) => {
        patchState({ error: `Failed to add transaction: ${error.message}` });
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
      }),
      catchError((error) => {
        patchState({ error: `Failed to update transaction: ${error.message}` });
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
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete transaction: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
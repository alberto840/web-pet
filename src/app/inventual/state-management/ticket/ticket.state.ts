import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TicketModel } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { AddTicket, DeleteTicket, GetTicket, UpdateTicket } from './ticket.action';
import { UtilsService } from '../../utils/utils.service';

export interface SupportTicketStateModel {
  supportTickets: TicketModel[];
  loading: boolean;
  error: string | null;
}

@State<SupportTicketStateModel>({
  name: 'supportTickets',
  defaults: {
    supportTickets: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class SupportTicketState {
  constructor(private supportTicketService: TicketService, private utilService: UtilsService) {}

  @Selector()
  static getSupportTickets(state: SupportTicketStateModel) {
    return state.supportTickets;
  }

  @Selector()
  static isLoading(state: SupportTicketStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: SupportTicketStateModel) {
    return state.error;
  }

  @Action(GetTicket)
  getSupportTickets({ patchState }: StateContext<SupportTicketStateModel>) {
    patchState({ loading: true, error: null });

    return this.supportTicketService.getAllTickets().pipe(
      tap((response) => {
        patchState({ supportTickets: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load support tickets: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddTicket)
  addSupportTicket({ getState, patchState }: StateContext<SupportTicketStateModel>, { payload }: AddTicket) {
    patchState({ loading: true, error: null });

    return this.supportTicketService.addTicket(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          supportTickets: [...state.supportTickets, response.data],
        });
        this.utilService.getUserById(payload.userId).subscribe((user) => {
          this.utilService.enviarNotificacion('Registraste el ticket correctamente, PetWise revisará el caso y se comunicará con usted.', 'Ticket registrado', (user.userId ?? 0));
        });
        this.utilService.registrarActividad('Ticket', 'Agregó un nuevo item a Ticket id:'+response.data.supportTicketsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add support ticket: ${error.message}` });
        this.utilService.registrarActividad('Ticket', 'No pudo agregar un nuevo item a Ticket');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateTicket)
  updateSupportTicket({ getState, setState, patchState }: StateContext<SupportTicketStateModel>, { payload }: UpdateTicket) {
    patchState({ loading: true, error: null });

    return this.supportTicketService.updateTicket(payload).pipe(
      tap((response) => {
        const state = getState();
        const supportTickets = [...state.supportTickets];
        const index = supportTickets.findIndex((ticket) => ticket.supportTicketsId === payload.supportTicketsId);
        supportTickets[index] = response.data;
        setState({
          ...state,
          supportTickets,
        });
        this.utilService.registrarActividad('Ticket', 'Actualizó un item de Ticket id:'+response.data.supportTicketsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update support ticket: ${error.message}` });
        this.utilService.registrarActividad('Ticket', 'No pudo actualizar un item de Ticket id:'+payload.supportTicketsId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteTicket)
  deleteSupportTicket({ getState, setState, patchState }: StateContext<SupportTicketStateModel>, { id }: DeleteTicket) {
    patchState({ loading: true, error: null });

    return this.supportTicketService.deleteTicket(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.supportTickets.filter((ticket) => ticket.supportTicketsId !== id);
        setState({
          ...state,
          supportTickets: filteredArray,
        });
        this.utilService.registrarActividad('Ticket', 'Eliminó un item de Ticket id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete support ticket: ${error.message}` });
        this.utilService.registrarActividad('Ticket', 'No pudo eliminar un item de Ticket id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketModel } from '../../models/ticket.model';
import { AddTicket, DeleteTicket, GetTicket, UpdateTicket } from '../../state-management/ticket/ticket.action';
import { SupportTicketState } from '../../state-management/ticket/ticket.state';

@Component({
  selector: 'app-gestion-tickets',
  templateUrl: './gestion-tickets.component.html',
  styleUrls: ['./gestion-tickets.component.scss']
})
export class GestionTicketsComponent implements AfterViewInit, OnInit {
  ticket: TicketModel = {
    supportTicketsId: 0,
    subject: '',
    description: '',
    status: false,
    userId: 0
  };

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

  actualizarTicket(ticket: TicketModel) {
    this.store.dispatch(new UpdateTicket(ticket));
  }

  tickets$: Observable<TicketModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'supportTicketsId', 'subject', 'description', 'status', 'updatedAt', 'createdAt', 'userId','action'];
  dataSource: MatTableDataSource<TicketModel> = new MatTableDataSource();
  selection = new SelectionModel<TicketModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.tickets$ = this.store.select(SupportTicketState.getSupportTickets);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: TicketModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.supportTicketsId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
  }

  generarCSV() {    
    const seleccionados = this.selection.selected;
  }

  ngOnInit(): void {
    // Despacha la acción para obtener los tickets
    this.store.dispatch(new GetTicket());

    // Suscríbete al observable para actualizar el dataSource
    this.tickets$.subscribe((tickets) => {
      this.dataSource.data = tickets;
    });
  }
}
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { TicketModel, TicketModelString } from '../../models/ticket.model';
import { AddTicket, DeleteTicket, GetTicket, UpdateTicket } from '../../state-management/ticket/ticket.action';
import { SupportTicketState } from '../../state-management/ticket/ticket.state';
import { UsuarioModel } from '../../models/usuario.model';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { format } from 'date-fns';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-gestion-tickets',
  templateUrl: './gestion-tickets.component.html',
  styleUrls: ['./gestion-tickets.component.scss']
})
export class GestionTicketsComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(SupportTicketState.isLoading);
  isLoadinguser$: Observable<boolean> = inject(Store).select(UsuarioState.isLoading);
  ticket: TicketModel = {
    supportTicketsId: 0,
    subject: '',
    description: '',
    status: '',
    userId: 0
  };

  actualizarTicket(ticket: TicketModel) {
    this.store.dispatch(new UpdateTicket(ticket));
  }

  tickets$: Observable<TicketModel[]>;
  usuarios$: Observable<UsuarioModel[]>;

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
  displayedColumns: string[] = ['select', 'supportTicketsId', 'subject', 'description', 'status', 'updatedAt', 'createdAt', 'userId', 'action'];
  dataSource: MatTableDataSource<TicketModelString> = new MatTableDataSource();
  selection = new SelectionModel<TicketModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.tickets$ = this.store.select(SupportTicketState.getSupportTickets);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
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

  checkboxLabel(row?: TicketModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.supportTicketsId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Ticket Id',
      'Tema',
      'Descripcion',
      'Estado',
      'Creado',
      'Actualizado',
      'Usuario',
    ];

    const fields: (keyof TicketModelString)[] = [
      'supportTicketsId',
      'subject',
      'description',
      'status',
      'createdAt',
      'updatedAt',
      'userIdstring',
    ];
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Tickets.pdf',
      fields,
      'Informe de Tickets generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    //this.csv.ticketsCSV(seleccionados);
    const headers = [
      'Ticket Id',
      'Tema',
      'Descripcion',
      'Estado',
      'Creado',
      'Actualizado',
      'Usuario',
    ];

    const fields: (keyof TicketModelString)[] = [
      'supportTicketsId',
      'subject',
      'description',
      'status',
      'createdAt',
      'updatedAt',
      'userIdstring',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Tickets.csv', fields);
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los tickets
    this.store.dispatch([new GetTicket(), new GetUsuario()]);

    (await this.transformarDatosTicketString()).subscribe((usuario) => {
      this.dataSource.data = usuario; // Asigna los datos al dataSource
    });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  usuarios: UsuarioModel[] = [];
  getUserName(id: number): string {
    if (!this.usuarios.length) {
      this.store.dispatch([new GetTicket(), new GetUsuario()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosTicketString() {
    const listaActual$: Observable<TicketModel[]> = this.tickets$;
    const listaModificada$: Observable<TicketModelString[]> = listaActual$.pipe(
      map((objetos: TicketModel[]) =>
        objetos.map((objeto: TicketModel) => ({
          supportTicketsId: objeto.supportTicketsId,
          subject: objeto.subject,
          description: objeto.description,
          status: objeto.status,
          createdAt: objeto.createdAt,
          updatedAt: objeto.updatedAt,
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : '',
          updatedAtstring: objeto.updatedAt ? format(new Date(objeto.updatedAt), 'dd/MM/yyyy HH:mm:ss') : '',
          userId: objeto.userId,
          userIdstring: this.getUserName(objeto.userId), // Método para obtener el nombre del usuario
        }))
      )
    );
    return listaModificada$;
  }
}
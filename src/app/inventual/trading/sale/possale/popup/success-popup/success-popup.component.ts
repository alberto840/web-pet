import { Component, ViewEncapsulation } from '@angular/core';
import { InvoiceComponent } from '../../../popup/invoice/invoice.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SuccessPopupComponent {
  constructor(public dialog: MatDialog) {}
  invoice() {
    this.dialog.open(InvoiceComponent);
  }
}
